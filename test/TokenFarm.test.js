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
    })
})
