#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commander = require("commander");
var inquirer = require("inquirer");
var chalk = require("chalk");
var bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39')
const bip32 = require('bip32')
const network = bitcoin.networks.bitcoin;

var multisigGenerator = function(m : number, n : number, pubKeyString : string) {
    var pubKeys = pubKeyString.split(/\s/);
    /*console.log("m, n", m, n)
    console.log(pubKeys)*/
    if (n > m) {
        console.log(chalk.red("signers count(n) should not exceed public keys count(m)"));
        return;
    }
    if (pubKeys.length != m) {
        console.log(chalk.red("Public key count does not match with m"));
        console.log("m = ", m, "public key count", pubKeys.length);
        console.log("Public keys", pubKeys);
        return;
    }


    let pKey;
    let keyPairs = [];
    for (var i=0; i < pubKeys.length; i++) {
        pKey = pubKeys[i];
        keyPairs.push(bitcoin.ECPair.fromPublicKey(
                    Buffer.from(pKey, 'hex'), 
                    { network: bitcoin.networks.bitcoin }
                ));
    }
    const keys = keyPairs.map(x => x.publicKey);
    const p2ms = bitcoin.payments.p2ms({
        m: n,
        pubkeys: keys,
        network: bitcoin.networks.bitcoin 
    });
    const p2sh = bitcoin.payments.p2sh({
        redeem: p2ms,
        network: bitcoin.networks.bitcoin 
    });

    //from : bitcoinjs-lib integration docs
    /*var redeemScript = bitcoin.script.multisig.output.encode(2, pubKeys) // 2 of 3
    var scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
    var address = bitcoin.address.fromOutputScript(scriptPubKey)*/

    console.log(chalk.yellow.bold('=========*** Output ***=========='))
    console.log(chalk.green('Multisig Address : '));
    console.log(chalk.cyan(p2sh.address));
    console.log(chalk.green('Redeem Script : '));
    console.log(chalk.cyan(p2sh.redeem.output.toString('hex')));
    console.log(chalk.green('Co-Signers : '));
    console.log(chalk.cyan(JSON.stringify(keys.map(x => { return x.toString('hex') }), null, 4)));
}

var init = function() {
    console.log(chalk.yellow("This program generates an n-out-of-m multisig P2SH bitcoin address."))
    console.log(chalk.yellow("It takes following user inputs"))
    console.log(chalk.green("1. Enter m (Number of accounts to participate)"))
    console.log(chalk.green("2. Enter n (Number of signatures needed to spend)"))
    console.log(chalk.green("3. List of accounts (public keys) separated by space."))
    console.log(chalk.blue("#Sample public keys for referrence"))
    for (var i = 0; i < 5; i++) {
        var key = bitcoin.ECPair.makeRandom({ network: bitcoin.networks.bitcoin });
        var address = bitcoin.payments.p2pkh({ pubkey: key.publicKey, network }).address;
        var pKey = key.publicKey.toString('hex');
        //console.log(pKey);    
        console.log(chalk.blue(pKey))
    }
}

commander
    .version('1.0.0')
    .description('Bitcoin Multisig Script Generator');

commander
    .command('start')
    .alias('s')
    .description('Derive Multisig P2SH Address')
    .action(() => {
        console.log(chalk.yellow.bold('=========*** Bitcoin Multisig Script Generator***=========='))
        init();
        inquirer.prompt([
        {
            type: 'input',
            name: 'm',
            message: "Enter No of public keys to p2sh Script(M)",
            validate: function validateM(m){
                return m > 0 || "m should be nonzero integer value";
            }
        },
        {
            type: 'input',
            name: 'pubKeys',
            message: "Add public keys (separate by space)",
            validate: function validateM(pKeys){
                var arr = pKeys.split(/\s/);
                return pKeys.length > 0 && arr.length > 0 || "Public keys are required";
            }
        },
        {
            type: 'input',
            name: 'n',
            message: "Enter Minimum signers(N)",
            validate: function validateM(n){
                return n > 0 || "n should be nonzero integer value";
            }
        }
    ]).then((answers) => multisigGenerator(parseInt(answers.m), parseInt(answers.n), answers.pubKeys))
    })

if(!process.argv.slice(2).length) {
    commander.outputHelp()
    process.exit()
}
commander.parse(process.argv)