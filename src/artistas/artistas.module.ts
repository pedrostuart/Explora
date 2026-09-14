import { Module } from '@nestjs/common';
import { ArtistasController } from './artistas.controller';
import { ArtistasService } from './artistas.service';
import { DatabaseModule } from '../database/database.module';

@Module({
    controllers: [ArtistasController],
    providers: [ArtistasService],
    imports: [DatabaseModule]
})
export class ArtistasModule {}