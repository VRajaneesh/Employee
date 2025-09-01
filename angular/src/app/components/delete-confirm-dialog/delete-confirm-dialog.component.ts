/**
 * DeleteConfirmDialog Component
 * Angular Material dialog for confirming employee deletion.
 * Displays a message and returns true/false based on user action.
 */
import { Component, Inject } from '@angular/core'; // Angular core imports
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; // Material dialog references and data injection
import { MatIconModule } from '@angular/material/icon'; // Material icon module
import { MatCardModule } from '@angular/material/card'; // Material card module
import { MatButtonModule } from '@angular/material/button'; // Material button module

@Component({
  selector: 'app-delete-confirm-dialog', // Component selector for dialog
  templateUrl: './delete-confirm-dialog.component.html', // External HTML template
  styleUrls: ['./delete-confirm-dialog.component.css'], // External CSS styles
  standalone: true, // Standalone Angular component
  imports: [MatIconModule, MatCardModule, MatButtonModule] // Imported Material modules
})
export class DeleteConfirmDialog {
  /**
   * Constructor for DeleteConfirmDialog
   * @param dialogRef Reference to the dialog instance
   * @param data Data passed to the dialog (e.g., filename)
   */
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmDialog>, // Dialog reference for closing dialog
    @Inject(MAT_DIALOG_DATA) public data: any // Injected data for dialog content
  ) {}

  /**
   * Called when user clicks Cancel/No
   * Closes the dialog and returns false
   */
  onCancel(): void {
    this.dialogRef.close(false); // Close dialog with false (cancel)
  }

  /**
   * Called when user clicks Confirm/Ok
   * Closes the dialog and returns true
   */
  onConfirm(): void {
    this.dialogRef.close(true); // Close dialog with true (confirm)
  }
}
