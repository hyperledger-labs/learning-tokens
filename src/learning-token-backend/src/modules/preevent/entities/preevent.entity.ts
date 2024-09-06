import { OnlineEvent } from 'src/modules/event/entities/event.entity'
import { Institution } from 'src/modules/institutions/entities/institution.entity'
import { Instructor } from 'src/modules/instructors/entities/instructor.entity'
import { Learner } from 'src/modules/learners/entities/learner.entity'
import { Postevent } from 'src/modules/postevent/entities/postevent.entity'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'

@Entity()
export class Preevent extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 30, nullable: false, unique: true })
    meetingEventId: string

    @OneToOne(() => OnlineEvent)
    @JoinColumn()
    onlineEvent: OnlineEvent

    @Column({ type: 'varchar', length: 30, nullable: true })
    eventName: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    eventType: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    description: string

    @CreateDateColumn({ type: 'varchar', length: 30, nullable: true })
    eventDate: Date

    @Column({ type: 'varchar', length: 30, nullable: true })
    speakerName: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    speakerEmail: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    speakerTitle: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    organization: string

    @ManyToOne(() => Institution, (institution) => institution.preevents)
    institution: Institution

    @OneToMany(() => Postevent, (postevents) => postevents.preevent)
    postevents: Postevent[]

    @ManyToOne(() => Instructor, (instructor) => instructor.preevent)
    instructor: Instructor

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
