import { ethers } from "hardhat";
import { assert } from "chai";

describe("Greeter", () => {
  it("get contract", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    assert(Greeter, "contract was not found");
  });
  it("deploy contract", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy();
    assert(greeter, "contract was not deployed");
  });
});
