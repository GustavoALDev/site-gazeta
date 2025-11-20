import { Component, inject, signal, effect, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { VideoService } from '../../../core/services/video.service';
import { Video } from '@site-gazeta/models';

@Component({
  selector: 'app-video-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './video-upload.component.html',
  styleUrl: './video-upload.component.scss',
})
export class VideoUploadComponent {
  private fb = inject(FormBuilder);
  private videoService = inject(VideoService);

  // Inputs & Outputs
  videoToEdit = input<Video | null>(null);
  onSave = output<Video>();
  onCancel = output<void>();

  // Signals
  uploadForm!: FormGroup;
  selectedVideoFile = signal<File | null>(null);
  selectedThumbnailFile = signal<File | null>(null);
  videoPreviewUrl = signal<string | null>(null);
  thumbnailPreviewUrl = signal<string | null>(null);
  isUploading = signal(false);
  uploadProgress = signal(0);
  isDraggingVideo = signal(false);
  isDraggingThumbnail = signal(false);

  // Formatos aceitos
  readonly acceptedVideoFormats = '.mp4,.avi,.mov,.webm,.mkv';
  readonly acceptedImageFormats = '.jpg,.jpeg,.png,.webp';
  readonly maxVideoSize = 500 * 1024 * 1024; // 500MB
  readonly maxImageSize = 5 * 1024 * 1024; // 5MB

  constructor() {
    this.initForm();

    // Effect para carregar vídeo ao editar
    effect(() => {
      const video = this.videoToEdit();
      if (video) {
        this.loadVideoForEdit(video);
      }
    });
  }

  private initForm(): void {
    this.uploadForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  private loadVideoForEdit(video: Video): void {
    this.uploadForm.patchValue({
      title: video.title
    });

    // Carregar thumbnail existente
    if (video.thumbnail) {
      this.thumbnailPreviewUrl.set(video.thumbnail);
    }

    // Carregar URL do vídeo existente
    if (video.url) {
      this.videoPreviewUrl.set(video.url);
    }
  }

  // Drag & Drop - Video
  onVideoDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingVideo.set(true);
  }

  onVideoDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingVideo.set(false);
  }

  onVideoDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingVideo.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleVideoFile(files[0]);
    }
  }

  onVideoFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleVideoFile(input.files[0]);
    }
  }

  private handleVideoFile(file: File): void {
    // Validar tipo
    if (!file.type.startsWith('video/')) {
      alert('Por favor, selecione um arquivo de vídeo válido.');
      return;
    }

    // Validar tamanho
    if (file.size > this.maxVideoSize) {
      alert(`O vídeo deve ter no máximo ${this.maxVideoSize / (1024 * 1024)}MB.`);
      return;
    }

    this.selectedVideoFile.set(file);

    // Criar preview
    const url = URL.createObjectURL(file);
    this.videoPreviewUrl.set(url);
  }

  removeVideo(): void {
    if (this.videoPreviewUrl()) {
      URL.revokeObjectURL(this.videoPreviewUrl()!);
    }
    this.selectedVideoFile.set(null);
    this.videoPreviewUrl.set(null);
  }

  // Drag & Drop - Thumbnail
  onThumbnailDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingThumbnail.set(true);
  }

  onThumbnailDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingThumbnail.set(false);
  }

  onThumbnailDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDraggingThumbnail.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleThumbnailFile(files[0]);
    }
  }

  onThumbnailFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleThumbnailFile(input.files[0]);
    }
  }

  private handleThumbnailFile(file: File): void {
    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida.');
      return;
    }

    // Validar tamanho
    if (file.size > this.maxImageSize) {
      alert(`A imagem deve ter no máximo ${this.maxImageSize / (1024 * 1024)}MB.`);
      return;
    }

    this.selectedThumbnailFile.set(file);

    // Criar preview
    const reader = new FileReader();
    reader.onload = (e) => {
      this.thumbnailPreviewUrl.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeThumbnail(): void {
    this.selectedThumbnailFile.set(null);
    this.thumbnailPreviewUrl.set(null);
  }

  submitForm(): void {
    console.log('called', this.videoToEdit())
    // Validar formulário
    if (this.uploadForm.invalid) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    const videoToEdit = this.videoToEdit();

    // Ao criar novo, vídeo é obrigatório
    if (!videoToEdit && !this.selectedVideoFile()) {
      return;
    }

    this.isUploading.set(true);
    this.uploadProgress.set(0);

    // Criar FormData
    const formData = new FormData();
    formData.append('title', this.uploadForm.get('title')?.value);

    if (this.selectedVideoFile()) {
      formData.append('video', this.selectedVideoFile()!);
    }

    if (this.selectedThumbnailFile()) {
      formData.append('thumbnail', this.selectedThumbnailFile()!);
    }

    // Simular progresso (você pode implementar progresso real com HttpClient)
    const progressInterval = setInterval(() => {
      this.uploadProgress.update(p => Math.min(p + 10, 90));
    }, 200);

    const apiCall = videoToEdit
      ? this.videoService.update(videoToEdit.id, formData)
      : this.videoService.upload(formData);

    apiCall.subscribe({
      next: (video) => {
        clearInterval(progressInterval);
        this.uploadProgress.set(100);

        setTimeout(() => {
          this.isUploading.set(false);
          this.uploadProgress.set(0);
          this.onSave.emit(video);
          this.resetForm();
        }, 500);
      },
      error: (err) => {
        clearInterval(progressInterval);
        this.isUploading.set(false);
        this.uploadProgress.set(0);
        console.error('Erro ao fazer upload do vídeo:', err);
        alert('Erro ao fazer upload do vídeo. Tente novamente.');
      }
    });
  }

  resetForm(): void {
    this.uploadForm.reset();
    this.removeVideo();
    this.removeThumbnail();
  }

  cancel(): void {
    this.resetForm();
    this.onCancel.emit();
  }

  // Getters para validação
  get titleControl() { return this.uploadForm.get('title'); }

  get isFormValid(): boolean {
    // Título deve estar válido
    if (this.uploadForm.invalid) {
      return false;
    }

    // Ao criar novo vídeo, arquivo é obrigatório
    if (!this.videoToEdit() && !this.selectedVideoFile()) {
      return false;
    }

    // Ao editar, vídeo não é obrigatório (já existe)
    return true;
  }

  // Formatação de tamanho de arquivo
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
}
