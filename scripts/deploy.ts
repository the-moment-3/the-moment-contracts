import { ethers } from "hardhat";
import { getTimestamp } from "./utils/contract-time";
import { allowListMerkleTree } from "./allow-list";

async function main() {
  const Moment = await ethers.getContractFactory("Moment");
  const moment = await Moment.deploy(
    // baseURI
    "https://996fubao.io/meta.json#",
    // reservedAmount
    555,
    // publicStartTime
    getTimestamp("2023-07-07 14:00:00"),
    // publicPrice
    ethers.utils.parseEther("0.088"),
    // allowListMerkleRoot
    allowListMerkleTree.getRoot(),
    // allowListStartTime
    getTimestamp("2023-07-06 14:00:00"),
    // allowListEndTime
    getTimestamp("2023-07-07 13:59:59"),
    // allowListPrice
    0
  );
  await moment.deployed();

  // @ts-ignore
  console.log("Deployed to:", moment.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
