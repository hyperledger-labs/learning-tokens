import { Test, TestingModule } from '@nestjs/testing'
import { SmartcontractController } from './smartcontract.controller'
import { SmartcontractService } from './smartcontract.service'

describe('SmartcontractController', () => {
    let controller: SmartcontractController

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SmartcontractController],
            providers: [SmartcontractService]
        }).compile()

        controller = module.get<SmartcontractController>(
            SmartcontractController
        )
    })

    it('should be defined', () => {
        expect(controller).toBeDefined()
    })
})
