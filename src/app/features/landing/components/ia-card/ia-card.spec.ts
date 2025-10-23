import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IaCard } from './ia-card';

describe('IaCard', () => {
  let component: IaCard;
  let fixture: ComponentFixture<IaCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IaCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IaCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
