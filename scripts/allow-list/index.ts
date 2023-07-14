import { ethers } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import data from "../_data/allow-list/1";

console.log(
  "\n[allow-list] address:",
  Object.keys(data).length,
  "\n[allow-list] amount:",
  Object.entries(data).reduce((sum, [, amount]) => sum + amount, 0),
  "\n"
);

export const checksumAllowList = Object.fromEntries(
  Object.entries(data).map(([address, amount]) => [
    ethers.utils.getAddress(address),
    amount,
  ])
);

export const getAllowListTotalAmount = (address: string) => {
  return checksumAllowList[ethers.utils.getAddress(address)] || 0;
};

export const allowListLeafNodes = Object.entries(checksumAllowList).map(
  ([address, amount]) => transform(address, amount)
);

export const allowListMerkleTree = new MerkleTree(
  allowListLeafNodes,
  keccak256,
  { sortPairs: true }
);

export const getAllowListMerkleProof = (address: string) => {
  address = ethers.utils.getAddress(address);
  const amount = checksumAllowList[address] || 0;
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
