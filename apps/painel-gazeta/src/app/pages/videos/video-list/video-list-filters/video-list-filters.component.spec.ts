import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoListFiltersComponent } from './video-list-filters.component';

describe('VideoListFiltersComponent', () => {
  let component: VideoListFiltersComponent;
  let fixture: ComponentFixture<VideoListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoListFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

