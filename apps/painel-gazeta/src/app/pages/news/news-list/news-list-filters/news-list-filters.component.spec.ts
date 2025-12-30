import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsListFiltersComponent } from './news-list-filters.component';

describe('NewsListFiltersComponent', () => {
  let component: NewsListFiltersComponent;
  let fixture: ComponentFixture<NewsListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsListFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

