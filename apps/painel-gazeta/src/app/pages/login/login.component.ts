import { FormValidatorService } from '@site-gazeta/form-validator';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  ViewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControlName,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [FormValidatorService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  @ViewChildren(FormControlName, { read: ElementRef })
  formInputElements: ElementRef[] = [];

  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);

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
    server: {
      serverError: 'Erro no servidor, tente novamente mais tarde',
    },
  };

  displayError = signal<{ [key: string]: string } | null>({});

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  destroy$ = new Subject<void>();

  ngAfterViewInit(): void {
    this.formValidator
      .InitValidation(this.loginForm, this.formInputElements, this.errorMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorMessages) => {
        this.displayError.set(errorMessages);
      });
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }

  ngOnDestroy(): void {
    this.formValidator.destroySubscriptions();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
