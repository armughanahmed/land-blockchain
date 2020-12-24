var Web3 = require("web3");
const { LAND } = require("../utils/constants");
const landABI = require("../contract/LandABI.json");

const OPTIONS = {
  transactionConfirmationBlocks: 1,
  transactionBlockTimeout: 5,
};

//Initialize Web3 for rinkeby and mainnet
const web3 = new Web3(`http://localhost:8545`, null, OPTIONS);

const landContract = new web3.eth.Contract(landABI, LAND);
let _nonce = 0;

const getNonce = async () => {
  try {
    // console.log(web3)
    const nonce = await web3.eth.getTransactionCount(
      "0x8651355F1530aB11Fbd03cb4051d21C317D73FF4",
      "pending"
    );
    _nonce = nonce;
    console.log("Nonce updated!");
    return nonce;
  } catch (e) {
    console.error("ERROR getNonceByEthAddress -> ", e);
  }
};
getNonce();

// exports.TransferTokens = async (_to) => {
//   try {
//     // TRANSFER XIO TOKENS
//     let rawTransaction = {
//       from: "0x39eD02366b3134740108bF1b362E69c4B9E041cC",
//       to: XIO_TOKEN_ADDRESS,
//       data: xioTokenContract.methods
//         .transfer(_to, Web3.utils.toWei("1"))
//         .encodeABI(),
//       gasPrice: 25 * 1000000000,
//       nonce: _nonce++,
//       gasLimit: 70000,
//       chainId: 4,
//     };
//     const signed = await web3.eth.accounts.signTransaction(
//       rawTransaction,
//       "e425e8c53ac5fbae76b339a5948a826c38faf6949b833a120937c694c6d0bb5a"
//     );
//     const _txnR = await web3.eth.sendSignedTransaction(signed.rawTransaction);
//     console.log(`Transaction hash: ${_txnR.transactionHash}`);
//     let rawTransactionEth = {
//       from: "0x39eD02366b3134740108bF1b362E69c4B9E041cC",
//       to: _to,
//       value: web3.utils.toHex(Web3.utils.toWei("0.01")),
//       gasPrice: 25 * 1000000000, // converts the gwei price to wei
//       nonce: _nonce++,
//       gasLimit: 70000,
//       chainId: 4, // EIP 155 chainId - mainnet: 1, rinkeby: 4
//     };

//     const signedEth = await web3.eth.accounts.signTransaction(
//       rawTransactionEth,
//       "e425e8c53ac5fbae76b339a5948a826c38faf6949b833a120937c694c6d0bb5a"
//     );
//     const _txnREth = await web3.eth.sendSignedTransaction(
//       signedEth.rawTransaction
//     );
//     console.log(`Transaction hash: ${_txnREth.transactionHash}`);
//     return { _txnR, _txnREth };
//   } catch (e) {
//     console.error(`address: ${_to} ERROR Transfer -> , ${e} `);
//   }
// };

// exports.getWalletBalances = async (_address, _addresses) => {
//   try {
//     let getData = await balanceContract.methods
//       .getBalances(_address, _addresses)
//       .call();
//     return getData;
//   } catch (e) {
//     console.error(`address: ${_address} ERROR WalletBalances -> , ${e} `);
//   }
// };

exports.balanceOf = async (_address) => {
  try {
    let getData = await landContract.methods.balanceOf(_address).call();
    return getData;
  } catch (e) {
    console.error(`address: ${_address} ERROR Balance -> , ${e} `);
  }
};

exports.getGlobalId = async () => {
  try {
    let getData = await landContract.methods.getGlobalId().call();
    return getData;
  } catch (e) {
    console.error(`ERROR globalId -> , ${e} `);
  }
};
exports.sendRequest = async (
  account,
  private_key,
  encryptedData,
  documentHash
) => {
  try {
    // TRANSFER XIO TOKENS
    let rawTransaction = {
      from: account,
      to: LAND,
      data: landContract.methods
        .sendRequest(encryptedData, documentHash)
        .encodeABI(),
      gasPrice: 25 * 1000000000,
      nonce: await web3.eth.getTransactionCount(account, "pending"),
      gasLimit: 70000,
      chainId: await web3.eth.getChainId(),
    };
    const signed = await web3.eth.accounts.signTransaction(
      rawTransaction,
      private_key
    );
    const _txnR = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log(`Transaction hash: ${_txnR.transactionHash}`);
    return _txnR;
  } catch (e) {
    console.error(`error in sending request -> , ${e} `);
  }
};
