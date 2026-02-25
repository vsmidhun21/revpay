import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TransactionService } from '../../core/services/transaction.service';
import { Transaction, TransactionFilters, TransactionType, TransactionStatus } from '../../core/models';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  loading = true;
  exporting = false;
  error = '';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  // Filters
  filters: TransactionFilters = { page: 0, size: 10 };
  searchTerm = '';
  selectedType: TransactionType | '' = '';
  selectedStatus: TransactionStatus | '' = '';
  dateFrom = '';
  dateTo = '';

  // Detail modal
  selectedTransaction: Transaction | null = null;

  constructor(private txnService: TransactionService) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';

    const filters: TransactionFilters = {
      page: this.currentPage,
      size: this.pageSize,
      ...(this.searchTerm    && { search: this.searchTerm }),
      ...(this.selectedType  && { type: this.selectedType as TransactionType }),
      ...(this.selectedStatus && { status: this.selectedStatus as TransactionStatus }),
      ...(this.dateFrom      && { from: this.dateFrom }),
      ...(this.dateTo        && { to: this.dateTo }),
    };

    this.txnService.getAll(filters).subscribe({
      next: (res) => {
        this.transactions = res.data?.content ?? [];
        this.totalPages = res.data?.totalPages ?? 0;
        this.totalElements = res.data?.totalElements ?? 0;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load transactions.';
        this.loading = false;
      },
    });
  }

  applyFilters(): void {
    this.currentPage = 0;
    this.load();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedType = '';
    this.selectedStatus = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.currentPage = 0;
    this.load();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.load();
  }

  openDetail(t: Transaction): void {
    this.selectedTransaction = t;
  }

  closeDetail(): void {
    this.selectedTransaction = null;
  }

  exportFile(format: 'CSV' | 'PDF'): void {
    this.exporting = true;
    this.txnService.export(format).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revpay-transactions.${format.toLowerCase()}`;
        a.click();
        URL.revokeObjectURL(url);
        this.exporting = false;
      },
      error: () => { this.exporting = false; },
    });
  }

  typeIcon(type: string): string {
    const icons: Record<string, string> = {
      SENT: '↗', RECEIVED: '↙', ADD_MONEY: '＋', WITHDRAWAL: '↓', LOAN_REPAYMENT: '🏦',
    };
    return icons[type] ?? '•';
  }

  pageArray(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}