use oasis_runtime_sdk::crypto::signature::secp256k1;
use oasis_runtime_sdk::modules::rofl::app::prelude::*;
use oasis_runtime_sdk::types::address::SignatureAddressSpec;

const MESSAGING_CONTRACT_ADDRESS: &str = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ROFL_APP_ID: &str = "rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf";

#[allow(dead_code)]
#[derive(Debug)]
struct GroupCriteria {
    chain_id: u64,
    token_address: String,
    required_amount: u64,
}

#[allow(dead_code)]
#[derive(Debug)]
struct Group {
    name: String,
    members: Vec<String>,
    criteria: GroupCriteria,
    exists: bool,
}

#[derive(Debug)]
struct PendingMembership {
    group_id: u64,
    member: String,
}

struct MessagingApp;

#[async_trait]
impl App for MessagingApp {
    const VERSION: Version = sdk::version_from_cargo!();

    fn id() -> AppId {
        ROFL_APP_ID.into()
    }

    fn consensus_trust_root() -> Option<TrustRoot> {
        None
    }

    async fn run(self: Arc<Self>, _env: Environment<Self>) {
        println!("Messaging App Started!");
    }

    async fn on_runtime_block(self: Arc<Self>, env: Environment<Self>, _round: u64) {
        // Fetch and process groups and memberships
        match self.get_all_groups(&env).await {
            Ok(groups) => println!("Current Groups: {:?}", groups),
            Err(e) => println!("Error fetching groups: {:?}", e),
        }

        match self.get_all_pending_memberships(&env).await {
            Ok(pending) => println!("Pending Memberships: {:?}", pending),
            Err(e) => println!("Error fetching pending memberships: {:?}", e),
        }

        // Process any pending memberships
        if let Err(err) = self.process_pending_memberships(&env).await {
            println!("Failed to process pending memberships: {:?}", err);
        }
    }
}

impl MessagingApp {
    async fn get_all_groups(&self, env: &Environment<Self>) -> Result<Vec<Group>> {
        let data: Vec<u8> = [
            ethabi::short_signature("getAllGroups", &[]).to_vec(),
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
                    address: Some(MESSAGING_CONTRACT_ADDRESS.parse().unwrap()),
                    value: 0.into(),
                    data,
                },
            )
            .await?;

        let group_criteria_type = ethabi::ParamType::Tuple(vec![
            ethabi::ParamType::Uint(256), // chainId
            ethabi::ParamType::Address,   // tokenAddress
            ethabi::ParamType::Uint(256), // requiredAmount
        ]);

        let group_type = ethabi::ParamType::Tuple(vec![
            ethabi::ParamType::String,                                      // name
            ethabi::ParamType::Array(Box::new(ethabi::ParamType::Address)), // members
            group_criteria_type,                                            // criteria
            ethabi::ParamType::Bool,                                        // exists
        ]);

        let decoded = ethabi::decode(&[ethabi::ParamType::Array(Box::new(group_type))], &res)
            .map_err(|e| anyhow::anyhow!("Failed to decode response: {}", e))?;

        // Convert decoded data into Group structs
        let groups = decoded[0]
            .clone()
            .into_array()
            .unwrap()
            .into_iter()
            .map(|group_token| {
                let group_tuple = group_token.into_tuple().unwrap();
                let criteria_tuple = group_tuple[2].clone().into_tuple().unwrap();

                Group {
                    name: group_tuple[0].clone().into_string().unwrap(),
                    members: group_tuple[1]
                        .clone()
                        .into_array()
                        .unwrap()
                        .into_iter()
                        .map(|addr| format!("{:?}", addr.into_address().unwrap()))
                        .collect(),
                    criteria: GroupCriteria {
                        chain_id: criteria_tuple[0].clone().into_uint().unwrap().as_u64(),
                        token_address: format!(
                            "{:?}",
                            criteria_tuple[1].clone().into_address().unwrap()
                        ),
                        required_amount: criteria_tuple[2].clone().into_uint().unwrap().as_u64(),
                    },
                    exists: group_tuple[3].clone().into_bool().unwrap(),
                }
            })
            .collect();

        Ok(groups)
    }

    async fn get_all_pending_memberships(
        &self,
        env: &Environment<Self>,
    ) -> Result<Vec<PendingMembership>> {
        let data: Vec<u8> = [
            ethabi::short_signature("getAllPendingMemberships", &[]).to_vec(),
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
                    address: Some(MESSAGING_CONTRACT_ADDRESS.parse().unwrap()),
                    value: 0.into(),
                    data,
                },
            )
            .await?;

        let pending_membership_type = ethabi::ParamType::Tuple(vec![
            ethabi::ParamType::Uint(256), // groupId
            ethabi::ParamType::Address,   // member
        ]);

        let decoded = ethabi::decode(
            &[ethabi::ParamType::Array(Box::new(pending_membership_type))],
            &res,
        )
        .map_err(|e| anyhow::anyhow!("Failed to decode response: {}", e))?;

        // Convert decoded data into PendingMembership structs
        let pending = decoded[0]
            .clone()
            .into_array()
            .unwrap()
            .into_iter()
            .map(|membership_token| {
                let tuple = membership_token.into_tuple().unwrap();
                PendingMembership {
                    group_id: tuple[0].clone().into_uint().unwrap().as_u64(),
                    member: format!("{:?}", tuple[1].clone().into_address().unwrap()),
                }
            })
            .collect();

        Ok(pending)
    }

    async fn process_pending_memberships(&self, env: &Environment<Self>) -> Result<()> {
        let pending = self.get_all_pending_memberships(env).await?;
        let groups = self.get_all_groups(env).await?;

        for membership in pending {
            // Since we don't have group_id in the Group struct, we'll need to process all groups
            // that exist and match other criteria
            for group in groups.iter().filter(|g| g.exists) {
                println!("Group: {:?}", group);
                // Here you would implement the token balance check logic
                // For example:
                // if verify_token_balance(membership.member, group.criteria).await? {

                let mut tx = self.new_transaction(
                    "evm.Call",
                    module_evm::types::Call {
                        address: MESSAGING_CONTRACT_ADDRESS.parse().unwrap(),
                        value: 0.into(),
                        data: [
                            ethabi::short_signature(
                                "addGroupMember",
                                &[ethabi::ParamType::Uint(256), ethabi::ParamType::Address],
                            )
                            .to_vec(),
                            ethabi::encode(&[
                                ethabi::Token::Uint(membership.group_id.into()),
                                ethabi::Token::Address(membership.member.parse().unwrap()),
                            ]),
                        ]
                        .concat(),
                    },
                );
                tx.set_fee_gas(200_000);

                match env.client().sign_and_submit_tx(env.signer(), tx).await {
                    Ok(_) => println!(
                        "Successfully added member {:?} to group {}",
                        membership.member, membership.group_id
                    ),
                    Err(e) => println!("Failed to add member: {:?}", e),
                }
                // }
            }
        }

        Ok(())
    }
}

fn main() {
    MessagingApp.start();
}
