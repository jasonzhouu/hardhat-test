import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("SimpleBank", () => {
  let simpleBank: ethers_.Contract;
  beforeEach(async () => {
    const SimpleBank = await ethers.getContractFactory("SimpleBank");
    simpleBank = await SimpleBank.deploy();
  });
  it("get owner", async () => {
    assert(simpleBank, "contract was not found");
    const actual = await simpleBank.owner();
    const [owner] = await ethers.getSigners();
    expect(actual).to.equal(owner.address);
  });
  it("deposit", async () => {
    await simpleBank.deposit({ value: 1 });
    expect(await simpleBank.balance()).to.equal(1);
  });
  it("withdraw", async () => {
    await expect(simpleBank.withdraw(1)).to.be.revertedWithoutReason();
  });
});
