import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { ethers } from "hardhat";
import { ethers as ethers_ } from "ethers";
import { assert, expect } from "chai";

describe("FundRaiser", async () => {
  async function deployFixture() {
    let fundraiser: ethers_.Contract;
    const accounts = await ethers.getSigners();
    const name = "Beneficiary Name";
    const url = "beneficiaryname.org";
    const imageURL = "https://placekitten.com/600/350";
    const description = "Beneficiary description";
    const beneficiary = accounts[1].address;
    const custodian = accounts[0].address;
    const Fundraiser = await ethers.getContractFactory("Fundraiser");
    fundraiser = await Fundraiser.deploy(
      name,
      url,
      description,
      imageURL,
      beneficiary,
      custodian
    );
    return {
      name,
      url,
      imageURL,
      description,
      beneficiary,
      custodian,
      fundraiser,
    };
  }

  it("get contract", async () => {
    const { name, fundraiser } = await loadFixture(deployFixture);
    assert(fundraiser, "contract was not found");
    const actual = await fundraiser.name();
    expect(actual).to.equal(name);
  });
});
