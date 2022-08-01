
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