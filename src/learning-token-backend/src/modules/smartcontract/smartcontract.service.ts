import { BadRequestException, Injectable } from '@nestjs/common'
import { CreateCourseDto } from './dto/create-course.dto'
import { UpdateSmartcontractDto } from './dto/update-smartcontract.dto'
import { ethers } from 'ethers'
import * as abi from '../../contract-abi/learning-token-abi.json' // Adjust the path as necessary
import { ConfigService } from '@nestjs/config'
import { getWallet } from 'src/utils/kaledio'
import { InjectRepository } from '@nestjs/typeorm'
import { Postevent } from '../postevent/entities/postevent.entity'
import { In, Repository } from 'typeorm'
import { Preevent } from '../preevent/entities/preevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import { getIPFSFULLURL } from 'src/common/helpers/utils.helper'
import { CreateSmartcontractDto } from './dto/create-smartcontract.dto'
import { DistributeTokenDto } from './dto/distrbute-token.dto'
import { Institution } from '../institutions/entities/institution.entity'
import { SmartcontractFunctionsEnum } from 'src/modules/smartcontract/enums/smartcontract-functions.enum'

@Injectable()
export class SmartcontractService {
    private readonly provider: ethers.JsonRpcProvider
    private readonly contractAddress: string
    private readonly adminPrivateKey: string
    private readonly adminWalletId: string
    private readonly institutionWalletId: string
    private readonly instructorWalletId: string
    private readonly learnerWalletId: string
    @InjectRepository(Preevent)
    private preEventRepository: Repository<Preevent>
    @InjectRepository(Learner)
    private learnerRepository: Repository<Learner>
    @InjectRepository(Institution)
    private institutionRepository: Repository<Institution>

