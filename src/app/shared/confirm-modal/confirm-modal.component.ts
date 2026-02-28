import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" *ngIf="visible" (click)="onCancel()">
      <div class="modal sm confirm-modal" (click)="$event.stopPropagation()">
        <div class="modal-head">
          <span class="confirm-icon">{{ icon }}</span>
          <h3>{{ title }}</h3>
        </div>
        <div class="modal-body">
          <p class="confirm-message">{{ message }}</p>
          <div class="modal-footer">
            <button class="btn-ghost" (click)="onCancel()">{{ cancelLabel }}</button>
            <button class="confirm-ok-btn" [class]="okClass" (click)="onConfirm()">
              {{ okLabel }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-modal .modal-head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid rgba(255,255,255,0.07);
    }
    .confirm-icon { font-size: 1.4rem; }
    .confirm-message { font-size: 0.9rem; color: #9ca3af; margin: 0 0 1rem; line-height: 1.6; }
    .confirm-ok-btn {
      padding: 0.55rem 1.25rem;
      border-radius: 10px;
      border: none;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }
    .confirm-ok-btn.danger  { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.25); }
    .confirm-ok-btn.primary { background: linear-gradient(135deg,#4f8ef7,#3b7de8); color:#fff; }
    .confirm-ok-btn:hover { opacity: 0.85; }
  `],
})
export class ConfirmModalComponent {
  @Input() visible  = false;
  @Input() title    = 'Are you sure?';
  @Input() message  = '';
  @Input() icon     = '⚠';
  @Input() okLabel  = 'Confirm';
  @Input() okClass: 'danger' | 'primary' = 'primary';
  @Input() cancelLabel = 'Cancel';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void { this.confirmed.emit(); }
  onCancel():  void { this.cancelled.emit(); }
}