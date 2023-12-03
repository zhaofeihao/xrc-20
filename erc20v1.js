const Web3 = require("web3");
const web3 = new Web3(""); //这里写你的rpc节点地址

function sleep(ts) {
  return new Promise((resolve) => setTimeout(resolve, ts));
}

//这里写私钥
const privateKey = '';

const sleepTime = 1000

//发送交易
async function sendTry(tx, privateKey) {
  try {
    var signed = await web3.eth.accounts.signTransaction(tx, privateKey);

    var tran = await web3.eth.sendSignedTransaction(signed.rawTransaction);
    console.log('mint success===>', tran);
    return tran;
  } catch (error) {
    console.log(error);
  }
}

const mintCounter = 1000; // 铭刻次数
const gas = 400000; // 可以去etherscan上查看gas使用情况

async function main() {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey).address;
  let nonce = await web3.eth.getTransactionCount(account);
  const gasPrice =
    (await web3.eth.getGasPrice()) * 1 + web3.utils.toWei("2", "gwei") * 1 + "";

  for (let i = 1; i < mintCounter; i++) {
    // 这里改成你要打的JSON数据
    const dataString = `data:,{"p":"fair-20","op":"mint","tick":"fair","amt":"1000"}`

    const dataHex = Buffer.from(dataString, "utf8").toString("hex");

    const tx = {
      gas,
      gasPrice,
      to: account,
      data: dataHex,
      nonce: nonce++,
    };
    console.log(`第${i}次:`, tx);
    await sendTry(tx, privateKey);
    await sleep(sleepTime)
  }

}

main();