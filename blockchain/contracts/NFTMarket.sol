// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
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
    ) public payable nonReentrant {
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

    function createMarketSale(
        address nftContract,
        uint itemId
    ) public payable nonReentrant {
        uint256 price = marketItems[itemId].price;
        uint256 tokenId = marketItems[itemId].tokenId;

        require(msg.value == price, "Invalid value");
        marketItems[itemId].seller.transfer(msg.value);
        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);

        marketItems[itemId].owner = payable(msg.sender);
        marketItems[itemId].sold = true;

        _itemSoldCounter++;
        payable(owner).transfer(listingPrice);
    }

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint totalItemCounter = _itemIdCounter;
        uint unsoldItemCount = totalItemCounter - _itemSoldCounter;
        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        uint currentIndex = 0;

        for (uint i = 1; i <= totalItemCounter; i++) {
            if (marketItems[i].owner == address(0) && !marketItems[i].sold) {
                items[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return items;
    }

    function fetchMyOwnedItems() public view returns (MarketItem[] memory) {
        uint totalItemCounter = _itemIdCounter;
        uint itemCount = 0;
        for (uint i = 1; i <= totalItemCounter; i++) {
            if (marketItems[i].owner == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        uint currentIndex = 0;
        for (uint i = 1; i <= totalItemCounter; i++) {
            if (marketItems[i].owner == msg.sender) {
                items[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return items;
    }

    function fetchMyCreatedItems() public view returns (MarketItem[] memory) {
        uint totalItemCounter = _itemIdCounter;
        uint itemCount = 0;
        for (uint i = 1; i <= totalItemCounter; i++) {
            if (marketItems[i].seller == msg.sender) {
                itemCount++;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        uint currentIndex = 0;
        for (uint i = 1; i <= totalItemCounter; i++) {
            if (marketItems[i].seller == msg.sender) {
                items[currentIndex] = marketItems[i];
                currentIndex++;
            }
        }
        return items;
    }




}
