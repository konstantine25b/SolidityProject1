const { deployments, ethers, getNamedAccounts } = require("hardhat")
const { assert, expect } = require("chai")
const { TransactionResponse } = require("ethers")

describe("FundMe", async function () {
    let fundMe
    let deployer
    let MockV3Aggregator
    let sendValue = "1000000000000000"
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        fundMe = await ethers.getContractAt(
            "FundMe",
            (await getNamedAccounts()).user,
        )

        MockV3Aggregator = await ethers.getContractAt(
            "MockV3Aggregator",
            deployer,
        )
    })

    describe("constructor", async function () {
        it("sets the aggregator addresses correctly ", async function () {
            const response = await fundMe.priceFeed
            assert.equal(response._contract.target, MockV3Aggregator.target)
        })
    })
    describe("fund", async function () {
        it("fails if you dont send enought eth", async function () {
            await fundMe.fund()
        })
        // it("add funder to arr of funders" , async function (){
        //     await fundMe.fund({ value : Number(sendValue)})
        //     console.log("k", await fundMe.funders._contract.interface.fragments[4])
        // })
    })
    describe("withdraw", async function () {
        beforeEach(async function () {
            await fundMe.fund({ value: Number(sendValue) })
        })

        it("withdraw ETH from a single funder", async function () {
            const startingFundMeBalence =
                await fundMe.runner.provider.getBalance(fundMe.target)
            const startingDeployerBalance =
                await fundMe.runner.provider.getBalance(deployer)
            console.log(startingFundMeBalence,startingDeployerBalance , "kjosa")
            const TXResponse = await fundMe.withdraw()
            const TXReceipt = await TXResponse.wait(1)
            const {gasUsed , gasPrice} = TXReceipt
            const gasCost = gasUsed*gasPrice
            console.log(gasCost)

            const endingFundMeBalance = await fundMe.runner.provider.getBalance(
                fundMe.target,
            )
            const endingDeployerBalance =
                await fundMe.runner.provider.getBalance(deployer)
            // assert.equal(endingFundMeBalance, 0)
            console.log(endingFundMeBalance)
            // assert.equal(
            //     startingFundMeBalence.add(startingFundMeBalence).toString(),
            //     endingDeployerBalance.add(gasCost).toString(),
            // )
            console.log("dsdfas", endingDeployerBalance)
        })
    })
})
