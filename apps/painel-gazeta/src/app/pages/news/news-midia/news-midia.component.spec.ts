import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsMidiaComponent } from './news-midia.component';

describe('NewsMidiaComponent', () => {
  let component: NewsMidiaComponent;
  let fixture: ComponentFixture<NewsMidiaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsMidiaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsMidiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
