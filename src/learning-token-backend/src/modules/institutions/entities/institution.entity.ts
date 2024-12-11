import { Exclude } from 'class-transformer'
import { IsArray, IsEmail, IsString } from 'class-validator'
import { Preevent } from 'src/modules/preevent/entities/preevent.entity'
import { Role } from 'src/modules/role/entities/role.entity'
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm'
@Entity()
export class Institution extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number

    @Column({ type: 'varchar', length: 500, nullable: true })
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

    @Column({ type: 'varchar', length: 50, nullable: true })
    latitude: string

    @Column({ type: 'varchar', length: 50, nullable: true })
    longitude: string

    @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
    sdkKeys: string

    @ManyToOne(() => Role)
    role: Role

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @DeleteDateColumn()
    deletedAt: Date

    @Column({ type: 'int', nullable: false })
    roleId: number

    @OneToMany(() => Preevent, (preevent) => preevent.institution)
    preevents: Preevent[]
}
