import { Component, OnInit, inject, signal, computed, ElementRef, viewChild, output, input, effect } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Ads } from '@site-gazeta/models';
import { AlertService } from '@site-gazeta/alert';
import { 
  AdsFormControls, 
  SelectOption
} from '@site-gazeta/ads-config';
import { 
  urlValidator, 
  endDateAfterStartDateValidator 
} from '@site-gazeta/ads-config';
import { AdsService } from '../../../core/services/ads.service';

interface FormState {
  selectedFile: File | null;
  selectedFileName: string;
  imagePreviewUrl: string | null;
  isSubmitting: boolean;
}

@Component({
  selector: 'app-ads-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ads-form.component.html',
  styleUrls: ['./ads-form.component.scss'],
})
export class AdsFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private adsService = inject(AdsService);
  private alertService = inject(AlertService);

  // Inputs
  adToEdit = input<Ads | null>(null);
  
  // Outputs
  formSubmitted = output<void>();
  formCancelled = output<void>();

  // ViewChild para o input de arquivo
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  // Estado do formulário usando signals
  state = signal<FormState>({
    selectedFile: null,
    selectedFileName: '',
    imagePreviewUrl: null,
    isSubmitting: false,
  });

  // Computed signals
  isSubmitting = computed(() => this.state().isSubmitting);
  imagePreviewUrl = computed(() => this.state().imagePreviewUrl);
  selectedFileName = computed(() => this.state().selectedFileName);
  isEdit = computed(() => !!this.adToEdit());

  adForm!: FormGroup<AdsFormControls>;

  readonly allPositionOptions: SelectOption[] = [
    { value: 'top', label: 'Topo', pages: ['home'] },
    { value: 'center', label: 'Centro', pages: ['home', 'content'] },
    { value: 'bottom', label: 'Rodapé', pages: ['home', 'content'] },
  ];

  readonly placementOptions: SelectOption[] = [
    { value: 'header', label: 'Cabeçalho' },
    { value: 'home', label: 'Home' },
    { value: 'content', label: 'Conteúdo' },
  ];

  readonly sizeOptions: SelectOption[] = [
    { value: '728x90', label: '728x90 (Leaderboard)' },
    { value: '300x250', label: '300x250 (Medium Rectangle)' },
    { value: '160x600', label: '160x600 (Banner)' },
  ];

  readonly ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
  ];

  readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  constructor() {
    // Observa mudanças no adToEdit para carregar ou resetar o formulário
    effect(() => {
      const ad = this.adToEdit();
      if (ad) {
        this.loadAdForEdit(ad);
      } else if (this.adForm) {
        // Reseta o formulário quando adToEdit for null
        this.resetForm();
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.setupPlacementListener();
  }

  get positionOptions(): SelectOption[] {
    const placement = this.adForm?.get('placement')?.value as string;
    if (!placement || placement === 'header') {
      return [];
    }
    return this.allPositionOptions.filter(option => 
      option.pages?.includes(placement as 'home' | 'content')
    );
  }

  get isPositionDisabled(): boolean {
    return this.adForm?.get('placement')?.value === 'header';
  }

  private setupPlacementListener(): void {
    this.adForm.get('placement')?.valueChanges.subscribe((value) => {
      const placement = value as string;
      const positionControl = this.adForm.get('position');
      
      if (placement === 'header') {
        positionControl?.setValue('top');
        positionControl?.disable();
      } else {
        positionControl?.enable();
        const currentPosition = positionControl?.value as string;
        
        if (placement && (placement === 'home' || placement === 'content')) {
          const validPositions = this.allPositionOptions
            .filter(opt => opt.pages?.includes(placement as 'home' | 'content'))
            .map(opt => opt.value);
          
          if (currentPosition && !validPositions.includes(currentPosition)) {
            positionControl?.setValue('');
          }
        }
      }
    });
  }

  private initForm(): void {
    this.adForm = this.fb.group({
      title: this.fb.control('', [Validators.required, Validators.minLength(3)]),
      description: this.fb.control('', [Validators.maxLength(500)]),
      clickUrl: this.fb.control<string | null>(null, [urlValidator()]),
      position: this.fb.control('', [Validators.required]),
      placement: this.fb.control('', [Validators.required]),
      size: this.fb.control('', [Validators.required]),
      isActive: this.fb.control(true),
      priority: this.fb.control(1, [Validators.min(1), Validators.max(10)]),
      startDate: this.fb.control(this.formatDate(new Date().toISOString())),
      endDate: this.fb.control(
        this.formatDate(
          new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        ),
        [endDateAfterStartDateValidator('startDate')]
      ),
      image: this.fb.control('', [Validators.required]),
    });
  }

  private loadAdForEdit(ad: Ads): void {
    this.state.update(state => ({
      ...state,
      imagePreviewUrl: ad.imageUrl,
    }));

    const formattedAd = {
      ...ad,
      startDate: this.formatDate(ad.startDate),
      endDate: this.formatDate(ad.endDate),
    };

    // No modo de edição, a imagem não é obrigatória
    this.adForm.get('image')?.clearValidators();
    this.adForm.get('image')?.updateValueAndValidity();
    
    this.adForm.patchValue(formattedAd);
    
    if (ad.placement === 'header') {
      this.adForm.get('position')?.disable();
    }
  }

  triggerFileInput(): void {
    this.fileInput()?.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      this.clearFileSelection();
      return;
    }

    const file = input.files[0];

    // Validar tipo de arquivo
    if (!this.isValidImageType(file)) {
      this.alertService.error(
        'Tipo de arquivo inválido',
        'Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WEBP)'
      );
      input.value = '';
      this.clearFileSelection();
      return;
    }

    // Validar tamanho do arquivo
    if (file.size > this.MAX_FILE_SIZE) {
      this.alertService.error(
        'Arquivo muito grande',
        'O arquivo deve ter no máximo 5MB'
      );
      input.value = '';
      this.clearFileSelection();
      return;
    }

    // Criar preview da imagem
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.state.update(state => ({
        ...state,
        selectedFile: file,
        selectedFileName: file.name,
        imagePreviewUrl: e.target?.result as string,
      }));
    };
    reader.readAsDataURL(file);

    this.adForm.patchValue({ image: file.name });
  }

  private isValidImageType(file: File): boolean {
    return this.ALLOWED_IMAGE_TYPES.includes(file.type);
  }

  private clearFileSelection(): void {
    this.state.update(state => ({
      ...state,
      selectedFile: null,
      selectedFileName: '',
      imagePreviewUrl: this.isEdit() ? state.imagePreviewUrl : null,
    }));
    
    if (!this.isEdit()) {
      this.adForm.patchValue({ image: '' });
    }
  }

  onRemoveImage(): void {
    this.clearFileSelection();
    if (!this.isEdit()) {
      this.adForm.patchValue({ image: '' });
      this.adForm.get('image')?.markAsTouched();
    }
  }

  onSubmit(): void {
    // Marcar todos os campos como tocados para exibir erros
    this.markFormGroupTouched();

    // Validar formulário
    if (this.adForm.invalid) {
      this.alertService.warning(
        'Formulário inválido',
        'Por favor, corrija os erros antes de continuar'
      );
      return;
    }

    // Validar arquivo no modo de criação
    if (!this.isEdit() && !this.state().selectedFile) {
      this.alertService.error(
        'Imagem obrigatória',
        'Por favor, selecione uma imagem para o anúncio'
      );
      return;
    }

    this.state.update(state => ({ ...state, isSubmitting: true }));

    const data = this.adForm.getRawValue();
    const formData = new FormData();

    // Adicionar todos os campos exceto a imagem
    Object.entries(data).forEach(([key, value]) => {
      if (key !== 'image') {
        formData.append(key, String(value));
      }
    });

    // Adicionar imagem se houver
    if (this.state().selectedFile) {
      formData.append('image', this.state().selectedFile!);
    }

    const ad = this.adToEdit();
    if (ad?.id) {
      this.updateAdvertisement(ad.id, formData);
    } else {
      this.createAdvertisement(formData);
    }
  }

  private createAdvertisement(formData: FormData): void {
    this.adsService.create(formData).subscribe({
      next: () => {
        this.alertService.success(
          'Anúncio criado!',
          'O anúncio foi criado com sucesso'
        );
        this.resetForm();
        this.formSubmitted.emit();
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Erro desconhecido ao criar anúncio';
        this.alertService.error(
          'Erro ao criar anúncio',
          errorMessage
        );
      },
      complete: () => {
        this.state.update(state => ({ ...state, isSubmitting: false }));
      },
    });
  }

  private updateAdvertisement(id: number, formData: FormData): void {
    this.adsService.update(id, formData).subscribe({
      next: () => {
        this.alertService.success(
          'Anúncio atualizado!',
          'O anúncio foi atualizado com sucesso'
        );
        this.resetForm();
        this.formSubmitted.emit();
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Erro desconhecido ao atualizar anúncio';
        this.alertService.error(
          'Erro ao atualizar anúncio',
          errorMessage
        );
      },
      complete: () => {
        this.state.update(state => ({ ...state, isSubmitting: false }));
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.adForm.controls).forEach((key) => {
      const control = this.adForm.get(key);
      control?.markAsTouched();
    });
  }

  private formatDate(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  resetForm(): void {
    this.adForm.reset();
    this.clearFileSelection();
    this.initForm();
    this.state.update(state => ({
      ...state,
      imagePreviewUrl: null,
    }));
  }

  onCancel(): void {
    this.resetForm();
    this.formCancelled.emit();
  }

  // Helpers para mensagens de erro
  getErrorMessage(controlName: keyof AdsFormControls): string {
    const control = this.adForm.get(controlName);
    if (!control || !control.errors || !control.touched) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) return 'Este campo é obrigatório';
    if (errors['minlength']) return `Mínimo de ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo de ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['min']) return `Valor mínimo: ${errors['min'].min}`;
    if (errors['max']) return `Valor máximo: ${errors['max'].max}`;
    if (errors['invalidUrl']) return 'URL inválida';
    if (errors['endDateBeforeStart']) return 'A data final deve ser posterior à data inicial';

    return 'Campo inválido';
  }

  hasError(controlName: keyof AdsFormControls): boolean {
    const control = this.adForm.get(controlName);
    return !!(control?.invalid && control?.touched);
  }
}
