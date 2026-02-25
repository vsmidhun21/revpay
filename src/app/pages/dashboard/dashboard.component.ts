import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { UserProfile } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  profile: UserProfile | null = null;
  loading = true;

  quickActions = [
    { icon: '↗', label: 'Send Money', color: '#4f8ef7', route: '/send-money'   },
    { icon: '↙', label: 'Request',    color: '#22c55e', route: '/requests'      },
    { icon: '＋', label: 'Add Funds', color: '#a855f7', route: '/payment-methods'},
    { icon: '↓',  label: 'Withdraw',  color: '#f97316', route: '/settings'      },
  ];

  transactions = [
    { icon: '↙', type: 'received', name: 'Sarah Mitchell',   note: 'Rent split',       amount: +850.00,  date: 'Today, 2:14 PM'     },
    { icon: '↗', type: 'sent',     name: 'Netflix',          note: 'Subscription',     amount: -15.99,   date: 'Today, 9:00 AM'     },
    { icon: '↗', type: 'sent',     name: 'James Carter',     note: 'Lunch',            amount: -42.50,   date: 'Yesterday, 1:30 PM' },
    { icon: '↙', type: 'received', name: 'Freelance Client', note: 'Invoice #INV-042', amount: +1200.00, date: 'Dec 18, 10:45 AM'   },
    { icon: '＋', type: 'topup',   name: 'Wallet Top-up',   note: 'From Visa ••4291', amount: +500.00,  date: 'Dec 17, 4:00 PM'    },
    { icon: '↗', type: 'sent',     name: 'Electricity Bill', note: 'December bill',    amount: -96.20,   date: 'Dec 16, 11:00 AM'   },
  ];

  notifications = [
    { icon: '💰', message: 'You received ₹850 from Sarah Mitchell', time: '2 min ago', unread: true  },
    { icon: '🔔', message: 'Your transaction PIN was changed',       time: '1 hr ago',  unread: true  },
    { icon: '📩', message: 'Money request from James: ₹42.50',      time: '3 hrs ago', unread: false },
  ];

  constructor(
    private userService: UserService,
    private router: Router,
  ) {
    // Try to get profile from navigation state (passed from profile-init)
    const nav = this.router.getCurrentNavigation();
    const stateProfile = nav?.extras?.state?.['profile'];
    if (stateProfile) {
      this.profile = stateProfile;
      this.loading = false;
    }
  }

  ngOnInit(): void {
    if (this.profile) return;

    this.userService.getProfile().subscribe({
      next: (res) => {
        this.profile = res.data ?? null;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/login']);
      },
    });
  }

  // ── Helpers ──────────────────────────────────────────────────

  get firstName(): string {
    return (this.profile?.fullName || '').split(' ')[0] || 'there';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 21) return 'Good evening';
    return 'Good night';
  }

  get greetingEmoji(): string {
    const hour = new Date().getHours();
    if (hour >= 5  && hour < 12) return '☀️';
    if (hour >= 12 && hour < 17) return '👋';
    if (hour >= 17 && hour < 21) return '🌆';
    return '🌙';
  }

  get isBusinessPendingVerification(): boolean {
    return this.profile?.accountType === 'BUSINESS'
      && this.profile?.businessStatus === 'PENDING_VERIFICATION';
  }

  get pendingAmount(): number {
    // Replace with real API data when available
    return 320.00;
  }
}