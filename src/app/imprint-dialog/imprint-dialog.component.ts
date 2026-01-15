import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-imprint-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Impressum</h2>

    <mat-dialog-content class="text">
      <p><strong>Betreiber</strong><br />Milos Dimitrijevic</p>
      <p>
        Fragen zum Impressum:
        <a href="mailto:dm&#64;dimit.cc">dm&#64;dimit.cc</a>
      </p>

      <p>
        Dieses Projekt ist ein privates Demo-Projekt ohne kommerzielle Nutzung.
      </p>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Schließen</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .text {
        font-size: 14px;
        line-height: 1.5;
      }
      p {
        margin-bottom: 12px;
      }
    `,
  ],
})
export class ImprintDialogComponent {}
