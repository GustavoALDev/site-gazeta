import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextEditorComponent } from '@site-gazeta/text-editor';
import { NonNullableFormBuilder, Validators, ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { NewsMidiaComponent } from './news-midia/news-midia.component';
import { NewsMedia, NewsVideo, Category } from '@site-gazeta/models';

@Component({
  selector: 'app-news',
  imports: [CommonModule, TextEditorComponent, ReactiveFormsModule, FormsModule, NewsMidiaComponent],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent {
  fb = inject(NonNullableFormBuilder);
  activeTab: 'info' | 'content' | 'media' = 'info';
  sidebarOpen = signal<boolean>(true);

  urlDisplay = signal<string>('');
  
  // Mock de categorias - será substituído pela chamada do backend
  availableCategories: Category[] = [
    { id: 1, name: 'Política', description: 'Notícias políticas', slug: 'politica', isActive: true },
    { id: 2, name: 'Esportes', description: 'Notícias esportivas', slug: 'esportes', isActive: true },
    { id: 3, name: 'Economia', description: 'Notícias econômicas', slug: 'economia', isActive: true },
    { id: 4, name: 'Cultura', description: 'Notícias culturais', slug: 'cultura', isActive: true },
    { id: 5, name: 'Tecnologia', description: 'Notícias de tecnologia', slug: 'tecnologia', isActive: true },
    { id: 6, name: 'Saúde', description: 'Notícias de saúde', slug: 'saude', isActive: true }
  ];
  
  selectedCategories = signal<Category[]>([]);
  categoryDropdownOpen = signal<boolean>(false);

  form = this.fb.group({
    categoryId: [[] as number[]], 
    title: ['', [Validators.required]],
    subtitle: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    author: ['Gazeta do Pará', [Validators.required]],
    content: ['', [Validators.required]],
    newsMidia: [[] as NewsMedia[], [Validators.required]],
    newsVideo: [[] as NewsVideo[]],
    published: [this.getCurrentDateTime(), [Validators.required]],
    isEmphasis: [false],
    validity: [''],
    status: ['active', [Validators.required]],
    createdAt: [new Date().toISOString()],
    updateAt: [new Date().toISOString()],
    views: [0],
  });
  
  statusOptions = [
    { value: 'active', label: 'Ativa' },
    { value: 'inactive', label: 'Inativa' },
    { value: 'trash', label: 'Lixeira' }
  ];

  onSubmit() {
    const bodyForm = new FormGroup({});
    const midiaForm = new FormData();
    Object.keys(this.form.value).forEach(key => {
      if(key!=='newsMidia'){
        bodyForm.addControl(key, this.form.get(key)!);
      }else{
        this.form.get(key)?.value.forEach(item => {
          midiaForm.append(key, JSON.stringify(item));
        });
      }
    });

    


     

  }

  setActiveTab(tab: 'info' | 'content' | 'media') {
    this.activeTab = tab;
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  urlDisplaySet(urlValue:string){
    this.urlDisplay.set(urlValue);
  }

  generateSlug() {
    const title = this.form.get('title')?.value || '';
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    this.form.patchValue({ slug });
    this.urlDisplaySet(slug); 
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen.set(!this.categoryDropdownOpen());
  }

  selectCategory(category: Category) {
    const currentSelected = this.selectedCategories();
    const isAlreadySelected = currentSelected.some(cat => cat.id === category.id);
    
    if (!isAlreadySelected) {
      const newSelected = [...currentSelected, category];
      this.selectedCategories.set(newSelected);
      this.updateFormCategories(newSelected);
    }
    
    this.categoryDropdownOpen.set(false);
  }

  removeCategory(categoryId: number) {
    const newSelected = this.selectedCategories().filter(cat => cat.id !== categoryId);
    this.selectedCategories.set(newSelected);
    this.updateFormCategories(newSelected);
  }

  private updateFormCategories(categories: Category[]) {
    const categoryIds = categories.map(cat => cat.id!);
    this.form.patchValue({ categoryId: categoryIds });
  }

  getAvailableCategories(): Category[] {
    const selectedIds = this.selectedCategories().map(cat => cat.id);
    return this.availableCategories.filter(cat => !selectedIds.includes(cat.id));
  }
  
  onFormValue(formValue: {newsVideo: NewsVideo[], newsMedia: NewsMedia[]}) {
    this.form.patchValue({
      newsVideo: formValue.newsVideo,
      newsMidia: formValue.newsMedia
    })
  }
  
  onReset() {
    this.form.reset();
    this.selectedCategories.set([]);
    setTimeout(() => {
      this.form.patchValue({ 
        published: this.getCurrentDateTime(),
        author: 'Gazeta do Pará',
        status: 'active'
      });
    }, 0);
    this.activeTab = 'info';
  }


  // Método melhorado para obter data e hora atual
  private getCurrentDateTime(): string {
    const now = new Date();
    // Ajustar para timezone local
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - (offset * 60 * 1000));
    return localTime.toISOString().slice(0, 16);
  }
}
