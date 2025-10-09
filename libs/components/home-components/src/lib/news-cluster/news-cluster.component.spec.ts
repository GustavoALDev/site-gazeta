import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewsClusterComponent } from './news-cluster.component';

describe('NewsClusterComponent', () => {
  let component: NewsClusterComponent;
  let fixture: ComponentFixture<NewsClusterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewsClusterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewsClusterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
