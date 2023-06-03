// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Moment is ERC721A, Ownable, ReentrancyGuard {
    // metadata
    string public baseURI;

    // collection info
    uint256 public constant collectionSize = 5555;
    uint256 public perAddressMaxMintAmount = 5;

    // for marketing etc.
    uint256 public reservedAmount;
    uint256 public reservedMintedAmount;

    // public mint config
    uint256 public publicMintedAmount;
    uint256 public publicStartTime;
    uint256 public publicPrice;

    // allow list mint config
    bytes32 public allowListMerkleRoot;
    uint256 public allowListMintedAmount;
    uint256 public allowListStartTime;
    uint256 public allowListEndTime;
    uint256 public allowListPrice;

    constructor(
        string memory baseURI_,
        uint256 reservedAmount_,
        uint256 publicStartTime_,
        uint256 publicPrice_,
        bytes32 allowListMerkleRoot_,
        uint256 allowListStartTime_,
        uint256 allowListEndTime_,
        uint256 allowListPrice_
    ) ERC721A("The Moment3!", "MOMENT") {
        require(
            reservedAmount_ <= collectionSize &&
                allowListStartTime_ <= allowListEndTime_,
            "invalid"
        );
        baseURI = baseURI_;
        reservedAmount = reservedAmount_;
        publicStartTime = publicStartTime_;
        publicPrice = publicPrice_;
        allowListMerkleRoot = allowListMerkleRoot_;
        allowListStartTime = allowListStartTime_;
        allowListEndTime = allowListEndTime_;
        allowListPrice = allowListPrice_;
    }

    function setBaseURI(string calldata baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    function setConfig(
        uint256 perAddressMaxMintAmount_,
        uint256 reservedAmount_,
        uint256 publicStartTime_,
        uint256 publicPrice_,
        bytes32 allowListMerkleRoot_,
        uint256 allowListStartTime_,
        uint256 allowListEndTime_,
        uint256 allowListPrice_
    ) public onlyOwner {
        require(
            reservedAmount_ <= reservedAmount &&
                reservedAmount_ >= reservedMintedAmount &&
                allowListStartTime_ <= allowListEndTime_,
            "invalid"
        );
        perAddressMaxMintAmount = perAddressMaxMintAmount_;
        reservedAmount = reservedAmount_;
        publicStartTime = publicStartTime_;
        publicPrice = publicPrice_;
        allowListMerkleRoot = allowListMerkleRoot_;
        allowListStartTime = allowListStartTime_;
        allowListEndTime = allowListEndTime_;
        allowListPrice = allowListPrice_;
    }

    function mint(
        uint256 amount,
        uint256 allowListTotalAmount,
        bytes32[] calldata allowListMerkleProof
    ) public payable callerIsUser nonReentrant {
        require(
            publicMintedAmount + amount <= collectionSize - reservedAmount &&
                _numberMinted(msg.sender) + amount <= perAddressMaxMintAmount,
            "not enough amount"
        );
        uint256 allowListRemainAmount = 0;
        if (
            block.timestamp >= allowListStartTime &&
            block.timestamp <= allowListEndTime
        ) {
            allowListRemainAmount = getAllowListRemainAmount(
                allowListTotalAmount,
                allowListMerkleProof
            );
        }
        if (allowListRemainAmount == 0) {
            require(
                block.timestamp >= publicStartTime,
                "public mint not started"
            );
            _publicMint(amount);
            _refundIfOver(amount * publicPrice);
        } else {
            require(amount >= allowListRemainAmount, "must be used up at once");
            if (amount == allowListRemainAmount) {
                _allowListMint(amount);
                _refundIfOver(amount * allowListPrice);
            } else {
                uint256 publicAmount = amount - allowListRemainAmount;
                uint256 publicTotalPrice = publicAmount * publicPrice;
                uint256 allowListTotalPrice = allowListRemainAmount *
                    allowListPrice;
                _publicMint(publicAmount);
                _allowListMint(allowListRemainAmount);
                _refundIfOver(publicTotalPrice + allowListTotalPrice);
            }
        }
    }

    function getAllowListRemainAmount(
        uint256 allowListTotalAmount,
        bytes32[] calldata allowListMerkleProof
    ) public view returns (uint256) {
        if (allowListTotalAmount <= _getAux(msg.sender)) return 0;
        require(
            MerkleProof.verify(
                allowListMerkleProof,
                allowListMerkleRoot,
                keccak256(
                    abi.encodePacked(msg.sender, ":", allowListTotalAmount)
                )
            ),
            "verify fail"
        );
        return allowListTotalAmount - _getAux(msg.sender);
    }

    function _publicMint(uint256 amount) private {
        publicMintedAmount += amount;
        _safeMint(msg.sender, amount);
    }

    function _allowListMint(uint256 amount) private {
        publicMintedAmount += amount;
        allowListMintedAmount += amount;
        _setAux(msg.sender, _getAux(msg.sender) + uint64(amount));
        _safeMint(msg.sender, amount);
    }

    function airdrop(address user, uint256 amount) public onlyOwner {
        require(
            reservedMintedAmount + amount <= reservedAmount,
            "not enough amount"
        );
        reservedMintedAmount += amount;
        _safeMint(user, amount);
    }

    function airdropList(
        address[] calldata userList,
        uint256[] calldata amountList
    ) public onlyOwner {
        require(userList.length == amountList.length, "invalid");
        for (uint256 i = 0; i < userList.length; i++) {
            airdrop(userList[i], amountList[i]);
        }
    }

    // probably nothing

    bool public burnable = false;

    function setBurnable(bool burnable_) public onlyOwner {
        burnable = burnable_;
    }

    function burn(uint256[] calldata tokenIds) public callerIsUser {
        require(burnable, "not burnable");
        for (uint256 i = 0; i < tokenIds.length; i++) {
            uint256 tokenId = tokenIds[i];
            require(msg.sender == ownerOf(tokenId), "not owner");
            _burn(tokenId);
        }
    }

    // other

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "not user");
        _;
    }

    function totalMinted() public view returns (uint256) {
        return _totalMinted();
    }

    function numberMinted(address user) public view returns (uint256) {
        return _numberMinted(user);
    }

    function numberBurned(address user) public view returns (uint256) {
        return _numberBurned(user);
    }

    function withdraw() public onlyOwner nonReentrant {
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "fail");
    }

    function _refundIfOver(uint256 price) private {
        require(msg.value >= price, "not enough ETH");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function _startTokenId() internal pure override returns (uint256) {
        return 1;
    }
}
