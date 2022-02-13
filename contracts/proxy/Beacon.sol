// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Beacon is IBeacon, Ownable {
    address public impl;

    constructor(address _owner, address _impl) {
        impl = _impl;
        transferOwnership(_owner);
    }

    function implementation() external view override returns (address) {
        return impl;
    }

    function changeImpl(address _newImpl) external onlyOwner {
        impl = _newImpl;
    }
}
