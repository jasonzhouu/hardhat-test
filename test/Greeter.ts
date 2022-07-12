import { ethers } from "hardhat";
import { assert, expect } from "chai";

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
  it("return hello world", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy();
    expect(await greeter.greet()).to.equal("Hello, World!");
  });
});
