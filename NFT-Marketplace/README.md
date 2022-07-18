NFT-Marketplace Dapp

Global Dependencies
* node v17.0.1 
* Hardhat development (smart contracts) npm install --save-dev hardhat@2.8.4


Project specific Dependencies
* react-router DOM(npm install react-router-dom@6)
* IPFS http client (npm install ipfs-http-client@56.0.1)
* openzepplin smart contract template library (for ERC271) (npm i @openzeppelin/contracts@4.5.0)

17/07/2022
* Installed dependencies
* Created nft smart contract (NFT.sol)
* spin up local dev blockchain using 'npx hardhat node'
* Updated deploy.js file to create and deploy the smart contract
    - deployed contract locally using 'npx hardhat run src/backend/scripts/deploy.js --network localhost'