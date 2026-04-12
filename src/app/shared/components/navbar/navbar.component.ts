import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public authSvc = inject(AuthService); 
  private router = inject(Router);

  // 1. Creamos un signal que nos diga en qué ruta estamos
  private currentRoute = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map((event: any) => event.urlAfterRedirects)
    )
  );

  // 2. Definimos qué rutas son "limpias" (sin navbar)
  
  showNavbar = computed(() => {
    const route = this.currentRoute();
    // No mostrar en login ni en register
    return !(route?.includes('/login') || route?.includes('/register'));
  });

  onLogout() {
    this.authSvc.logout().subscribe({
      next: () => {
        // Al cerrar sesión, el servicio auth ya limpia el storage y el signal con el clear
        this.router.navigate(['/login']);
      },
      error: (err) => console.error('Error al cerrar sesión', err)
    });
  }
}
