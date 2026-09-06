





import { DatabaseSync } from 'node:sqlite';
import * as path from 'node:path';

const email = process.argv[2];
if (!email) {
  console.log('Uso: node resetar-bloqueio.js email@exemplo.com');
  process.exit(1);
}

const db = new DatabaseSync(path.join(__dirname, '..', 'database', 'database.sqlite'));

const resultado = db
  .prepare('UPDATE usuarios SET tentativas_login = 0, bloqueado_ate = NULL WHERE email = ?')
  .run(email);

if (resultado.changes === 0) {
  console.log('Nenhum usuário encontrado com esse e-mail.');
} else {
  console.log(`Bloqueio removido para ${email}.`);
}
