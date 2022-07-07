First NFT application using IPFS storage

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



06/07/2022
* Updated the front end to include several new buttons, basic layout
* Details form, buttons and labels


07/07/2022
* Added Sell/Transfer button
* Spacing between components
* Enable connect wallet button to allow user to interact with the blockchain (Wallet Required (dependencie))
    - import web3 from web3
    - connectwallet() function defined outside of main App() function because it is called when user clicks button (async)
    - Linked to Connect Wallet button (OnClick)
    - Useful documentation "https://docs.ethers.io" for viewing available functions calls the for Smart Contracts