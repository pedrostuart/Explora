import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createPool, Pool } from 'mysql2/promise';
@Injectable()
export class DatabaseService {

    private readonly pool : Pool

    constructor (private readonly configService: ConfigService)
    {
        this.pool = createPool({
            host: this.configService.get<string>('DB_HOST'),
            port: Number(this.configService.get<string>('DB_PORT')), //trazendo string e transformando em numero
            user: this.configService.get<string>('DB_USER'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME')
        })
    }
    async query(sql: string, valores: any[] = []){// para conseguir executar códigos mysql
        //Executa o comando SQL com os valores recebidos
        const [resultado] = await this.pool.execute(sql, valores)
        //Retorna o resultado da consulta
        return resultado
    }
}
