import { Controller, Post, Body, UsePipes, ValidationPipe, HttpCode, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { CadastroDto } from './dto/cadastro.dto';
import { ConfirmarEmailDto } from './dto/confirmar-email.dto';
import { RecuperarSenhaDto } from './dto/recuperar-senha.dto';
import { RedefinirSenhaDto } from './dto/redefinir-senha.dto';
import { LoginDto } from './dto/login.dto';
import { CodigoTotpDto } from './dto/codigo-totp.dto';
import { VerificarTotpDto } from './dto/verificar-totp.dto';
import { SenhaAtualDto } from '../usuarios/dto/senha-atual.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { UsuarioAtual } from '../common/decorators/usuario-atual.decorator';
import { JwtPayload } from './interfaces/jwt-payload.interface';

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

  @Post('esqueceu-senha')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async solicitarRecuperacaoSenha(@Body() dto: RecuperarSenhaDto) {
    return this.authService.solicitarRecuperacaoSenha(dto);
  }

  @Post('redefinir-senha')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  redefinirSenha(@Body() dto: RedefinirSenhaDto) {
    return this.authService.redefinirSenha(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  logout(@UsuarioAtual() usuario: JwtPayload, @Res({ passthrough: true }) res: Response) {
    return this.authService.logout(usuario, res);
  }

  
  
  
  @Post('2fa/habilitar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  habilitar2fa(@UsuarioAtual() usuario: JwtPayload) {
    return this.authService.habilitar2fa(usuario.id);
  }

  @Post('2fa/confirmar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  confirmar2fa(@UsuarioAtual() usuario: JwtPayload, @Body() dto: CodigoTotpDto) {
    return this.authService.confirmar2fa(usuario.id, dto.codigo);
  }

  @Post('2fa/desativar')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  desativar2fa(@UsuarioAtual() usuario: JwtPayload, @Body() dto: SenhaAtualDto) {
    return this.authService.desativar2fa(usuario.id, dto.senha_atual);
  }

  
  
  @Post('2fa/verificar')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  verificar2fa(@Body() dto: VerificarTotpDto, @Res({ passthrough: true }) res: Response) {
    return this.authService.verificarLoginComTotp(dto.token_pre2fa, dto.codigo, res);
  }
}
