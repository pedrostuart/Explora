import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventosModule } from './eventos/eventos.module';
import { DatabaseModule } from './database/database.module';
import { IngressosModule } from './ingressos/ingressos.module';
import { ArtistasModule } from './artistas/artistas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { FavoritosModule } from './favoritos/favoritos.module';
import {ServeStaticModule} from '@nestjs/serve-static'
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),


    EventosModule,
    DatabaseModule,
    IngressosModule,
    ArtistasModule,
    CategoriasModule,
    AuthModule,
    UsuariosModule,
    FavoritosModule
  ]
})
export class AppModule {}
