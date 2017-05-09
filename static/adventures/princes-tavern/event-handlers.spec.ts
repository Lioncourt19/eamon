/**
 * Unit tests for The Beginner's Cave
 */
import {async, getTestBed} from '@angular/core/testing';
import {HttpModule} from '@angular/http';

import {Game} from "../../core/models/game";
import {GameLoaderService} from "../../core/services/game-loader.service";
import {event_handlers} from "adventure/event-handlers";
import {Monster} from "../../core/models/monster";

import {
  TestBed, inject
} from '@angular/core/testing';

describe("The Prince's Tavern", function() {

  // to initialize the test, we need to load the whole game data.
  // this requires that a real, live API is running.
  let game = Game.getInstance();
  let gameLoaderService = null;
  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000; // avoid errors due to slow api calls
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        GameLoaderService
      ]
    });
    gameLoaderService = getTestBed().get(GameLoaderService);
  }));

  it("should have working event handlers", async(() => {
    gameLoaderService.setupGameData(true).subscribe(
      data => {
        game.init(data);
        expect(game.rooms.rooms.length).toBe(63, "Wrong room count. Check data.");
        expect(game.artifacts.all.length).toBe(68 + 5, "Wrong artifact count. Check data."); // includes player artifacts
        expect(game.effects.all.length).toBe(43, "Wrong effect count. Check data.");
        expect(game.monsters.all.length).toBe(33, "Wrong monster count. Check data."); // includes player
        game.start();

        // eat peanuts
        game.player.moveToRoom(23);
        game.command_parser.run("eat peanuts");
        expect(game.effects.get(2).seen).toBeTruthy();
        expect(game.player.room_id).toBe(36, "player didn't move to bar after eating peanuts");

        // spell of protection
        game.player.moveToRoom(42);
        game.monsters.get(31).room_id = 42;
        game.triggerEvent("endTurn2");
        expect(game.effects.get(3).seen).toBeTruthy("should show effect 3 in room 42");

        // brawl
        game.player.moveToRoom(game.monsters.get(25).room_id);
        game.triggerEvent('seeRoom');
        expect(game.effects.get(11).seen).toBeTruthy("should show effect 11 when seeing brawl");
        game.triggerEvent('power', 99);
        expect(game.monsters.get(25).room_id).toBeNull();
        expect(game.artifacts.get(13).isHere()).toBeTruthy('amulet should be in room');
        expect(game.effects.get(12).seen).toBeTruthy("should show effect 12 when stopping brawl");

        // mad piano player
        game.player.moveToRoom(game.monsters.get(6).room_id);
        game.command_parser.run("say gronk");
        expect(game.effects.get(43).seen).toBeTruthy("effect 43 not shown");
        game.artifacts.get(8).monster_id = Monster.PLAYER;
        game.artifacts.get(8).room_id = null;
        game.player.updateInventory();
        expect(game.player.hasArtifact(8)).toBeTruthy("player didn't get artifact 8");
        game.command_parser.run("give lamp to mad piano player");
        expect(game.effects.get(37).seen).toBeTruthy("effect 37 not shown");

        // hokas tokas
        game.player.moveToRoom(game.monsters.get(32).room_id);
        expect(game.data['locate active']).toBeFalsy('FAIL: Locate should not be active yet');
        game.artifacts.get(13).monster_id = Monster.PLAYER;
        game.player.updateInventory();
        expect(game.player.hasArtifact(13)).toBeTruthy("player didn't get artifact 13");
        game.command_parser.run("give silver amulet to hokas tokas");
        expect(game.effects.get(13).seen).toBeTruthy("effect 13 not shown");
        expect(game.effects.get(14).seen).toBeTruthy("effect 14 not shown");
        expect(game.data['locate active']).toBeTruthy('FAIL: Locate should be active');

        // gerschter bar
        game.player.moveToRoom(7);
        game.command_parser.run('speed');
        expect(game.effects.get(10).seen).toBeTruthy();

        // pink elephant
        game.player.moveToRoom(33);
        game.command_parser.run('drink rum');
        expect(game.effects.get(27).seen).toBeTruthy("effect 27 not shown");
        expect(game.monsters.get(11).room_id).toBe(33, "pink elephant did not appear");

      }
    );
  }));

  it("should handle the strange brew", async(() => {
    gameLoaderService.setupGameData(true).subscribe(
      data => {
        game.init(data);
        game.start();

        // distillery/strange brew
        game.player.moveToRoom(51);
        game.monsters.get(17).moveToRoom(50);  // get fire worm out of the way
        game.mock_random_numbers = [1, 2, 3, 4, 5];
        let original_ag = game.player.agility;
        let original_ch = game.player.charisma;
        let original_sword = game.player.weapon_abilities[5];
        let original_ae = game.player.armor_expertise;

        game.command_parser.run("drink strange brew");
        expect(game.effects.get(28).seen).toBeTruthy("effect 28 not shown");
        expect(game.player.charisma).toBe(original_ch - 3, "didn't lower ch");

        game.command_parser.run("drink strange brew");
        expect(game.effects.get(29).seen).toBeTruthy("effect 29 not shown");
        expect(game.player.charisma).toBe(original_ch, "didn't raise ch");  // -3 above, +3 here

        game.command_parser.run("drink strange brew");
        expect(game.effects.get(30).seen).toBeTruthy("effect 30 not shown");
        expect(game.player.agility).toBe(original_ag - 3, "didn't lower ag");

        game.command_parser.run("drink strange brew");
        expect(game.effects.get(31).seen).toBeTruthy("effect 31 not shown");
        expect(game.player.weapon_abilities[5]).toBe(original_sword + 7, "didn't raise wpns");

        game.command_parser.run("drink strange brew");
        expect(game.effects.get(32).seen).toBeTruthy("effect 32 not shown");
        expect(game.player.armor_expertise).toBe(original_ae + 10, "didn't raise ae");

      }
    );
  }));

});
