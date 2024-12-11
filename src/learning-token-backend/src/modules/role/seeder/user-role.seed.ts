import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcrypt'
import { Role } from '../entities/role.entity'
import { Repository } from 'typeorm'
import { User } from 'src/modules/admins/entities/user.entity'
import { RoleEnum } from 'src/modules/admins/enums/user.enum'
import { use } from 'passport'
import * as dotenv from 'dotenv'
import { getWallet } from 'src/utils/kaledio'
dotenv.config()
@Injectable()
export class UserSeed implements OnModuleInit {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    public async onModuleInit() {
        await this.run()
    }

    public async run() {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash('password', salt)
        //insert mock data to role repository if empty from RoleEnum
        const roles = Object.values(RoleEnum).map((roleName) => ({
            name: roleName,
            isAdmin: false
        }))

        roles.map(async (role) => {
            const newRole = new Role()
            if (role.name == RoleEnum.ADMIN) {
                newRole.name = role.name
                newRole.isAdmin = true
            } else {
                newRole.name = role.name
                newRole.isAdmin = false
            }
            const isRoleExist = await this.roleRepository.findOne({
                where: { name: role.name }
            })

            if (isRoleExist) {
                return
            } else {
                await this.roleRepository.save(newRole)
            }
        })
        const adminRole = await this.roleRepository.findOne({
            where: { name: RoleEnum.ADMIN }
        })
        if (adminRole) {
            //check if user exist before saving
            const userExist = await this.userRepository.findOne({
                where: { email: 'admin@gmail.com' }
            })
            if (userExist) {
                return
            } else {
                // const wallet = await getWallet('admin', 1)
                const user = new User()
                user.name = 'Admin'
                user.publicAddress = process.env.ADMIN_PUBLIC_KEY
                user.email = 'admin@gmail.com'
                user.password = hashedPassword
                user.role = adminRole
                // user.publicAddress = wallet.address
                await this.userRepository.save(user)
            }
        }
    }
}
