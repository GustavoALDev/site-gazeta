import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoCategoryGridComponent } from './video-category-grid.component';

describe('VideoCategoryGridComponent', () => {
  let component: VideoCategoryGridComponent;
  let fixture: ComponentFixture<VideoCategoryGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCategoryGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoCategoryGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
