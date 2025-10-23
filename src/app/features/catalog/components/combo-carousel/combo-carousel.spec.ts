import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComboCarousel } from './combo-carousel';

describe('ComboCarousel', () => {
  let component: ComboCarousel;
  let fixture: ComponentFixture<ComboCarousel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComboCarousel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComboCarousel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
