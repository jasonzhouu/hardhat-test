import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("CrowdFunder", () => {
  let crowdFunder: ethers_.Contract;
  beforeEach(async () => {
    const CrowdFunder = await ethers.getContractFactory("CrowdFunder");
    crowdFunder = await CrowdFunder.deploy();
  });
  it("get creator", async () => {
    assert(crowdFunder, "contract was not found");
    const actual = await crowdFunder.creator();
    const [owner] = await ethers.getSigners();
    expect(actual).to.not.equal(owner.address);
    expect(actual).to.equal("0x0000000000000000000000000000000000000000");
  });
  it("init state", async () => {
    const [owner, anotherAccount] = await ethers.getSigners();
    await crowdFunder.crowdFund(
      24 * 7,
      "https://www.google.com",
      anotherAccount.address,
      100
    );
    expect(await crowdFunder.creator()).to.equal(owner.address);
    expect(await crowdFunder.fundRecipient()).to.equal(anotherAccount.address);
    expect(await crowdFunder.miniumToRaise()).to.equal(100);
    expect(await crowdFunder.raiseBy()).to.not.equal(0);
  });
});
