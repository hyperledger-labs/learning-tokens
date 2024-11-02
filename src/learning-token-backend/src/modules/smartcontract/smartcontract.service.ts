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
import { Preevent, PreEventEnum } from '../preevent/entities/preevent.entity'
import { Learner } from '../learners/entities/learner.entity'
import { getIPFSFULLURL } from 'src/common/helpers/utils.helper'
import { CreateSmartcontractDto } from './dto/create-smartcontract.dto'
import { DistributeTokenDto } from './dto/distrbute-token.dto'
import { Institution } from '../institutions/entities/institution.entity'
import { SmartcontractFunctionsEnum } from 'src/modules/smartcontract/enums/smartcontract-functions.enum'
import { Instructor } from '../instructors/entities/instructor.entity'
import { InstructorsService } from '../instructors/instructors.service'
import { CreateInstructorDto } from '../instructors/dto/create-instructor.dto'
import * as etherjs from 'ethers'
import { OnlineEvent } from '../event/entities/event.entity'
import { ScoringGuide } from '../event/entities/scoring-guide.entity'
declare global {
    interface BigInt {
        toJSON(): string // or `number` if precision loss is acceptable
    }
}

// Attach `toJSON` to BigInt prototype to automatically serialize BigInts as strings
BigInt.prototype.toJSON = function (): string {
    return this.toString() // Ensures precision
}

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
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>
    @InjectRepository(ScoringGuide)
    private scoringGuideRepository: Repository<ScoringGuide>
    @InjectRepository(OnlineEvent)
    private onlineEventRepository: Repository<OnlineEvent>

    constructor(private readonly configService: ConfigService) {
        this.contractAddress =
            this.configService.get<string>('CONTRACT_ADDRESS')
        this.adminPrivateKey =
            this.configService.get<string>('ADMIN_PRIVATE_KEY')
        this.adminWalletId =
            this.configService.get<string>('ADMIN_HD_WALLET_ID')
        this.institutionWalletId = this.configService.get<string>(
            'INSTITUTION_HD_WALLET_ID'
        )
        this.instructorWalletId = this.configService.get<string>(
            'INSTRUCTOR_HD_WALLET_ID'
        )
        this.learnerWalletId = this.configService.get<string>(
            'LEARNER_HD_WALLET_ID'
        )
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
            const rpcUrl = this.configService.get<string>(
                'JSON_RPC_URL',
                'http://localhost:8545'
            )
            let messageResponse = ''

            const provider = new ethers.JsonRpcProvider(rpcUrl)

            const signer = new ethers.Wallet(actorPrivateKey, provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)

            let result = await contract[body.functionName](...body.params)
            //external sleep for 10 seconds
            await new Promise((r) => setTimeout(r, 10000))
            // Convert BigInt values to strings if needed

            // const processedResult = this.processResult(result)
            // console.log('View Function Result:', processedResult)

            if (
                body.functionName ===
                SmartcontractFunctionsEnum.REGISTER_INSTITUTION
            ) {
                await this.institutionRepository.update(
                    {
                        publicAddress: body.params[1]
                    },
                    {
                        status: true
                    }
                )
                messageResponse = 'Institution onboarded successfully'
            } else if (
                body.functionName ===
                SmartcontractFunctionsEnum.REGISTER_INSTRUCTOR
            ) {
                await this.instructorRepository.update(body.id, {
                    status: true
                })
                messageResponse = 'Instructor onboarded successfully'
            } else if (
                body.functionName ===
                SmartcontractFunctionsEnum.ADD_INSTRUCTOR_TO_INSTITUTION
            ) {
                messageResponse = 'Instructor added to institution successfully'
            } else if (
                body.functionName ===
                SmartcontractFunctionsEnum.REGISTER_LEARNER
            ) {
                await this.learnerRepository.update(body.id, {
                    status: true
                })
                messageResponse = 'Learner onboarded successfully'
            }
            if (
                body.functionName ===
                SmartcontractFunctionsEnum.LEARNER_TOKEN_METADATA
            ) {
                messageResponse = 'Learner token metadata fetch successfully'
            } else if (
                body.functionName === SmartcontractFunctionsEnum.TOKEN_BALANCE
            ) {
                messageResponse = 'Token balance fetch successfully'
            }
            return {
                message: messageResponse,
                result: result
            }
        } catch (err) {
            console.log('err', err)
            throw new BadRequestException('error in onboarding institution')
        }
    }

    async callContractFunction(functionName: string, body?: any): Promise<any> {
        try {
            // Create a contract instance
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
                    id: createCourseDto.preEventId
                },
                relations: [
                    'postevents',
                    'onlineEvent',
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
            const wallet = await getWallet(req.user.role.name, req.user.id)
            const actorPrivateKey = wallet.privateKey
            const contractAddress = this.contractAddress
            const rpcUrl = this.configService.get<string>(
                'JSON_RPC_URL',
                'http://localhost:8545'
            )
            const provider = new ethers.JsonRpcProvider(rpcUrl)
            const signer = new ethers.Wallet(actorPrivateKey, provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)
            // Call to create course function with fixed parameters
            const result = await contract.createCourse(
                _institutionAddress,
                _courseName,
                createdAt,
                learnerAddress,
                _scoringGuideGradingPolicyBookURL
            )
            // // Convert BigInt values to strings if needed
            const processedResult = this.processResult(result)

            await this.scoringGuideRepository.update(
                courseEvent.onlineEvent.id,
                {
                    courseId: courseEvent.id,
                    courseName: createCourseDto.courseName
                }
            )
            await this.onlineEventRepository.update(
                courseEvent.onlineEvent.id,
                {
                    courseCreateStatus: true
                }
            )
            await this.preEventRepository.update(courseEvent.id, {
                status: PreEventEnum.TOKENDISTRIBUTION
            })
            return {
                message: 'Course created successfully',
                result: processedResult
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async distributeToken(
        req: any,
        distributeTokenDto: DistributeTokenDto
    ): Promise<any> {
        try {
            // Fetch pre-event and related post-events and scoring guide
            const eventDataForTokenDistribution =
                await this.preEventRepository.findOne({
                    where: {
                        id: distributeTokenDto.preEventId
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

            let learnerIds = []

            if (!distributeTokenDto.userIds) {
                learnerIds = learnerEntities.map((learner) => learner.id - 1)
            } else {
                //iterate over userIds and make id -1 and push to learnerIds
                learnerIds = distributeTokenDto.userIds.map(
                    (userId) => userId - 1
                )
            }
            //return learnerIds
            // Retrieve course details
            const courseId =
                eventDataForTokenDistribution.onlineEvent.scoringGuide
                    .courseId - 1
            const fieldOfKnowledge =
                eventDataForTokenDistribution.onlineEvent.scoringGuide
                    .fieldOfKnowledge
            const taxonomyOfSkill =
                eventDataForTokenDistribution.onlineEvent.scoringGuide
                    .taxonomyOfSkill

            // Get the current timestamp for _createdAt
            const createdAt = Math.floor(Date.now() / 1000)

            // Define the contract address and create a signer
            const wallet = await getWallet(req.user.role.name, req.user.id)
            const actorPrivateKey = wallet.privateKey
            const contractAddress = this.contractAddress
            const rpcUrl = this.configService.get<string>(
                'JSON_RPC_URL',
                'http://localhost:8545'
            )
            const provider = new ethers.JsonRpcProvider(rpcUrl)
            const signer = new ethers.Wallet(actorPrivateKey, provider)
            const contract = new ethers.Contract(contractAddress, abi, signer)
            // Call to create course function with fixed parameters

            let result: any

            // Call the batchMintAttendanceToken function with fixed parameters
            if (
                distributeTokenDto.functionName === 'batchMintAttendanceToken'
            ) {
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

                await this.onlineEventRepository.update(
                    eventDataForTokenDistribution.onlineEvent.id,
                    {
                        attendanceTokenMintStatus: true
                    }
                )
            }
            if (distributeTokenDto.functionName === 'batchMintScoreToken') {
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
                await this.onlineEventRepository.update(
                    eventDataForTokenDistribution.onlineEvent.id,
                    {
                        scoreTokenMintStatus: true
                    }
                )
            }
            if (distributeTokenDto.functionName === 'batchMintHelpingToken') {
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
                await this.onlineEventRepository.update(
                    eventDataForTokenDistribution.onlineEvent.id,
                    {
                        helpTokenMintStatus: true
                    }
                )
            }

            if (
                distributeTokenDto.functionName ===
                'batchMintInstructorScoreToken'
            ) {
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
                await this.onlineEventRepository.update(
                    eventDataForTokenDistribution.onlineEvent.id,
                    {
                        mintInstructorScoreTokenStatus: true
                    }
                )
            }

            if (
                eventDataForTokenDistribution.onlineEvent
                    .scoreTokenMintStatus &&
                eventDataForTokenDistribution.onlineEvent
                    .attendanceTokenMintStatus &&
                eventDataForTokenDistribution.onlineEvent.helpTokenMintStatus &&
                eventDataForTokenDistribution.onlineEvent
                    .mintInstructorScoreTokenStatus
            ) {
                await this.preEventRepository.update(
                    eventDataForTokenDistribution.id,
                    {
                        status: PreEventEnum.COMPLETED
                    }
                )
            }
            return {
                message: 'Token distributed successfully',
                result: result
            }
        } catch (err) {
            console.log(err)
            return err
        }
    }

    async findCourseLearnerAddressAndName(
        preEventId,
        page,
        limit
    ): Promise<any> {
        try {
            const skip = (page - 1) * limit

            return await this.preEventRepository
                .createQueryBuilder('preEvent')
                .leftJoinAndSelect('preEvent.postevents', 'postevent')
                .select([
                    'preEvent.id', // keep the primary preEvent fields you need
                    'postevent.id',
                    'postevent.name', // select specific fields from postevents
                    'postevent.email'
                ])
                .where('preEvent.id = :id', { id: preEventId })
                .skip(skip)
                .take(limit)
                .getOne()
        } catch (err) {
            console.log(err)
            throw new BadRequestException(
                'error in fetching course learner list'
            )
        }
    }

    async processResult(result: any): Promise<any> {
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
