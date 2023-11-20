import {
    Body,
    ConflictException,
    Controller,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Post,
    Request,
    UseGuards
} from '@nestjs/common'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import {
    InstitutionLoginRequestDto,
    InstructorLoginRequestDto,
    LearnerLoginRequestDto,
    LoginRequestDto,
    RegisterInstitutionDTO,
    RegisterInstructorDTO,
    RegisterLearnernDTO,
    RegisterRequestDto
} from './dto/auth.dto'
import { AuthService } from './service/auth.service'
@Controller('auth')
export class AuthController {
    @Inject(AuthService)
    private readonly service: AuthService

    @Post('admin-register')
    private async register(@Body() registerRequestDto: RegisterRequestDto) {
        try {
            registerRequestDto.type = 'Admin'
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    @Post('admin-login')
    private async login(@Body() loginRequestDto: LoginRequestDto) {
        try {
            loginRequestDto.type = 'Admin'
            const result = await this.service.login(loginRequestDto)
            if (result) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'User has logged in successfully',
                    result: result
                }
            } else {
                throw new NotFoundException('Invalid Credentials')
            }
        } catch (error) {
            throw new NotFoundException('Invalid Credentials')
        }
    }

    @Post('institution-login')
    private async institution_login(
        @Body() loginRequestDto: InstitutionLoginRequestDto
    ) {
        try {
            loginRequestDto.type = 'Institution'
            const result = await this.service.login(loginRequestDto)
            if (result) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'User has logged in successfully',
                    result: result
                }
            } else {
                throw new NotFoundException('Invalid Credentials')
            }
        } catch (error) {
            throw new NotFoundException('Invalid Credentials')
        }
    }

    @Post('institution-register')
    private async register_institution(
        @Body() registerRequestDto: RegisterInstitutionDTO
    ) {
        try {
            registerRequestDto.type = 'Institution'
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    @Post('learner-login')
    private async learner_login(
        @Body() loginRequestDto: LearnerLoginRequestDto
    ) {
        try {
            loginRequestDto.type = 'Learner'
            const result = await this.service.login(loginRequestDto)
            if (result) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'User has logged in successfully',
                    result: result
                }
            } else {
                throw new NotFoundException('Invalid Credentials')
            }
        } catch (error) {
            throw new NotFoundException('Invalid Credentials')
        }
    }

    @Post('learner-register')
    private async learner_institution(
        @Body() registerRequestDto: RegisterLearnernDTO
    ) {
        try {
            registerRequestDto.type = 'Learner'
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    @Post('instructor-login')
    private async instructor_login(
        @Body() loginRequestDto: InstructorLoginRequestDto
    ) {
        try {
            loginRequestDto.type = 'Instructor'
            const result = await this.service.login(loginRequestDto)
            if (result) {
                return {
                    status: HttpStatus.CREATED,
                    message: 'User has logged in successfully',
                    result: result
                }
            } else {
                throw new NotFoundException('Invalid Credentials')
            }
        } catch (error) {
            throw new NotFoundException('Invalid Credentials')
        }
    }

    @Post('instructor-register')
    private async instructor_institution(
        @Body() registerRequestDto: RegisterInstructorDTO
    ) {
        try {
            registerRequestDto.type = 'Instructor'
            const result = await this.service.register(registerRequestDto)
            return {
                status: HttpStatus.CREATED,
                message: 'User has been created',
                result: result
            }
        } catch (error) {
            throw new ConflictException(error.message)
        }
    }

    /**
     * REFRESHING TOKEN ENDPOINT
     */
    @UseGuards(JwtAuthGuard)
    @Get('refresh-access-token')
    refreshAccessToken(@Request() req) {
        return {
            status: HttpStatus.CREATED,
            message: 'Access token generated',
            result: this.service.refreshToken(req.user)
        }
    }
}
