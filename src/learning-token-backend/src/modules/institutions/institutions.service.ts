import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateInstitutionDto } from './dto/create-institution.dto'
import { UpdateInstitutionDto } from './dto/update-institution.dto'
import { Institution } from './entities/institution.entity'

/**
 * InstitutionsService class handles CRUD operations for institutions.
 *
 * @author Weber Dubois
 */
@Injectable()
export class InstitutionsService {
    constructor(
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>
    ) {}

    /**
     * Creates a new institution.
     *
     * @param createInstitutionDto The data transfer object for creating an institution.
     * @returns A message indicating the action performed.
     */
    create(createInstitutionDto: CreateInstitutionDto) {
        return 'This action adds a new institution'
    }

    /**
     * Retrieves all institutions.
     *
     * @returns A message indicating the action performed.
     */
    async findAll() {
        return await this.institutionRepository.find()
    }

    /**
     * Retrieves a single institution by its ID.
     *
     * @param id The ID of the institution to retrieve.
     * @returns A message indicating the action performed.
     */
    findOne(id: number) {
        return `This action returns a #${id} institution`
    }

    /**
     * Updates an existing institution.
     *
     * @param id The ID of the institution to update.
     * @param updateInstitutionDto The data transfer object for updating an institution.
     * @returns A message indicating the action performed.
     */
    update(id: number, updateInstitutionDto: UpdateInstitutionDto) {
        return `This action updates a #${id} institution`
    }

    /**
     * Deletes an institution by its ID.
     *
     * @param id The ID of the institution to delete.
     * @returns A message indicating the action performed.
     */
    remove(id: number) {
        return `This action removes a #${id} institution`
    }
}
