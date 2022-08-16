// written in js to leverage the waffle testing framework
// import chai
const { expect } = require("chai");  //provides us with our should, describe, assert declarations
const { ethers } = require("hardhat");

// util functions to auto convert ether to wei
// 1 ether = 10**18 wei
const toWei = (num) => ethers.utils.parseEther(num.toString())
const fromWei = (num) => ethers.utils.formatEther(num)

describe("NFTMarketplace", function() { // (nft contract name, callback function)
   
    let deployer, addr1, addr2, nft, marketplace /// declate variables using the let variable
    let feePercent = 1
    let URI = 'Test URI'

    beforeEach(async function(){                // wrap in a beforeEach hook to automate the call of testing (prevents having to write this at the beginng of each test)
        const NFT = await ethers.getContractFactory("NFT");        //Get contract factories
        const Marketplace = await ethers.getContractFactory("Marketplace");
        [deployer, addr1, addr2] = await ethers.getSigners(); //Get signers (abstractions of ethereum accounts)

        //Deploy contracts
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent);
    });

    //tests written inside the callbacks using it statements
    // 1. First test NFT/Marketplace Deployment
    describe("Deployment", function() {

        it("Should track name and symbol of the nft collection", async function() {
            expect(await nft.name()).to.equal("IoT-NFT Dapp")
            expect(await nft.symbol()).to.equal("IOTD")
        })
        it("Should track feeAccount and feePercent of the Marketplace", async function() {
            expect(await marketplace.feeAccount()).to.equal(deployer.address)
            expect(await marketplace.feePercent()).to.equal(feePercent)
        })
    })

    // 2. Second test the NFT mint function
    describe("Minting NFTs", function() { 
        it("Should successfully track each minted NFT", async function() {
            
            await nft.connect(addr1).mint(URI)                         //addr1 (buyer 1) mints an NFT
            expect(await nft.balanceOf(addr1.address)).to.equal(1);    // the minter (buyers) balance to equal 1
            expect(await nft.tokenURI(1)).to.equal(URI);               // the token URI to equal the URI passed

            
            await nft.connect(addr2).mint(URI)                          //addr2 mints an NFT
            expect(await nft.balanceOf(addr2.address)).to.equal(1);     //the number of tokens in the new buyers account should be 1
            expect(await nft.tokenURI(2)).to.equal(URI);                //the token URI should be the URI passed to the mint function
        })  
    })

    // 3. Third test for making nft items on the marketplace
    describe("Creating NFT items on the marketplace", function() {
        beforeEach( async function() {
            await nft.connect(addr1).mint(URI)  //addr1 mints the nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)  //addr1 approves marketplace to spend the nft
        })

        it("Should track the newly created item, transfer NFT from the seller to the marketplace and emit Offered event", async function() {
            
            //addr1 offers NFT at a price of 1 ether
            //makeItem takes (nft address, tokenID, priceSetinWei)
            await expect(marketplace.connect(addr1).makeItem(nft.address,1,toWei(1)))
            .to.emit(marketplace, "Offered")
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                addr1.address
            )

            //verify owner of the NFT is now the marketplace
            expect(await nft.ownerOf(1)).to.equal(marketplace.address);

            //verify the item count has now increased (nfts on the market)
            expect(await marketplace.itemCount()).to.equal(1);

            //Fetch item to verify the field mappings are correct
            const item = await marketplace.items(1)
            expect(item.itemId).to.equal(1)
            expect(item.nft).to.equal(nft.address)
            expect(item.tokenId).to.equal(1)
            expect(item.price).to.equal(toWei(1))
            expect(item.sold).to.equal(false)
        });

        // Fail case
        it("Should fail if price is set to 0", async function() {
        await expect (
            marketplace.connect(addr1).makeItem(nft.address, 1, 0)
        ).to.be.revertedWith("Price must be greater than zero");
        });
    });

    // 4. Fourth test for purchasing NFTs on the marketplace
    describe("Purchasing marketplace items", function() {
        let price = 2
        let totalPriceInWei        

        beforeEach(async function(){

            await nft.connect(addr1).mint(URI)                                        //addr1 mints an nft
            await nft.connect(addr1).setApprovalForAll(marketplace.address, true)    //addr1 approves marketplace to spend nft
            await marketplace.connect(addr1).makeItem(nft.address, 1, toWei(price))  //addr1 makes their nft a marketplace item
        })
        
        it("Should mark the item as sold, pay the seller, transfer the NFT to the buyer, charge fees and emit a Bought event", async function(){
            const sellerInitialEthBal = await addr1.getBalance()
            const feeAccountInitialEthBal = await deployer.getBalance()
            totalPriceInWei = await marketplace.getTotalPrice(1); //fetch total price of the item (market fees  + item price)
            //addr2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei}))
            .to.emit(marketplace, "Bought")  // check transaction log
            .withArgs(
                1,
                nft.address,
                1,
                toWei(price),
                addr1.address,
                addr2.address
            )

            // fetch final updated balances
            const sellerFinalEthBal = await addr1.getBalance()
            const feeAccountFinalEthBal = await deployer.getBalance()

            // check that the sellers final eth balance is equal to the price NFT was sold for
            expect(fromWei(sellerFinalEthBal)).to.equal(price + fromWei(sellerInitialEthBal))
            const fee = (feePercent / 100) * price                                                              // calculate fee
            expect(fromWei(feeAccountFinalEthBal)).to.equal(fee + fromWei(feeAccountInitialEthBal))             // feeAccount should receive fee
            expect(await nft.ownerOf(1)).to.equal(addr2.address);                         // the buyer should own the nft now
            expect(await marketplace.items(1).sold).to.equal(true);                       // item should be marked as sold

        })

        // Fail cases
        it("Should fail for invalid item ids and sold items when not enough ether is paid", async function(){
            //fails on invalid item ids
            await expect (
                marketplace.connect(addr2).purchaseItem(2, {value: totalPriceInWei}) //pass a value "2" which is greater than the item ids
            ).to.be.revertedWith("This item doesnt exist");

            await expect(
                marketplace.connect(addr2).purchaseItem(0, {value: totalPriceInWei}) //pass a value 0 which doesn;t exist
            ).to.be.revertedWith("This item doesn't exist");

            await expect (
                marketplace.connect(addr2).purchaseItem(1, {value: toWei(price)})  // fails if not enough money available for purchase
            ).to.be.revertedWith("Not enough funds available to cover item price and market fee");

            await marketplace.connect(addr2).purchaseItem(1, {value: totalPriceInWei})  // addr2 purchases item 1
            
            await expect(
                marketplace.connect(deployer).purchaseItem(1, {value: totalPriceInWei}) // deployer tries to buy item1 after its been sold
            ).to.be.revertedWith("This item already sold");
        });
    })
})
    




