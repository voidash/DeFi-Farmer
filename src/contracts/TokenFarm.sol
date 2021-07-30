pragma solidity ^0.5.0;

import "./DappToken.sol";
import "./DaiToken.sol";
contract TokenFarm {
    string public name = "Ash Token Farm";

    DappToken public dappToken;
    DaiToken public daiToken;


    address public owner ;

    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;
    mapping(address => bool) public isStaking;

    address[] public stakers;

    constructor(DappToken _dappToken, DaiToken _daiToken) public{
        dappToken = _dappToken;
        daiToken = _daiToken;
        owner = msg.sender;
    }
    // staking tokens. send tokens by sender to me
    function stakeTokens(uint _amount) public {
        require(_amount > 0 , "amount cannot be less than or equals to 0 ");

        daiToken.transferFrom(msg.sender, address(this),_amount);
        stakingBalance[msg.sender] = stakingBalance[msg.sender] + _amount;

        // Add user to stakers array , if they haven't staked already.
        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }
        isStaking[msg.sender] = true;
        hasStaked[msg.sender] = true;
    }


    // Unstaking token 

    // issue of tokens
    function issueTokens() public {
        require(msg.sender == owner, "caller must be the owner");

        for(uint i = 0 ; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient];
            if(balance > 0){
                dappToken.transfer(recipient, balance);
            }
        }
    }

    function unstakeTokens() public {
        uint balance = stakingBalance[msg.sender];

        require(balance > 0, "you haven't staked");

        daiToken.transfer(msg.sender,balance);
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}


