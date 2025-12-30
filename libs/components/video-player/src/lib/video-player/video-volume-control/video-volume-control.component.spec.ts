import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoVolumeControlComponent } from './video-volume-control.component';

describe('VideoVolumeControlComponent', () => {
  let component: VideoVolumeControlComponent;
  let fixture: ComponentFixture<VideoVolumeControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoVolumeControlComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoVolumeControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

