import "./App.css";
import { Button } from "react-bootstrap";
import useMetaMask from "./hooks/metamask";
import Web3 from "web3";
import { useState } from "react";

const ethereum = window.ethereum;

const tokenAddress = "0xc282936d12db8177c682a475cd041e70b0ba8718";
const tokenSymbol = "MILL";
const tokenDecimals = 18;
const tokenImage = "https://gcdnb.pbrd.co/images/rQ79IK8Yuknk.jpg?o=10";

const web3 = new Web3(window.ethereum);

const ABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    type: "function",
  },
];

function App() {
  const { connect, disconnect, isActive, account, shouldDisable } =
    useMetaMask();

  const [indiceVisible1, setIndiceVisible1] = useState(false);
  const [indiceVisible2, setIndiceVisible2] = useState(false);

  console.log("web3: ", web3);

  const reset = () => {
    setIndiceVisible1(false);
    setIndiceVisible2(false);
  };

  const addToken = async () => {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
      const wasAdded = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20", // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });

      if (wasAdded) {
        console.log("Thanks for your interest!");
      } else {
        console.log("Your loss!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const sign1 = async () => {
    try {
      const msg = "An amazing message, for use with MetaMask!";

      const result = await ethereum.request({
        method: "personal_sign",
        params: [msg, account],
      });

      console.log("result: ", result);
      setIndiceVisible1(true);
    } catch (err) {
      console.log("err : ", err);
    }
  };

  const sign2 = async () => {
    try {
      const msg = "An amazing message, for use with MetaMask!";

      const result = await ethereum.request({
        method: "personal_sign",
        params: [msg, account],
      });

      console.log("result: ", result);
      setIndiceVisible2(true);
    } catch (err) {
      console.log("err : ", err);
    }
  };

  const getBalance = async () => {
    try {
      const account = await web3.eth.getAccounts();

      console.log("account : ", account);

      const balance = await web3.eth.getBalance(account[0]);

      console.log("balance: ", balance);
    } catch (err) {
      console.log("err : ", err);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ fontSize: "60px" }}>WALLET</h1>

        <br />

        <p>Pour cette mission tu vas avoir besoin d'argent.</p>

        <p>Nous t'en avons envoyé.</p>

        <p>Connecte toi.</p>

        <p>(Choisi bien la blockchain de ton 1er "x100")</p>

        <Button variant="secondary" onClick={connect} disabled={shouldDisable}>
          <img
            src="images/metamask.svg"
            alt="MetaMask"
            width="50"
            height="50"
          />{" "}
          Clique ici pour te connecter.
        </Button>

        <br />

        {isActive ? (
          <>
            <p>Effectue maintenant les etapes suivantes</p>
            <br />
            <Button variant="primary" onClick={addToken}>
              1. Découvre et ajoute la devise à utiliser
            </Button>
            <br />
            <Button variant="primary" onClick={sign1}>
              2. Découvre ton 1er indice
            </Button>
            <br />
            {indiceVisible1 ? (
              <>
                <p>indiceVisible1</p>
                <br />
              </>
            ) : null}

            <Button variant="primary" onClick={sign2}>
              3. Découvre ton 2er indice
            </Button>

            <br />

            {indiceVisible2 ? (
              <>
                <p>indiceVisible2</p>
                <br />
              </>
            ) : null}
            <Button variant="danger" onClick={reset}>
              Recommencer
            </Button>
            <br />
            <Button variant="danger" onClick={disconnect}>
              Se déconnecter
              <img
                src="images/noun_waving_3666509.svg"
                width="40"
                height="40"
              />
            </Button>
          </>
        ) : null}
      </header>
    </div>
  );
}

export default App;
