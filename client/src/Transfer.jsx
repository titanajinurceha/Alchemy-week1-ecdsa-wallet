import { useState } from "react";
import server from "./server.js";

function Transfer({ address, setBalance ,setAlertMsg}) {
  const [recipient, setRecipient] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [nonce, setNonce] = useState("");
  const [signature, setSignature] = useState("");
  const [recovery, setRecovery] = useState("");

  // --- Input helpers ---
  const setValue = (setter) => (evt) => setter(evt.target.value);
  const setTrimmedValue = (setter) => (evt) => setter(evt.target.value.trim());

  // --- Canonical message builder ---
  // Must match the signing script key order & types exactly
  function canonicalMessage({ sender, recipient, amount, nonce }) {
    const obj = {
      sender: String(sender),
      recipient: String(recipient),
      amount: Number(amount),
      nonce: Number(nonce),
    };
    const json = JSON.stringify(obj);
    console.log("🧩 Canonical message:", json);
    return json;
  }

  async function transfer(evt) {
    evt.preventDefault();

    // Prepare canonical object
    const msgObj = {
      sender: address,
      recipient,
      amount: parseInt(sendAmount),
      nonce: parseInt(nonce),
    };

    // Build canonical JSON message
    const message = canonicalMessage(msgObj);

    // Prepare payload for the backend
    const payload = {
      sender: address,
      recipient,
      amount: parseInt(sendAmount),
      signature: signature.trim(), // ensure no leading/trailing spaces
      recovery: parseInt(recovery),
      message,
    };

    console.log("🚀 Outgoing payload:", payload);
    console.log("🔢 Signature length:", payload.signature.length);

    try {
      const {
        data: { balance },
      } = await server.post("send", payload);
      setBalance(balance);
      setAlertMsg(`✅ Transaction successful!\nNew balance: ${balance}`);
    } catch (ex) {
      console.error("❌ Transfer error:", ex.response?.data || ex.message);
      setAlertMsg(ex.response?.data?.message || "Transfer failed!");
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      {/* Sender info */}
      <label>
        <span>Sender (auto-filled)</span>
        <input name="sender" value={address} disabled />
      </label>

      {/* Recipient */}
      <label>
        <span>Recipient Address</span>
        <input
          name="recipient"
          placeholder="e.g. 0xfc64cf7e0f12d4cc9bc52b0c2ebffc7f7f29d6c5"
          value={recipient}
          onChange={setTrimmedValue(setRecipient)}
        />
      </label>

      {/* Amount */}
      <label>
        <span>Send Amount</span>
        <input
          name="sendAmount"
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setTrimmedValue(setSendAmount)}
        />
      </label>

      {/* Nonce */}
      <label>
        <span>Nonce (from signTransaction.js)</span>
        <input
          name="nonce"
          placeholder="Paste nonce here"
          value={nonce}
          onChange={setTrimmedValue(setNonce)}
        />
      </label>

      {/* Signature */}
      <label>
        <span>Signature (compact hex, 128 chars)</span>
        <input
          name="signature"
          placeholder="Paste signature here (no 0x)"
          value={signature}
          onChange={setTrimmedValue(setSignature)}
        />
      </label>

      {/* Recovery bit */}
      <label>
        <span>Recovery Bit (0 or 1)</span>
        <input
          name="recovery"
          placeholder="0 or 1"
          value={recovery}
          onChange={setTrimmedValue(setRecovery)}
        />
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
