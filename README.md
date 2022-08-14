
## Dependencies
* react-router-dom@6 (for routing between pages in the app)
* ipfs-http-client@56.0.1
* npm i @openzeppelin/contracts@4.5.0 library


18/July

* Install dependencies
* Launch the starter pack (react server) with 'npm run start' (opens basic html index page)
* Create Smart Contract (mkdir contracts/NFT.sol)
* NOTE: import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol" requires you to open the project in Root folder
* Deploy the NFT contract on local blockchain 'npx hardhat run src/backend/scripts/deploy.js --network localhost'
* Created NFT Transfer contract (Marketplace)
* Deployed and tested on the blockchain (hardhat as above)

** NOTE: Failed to run tests/deployments because hardhat wasn't running. Resolved by running 'npm hardhat node' in the terminal and then running the deployment command in a new terminal. Node also needs to be running. 

image.png

* Created testing scripts for smart contract testing (hardhat framework lets us write tests for these)
* Tested contracts using 'npx hardhat test' - Passed!!

image.png

* Contracts Test 2 failing on 'npx hardhat test' (TypeError: nft.tokenCount is not a function)
* TokenCount() function is not listed in the contract (this may be due to an update so removing that reuqirement in the test)


21/07/22 - update deploy contracts

* Testing Deployment, Minting and CreateItems contract functions. Passed!
image.png

02/08/2022
* Created purchase item function
* Implemented purchase function test script - failure due to price discrepencies
** NEED TO REVIEW THIS ^ before deploying the Smart Contract to the blockchain
* After deploying the contracts to the Blockchain, meta files are stored in '/frontend/components/contractsData/' to be imported into App.js later


03/08/2022
* Front end improvements
* Connected hardhat node dev net to metamask wallet
** 1. Set up connection to the blockchain with ethers library - improvement
** 2. Load contracts form the blockchain


07/08/2022
* Connect app to wallet --> hardhat chain (import { ethers }  from "ethers")
* web4handler function to manafe metamask connections
* Create navbar component for the front end app
* Created pages for each nav component : Home, Create, MyListedItem, MyPurchases
* Build out home page and markeplace interface with marketplace Load and Buy functions*
* TESTING - Connecting to Metamask failing -- need to debug
* Happy with front end look though, massive step up in UX design (more simplified, way nicer to view)

08/08/2022
* Connect Wallet functionality fixed. Typo in the code calling the wrong function (rookie mistake)
* Built out the Create page with a data upload form for NFT metadata
    * tested using a simple image for upload
    * Getting caught on the makeItem() function in the marketplace contract
    * Everything else works well so far


10/08/2022
* Parked front end and NFT/Blockchain application to build out the IoT system
* Components used are ADXL345 accelerometer and Raspberry Pi 4
* Libraries and dependencies;
    * WiringPi
    * npm i ws (node.js websocket package) (not working )
* GOAL: 
* GUI-Connect opens a socket connection (listening***)
* RPi opens a client connection and connects to the listening port
* RPi gathers and sends accelerometer data as payload to the server - displays the data for the user
* The user proceeds to upload the data with an image to IPFS to mint the NFT

11/08/2022
* Install express, cors nodemon and socket.io libraries
* Implemented socket.io client (App.js) and backend server (Receiver - index.js)
* The server will listen for incoming messages (connections) and take in the message/object
* It will then render the received data to useState variables on the front end
* Working with simple "Hello Messages" - need to pass objects now

13/08/2022
* Implement iotclient on the Raspberry pi
    * The IoT client is a socket.io client that interfaces the adxl345 on the backend and passes data over http to the webservice (NFT Application)
* Libraries and dependencies
    * pip3 install "python-socketio[client]"
    * pip3 install "python-socketio[asyncio_client]"
* Successfull implementation of client/server system between the RPi and Application backend server
* The RPi sends a basic payload to the server and waits for a received event


14/08/2022
* Ineterface ADXL345 to RPi4 and begin collecting data
* Using SMBus and I2C protocol 
* Pin setup  
    * Pin1 3.3v -to-  ADXL345 Vcc
    * Pin3 I2C SDA -to- ADXL345 SDA
    * Pin5 I2C SCL -to- ADXL345 SCL
    * Pin6 GND -to- ADXL345 GND