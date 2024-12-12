import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function App() {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  // Contract details (replace with your contract ABI and address)
  const contractABI = [...] // Contract ABI
  const contractAddress = '0x139e16b10BA413fce30815be3E5625f785EFdCfF';

  useEffect(() => {
    // Initialize web3
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      // Request account access
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
        })
        .catch(err => {
          console.error('Error connecting MetaMask:', err);
        });

      // Load contract
      const contractInstance = new web3Instance.eth.Contract(contractABI, contractAddress);
      setContract(contractInstance);
    } else {
      alert('Please install MetaMask');
    }
  }, []);

  const registerUser = async (hashedPassword, salt, rsaPublicKey) => {
    if (contract && account) {
      try {
        const tx = await contract.methods.registerUser(hashedPassword, salt, rsaPublicKey)
          .send({ from: account });
        console.log('User registered:', tx);
      } catch (err) {
        console.error('Error registering user:', err);
      }
    }
  };

  return (
    <div>
      <h1>Welcome to User Authentication</h1>
      {account ? (
        <div>Connected Account: {account}</div>
      ) : (
        <button onClick={() => window.ethereum.request({ method: 'eth_requestAccounts' })}>
          Connect MetaMask
        </button>
      )}

      <div>
        <h2>Register User</h2>
        <input type="text" id="hashedPassword" placeholder="Hashed Password" />
        <input type="text" id="salt" placeholder="Salt" />
        <input type="text" id="rsaPublicKey" placeholder="RSA Public Key" />
        <button onClick={() => {
          const hashedPassword = document.getElementById('hashedPassword').value;
          const salt = document.getElementById('salt').value;
          const rsaPublicKey = document.getElementById('rsaPublicKey').value;
          registerUser(hashedPassword, salt, rsaPublicKey);
        }}>
          Register User
        </button>
      </div>
    </div>
  );
}

export default App;
