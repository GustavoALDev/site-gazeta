import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdsListFiltersComponent } from './ads-list-filters.component';

describe('AdsListFiltersComponent', () => {
  let component: AdsListFiltersComponent;
  let fixture: ComponentFixture<AdsListFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdsListFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdsListFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

