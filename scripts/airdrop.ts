import { ethers } from "hardhat";
import { getContractWithSigner } from "./utils/get-contract-with-signer";
import data from "./_data/airdrop/pcy-300";

const userList = Object.keys(data);
const amountList = Object.values(data);

console.log("address amount:", userList.length);

// 检查地址格式
for (let i = 0; i < userList.length; i++) {
  const address = userList[i];
  try {
    userList[i] = ethers.utils.getAddress(address);
  } catch (e) {
    console.log("address:", address);
    console.log("get checksum address error:", e);
    process.exit(1);
  }
}

async function main() {
  const contract = await getContractWithSigner();
  const tx = await contract.airdropList(userList, amountList);
  const receipt = await tx.wait();
  console.log("airdrop tx:", tx);
  console.log("airdrop receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
