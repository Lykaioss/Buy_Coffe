import React, { useState } from "react";
import { ethers, BrowserProvider, parseEther } from "ethers";  // Updated imports for ethers v6.x
import abi from './BuyMeACoffee.json';  // ABI of the contract

function App() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [message, setMessage] = useState("");
  const [contractAddress, setContractAddress] = useState("");  // State to store contract address input
  const [loading, setLoading] = useState(false);  // State to track loading
  const [transactionHash, setTransactionHash] = useState("");  // To store transaction hash for confirmation

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;

      if (ethereum && contractAddress) {
        setLoading(true);  // Show spinner while waiting
        const provider = new BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        const buyMeACoffee = new ethers.Contract(contractAddress, abi.abi, signer);
        console.log('hello')

        const tx = await buyMeACoffee.buyCoffee(message, { value: parseEther("0.001") });
        await tx.wait();
        setTransactionHash(tx.hash);  // Store transaction hash after confirmation
        console.log("Coffee bought!", tx.hash);
      } else {
        alert("Please enter a valid contract address.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);  // Stop spinner after transaction completes
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Buy Me A Coffee</h1>

      {currentAccount ? (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <input
            type="text"
            placeholder="Enter Contract Address"
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setContractAddress(e.target.value)}  // Store contract address from user input
          />
          <input
            type="text"
            placeholder="Leave a message"
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            onClick={buyCoffee}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition duration-300"
            disabled={loading}  // Disable button while loading
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                  ></path>
                </svg>
                Processing...
              </div>
            ) : (
              "Buy Coffee for 0.001 ETH"
            )}
          </button>

          {transactionHash && (
            <div className="mt-4 text-green-500">
              Transaction Confirmed! <br />
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View on Etherscan
              </a>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-500 transition duration-300"
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
}

export default App;
