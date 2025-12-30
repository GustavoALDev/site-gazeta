import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoModalInfoComponent } from './video-modal-info.component';

describe('VideoModalInfoComponent', () => {
  let component: VideoModalInfoComponent;
  let fixture: ComponentFixture<VideoModalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoModalInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoModalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

