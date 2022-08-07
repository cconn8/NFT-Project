// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract Marketplace is ReentrancyGuard {

    // State variables
    address payable public immutable feeAccount; //the account that receives the fees
    uint public immutable feePercent; // the fee percentage on sales
    uint public itemCount;

    // Stuct to contain data associated with each marketplace nft
    struct Item {
         uint itemId;
         IERC721 nft;
         uint tokenId;
         uint price;
         address payable seller;
         bool sold;
    }

    // define an offer event to be triggered after an nft/offer is created
    event Offered (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller
    );

    // define an offer event to be triggered after an nft/offer is bought
    event Bought (
        uint itemId,
        address indexed nft,
        uint tokenId,
        uint price,
        address indexed seller,
        address indexed buyer
    );

    // key mapping to map itemId -> Item
    mapping(uint => Item) public items;

    constructor(uint _feePercent) {
        feeAccount = payable(msg.sender);
        feePercent = _feePercent;
    }  

    // declare a function to create smart contracts on the marketplace
    // this will be used for controlling/restricting the data
    function makeItem(IERC721 _nft, uint _tokenId, uint _price) external nonReentrant {
        require(_price > 0, "Price must be greater than zero"); //verify a valid price has been set
        itemCount++; //incremenet itemCount by one
        _nft.transferFrom(msg.sender, address(this), _tokenId);

        items[itemCount] = Item ( // add new items to items mapping
            itemCount,
            _nft,
            _tokenId,
            _price,
            payable(msg.sender),
            false
        );

        // emit the Offered event
        emit Offered(
            itemCount,
            address(_nft),
            _tokenId,
            _price,
            msg.sender
        );
    }

    function purchaseItem(uint _itemId) external payable nonReentrant {
        uint _totalPrice = getTotalPrice(_itemId);
        Item storage item = items[_itemId];
        require(_itemId > 0 && _itemId <= itemCount, "item doesn't exist");
        require(msg.value >= _totalPrice, "not enough ether to cover item price and fee");
        require(!item.sold, "item already sold");

        //pay seller and feeAccount (iot data owner)
        item.seller.transfer(item.price);
        item.sold = true;
        item.nft.transferFrom(address(this), msg.sender, item.tokenId);

        //emit Bought event
        emit Bought(
            _itemId,
            address(item.nft), 
            item.tokenId, 
            item.price, 
            item.seller,
            msg.sender
            );

    }

    function getTotalPrice(uint _itemId) view public returns(uint) {
        return(items[_itemId].price*(100+feePercent)/100); //fetch total price from items mapping and * by sum of 100+fee%
    }

}