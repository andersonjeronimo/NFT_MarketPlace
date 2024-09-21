// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarket {
    address payable public owner;
    uint256 public listingPrice = 0.025 ether;
    uint256 private _itemIdCounter;
    uint256 private _itemSoldCounter;

    struct MarketItem {
        uint256 itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    mapping(uint => MarketItem) marketItems; // itemId => market item

    constructor() {
        owner = payable(msg.sender);
    }

    event MarketItemCreated(
        uint indexed itemId,
        address indexed nftContract,
        uint indexed tokenId,
        address seller,
        uint price
    );

    function createMarketItem(
        address nftContract,
        uint tokenId,
        uint price
    ) public payable {
        require(price > 0, "Invalid price");
        require(msg.value == listingPrice, "Invalid listing price");

        _itemIdCounter++;
        uint itemId = _itemIdCounter;
        marketItems[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );
        
        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);
        emit MarketItemCreated(itemId, nftContract, tokenId, msg.sender, price);
    }
}
