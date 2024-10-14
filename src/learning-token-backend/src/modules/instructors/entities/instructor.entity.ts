import { Exclude } from 'class-transformer'
import { IsEmail, IsString } from 'class-validator'
import { Preevent } from 'src/modules/preevent/entities/preevent.entity'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
@Entity()
export class Instructor extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 30, nullable: true })
    name: string

    @Column({
        type: 'varchar',
        length: 50,
        unique: true,
        nullable: false
    })
    @IsEmail()
    email: string

    @Exclude()
    @Column({ type: 'varchar', length: 255, nullable: false })
    @IsString()
    password: string

    @Column({ type: 'varchar', length: 30, nullable: true })
    avatarUrl: string

    @Column({ type: 'boolean', default: false })
    status: boolean

    @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
    publicAddress: string

    @OneToMany(() => Preevent, (preevent) => preevent.instructor)
    preevent: Preevent[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date
}
