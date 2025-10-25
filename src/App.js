import React, { useEffect, useState, useCallback } from 'react';
import { ethers } from 'ethers';
import './App.css';

// Replace with your deployed contract address
const CONTRACT_ADDRESS = "0x7eB1D077b388660a551c4Fc65868B1979ddeD4FE";

// ABI from your Counter contract
const CONTRACT_ABI = [
  {
    inputs: [],
    name: "count",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "increment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getCount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

function App() {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState(null);

  // Initialize provider and contract
  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          // Use BrowserProvider instead of Web3Provider
          const tempProvider = new ethers.BrowserProvider(window.ethereum);
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          // Get signer
          const signer = await tempProvider.getSigner();
          const tempContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
          setContract(tempContract);
        } catch (error) {
          console.error("Error initializing provider or contract:", error);
          alert("Failed to connect to MetaMask. Please try again.");
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  // Fetch count from contract
  const fetchCount = useCallback(async () => {
    if (contract) {
      try {
        const currentCount = await contract.getCount();
        setCount(Number(currentCount));
      } catch (error) {
        console.error("Error fetching count:", error);
      }
    }
  }, [contract]);

  // Call increment function
  const incrementCount = useCallback(async () => {
    if (contract) {
      try {
        const tx = await contract.increment();
        await tx.wait();
        await fetchCount();
      } catch (error) {
        console.error("Error incrementing count:", error);
        alert("Transaction failed. Please try again.");
      }
    }
  }, [contract, fetchCount]);

  // Fetch count when contract is set
  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Kite AI Counter DApp</h2>
        <p>Current Count: {count}</p>
        <button onClick={incrementCount}>Increment</button>
      </header>
    </div>
  );
}

export default App;