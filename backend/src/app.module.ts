import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      //para que as variaveis presententes no .env consiga ser visto por toda aplicação
      isGlobal: true
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
