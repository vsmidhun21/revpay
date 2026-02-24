import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  // ── Real data from API ───────────────────────────────────────
  profile: UserProfile | null = null;
  loading = true;

  // ── Static placeholder data (replace with API later) ─────────
  quickActions = [
    { icon: '↗', label: 'Send Money', color: '#4f8ef7' },
    { icon: '↙', label: 'Request',    color: '#22c55e' },
    { icon: '＋', label: 'Add Funds', color: '#a855f7' },
    { icon: '↓',  label: 'Withdraw',  color: '#f97316' },
  ];

  transactions = [
    { icon: '↙', type: 'received', name: 'Sarah Mitchell',   note: 'Rent split',        amount: +850.00,  date: 'Today, 2:14 PM',     status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'Netflix',          note: 'Subscription',      amount: -15.99,   date: 'Today, 9:00 AM',     status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'James Carter',     note: 'Lunch',             amount: -42.50,   date: 'Yesterday, 1:30 PM', status: 'completed' },
    { icon: '↙', type: 'received', name: 'Freelance Client', note: 'Invoice #INV-042',  amount: +1200.00, date: 'Dec 18, 10:45 AM',   status: 'completed' },
    { icon: '＋', type: 'topup',   name: 'Wallet Top-up',    note: 'From Visa ••4291',  amount: +500.00,  date: 'Dec 17, 4:00 PM',    status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'Electricity Bill', note: 'December bill',     amount: -96.20,   date: 'Dec 16, 11:00 AM',   status: 'completed' },
  ];

  notifications = [
    { icon: '💰', message: 'You received $850 from Sarah Mitchell', time: '2 min ago',  unread: true  },
    { icon: '🔔', message: 'Your transaction PIN was changed',      time: '1 hr ago',   unread: true  },
    { icon: '📩', message: 'Money request from James: $42.50',      time: '3 hrs ago',  unread: false },
  ];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
  ) {
    // ── Try to get profile from navigation state first ──────────
    // ProfileInitComponent passes profile via router state to avoid
    // an extra API call on first login
    const nav = this.router.getCurrentNavigation();
    const stateProfile = nav?.extras?.state?.['profile'];
    if (stateProfile) {
      this.profile = stateProfile;
      this.loading = false;
    }
  }

  ngOnInit(): void {
    // ── If profile already loaded from nav state, skip API call ─
    if (this.profile) return;

    // ── Otherwise fetch from API (page refresh / direct navigation)
    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']); // token invalid → back to login
      },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────

  /** Returns first name safely even if fullName is undefined */
  get firstName(): string {
    return (this.profile?.fullName || '').split(' ')[0] || 'there';
  }

  /** Initials for the avatar — e.g. "Alex Johnson" → "AJ" */
  get initials(): string {
    const parts = (this.profile?.fullName || '').split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return '?';
  }

  get isBusinessPendingVerification(): boolean {
    return this.profile?.accountType === 'BUSINESS'
      && this.profile?.businessStatus === 'PENDING_VERIFICATION';
  }

  loggingOut = false;

  logout() {
    this.loggingOut = true;

    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
      error: () => {
        // Even if API fails, clear local session and redirect
        // This handles expired tokens or network issues gracefully
        this.authService.clearSession();
        this.router.navigate(['/login']);
      },
    });
  }

  get greeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)  return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }

  get greetingEmoji(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12)  return '☀️';
    if (hour >= 12 && hour < 17) return '👋';
    if (hour >= 17 && hour < 21) return '🌆';
    return '🌙';
  }

}