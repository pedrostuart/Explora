import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventosModule } from './eventos/eventos.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      //para que as variaveis presententes no .env consiga ser visto por toda aplicação
      isGlobal: true
    }),
    EventosModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
