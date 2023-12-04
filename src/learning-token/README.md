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

Follow below to start fronted and backend

```
change .env from learning-token-dashboard with the deployed contract address
start fronted with yarn dev
start backend with yarn start:dev
```

## Project Overview

| Learning Token Sequence Diagram |
| ------------------------------- |

![Imgur](https://imgur.com/WROJOl8.jpg)

| Learning Token Functional Graph |
| ------------------------------- |

![Imgur](https://imgur.com/N3JoxvY.jpg)

| Figure 1: Learner Registration Application Interface |
| ---------------------------------------------------- |

![Imgur](https://imgur.com/JBJoTEL.jpg)

| Figure 2: Instructor Registration Application Interface |
| ------------------------------------------------------- |

![Imgur](https://imgur.com/PO5AjL0.jpg)

| Figure 3: Institution Registration Application Interface |
| -------------------------------------------------------- |

![Imgur](https://imgur.com/jmCW45M.jpg)

| Figure 4: Login Application Interface |
| ------------------------------------- |

![Imgur](https://imgur.com/IUlGxc0.jpg)

| Figure 5: Add Course & Distribute Token Application Interface |
| ------------------------------------------------------------- |

![Imgur](https://imgur.com/BTuTttq.jpg)
![Imgur](https://imgur.com/tJ20Ik9.jpg)

| Figure 6: Skill Wallet Token Application Interface |
| -------------------------------------------------- |

![Imgur](https://imgur.com/BB0Ibt2.jpg)
