import { Component, inject, signal } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { Task } from '../../../shared/models/task.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  private taskSvc = inject(TaskService);

  // Signal para la lista de tareas
  tasks = signal<Task[]>([]);

  // Para el formulario de nueva tarea
  newTaskName = '';
  newTaskDescription = '';
  newTaskPriority =false;

  // Para el model
isModalOpen = false;
selectedTask: Task | null = null;

// Campos para editar la tarea
editName = '';
editDescription = '';
editPriority = false;

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskSvc.getTasks().subscribe({
      next: (data) => this.tasks.set(data),
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  addTask() {
    if (!this.newTaskName.trim()) {
    alert('El nombre de la tarea es obligatorio');
    return;
  }

    const task: Task = {
      name: this.newTaskName,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      // user_id: 1 // Se envía 0 porque el Back lo sobreescribirá con el token
    };

    this.taskSvc.createTask(task).subscribe({
      next: (createdTask) => {
        this.tasks.update(prev => [...prev, createdTask]);
        this.newTaskName = '';
        this.newTaskDescription = '';
        this.newTaskPriority = false;
      },
      error: (err) => {
      console.error(err);

      
      const msg = err?.error?.error || 'Error al crear la tarea';
      alert(msg);
    }
    });
  }

  deleteTask(id: number | undefined) {
    if (!id) return;
    this.taskSvc.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update(prev => prev.filter(t => t.id !== id));
      }
    });
  }

  updateTask() {
  if (!this.selectedTask?.id) return;
   if (!this.editName.trim()) {
    alert('El nombre no puede estar vacío');
    return;
  }

  const updatedTask: Task = {
    name: this.editName,
    description: this.editDescription,
    priority: this.editPriority
  };

  this.taskSvc.updateTask(this.selectedTask.id, updatedTask).subscribe({
    next: (res) => {
      this.tasks.update(prev =>
        prev.map(t => t.id === res.id ? res : t)
      );
      this.closeModal();
    },
     error: (err) => {
      console.error(err);

      const msg = err?.error?.error || 'Error al actualizar la tarea';
      alert(msg);
    }
  });
}

  openEditModal(task: Task) {
  this.selectedTask = task;
  this.editName = task.name;
  this.editDescription = task.description;
  this.editPriority = task.priority;
  this.isModalOpen = true;
}

closeModal() {
  this.isModalOpen = false;
  this.selectedTask = null;
}
}
