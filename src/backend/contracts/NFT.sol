// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// declare the NFT contract
contract NFT is ERC721URIStorage {
    uint tokenCount;
    
    constructor() ERC721("IoT-NFT Dapp", "IOTD"){} // called by the inherited ERC721URI... contract takes ('name', 'tokenSymbol')

    function mint(string memory _tokenURI) external returns(uint) {
        tokenCount++;
        _safeMint(msg.sender, tokenCount); // takes (ownersAddress, tokenID)
        _setTokenURI(tokenCount, _tokenURI);
        return(tokenCount);
    }

}



