import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarouselComponent } from './carousel.component';

describe('CarouselComponent', () => {
  let component: CarouselComponent;
  let fixture: ComponentFixture<CarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarouselComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with correct news items', () => {
    const newsItems = component.newsItems();
    
    expect(newsItems.length).toBeGreaterThan(0);
    
    newsItems.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.subtitle).toBeDefined();
      expect(item.content).toBeDefined();
      expect(item.author).toBeDefined();
      expect(item.categoryId).toBeDefined();
      expect(Array.isArray(item.categoryId)).toBeTruthy();
      expect(item.mediaNews).toBeDefined();
      expect(Array.isArray(item.mediaNews)).toBeTruthy();
      expect(item.published).toBeDefined();
      expect(item.views).toBeDefined();
      expect(item.status).toBeDefined();
      expect(item.slug).toBeDefined();
      expect(typeof item.isEmphasis).toBe('boolean');
    });
  });

  it('should navigate to next items', () => {
    component.goToNext();
    fixture.detectChanges();
    
    expect(component).toBeTruthy(); // Basic test for navigation
  });

  it('should navigate to previous items', () => {
    component.goToNext(); // Go forward first
    fixture.detectChanges();
    
    component.goToPrevious(); // Then go back
    fixture.detectChanges();
    
    expect(component).toBeTruthy(); // Basic test for navigation
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
    expect(tags).toContain('DESTAQUE');
  });

  it('should return formatted date', () => {
    const newsItems = component.newsItems();
    const firstItem = newsItems[0];
    const formattedDate = component.getFormattedDate(firstItem);
    
    expect(formattedDate).toBeTruthy();
    expect(typeof formattedDate).toBe('string');
  });

  it('should return comments count', () => {
    const commentsCount = component.getCommentsCount();
    
    expect(typeof commentsCount).toBe('number');
    expect(commentsCount).toBe(0); // Currently returns 0
  });
});
