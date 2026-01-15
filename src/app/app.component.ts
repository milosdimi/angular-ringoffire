import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button'; // ✅ dazu

import { ImprintDialogComponent } from './imprint-dialog/imprint-dialog.component';
import { PrivacyDialogComponent } from './privacy-dialog/privacy-dialog.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule], // ✅ dazu
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ringoffire';
  year = new Date().getFullYear();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  openImprint() {
    this.dialog.open(ImprintDialogComponent, { maxWidth: '90vw', width: '700px' });
  }

  openPrivacy() {
    this.dialog.open(PrivacyDialogComponent, { maxWidth: '90vw', width: '700px' });
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    const accepted = localStorage.getItem('cookie_notice');
    if (!accepted) {
      const ref = this.snackBar.open(
        'Wir verwenden technisch notwendige Cookies/Storage für die Spielfunktion (Firebase).',
        'OK'
      );
      ref.onAction().subscribe(() => localStorage.setItem('cookie_notice', '1'));
    }
  }
}
