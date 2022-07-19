// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/// @title CrowdFunder
/// @author jason zhou
contract CrowdFunder {
    address public creator;
    address payable public fundRecipient;
    uint public miniumToRaise;
    string compaignUrl;
    enum State {
        FundRaising,
        ExpireRefund,
        Successful
    }
    struct Contribution {
        uint amount;
        address payable contributor;
    }
    State public state = State.FundRaising;
    uint public totalRaised;
    uint public raiseBy;
    uint public completeAt;
    Contribution[] contributions;

    event LogFundingReceived(address addr, uint amount, uint currentTotal);
    event LogWinnerPaid(address winnerAddress);

    modifier inState(State _state) {
        require(state == _state);
        _;
    }
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }
    modifier atEndOfLifecycle() {
        require(
            (state == State.ExpireRefund || state == State.FundRaising) &&
                completeAt + 24 weeks < block.timestamp
        );
        _;
    }

    function crowdFund(
        uint timeInHoursForFundraising,
        string memory _compaignUrl,
        address payable _fundRecipient,
        uint _minimumToRaise
    ) public {
        creator = msg.sender;
        fundRecipient = _fundRecipient;
        compaignUrl = _compaignUrl;
        miniumToRaise = _minimumToRaise;
        raiseBy = block.timestamp + (timeInHoursForFundraising * 1 hours);
    }

    function contribute()
        public
        payable
        inState(State.FundRaising)
        returns (uint256 id)
    {
        contributions.push(
            Contribution({amount: msg.value, contributor: payable(msg.sender)})
        );
        totalRaised += msg.value;
        emit LogFundingReceived(msg.sender, msg.value, totalRaised);

        checkIfFundingCompleteOrExpired();
        return contributions.length - 1; // return id of contributor
    }

    function checkIfFundingCompleteOrExpired() public {
        if (totalRaised > miniumToRaise) {
            state = State.Successful;
            payout();
        } else if (block.timestamp > raiseBy) {
            state = State.ExpireRefund;
        }
        completeAt = block.timestamp;
    }

    function payout() public inState(State.Successful) {
        fundRecipient.transfer(address(this).balance);
        emit LogWinnerPaid(fundRecipient);
    }

    function getRefund(uint256 id)
        public
        inState(State.ExpireRefund)
        returns (bool)
    {
        require(
            contributions.length > id &&
                id >= 0 &&
                contributions[id].amount != 0
        );
        uint256 amountToBeRefund = contributions[id].amount;
        contributions[id].amount = 0;
        contributions[id].contributor.transfer(amountToBeRefund);
        return true;
    }

    function remoteContract() public isCreator atEndOfLifecycle {
        selfdestruct(payable(msg.sender));
    }
}
