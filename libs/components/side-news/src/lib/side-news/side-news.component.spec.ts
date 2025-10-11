import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SideNewsComponent } from './side-news.component';

describe('SideNewsComponent', () => {
  let component: SideNewsComponent;
  let fixture: ComponentFixture<SideNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SideNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SideNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
