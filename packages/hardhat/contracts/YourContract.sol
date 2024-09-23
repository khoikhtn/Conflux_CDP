// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract YourContract {

  struct LoanInfo {
    address borrower;
    uint256 borrowedAmount;
    uint256 collateralAmount;
    uint256 repayRequirement;
    uint256 requestedAt;
    bool paid;
  }

  uint256 constant decimals = 10**18;

  IERC20 public colToken;
  IERC20 public staToken;
  uint256 public interestRate;
  uint256 public minCollateralizationRatio;
  uint256 public repayPeriod;
  mapping(address => LoanInfo) public loans;

  event LoanGranted(string message, uint256 repayRequirement);
  event LoanRepaid(address borrower, uint256 repaidAmount);
  event LoanExpired(string message);

  constructor (uint256 _interestRate, uint256 _minCollateralizationRatio) {
    colToken = IERC20(0x1fd2894211c3C8CFd2d86124E2E52696DD681Fc4);
    staToken = IERC20(0x6133fAaa969afbaF2D36c0C0Ba84ac13C26d9129);
    interestRate = _interestRate;
    minCollateralizationRatio = _minCollateralizationRatio;
  }

  // Request a loan with inputs: Borrowed amount, Collateral Amount
  function requestLoan(uint256 _borrowedAmount, uint256 _collateralAmount) public {
    LoanInfo storage initialLoanInfo = loans[msg.sender];

    require(initialLoanInfo.collateralAmount == 0 || (initialLoanInfo.collateralAmount > 0 && initialLoanInfo.paid == true), "You already had a loan");

    uint256 extraAmountToliquidate = (_borrowedAmount * (minCollateralizationRatio - 100)) / 100;

    require(_collateralAmount >= (_borrowedAmount + extraAmountToliquidate), "Insufficient collateral");

    // Deposit colToken into the pool
    colToken.transferFrom(msg.sender, address(this), _collateralAmount * decimals);

    // Transfer stable tokens from pool to borrower
    staToken.transfer(msg.sender, _borrowedAmount * decimals);

    uint256 _repayRequirement = _borrowedAmount * (100 + interestRate) * decimals / 100;

    LoanInfo memory loanInfo = LoanInfo({
      borrower: msg.sender,
      borrowedAmount: _borrowedAmount * decimals,
      collateralAmount: _collateralAmount * decimals,
      repayRequirement: _repayRequirement,
      requestedAt: block.timestamp,
      paid: false
    });

    loans[msg.sender] = loanInfo;

    emit LoanGranted("You need to repay", _repayRequirement / decimals);
  }

  function repayLoan(uint256 repayAmount) public {
    LoanInfo storage loanInfo = loans[msg.sender];

    require(loanInfo.borrowedAmount > 0, "No active loan");

    uint256 outstandingAmount = loanInfo.repayRequirement;

    require(repayAmount * decimals >= outstandingAmount, "Insufficient funds");

    // The contract sends back the collateral to the borrower
    colToken.transfer(msg.sender, loanInfo.collateralAmount);

    // The borrower repays the stable coins to the contract
    staToken.transferFrom(msg.sender, address(this), repayAmount * decimals);

    loanInfo.paid = true;

    emit LoanRepaid(msg.sender, loanInfo.borrowedAmount);
  }

  receive() external payable {}

}
