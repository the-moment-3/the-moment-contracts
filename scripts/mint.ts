import { devAddress } from "./constants";
import { getContractWithSigner } from "./utils/get-contract-with-signer";
import { getAllowListMerkleProof } from "./allow-list";

async function main() {
  const contract = await getContractWithSigner();
  const tx = await contract.mint(
    // amount
    1,
    // allowListTotalAmount
    1,
    // allowListMerkleProof
    getAllowListMerkleProof(devAddress)
  );
  const receipt = await tx.wait();
  console.log("mint tx:", tx);
  console.log("mint receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
