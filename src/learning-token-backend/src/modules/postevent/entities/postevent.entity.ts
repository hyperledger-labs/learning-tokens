import { Preevent } from 'src/modules/preevent/entities/preevent.entity'
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Postevent {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string

    @Column({ type: 'varchar', length: 30, nullable: true, unique: false })
    email: string

    @CreateDateColumn({ type: 'varchar', length: 30, nullable: true })
    joinTime: Date

    @CreateDateColumn({ type: 'varchar', length: 30, nullable: true })
    leaveTime: Date

    @ManyToOne(() => Preevent, (preevent) => preevent.postevents)
    preevent: Preevent
}
