// function deployFunc(){

//     console.log("kosa")
// }

// module.exports.default = deployFunc

// module.exports = async (hre)=>{
//     const {getNamedAccounts, deployments} = hre
// }

const { networkConfig, developmentChains } = require("../herper-hardhat-config")

const { network } = require("hardhat")

const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log, get } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let ethUsdPriceFeedAddress

    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
        console.log(1, ethUsdPriceFeedAddress)
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"]
        console.log(2, ethUsdPriceFeedAddress)
    }

    const args = [ethUsdPriceFeedAddress]

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, // put price fee address
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERCAN_API_KEY
    ) {
        await verify(fundMe.address, args)
    }

    log("-------------------------------------kkbb")
}

module.exports.tags = ["all", "fundme"]
