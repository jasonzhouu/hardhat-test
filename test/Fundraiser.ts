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
});
