const Web3 = require("web3");
const masterChefAbi = require("./build/contracts/MasterChef.json");
const HDWalletProvider = require("@truffle/hdwallet-provider");
var Tx = require("ethereumjs-tx").Transaction;
const Common = require("ethereumjs-common").default;
const addFunction = {
  constant: false,
  inputs: [
    {
      internalType: "uint256",
      name: "amount",
      type: "uint256",
    },
  ],
  name: "mint",
  outputs: [
    {
      internalType: "bool",
      name: "",
      type: "bool",
    },
  ],
  payable: false,
  stateMutability: "nonpayable",
  type: "function",
};
const mnemonic =
  "venue obscure bullet giant balcony blur bread term shy large absent trade";
const privateKey =
  "7311b9c950cfd6e30c8d8e32148525f7051b34d3d857e520dae01533c9cefada";
const provider = new HDWalletProvider(
  mnemonic,
  `https://api.avax-test.network/ext/bc/C/rpc`
);
const web3 = new Web3(`https://api.avax-test.network/ext/bc/C/rpc`);
const masterChefAddress = "0xBDC2f1A1E7E84054c5AE018F36CD22C40Bc256e3";

function encodeFunction() {
  return web3.eth.abi.encodeFunctionCall(addFunction, [
    "11000000000000000000000000",
  ]);
}
// function pendingCake(pid){
//   const contract = new web3.eth.Contract(masterChefAbi.abi,masterChefAddress);
//   contract.methods.pendingCake(pid,"0x8587d0FECb4F222fC833cf999F68DE5664078F46").call().then(console.log);
// };
async function estimateGas(data, address) {
  return await web3.eth.estimateGas({
    to: address,
    from: provider.getAddress(0),
    data: data,
  });
}
async function execute(lpAddress) {
  console.log(`add lp ${lpAddress}`);
  var gasPrice = await web3.eth.getGasPrice();
  console.log(`gas price ${gasPrice}`);
  var encodedFn = encodeFunction(lpAddress);
  var nonce = await web3.eth.getTransactionCount(provider.getAddress(0));
  console.log(`encoded fn ${encodedFn}`);
  var estimatedGas = await estimateGas(encodedFn, lpAddress);
  var rawTransaction = {
    from: provider.getAddress(0),
    data: encodedFn,
    gasPrice: web3.utils.toHex(gasPrice),
    gas: web3.utils.toHex(estimatedGas),
    to: lpAddress,
    nonce: nonce,
  };
  console.log(`gas fee ${estimatedGas}`);
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
//execute("0x809Efde6011DD5D641394f03f3F260B43D083a32");
execute("0x2d8B95bB9C9efBA6AEfF819ab9F5751ECa9B207C");
// var cr = new web3.eth.Contract(masterChefAbi.abi,masterChefAddress);
// cr.methods.poolLength().call().then((value)=>{
//   for(var i=0; i<value; i++){
//     cr.methods.poolInfo([i]).call().then(console.log)
//   }
// });

/// usdc|metis 0x5255b7EF2204C0e80487791edD001db88B1b4953
// metis|war 0x3E107323D621C708289aDBbC7D68112700005ea4
// pendingCake(1);
