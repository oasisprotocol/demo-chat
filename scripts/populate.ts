import { task } from "hardhat/config";

task("populate", "Populates the Messaging contract with test groups")
  .addParam("contract", "Address of the deployed Messaging contract")
  .setAction(async (args, { ethers }) => {
    try {
      const messaging = await ethers.getContractAt("Messaging", args.contract);
      
      const groups = [
        {
          name: "USDC Holders",
          chainId: 1, // Ethereum mainnet
          tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 
          requiredAmount: ethers.parseUnits("0.01", 6)
        },
        // {
        //   name: "ROSE Holders",
        //   chainId: 42262, // Emerald mainnet
        //   tokenAddress: "0x0000000000000000000000000000000000000002",
        //   requiredAmount: ethers.parseEther("1000")
        // }
      ];

      console.log("Creating test groups...");

      for (const group of groups) {
        const tx = await messaging.createGroup(
          group.name,
          group.chainId,
          group.tokenAddress,
          group.requiredAmount
        );
        await tx.wait();
        console.log(`Created group: ${group.name}`);
      }

      // const [, otherAccount] = await ethers.getSigners();
      // const messagingAsOther = await ethers.getContractAt(
      //   "Messaging",
      //   args.contract,
      //   otherAccount
      // );

      // const tx = await messagingAsOther.requestToJoinGroup(1);
      // await tx.wait();
      // console.log(`Account ${otherAccount.address} requested to join group 1`);

      // console.log("Successfully populated groups and requested membership!");

    } catch (error) {
      console.error("Error populating groups:", error);
      throw error;
    }
  });
