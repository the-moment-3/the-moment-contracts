import { getContractWithSigner } from "./utils/get-contract-with-signer";
import data from "./_data/airdrop/1";

const userList = Object.keys(data);
const amountList = Object.values(data);

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
