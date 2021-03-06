import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";
import web3 from "web3";

describe("FundRaiser", () => {
  async function deployFixture() {
    let fundraiser: ethers_.Contract;
    const accounts = await ethers.getSigners();
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageURL = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1].address;
    const owner = accounts[0].address;
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy(
      name,
      url,
      imageURL,
      description,
      beneficiary,
      owner
    );
    return {
      accounts,
      name,
      url,
      imageURL,
      description,
      beneficiary,
      owner,
      fundraiser,
    };
  }

  it("get contract", async () => {
    const { name, url, imageURL, description, beneficiary, owner, fundraiser } =
      await loadFixture(deployFixture);
    assert(fundraiser, "contract was not found");
    expect(await fundraiser.name()).to.equal(name);
    expect(await fundraiser.url()).to.equal(url);
    expect(await fundraiser.imageURL()).to.equal(imageURL);
    expect(await fundraiser.description()).to.equal(description);
    expect(await fundraiser.beneficiary()).to.equal(beneficiary);
    expect(await fundraiser.owner()).to.equal(owner);
  });
  describe("set beneficiary", () => {
    it("update beneficiary when called by owner account", async () => {
      const { fundraiser, accounts } = await loadFixture(deployFixture);
      await expect(fundraiser.setBeneficiary(accounts[2].address)).not.to.be
        .reverted;
    });
    it("throw an error when called by non-owner account", async () => {
      const { fundraiser, accounts } = await loadFixture(deployFixture);
      await expect(
        fundraiser.connect(accounts[3]).setBeneficiary(accounts[2].address)
      ).to.be.reverted;
    });
  });
  describe("making donations", () => {
    const value = web3.utils.toWei("0.0289");
    it("increases myDonationsCount", async () => {
      const { fundraiser, accounts } = await loadFixture(deployFixture);
      const fundraiser_ = fundraiser.connect(accounts[2]);
      const currentDonationsCount = await fundraiser_.myDonationsCount();
      await expect(fundraiser_.donate({ value })).not.to.be.reverted;
      const newDonationsCount = await fundraiser_.myDonationsCount();
      expect(newDonationsCount - currentDonationsCount).to.equal(1);
    });
    it("donate event", async () => {
      const { fundraiser, accounts } = await loadFixture(deployFixture);
      await expect(fundraiser.connect(accounts[2]).donate({ value: 1 }))
        .to.emit(fundraiser, "LogNewDonation")
        .withArgs(accounts[2].address, 1);
    });
  });
});