    constructor(private readonly configService: ConfigService) {
        this.contractAddress = this.configService.get<string>('CONTRACT_ADDRESS')
        this.adminPrivateKey = this.configService.get<string>('ADMIN_PRIVATE_KEY')
        this.adminWalletId = this.configService.get<string>('ADMIN_HD_WALLET_ID')
        this.institutionWalletId = this.configService.get<string>('INSTITUTION_HD_WALLET_ID')
        this.instructorWalletId = this.configService.get<string>('INSTRUCTOR_HD_WALLET_ID')
        this.learnerWalletId = this.configService.get<string>('LEARNER_HD_WALLET_ID')
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

    async onboardingActor(body): Promise<any> {
        try {
            const wallet = await getWallet(body.role, body.id)
            const actorPrivateKey = wallet.privateKey
            const contractAddress = this.contractAddress
            let rpcUrl = this.configService.get<string>('JSON_RPC_URL', 'http://localhost:8545')
            let messageResponse = ''

            if(!body.isAdmin) {
                rpcUrl = this.configService.get<string>('KALEIDO_HD_WALLET_RPC_URL', 'https://u0zhuv4dtl:P-XiJpeAACDZgL_dVSaUpL4JLmIXeg5lTu5jLHWEUJ4@u0iavbc8n0-u0t9n504n5-hdwallet.us0-aws.kaleido.io/')
            }
            
            const provider = new ethers.JsonRpcProvider(rpcUrl);

            const { chainId } = await provider.getNetwork()
            console.log(chainId) // 42

            const signer = new ethers.Wallet(actorPrivateKey, provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)
            const result = await contract[body.functionName](...body.params)
            // Convert BigInt values to strings if needed
            const processedResult = this.processResult(result)
            console.log('View Function Result:', processedResult)
            
            if (processedResult) {
                switch (body.functionName) {
                    case body.functionName === SmartcontractFunctionsEnum.REGISTER_INSTITUTION:
                        await this.institutionRepository.update(body.institutionId, {
                            status: true
                        })
                        messageResponse = 'Institution onboarded successfully'
                        
                    default:
                        break;
                }
            }
            return {
                message: messageResponse,
                result: processedResult
            }
        } catch (err) {
            console.log('err', err)
            throw new BadRequestException('error in onboarding institution')
        }
    }

    async callContractFunction(functionName: string, body?: any): Promise<any> {
        try {
            // Create a contract instance
            const { chainId } = await this.provider.getNetwork()
            console.log(chainId) // 42
            const contractAddress = this.contractAddress
            //when we have to call from admin permission
            if (body.isAdmin && body.isWrite) {
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

    async createCourse(
        req: any,
        createCourseDto: CreateCourseDto
    ): Promise<any> {
        try {
            // Fetch pre-event and related post-events and scoring guide
            const courseEvent = await this.preEventRepository.findOne({
                where: {
                    meetingEventId: createCourseDto.preEventId
                },
                relations: [
                    'postevents',
                    'onlineEvent.scoringGuide',
                    'institution'
                ]
            })

            // Accumulate all the email addresses of the attendees
            const attendees = courseEvent.postevents.map(
                (postevent: Postevent) => postevent.email
            )

            // Find all the learner IDs with similar email addresses
            const learnerPublicKey = await this.learnerRepository.find({
                where: {
                    email: In(attendees)
                },
                select: ['publicAddress']
            })
            const learnerAddress = learnerPublicKey.map(
                (learner) => learner.publicAddress
            )

            // Retrieve course details
            const _institutionAddress = courseEvent.institution.publicAddress
            const _courseName = createCourseDto.courseName
            const _scoringGuideGradingPolicyBookURL = getIPFSFULLURL(
                courseEvent.onlineEvent.scoringGuide.ipfsHash
            )

            // Get the current timestamp for _createdAt
            const createdAt = Math.floor(Date.now() / 1000)

            // Define the contract address and create a signer
            const contractAddress = this.contractAddress
            const wallet = await getWallet(req.users.role.name, req.user.id)
            const signer = new ethers.Wallet(wallet.privateKey, this.provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)

            // Call to create course function with fixed parameters
            const result = await contract.createCourse(
                _institutionAddress,
                _courseName,
                createdAt,
                learnerAddress,
                _scoringGuideGradingPolicyBookURL
            )
            // Convert BigInt values to strings if needed
            const processedResult = this.processResult(result)

            //update the courseName of scoring Guide in the database
            courseEvent.onlineEvent.scoringGuide.courseName = _courseName

            //maybe need to listen the event and update the course id
            courseEvent.onlineEvent.scoringGuide.courseId =
                processedResult.courseId
            courseEvent.onlineEvent.courseCreateStatus = true
            await this.preEventRepository.save(courseEvent)
            return processedResult
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async distributeToken(
        req: any,
        distrbute: DistributeTokenDto
    ): Promise<any> {
        try {
            // Fetch pre-event and related post-events and scoring guide
            const eventDataForTokenDistribution =
                await this.preEventRepository.findOne({
                    where: {
                        meetingEventId: distrbute.preEventId
                    },
                    relations: ['postevents', 'onlineEvent.scoringGuide']
                })

            // Accumulate all the email addresses of the attendees
            const attendees = eventDataForTokenDistribution.postevents.map(
                (postevent: Postevent) => postevent.email
            )

            // Find all the learner IDs with similar email addresses
            const learnerEntities = await this.learnerRepository.find({
                where: {
                    email: In(attendees)
                },
                select: ['id']
            })
            const learnerIds = learnerEntities.map((learner) => learner.id)

            // Retrieve course details
            const courseId =
                eventDataForTokenDistribution.onlineEvent.scoringGuide.courseId
            const fieldOfKnowledge =
                eventDataForTokenDistribution.onlineEvent.scoringGuide
                    .fieldOfKnowledge
            const taxonomyOfSkill =
                eventDataForTokenDistribution.onlineEvent.scoringGuide
                    .taxonomyOfSkill

            // Get the current timestamp for _createdAt
            const createdAt = Math.floor(Date.now() / 1000)

            // Define the contract address and create a signer
            const contractAddress = this.contractAddress
            const wallet = await getWallet(req.user.role.name, req.user.id)
            const signer = new ethers.Wallet(wallet.privateKey, this.provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)

            let result: any
            // Call the batchMintAttendanceToken function with fixed parameters
            if (distrbute.functionName === 'batchMintAttendanceToken') {
                const amount = new Array(learnerIds.length).fill(
                    eventDataForTokenDistribution.onlineEvent.scoringGuide
                        .attendanceToken
                )
                result = await contract.batchMintAttendanceToken(
                    learnerIds,
                    amount,
                    courseId,
                    createdAt,
                    fieldOfKnowledge,
                    taxonomyOfSkill
                )
                eventDataForTokenDistribution.onlineEvent.attendanceTokenMintStatus =
                    true
                await this.preEventRepository.save(
                    eventDataForTokenDistribution
                )
            }
            if (distrbute.functionName === 'batchMintScoreToken') {
                const amount = new Array(learnerIds.length).fill(
                    eventDataForTokenDistribution.onlineEvent.scoringGuide
                        .scoreTokenAmount
                )
                result = await contract.batchMintScoreToken(
                    learnerIds,
                    amount,
                    courseId,
                    createdAt,
                    fieldOfKnowledge,
                    taxonomyOfSkill
                )
                eventDataForTokenDistribution.onlineEvent.scoreTokenMintStatus =
                    true
                await this.preEventRepository.save(
                    eventDataForTokenDistribution
                )
            }
            if (distrbute.functionName === 'batchMintHelpingToken') {
                const amount = new Array(learnerIds.length).fill(
                    eventDataForTokenDistribution.onlineEvent.scoringGuide
                        .helpTokenAmount
                )
                result = await contract.batchMintHelpingToken(
                    learnerIds,
                    amount,
                    courseId,
                    createdAt,
                    fieldOfKnowledge,
                    taxonomyOfSkill
                )
                eventDataForTokenDistribution.onlineEvent.helpTokenMintStatus =
                    true
                await this.preEventRepository.save(
                    eventDataForTokenDistribution
                )
            }

            if (distrbute.functionName === 'batchMintInstructorScoreToken') {
                const amount = new Array(learnerIds.length).fill(
                    eventDataForTokenDistribution.onlineEvent.scoringGuide
                        .instructorScoreToken
                )
                result = await contract.batchMintInstructorScoreToken(
                    learnerIds,
                    amount,
                    courseId,
                    createdAt,
                    fieldOfKnowledge
                )
                //update status of scoring guide token distributed
                eventDataForTokenDistribution.onlineEvent.scoreTokenMintStatus =
                    true
                await this.preEventRepository.save(
                    eventDataForTokenDistribution
                )
            }
            // Convert BigInt values to strings if needed
            const processedResult = this.processResult(result)
            console.log('View Function Result:', processedResult)
            return processedResult
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
