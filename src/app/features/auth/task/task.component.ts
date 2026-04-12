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
    if (!this.newTaskName.trim()) return;

    const task: Task = {
      name: this.newTaskName,
      description: this.newTaskDescription,
      priority: this.newTaskPriority,
      user_id: 1 // Se envía 0 porque el Back lo sobreescribirá con el token
    };

    this.taskSvc.createTask(task).subscribe({
      next: (createdTask) => {
        this.tasks.update(prev => [...prev, createdTask]);
        this.newTaskName = '';
        this.newTaskDescription = '';
        this.newTaskPriority = false;
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
}
