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

  // Function to generate a random salt
  const generateRandomSalt = () => {
    const array = new Uint8Array(32); // 32-byte salt
    window.crypto.getRandomValues(array); // Fills the array with random values
    return array.join(""); // Convert to string (you can use base64 encoding for better format)
  };

  // Register a new user
  const registerUser = async () => {
    try {
      if (contract && username && password) {
        // Generate a random salt
        const salt = generateRandomSalt();

        // Combine the salt and password
        const saltedPassword = salt + password;

        // Hash the password using SHA-256
        const hashedPassword = SHA256(saltedPassword).toString();

        // Interact with the smart contract to register the user
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
          <p>Hashed Password: {userData[0]}</p>
          <p>Salt: {userData[1]}</p>
        </div>
      )}
    </div>
  );
};

export default App;