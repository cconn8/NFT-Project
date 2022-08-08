
import logo from './logo.png';
import './App.css';
import Navigation from './Navbar';
import Home from './Home'
import Create from './Create'
// import MyListedItem from './MyListedItem'
// import MyPurchases from './MyPurchases'

import { useState } from 'react'   //allows us to store data on front end (like a mini database) with this USE state hook
import { ethers }  from "ethers"  //allows to talk to ethereum nodes. Connects to metamask
// import { loadFixture } from 'ethereum-waffle';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { Spinner } from 'react-bootstrap';
 
function App() {
  /* Use State hooks allow us to store data on the front end
    - like mini databases - Store each contract into the state of the blockchain*/
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState(null)
  const [ marketplace, setMarketplace] = useState(null)

  //Metamask login/Connect - manage the connection to metamask interface to blockchain
  const web3Handler = async() => { 
    console.log("calling webhandler")
    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'}) //get accounts - returns all available accounts
    setAccount(accounts[0]) //takes the first account as the account of interest
    const provider = new ethers.providers.Web3Provider(window.ethereum) //get the provder
    const signer = provider.getSigner() //set signer

    console.log("loading accounts " + accounts[0])
    loadContracts(signer)
  }

  //load contracts function
  const loadContracts = async(signer) => {
    //get deployed copies of Marketplace and NFT contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer)
    setMarketplace(marketplace)

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer)
    setNFT(nft)
    setLoading(false)
  }


  return (
    <BrowserRouter>  
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} />
        {/* handles the routing between pages on the frontend */}
        {/* check if the page is loading */}
        {/* if yes, print awaiting connection */}
        { loading ? (
          <div style={ {display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Spinner animation="border" style={{ display: 'flex'}} />
            <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
          </div>
          // if false, render the page routes
        ) : (
        <Routes>
          <Route path="/" element={
            <Home marketplace={marketplace} nft={nft} /> 
          } />

          <Route path="/create" element={
            <Create marketplace={marketplace} nft={nft} /> 
          } />

          <Route path="/my-listed-items" />
          <Route path="/my-purchases"/>
        </Routes>
        )
      }
      </div>
    </BrowserRouter>
  );
}

export default App;
