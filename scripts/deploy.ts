import { ethers } from "hardhat";
import { getTimestamp } from "./utils/contract-time";
import { allowListMerkleTree } from "./allow-list";

async function main() {
  const Contract = await ethers.getContractFactory("Moment");
  const contract = await Contract.deploy(
    // allowListMerkleRoot
    allowListMerkleTree.getRoot(),
    // allowListStartTime
    getTimestamp("2023-07-06 14:00:00"),
    // allowListEndTime
    getTimestamp("2023-07-07 13:59:59"),
    // publicStartTime
    getTimestamp("2023-07-07 14:00:00"),
    // baseURI
    "https://themoment3.ai/meta.json#"
  );
  await contract.deployed();
  // @ts-ignore
  console.log("Deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
