import { ethers } from "hardhat";
import { contractAddress } from "../constants";
import { abi } from "../../artifacts/contracts/Moment.sol/Moment.json";

console.log(`\ncontract address: ${contractAddress}\n`);

export async function getContractWithSigner() {
  // @ts-ignore
  const signers = await ethers.getSigners();
  return new ethers.Contract(contractAddress, abi, signers[0]);
}
