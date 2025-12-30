import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoProgressBarComponent } from './video-progress-bar.component';

describe('VideoProgressBarComponent', () => {
  let component: VideoProgressBarComponent;
  let fixture: ComponentFixture<VideoProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoProgressBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

