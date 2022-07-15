First NFT application using IPFS storage 

> "IPFS and NFT-Enabled Data Sharing for IoT"

* The application uses react js on the front end to upload images to IPFS storage.
* Users connect his wallet to the GUI to start minting NFTs (ie. Execute a mint function on the smart contract)


Overview:
* Web3 app using
* React js webserver to interact with the dApp


Packages/Dependencies:
* Node js library to build/install react,js server
* Web3 package to interface with a browser based wallet (ie. metamask) : 'npm i web3'
* ethers library to coommunicate with the smart contract : 'npm i ethers'
* bootstrap for visuals/styling on the web server : 'npm install react-bootstrap bootstrap'


Steps:
1. Build/install a react js frontend server to host front end application using 'npx create-react-app web3demo'
2. Install packages and dependencies (listed above)
3. Create GUI dashboard (app.js) using html/css


06/07/2022 - basic GUI
* Updated the front end to include several new buttons, basic layout
* Details form, buttons and labels


07/07/2022 - basic GUI
* Added Sell/Transfer button
* Spacing between components
* Enable connect wallet button to allow user to interact with the blockchain (Wallet Required (dependencie))
    - import web3 from web3
    - connectwallet() function defined outside of main App() function because it is called when user clicks button (async)
    - Linked to Connect Wallet button (OnClick)
    - Useful documentation "https://docs.ethers.io" for viewing available functions calls the for Smart Contracts

08/07/2022 - smart contract
* Created Smart Contract (ERC21 - layer 2 token) - setting the contract name to EE5003v1
* Solidity used (https://docs.openzeppelin.com/contracts/4.x/wizard) used for creating templates
    - SC composed of interfaces, attributes and functions 
    - Interfaces: Ownable, Enumerable, Receiver, Transferable etc..
    - Attributes: 
        NFT Collection name (EE5003v1), 
        NFT token, 
        NFT Base URI (Path to where NFT metadata file is located (IPFS - points to actual data), 
        NFT Base URI extension (.json)
        NFT Mint amount, cost etc..
        NFT Max Supply (sets the limit on the max supply of NFT - can't be changed later)
        NFT Max Mint Amount (sets the number of mints allowed (ie. purchases of the data))
    - Functions: Mint, Withdraw, Transfer etc..
    - Once configuration changes have been made to the smart contract
        - ctrl-all the file and go to remix.ethereum.org (public IDE) to interact directly with the smart contract (ie. Mint the contract on the blockchain - testnet)


11/07/2022 - nft preperation/upload to IPFS
* Create test IPFS store using a simple jpeg photo (later IoT data will be stored)
* NOTE - IPFS pinning. To ensure always available data, the data needs to be pinned using a service (pinata) or using local IPFS node to store (pin) the file
* Created two folders locally on my machine under storage folders in NFT project directory (1. art (nft image) folder, 2. metadata folder)
    - stock images used from [https://www.istockphoto.com/vector/glowing-neon-line-electric-car-and-electrical-cable-plug-charging-icon-isolated-on-gm1371031659-440451276] - not licensed
* Created json metadata template containing fields: Name, description, image, edition, image attributes

    - //note: may need to include another address for the data and have an image to represent the NFT
    - //attributes are image attributes, what makes the images unique (colours, facial expressions, changes etc.)
    - NOTE: JSON FILE NEEDS TO BE REPLICATED MANUALLY (V1) FOR EACH NFT IMAGE

12/07/2022
* Installed and Initialized IPFS-command line on Laptop
image.png
* Created metafiles for each of the art images
* Uploaded folders (art & metdata) to IPFS (V2 for IoT I will use the http-client in node js for this probably (easier))
* note; Metafiles link to art image

15/07/2022
* Updated smart contract with the CID for the metafolder
* Deployed (minted) the smart contract on the blockchain using remix.ethereum.org IDE
    - copy the contract to the IDE and compiled from there
    - Deployed on the Rinkeby testnet successfully, returned contract address
    - Updated App.js (Mint Button) to include the contract address (ie. calls the contract on Mint click)

    image.png

    image.png

    - Retrieved ABI (API) from the deployed contract (EE5003v1) and created a constant in App.js to store this
    - Retreived Contract address and created a second constant in App.js to store this
* NOTE: Ran into errors testing here by launching the react server
        - errors 'account' not defined, 'contract' not defined
        - resolved errors by creating a NULL variable for account & contract
        - patching required for reach node modules - delayed 
* Seperated Mint and Connect Wallet functions to clean up code
* Tested Connect Wallet button (working) connects to metamask wallet in the browser