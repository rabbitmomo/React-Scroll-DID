import React, { useState } from 'react';
import { ethers } from 'ethers';

// Replace with your deployed contract address
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

function App() {
  const [password, setPassword] = useState('');
  const [salt, setSalt] = useState('');
  const [rsaPublicKey, setRsaPublicKey] = useState('');
  const [account, setAccount] = useState('');

  const handleRegister = async () => {
    if (!password || !salt || !rsaPublicKey) {
      alert('All fields are required');
      return;
    }

    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask');
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, [
      'function registerUser(string memory, string memory, string memory) public',
      'function getUserData(address user) public view returns (string memory, string memory, string memory)',
    ], signer);

    try {
      const hashedPassword = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(password + salt));
      const transaction = await contract.registerUser(hashedPassword, salt, rsaPublicKey);
      await transaction.wait();
      alert('User registered successfully');
    } catch (error) {
      console.error(error);
      alert('Error registering user');
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert('Please install MetaMask');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);
  };

  return (
    <div className="App">
      <h1>Decentralized Login System</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect MetaMask</button>
      ) : (
        <div>
          <h3>Connected Account: {account}</h3>
          <input
            type="text"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="text"
            placeholder="Salt"
            value={salt}
            onChange={(e) => setSalt(e.target.value)}
          />
          <input
            type="text"
            placeholder="RSA Public Key"
            value={rsaPublicKey}
            onChange={(e) => setRsaPublicKey(e.target.value)}
          />
          <button onClick={handleRegister}>Register User</button>
        </div>
      )}
    </div>
  );
}

export default App;
