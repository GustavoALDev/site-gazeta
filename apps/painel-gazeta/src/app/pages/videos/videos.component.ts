import { Component, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValidatorComponent, FormValidatorService } from '@site-gazeta/form-validator';
import { VideoListComponent } from './video-list/video-list.component';
import { YoutubeVideo } from '@site-gazeta/models';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormValidatorComponent,
    VideoListComponent
  ],
  providers: [FormValidatorService],
  templateUrl: './videos.component.html',
  styleUrl: './videos.component.scss',
})
export class VideosComponent implements OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private formValidator = inject(FormValidatorService);
  private apiService = inject(ApiService);
  private destroy$ = new Subject<void>();

  activeTab = signal<'form' | 'list'>('form');
  displayError = signal<{ [key: string]: string }>({});
  isEdit = signal<boolean>(false);
  id = signal<number | null>(null);
  updateList = signal<string | undefined>(undefined);
  form = this.fb.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]],
    youtubeUrl: ['', [Validators.required, Validators.pattern(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/)]],
    thumbnail: [''],
    duration: [''],
    videoId: [''],
    displayOrder: [1, [Validators.required, Validators.min(1)]],
    isActive: [true],
    isEmphasis: [false],
    publishedAt: [this.getCurrentDateTime(), [Validators.required]]
  });

  errorMessages = {
    title: {
      required: 'Título é obrigatório'
    },
    description: {
      required: 'Descrição é obrigatória'
    },
    youtubeUrl: {
      required: 'URL do YouTube é obrigatória',
      pattern: 'URL do YouTube inválida'
    },
    displayOrder: {
      required: 'Ordem de exibição é obrigatória',
      min: 'Ordem de exibição deve ser maior que zero'
    },
    publishedAt: {
      required: 'Data de publicação é obrigatória'
    }
  };

  private extractYoutubeId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : '';
  }

  constructor() {
    this.formValidator.InitValidation(this.form, this.errorMessages)
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorMessages => {
        this.displayError.set(errorMessages || {});
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'form' | 'list') {
    this.activeTab.set(tab);
  }
  editVideo(video: YoutubeVideo) {
    this.id.set(video.id as number);
    this.isEdit.set(true);
    this.activeTab.set('form');
    console.log('Editing video:', video);
    this.form.patchValue(video);
    this.form.get('publishedAt')?.setValue(video.publishedAt ? new Date(video.publishedAt).toISOString().slice(0, 16) : this.getCurrentDateTime());
  }

  onSubmit() {
    if (this.form.valid) {
      if(this.isEdit()) {
        this.apiService.editVideo(this.id() as number, this.form.value as YoutubeVideo).subscribe({
          next: (response) => {
            console.log('Video updated successfully:', response);
            this.onReset();
            this.activeTab.set('list');
            this.updateList.set(new Date().toISOString());
          },
          error: (error) => {
            console.error('Error updating video:', error);
          }
        });
      } else {
      const formValue = this.form.value as YoutubeVideo;
      formValue.videoId = this.extractYoutubeId(formValue.youtubeUrl);
      // Implementar lógica de envio
      this.apiService.setVideos(formValue).subscribe({
        next: (response) => {
          console.log('Video added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding video:', error);
        }
      });
    }
    }
  }

  onReset() {
    this.form.reset({
      displayOrder: 1,
      isActive: true,
      isEmphasis: false,
      publishedAt: this.getCurrentDateTime()
    });
    this.isEdit.set(false);
    this.id.set(null);
  }



  private getCurrentDateTime(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  }
}
