import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserAuthentication from "./UserAuthentication.json"; // Replace with your contract ABI JSON file
import forge from "node-forge"; // Use the node-forge module for RSA encryption

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [userAddress, setUserAddress] = useState("");

  // Initialize Web3 and the contract
  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const contractAddress = "0x139e16b10BA413fce30815be3E5625f785EFdCfF";
        const contractAbi = UserAuthentication.abi;
        const contractInstance = new web3.eth.Contract(contractAbi, contractAddress);
        setContract(contractInstance);
      } else {
        alert("Please install MetaMask!");
      }
    };

    initWeb3();
  }, []);

  // Register a new user
  const registerUser = async () => {
    try {
      if (contract && username && password) {
        // Generate RSA key pair
        const rsa = forge.pki.rsa;
        const keypair = rsa.generateKeyPair({ bits: 2048 });
        const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);

        // Encrypt password with the public key
        const encryptedPassword = forge.util.encode64(
          keypair.publicKey.encrypt(password, "RSA-OAEP")
        );

        // Use the username as part of the registration process
        const salt = username; // For simplicity, using username as salt

        // Interact with the smart contract
        await contract.methods
          .registerUser(encryptedPassword, salt, publicKey)
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
      if (contract) {
        const data = await contract.methods.getUserData(userAddress).call();
        setUserData(data);
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
          placeholder="Username"
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
          placeholder="User Address"
          value={userAddress}
          onChange={(e) => setUserAddress(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <button onClick={fetchUserData}>Fetch Data</button>
      </div>

      {userData && (
        <div>
          <h3>User Data:</h3>
          <p>Encrypted Password: {userData[0]}</p>
          <p>Salt: {userData[1]}</p>
          <p>RSA Public Key: {userData[2]}</p>
        </div>
      )}
    </div>
  );
};

export default App;
