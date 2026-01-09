import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() name: string = '';
  @Input() avatar: string = 'man.png';
  @Input() playerActive: boolean = false;


  @Input() compact: boolean = false;

  get avatarSrc(): string {
    return `assets/img/profile/${this.avatar}`;
  }

  get initials(): string {
    return (this.name || '?').trim().slice(0, 1).toUpperCase();
  }
}
