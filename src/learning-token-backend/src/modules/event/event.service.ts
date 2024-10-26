import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { CreateScoringGuideDTO } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ScoringGuide } from './entities/scoring-guide.entity'
import { CreateEventDto } from './dto/create-scoring-guide.dto'
import { PinataSDK } from 'pinata'
import * as dotenv from 'dotenv'
import { OnlineEvent } from './entities/event.entity'
import * as fs from 'fs' // If you are working with files from the filesystem
import { Preevent, PreEventEnum } from '../preevent/entities/preevent.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
dotenv.config()

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Preevent)
        private readonly preEventRepository: Repository<Preevent>,
        @InjectRepository(OnlineEvent)
        private readonly eventRepository: Repository<OnlineEvent>,
        @InjectRepository(ScoringGuide)
        private readonly scoringGuideRepository: Repository<ScoringGuide>
    ) {}
    create(createEventDto: CreateEventDto) {
        try {
            const event = this.eventRepository.create(createEventDto)

            return this.eventRepository.save(event)
        } catch (error) {
            throw new HttpException('Something went wrongs', 400, {
                cause: new Error('Some Error')
            })
        }
    }

    async createScoringGuide(createScoringGuideDTO: CreateScoringGuideDTO) {
        try {
            const isPreEventExists = await this.preEventRepository.findOne({
                where: { id: createScoringGuideDTO.preEventId },
                relations: ['onlineEvent.scoringGuide', 'instructor']
            })
            //every scoring guide should have an isPreEventExists
            if (!isPreEventExists) {
                throw new BadRequestException('Event does not exist')
            }

            if (isPreEventExists?.onlineEvent?.scoringGuide) {
                const ipfsUrl = await this.uploadToPinata(
                    createScoringGuideDTO,
                    isPreEventExists.instructor
                )
                await this.scoringGuideRepository.update(
                    isPreEventExists.onlineEvent.scoringGuide.id,
                    {
                        ipfsHash: ipfsUrl.IpfsHash,
                        fieldOfKnowledge:
                            createScoringGuideDTO.fieldOfKnowledge,
                        taxonomyOfSkill: createScoringGuideDTO.taxonomyOfSkill,
                        attendanceToken: createScoringGuideDTO.attendanceToken,
                        scoreTokenAmount:
                            createScoringGuideDTO.scoreTokenAmount,
                        helpTokenAmount: createScoringGuideDTO.helpTokenAmount,
                        instructorScoreToken:
                            createScoringGuideDTO.instructorScoreToken
                    }
                )
                await this.preEventRepository.update(isPreEventExists.id, {
                    status: PreEventEnum.REVIEWWALLETS
                })
                return {
                    status: 201,
                    message: 'Scoring guide created successfully'
                }
            } else {
                throw new BadRequestException('Scoring guide not created')
            }
        } catch (error) {
            console.log(error)
            throw new HttpException('message', 400, {
                cause: new Error('Some Error')
            })
        }
    }

    findAll() {
        return `This action returns all event`
    }

    findOne(id: number) {
        return `This action returns a #${id} event`
    }

    update(id: number, updateEventDto: UpdateEventDto) {
        return `This action updates a #${id} event`
    }

    remove(id: number) {
        return `This action removes a #${id} event`
    }

    async uploadToPinata(
        scoringGuide: CreateScoringGuideDTO,
        instructorData: Instructor
    ): Promise<any> {
        try {
            const pinata = new PinataSDK({
                pinataJwt: process.env.PINATA_JWT
            })
            const upload = await pinata.upload.json({
                eventId: scoringGuide.preEventId,
                meetingEventId: scoringGuide.meetingEventId,
                instructorName: instructorData.name,
                instructorEmail: instructorData.email,
                fieldOfKnowledge: scoringGuide.fieldOfKnowledge,
                taxonomyOfSkill: scoringGuide.taxonomyOfSkill,
                attendanceTokenPerLesson: scoringGuide.attendanceToken,
                scoringTokenPerLesson: scoringGuide.scoreTokenAmount,
                helpTokenPerLesson: scoringGuide.helpTokenAmount,
                instructorScoreTokenPerLesson: scoringGuide.instructorScoreToken
            })
            return upload
        } catch (error) {
            console.log(error)
        }
    }
}
