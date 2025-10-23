import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyBanner } from './company-banner';

describe('CompanyBanner', () => {
  let component: CompanyBanner;
  let fixture: ComponentFixture<CompanyBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
