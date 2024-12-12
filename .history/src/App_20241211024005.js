import React, { useState, useEffect } from "react";
import Web3 from "web3";
import UserAuthentication from "./UserAuthentication.json"; // Replace with your contract ABI JSON file

const App = () => {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [hashedPassword, setHashedPassword] = useState("");
  const [salt, setSalt] = useState("");
  const [rsaPublicKey, setRsaPublicKey] = useState("");
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

        const contractAddress = "YOUR_CONTRACT_ADDRESS_HERE";
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
      if (contract) {
        await contract.methods
          .registerUser(hashedPassword, salt, rsaPublicKey)
          .send({ from: account });
        alert("User registered successfully!");
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
          placeholder="Hashed Password"
          value={hashedPassword}
          onChange={(e) => setHashedPassword(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Salt"
          value={salt}
          onChange={(e) => setSalt(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="RSA Public Key"
          value={rsaPublicKey}
          onChange={(e) => setRsaPublicKey(e.target.value)}
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
          <p>RSA Public Key: {userData[2]}</p>
        </div>
      )}
    </div>
  );
};

export default App;
