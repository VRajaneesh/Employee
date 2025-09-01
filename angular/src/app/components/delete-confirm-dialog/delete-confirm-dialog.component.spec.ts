// ...existing code...
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteConfirmDialog } from './delete-confirm-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('DeleteConfirmDialog', () => {
  let component: DeleteConfirmDialog;
  let fixture: ComponentFixture<DeleteConfirmDialog>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteConfirmDialog],
      providers: [
        { provide: MatDialogRef, useValue: { close: jasmine.createSpy('close') } },
        { provide: MAT_DIALOG_DATA, useValue: { filename: 'Test' } }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(DeleteConfirmDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should close with false on cancel', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalledWith(false);
  });
  it('should close with true on confirm', () => {
    const dialogRef = TestBed.inject(MatDialogRef);
    component.onConfirm();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  });
});
