// written in js to leverage the waffle testing framework
// import chai
const { expect } = require("chai");
const { ethers } = require("hardhat");



describe("NFTMarketplace", function() { // (nft contract name, callback function)
   
    let deployer, addr1, addr2, nft, marketplace /// declate variables using the let variable
    let feePercent = 1
    beforeEach(async function(){                // wrap in a beforeEach hook to automate the call of testing 
        
        const NFT = await ethers.getContractFactory("NFT");        //Get contract factories
        const Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2] = await ethers.getSigners(); //Get signers

        //Deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    describe("Deployment", function() {
        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("IoT-NFT Dapp")
            expect(await nft.symbol()).to.equal("IOTD")
        })
    })
})