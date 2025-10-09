import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsHighligthsComponent } from './news-highligths.component';

describe('NewsHighligthsComponent', () => {
  let component: NewsHighligthsComponent;
  let fixture: ComponentFixture<NewsHighligthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsHighligthsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsHighligthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
