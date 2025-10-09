import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselSwipeComponent } from './carousel-swipe.component';

describe('CarouselSwipeComponent', () => {
  let component: CarouselSwipeComponent;
  let fixture: ComponentFixture<CarouselSwipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselSwipeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselSwipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with first item as current', () => {
    // Com o sistema de clones mínimos, o primeiro item real está no índice 0
    expect(component.isActiveSlide(0)).toBeTruthy();
  });

  it('should navigate to next item', () => {
    const initialIndex = component.isActiveSlide(0);
    component.goToNext();
    fixture.detectChanges();
    
    expect(initialIndex).toBeTruthy();
    expect(component.isActiveSlide(1)).toBeTruthy();
  });

  it('should navigate to previous item', () => {
    component.goToNext(); // Go to second item first
    fixture.detectChanges();
    
    component.goToPrevious(); // Go back to first
    fixture.detectChanges();
    
    expect(component.isActiveSlide(0)).toBeTruthy();
  });

  it('should have infinite loop navigation with smooth transitions', (done) => {
    const totalItems = component.newsItems().length;
    
    // Navigate to last item
    component.goToSlide(totalItems - 1);
    fixture.detectChanges();
    expect(component.isActiveSlide(totalItems - 1)).toBeTruthy();
    
    // Go to next (should smoothly loop to first)
    component.goToNext();
    fixture.detectChanges();
    
    // Wait for transition and repositioning
    setTimeout(() => {
      expect(component.isActiveSlide(0)).toBeTruthy();
      
      // Test reverse loop: from first to last
      component.goToPrevious();
      fixture.detectChanges();
      
      setTimeout(() => {
        expect(component.isActiveSlide(totalItems - 1)).toBeTruthy();
        done();
      }, 400);
    }, 400);
  });

  it('should display news items with required properties', () => {
    const newsItems = component.newsItems();
    
    expect(newsItems.length).toBeGreaterThan(0);
    
    newsItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.author).toBeDefined();
      expect(item.categoryId).toBeDefined();
      expect(Array.isArray(item.categoryId)).toBeTruthy();
      expect(item.mediaNews).toBeDefined();
      expect(Array.isArray(item.mediaNews)).toBeTruthy();
    });
  });

  it('should extract image URL from news item', () => {
    const newsItems = component.newsItems();
    const firstItem = newsItems[0];
    const imageUrl = component.getImageUrl(firstItem);
    
    expect(imageUrl).toBeTruthy();
    expect(typeof imageUrl).toBe('string');
  });

  it('should extract tags from category IDs', () => {
    const newsItems = component.newsItems();
    const firstItem = newsItems[0];
    const tags = component.getTags(firstItem);
    
    expect(Array.isArray(tags)).toBeTruthy();
    expect(tags.length).toBeGreaterThan(0);
  });

  it('should create extended items with clones for smooth loop', () => {
    const originalItems = component.newsItems();
    const extendedItems = component.extendedItems();
    
    // Deve ter 2 clones + itens originais (total + 2)
    expect(extendedItems.length).toBe(originalItems.length + 2);
    
    // Primeiro item deve ser clone do último
    expect(extendedItems[0].isClone).toBeTruthy();
    expect(extendedItems[0].originalIndex).toBe(originalItems.length - 1);
    
    // Último item deve ser clone do primeiro
    expect(extendedItems[extendedItems.length - 1].isClone).toBeTruthy();
    expect(extendedItems[extendedItems.length - 1].originalIndex).toBe(0);
    
    // Itens do meio devem ser originais
    expect(extendedItems[1].isClone).toBeFalsy();
    expect(extendedItems[originalItems.length].isClone).toBeFalsy();
  });
});
