# Wallet Token Notifier

Wallet Token Notifier is a Node.js script that monitors specified Ethereum addresses for incoming token transactions and sends notifications to Discord using Discord.js. It utilizes Etherscan API to track transactions and save the block number of the last transaction received, enabling it to detect new transactions in subsequent calls.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/falconandrea/wallet-token-notifier.git
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file based on the provided `.env.example`:
   ```dotenv
   ETHERSCAN_APIKEY="YourEtherscanApiKey"
   ETH_WALLETS="0x0001,0x00002"
   DISCORD_CLIENT_TOKEN="YourDiscordBotToken"
   DISCORD_CHANNEL_ID="YourDiscordChannelID"
   ```

## Usage

1. Start the script:
   ```bash
   npm start
   ```

## Features

- **Discord Notifications**: Sends instant notifications to Discord when new token transactions are detected.
- **Etherscan Integration**: Utilizes Etherscan API to retrieve transaction information.
- **Block Number Tracking**: Saves the block number of the last transaction received to detect new transactions in subsequent calls.

## Next Steps

- **Support for Other Networks**: Add support for additional networks such as Base, Polygon, Blast and others.

## Dependencies

- [discord.js](https://discord.js.org/)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [fs](https://nodejs.org/api/fs.html)

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
