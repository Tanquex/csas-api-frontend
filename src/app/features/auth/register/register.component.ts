import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private userSvc = inject(UserService);
  private router = inject(Router);

  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    lastname: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onRegister() {
    if (this.registerForm.invalid) return;

    this.userSvc.register(this.registerForm.value).subscribe({
      next: () => {
        alert('Usuario registrado correctamente');
        this.router.navigate(['/tasks']);
      },
      error: (err) => {
        console.error(err);
        alert('Error al registrar usuario');
      }
    });
  }
  
}
