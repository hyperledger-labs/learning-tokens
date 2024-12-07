# Learning Token

# Setup the Kaleido infrastructure.
````
1. Create a network (Ohio) then create a node using Ethereum then select Hyperledger Besu.
2. Create an HD wallet for admin, institution, instructor and learner.
3. Fetch indices 0-3 to get the public and private keys for admin, institution, instructor and learner.
4. Fund accounts under Digital Assets > Dashboard > Ether Pool > Select HD Wallet > Select Index.
5. Deploy the smart contract with the command below and verify in Kaleido's Dashboard under Data Explorer > Block Explorer > Transactions.
````

# Run the following command to deploy the smart contract to Kaleido.
```shell
npx hardhat run scripts/DeployLive.ts --network kaleido
```

# Follow below to start fronted and backend

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
