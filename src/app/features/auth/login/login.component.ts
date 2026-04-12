import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authSvc = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required]]
  });

  onLogin() {
    if (this.loginForm.valid) {
      this.authSvc.login(this.loginForm.value as any).subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => alert('Credenciales incorrectas: ' + err.error.message)
      });
    }
  }

}
