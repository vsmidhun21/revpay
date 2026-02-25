import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent implements OnInit {
  profile: UserProfile | null = null;
  loggingOut = false;
  sidebarOpen = false; // for mobile

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe({
      next: (res) => { this.profile = res.data ?? null; },
      error: () => { this.router.navigate(['/login']); },
    });
  }

  get initials(): string {
    const parts = (this.profile?.fullName || '').split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return '?';
  }

  get firstName(): string {
    return (this.profile?.fullName || '').split(' ')[0] || '';
  }

  get isBusinessAccount(): boolean {
    return this.profile?.accountType === 'BUSINESS';
  }

  get unreadCount(): number { return 3; } // wire up NotificationService later

  toggleSidebar(): void { this.sidebarOpen = !this.sidebarOpen; }

  logout(): void {
    this.loggingOut = true;
    this.authService.logout().subscribe({
      next:  () => { this.authService.clearSession(); this.router.navigate(['/login']); },
      error: () => { this.authService.clearSession(); this.router.navigate(['/login']); },
    });
  }
}
