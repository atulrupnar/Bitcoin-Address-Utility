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

var generateAddress = (choice : string, value : string, path :string) => {
    console.log("choice", choice, "value", value, "path", path);
    var root;
    var re;
    if (choice == "mnemonic") {
		re = /^([a-zA-Z]+(\s|$)){12,}/;
		if (!re.test(value)) {
			console.log(chalk.red("Mnemonic value should be minimum 12 words"));
			return;
		}
		var seed = bip39.mnemonicToSeedSync(value);
		root = bip32.fromSeed(seed);
    } else if (choice == "seed") {
		re = /^[0-9a-fA-F]{64}$/
		if (!re.test(value)) {
			console.log(chalk.red("Seed value should be 64 characters(128 bit) hex value, Please refer sample values"));
			return;
		}
		root = bip32.fromSeed(Buffer.from(value, 'hex'));
    }

    const child1 = root.derivePath(path);
    var address = bitcoin.payments.p2wpkh({ pubkey: child1.publicKey, network }).address;

    console.log(chalk.blue("=====*** Output ***======"));
    console.log(chalk.blue('Address', address))
};

var init = function() {
    console.log(chalk.yellow("This program generates HD Segwit address from seed and path"))
    console.log(chalk.yellow("Seed can be derived from 12 word mnemonic string or user can provide seed value directly"))
    console.log(chalk.blue("#Sample input referrences"))
    console.log(chalk.green("Mnemonic : A 12 word string eg. pray you i lion xyx neck grow low hi my lay ghost"));
    console.log(chalk.green("Seed : 128 bit seed in hex format eg. 123456ddddddddddddabcdefdddddddddddddddddddddddddddddddddd123456"))
    console.log(chalk.green("Path : m/0'/0/0"))
}

commander
    .version('1.0.0')
    .description('Derive HD Segwit Address');

commander
    .command('start')
    .alias('s')
    .description('Derive HD Segwit Address')
    .action(() => {
        console.log(chalk.yellow('=========*** Bitcoin Address Generator ***=========='))
        init();
        inquirer.prompt([
        {
              type: 'list',
              name: 'choice',
              message: 'Select your choice!',
              choices: ['mnemonic', 'seed'],
        },
	    {
        type: 'input',
        name: 'value',
        message: 'Enter Value (Seed/Mnemonic) for your choice',
        validate: function validateStr(val){
            return val.length > 0 || "Value is required";
        }
    },
    {
        type: 'input',
        name: 'path',
        message: "Enter Path eg. (m/0'/0/0)",
        validate: function validatePath(path){
			var re = /^m(\/(\d+|\d+'))+$/;
			return re.test(path) || "Please enter correct path format"
        }
    }]).then((answers) => generateAddress(answers.choice, answers.value, answers.path))
    })

if(!process.argv.slice(2).length) {
    commander.outputHelp()
    process.exit()
}
commander.parse(process.argv)