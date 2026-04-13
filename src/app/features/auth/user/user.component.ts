import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule, FormsModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  private userSvc = inject(UserService);

  users = signal<User[]>([]);

  // 
  currentUserId = 0;

  // 
  isModalOpen = false;
  selectedUser: User | null = null;

  editName = '';
  editUsername = '';

  ngOnInit() {
    this.loadUsers();

    // 
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user?.id || 0;
  }

  loadUsers() {
    this.userSvc.getUsers().subscribe({
      next: (data) => this.users.set(data),
      error: (err) => {
      console.error(err);
      alert('Error al cargar usuarios');
      }
    });
  }

  // 
  openEditModal(user: User) {
    this.selectedUser = user;
    this.editName = user.name;
    this.editUsername = user.username;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  updateUser() {
    if (!this.selectedUser?.id) return;

    if (!this.editName.trim() || !this.editUsername.trim()) {
    alert('Nombre y usuario son obligatorios');
    return;
  }

    const updatedUser = {
      name: this.editName,
      username: this.editUsername
    };

    this.userSvc.updateUser(this.selectedUser.id, updatedUser).subscribe({
      next: (res) => {
        this.users.update(prev =>
          prev.map(u => u.id === res.id ? res : u)
        );
        this.closeModal();
      },
    error: (err) => {
      console.error(err);

      const msg = err?.error?.error || 'Error al actualizar usuario';
      alert(msg);
    }
    });
  }

  
  deleteUser(id: number | undefined) {
    if (!id) return;

    //  No eliminarse a sí mismo
    if (id === this.currentUserId) {
      alert('No puedes eliminar tu propio usuario');
      return;
    }

    this.userSvc.deleteUser(id).subscribe({
      next: () => {
        this.users.update(prev => prev.filter(u => u.id !== id));
      },
    error: (err) => {
      console.error(err);

      const msg = err?.error?.error || 'Error al eliminar usuario';
      alert(msg);
    }
    });
  }
}
