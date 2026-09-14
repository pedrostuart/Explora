import { Module } from '@nestjs/common';

import { FavoritosController } from './favoritos.controller';
import { FavoritosService } from './favoritos.service';

import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        DatabaseModule,
        AuthModule
    ],

    controllers: [FavoritosController],

    providers: [FavoritosService]
})
export class FavoritosModule {}