import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

interface User {
  name: string;
  profileImageUrl?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  getCurrentUser(): Observable<User | null> {
    // Simulação de usuário logado
    return of({
      name: 'João Silva',
      profileImageUrl: 'https://example.com/avatar.jpg', // Substitua por uma URL real ou deixe vazio
    });
  }
}
