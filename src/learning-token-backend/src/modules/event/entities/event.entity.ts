import { Preevent } from 'src/modules/preevent/entities/preevent.entity'
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    OneToOne,
    JoinColumn,
    DeleteDateColumn
} from 'typeorm'
import { ScoringGuide } from './scoring-guide.entity'

@Entity()
export class OnlineEvent extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    // @OneToOne(() => Preevent)
    // @JoinColumn()
    // preevent: Preevent

    @OneToOne(() => ScoringGuide)
    @JoinColumn()
    scoringGuide: ScoringGuide

    @Column({ type: 'boolean', default: false })
    courseCreateStatus: boolean

    @Column({ type: 'boolean', default: false })
    attendanceTokenMintStatus: boolean

    @Column({ type: 'boolean', default: false })
    scoreTokenMintStatus: boolean

    @Column({ type: 'boolean', default: false })
    helpTokenMintStatus: boolean

    @Column({ type: 'boolean', default: false })
    mintInstructorScoreTokenStatus: boolean

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
