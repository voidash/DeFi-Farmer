const { assert } = require('chai')
const _deploy_contracts = require('../migrations/2_deploy_contracts')

const DaiToken = artifacts.require('DaiToken')
const DappToken = artifacts.require('DappToken')
const TokenFarm = artifacts.require('TokenFarm')


require('chai').use(
    require('chai-as-promised')
).should()


function tokens(n) {
    return web3.utils.toWei(n, 'Ether')
}

contract('TokenFarm', (accounts) => {


    let daiToken, dappToken, tokenFarm;

    before(async () => {
        daiToken = await DaiToken.new()
        dappToken = await DappToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await dappToken.transfer(tokenFarm.address, tokens('1000000'))

        await daiToken.transfer(accounts[1], tokens('100'), { from: accounts[0] })


    })

    describe('Mock Dai Deployment', async () => {
        it('deploy DAI token', async () => {
            const name = await daiToken.name()
            assert.equal(name, 'Mock DAI Token');
        })
    })
    describe('Dapp Token Deployment', async () => {
        it('deploy Dapp token', async () => {
            const name = await dappToken.name()
            assert.equal(name, 'DApp Token');
        })
    })

    describe('Token Farm Deployment', async () => {
        it('deploy token farm', async () => {
            const name = await tokenFarm.name()
            assert.equal(name, 'Ash Token Farm');
        })

        it('contract has tokens', async () => {
            let balance = await dappToken.balanceOf(tokenFarm.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })

    })

    describe('Farming Tokens', async () => {
        it('rewards investors for staking mDai tokens', async () => {
            let result;

            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'investor DAI wallet correct before staking')

            //stake MOCK DAI token
            await daiToken.approve(tokenFarm.address, tokens('100'), { from: accounts[1] })
            await tokenFarm.stakeTokens(tokens('100'), { from: accounts[1] })


            result = await daiToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('0'), 'investor MOCK Dai balance correct after staking')

            result = await daiToken.balanceOf(tokenFarm.address)
            assert.equal(result.toString(), tokens('100'), 'Token correct after staking')


            result = await tokenFarm.isStaking(accounts[1])
            assert.equal(result.toString(), 'true', 'investor is investing')

            await tokenFarm.issueTokens({ from: accounts[0] })

            result = await dappToken.balanceOf(accounts[1])
            assert.equal(result.toString(), tokens('100'), 'investor Dapp token wallet valid after issuance of token')
        })
    })
})
