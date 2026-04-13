import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { TaskComponent } from './features/auth/task/task.component';
import { authGuard } from './core/guards/auth.guard';
import { UserComponent } from './features/auth/user/user.component';
import { RegisterComponent } from './features/auth/register/register.component';

export const routes: Routes = [
    {
    path: 'login',
    component:LoginComponent
  },
   {
    path: 'tasks',
    component:TaskComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component:UserComponent,
    canActivate: [authGuard],
  },
  {
    path: 'register',
    component:RegisterComponent,
    
  },

//   {
//     path: 'register',
//     loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
//   },
//   {
//     path: 'tasks',
//     canActivate: [authGuard], // <--- PROTECCIÓN: Solo entra si hay token
//     loadComponent: () => import('.//features/tasks/task-list/task-list.component').then(m => m.TaskListComponent)
//   },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**', // Ruta para errores 404
    redirectTo: 'login'
  }
];
