import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsCategoryGridComponent } from './news-category-grid.component';

describe('NewsCategoryGridComponent', () => {
  let component: NewsCategoryGridComponent;
  let fixture: ComponentFixture<NewsCategoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsCategoryGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsCategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
