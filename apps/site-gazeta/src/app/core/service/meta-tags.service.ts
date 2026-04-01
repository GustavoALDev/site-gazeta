import { inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { META_OG, META_TAGS, META_TWITTER } from '../ts/mock-tags';

@Injectable({
  providedIn: 'root'
})
export class MetaTagsService {
  private meta = inject(Meta);
  private title = inject(Title);

  private tags = META_TAGS;
  private og = META_OG;
  private twitter = META_TWITTER;

  setTags(){
    
    this.title.setTitle('Gazeta do Pará - O seu Portal de notícias do Estado do Pará.');
    this.meta.addTags(this.tags);
    this.meta.addTags(this.og);
    this.meta.addTags(this.twitter);
  }
  updateTitle(title: string){
    this.title.setTitle(title);
  }
  updateTags(tags: any[]) {
    tags.forEach(tag => {
      this.meta.updateTag(tag);
    });
  }
}
