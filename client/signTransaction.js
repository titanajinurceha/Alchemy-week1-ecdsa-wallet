// signTransaction.js
import * as secp from "@noble/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { utf8ToBytes, bytesToHex } from "ethereum-cryptography/utils.js";

(async () => {
  // --------- Transaction data (change with address) ----------
  const sender = "0x51099dd07d6fc0b94c8d6741da7ec649b69bf513";
  const recipient = "0x4ec7c3ac1d18c168e357da033f78fec379ec5c1c";
  const amount = 20;
  const nonce = Date.now();

  // --------- Private key (hex) ----------
  // Replace with the private key you want to sign with (Private Key from sender)
  const privateKeyHex = "2ad56c543b04daaa67924da294195941f5fc74e1fc14ee1427e9cbd4c2b8fbde";

  // --------- Build canonical message & hash ----------------
const canonicalMessage = JSON.stringify({
  sender,
  recipient,
  amount,
  nonce,
});
  const messageHash = sha256(utf8ToBytes(canonicalMessage)); // Uint8Array(32)

  // --------- Sign (request recovery bit). v1.7 returns [sigDER, recovery]
  const [sigDERBytes, recovery] = await secp.sign(messageHash, privateKeyHex, { recovered: true });

  // --------- Convert DER -> compact (r||s) 64 bytes
  // secp.Signature.fromDER() + toCompactRawBytes() exists in 1.x
  const sigObj = secp.Signature.fromDER(sigDERBytes);
  const compactSigBytes = sigObj.toCompactRawBytes(); // Uint8Array(64)
  const compactSigHex = bytesToHex(compactSigBytes); // 128 hex chars

  // --------- Optional check: verify locally
  const pubKey = secp.getPublicKey(privateKeyHex); // Uint8Array (65 uncompressed)
  const verified = secp.verify(compactSigBytes, messageHash, pubKey);

  // --------- Output to fill on the webapp ----------
  console.log("=== SIGNED TRANSACTION ===");
  console.log("Sender:    ", sender);
  console.log("Recipient: ", recipient);
  console.log("Amount:    ", amount);
  console.log("Nonce:     ", nonce);
  console.log("Signature: ", compactSigHex);
  console.log("Recovery:  ", recovery);
  console.log("-------------------------");

  // --------- Debugging ----------
  console.log("=== DEBUGGING INFORMATION ===");  
  console.log("Signature length (bytes):", compactSigBytes.length, "(expected 64)"); 
  console.log("Signature valid (local verify):", verified);
  console.log("Message hash (client):", bytesToHex(messageHash));

  // Exit cleanly
  process.exit(0);
})();
