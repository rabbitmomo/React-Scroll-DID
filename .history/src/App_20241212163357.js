import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserAuthentication from "./UserAuthentication.json"; // Replace with your contract ABI JSON file
import SHA256 from "crypto-js/sha256"; // Import SHA-256 from crypto-js

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [publicKey, setPublicKey] = useState("");

  // Initialize Web3 and the contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = "0x139e16b10BA413fce30815be3E5625f785EFdCfF"; // Replace with your contract address
        const contractAbi = UserAuthentication.abi;
        const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  // Function to generate a random salt
  const generateRandomSalt = () => {
    const array = new Uint8Array(16); // 16-byte salt
    window.crypto.getRandomValues(array);
    return Buffer.from(array).toString("hex");
  };

  // Register a new user
  const registerUser = async () => {
    try {
      if (contract && username && password) {
        const salt = generateRandomSalt();
        const hashedPassword = SHA256(salt + password).toString();

        await contract.methods
          .registerUser(hashedPassword, salt, username)
          .send({ from: account });

        alert("User registered successfully!");
      } else {
        alert("Please provide both username and password!");
      }
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      if (contract && publicKey) {
        const data = await contract.methods.getUserByPublicKey(publicKey).call();
        setUserData(data);
      } else {
        alert("Please provide a valid public key!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Authentication DApp</h1>
      <p>Connected Account: {account}</p>

      <div style={{ marginBottom: "20px" }}>
        <h2>Register User</h2>
        <input
          type="text"
          placeholder="Username (Public Key)"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={registerUser}>Register</button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h2>Get User Data</h2>
        <input
          type="text"
          placeholder="Public Key (Username)"
          value={publicKey}
          onChange={(e) => setPublicKey(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={fetchUserData}>Fetch Data</button>
      </div>

      {userData && (
        <div>
          <h3>User Data:</h3>
          <p>Hashed Password: {userData[0]}</p>
          <p>Salt: {userData[1]}</p>
          <p>Public Key: {userData[2]}</p>
        </div>
      )}
    </div>
  );
};

export default App;
