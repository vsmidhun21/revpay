import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { InvoiceService } from '../../core/services/invoice.service';
import { Invoice, InvoiceStatus, InvoiceSummary, InvoiceLineItem } from '../../core/models';

@Component({
  selector: 'app-invoices',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss'],
})
export class InvoicesComponent implements OnInit {
  invoices: Invoice[] = [];
  summary: InvoiceSummary | null = null;
  loading = true;
  showCreateModal = false;
  showDetailModal = false;
  selectedInvoice: Invoice | null = null;
  submitting = false;
  error = '';
  successMsg = '';
  activeFilter: InvoiceStatus | '' = '';

  createForm: FormGroup;

  statusOptions: Array<{ label: string; value: InvoiceStatus | '' }> = [
    { label: 'All', value: '' },
    { label: 'Draft', value: 'DRAFT' },
    { label: 'Sent', value: 'SENT' },
    { label: 'Paid', value: 'PAID' },
    { label: 'Overdue', value: 'OVERDUE' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  constructor(private invoiceService: InvoiceService, private fb: FormBuilder) {
    this.createForm = this.fb.group({
      customerName:    ['', Validators.required],
      customerEmail:   ['', [Validators.required, Validators.email]],
      customerAddress: [''],
      paymentTerms:    ['NET_30'],
      dueDate:         ['', Validators.required],
      notes:           [''],
      lineItems: this.fb.array([this.newLineItem()]),
    });
  }

  ngOnInit(): void { this.load(); this.loadSummary(); }

  load(): void {
    this.loading = true;
    this.invoiceService.getAll(this.activeFilter as InvoiceStatus || undefined).subscribe({
      next: (res) => { this.invoices = res.data?.content ?? []; this.loading = false; },
      error: () => { this.loading = false; },
    });
  }

  loadSummary(): void {
    this.invoiceService.getSummary().subscribe({
      next: (res) => { this.summary = res.data ?? null; },
    });
  }

  filterBy(status: InvoiceStatus | ''): void {
    this.activeFilter = status;
    this.load();
  }

  // ── Line Items ────────────────────────────────────────────
  get lineItems(): FormArray { return this.createForm.get('lineItems') as FormArray; }

  newLineItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity:    [1, [Validators.required, Validators.min(1)]],
      unitPrice:   ['', [Validators.required, Validators.min(0)]],
      taxRate:     [0, [Validators.min(0), Validators.max(100)]],
    });
  }

  addLineItem(): void { this.lineItems.push(this.newLineItem()); }

  removeLineItem(i: number): void {
    if (this.lineItems.length > 1) this.lineItems.removeAt(i);
  }

  lineTotal(i: number): number {
    const item = this.lineItems.at(i).value as InvoiceLineItem;
    const subtotal = (item.quantity || 0) * (item.unitPrice || 0);
    return subtotal * (1 + (item.taxRate || 0) / 100);
  }

  get invoiceTotal(): number {
    return Array.from({ length: this.lineItems.length }, (_, i) => this.lineTotal(i))
      .reduce((sum, v) => sum + v, 0);
  }

  // ── Create ────────────────────────────────────────────────
  openCreate(): void { this.createForm.reset(); this.lineItems.clear(); this.lineItems.push(this.newLineItem()); this.showCreateModal = true; }
  closeCreate(): void { this.showCreateModal = false; this.error = ''; }

  submitCreate(): void {
    if (this.createForm.invalid) { this.createForm.markAllAsTouched(); return; }
    this.submitting = true;
    this.invoiceService.create(this.createForm.value).subscribe({
      next: () => {
        this.submitting = false;
        this.closeCreate();
        this.successMsg = 'Invoice created!';
        this.load();
        this.loadSummary();
        setTimeout(() => this.successMsg = '', 3000);
      },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; this.submitting = false; },
    });
  }

  // ── Actions ───────────────────────────────────────────────
  openDetail(inv: Invoice): void { this.selectedInvoice = inv; this.showDetailModal = true; }
  closeDetail(): void { this.showDetailModal = false; this.selectedInvoice = null; }

  sendInvoice(inv: Invoice): void {
    this.invoiceService.send(inv.id).subscribe({
      next: () => { this.successMsg = 'Invoice sent!'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; },
    });
  }

  markPaid(inv: Invoice): void {
    if (!confirm('Mark this invoice as paid?')) return;
    this.invoiceService.markPaid(inv.id).subscribe({
      next: () => { this.successMsg = 'Invoice marked as paid!'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; },
    });
  }

  cancelInvoice(inv: Invoice): void {
    if (!confirm('Cancel this invoice?')) return;
    this.invoiceService.cancel(inv.id).subscribe({
      next: () => { this.successMsg = 'Invoice cancelled.'; this.load(); this.loadSummary(); setTimeout(() => this.successMsg = '', 3000); },
      error: (err) => { this.error = err.error?.message ?? 'Failed.'; },
    });
  }

  statusColor(status: InvoiceStatus): string {
    const m: Record<InvoiceStatus, string> = {
      DRAFT: 'draft', SENT: 'sent', PAID: 'paid', OVERDUE: 'overdue', CANCELLED: 'cancelled',
    };
    return m[status];
  }

  cf(n: string) { return this.createForm.get(n); }
}
