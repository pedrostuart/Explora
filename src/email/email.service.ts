import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

// RN-051/052 — infraestrutura de e-mail real (via nodemailer). Sem
// credenciais SMTP configuradas (SMTP_HOST/SMTP_USER/SMTP_PASS), o serviço
// cai graciosamente para o "modo dev": registra o conteúdo no console em vez
// de falhar — o mesmo padrão já usado no fluxo de recuperação de senha.
@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transportador: nodemailer.Transporter | null = null;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    if (host) {
      this.transportador = nodemailer.createTransport({
        host,
        port: Number(this.config.get<string>('SMTP_PORT') || 587),
        secure: this.config.get<string>('SMTP_SECURE') === 'true',
        auth: {
          user: this.config.get<string>('SMTP_USER'),
          pass: this.config.get<string>('SMTP_PASS'),
        },
      });
    }
  }

  async enviar(destinatario: string, assunto: string, corpo: string): Promise<void> {
    if (!this.transportador) {
      // Modo dev: sem SMTP configurado, só loga (equivalente ao token_dev
      // já usado na recuperação de senha).
      this.logger.log(`[e-mail simulado] Para: ${destinatario} | Assunto: ${assunto}\n${corpo}`);
      return;
    }

    try {
      await this.transportador.sendMail({
        from: this.config.get<string>('SMTP_FROM') || 'nao-responda@explora.app',
        to: destinatario,
        subject: assunto,
        text: corpo,
      });
    } catch (erro) {
      // Falha no envio de e-mail nunca deve quebrar o fluxo principal da
      // requisição (ex.: cadastro, cancelamento de evento) — só registramos.
      this.logger.error(`Falha ao enviar e-mail para ${destinatario}: ${(erro as Error).message}`);
    }
  }

  // Usado pelos fluxos de cadastro/recuperação de senha para decidir se
  // devolvem o código também no corpo da resposta HTTP (só em modo dev, sem
  // SMTP real configurado) — facilita testar sem uma caixa de e-mail de verdade.
  estaConfigurado(): boolean {
    return this.transportador !== null;
  }
}
