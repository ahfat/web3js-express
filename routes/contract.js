var express = require('express')
var router = express.Router()
var config = require('../config')
const Web3 = require('web3')

const abi = config.events.abi
const contractAddress = config.events.contractAddress
const web3 = new Web3( config.common.rpcURL )
const contract = new web3.eth.Contract( abi, contractAddress )

// query number value
contract.methods.number().call()
.then( (number) => {
    console.log( 'value: ', number )

    // display contract only
    router.get('/', function(req, res, next) {
        res.render('contract', { title: 'Contract Operations', contractAddress: contractAddress, contractValue: number })
    })    
    
    // bid button click, bid value
    router.get('/bid/:value', function(req, res, next) {
        console.log( 'bid value: ', req.params.value )
        const bidValue = req.params.value
        const privateKey1 = '0x' + config.common.privateKey1    // increment number
        const txObject = contract.methods.increment( bidValue )
        const encodedTxObject = txObject.encodeABI()
        const newValue = Number(number) + Number(bidValue)

        //gas estimation
        txObject.estimateGas( (error, gas) => {
            console.log( 'Estimated gas: ', gas )
        })
        .then( (gas) => {
            console.log( 'encoded tx: ', encodedTxObject )
            // sign transaction
            return web3.eth.accounts.signTransaction(
                {
                    to: contractAddress, // must supply, otherwise create a new contract
                    data: encodedTxObject,
                    gas: gas,
                    gasLimit: web3.utils.toHex( 55000 ),
                    gasPrice: web3.utils.toHex( web3.utils.toWei('10', 'gwei') )            
                },
                privateKey1
            )
        })
        .then( (signedTx) => {
            // send transaction
            console.log( 'signedTx:', signedTx )
            return web3.eth.sendSignedTransaction( signedTx.rawTransaction )
        })
        .then( (result) => {
            console.log( 'sent signed tx: ', JSON.stringify(result, null, ' '));
            res.render('contract', { title: 'Contract Operations', contractAddress: contractAddress, contractValue: newValue })
        })
        .catch( (error) => {
            console.log( 'Error: ', error )
        })
    })
})
.catch( (error) => {
    console.log( 'Error: ', error )
})

module.exports = router