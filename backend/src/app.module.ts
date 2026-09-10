import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventosModule } from './eventos/eventos.module';
import { DatabaseModule } from './database/database.module';
import { IngressosModule } from './ingressos/ingressos.module';
import { ArtistasModule } from './artistas/artistas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      //para que as variaveis presententes no .env consiga ser visto por toda aplicação
      isGlobal: true
    }),
    EventosModule,
    DatabaseModule,
    IngressosModule,
    ArtistasModule,
    CategoriasModule,
    AuthModule,
    UsuariosModule
  ]
})
export class AppModule {}
