import { ethers } from "hardhat";
import { getTimestamp } from "./utils/contract-time";
import { getContractWithSigner } from "./utils/get-contract-with-signer";
import { allowListMerkleTree, allowListUpperCase } from "./allow-list";

console.log(
  "allow list address mount:",
  Object.keys(allowListUpperCase).length
);

async function main() {
  const contract = await getContractWithSigner();
  const tx = await contract.setConfig(
    // perAddressMaxMintAmount
    5,
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
  const receipt = await tx.wait();
  console.log("setConfig tx:", tx);
  console.log("setConfig receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
