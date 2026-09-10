import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { CategoriasService } from './categorias.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    controllers: [CategoriasController],
    providers: [CategoriasService],
    imports: [DatabaseModule]
})
export class CategoriasModule {}