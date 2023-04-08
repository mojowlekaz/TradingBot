const ethers = require("ethers");


// require('dotenv').config()


const {BigNumber, utils} = ethers;


const provider = new ethers.providers.WebSocketProvider(
    `wss://sepolia.infura.io/ws/v3/9c4d37d7dd984bb2b652d085e142ddf5`,
    'sepolia'
)


const depositWallet = new ethers.Wallet(
"7168c2f53529039218c2c592a154e166ffc214accdc14f115802e238a71f083a",
provider
)

const mainFnc = async ()  => {
    const depositWalletAddress = await depositWallet.getAddress()
    console.log(`Watching for incoming Transaction to ${depositWalletAddress}`)
    provider.on('pending', (txhash) => {
        // console.log(txhash)
        try {
            provider.getTransaction(txhash).then((tx) => {
                if(tx === null) return
                const {from , to , value} = tx
                if(to === depositWalletAddress)  {
                    console.log(`Receving ${utils.formatEther(value)} ETH from ${from}_`)
                    tx.wait(2).then(async (_receipt) => {
                        const CurrentBalnace = await depositWallet.getBalance('latest')
                        const gasPrice = await provider.getGasPrice()
                        const gasLimit = 21000
                        const maxGasfee = BigNumber.from(gasLimit).mul(gasPrice)

                        const tx = {
                            to: "0xbc7189fCc065ADAE359A82E14a744a40a648d51e",
                            from:   depositWalletAddress,
                            nonce: await depositWallet.getTransactionCount(),
                            value: CurrentBalnace.sub(maxGasfee),
                            chainId: 11155111,
                            gasLimit: gasLimit,
                            gasPrice: gasPrice
                           }

                           depositWallet.sendTransaction(tx).then((_receipt) =>  {
                            console.log(`withdrew ${utils.formatEther(CurrentBalnace.sub(maxGasfee))}  ETH TO YOUR NOMAL ADDRESS ${"0xbc7189fCc065ADAE359A82E14a744a40a648d51e"} ✅`)
                           }, (reason) => {
                            console.error('Failed Transaction' ,reason)
                           })
                    }, (reason) => {
                        console.error(`Withdrawal failed`, reason)
                    })
                }
                console.log(tx)
            })
        } catch (error) {
            console.log(error)
        }
    })
}


const TransferERC20 = async () => {

    try {
        const abi = [
            {
                "inputs": [],
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "tokenOwner",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "spender",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "tokens",
                        "type": "uint256"
                    }
                ],
                "name": "Approval",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "delegate",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "numTokens",
                        "type": "uint256"
                    }
                ],
                "name": "approve",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "receiver",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "numTokens",
                        "type": "uint256"
                    }
                ],
                "name": "transfer",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "from",
                        "type": "address"
                    },
                    {
                        "indexed": true,
                        "internalType": "address",
                        "name": "to",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "internalType": "uint256",
                        "name": "tokens",
                        "type": "uint256"
                    }
                ],
                "name": "Transfer",
                "type": "event"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "buyer",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "numTokens",
                        "type": "uint256"
                    }
                ],
                "name": "transferFrom",
                "outputs": [
                    {
                        "internalType": "bool",
                        "name": "",
                        "type": "bool"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "owner",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "delegate",
                        "type": "address"
                    }
                ],
                "name": "allowance",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "tokenOwner",
                        "type": "address"
                    }
                ],
                "name": "balanceOf",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "decimals",
                "outputs": [
                    {
                        "internalType": "uint8",
                        "name": "",
                        "type": "uint8"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "name",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "symbol",
                "outputs": [
                    {
                        "internalType": "string",
                        "name": "",
                        "type": "string"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            },
            {
                "inputs": [],
                "name": "totalSupply",
                "outputs": [
                    {
                        "internalType": "uint256",
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "stateMutability": "view",
                "type": "function"
            }
        ]
        const CA = "0xdb9A5D520Da225d9FF88a07994BFe30275FA4e5c"
        const depositWalletAddress = await depositWallet.getAddress()
        console.log(`Watching for incoming Transaction to ${depositWalletAddress}`)
        const provider = new ethers.providers.WebSocketProvider(`wss://sepolia.infura.io/ws/v3/9c4d37d7dd984bb2b652d085e142ddf5`,)
        const wallet = new ethers.Wallet("7168c2f53529039218c2c592a154e166ffc214accdc14f115802e238a71f083a", provider);
       const signer = wallet.provider.getSigner(wallet.address);
        let  contract = new ethers.Contract(CA,  abi, signer);
        const balance = await contract.balanceOf(depositWalletAddress)
        console.log('balance', BigNumber.from(balance))
        await contract.transfer('0xbc7189fCc065ADAE359A82E14a744a40a648d51e', 100);
        console.log("transferreds")
    } catch (error) {
        console.log(error)
    }


}
TransferERC20()