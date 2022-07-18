import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("FundRaiser", () => {
  let fundraiser: ethers_.Contract;
  beforeEach(async () => {
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy("Jason", "");
  });
  it("get contract", async () => {
    assert(fundraiser, "contract was not found");
    const actual = await fundraiser.name();
    expect(actual).to.equal("Jason");
  });
});
