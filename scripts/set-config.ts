import { getTimestamp } from "./utils/contract-time";
import { getContractWithSigner } from "./utils/get-contract-with-signer";
import { allowListMerkleTree } from "./allow-list";

async function main() {
  const contract = await getContractWithSigner();
  const tx = await contract.setConfig(
    // perAddressMaxMintAmount
    1,
    // allowListMerkleRoot
    allowListMerkleTree.getRoot(),
    // allowListStartTime
    getTimestamp("2023-07-13 14:00:00"),
    // allowListEndTime
    getTimestamp("2023-07-14 13:59:59"),
    // publicStartTime
    getTimestamp("2023-07-14 14:00:00"),
    // baseURI
    "https://themoment3.ai/meta.json#"
  );
  const receipt = await tx.wait();
  console.log("setConfig tx:", tx);
  console.log("setConfig receipt:", receipt);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
