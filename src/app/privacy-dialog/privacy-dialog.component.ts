import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-privacy-dialog',
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Datenschutz</h2>

    <mat-dialog-content class="text">
      <p>
        Diese Website stellt ein Browser-Spiel bereit. Es werden keine
        Marketing- oder Analyse-Tools eingesetzt.
      </p>

      <p>
        <strong>Server-Logs</strong><br />
        Beim Aufruf werden technisch notwendige Daten verarbeitet (z. B.
        IP-Adresse, Datum/Uhrzeit, aufgerufene Datei).
      </p>

      <p>
        <strong>Firestore (Google Firebase)</strong><br />
        Zur Speicherung und Synchronisation von Spieldaten nutzen wir Google
        Firebase (Firestore). Dabei können technische Daten verarbeitet und
        Daten in der Firestore-Datenbank gespeichert werden.
      </p>

      <p>
        Fragen zum Datenschutz:
        <a href="mailto:dm&#64;dimit.cc">dm&#64;dimit.cc</a>
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
        line-height: 1.55;
      }
      p {
        margin: 0 0 12px;
      }
      a {
        text-decoration: none;
      }
    `,
  ],
})
export class PrivacyDialogComponent {}
