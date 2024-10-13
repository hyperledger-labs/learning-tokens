import { ExecutionContext } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { SdkKeysController } from './sdk-keys.controller'
import { SdkKeysService } from './sdk-keys.service'

describe('SdkKeysController', () => {
    let controller: SdkKeysController
    let service: SdkKeysService

    const mockSdkKeysService = {
        generateSdkKeyForInstitution: jest.fn((id) => `sdk-key-${id}`),
        deleteSdkKeyForInstitution: jest.fn(
            (id, sdkKey) => `deleted-${sdkKey}`
        ),
        getAllSdkKeysForInstitution: jest.fn((id) => [
            `sdk-key-${id}-1`,
            `sdk-key-${id}-2`
        ])
    }

    const mockJwtAuthGuard = {
        canActivate: (context: ExecutionContext) => true
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SdkKeysController],
            providers: [
                {
                    provide: SdkKeysService,
                    useValue: mockSdkKeysService
                }
            ]
        })
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtAuthGuard)
            .compile()

        controller = module.get<SdkKeysController>(SdkKeysController)
        service = module.get<SdkKeysService>(SdkKeysService)
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })

    it('should generate SDK key for institution', () => {
        const id = '1'
        expect(controller.generateSdkKeyForInstitution(id)).toBe(
            `sdk-key-${id}`
        )
        expect(service.generateSdkKeyForInstitution).toHaveBeenCalledWith(+id)
    })

    it('should delete SDK key for institution', () => {
        const id = '1'
        const sdkKey = 'sdk-key-1'
        expect(controller.deleteSdkKeyForInstitution(id, { sdkKey })).toBe(
            `deleted-${sdkKey}`
        )
        expect(service.deleteSdkKeyForInstitution).toHaveBeenCalledWith(
            +id,
            sdkKey
        )
    })

    it('should get all SDK keys for institution', () => {
        const id = '1'
        expect(controller.getAllSdkKeysForInstitution(id)).toEqual([
            `sdk-key-${id}-1`,
            `sdk-key-${id}-2`
        ])
        expect(service.getAllSdkKeysForInstitution).toHaveBeenCalledWith(+id)
    })
})
