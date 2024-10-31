import { task } from "hardhat/config"
import { bech32 } from "bech32";

task("deploy", "📰 Deploys a contract, saves the artifact and verifies it.")
  .addParam("contract", "Name of the contract to deploy.", "Messaging")
  .addOptionalVariadicPositionalParam(
    "args",
    "Constructor arguments for the contract"
  )
  .addFlag("save", "Flag to indicate whether to save the contract or not")
  .addFlag("verify", "Flag to indicate whether to verify the contract or not")
  .setAction(async (args, { ethers, network, run }) => {
    await run("compile")

    const {words} = bech32.decode('rofl1qqn9xndja7e2pnxhttktmecvwzz0yqwxsquqyxdf');
    const rawAppID = new Uint8Array(bech32.fromWords(words));

    console.log(`Deploying ${args.contract} to ${network.name}...`)

    try {
      const contract = await ethers.deployContract(args.contract, [rawAppID])
      await contract.waitForDeployment()

      console.log(
        `📰 Contract ${args.contract} deployed to ${network.name} at address: ${contract.target}`
      )
    } catch (error) {
      console.error("Deployment failed:", error)
    }
  })
