import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogPreview } from './catalog-preview';

describe('CatalogPreview', () => {
  let component: CatalogPreview;
  let fixture: ComponentFixture<CatalogPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogPreview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogPreview);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
