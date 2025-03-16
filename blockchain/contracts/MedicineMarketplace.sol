// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicineMarket {
    struct Medicine {
        string name;
        uint price;
        address seller;
        bool sold;
    }
    mapping(uint => Medicine) public medicines;
    uint public medicineCount;

    function listMedicine(string memory _name, uint _price) public {
        medicines[medicineCount] = Medicine(_name, _price, msg.sender, false);
        medicineCount++;
    }

    function buyMedicine(uint _id) public payable {
        require(msg.value == medicines[_id].price, "Incorrect price");
        require(!medicines[_id].sold, "Already sold");
        medicines[_id].sold = true;
        payable(medicines[_id].seller).transfer(msg.value);
    }
}

