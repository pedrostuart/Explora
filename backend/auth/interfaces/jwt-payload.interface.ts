export interface JwtPayload {
  id: number;
  email: string;
  role: 'usuario' | 'prestador' | 'admin';
  jti: string; 
}




export interface Pre2faPayload {
  id: number;
  pre2fa: true;
}
