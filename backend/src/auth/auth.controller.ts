import {Body,Controller,Get,Post,Req,UseGuards,Delete, Param,} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('Profile')
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAGER')
  @Post('create-manager')
  createManager(@Body() dto: SignupDto) {
    return this.authService.createManager(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('MANAGER')
  @Post('create-employee')
  createEmployee(@Body() dto: SignupDto) {
    return this.authService.createEmployee(dto);
  }

  @Get("users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MANAGER")
  getAllUsers() {
    return this.authService.getAllUsers();
  }

  @Delete("users/:id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("MANAGER")
  deleteUser(@Param("id") id: string) {
    return this.authService.deleteUser(id);
  }
}