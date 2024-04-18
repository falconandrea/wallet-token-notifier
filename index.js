// Load DotEnv
require("dotenv").config();
const fs = require("fs");
const Discord = require("discord.js");
const EmbedBuilder = require("discord.js").EmbedBuilder;
const client = new Discord.Client({
  intents: [
    "Guilds",
    "GuildMessages",
    "MessageContent",
    "GuildMessages",
    "GuildMembers",
  ],
});
const discordToken = process.env.DISCORD_CLIENT_TOKEN;
client.login(discordToken);

const wallets = process.env.ETH_WALLETS.split(",") || [];
let lastBlocks = {};

// Check if "last_blocks.json" exists or create it
try {
  if (fs.existsSync("./last_blocks.json"))
    lastBlocks = require("./last_blocks.json");
  else {
    fs.writeFileSync("./last_blocks.json", JSON.stringify({}, null, 2));
  }
} catch (err) {
  console.log("error during reading json file", err);
}

const scanLinks = {
  ETH: `https://api.etherscan.io/api?module=account&action=tokentx&page=1&offset=100&&endblock=27025780&sort=desc&apikey=${process.env.ETHERSCAN_APIKEY}`,
};

// Create object with chains and wallets
const chains = Object.keys(scanLinks);
for (const chain of chains) {
  if (!lastBlocks[chain]) {
    lastBlocks[chain] = {};
  }
  // Add wallets
  for (const wallet of wallets) {
    if (!lastBlocks[chain][wallet.toUpperCase()]) {
      lastBlocks[chain][wallet.toUpperCase()] = 0;
    }
  }
}

const getResult = async (url, chain, wallet, startblock) => {
  const urlToCall = `${url}&address=${wallet}&startblock=${startblock}`;
  const result = await fetch(urlToCall).then((res) => res.json());
  const txs = result.result;
  const channel = await client.channels.fetch(process.env.DISCORD_CHANNEL_ID);

  wallet = wallet.toUpperCase();

  if (txs.length > 0) {
    // Update the block numbers inside array
    lastBlocks[chain][wallet] = parseInt(txs[0].blockNumber) + 1;

    // Check possible airdrops
    for (const tx of txs) {
      if (tx.to.toUpperCase() === wallet) {
        // Send message to Discord
        const message = new EmbedBuilder()
          .setTitle("New token received")
          .addFields(
            { name: "Chain", value: chain },
            { name: "Wallet", value: wallet },
            { name: "Token Name", value: tx.tokenName },
            { name: "Token Symbol", value: tx.tokenSymbol },
            { name: "Contract Address", value: tx.contractAddress }
          );
        channel.send({ embeds: [message] });
      }
    }
  }
};

const main = async () => {
  for (const [network, url] of Object.entries(scanLinks)) {
    for (const wallet of wallets) {
      console.log(network, wallet);
      const startblock = lastBlocks[network][wallet.toUpperCase()] || 0;

      await getResult(url, network, wallet, startblock);

      // Wait for 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Update the json with the last block numbers
  fs.writeFileSync("./last_blocks.json", JSON.stringify(lastBlocks, null, 2));
};

// Call main function and terminate the script
main().then(() => {
  process.exit(0);
});
