import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";

describe("CrowdFunder", () => {
  let crowdFunder: ethers_.Contract;
  let crowdFunderWithAnotherAccount: ethers_.Contract;
  beforeEach(async () => {
    const CrowdFunder = await ethers.getContractFactory("CrowdFunder");
    crowdFunder = await CrowdFunder.deploy();
    const [_, anotherAccount] = await ethers.getSigners();
    crowdFunderWithAnotherAccount = crowdFunder.connect(anotherAccount);
  });
  it("get initial state", async () => {
    assert(crowdFunder, "contract was not found");
    const actual = await crowdFunder.creator();
    const [owner] = await ethers.getSigners();
    expect(actual).to.not.equal(owner.address);
    expect(actual).to.equal("0x0000000000000000000000000000000000000000");
    expect(await crowdFunder.raiseBy()).to.equal(0);
  });
  describe("start a new crowd fund raise", () => {
    beforeEach(async () => {
      const accounts = await ethers.getSigners();
      await crowdFunder.crowdFund(
        24 * 7,
        "https://www.google.com",
        accounts[2].address,
        100
      );
    });
    it("init state", async () => {
      const [owner, _, recipient] = await ethers.getSigners();
      expect(await crowdFunder.creator()).to.equal(owner.address);
      expect(await crowdFunder.fundRecipient()).to.equal(recipient.address);
      expect(await crowdFunder.miniumToRaise()).to.equal(100);
      const now = Math.floor(Date.now() / 1000);
      expect((await crowdFunder.raiseBy()).toNumber()).to.greaterThan(now);
      expect(await crowdFunder.state()).to.equal(0);
      expect(await crowdFunder.totalRaised()).to.equal(0);
    });
    it("raise succesfully", async () => {
      const [_, anotherAccount] = await ethers.getSigners();
      await expect(crowdFunderWithAnotherAccount.contribute({ value: 1 }))
        .to.emit(crowdFunder, "LogFundingReceived")
        .withArgs(anotherAccount.address, 1, 1);
      expect(await crowdFunder.totalRaised()).to.equal(1);
      expect(await crowdFunder.state()).to.equal(0);
      await expect(crowdFunderWithAnotherAccount.contribute({ value: 100 }))
        .to.emit(crowdFunder, "LogFundingReceived")
        .withArgs(anotherAccount.address, 100, 101);
      expect(await crowdFunder.totalRaised()).to.equal(101);
      expect(await crowdFunder.state()).to.equal(2);
    });
    it("contribute after success", async () => {
      await crowdFunderWithAnotherAccount.contribute({ value: 1 });
      expect(await crowdFunder.state()).to.equal(0);
      await crowdFunderWithAnotherAccount.contribute({ value: 100 });
      expect(await crowdFunder.state()).to.equal(2);
      await expect(
        crowdFunderWithAnotherAccount.contribute({ value: 1 })
      ).to.revertedWithoutReason();
    });
    it("payout after success", async () => {
      const accounts = await ethers.getSigners();
      await crowdFunderWithAnotherAccount.contribute({ value: 1 });
      expect(await crowdFunder.state()).to.equal(0);
      await crowdFunderWithAnotherAccount.contribute({ value: 100 });
      expect(await crowdFunder.state()).to.equal(2);
      await expect(crowdFunder.payout())
        .to.emit(crowdFunder, "LogWinnerPaid")
        .withArgs(accounts[2].address);
    });
    it("contribute after expired", async () => {
      const latestTime = await time.latest();
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      await time.increaseTo(latestTime + ONE_YEAR_IN_SECS);
      await crowdFunder.checkIfFundingCompleteOrExpired();
      expect(await crowdFunder.state()).to.equal(1);
      await expect(
        crowdFunderWithAnotherAccount.contribute({ value: 1 })
      ).to.revertedWithoutReason();
    });
    it("refund after expired", async () => {
      await crowdFunderWithAnotherAccount.contribute({ value: 1 });
      const latestTime = await time.latest();
      const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
      await time.increaseTo(latestTime + ONE_YEAR_IN_SECS);
      await crowdFunder.checkIfFundingCompleteOrExpired();
      expect(await crowdFunder.state()).to.equal(1);
      await crowdFunderWithAnotherAccount.getRefund(0);
    });
  });
});
