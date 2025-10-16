// index.js
import express from "express";
import cors from "cors";
import * as secp from "@noble/secp256k1";
import { sha256 } from "ethereum-cryptography/sha256.js";
import { utf8ToBytes, hexToBytes, toHex } from "ethereum-cryptography/utils.js";

const app = express();
const port = 3042;

app.use(cors());
app.use(express.json());

// keep addresses lowercase in balances
const balances = {
  "0x51099dd07d6fc0b94c8d6741da7ec649b69bf513": 100,
  "0x4ec7c3ac1d18c168e357da033f78fec379ec5c1c": 50,
  "0x10134530ad55a5e0d0c8f59cd083dfc4455b16d9": 75,
};

const usedNonces = new Set();

app.get("/balance/:address", (req, res) => {
  const address = String(req.params.address || "").toLowerCase();
  res.send({ balance: balances[address] || 0 });
});

app.post("/send", async (req, res) => {
  try {
    let { sender, recipient, amount, signature, recovery, message } = req.body;

    // Basic presence checks
    if (
      !sender ||
      !recipient ||
      amount === undefined ||
      !signature ||
      message === undefined ||
      recovery === undefined
    ) {
      return res.status(400).send({
        message:
          "Missing required fields (sender, recipient, amount, signature, recovery, message).",
      });
    }

    // Normalize addresses (lowercase)
    sender = String(sender).toLowerCase();
    recipient = String(recipient).toLowerCase();

    // Validate signature format (compact r||s hex, 128 hex chars)
    if (
      typeof signature !== "string" ||
      !/^[0-9a-fA-F]{128}$/.test(signature)
    ) {
      return res.status(400).send({
        message:
          "Invalid signature format! Expect 64-byte (128 hex chars) compact signature.",
      });
    }

    // Validate amount
    amount = Number(amount);
    if (!Number.isFinite(amount) || amount <= 0 || !Number.isInteger(amount)) {
      return res
        .status(400)
        .send({ message: "Invalid amount. Must be a positive integer." });
    }

    // Parse message JSON, ensure nonce present and canonical
    let parsedMessage;
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      return res
        .status(400)
        .send({ message: "Invalid message: must be JSON string." });
    }

    if (
      parsedMessage.sender === undefined ||
      parsedMessage.recipient === undefined ||
      parsedMessage.amount === undefined ||
      parsedMessage.nonce === undefined
    ) {
      return res.status(400).send({
        message:
          "Invalid message contents: must contain sender, recipient, amount, nonce.",
      });
    }

    // Canonicalize nonce to string for replay set
    const nonceKey = String(parsedMessage.nonce);
    if (usedNonces.has(nonceKey)) {
      return res
        .status(400)
        .send({ message: "Replay attack detected: nonce already used!" });
    }

    // Hash the message using the same algorithm used by the client (sha256)
    const messageHashBytes = sha256(utf8ToBytes(message)); // Uint8Array(32)

    // Recover public key
    let pubKey;
    try {
      const sigBytes = hexToBytes(signature);
      pubKey = secp.recoverPublicKey(
        messageHashBytes,
        sigBytes,
        Number(recovery)
      ); // returns Uint8Array public key (uncompressed)
    } catch (err) {
      console.error("recoverPublicKey error:", err);
      return res.status(400).send({ message: "Signature recovery failed." });
    }

    // Derive address from recovered public key (Ethereum-like using sha256)
    // NOTE: for Ethereum-style, use keccak256 and last 20 bytes.
    const recoveredAddress = "0x" + toHex(sha256(pubKey.slice(1)).slice(-20));

    // Verify signature correctness for extra safety
    const sigBytesForVerify = hexToBytes(signature);
    const isValid = secp.verify(sigBytesForVerify, messageHashBytes, pubKey);
    if (!isValid) {
      return res.status(400).send({ message: "Invalid signature." });
    }

    //Debugging
    console.log("==== DEBUG VERIFICATION ====");
    console.log("Message:", message);
    console.log("Message hash (server):", toHex(messageHashBytes));
    console.log("Recovered public key:", toHex(pubKey));
    console.log("Recovered address:", recoveredAddress);
    console.log("Expected sender:", sender);
    console.log("============================");

    // Ensure recovered address matches sender
    if (recoveredAddress.toLowerCase() !== sender.toLowerCase()) {
      return res
        .status(400)
        .send({ message: "Recovered address does not match sender." });
    }

    // Initialize balances if missing and apply transaction
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      return res.status(400).send({ message: "Not enough funds!" });
    }

    balances[sender] -= amount;
    balances[recipient] += amount;
    usedNonces.add(nonceKey);

    console.log(`💸 ${sender} sent ${amount} to ${recipient}`);
    return res.send({ balance: balances[sender] });
  } catch (err) {
    console.error("Unexpected server error:", err);
    return res.status(500).send({ message: "Internal server error" });
  }
});

app.listen(port, () => console.log(`Server running on port ${port}!`));

function setInitialBalance(address) {
  if (!balances[address]) balances[address] = 0;
}
