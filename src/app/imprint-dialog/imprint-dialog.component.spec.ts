import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImprintDialogComponent } from './imprint-dialog.component';

describe('ImprintDialogComponent', () => {
  let component: ImprintDialogComponent;
  let fixture: ComponentFixture<ImprintDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImprintDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImprintDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
