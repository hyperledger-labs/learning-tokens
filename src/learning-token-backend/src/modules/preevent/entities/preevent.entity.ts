import { Institution } from "src/modules/institutions/entities/institution.entity";
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Preevent extends BaseEntity {
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

    @ManyToOne(() => Institution, (institution) => institution.preevents)
    institution: Institution

}
