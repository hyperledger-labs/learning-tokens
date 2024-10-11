import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Institution } from '../institutions/entities/institution.entity'
import { Instructor } from '../instructors/entities/instructor.entity'
import { Learner } from '../learners/entities/learner.entity'
import { User } from './entities/user.entity'

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(User)
        private readonly adminRepository: Repository<User>,
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>,
        @InjectRepository(Instructor)
        private readonly instructorRepository: Repository<Instructor>,
        @InjectRepository(Learner)
        private readonly learnerRepository: Repository<Learner>
    ) { }

    async findAll(page: number, limit: number, type: string) {
        if (type == 'Institution') {
            const offset = (page - 1) * limit
            const [items, totalCount] = await this.institutionRepository
                .createQueryBuilder('institution')
                .innerJoinAndSelect('institution.role', 'role') //to get the roleId of the user
                .skip(offset)
                .take(limit)
                .orderBy('institution.id', 'ASC')
                .getManyAndCount();

            const totalPages = Math.ceil(totalCount / limit)

            const paginationMetadata = {
                page,
                limit,
                totalCount,
                totalPages
            }

            return {
                data: items, // This contains the paginated data
                pagination: paginationMetadata // This contains the pagination metadata
            }
        } else if (type == 'Instructor') {
            const offset = (page - 1) * limit

            const [items, totalCount] =
                await this.instructorRepository.findAndCount({
                    skip: offset,
                    take: limit,
                    order: {
                        id: 'ASC'
                    }
                })

            const totalPages = Math.ceil(totalCount / limit)

            const paginationMetadata = {
                page,
                limit,
                totalCount,
                totalPages
            }

            return {
                data: items, // This contains the paginated data
                pagination: paginationMetadata // This contains the pagination metadata
            }
        } else if (type == 'Learner') {
            const offset = (page - 1) * limit

            const [items, totalCount] =
                await this.learnerRepository.findAndCount({
                    skip: offset,
                    take: limit,
                    order: {
                        id: 'ASC'
                    }
                })

            const totalPages = Math.ceil(totalCount / limit)

            const paginationMetadata = {
                page,
                limit,
                totalCount,
                totalPages
            }

            return {
                data: items, // This contains the paginated data
                pagination: paginationMetadata // This contains the pagination metadata
            }
        }
    }

    async update(uuid: number, type: string) {
        if (type == 'Institution') {
            const institutionDetails =
                await this.institutionRepository.findOneBy({ id: uuid });
            console.log('Activate institution:', institutionDetails);
            // fix the toggling since button is disabled once activated
            if (!institutionDetails.status) {
                institutionDetails.status = true
                await this.institutionRepository.save(institutionDetails)
                return institutionDetails
            }
        } else if (type == 'Instructor') {
            const instructorDetails = await this.instructorRepository.findOneBy(
                { id: uuid }
            )
            if (instructorDetails.status == false) {
                instructorDetails.status = true
                this.instructorRepository.save(instructorDetails)
                return instructorDetails
            } else {
                instructorDetails.status = false
                this.instructorRepository.save(instructorDetails)
                return instructorDetails
            }
        } else if (type == 'Learner') {
            const learnerDetails = await this.learnerRepository.findOneBy({
                id: uuid
            })
            if (learnerDetails.status == false) {
                learnerDetails.status = true
                this.learnerRepository.save(learnerDetails)
                return learnerDetails
            } else {
                learnerDetails.status = false
                this.learnerRepository.save(learnerDetails)
                return learnerDetails
            }
        }
    }
}
