import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsCategorySectionComponent } from './news-category-section.component';

describe('NewsCategorySectionComponent', () => {
  let component: NewsCategorySectionComponent;
  let fixture: ComponentFixture<NewsCategorySectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCategorySectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsCategorySectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
