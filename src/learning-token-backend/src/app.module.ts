import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmAsyncConfig } from 'src/config/typeorm.config'
import { UsersModule } from 'src/modules/admins/users.module'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './modules/auth/auth.module'
import { InstitutionsModule } from './modules/institutions/institutions.module'
import { InstructorsModule } from './modules/instructors/instructors.module'
import { LearnersModule } from './modules/learners/learners.module'
import { RoleModule } from './modules/role/role.module'
import { SdkKeysModule } from './modules/sdk-keys/sdk-keys.module'
import { PreeventModule } from './modules/preevent/preevent.module'
import { PosteventModule } from './modules/postevent/postevent.module'
import { SmartcontractModule } from './modules/smartcontract/smartcontract.module'
import { EventModule } from './modules/event/event.module'
import { SeederModule } from './modules/role/seeder/seeder.module'
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
            isGlobal: true,
            cache: true
        }),
        TypeOrmModule.forRootAsync(typeOrmAsyncConfig),
        AuthModule,
        UsersModule,
        RoleModule,
        LearnersModule,
        InstructorsModule,
        InstitutionsModule,
        SdkKeysModule,
        PreeventModule,
        PosteventModule,
        SmartcontractModule,
        EventModule,
        SeederModule
    ],
    controllers: [AppController],
    providers: [AppService],
    exports: [TypeOrmModule]
})
export class AppModule {}
