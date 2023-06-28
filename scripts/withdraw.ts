import { getContractWithSigner } from "./utils/get-contract-with-signer";

async function main() {
  const contract = await getContractWithSigner();
  const tx = await contract.withdraw();
  const receipt = await tx.wait();
  console.log("withdraw tx:", tx);
  console.log("withdraw receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
