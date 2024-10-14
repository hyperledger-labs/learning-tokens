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
    courseId: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    courseName: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    fieldOfKnowledge: string

    @Column({ type: 'varchar', length: 255, nullable: true })
    taxonomyOfSkill: string

    @Column({ type: 'int', nullable: true })
    attendanceToken: number

    @Column({ type: 'int', nullable: true })
    scoreTokenAmount: number

    @Column({ type: 'int', nullable: true })
    helpTokenAmount: number

    @Column({ type: 'int', nullable: true })
    instructorScoreToken: number

    @Column({ type: 'varchar', length: 255, nullable: true })
    ipfsHash: string

    @Column({ type: 'bool', default: false })
    status: boolean

    //simple json column to hold all dynamic value of the scoring guide
    @Column({ type: 'simple-json', nullable: true })
    scoringGuide: JSON

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
