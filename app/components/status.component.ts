import {Component} from 'angular2/core';

import {GameData} from '../models/game-data';

import {GameLoaderService} from '../services/game-loader.service';

@Component({
  selector: 'status',
  template: `
    <div *ngIf="game?.rooms?.current_room">
    <p class="room-name">Current Location: {{ game.rooms.current_room.name }}</p>
    <p class="room-description">{{ game.rooms.current_room.description }}</p>
    <p class="room-exits">Visible Exits:
      <span *ngFor="#exit of game.rooms.current_room.exits">{{ exit.direction }} </span>
    </p>
    <p class="room-exits">Who's here:<br />
      <span *ngFor="#monster of game.monsters.visible">{{ monster.name }}<br /></span>
    </p>
    <p class="room-exits">What's around:<br />
      <span *ngFor="#artifact of game.artifacts.visible">{{ artifact.name }}<br /></span>
    </p>
    <p class="timer">Timer: {{game.timer}}</p>
    </div>
    `,
})
export class StatusComponent {
  
  game: GameData;
  
  /**
   * Constructor. No actual code, but needed for DI
   */  
  constructor(_loader:GameLoaderService) {
    this.game = _loader.game_data;
  }

}
