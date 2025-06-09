import { Component, ViewChild, ElementRef, signal, computed, output, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewsMedia, NewsVideo } from '@site-gazeta/models';

interface MediaItem {
  type: 'photo' | 'video';
  file?: File;
  preview?: string;
  url?: string;
  thumbnail?: string;
  title?: string;
  author?: string;
  date?: string;
  emphasis?: boolean;
}

@Component({
  selector: 'app-news-midia',
  imports: [CommonModule, FormsModule],
  templateUrl: './news-midia.component.html',
  styleUrl: './news-midia.component.scss',
})
export class NewsMidiaComponent{
  
  @ViewChild('photoInput') photoInput!: ElementRef<HTMLInputElement>;
  
  previewMidias = signal<MediaItem[]>([]);
  selectedMediaIndex = signal<number | null>(null);
  editingMedia = signal<Partial<MediaItem>>({});
  formValue = output<{newsVideo: NewsVideo[], newsMedia: NewsMedia[]}>();
  featuredImage = computed(() => 
    this.previewMidias().find(media => media.type === 'photo' && media.emphasis)
  );

  selectedMedia = computed(() => {
    const index = this.selectedMediaIndex();
    return index !== null ? this.previewMidias()[index] : null;
  });

  hasMidias = computed(() => this.previewMidias().length > 0);
  constructor() {
    effect(() => {
      this.exportMidias()
    });
  }
  privewChange = computed(() => this.exportMidias());
  addPhoto() {
    this.photoInput.nativeElement.click();
  }

  addVideo() {
    const videoUrl = prompt('Digite a URL do vídeo do YouTube:');
    if (videoUrl && this.isValidYouTubeUrl(videoUrl)) {
      const videoId = this.extractYouTubeId(videoUrl);
      const newVideo: MediaItem = {
        type: 'video',
        url: videoUrl,
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        title: 'Vídeo do YouTube',
        emphasis: false
      };
      
      this.previewMidias.update(midias => [...midias, newVideo]);
    } else if (videoUrl) {
      alert('Por favor, insira uma URL válida do YouTube.');
    }
  }

  onPhotosSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      
      filesArray.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newMedia: MediaItem = {
            type: 'photo',
            file: file,
            preview: e.target?.result as string,
            author: '',
            date: '',
            emphasis: this.shouldSetAsFirstFeatured()
          };
          
          this.previewMidias.update(midias => [...midias, newMedia]);
        };
        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  removeMedia(index: number, event?: Event) {
    if (event) event.stopPropagation();
    
    this.previewMidias.update(midias => midias.filter((_, i) => i !== index));
    
    const currentSelected = this.selectedMediaIndex();
    if (currentSelected === index) {
      this.selectedMediaIndex.set(null);
      this.editingMedia.set({});
    } else if (currentSelected !== null && currentSelected > index) {
      this.selectedMediaIndex.set(currentSelected - 1);
    }
  }

  selectMedia(index: number) {
    const media = this.previewMidias()[index];
    if (media.type === 'photo') {
      this.selectedMediaIndex.set(index);
      this.editingMedia.set({ ...media });
    }
  }

  toggleFeatured(index: number, event: Event) {
    event.stopPropagation();
    
    const media = this.previewMidias()[index];
    if (media.type === 'photo') {
      this.previewMidias.update(midias => 
        midias.map((item, i) => ({
          ...item,
          emphasis: i === index ? !item.emphasis : (item.type === 'photo' ? false : item.emphasis)
        }))
      );
    }
  }

  saveMediaInfo() {
    const index = this.selectedMediaIndex();
    if (index !== null) {
      this.previewMidias.update(midias => 
        midias.map((item, i) => i === index ? { ...this.editingMedia() } as MediaItem : item)
      );
      this.cancelMediaEdit();
    }
  }

  cancelMediaEdit() {
    this.selectedMediaIndex.set(null);
    this.editingMedia.set({});
  }

  updateEditingAuthor(author: string) {
    this.editingMedia.update(media => ({ ...media, author }));
  }

  updateEditingDate(date: string) {
    this.editingMedia.update(media => ({ ...media, date }));
  }

  private isValidYouTubeUrl(url: string): boolean {
    return /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/.test(url);
  }

  private extractYouTubeId(url: string): string {
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/);
    return (match && match[2].length === 11) ? match[2] : '';
  }

  exportMidias() {
    const newsMidias: NewsMedia[] = []
    const videoMidias: NewsVideo[] = []
    this.previewMidias().forEach(midia => {
      if(midia.type === 'photo') {
        newsMidias.push({
          file: midia.file,
          author: midia.author,
          date: midia.date,
          emphasis: midia.emphasis as boolean
        })
      }
      if(midia.type === 'video') {
        videoMidias.push({
          url: midia.url as string,
          thumbnail: midia.thumbnail as string,
        })
      }
    })
    const formValue = {
      newsVideo: videoMidias, 
      newsMedia: newsMidias
    }
    this.formValue.emit(formValue)
  }

  private shouldSetAsFirstFeatured(): boolean {
    const currentMidias = this.previewMidias();
    if (currentMidias.length === 0) {
      return true;
    }
    
    const hasFeaturedImage = currentMidias.some(media => 
      media.type === 'photo' && media.emphasis
    );
    
    return !hasFeaturedImage;
  }
}