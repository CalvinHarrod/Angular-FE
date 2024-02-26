import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FailWebpageComponent } from './fail-webpage.component';

describe('FailWebpageComponent', () => {
  let component: FailWebpageComponent;
  let fixture: ComponentFixture<FailWebpageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FailWebpageComponent]
    });
    fixture = TestBed.createComponent(FailWebpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
