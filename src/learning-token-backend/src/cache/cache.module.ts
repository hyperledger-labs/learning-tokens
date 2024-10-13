import {
    CacheModule as BaseCacheModule,
    CACHE_MANAGER,
    Inject,
    Logger,
    Module,
    OnModuleInit
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import * as redisStore from 'cache-manager-redis-store'

@Module({
    imports: [
        BaseCacheModule.registerAsync({
            useFactory: () => {
                return {
                    store: redisStore,
                    isGlobal: true,
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    ttl: +process.env.REDIS_TTL
                }
            }
        })
    ],
    exports: [BaseCacheModule]
})
export class CacheModule implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}
    public onModuleInit(): any {
        const logger = new Logger('Cache')

        // Commands that are interesting to log
        const commands = ['get', 'set', 'del']
        const cache = this.cache
        commands.forEach((commandName) => {
            const oldCommand = cache[commandName]
            cache[commandName] = async (...args) => {
                // Computes the duration
                const start = new Date()
                const result = await oldCommand.call(cache, ...args)
                const end = new Date()
                const duration = end.getTime() - start.getTime()

                // Avoid logging the options
                args = args.slice(0, 2)
                logger.log(
                    `${commandName.toUpperCase()} ${args.join(
                        ', '
                    )} - ${duration}ms`
                )

                return result
            }
        })
    }
}
