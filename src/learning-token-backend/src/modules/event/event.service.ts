import { BadRequestException, HttpException, Injectable } from '@nestjs/common'
import { CreateScoringGuideDTO } from './dto/create-event.dto'
import { UpdateEventDto } from './dto/update-event.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ScoringGuide } from './entities/scoring-guide.entity'
import { CreateEventDto } from './dto/create-scoring-guide.dto'
import { join } from 'path'
import { stat, writeFileSync } from 'fs'
import { PDFDocument } from 'pdf-lib'
import axios from 'axios'
import { PinataSDK } from 'pinata'
import * as dotenv from 'dotenv'
import { OnlineEvent } from './entities/event.entity'
import { Preevent } from '../preevent/entities/preevent.entity'
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
                relations: ['onlineEvent.scoringGuide']
            })
            //every scoring guide should have an isPreEventExists
            if (!isPreEventExists) {
                throw new BadRequestException('Event does not exist')
            }
            // const scoringGuide = this.scoringGuideRepository.create(
            //     createScoringGuideDTO
            // )

            // const createdScoringGuide = await this.scoringGuideRepository.save(
            //     scoringGuide
            // )

            if (isPreEventExists?.onlineEvent?.scoringGuide) {
                const blob = await this.generatePdf({
                    ...createScoringGuideDTO
                })
                const ipfsUrl = await this.uploadToPinata(blob)
                //update the scoring guide with the ipfs url

                await this.scoringGuideRepository.update(
                    isPreEventExists.onlineEvent.scoringGuide.id,
                    {
                        ipfsHash: ipfsUrl.IpfsHash,
                        status: true
                    }
                )
                return
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

    async generatePdf(payload: any): Promise<Buffer> {
        const pdfDoc = await PDFDocument.create()
        const page = pdfDoc.addPage()
        page.drawText('Hello, World!', { x: 50, y: 700 })

        const pdfBytes = await pdfDoc.save()
        return Buffer.from(pdfBytes)
    }

    // async generatePdf(payload: any): Promise<Buffer> {
    //     const pdfDoc = await PDFDocument.create()
    //     const page = pdfDoc.addPage()
    //     page.drawText('Hello, World!', { x: 50, y: 700 })

    //     const pdfBytes = await pdfDoc.save()
    //     const pdfBuffer = Buffer.from(pdfBytes)

    //     // Dump the PDF locally for testing purposes
    //     const filePath = join('document.pdf')
    //     writeFileSync(filePath, pdfBuffer)

    //     return pdfBuffer
    // }

    async uploadToPinata(pdfBuffer: any): Promise<any> {
        try {
            const pinata = new PinataSDK({
                pinataJwt: process.env.PINATA_JWT
            })
            const file = new File([pdfBuffer], 'scoringGuide.pdf', {
                type: 'text/plain'
            })
            const upload = await pinata.upload.file(file)
            return upload
        } catch (error) {
            console.log(error)
        }
    }
}
