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

@Module({
  imports: [    ConfigModule.forRoot({ isGlobal: true }),

    // Serve o front-end estático (public/) — equivalente ao
    // app.use(express.static(path.join(__dirname, '..', 'public'))) original.
    // As fotos de perfil enviadas pelos usuários (uploads/) são servidas pelo
    // ServeStaticModule.forRoot mais abaixo, montado em /uploads.
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'public'),
      exclude: ['/api/{*any}', '/uploads/{*any}'],
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      exclude: ['/api/{*any}'],
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
  ],
  controllers: [AppController],
})
export class AppModule {}
