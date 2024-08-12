import { Preevent } from "src/modules/preevent/entities/preevent.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Postevent {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 30, nullable: true, unique: true })
    eventId: string

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

    // @ManyToOne(() => Preevent, (preevent) => preevent.postevents)
    // @JoinColumn({ name: 'eventId', referencedColumnName: 'eventId' })
    // preevent: Preevent
}
