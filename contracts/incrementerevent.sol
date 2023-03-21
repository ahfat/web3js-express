// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

contract IncrementerEvent {
    uint256 public number;

    event numberIncreased(address indexed from, uint256 value, uint256 number);
    event numberReset(address indexed from, uint256 number);

    constructor(uint256 _initialNumber) {
        number = _initialNumber;
    }

    function increment(uint256 _value) public {
        number = number + _value;
        emit numberIncreased(msg.sender, _value, number);
    }

    function reset() public {
        number = 0;
        emit numberReset(msg.sender, number);
    }
}