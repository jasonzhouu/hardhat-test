import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert } from "chai";

describe("FundRaiser", () => {
  let fundraiser: ethers_.ContractFactory;
  beforeEach(async () => {
    fundraiser = await ethers.getContractFactory("Fundraiser");
  });
  it("get contract", async () => {
    assert(fundraiser, "contract was not found");
  });
});
