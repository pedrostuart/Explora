import { Module } from '@nestjs/common';
import { IngressosController } from './ingressos.controller';
import { IngressosService } from './ingressos.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    controllers: [IngressosController],
    providers: [IngressosService],
    imports: [DatabaseModule]
})
export class IngressosModule {}