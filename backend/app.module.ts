import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'node:path';

import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuditoriaModule } from './auditoria/auditoria.module';
import { SegurancaModule } from './common/seguranca.module';
import { EmailModule } from './email/email.module';
import { SessoesModule } from './common/sessoes/sessoes.module';

import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { CategoriasModule } from './categorias/categorias.module';
import { EventosModule } from './eventos/eventos.module';
import { PreferenciasModule } from './preferencias/preferencias.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import { HistoricoModule } from './historico/historico.module';
import { RecomendacoesModule } from './recomendacoes/recomendacoes.module';
import { InscricoesModule } from './inscricoes/inscricoes.module';
import { AvaliacoesModule } from './avaliacoes/avaliacoes.module';
import { ComentariosModule } from './comentarios/comentarios.module';
import { NotificacoesModule } from './notificacoes/notificacoes.module';
import { LembretesModule } from './lembretes/lembretes.module';
import { LocalizacaoModule } from './localizacao/localizacao.module';
import { PaginaAuthMiddleware } from './common/middleware/pagina-auth.middleware';

@Module({
  imports: [    ConfigModule.forRoot({ isGlobal: true }),

    
    
    
    
    
    
    
    
    
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'views'),
      exclude: ['/api/(.*)', '/uploads/(.*)', '/javascript/(.*)'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'javascript'),
      serveRoot: '/javascript',
      exclude: ['/api/(.*)'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api/(.*)'],
    }),

    DatabaseModule,
    AuditoriaModule,
    SegurancaModule,
    EmailModule,
    SessoesModule,

    AuthModule,
    UsuariosModule,
    CategoriasModule,
    EventosModule,
    PreferenciasModule,
    FavoritosModule,
    HistoricoModule,
    RecomendacoesModule,
    InscricoesModule,
    AvaliacoesModule,
    ComentariosModule,
    NotificacoesModule,
    LembretesModule,
    LocalizacaoModule,
  ],
  providers: [PaginaAuthMiddleware],
  controllers: [AppController],
})
export class AppModule {}
