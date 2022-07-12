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
    const expected = "Hello, World!";
    expect(await greeter.greet()).to.equal(expected);
  });
  it("set greeting to passed in string", async () => {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy();
    const expected = "Hi there!";
    await greeter.setGreeting(expected);
    expect(await greeter.greet()).to.equal(expected);
  });
});
