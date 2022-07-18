import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("FundRaiser", () => {
  it("get contract", async () => {
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    const fundraiser = await Fundraiser.deploy("Jason", "");
    assert(fundraiser, "contract was not found");
    const actual = await fundraiser.name();
    expect(actual).to.equal("Jason");
  });
});
