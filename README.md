# Bitcoin-Address-Utility
A list of CLI based utility functions to generate addresses for bitcoin blockchain

## Getting Started
This repository lists address generation utilties written in typescript. It uses bitcoinjs-lib library to accomplish it.

#### 1. Hierarchical Deterministic (HD) Segregated Witness(Segwit) bitcoin address generator

This utility generates HD Segwit address from mnemonic or seed and path value. It asks user to input choice (seed or mnemonic) followed by value(seed/mnemonic) and Path value. To learn more about HD wallets and mnemonics visit [BIP32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki) and [BIP39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)

#### 2. Multisig Pay-To-Script-Hash(P2SH) Address Generator

This utility generates n-out-of-m multisignature(multisig) pay-to-script-hash(P2SH) address from the inputs provided by user. It asks users for following values
    m : Number of participant accounts
    n : Number of signers required to spend
    public keys : Public keys of participants
On providing correct input values, It processes user inputs and generates a redeem script (P2SH script) and P2SH address. To learn about P2SH follow this amazing [blog post](https://www.soroushjp.com/2014/12/20/bitcoin-multisig-the-hard-way-understanding-raw-multisignature-bitcoin-transactions/)

## Installation
### Prerequisites
Git, Node, npm

Step1 : Clone the repository

    git clone https://github.com/atulrupnar/Bitcoin-Address-Utility.git

Step2 : Install typescript globally

    npm install -g typescript

Step 3 : Install Dependencies(From project directory)

    $npm install

### How to Run

#### Method 1 : Run Typescript directly
a. Install ts-node globally

    $ npm install -g ts-node

b. Run Segwit address generation utility

    $ ts-node address.ts start

c. Run Multisig P2SH address generation utility

    $ ts-node multisig.ts start

#### Method 2 : Compile typescript to javascript and run
a. Compile typescript to javascript

    $ tsc address.ts
    $ tsc multisig.ts

b. Run Segwit address generation utility

    $ node address.js start

c. Run Multisig P2SH address generation utility

    $ node multisig.js start


