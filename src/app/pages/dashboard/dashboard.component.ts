import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  constructor(private authService: AuthService, private router: Router) {}

  userName = 'Alex Johnson';
  accountType = 'Personal';
  walletBalance = 4285.50;
  pendingAmount = 320.00;

  quickActions = [
    { icon: '↗', label: 'Send Money',   color: '#4f8ef7' },
    { icon: '↙', label: 'Request',      color: '#22c55e' },
    { icon: '＋', label: 'Add Funds',   color: '#a855f7' },
    { icon: '↓',  label: 'Withdraw',    color: '#f97316' },
  ];

  transactions = [
    { icon: '↙', type: 'received', name: 'Sarah Mitchell',   note: 'Rent split',       amount: +850.00,  date: 'Today, 2:14 PM',    status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'Netflix',          note: 'Subscription',     amount: -15.99,   date: 'Today, 9:00 AM',    status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'James Carter',     note: 'Lunch',            amount: -42.50,   date: 'Yesterday, 1:30 PM',status: 'completed' },
    { icon: '↙', type: 'received', name: 'Freelance Client', note: 'Invoice #INV-042', amount: +1200.00, date: 'Dec 18, 10:45 AM',  status: 'completed' },
    { icon: '＋', type: 'topup',   name: 'Wallet Top-up',    note: 'From Visa ••4291',  amount: +500.00,  date: 'Dec 17, 4:00 PM',   status: 'completed' },
    { icon: '↗', type: 'sent',     name: 'Electricity Bill', note: 'December bill',    amount: -96.20,   date: 'Dec 16, 11:00 AM',  status: 'completed' },
  ];

  notifications = [
    { icon: '💰', message: 'You received $850 from Sarah Mitchell',    time: '2 min ago',  unread: true  },
    { icon: '🔔', message: 'Your transaction PIN was changed',         time: '1 hr ago',   unread: true  },
    { icon: '📩', message: 'Money request from James: $42.50',         time: '3 hrs ago',  unread: false },
  ];

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}