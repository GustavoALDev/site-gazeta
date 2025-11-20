import { Component, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

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
import { NewsService } from '../../core/services/news.service';
import { CategoryService } from '../../core/services/category.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '../../core/env/env';

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
  @ViewChild(NewsMidiaComponent) newsMidiaComponent!: NewsMidiaComponent;
  fb = inject(NonNullableFormBuilder);
  formValidator = inject(FormValidatorService);
  newsService = inject(NewsService);
  categoryService = inject(CategoryService);
  activeRouter = inject(ActivatedRoute)
  apiUrl = environment.apiUrl;
  activeTab: 'info' | 'content' | 'media' = 'info';
  sidebarOpen = signal<boolean>(true);
  destroy$ = new Subject<void>();
  urlDisplay = signal<string>('');
  displayError = signal<{ [key: string]: string } | null>({});
  availableCategories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);
  categoryDropdownOpen = signal<boolean>(false);
  isEdit = signal<boolean>(false)
  newsId:number |null = null
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
    status: ['ACTIVE'],

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
    this.getCategories();
    this.formValidator.InitValidation(this.form, this.errorMessage)
    .pipe(takeUntil(this.destroy$))
    .subscribe((errorMessages) => {
      this.displayError.set(errorMessages);
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
        this.getCategories();
        this.isEdit.set(true)
        this.newsId = newsId
        firstValueFrom(this.newsService.getById(newsId))
        .then((resp)=>{
          console.log(resp);
          const news:News = resp as News
          news.categoryId.forEach((categoryId) => {
            const category = this.availableCategories().find(cat => cat.id === categoryId);
            this.selectedCategories.update((cats) => [...cats, category!]);
          });
          this.form.patchValue({
            ...resp,
            validity: resp.validity ? null : null
          } as any)
          this.exportEditNewsMedia.set({newsMedia:news.mediaNews,newsVideos:news.videoNews})
        })
      }
    })
    .catch(error=> {
      throw error
    })
  }
  getCategories(){
    this.categoryService.getActive()
    .pipe(first())
    .subscribe((categories) => {
      this.availableCategories.set(categories as Category[]);
    });
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
    if(this.isEdit()){
      this.newsService.update(this.newsId as number,newsData as News)
    .subscribe({
      next: (res) => {

        const newsMedia = formValue.newsMidia as NewsMedia[]
        const midias:FormData[] = []
        console.log(newsMedia)
        newsMedia.forEach((media) => {
          if(media.file){
            const formMidia = new FormData();
          formMidia.append('postId', res.id.toString());
          formMidia.append('emphasis', media.emphasis.toString());
          formMidia.append('author', media.author as string);
          formMidia.append('date', media.date as string);
          formMidia.append('file', media.file as File);
          midias.push(formMidia);
          }
        })
        newsMedia.forEach((media) => {
          console.log(media)
        })


        from(midias)
        .pipe(
          concatMap(midia => this.newsService.uploadMedia(midia)), // uma por vez
          toArray() // junta os resultados em um array
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            alert('Notícia editada com sucesso!');
            this.onReset();
            this.checkEdit();
          },
          error: (err) => {
            alert('Erro ao salvar midia de notícia!');
            throw err;
          }
        });
      },
      error: (err) => {
        alert('Erro ao editar notícia!');
        throw err;
      }
    });
    }else{
      this.newsService.create(newsData as News)
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
          concatMap(midia => this.newsService.uploadMedia(midia)), // uma por vez
          toArray() // junta os resultados em um array
        )
        .subscribe({
          next: (res) => {
            console.log(res);
            alert('Notícia criada com sucesso!');
            this.onReset();
            this.newsMidiaComponent?.resetMedia();
          },
          error: (err) => {
            alert('Erro ao salvar midia de notícia!');
            throw err;
          }
        });
      },
      error: (err) => {
        alert('Erro ao criar notícia!');
        throw err;
      }
    });
    }

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

  onReady(editor: any) {
    console.log(editor);
  }

  onReset() {
    this.form.reset();
    this.form.controls['content'].reset('');
    this.selectedCategories.set([]);
    setTimeout(() => {
      this.form.patchValue({
        published: this.getCurrentDateTime(),
        author: 'Gazeta do Pará',
        status: 'ACTIVE',
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
