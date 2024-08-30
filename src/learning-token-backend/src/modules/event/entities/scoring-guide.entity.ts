import { Institution } from 'src/modules/institutions/entities/institution.entity'
import { Postevent } from 'src/modules/postevent/entities/postevent.entity'
import {
    BaseEntity,
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn
} from 'typeorm'

@Entity()
export class ScoringGuide extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    fieldOfKnowledge: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    taxonomyOfSkill: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    ipfsUrl: string

    @Column({ type: 'bool', default: true })
    status: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
