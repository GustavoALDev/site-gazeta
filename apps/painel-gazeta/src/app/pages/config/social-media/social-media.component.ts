import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormValidatorComponent, FormValidatorService } from '@site-gazeta/form-validator';
import { Subject, takeUntil } from 'rxjs';
import { AlertService } from '@site-gazeta/alert';

@Component({
  selector: 'app-social-media',
  imports: [CommonModule, ReactiveFormsModule, FormValidatorComponent],
  providers: [FormValidatorService],
  templateUrl: './social-media.component.html',
  styleUrl: './social-media.component.scss',
})
export class SocialMediaComponent implements OnInit, OnDestroy {
  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);
  private alertService = inject(AlertService);
  destroy$ = new Subject<void>();
  displayError = signal<{ [key: string]: string } | null>({});

  form = this.fb.group({
    instagram: ['', [Validators.pattern(/^https?:\/\/(www\.)?instagram\.com\/.+/)]],
    facebook: ['', [Validators.pattern(/^https?:\/\/(www\.)?facebook\.com\/.+/)]],
    youtube: ['', [Validators.pattern(/^https?:\/\/(www\.)?youtube\.com\/.+/)]],
    linkedin: ['', [Validators.pattern(/^https?:\/\/(www\.)?linkedin\.com\/.+/)]],
    twitter: ['', [Validators.pattern(/^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+/)]],
    tiktok: ['', [Validators.pattern(/^https?:\/\/(www\.)?tiktok\.com\/.+/)]],
    whatsapp: ['', [Validators.pattern(/^\+?[1-9]\d{1,14}$/)]],
  });

  errorMessage = {
    instagram: {
      pattern: 'Digite uma URL válida do Instagram (ex: https://instagram.com/usuario)',
    },
    facebook: {
      pattern: 'Digite uma URL válida do Facebook (ex: https://facebook.com/pagina)',
    },
    youtube: {
      pattern: 'Digite uma URL válida do YouTube (ex: https://youtube.com/c/canal)',
    },
    linkedin: {
      pattern: 'Digite uma URL válida do LinkedIn (ex: https://linkedin.com/company/empresa)',
    },
    twitter: {
      pattern: 'Digite uma URL válida do Twitter/X (ex: https://twitter.com/usuario)',
    },
    tiktok: {
      pattern: 'Digite uma URL válida do TikTok (ex: https://tiktok.com/@usuario)',
    },
    whatsapp: {
      pattern: 'Digite um número válido com código do país (ex: +5511999999999)',
    },
  };

  socialMediaFields = [
    {
      name: 'instagram',
      label: 'Instagram',
      icon: 'photo_camera',
      placeholder: 'https://instagram.com/seu-usuario',
      color: '#E1306C'
    },
    {
      name: 'facebook',
      label: 'Facebook',
      icon: 'facebook',
      placeholder: 'https://facebook.com/sua-pagina',
      color: '#1877F2'
    },
    {
      name: 'youtube',
      label: 'YouTube',
      icon: 'play_circle',
      placeholder: 'https://youtube.com/c/seu-canal',
      color: '#FF0000'
    },
    {
      name: 'linkedin',
      label: 'LinkedIn',
      icon: 'business',
      placeholder: 'https://linkedin.com/company/sua-empresa',
      color: '#0A66C2'
    },
    {
      name: 'twitter',
      label: 'Twitter / X',
      icon: 'chat',
      placeholder: 'https://twitter.com/seu-usuario',
      color: '#1DA1F2'
    },
    {
      name: 'tiktok',
      label: 'TikTok',
      icon: 'music_note',
      placeholder: 'https://tiktok.com/@seu-usuario',
      color: '#000000'
    },
    {
      name: 'whatsapp',
      label: 'WhatsApp',
      icon: 'phone',
      placeholder: '+55 11 99999-9999',
      color: '#25D366'
    },
  ];

  ngOnInit() {
    this.formValidator
      .InitValidation(this.form, this.errorMessage)
      .pipe(takeUntil(this.destroy$))
      .subscribe((errorMessages) => {
        this.displayError.set(errorMessages);
      });

    // TODO: Carregar dados salvos da API
    this.loadSocialMediaData();
  }

  loadSocialMediaData() {
    // Implementar carregamento dos dados da API
    console.log('Carregando dados das redes sociais...');
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      console.log('Dados do formulário:', formValue);
      
      // TODO: Implementar chamada da API para salvar
      this.alertService.success('Sucesso', 'Configurações de redes sociais salvas com sucesso!');
    } else {
      this.alertService.warning('Atenção', 'Por favor, corrija os erros no formulário antes de salvar.');
    }
  }

  onReset() {
    this.form.reset();
    console.log('Formulário resetado');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
