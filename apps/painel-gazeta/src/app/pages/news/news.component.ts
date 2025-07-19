import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { TextEditorComponent } from '@site-gazeta/text-editor';
import {
  NonNullableFormBuilder,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { NewsMidiaComponent } from './news-midia/news-midia.component';
import { NewsMedia, NewsVideo, Category, News } from '@site-gazeta/models';
import { FormValidatorComponent, FormValidatorService } from '@site-gazeta/form-validator';
import { concatMap,  first,  firstValueFrom,  from, Subject,   takeUntil, toArray } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-news',
  imports: [
    TextEditorComponent,
    ReactiveFormsModule,
    FormsModule,
    NewsMidiaComponent,
    FormValidatorComponent,
    RouterModule
],
  providers: [FormValidatorService],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss',
})
export class NewsComponent implements OnInit, OnDestroy {
  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);
  apiService = inject(ApiService);
  activeRouter = inject(ActivatedRoute)
  activeTab: 'info' | 'content' | 'media' = 'info';
  sidebarOpen = signal<boolean>(true);
  destroy$ = new Subject<void>();
  urlDisplay = signal<string>('');
  displayError = signal<{ [key: string]: string } | null>({});
  availableCategories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);
  categoryDropdownOpen = signal<boolean>(false);
  isEdit = signal<boolean>(false)
  exportEditNewsMedia = signal<{newsMedia:NewsMedia[], newsVideos:NewsVideo[]}| null>(null)
  form = this.fb.group({
    categoryId: [[] as number[], [Validators.required]],
    title: ['', [Validators.required]],
    subtitle: ['', [Validators.required]],
    slug: ['', [Validators.required]],
    author: ['Gazeta do Pará', [Validators.required]],
    content: ['', [Validators.required]],
    newsMidia: [[] as NewsMedia[], [Validators.required]],
    newsVideo: [[] as NewsVideo[]],
    published: [this.getCurrentDateTime(), [Validators.required]],
    isEmphasis: [false],
    validity: [null],
    status: ['ATIVO'],
    
  });

  errorMessage = {
    title: {
      required: 'Título é obrigatório',
    },
    subtitle: {
      required: 'Subtítulo é obrigatório',
    },
    slug: {
      required: 'Slug é obrigatório',
    },
    author: {
      required: 'Autor é obrigatório',
    },
    content: {
      required: 'Conteúdo é obrigatório',
    },  
   
  };

  statusOptions = [
    { value: 'ACTIVE', label: 'Ativo' },
    { value: 'INACTIVE', label: 'Inativo' },
  ];

  async ngOnInit() {
    await this.checkEdit()
    this.formValidator.InitValidation(this.form, this.errorMessage)
    .pipe(takeUntil(this.destroy$))
    .subscribe((errorMessages) => {
      this.displayError.set(errorMessages);
    });
    this.apiService.getActiveCategories().subscribe((categories) => {
      this.availableCategories.set(categories as Category[]);
    });
    this.form.get('slug')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((value) => {
      if(value){
        this.formatedSlug(value);
      }
    });
  }
  async checkEdit(){
   return firstValueFrom(this.activeRouter.params)
    .then((param)=>{
      const newsId = param['id']
      if(newsId){
        console.log(newsId)
        this.isEdit.set(true)
        firstValueFrom(this.apiService.getNewsById(newsId))
        .then((resp)=>{
          const news:News = resp as News
          this.form.patchValue(resp)
          this.exportEditNewsMedia.set({newsMedia:news.mediaNews,newsVideos:news.videoNews})
        })
        console.log(this.isEdit())
      }
    })
    .catch(error=> {
      throw error
    })
  }

  onSubmit() {
    const formValue = this.form.value;
    const newsData = {  
      title: formValue.title as string,
      subtitle: formValue.subtitle as string,
      slug: formValue.slug as string,
      author: formValue.author as string,
      content: formValue.content as string,
      categoryId: formValue.categoryId as number[],
      published: formValue.published as string,
      isEmphasis: formValue.isEmphasis as boolean,
      validity: formValue.validity as string | null,
      status: formValue.status as string,
    };

    this.apiService.setNews(newsData as News)
    .subscribe({
      next: (res) => {
        const newsMedia = formValue.newsMidia as NewsMedia[]
        const midias:FormData[] = []
        newsMedia.forEach((media) => {
          const formMidia = new FormData();
          formMidia.append('postId', res.id.toString());
          formMidia.append('emphasis', media.emphasis.toString());
          formMidia.append('author', media.author as string);
          formMidia.append('date', media.date as string);
          formMidia.append('file', media.file as File);
          midias.push(formMidia);
        })

        from(midias)
        .pipe(
          concatMap(midia => this.apiService.setNewsMedia(midia)), // uma por vez
          toArray() // junta os resultados em um array
        )
        .subscribe({
          next: (res) => console.log(res),
          error: (err) => console.log(err)
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  setActiveTab(tab: 'info' | 'content' | 'media') {
    this.activeTab = tab;
  }

  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  urlDisplaySet(urlValue: string) {
    this.urlDisplay.set(urlValue);
  }
  setSlug() {
   const title = this.form.get('title')?.value as string
   this.formatedSlug(title)
  }
  
  formatedSlug(value?:string) {
    if(value){
      const slug = value
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
    
    
  }

  toggleCategoryDropdown() {
    this.categoryDropdownOpen.set(!this.categoryDropdownOpen());
  }

  selectCategory(category: Category) {
    const currentSelected = this.selectedCategories();
    const isAlreadySelected = currentSelected.some(
      (cat) => cat.id === category.id
    );

    if (!isAlreadySelected) {
      const newSelected = [...currentSelected, category];
      this.selectedCategories.set(newSelected);
      this.updateFormCategories(newSelected);
    }

    this.categoryDropdownOpen.set(false);
  }

  removeCategory(categoryId: number) {
    const newSelected = this.selectedCategories().filter(
      (cat) => cat.id !== categoryId
    );
    this.selectedCategories.set(newSelected);
    this.updateFormCategories(newSelected);
  }

  private updateFormCategories(categories: Category[]) {
    const categoryIds = categories.map((cat) => cat.id as number);
    this.form.patchValue({ categoryId: categoryIds });
  }

  getAvailableCategories(): Category[] {
    const selectedIds = this.selectedCategories().map((cat) => cat.id);
    return this.availableCategories().filter(
      (cat) => !selectedIds.includes(cat.id as number)
    );
  }

  onFormValue(formValue: { newsVideo: NewsVideo[]; newsMedia: NewsMedia[] }) {
    this.form.patchValue({
      newsVideo: formValue.newsVideo,
      newsMidia: formValue.newsMedia,
    });
  }

  onReset() {
    this.form.reset();
    this.selectedCategories.set([]);
    setTimeout(() => {
      this.form.patchValue({
        published: this.getCurrentDateTime(),
        author: 'Gazeta do Pará',
        status: 'active',
      });
    }, 0);
    this.activeTab = 'info';
  }

  // Método melhorado para obter data e hora atual
  private getCurrentDateTime(): string {
    const now = new Date();
    // Ajustar para timezone local
    const offset = now.getTimezoneOffset();
    const localTime = new Date(now.getTime() - offset * 60 * 1000);
    return localTime.toISOString().slice(0, 16);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
