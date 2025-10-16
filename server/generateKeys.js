import * as secp from "@noble/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { toHex } from "ethereum-cryptography/utils.js";

for (let i = 0; i < 3; i++) {
  // Generate a random 32-byte private key
  const secretKey = secp.utils.randomPrivateKey();

  // Get uncompressed public key (Ethereum requires uncompressed)
  const publicKey = secp.getPublicKey(secretKey, false);

  // Compute Ethereum-style address (but using sha256 not keccak256)
  const addressBytes = sha256(publicKey.slice(1)).slice(-20);
  const address = "0x" + toHex(addressBytes);

  console.log(`Account ${i + 1}:`);
  console.log(`Private Key: ${toHex(secretKey)}`);
  console.log(`Address: ${address}`);
  console.log("");
}
