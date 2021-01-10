import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFunctionComponent } from './test-function.component';

describe('TestFunctionComponent', () => {
  let component: TestFunctionComponent;
  let fixture: ComponentFixture<TestFunctionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestFunctionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestFunctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
