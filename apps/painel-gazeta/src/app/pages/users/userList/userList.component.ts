import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  nome: string;
  email: string;
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './userList.component.html',
  styleUrl: './userList.component.scss'
})
export class UserListComponent {
  // Mock de usuários
  users: User[] = [
    { id: 1, nome: 'João Silva', email: 'joao@example.com' },
    { id: 2, nome: 'Maria Santos', email: 'maria@example.com' },
    { id: 3, nome: 'Pedro Oliveira', email: 'pedro@example.com' },
    { id: 4, nome: 'Ana Costa', email: 'ana@example.com' },
    { id: 5, nome: 'Carlos Mendes', email: 'carlos@example.com' },
    { id: 6, nome: 'Lucia Ferreira', email: 'lucia@example.com' }
  ];

  editUser(user: User) {
    // Aqui você implementaria a lógica de edição
    console.log('Editar usuário:', user);
    alert(`Editar usuário: ${user.nome}`);
  }

  deleteUser(userId: number) {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.users = this.users.filter(u => u.id !== userId);
      alert('Usuário excluído com sucesso!');
    }
  }
}
