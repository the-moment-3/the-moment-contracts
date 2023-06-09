import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import data from "../allow-list-data/1";

export const allowListUpperCase = Object.fromEntries(
  Object.entries(data).map(([address, amount]) => [
    address.toUpperCase(),
    amount,
  ])
);

export const getAllowListTotalAmount = (address = "") => {
  return allowListUpperCase[address.toUpperCase()] || 0;
};

export const allowListLeafNodes = Object.entries(allowListUpperCase).map(
  ([address, amount]) => transform(address, amount)
);

export const allowListMerkleTree = new MerkleTree(
  allowListLeafNodes,
  keccak256,
  { sortPairs: true }
);

export const getAllowListMerkleProof = (address = "") => {
  address = address.toUpperCase();
  const amount = allowListUpperCase[address] || 0;
  return allowListMerkleTree
    .getProof(transform(address, amount))
    .map(({ data }) => data);
};

function transform(address: string, amount: number) {
  const uint256 = new Array(32);
  uint256[uint256.length - 1] = amount;
  return keccak256(
    Buffer.concat([
      Buffer.from(address.slice(2), "hex"),
      Buffer.from(":"),
      Buffer.from(uint256),
    ])
  );
}
