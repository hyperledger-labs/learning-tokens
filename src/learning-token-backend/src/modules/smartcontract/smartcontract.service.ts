import { Injectable } from '@nestjs/common'
import { CreateSmartcontractDto } from './dto/create-smartcontract.dto'
import { UpdateSmartcontractDto } from './dto/update-smartcontract.dto'
import { ethers } from 'ethers'
import * as abi from '../../contract-abi/learning-token-abi.json' // Adjust the path as necessary
import { ConfigService } from '@nestjs/config'
import { getWallet } from 'src/utils/kaledio'

@Injectable()
export class SmartcontractService {
    private readonly provider: ethers.JsonRpcProvider
    private readonly contractAddress: string
    private readonly adminPrivateKey: string

    constructor(private readonly configService: ConfigService) {
        // Initialize the provider and contract address using ConfigService
        const rpcUrl = this.configService.get<string>(
            'JSON_RPC_URL',
            'http://localhost:8545'
        )
        this.provider = new ethers.JsonRpcProvider(rpcUrl)

        this.contractAddress =
            this.configService.get<string>('CONTRACT_ADDRESS')
        this.adminPrivateKey =
            this.configService.get<string>('ADMIN_PRIVATE_KEY')
    }

    create(createSmartcontractDto: CreateSmartcontractDto) {
        return 'This action adds a new smartcontract'
    }

    findAll() {
        return `This action returns all smartcontract`
    }

    findOne(id: number) {
        return `This action returns a #${id} smartcontract`
    }

    update(id: number, updateSmartcontractDto: UpdateSmartcontractDto) {
        return `This action updates a #${id} smartcontract`
    }

    remove(id: number) {
        return `This action removes a #${id} smartcontract`
    }
    async callContractFunction(functionName: string, body?: any): Promise<any> {
        try {
            // Create a contract instance
            const { chainId } = await this.provider.getNetwork()
            console.log(chainId) // 42
            const contractAddress = this.contractAddress
            //when we have to call from admin permission
            if (body.isAdmin) {
                const adminPrivateKey = this.adminPrivateKey
                const signer = new ethers.Wallet(adminPrivateKey, this.provider)
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                )
                const result = await contract[body.functionName](...body.params)
                // Convert BigInt values to strings if needed
                const processedResult = this.processResult(result)
                console.log('View Function Result:', processedResult)
                return processedResult
            }
            if (body.isWrite) {
                const wallet = await getWallet(body.type, body.id)
                const adminPrivateKey = wallet.privateKey
                const signer = new ethers.Wallet(adminPrivateKey, this.provider)
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                )
                const result = await contract[body.functionName](...body.params)
                // Convert BigInt values to strings if needed
                const processedResult = this.processResult(result)
                console.log('View Function Result:', processedResult)
                return processedResult
            }
            if (body.isView) {
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    this.provider
                )
                const result = await contract[body.functionName](...body.params)
                console.log('View Function Result:', result)
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }
    processResult(result: any): any {
        if (typeof result === 'bigint') {
            return result.toString()
        } else if (Array.isArray(result)) {
            return result.map((item) =>
                typeof item === 'bigint' ? item.toString() : item
            )
        } else if (typeof result === 'object' && result !== null) {
            const processedObj: any = {}
            for (const key in result) {
                if (Object.prototype.hasOwnProperty.call(result, key)) {
                    processedObj[key] =
                        typeof result[key] === 'bigint'
                            ? result[key].toString()
                            : result[key]
                }
            }
            return processedObj
        } else {
            return result
        }
    }
}
