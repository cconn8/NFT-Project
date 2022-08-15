
import logo from './logo.png';
import './App.css';
import Navigation from './Navbar';
import Home from './Home'
import Create from './Create'
import io from 'socket.io-client'   

// import MyListedItem from './MyListedItem'
// import MyPurchases from './MyPurchases'

import { useState } from 'react'   //allows us to store data on front end (like a mini database) with this USE state hook
import { useEffect } from 'react';
import { ethers }  from "ethers"  //allows to talk to ethereum nodes. Connects to metamask
// import { loadFixture } from 'ethereum-waffle';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MarketplaceAbi from '../contractsData/Marketplace.json'
import MarketplaceAddress from '../contractsData/Marketplace-address.json'
import NFTAbi from '../contractsData/NFT.json'
import NFTAddress from '../contractsData/NFT-address.json'
import { Spinner } from 'react-bootstrap';

const socket = io.connect('http://localhost:3001')  //connect to our backend server running on 3001

function App() {

  var fileCount = 1
  /* Use State hooks allow us to store data on the front end
    - like mini databases - Store each contract into the state of the blockchain
    - first argument is the state variable name, second is the function name that assigns its value */
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null)
  const [nft, setNFT] = useState(null)
  const [marketplace, setMarketplace] = useState(null)
  const [connect, setConnect] = useState(true)
  const [file, setFile] = useState()

  // const socket = io.connect('http://localhost:3001')  //connect to our backend server running on 3001

  const connectToServer = (socket) => {
    socket = io.connect('http://localhost:3001')  //connect to our backend server running on 3001
    setConnect(true)
  }

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

  //when the const socket variable is declared, if a connection to the server is established
  //it will emit this event to the server
  socket.on('connect', () => {
    socket.emit("connect_event", {message:"Hi I am App.js frontend"})
  })

  // const sendMessage = () => {
  //   socket.emit("send_message",  {message})
  // }

  //listed for file_received events from the server
  //when the RPi sends a file and is received by the server, the server will broadcasst this to the front end
  useEffect(() => {
    
    socket.on('file_received', (data) => {  

      console.log('file received on the frontend, rendering state with setFile()...')
      alert('file received on the frontend!!!')
      socket.emit('received_on_front', {message:"File was rendered on the front end!"})
      
      setFile(file)
    })
  })

  //listens for events
  useEffect(() => {
    socket.on('receive_message', (data) => {
      console.log(data.message)
    })
  }, [socket])

  // replaced by (connection_received) call back function on connect emit()
  useEffect(() => {
    socket.on('received_event', (data) => {
      console.log(data)
      alert(data.message)
      setConnect(true)
    }, [socket])
  })

// removed sendMessage={sendMessage}  from nav arguments temporarily
  return (
    <BrowserRouter>  
      <div className="App">
        <Navigation web3Handler={web3Handler} account={account} connectToServer={socket}/>

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
            <Create marketplace={marketplace} nft={nft} file={file}/> 
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
