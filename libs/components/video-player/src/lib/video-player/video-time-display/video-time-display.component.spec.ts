import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoTimeDisplayComponent } from './video-time-display.component';

describe('VideoTimeDisplayComponent', () => {
  let component: VideoTimeDisplayComponent;
  let fixture: ComponentFixture<VideoTimeDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoTimeDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VideoTimeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

