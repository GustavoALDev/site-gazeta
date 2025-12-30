import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoLatestComponent } from './video-latest.component';

describe('VideoLatestComponent', () => {
  let component: VideoLatestComponent;
  let fixture: ComponentFixture<VideoLatestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoLatestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
