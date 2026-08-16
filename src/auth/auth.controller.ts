import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { ConfirmarEmailDto } from './dto/confirmar-email.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { LoginDto } from './dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('cadastro')
  @UsePipes(new ValidationPipe({ transform: true }))
  async cadastrar(@Body() cadastroDto: CadastroDto) {
    return this.authService.cadastrar(cadastroDto);
  }

  @Post('confirmar-email')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async confirmarEmail(@Body() confirmarEmailDto: ConfirmarEmailDto) {
    return this.authService.confirmarEmail(confirmarEmailDto);
  }

  @Post('reenviar-confirmacao')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async reenviarConfirmacao(@Body() recuperarSenhaDto: RecuperarSenhaDto) {
    return this.authService.reenviarConfirmacao(recuperarSenhaDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<any> {
    return this.authService.login(loginDto, res);
  }
}
