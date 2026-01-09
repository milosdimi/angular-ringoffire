import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-player',
  standalone: true,
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent {
  @Input() name: string = '';
  @Input() playerActive: boolean = false;

  
  @Input() avatar: string = 'man.png';

  get avatarSrc(): string {
    return `assets/img/profile/${this.avatar}`;
  }
}
