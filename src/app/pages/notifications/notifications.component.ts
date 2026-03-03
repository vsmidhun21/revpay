import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { Notification, NotificationType } from '../../core/models';
import { MatIconModule } from '@angular/material/icon';

interface NotifPref {
  key: string;
  label: string;
  description: string;
  icon: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  markingAll = false;
  activeTab: 'list' | 'preferences' = 'list';

  // Preferences
  prefsLoading = false;
  prefsSaving  = false;
  prefsError   = '';
  prefsSuccess = '';
  preferences: Record<string, boolean> = {};

  readonly prefOptions: NotifPref[] = [
    {
      key: 'TRANSACTION',
      label: 'Transaction Alerts',
      description: 'Notify for every send, receive, top-up, and withdrawal',
      icon: 'payments'
    },
    {
      key: 'MONEY_REQUEST',
      label: 'Money Requests',
      description: 'Notify when someone sends you a payment request',
      icon: 'request_page'
    },
    {
      key: 'CARD_CHANGE',
      label: 'Card Activity',
      description: 'Notify when a card is added, updated, or removed',
      icon: 'credit_card'
    },
    {
      key: 'LOW_BALANCE',
      label: 'Low Balance Alert',
      description: 'Notify when wallet balance falls below ₹500',
      icon: 'warning'
    },
    {
      key: 'SECURITY',
      label: 'Security Alerts',
      description: 'Notify for login, password, and PIN changes',
      icon: 'security'
    },
    {
      key: 'INVOICE',
      label: 'Invoice Updates',
      description: 'Notify for invoice status changes (business accounts)',
      icon: 'receipt_long'
    },
    {
      key: 'LOAN',
      label: 'Loan Reminders',
      description: 'Notify for EMI due dates and loan status changes',
      icon: 'account_balance'
    },
  ];

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadPreferences();
  }

  loadNotifications(): void {
    this.notifService.getAll().subscribe({
      next: (res) => { this.notifications = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadPreferences(): void {
    this.prefsLoading = true;
    this.notifService.getPreferences().subscribe({
      next: (res) => {
        // API returns e.g. { TRANSACTION: true, LOW_BALANCE: false, ... }
        this.preferences = res.data ?? {};
        // Default any missing pref to true
        this.prefOptions.forEach(p => {
          if (this.preferences[p.key] === undefined) {
            this.preferences[p.key] = true;
          }
        });
        this.prefsLoading = false;
      },
      error: () => { this.prefsLoading = false; },
    });
  }

  savePreferences(): void {
    this.prefsSaving = true;
    this.prefsError   = '';
    this.prefsSuccess = '';
    this.notifService.updatePreferences(this.preferences).subscribe({
      next: () => {
        this.prefsSaving  = false;
        this.prefsSuccess = 'Preferences saved!';
        setTimeout(() => this.prefsSuccess = '', 3000);
      },
      error: (err) => {
        this.prefsError  = err.error?.message ?? 'Failed to save preferences.';
        this.prefsSaving = false;
      },
    });
  }

  markRead(n: Notification): void {
    if (n.isRead) return;
    this.notifService.markRead(n.notificationId).subscribe({
      next: () => { n.isRead = true; },
    });
  }

  markAllRead(): void {
    this.markingAll = true;
    this.notifService.markAllRead().subscribe({
      next: () => { this.notifications.forEach(n => n.isRead = true); this.markingAll = false; },
      error: () => { this.markingAll = false; },
    });
  }

  get unreadCount(): number { return this.notifications.filter(n => !n.isRead).length; }

  typeIcon(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      TRANSACTION: 'payments',
      TRANSACTION_RECEIVED: 'payments',
      TRANSACTION_SENT: 'payments',
      MONEY_REQUEST: 'request_page',
      CARD_CHANGE: 'credit_card',
      LOW_BALANCE: 'warning',
      SECURITY: 'lock',
      INVOICE: 'receipt_long',
      LOAN: 'account_balance',
    };
    return map[type] ?? 'notifications';
  }
}