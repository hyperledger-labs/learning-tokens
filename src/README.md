# Instruction to start

Go to each of the directory and make a .env with all necessary values example are also given at each directory

## Anyone can deploy on testnet or hardhat node or hyperledger besu local enviroment

# Instructions to Start

1. Go to each of the directories and create a `.env` file with all necessary values. Examples are provided in each directory.

## Deployment Options

### Testnet, Hardhat Node, or Hyperledger Besu Local Environment

#### Starting with Hardhat Local Node

1. Go to the `learning-token` directory (Make sure `.env` is present with all required values, examples are provided).

```bash
npm i
npx hardhat node
npx hardhat run
npx hardhat run scripts/DeployLocalHardhat.ts --network localhost
```

2. Go to the learning-token-backend directory (Make sure .env is present with all required values, examples are provided).

```
npm i
yarn start:dev
```

3. Go to the learning-token-dashboard directory (Make sure .env is present with all required values, examples are provided).

```
yarn
yarn dev
```

# If anyone wants to start with quorum-test-network with hyperledger besu

1. Go to the `quorum-test-network` directory. start with running

**To start services and the network:**

`./run.sh` starts all the docker containers

**To stop services :**

`./stop.sh` stops the entire network, and you can resume where it left off with `./resume.sh`

`./remove.sh ` will first stop and then remove all containers and images

2. Go to the `learning-token` directory (Make sure `.env` is present with all required values, examples are provided).

Uncomment following line from hardhat.config.ts

```
     besu: {
       accounts: [SUPER_ADMIN_PRI_KEY],
       url: "http://localhost:8545",
       chainId: 1337,
       gasPrice: 0,
       blockGasLimit: 8000000000,
       timeout: 1800000,
     },
```

```bash
npm i
npx hardhat node
npx hardhat run
npx hardhat run scripts/DeployLocalHyperledgerBesu.ts --network besu
```

3. Go to the learning-token-backend directory (Make sure .env is present with all required values, examples are provided).

```
npm i
yarn start:dev
```

4. Go to the learning-token-dashboard directory (Make sure .env is present with all required values, examples are provided).

```
yarn
yarn dev
```
