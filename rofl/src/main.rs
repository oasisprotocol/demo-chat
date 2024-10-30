use oasis_runtime_sdk::crypto::signature::secp256k1;
use oasis_runtime_sdk::modules::rofl::app::prelude::*;
use oasis_runtime_sdk::types::address::SignatureAddressSpec;

const ORACLE_CONTRACT_ADDRESS: &str = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ROFL_APP_ID: &str = "rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf";

struct OracleApp;

#[async_trait]
impl App for OracleApp {
    const VERSION: Version = sdk::version_from_cargo!();

    fn id() -> AppId {
        ROFL_APP_ID.into()
    }

    fn consensus_trust_root() -> Option<TrustRoot> {
        None
    }

    async fn run(self: Arc<Self>, _env: Environment<Self>) {
        println!("Hello World!");
    }

    async fn on_runtime_block(self: Arc<Self>, env: Environment<Self>, _round: u64) {
        // This gets called for each runtime block. It will not be called again until the previous
        // invocation returns and if invocation takes multiple blocks to run, those blocks will be
        // skipped.
        if let Err(err) = self.run_oracle(env).await {
            println!("Failed to submit observation: {:?}", err);
        }
    }
}

impl OracleApp {
    async fn run_oracle(self: Arc<Self>, env: Environment<Self>) -> Result<()> {
        let observation = tokio::task::spawn_blocking(move || -> Result<_> {
            let rsp: serde_json::Value = rofl_utils::https::agent()
                .get("https://www.binance.com/api/v3/ticker/price?symbol=ROSEUSDT")
                .call()?
                .body_mut()
                .read_json()?;

            let price = rsp
                .pointer("/price")
                .ok_or(anyhow::anyhow!("price not available"))?
                .as_str()
                .unwrap()
                .parse::<f64>()?;
            let price = (price * 1_000_000.0) as u128;

            Ok(price)
        })
        .await??;

        let mut tx = self.new_transaction(
            "evm.Call",
            module_evm::types::Call {
                address: ORACLE_CONTRACT_ADDRESS.parse().unwrap(),
                value: 0.into(),
                data: [
                    ethabi::short_signature("submitObservation", &[ethabi::ParamType::Uint(128)])
                        .to_vec(),
                    ethabi::encode(&[ethabi::Token::Uint(observation.into())]),
                ]
                .concat(),
            },
        );
        tx.set_fee_gas(200_000);

        env.client().sign_and_submit_tx(env.signer(), tx).await?;

        match self.get_last_observation(env).await {
            Ok((value, block)) => {
                let price = value as f64 / 1_000_000.0;
                println!(
                    "Last observation: ${:.6} ROSE/USDT at block {}",
                    price, block
                );
            }
            Err(err) => println!("Failed to get last observation: {:?}", err),
        }

        Ok(())
    }

    async fn get_last_observation(self: Arc<Self>, env: Environment<Self>) -> Result<(u128, u64)> {
        let data: Vec<u8> = [
            ethabi::short_signature("getLastObservation", &[]).to_vec(),
            ethabi::encode(&[]),
        ]
        .concat();

        let sdk_pub_key =
            secp256k1::PublicKey::from_bytes(env.signer().public_key().as_bytes()).unwrap();

        let caller = module_evm::derive_caller::from_sigspec(&SignatureAddressSpec::Secp256k1Eth(
            sdk_pub_key,
        ))
        .unwrap();

        let res: Vec<u8> = env
            .client()
            .query(
                env.client().latest_round().await?.into(),
                "evm.SimulateCall",
                module_evm::types::SimulateCallQuery {
                    gas_price: 10_000.into(),
                    gas_limit: 100_000,
                    caller,
                    address: Some(ORACLE_CONTRACT_ADDRESS.parse().unwrap()),
                    value: 0.into(),
                    data,
                },
            )
            .await?;

        let decoded = ethabi::decode(
            &[
                ethabi::ParamType::Uint(128), // _value
                ethabi::ParamType::Uint(256), // _block
            ],
            &res,
        )
        .map_err(|e| anyhow::anyhow!("Failed to decode response: {}", e))?;

        let value = decoded[0].clone().into_uint().unwrap().as_u128();
        let block = decoded[1].clone().into_uint().unwrap().as_u64();

        Ok((value, block))
    }
}

fn main() {
    OracleApp.start();
}
