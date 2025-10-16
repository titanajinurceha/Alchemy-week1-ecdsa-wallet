import server from "./server";

function Wallet({ address, setAddress, balance, setBalance }) {
  async function onChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        <span>Wallet Address</span>
        <input
          name="address"
          placeholder="Type an address..."
          value={address}
          onChange={onChange}
        ></input>
      </label>

<div className="balance">
  <div className="label">Balance:</div>
  <div className="value">${balance}</div>
</div>
    </div>
  );
}

export default Wallet;