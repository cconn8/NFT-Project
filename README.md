
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

image.png

* Created testing scripts for smart contract testing (hardhat framework lets us write tests for these)
* Tested contracts using 'npx hardhat test' - Pased!!


image.png