const ethers = require('ethers');
const fs = require('fs');

// 你的以太坊节点的 URL，多配置几个
const nodeUrls = ['RPC1', 'RPC2', 'RPC3'];

const privateKeyFilePath = './privatekeys.txt'; // 替换为私钥文件的路径
const privateKeys = fs
  .readFileSync(privateKeyFilePath, 'utf8')
  .trim()
  .split('\r\n'); // 分割每一行为单独的私钥

// 发送的金额，此处为0转
const amount = ethers.parseEther('0');

const loopCount = 1000;

const number = 22024; // 可以去看当下别人成交的gasLimit，然后设置一个比较大的值
const hexString = '0x' + number.toString(16);

async function main() {
  for (let i = 0; i < loopCount; i++) {
    // 选择私钥
    const senderPrivateKey = privateKeys[i % privateKeys.length];

    // 随机选择一个节点URL
    const provider = new ethers.JsonRpcProvider(
      nodeUrls[Math.floor(Math.random() * nodeUrls.length)]
    );
    const wallet = new ethers.Wallet(senderPrivateKey, provider);

    // 创建并发送交易
    const gasPrice = ((await provider.getFeeData()).gasPrice * 110n) / 100n;

    const tx = {
      to: wallet.address,
      value: amount,
      data: '', // 铭文16进制数据, 这里转 https://ethscriber.xyz/
      gasLimit: hexString,
      gasPrice,
    };

    try {
      const sentTx = await wallet.sendTransaction(tx);
      const receipt = await sentTx.wait();
      console.log(
        `第${i + 1}次,交易哈希 ${receipt.hash},区块高度${receipt.blockNumber}`
      );
    } catch (error) {
      console.error(`Error in transaction ${i}:`, error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
