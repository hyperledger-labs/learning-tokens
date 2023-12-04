import { Injectable } from '@nestjs/common'
import { CreateLearnerDto } from './dto/create-learner.dto'
import { UpdateLearnerDto } from './dto/update-learner.dto'

@Injectable()
export class LearnersService {
    create(createLearnerDto: CreateLearnerDto) {
        return 'This action adds a new learner'
    }

    findAll() {
        return `This action returns all learners`
    }

    findOne(id: number) {
        return `This action returns a #${id} learner`
    }

    update(id: number, updateLearnerDto: UpdateLearnerDto) {
        return `This action updates a #${id} learner`
    }

    remove(id: number) {
        return `This action removes a #${id} learner`
    }
}
