export interface User {
  id: number;
  username: string;
  roles?: string[]; // Opcional, caso o backend retorne papéis (ex.: 'admin', 'user')
  // Adicione outros campos conforme retornado pelo endpoint /auth/me
}
