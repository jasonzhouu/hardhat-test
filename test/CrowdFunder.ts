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
});
