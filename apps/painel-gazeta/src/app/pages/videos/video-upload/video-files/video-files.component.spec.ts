import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VideoFilesComponent } from './video-files.component';

describe('VideoFilesComponent', () => {
  let component: VideoFilesComponent;
  let fixture: ComponentFixture<VideoFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoFilesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VideoFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
