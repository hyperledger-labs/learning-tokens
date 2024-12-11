import { NotFoundException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Institution } from '../institutions/entities/institution.entity'
import { SdkKeysService } from './sdk-keys.service'

describe('SdkKeysService', () => {
    let service: SdkKeysService
    let institutionRepository: Repository<Institution>

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SdkKeysService,
                {
                    provide: getRepositoryToken(Institution),
                    useClass: Repository
                }
            ]
        }).compile()

        service = module.get<SdkKeysService>(SdkKeysService)
        institutionRepository = module.get<Repository<Institution>>(
            getRepositoryToken(Institution)
        )
    })

    describe('generateSdkKeyForInstitution', () => {
        it('should generate a unique SDK key for an institution', async () => {
            const institutionId = 1
            const institution = {
                id: institutionId,
                sdkKeys: []
            } as Institution

            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(
                institution
            )
            jest.spyOn(institutionRepository, 'update').mockResolvedValue(
                undefined
            )

            const sdkKey = await service.generateSdkKeyForInstitution(
                institutionId
            )

            expect(sdkKey).toMatch(/^SDK-\d{10}-1-[a-z0-9]{8}$/)
            expect(institutionRepository.update).toHaveBeenCalledWith(
                institutionId,
                { sdkKeys: [sdkKey] }
            )
        })

        it('should throw NotFoundException if institution does not exist', async () => {
            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(null)

            await expect(
                service.generateSdkKeyForInstitution(1)
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('deleteSdkKeyForInstitution', () => {
        it('should delete an SDK key from an institution', async () => {
            const institutionId = 1
            const sdkKey = 'SDK-1234567890-1-abcdefgh'
            const institution = {
                id: institutionId,
                sdkKeys: [sdkKey]
            } as Institution

            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(
                institution
            )
            jest.spyOn(institutionRepository, 'update').mockResolvedValue(
                undefined
            )

            const result = await service.deleteSdkKeyForInstitution(
                institutionId,
                sdkKey
            )

            expect(result).toBe(
                `SDK key ${sdkKey} successfully removed from institution ${institutionId}`
            )
            expect(institutionRepository.update).toHaveBeenCalledWith(
                institutionId,
                { sdkKeys: [] }
            )
        })

        it('should throw NotFoundException if institution does not exist', async () => {
            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(null)

            await expect(
                service.deleteSdkKeyForInstitution(1, 'SDK-123')
            ).rejects.toThrow(NotFoundException)
        })

        it('should throw NotFoundException if SDK key does not exist in institution', async () => {
            const institution = { id: 1, sdkKeys: [] } as Institution

            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(
                institution
            )

            await expect(
                service.deleteSdkKeyForInstitution(1, 'SDK-123')
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('getAllSdkKeysForInstitution', () => {
        it('should retrieve all SDK keys for an institution', async () => {
            const institutionId = 1
            const sdkKeys = ['SDK-1234567890-1-abcdefgh']
            const institution = { id: institutionId, sdkKeys } as Institution

            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(
                institution
            )

            const result = await service.getAllSdkKeysForInstitution(
                institutionId
            )

            expect(result).toEqual(sdkKeys)
        })

        it('should throw NotFoundException if institution does not exist', async () => {
            jest.spyOn(institutionRepository, 'findOne').mockResolvedValue(null)

            await expect(
                service.getAllSdkKeysForInstitution(1)
            ).rejects.toThrow(NotFoundException)
        })
    })

    describe('validateSdkKeyForInstitution', () => {
        it('should validate an SDK key for an institution', async () => {
            const sdkKey = 'SDK-1234567890-1-abcdefgh'
            const institution = {
                id: 1,
                sdkKeys: [sdkKey]
            } as Institution

            jest.spyOn(
                institutionRepository,
                'createQueryBuilder'
            ).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(institution)
            } as any)

            const result = await service.validateSdkKeyForInstitution(sdkKey)

            expect(result).toEqual({ isValid: true })
        })

        it('should throw NotFoundException if SDK key is not valid for any institution', async () => {
            jest.spyOn(
                institutionRepository,
                'createQueryBuilder'
            ).mockReturnValue({
                where: jest.fn().mockReturnThis(),
                getOne: jest.fn().mockResolvedValue(null)
            } as any)

            await expect(
                service.validateSdkKeyForInstitution('SDK-123')
            ).rejects.toThrow(NotFoundException)
        })
    })
})
