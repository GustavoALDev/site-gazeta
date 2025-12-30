import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselManagerComponent } from './carousel-manager.component';

describe('CarouselManagerComponent', () => {
  let component: CarouselManagerComponent;
  let fixture: ComponentFixture<CarouselManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
