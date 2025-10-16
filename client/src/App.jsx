import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useState } from "react";
import AlertModal from "./AlertModal";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [alertMsg, setAlertMsg] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} setAlertMsg={setAlertMsg}/>
      <AlertModal message={alertMsg} onClose={() => setAlertMsg("")} />
    </div>
  );
}

export default App;
