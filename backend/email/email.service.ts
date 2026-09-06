import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';





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
      
      
      this.logger.error(`Falha ao enviar e-mail para ${destinatario}: ${(erro as Error).message}`);
    }
  }

  
  
  
  estaConfigurado(): boolean {
    return this.transportador !== null;
  }
}
