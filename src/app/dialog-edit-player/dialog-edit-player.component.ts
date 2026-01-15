import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-dialog-edit-player',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
  ],
  templateUrl: './dialog-edit-player.component.html',
  styleUrls: ['./dialog-edit-player.component.scss'],
})
export class DialogEditPlayerComponent {
  name: string;
  avatar: string;

  avatars: string[] = [
    'cow.png',
    'death.png',
    'doctor.png',
    'farmer.png',
    'man.png',
    'race.png',
  ];

  constructor(
    private dialogRef: MatDialogRef<DialogEditPlayerComponent>,
    @Inject(MAT_DIALOG_DATA) data: { name: string; avatar: string }
  ) {
    this.name = data.name;
    this.avatar = data.avatar;
  }

  save(): void {
    this.dialogRef.close({
      name: this.name.trim(),
      avatar: this.avatar,
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
  remove(): void {
    this.dialogRef.close({ remove: true });
  }
}
