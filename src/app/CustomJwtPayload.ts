export interface CustomJwtPayload {
  sub: string;  // Kullanıcı adı veya email
  role: string; // Kullanıcı rolü
  exp: number;  // Expiry zamanı
}