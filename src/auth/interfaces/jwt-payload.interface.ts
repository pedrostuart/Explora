export interface JwtPayload {
  id: number;
  email: string;
  role: 'usuario' | 'prestador' | 'admin';
  jti: string; // RN-015: identificador único do token, usado para invalidação/logout real
}

// Token temporário emitido após validar e-mail/senha quando a conta tem 2FA
// ativo — ainda não é uma sessão válida, só autoriza a chamada ao endpoint
// de verificação do código TOTP (RN-013).
export interface Pre2faPayload {
  id: number;
  pre2fa: true;
}
