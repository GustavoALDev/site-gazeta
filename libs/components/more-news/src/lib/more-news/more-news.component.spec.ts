import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoreNewsComponent } from './more-news.component';

describe('MoreNewsComponent', () => {
  let component: MoreNewsComponent;
  let fixture: ComponentFixture<MoreNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoreNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MoreNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
