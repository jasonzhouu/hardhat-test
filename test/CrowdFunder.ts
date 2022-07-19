import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("CrowdFunder", () => {
  let crowdFunder: ethers_.Contract;
  beforeEach(async () => {
    const CrowdFunder = await ethers.getContractFactory("CrowdFunder");
    crowdFunder = await CrowdFunder.deploy();
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
      const [owner, anotherAccount] = await ethers.getSigners();
      await crowdFunder.crowdFund(
        24 * 7,
        "https://www.google.com",
        anotherAccount.address,
        100
      );
    });
    it("init state", async () => {
      const [owner, anotherAccount] = await ethers.getSigners();
      expect(await crowdFunder.creator()).to.equal(owner.address);
      expect(await crowdFunder.fundRecipient()).to.equal(
        anotherAccount.address
      );
      expect(await crowdFunder.miniumToRaise()).to.equal(100);
      const now = Math.floor(Date.now() / 1000);
      expect((await crowdFunder.raiseBy()).toNumber()).to.greaterThan(now);
      expect(await crowdFunder.state()).to.equal(0);
    });
    it("rainse succesfully", async () => {
      const [_, anotherAccount] = await ethers.getSigners();
      await crowdFunder.connect(anotherAccount).contribute({ value: 1 });
      expect(await crowdFunder.state()).to.equal(0);
      await crowdFunder.connect(anotherAccount).contribute({ value: 100 });
      expect(await crowdFunder.state()).to.equal(2);
    });
    it("contribute after success", async () => {
      const [_, anotherAccount] = await ethers.getSigners();
      await crowdFunder.connect(anotherAccount).contribute({ value: 1 });
      expect(await crowdFunder.state()).to.equal(0);
      await crowdFunder.connect(anotherAccount).contribute({ value: 100 });
      expect(await crowdFunder.state()).to.equal(2);
      await expect(
        crowdFunder.connect(anotherAccount).contribute({ value: 1 })
      ).to.revertedWithoutReason();
    });
  });
});
