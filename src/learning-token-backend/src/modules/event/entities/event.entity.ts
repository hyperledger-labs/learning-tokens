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
    DeleteDateColumn,
    ManyToOne
} from 'typeorm'
import { ScoringGuide } from './scoring-guide.entity'
import { Instructor } from 'src/modules/instructors/entities/instructor.entity'

@Entity()
export class OnlineEvent extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @ManyToOne(() => Instructor)
    instructor: Instructor

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

    constructor(partial: Partial<OnlineEvent>, scoringGuide: ScoringGuide) {
        super()
        this.scoringGuide = scoringGuide
        Object.assign(this, partial)
    }
}
