# Learning Token

Run the command on a terminal to start hardhat network && run the testcases

```
npx hardhat node
npx hardhat test test/LearningToken.ts --network localhost
```

Follow below commands for deploying the contract on hardhat network:

```
npx hardhat run scripts/studentAttentance.ts
```

```shell
npx hardhat help
npx hardhat node
npx hardhat test
sol2uml class ./contracts/LearningToken.sol
REPORT_GAS=true npx hardhat test
npx hardhat run scripts/DeployLocalHardhat.ts --network localhost
```

```shell
npx hardhat compile
npx hardhat run scripts/DeployLive.ts --network mumbai
npx hardhat verify --network mumbai <DEPLOYED_CONTRACT_ADDRESS>
```

