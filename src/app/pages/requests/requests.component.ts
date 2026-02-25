import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MoneyRequestService } from '../../core/services/money-request.service';
import { MoneyRequest } from '../../core/models';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent implements OnInit {
  incoming: MoneyRequest[] = [];
  outgoing: MoneyRequest[] = [];
  loading = true;
  activeTab: 'incoming' | 'outgoing' | 'new' = 'incoming';
  actionLoading: number | null = null;
  error = '';
  successMsg = '';
  pinModalFor: MoneyRequest | null = null;
  pin = '';

  requestForm: FormGroup;
  submitting = false;

  constructor(private reqService: MoneyRequestService, private fb: FormBuilder) {
    this.requestForm = this.fb.group({
      recipient: ['', Validators.required],
      amount:    ['', [Validators.required, Validators.min(1)]],
      purpose:   ['', Validators.required],
    });
  }

  ngOnInit(): void { this.loadAll(); }

  loadAll(): void {
    this.loading = true;
    this.reqService.getIncoming().subscribe({ next: (r) => { this.incoming = r.data ?? []; this.checkDone(); } });
    this.reqService.getOutgoing().subscribe({ next: (r) => { this.outgoing = r.data ?? []; this.checkDone(); } });
  }

  private _loaded = 0;
  checkDone(): void { if (++this._loaded >= 2) { this.loading = false; this._loaded = 0; } }

  openAccept(req: MoneyRequest): void { this.pinModalFor = req; this.pin = ''; }
  closePin(): void { this.pinModalFor = null; }

  confirmAccept(): void {
    if (!this.pinModalFor || !this.pin) return;
    this.actionLoading = this.pinModalFor.requestId;
    this.reqService.accept(this.pinModalFor.requestId, this.pin).subscribe({
      next: () => {
        this.actionLoading = null;
        this.pinModalFor = null;
        this.successMsg = 'Request accepted!';
        this.loadAll();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => {
        this.error = err.error?.message ?? 'Failed.';
        this.actionLoading = null;
      },
    });
  }

  decline(req: MoneyRequest): void {
    if (!confirm('Decline this request?')) return;
    this.actionLoading = req.requestId;
    this.reqService.decline(req.requestId).subscribe({
      next: () => { this.actionLoading = null; this.loadAll(); },
      error: () => { this.actionLoading = null; },
    });
  }

  cancel(req: MoneyRequest): void {
    if (!confirm('Cancel this request?')) return;
    this.actionLoading = req.requestId;
    this.reqService.cancel(req.requestId).subscribe({
      next: () => { this.actionLoading = null; this.loadAll(); },
      error: () => { this.actionLoading = null; },
    });
  }

  submitRequest(): void {
    if (this.requestForm.invalid) { this.requestForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.reqService.requestMoney(this.requestForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.requestForm.reset();
        this.successMsg = 'Money request sent!';
        this.activeTab = 'outgoing';
        this.loadAll();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.submitting = false; },
    });
  }

  pendingIncoming(): MoneyRequest[] { return this.incoming.filter(r => r.status === 'PENDING'); }
  f(n: string) { return this.requestForm.get(n); }
}
