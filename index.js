const Web3  = require('web3');
const masterChefAbi = require('./build/contracts/MasterChef.json')
const HDWalletProvider = require("@truffle/hdwallet-provider");
var Tx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;
const addFunction = {
    inputs: [
      {
        "internalType": "uint256",
        "name": "_allocPoint",
        "type": "uint256"
      },
      {
        "internalType": "contract IBEP20",
        "name": "_lpToken",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "_withUpdate",
        "type": "bool"
      }
    ],
    name: "add",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  };
const mnemonic =
  "venue obscure bullet giant balcony blur bread term shy large absent trade";
const privateKey = '7311b9c950cfd6e30c8d8e32148525f7051b34d3d857e520dae01533c9cefada';
const provider = new HDWalletProvider(
  mnemonic,
  `https://api.avax-test.network/ext/bc/C/rpc`
);
const web3 = new Web3(`https://api.avax-test.network/ext/bc/C/rpc`);
const masterChefAddress = "0x023E2aCfe2f55b75E47801Cf4a9551D9A2B0A9AA";

function encodeFunction(lpAddress){
    return web3.eth.abi.encodeFunctionCall(addFunction,["1000",lpAddress,"false"])
};
// function pendingCake(pid){
//   const contract = new web3.eth.Contract(masterChefAbi.abi,masterChefAddress);
//   contract.methods.pendingCake(pid,"0x8587d0FECb4F222fC833cf999F68DE5664078F46").call().then(console.log);
// };
async function estimateGas(data){
    return await web3.eth.estimateGas({
        to: masterChefAddress,
        from: provider.getAddress(0),
        data: data
    })
}
async function execute(lpAddress){
    console.log(`add lp ${lpAddress}`)
    var gasPrice = await web3.eth.getGasPrice();
    var cr = new web3.eth.Contract(masterChefAbi.abi,masterChefAddress);
    var owner = await cr.methods.owner().call();
    console.log(`owner ${owner}`);
    console.log(`gas price ${gasPrice}`);
    var encodedFn = encodeFunction(lpAddress);
    var nonce = await web3.eth.getTransactionCount(provider.getAddress(0));
    console.log(`encoded fn ${encodedFn}`);
    var estimatedGas = await estimateGas(encodedFn);
    var rawTransaction = {
        from: provider.getAddress(0),
        data: encodedFn,
        gasPrice: web3.utils.toHex(gasPrice),
        gas: web3.utils.toHex(estimatedGas),
        to: masterChefAddress,
        nonce: nonce,
      };
    console.log(`gas fee ${estimatedGas}`)
    // var raw = await web3.eth.accounts.signTransaction(rawTransaction,privateKey);
    // console.log(`raw ${raw}`);
    var tx = new Tx(rawTransaction, {
        common: new Common.forCustomChain(
          "ropsten",
          {
            chainId: 43113,
            url: "https://api.avax-test.network/ext/bc/C/rpc",
          },
          "petersburg"
        ),
      });
    tx.sign(Buffer.from(privateKey, "hex"));
    var serializedTx = tx.serialize();
    console.log(`signed tx : ${serializedTx.toString("hex")}`);
    await web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .then(console.log);

}
//execute("0x5255b7EF2204C0e80487791edD001db88B1b4953");
//execute("0x3E107323D621C708289aDBbC7D68112700005ea4");
// var cr = new web3.eth.Contract(masterChefAbi.abi,masterChefAddress);
// cr.methods.poolLength().call().then((value)=>{
//   for(var i=0; i<value; i++){
//     cr.methods.poolInfo([i]).call().then(console.log)
//   }
// });

/// usdc|metis 0x5255b7EF2204C0e80487791edD001db88B1b4953
// metis|war 0x3E107323D621C708289aDBbC7D68112700005ea4
// pendingCake(1);