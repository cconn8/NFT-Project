// SPDX-License-Identified: MIT

pragma solidity ^0.8.4;  //indicated to compiler which version of solidity we're using
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// create nft smart contract
contract NFT is ERC721URIStorage { 
    uint public tokenCount;
    
    constructor() ERC721("DApp NFT", "DAPP"){}  //declare constructor thats called on the inherited ER721 class

    //declare mint function
    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount ++;
        _safeMint(msg.sender, tokenCount);
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }
}

