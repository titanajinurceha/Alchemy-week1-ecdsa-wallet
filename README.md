# 🔐 ECDSA Wallet Web App

A client–server web application demonstrating secure fund transfers using **Elliptic Curve Digital Signatures (ECDSA)**.  
Originally based on the [Alchemy University](https://university.alchemy.com/) ECDSA course — this version has been enhanced with better structure, additional explanations, and key generation examples.

---

## 🚀 Features

- Generate new private–public key pairs  
- Create and sign transactions on the client side  
- Verify signatures securely on the server  
- Prevent unauthorized transactions  
- Real-time balance updates  

---

## ⚙️ Getting Started

### 1️⃣ Client Setup
```bash
cd client
npm install
npm run dev
Runs on: http://localhost:5173
```

### 2️⃣ Server Setup
```bash
Copy code
cd server
npm install
npm run start
```
Server runs by default on port 3042.

> 💡 You can also use npm i -g nodemon then nodemon index to restart automatically on file changes.

## 🧩 Key Functionalities
### 🔑 Generate Private & Public Keys
> [!TIP] 
> Initial Address:
> Account 1:
> Private Key: 2ad56c543b04daaa67924da294195941f5fc74e1fc14ee1427e9cbd4c2b8fbde
> Address: 0x51099dd07d6fc0b94c8d6741da7ec649b69bf513
> 
> Account 2:
> Private Key: bba77a7e9d138aa65e9f9280974c37d33ca099f2ec0b719aecec92758dc96f34
> Address: 0x4ec7c3ac1d18c168e357da033f78fec379ec5c1c
> 
> Account 3:
> Private Key: d7b1df948e16d41ff29a22961871c19b2d86261f0800ecbd5604f9040aedb9bb
> Address: 0x10134530ad55a5e0d0c8f59cd083dfc4455b16d9

You can use this Node.js script to generate a new ECDSA key pair:

```js
Copy code
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);

console.log("Private key:", toHex(privateKey));
console.log("Public key:", toHex(publicKey));
```
### ✍️ Sign a Transaction
When sending a transaction, the client:

- Hashes the message
- Signs it using the private key
- Sends both the signature and recovery bit to the server

Example:

```js
const hashMessage = (msg) => keccak256(utf8ToBytes(msg));
const [signature, recoveryBit] = await secp.sign(hashMessage(msg), privateKey, { recovered: true });
```
### ✅ Verify on the Server
The server:
- Recovers the public key from the signature
- Validates that it matches the sender’s address
- Executes the transaction only if valid

Example:

```js
const isValid = secp.verify(signature, hash, publicKey);
```
### 🔒 Security Notes
1. Private keys never leave the client side.
2. Each transaction is cryptographically signed before being sent.
3. The server verifies ownership before approving fund transfers.

## 📁 Project Structure
```bash
Copy code
ecdsa-node/
│
├── client/   # React + Vite frontend
├── server/   # Express backend
└── README.md
```
## 👨‍💻 Author
Titan Aji Nurceha
Developed as part of Alchemy University’s Web3 Developer Path.
Focused on secure digital signatures using the ethereum-cryptography library.

## 🧠 References & Original Course Documentation
This project builds upon the official Alchemy ECDSA Project.
You can view the original instructions and setup details below 👇

<details> <summary>📜 View Original Course README</summary>
## Project 1: Build a Web App using ECDSA

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incorporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

## Video Instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.youtube.com/watch?v=GU5vlKaNvmI

If you are interested in a text-based guide, please read on below. ⬇️

## Setup Instructions
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the dependencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://localhost:5173/

### Server

The server folder contains a Node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the dependencies 
3. Run `node index` to start the server

_Hint_ - > Run `npm i -g nodemon` and then run `nodemon index` instead of `node index` to automatically restart the server on any changes!

The application should connect to the default server port (3042) automatically!

## 🏁 Your Goal: Set Up a Secure ECDSA-based Web Application

Only read this section **AFTER** you've followed the **Setup Instructions** above!

This project begins with a client that is allowed to transfer any funds from any account to another account. That's not very secure. By applying digital signatures we can require that only the user with the appropriate private key can create a signature that will allow them to move funds from one account to the other. Then, the server can verify the signature to move funds from one account to another.

Your project is considered **done** when you have built the following features in a secure way (NOTE: your project is not final if it still uses private keys anywhere on the client side!):
- Incorporate public key cryptography so transfers can only be completed with a valid signature
- The person sending the transaction should have to verify that they own the private key corresponding to the address that is sending funds

> 🤔 While you're working through this project consider the security implications of your implementation decisions. What if someone intercepted a valid signature, would they be able to replay that transfer by sending it back to the server?

## Recommended Approach To Building This Project

There are many ways to approach this project. The goal is to create a client-server webapp that safely validates transaction intents, using public key cryptography, between accounts. Below is a phased approach that clearly details out a roadmap to solving this goal:

### **Phase 1**
- You have successfully git cloned this project onto your local machine
- You installed all dependencies by running `npm i` both in the `/client` and in the `/server` folders
- You have a website running on http://localhost:5173/ by running `npm run dev` in the `/client` folder
- You have a server process running by running `nodemon index` in the `/server` folder (remember to run `npm i -g nodemon` prior to this)
- A balance displays on the `Wallet Address` input box when you type in "0x1", "0x2" and "0x3"
- When you type in "0x1" (or any of the other accounts listed in the `server/index.js` file, you can also send an amount to any other account (using the right-hand column); this action withdraws whatever amount you send from the first account too. You should see these changes in real time, especially if you are using `nodemon` to run your server process
- Even if you reload the page on http://localhost:5173/, the balance changes you've previously made still remain - this is because it is your server actually keeping track of balances, not your client (ie. your front-end)

If all of these are complete, move on to **Phase 2**! ⬇️

### **Phase 2**

At this point, our app security is not very good. If we deploy this app now, anyone can access any balance and make changes. This means that Alice (or really.. anyone!) can type in "0x2" and transfer an amount, even if that account is not actually her account! We need to find a way to assign ownership of accounts. 

Let's incorporate some of the cryptography we've learned in the previous lessons to build a half-baked solution; we will use [Ethereum Cryptography library](https://www.npmjs.com/package/ethereum-cryptography/v/1.2.0).

> Please use v1.2.0 of the Ethereum Cryptography library!

Start a new terminal tab and run `npm i ethereum-cryptography@1.2.0` - this will pull down functions to cryptographically sign and verify data.

> Remember, you must run `npm i ethereum-cryptography@1.2.0` in BOTH the `/client` and the `/server` folder!

In **Phase 2**, your job is to implement private keys so that when a user interacts with your application, the ONLY way they are allowed to move funds is if they provide the **private key** of the account they want to move funds from.

The key change is to change the `balances` object in the `/server/index.js` file to use **real public keys**.

You can do this programmatically (by editting the `/server/index.js` file) or using a script with the following functions:

```js
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

console.log('private key: ', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);

console.log('public key', toHex(publicKey));
```

The script above will create a brand new random private key, and then get its equivalent public key, each time you run it.

Now you have the foundation to implement public key cryptography into your project!

To pass **Phase 2**:

- You have replaced "0x1", "0x2" and "0x3" in the `server/index.js` file with actual public keys generated by using the [Ethereum Cryptography library](https://www.npmjs.com/package/ethereum-cryptography/v/1.2.0). These public keys, in this suggested flow, were generated from a randomly generated private key assigned to the user. The method used to generate the public key was: `secp.getPublicKey(privateKey)`.

> Extra credit: Make your accounts look like Ethereum addresses! (ie. instead of the long public key hexadecimal format, use the "0x" + 20 hex characters format of Ethereum - this is a fun challenge to get right!)

- You are able to transfer funds between the addresses, via public keys/addresses of your server's users, that have been generated by inputting a private key into the webapp.
 
### **Phase 3**

Asking users to input a private key directly into your webapp is a big no-no! 🚫

The next step for YOU to accomplish is to make it so that you can send a signed transaction to the server, via your webapp; the server should the authenticate that transaction by deriving the public key associated with it. If that public key has funds, move the funds to the intended recipient. All of this should be accomplished via digital signatures alone.

Hint: In `index.js`, you will want to:
- get a signature from the client-side application
- recover the public address from the signature itself
- validate the recovered address against your server's `balances` object

To pass **Phase 3**:

- Your app is able to validate and move funds using digital signatures.

> Hint: https://github.com/paulmillr/noble-secp256k1 is a great library to leverage for this final phase!

## Sample Solution

Want to peek at a solution while you craft your own? Check [this repo](https://github.com/AlvaroLuken/exchange-secp256k1) out.
</details>

## 🧩 Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Cryptography: Ethereum-cryptography (secp256k1)
- Language: JavaScript (ES Modules)

## 🧭 Summary
This project demonstrates:
- Understanding of public–private key cryptography
- Implementation of digital signatures (ECDSA)
- Building a secure client–server architecture for fund transfers