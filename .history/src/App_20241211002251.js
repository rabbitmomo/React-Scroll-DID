import React, { useState } from 'react';
import { ethers } from 'ethers';

const App = () => {
  const [hashedPassword, setHashedPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userData, setUserData] = useState({
    hashedPassword: '',
    salt: '',
    rsaPublicKey: '',
  });
  const [status, setStatus] = useState('');

  // Contract address and ABI
  const contractAddress = '0x139e16b10BA413fce30815be3E5625f785EFdCfF';
  const contractABI = [
    'function registerUser(string memory hashedPassword, string memory salt, string memory rsaPublicKey) public',
    'function getUserData(address user) public view returns (string memory, string memory, string memory)',
    'event UserRegistered(address indexed user, string hashedPassword, string salt, string rsaPublicKey)',
  ];

  // Function to connect to MetaMask and get the signer
  const getSigner = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []); // Request access to MetaMask
      const signer = provider.getSigner();
      return signer;
    } else {
      alert('Please install MetaMask to interact with the contract');
    }
  };

  // Handle registering a new user
  const registerUser = async (e) => {
    e.preventDefault();
    setStatus('Registering user...');
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Correctly invoking the function directly on the contract instance
      const tx = await contract.registerUser(hashedPassword, salt, rsaPublicKey);

      // Wait for the transaction to be mined
      await tx.wait();

      setStatus('User registered successfully!');
    } catch (err) {
      console.error('Error registering user:', err);
      setStatus('Error registering user.');
    }
  };

  // Handle getting user data
  const getUserData = async (e) => {
    e.preventDefault();
    setStatus('Fetching user data...');
    try {
      const signer = await getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
      const data = await contract.getUserData(userAddress);
      setUserData({
        hashedPassword: data[0],
        salt: data[1],
        rsaPublicKey: data[2],
      });
      setStatus('User data fetched successfully!');
    } catch (err) {
      console.error('Error fetching user data:', err);
      setStatus('Error fetching user data.');
    }
  };

  return (
    <div>
      <h1>User Authentication</h1>

      {/* Register User Form */}
      <form onSubmit={registerUser}>
        <div>
          <label>Hashed Password:</label>
          <input
            type="text"
            value={hashedPassword}
            onChange={(e) => setHashedPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Salt:</label>
          <input
            type="text"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
            required
          />
        </div>
        <div>
          <label>RSA Public Key:</label>
          <input
            type="text"
            value={rsaPublicKey}
            onChange={(e) => setRsaPublicKey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Register User</button>
      </form>

      <hr />

      {/* Get User Data Form */}
      <form onSubmit={getUserData}>
        <div>
          <label>Ethereum Address:</label>
          <input
            type="text"
            value={userAddress}
            onChange={(e) => setUserAddress(e.target.value)}
            required
          />
        </div>
        <button type="submit">Get User Data</button>
      </form>

      <hr />

      <h3>Status: {status}</h3>

      {/* Display User Data */}
      {userData.hashedPassword && (
        <div>
          <h3>User Data:</h3>
          <p><strong>Hashed Password:</strong> {userData.hashedPassword}</p>
          <p><strong>Salt:</strong> {userData.salt}</p>
          <p><strong>RSA Public Key:</strong> {userData.rsaPublicKey}</p>
        </div>
      )}
    </div>
  );
};

export default App;
