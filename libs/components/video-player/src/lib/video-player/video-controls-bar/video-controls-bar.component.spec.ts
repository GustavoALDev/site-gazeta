import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoControlsBarComponent } from './video-controls-bar.component';

describe('VideoControlsBarComponent', () => {
  let component: VideoControlsBarComponent;
  let fixture: ComponentFixture<VideoControlsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoControlsBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoControlsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

