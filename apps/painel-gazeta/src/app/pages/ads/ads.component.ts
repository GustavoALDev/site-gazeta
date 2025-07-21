import { Component, OnInit, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule, formatDate } from '@angular/common';
import { AdsListComponent } from './ads-list/ads-list.component';
import { ApiService } from '../../core/services/api.service';
import { Ads } from '@site-gazeta/models';

@Component({
  selector: 'app-ads',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AdsListComponent],
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.scss'],
})
export class AdsComponent implements OnInit {
  fb = inject(NonNullableFormBuilder);
  apiService = inject(ApiService);

  activeTab = 'form';
  selectedFile: File | null = null;
  selectedFileName = '';
  isEdit = false;
  adId = 0;
  adForm!: FormGroup<{
    title: any;
    description: any;
    clickUrl: any;
    position: any;
    placement: any;
    isActive: any;
    priority: any;
    startDate: any;
    endDate: any;
    image: any;
  }>;

  positionOptions = [
    { value: 'top', label: 'Topo' },
    { value: 'bottom', label: 'Rodapé' },
    { value: 'sidebar', label: 'Barra Lateral' },
    { value: 'header', label: 'Cabeçalho' },
    { value: 'footer', label: 'Rodapé da Página' },
    { value: 'content', label: 'Conteúdo' },
  ];

  placementOptions = [
    { value: 'home', label: 'Home' },
    { value: 'content', label: 'Conteúdo' },
  ];

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.adForm = this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
      clickUrl: [null],
      position: ['', [Validators.required]],
      placement: ['', [Validators.required]],
      isActive: [true],
      priority: [0],
      startDate: [this.formatDate(new Date().toISOString())],
      endDate: [
        this.formatDate(
          new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()
        ),
      ],
      image: ['', [Validators.required]],
    });
  }
  setEditAdvertisement(ad: Ads): void {
    console.log(ad);
    this.isEdit = true;
    ad.startDate = this.formatDate(ad.startDate);
    ad.endDate = this.formatDate(ad.endDate);
    this.adForm.get('image')?.clearValidators()
    this.adId = ad.id as number;
    this.adForm.patchValue(ad);
    this.setActiveTab('form');
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Validar tipo de arquivo
      if (!this.isValidImageType(file)) {
        alert(
          'Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, WEBP)'
        );
        input.value = '';
        this.clearFileSelection();
        return;
      }

      // Validar tamanho do arquivo (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('O arquivo deve ter no máximo 5MB');
        input.value = '';
        this.clearFileSelection();
        return;
      }

      this.selectedFile = file;
      this.selectedFileName = file.name;
      this.adForm.patchValue({ image: file.name }); // Marca como válido
    } else {
      this.clearFileSelection();
    }
  }

  private isValidImageType(file: File): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return validTypes.includes(file.type);
  }

  private clearFileSelection(): void {
    this.selectedFile = null;
    this.selectedFileName = '';
    this.adForm.patchValue({ image: '' });
  }

  onSubmit(): void {

      console.log(this.adForm.value);
      console.log(this.adForm.value);
      const formData = new FormData();
      const data: any = this.adForm.value;

      // Adicionar todos os campos exceto a imagem
      Object.keys(data).forEach((key) => {
        if (key !== 'image' && key !== 'priority') {
          formData.append(key, data[key]);
        }
      });
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      if (this.selectedFile) {
        formData.append('image', this.selectedFile);
      }
      if (this.isEdit) {
        formData.forEach((value, key) => {
          console.log(key, value);
        });
        this.activeTab = 'list';
        this.apiService
          .editAds(this.adId, formData)
          .pipe()
          .subscribe({
            next: (res) => {
              this.resetForm();
              alert('Anúncio atualizado com sucesso');
            },
            error: (err) => {

              console.log(err.error.message);
              alert('Erro ao atualizar anúncio. ' + err.error.message);
              throw err
            },
          });


      } else {
        this.apiService
          .setAds(formData)
          .pipe()
          .subscribe({
            next: (ads) => {
              console.log(ads);
              this.resetForm();
              alert('Anúncio criado com sucesso');
            },
            error: (err) => {
              console.log(err.error.message);
              alert('Erro ao criar anúncio. ' + err.error.message);
            },
          });
      }

  }

  private markFormGroupTouched(): void {
    Object.keys(this.adForm.controls).forEach((key) => {
      const control = this.adForm.get(key);
      control?.markAsTouched();
    });
  }
  formatDate(date: string): string {
    return formatDate(date, "yyyy-MM-dd'T'HH:mm", 'pt-BR');
  }

  resetForm(): void {
    this.adForm.reset();
    this.clearFileSelection();
    this.initForm();
    this.isEdit = false;
  }
}
