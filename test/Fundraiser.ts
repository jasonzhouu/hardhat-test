import { ethers } from "hardhat";
import { assert, expect } from "chai";

describe("FundRaiser", () => {
  it("get contract", async () => {
    const FundRaiser = await ethers.getContractFactory("Fundraiser");
    assert(FundRaiser, "contract was not found");
  });
});
