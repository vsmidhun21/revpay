import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { Notification, NotificationType } from '../../core/models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  loading = true;
  markingAll = false;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.notifService.getAll().subscribe({
      next: (res) => { this.notifications = res.data ?? []; this.loading = false; },
      error: () => { this.loading = false; },
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
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.markingAll = false;
      },
      error: () => { this.markingAll = false; },
    });
  }

  get unreadCount(): number { return this.notifications.filter(n => !n.isRead).length; }

  typeIcon(type: NotificationType): string {
    const map: Record<NotificationType, string> = {
      TRANSACTION: '💸', MONEY_REQUEST: '📩', CARD_CHANGE: '💳',
      LOW_BALANCE: '⚠', SECURITY: '🔒', INVOICE: '🧾', LOAN: '🏦',
    };
    return map[type] ?? '🔔';
  }
}
