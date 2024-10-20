import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Institution } from '../institutions/entities/institution.entity'

@Injectable()
export class SdkKeysService {
    constructor(
        @InjectRepository(Institution)
        private readonly institutionRepository: Repository<Institution>
    ) {}

    /**
     * Generates a unique SDK key for an institution.
     *
     * @author Weber Dubois
     * @param id The ID of the institution for which to generate the SDK key.
     * @returns The generated SDK key.
     */
    async generateSdkKeyForInstitution(id: number): Promise<string> {
        const institutionExists = await this.institutionRepository.findOne({
            where: { id, status: true }
        })
        if (!institutionExists) {
            throw new NotFoundException(
                `Institution does not exist or activated`
            )
        }

        // Generate a unique SDK key
        const timestamp = Date.now().toString().slice(-10)
        const randomPart = Math.random().toString(36).substring(2, 10)
        const sdkKey = `LTN-${timestamp}-${id}-${randomPart}`

        await this.institutionRepository.update(id, { sdkKeys: sdkKey })

        return sdkKey
    }

    /**
     * Gets a unique SDK key for an institution.
     *
     * @author Khairul Hasan
     * @param id The ID of the institution for which to generate the SDK key.
     * @returns The generated SDK key.
     */
    async getSdkKeyForInstitution(id: number): Promise<string> {
        const institutionExists = await this.institutionRepository.findOne({
            where: { id }
        })
        if (!institutionExists) {
            throw new NotFoundException(`Institution with ID ${id} not found`)
        }
        return institutionExists.sdkKeys
    }

    /**
     * Deletes an SDK key from an institution.
     *
     * @author Weber Dubois
     * @param id The ID of the institution from which to delete the SDK key.
     * @param sdkKey The SDK key to delete.
     * @returns A message indicating the action performed.
     */
    async deleteSdkKeyForInstitution(
        id: number,
        sdkKey: string
    ): Promise<string> {
        const institution = await this.institutionRepository.findOne({
            where: { id }
        })
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${id} not found`)
        }
        if (!institution.sdkKeys.includes(sdkKey)) {
            throw new NotFoundException(
                `SDK key ${sdkKey} not found in institution ${id}`
            )
        }
        const updatedSdkKeys = null
        await this.institutionRepository.update(id, { sdkKeys: updatedSdkKeys })
        return `SDK key ${sdkKey} successfully removed from institution ${id}`
    }

    /**
     * Retrieves all SDK keys for an institution.
     *
     * @author Weber Dubois
     * @param id The ID of the institution for which to retrieve SDK keys.
     * @returns An array of SDK keys.
     */
    async getAllSdkKeysForInstitution(id: number): Promise<string> {
        const institution = await this.institutionRepository.findOne({
            where: { id }
        })
        if (!institution) {
            throw new NotFoundException(`Institution with ID ${id} not found`)
        }
        return institution.sdkKeys
    }

    /**
     * Validates an SDK key for a specific institution.
     *
     * @author Weber Dubois
     * @param sdkKey The SDK key to validate.
     * @returns A boolean indicating if the SDK key is valid for the institution.
     */
    async validateSdkKeyForInstitution(
        sdkKey: string
    ): Promise<{ isValid: boolean }> {
        const institution = await this.institutionRepository
            .createQueryBuilder('institution')
            .where('"institution"."sdkKeys"::jsonb @> :sdkKey::jsonb', {
                sdkKey: JSON.stringify([sdkKey])
            })
            .getOne()
        if (!institution) {
            throw new NotFoundException(
                `SDK key ${sdkKey} is not valid for any institution`
            )
        }
        return { isValid: true }
    }

    async validateSecretKey(secretKey: string): Promise<boolean> {
        const keyExists = await this.institutionRepository.findOne({
            where: { sdkKeys: secretKey }
        })
        return !!keyExists
    }
}
