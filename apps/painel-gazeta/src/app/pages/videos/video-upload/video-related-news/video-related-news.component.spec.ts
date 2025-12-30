import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoRelatedNewsComponent } from './video-related-news.component';

describe('VideoRelatedNewsComponent', () => {
  let component: VideoRelatedNewsComponent;
  let fixture: ComponentFixture<VideoRelatedNewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRelatedNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoRelatedNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
