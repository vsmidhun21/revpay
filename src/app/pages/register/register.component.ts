import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

function passwordMatch(control: AbstractControl) {
  const pw = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return pw === confirm ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  step = 1; // 1 = account type, 2 = personal info, 3 = security
  accountType: 'PERSONAL' | 'BUSINESS' = 'PERSONAL';
  loading = false;
  error = '';
  showPassword = false;

  form: FormGroup = this.fb.group(
    {
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{7,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
      // Business fields
      businessName: [''],
      businessType: [''],
      taxId: [''],
      agreeTerms: [false, Validators.requiredTrue],
    },
    { validators: passwordMatch }
  );

  get f() { return this.form.controls; }

  selectAccountType(type: 'PERSONAL' | 'BUSINESS') {
    this.accountType = type;
    if (type === 'BUSINESS') {
      this.f['businessName'].setValidators(Validators.required);
      this.f['businessType'].setValidators(Validators.required);
    } else {
      this.f['businessName'].clearValidators();
      this.f['businessType'].clearValidators();
    }
    this.f['businessName'].updateValueAndValidity();
    this.f['businessType'].updateValueAndValidity();
    this.step = 2;
  }

  nextStep() {
    // Validate step 2 fields
    const step2Fields = ['fullName', 'email', 'phone'];
    if (this.accountType === 'BUSINESS') step2Fields.push('businessName', 'businessType');
    step2Fields.forEach(f => this.form.get(f)?.markAsTouched());
    const step2Valid = step2Fields.every(f => this.form.get(f)?.valid);
    if (step2Valid) this.step = 3;
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    const { confirmPassword, agreeTerms, ...payload } = this.form.value;

    this.authService.register({ ...payload, accountType: this.accountType }).subscribe({
      next: (res) => {
        this.authService.saveToken(res.token);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      },
    });
  }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.f['password'].value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    const levels = [
      { level: 0, label: '', color: '' },
      { level: 1, label: 'Weak', color: '#ef4444' },
      { level: 2, label: 'Fair', color: '#f97316' },
      { level: 3, label: 'Good', color: '#eab308' },
      { level: 4, label: 'Strong', color: '#22c55e' },
    ];
    return levels[score] || levels[0];
  }
}
