import {Component,  OnInit}  from '@angular/core';
import {RouteParams, Router} from '@angular/router-deprecated';

import {Player} from '../models/player';
import {PlayerService} from '../services/player.service';

@Component({
  template: `
  <p>You are in the outer chamber of the hall of the Guild of Free Adventurers. Many men and women are guzzling beer and there is loud singing and laughter.</p>
  <p>On the north side of the chamber is a cubbyhole with a desk. Over the desk is a sign which says: <strong>&quot;REGISTER HERE OR ELSE!&quot;</strong></p>
  <p>The guest book on the desk lists the following players:</p>
  <p class="player"
    *ngFor="let player of _playerService.players"
    (click)="gotoPlayer(player)">{{player.name}}</p>
  `,
})
export class PlayerListComponent implements OnInit  {

  constructor(
    private _router: Router,
    private _routeParams: RouteParams,
    private _playerService: PlayerService){}

  public ngOnInit(): void {
    this._playerService.getList();
  }

  gotoPlayer(player: Player) {
    window.localStorage.setItem('player_id', String(player.id));
    this._router.navigate( ['PlayerDetail', { id: player.id }] );
  }
}