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
  describe("withdraw", () => {
    it("withdraw without deposit", async () => {
      await expect(simpleBank.withdraw(1)).to.be.revertedWithoutReason();
    });
    it("width after deposit", async () => {
      await simpleBank.deposit({ value: 10 });
      await simpleBank.withdraw(1);
      expect(await simpleBank.balance()).to.equal(9);
    });
    it("withdraw all balance", async () => {
      await simpleBank.deposit({ value: 10 });
      await simpleBank.withdraw(10);
      expect(await simpleBank.balance()).to.equal(0);
    });
    it("withdraw more money than balance", async () => {
      await simpleBank.deposit({ value: 10 });
      await expect(simpleBank.withdraw(11)).to.be.revertedWithoutReason();
    });
  });
  it("balances_", async () => {
    const [owner] = await ethers.getSigners();
    expect(await simpleBank.balances_(owner.address)).to.equal(0);
  });
});
