# IoT / NFT application for Collecting and Creating NFTs from IoT Data

Data is collected using an ADXL345 accelerometer interfacing a RaspberryPi 4 and transmitted over a socket session using the socketio library for Python on the client side and Javascript on the server side. The server receives the data and uploads it to the Inter Planetary File System, from which a content ID (hash of the data) is returned, triggering a call to the NFT Smart Contract. The NFT smart contract subsequently mints (creates) an NFT record of the data, rendering the reference image (NFT) to the frontend GUI. The NFT application comprises a WebApp using React on the frontend and Node.js on the backend. The goal of this project was to implement a full stack IoT system with the added features of web3 integration to prove Data Ownership and Traceability.

### Credits: 
* DAPP University Open Source Blockchain Starter kit developed by Ethan-Crypto leveraged as a starting point for the project on NFT side. The code can be found here: https://github.com/dappuniversity/starter_kit_2/tree/c7557aa2518c4338f1562abe3afd03ae244d42ef

* Smart contract guidelines and templates used from Openzeppelin.com: https://docs.openzeppelin.com/contracts/3.x/erc721

* DAPP university bootcamp for blockchain development was excellent for learning the ins and outs of blockchain/NFT development. Tutorials and Bootcamps can be found here: https://www.dappuniversity.com/bootcamp


### Points to note: 
* Initial development can be seen on the Master Branch, however moved the project to main for further development after deciding to leverage the starter kit
* Source Code for the IoT component (RPi and ADXL345) can be found in the /src/backend/iotcomponent/* directory 



## Libraries, Modules & Dependencies
* Hardhat local testnet
* react-router-dom@6 (for routing between pages in the app)
* ipfs-http-client@56.0.1
* @openzeppelin/contracts@4.5.0 library
* ethers library
* react.js
* node.js
* express
* cors 
* nodemon
* socket.io


## Testing

#### Smart Contracts Testing
* A key consideration in the development of this project was the integrtiy and stability of the smart contracts. Smart contract live on the blockchain. This means that once deployed, they cannot be changed. As a result, extensive testing of transaction scenarios was carried out to ensure the rigidity of the contracts. These are described in /test/NFTMarketplace.test.js.


- Tests

Harhat framework allows for writing tests for contracts during development. The script was written using the Waffle testing framework.
The framework allows us to test scenarios using 3 key declarations; Should, Expect, Assert.
A beforeEach hook ensures the neccessary data is gathered prior to running tests!


1. NFT/Marketplace deployment
Verify that post deployment, the NFT contract will successfully track the 'Name' and 'Symbol' of an NFT collection and the Marketplace contract will successfully track the pre-defined 'Fee Account' and 'Fee Percentage'. 
The test "pass" criteria is defined using an 'expect' statement from the chai library.
- Pass: 
	* The deployed NFT name should equal ("IoT-NFT Dapp") - custom name set for the NFT collection
	* The deployed NFT symbol should equal ("IOTD")  - custom symbol set for the NFT collection
	* The marketplace fee account should equal the deployers address 
	* The marketplace fee percentage should equal the fee percent passed in code (1)


2. NFT (Create) Mint function

To test that the mint function works correctly (ie. that an NFT record will be successfully created and stored from the data). A user account and NFT metadata URI (could be for an image/iot data or other) is passed and a test NFT created. 
- Pass:
	* The number of tokens should now be 1 (ie. After 1 token is minted, there is now 1 token in circulation)
	* The number of NFT tokens at the buyers address should now be 1
	* The NFT token URI is equal to the URI passed to the test 
	* A second buyer should increase the tokenCount() to 2


3. Marketplace Create Items function 
Verify that a user can create nft from their uploaded data using the mint function , followed by listing the minted NFT on the marketplace for buyers to purchase. Listing an NFT requires the seller to transfer ownership of the NFT to the marketplace. Therefore the function should be robust against errors in transferring the NFT. For the seller and also subsequently for incorrect (buyers). To test this, addr1 mints an nft and offers their nft at a price of 1 ether by calling the makeItem function. The function should Successfully track a newly created item by making an NFT with makeItem, Emit an offered event once the NFT has been created, and successfully transfer ownership of the NFT from seller to marketplace.
- Pass:
	* An offered event should be emitted 
	* NFT owner attribute should equal marketplace address
	* The itemCount on the marketplace should equal (1)
	* All mappings of the NFT attributes on the marketplace (id, price, address etc.) should equal the expected NFT attributes to indicate a successful mapping fof data

- Fail:
	* Additional fail test here, checks that the price is not set at 0 - ie. no free transfers are possible. This is tested by passing a price of zero to the makeItem function and expecting an error message.


4. NFT Purchase function
To test the purchase capability, the test script connects a user account to mint an nft record. It then approves spend of NFT on the marketplace (ie. sends to marketplace), followed by calling the makeItem function to list the NFT on the marketplace. It expects a user account to connect and purchase an NFT, the marketplace contract should emit a bought event with arguments in the nft mappings struct updated appropriately.

- Pass:
	* Function will check the log following bough event to confirm mappings have been updated
		ie. same itemId, nft address, price, seller and buyer adresses match up
	* The sellers final eth balance is equal to the price of the total price of NFT + the sellers initial eth balance
	

## Project Log

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
* Accessing the device via SMbus protocol over the I2C interface on the raspberry pi
* Dependencies
    * install cffi on the RPi to call C code using Python (pip install cffi)
    * install smbus via cffi (pip install smbus-cffi)
* Pin setup  
    * Pin1 3.3v -to-  ADXL345 Vcc
    * Pin3 I2C SDA -to- ADXL345 SDA
    * Pin5 I2C SCL -to- ADXL345 SCL
    * Pin6 GND -to- ADXL345 GND
* Client (RPi) successfully gather data and sending JSON loads to the Server
* TO DO: Render the received data on the server side to the upload page in the frontend web app ******
* SUCCESS - Test and confirmed the following;
	- 1. Start the server (index.js) - server is listening
	- 2. Start the App - the frontend page loads
		- The user connects to backend (automatic when the server starts)
		- The user connects his wallet

	- 3. The iot client (RPI) starts and sends a connect request to the server
		- On receipt of connection request;
			- The iot client calls the timeout function which triggers the ADXL345
			- When the treshold is reached, data gathered from the ADXL345 is written to a file, serialized and sent over socket connection to the server

	- 4. When the Server receives the message;
		- It sends a broacast message to indicate to the front end that a file was received
		- The frontend (App.js) renders the file object and stores in state variable 'file'
		- The front end Alerts to say the file is received!

NEXT: Need to pass the file to the upload field in the create form
	This starts the NFT creation mechanism  of the system	

    * Successfully rendering the fileobject to dropdown on Create.js page
    * Issue calling the upload to IPFS function on the object


17/08/2022
* Completed frontend application by adding two pages for lised items and purchased items
* Carried out testing on IoT component and Frontend application components. 
* Errors in Creating and rendering the NFT from the data - to be reviewed and tested again tomorrow