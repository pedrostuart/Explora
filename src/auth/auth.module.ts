import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

import { DatabaseModule } from '../database/database.module';

@Module({

    imports: [

        DatabaseModule,

        JwtModule.register({
            secret: 'chave-secreta-explora',

            signOptions: {
                expiresIn: '1d'
            }
        })

    ],

    controllers: [
        AuthController
    ],

    providers: [
        AuthService,
        AuthGuard
    ],

    exports: [
        AuthGuard,
        JwtModule
    ]

})
export class AuthModule {}