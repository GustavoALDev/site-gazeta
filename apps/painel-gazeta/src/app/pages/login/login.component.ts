import {
  FormValidatorComponent,
  FormValidatorService,
} from '@site-gazeta/form-validator';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, FormValidatorComponent],
  providers: [FormValidatorService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);
  authService = inject(AuthService);
  router = inject(Router);
  errorMessage = {
    email: {
      required: 'Email é obrigatório',
      email: 'Email inválido',
      inexistentUser: 'Usuário não encontrado',
    },
    password: {
      required: 'Senha é obrigatória',
      minlength: 'Senha deve ter no mínimo 6 caracteres',
      invalidPassword: 'Senha inválida',
    },
  };

  displayError = signal<{ [key: string]: string } | null>({});
  showPassword = signal(false);
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
  remember = signal(false);
  destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.formValidator
      .InitValidation(this.loginForm, this.errorMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorMessages) => {
        this.displayError.set(errorMessages);
      });
  }

  onSubmit() {
    const body = {
      email: this.loginForm.value.email as string,
      password: this.loginForm.value.password as string,
    };

    this.authService.authLogin(body, this.remember()).subscribe({
      next: () => {
        this.checkAdmin(body.email);
        this.router.navigate(['/']);
      },
      error: (response) => {
        if (response.error.error == 'Unauthorized') {
          this.displayError.set({
            server: response.error.message,
          });
        }
      },
    });
  }
  checkAdmin(email: string){
    if(email === 'master@email.com'){
      localStorage.setItem('user','admin');
    }else{
      localStorage.setItem('user','user');
    }
    
  }
  ngOnDestroy(): void {
    this.formValidator.destroySubscriptions();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
