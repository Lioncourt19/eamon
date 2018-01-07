import {Game} from "../../core/models/game";
import {Artifact} from "../../core/models/artifact";
import {Monster} from "../../core/models/monster";
import {RoomExit} from "../../core/models/room";
import {Room} from "../../core/models/room";
import {ReadCommand, OpenCommand} from "../../core/commands/core-commands";
import {ModalQuestion} from "../../core/models/modal";

export var event_handlers = {

  "start": function(arg: string) {
    let game = Game.getInstance();

    game.data['tancred crazy'] = false;    // d%(1)
    game.data['mylinth teleport'] = false; // d%(2)
    game.data['mouse tiger'] = false;    // d%(3)
    game.data['change gender'] = false;    // d%(4)
    game.data['change back'] = false;    // d%(5)
    game.data['vc dead'] = false;    // d%(6)
    game.data['ossoric dead'] = false;    // d%(7)
    game.data['ossogotrix dead'] = false;    // d%(8)
    game.data['befriended dragons'] = false;    // d%(9)
    game.data['met gwynnith'] = false;    // d%(10)
    game.data['captain asked'] = false;    // d%(11)
    game.data['infected'] = false;    // d%(12)
    game.data['ready invictus'] = 0;    // d%(13)
    game.data['kjelthor'] = false;    // d%(14)
    game.data['qd dragon'] = false;    // d%(15)

  },

  "death": function(monster: Monster) {
    let game = Game.getInstance();
    // some monsters have effects that appear when they die
    if (monster.id >= 5 && monster.id <= 13) {
      game.effects.print(monster.id);
    }
    if (monster.id === 18 && !game.data['change back']) {
      game.effects.print(14);
      game.data['change back'] = true;
      sex_change();
    }
    if (monster.id === 27) {
      game.data['ossoric dead'] = true;
    }
    if (monster.id === 28) {
      game.data['ossogotrix dead'] = true;
    }
  },

  "endTurn": function() {
    let game = Game.getInstance();

    // Tancred goes nuts/harpy becomes griffin
    if (game.artifacts.get(97).isHere()) {
      if (game.monsters.get(11).isHere() && !game.data['tancred crazy']) {
        game.data['tancred crazy'] = true;
        game.effects.print(27);
        game.monsters.get(11).reaction = Monster.RX_NEUTRAL;
      }
      game.artifacts.get(97).destroy();
      game.monsters.get(40).moveToRoom();
    }

    // Griffin becomes centaur
    if (game.artifacts.get(98).isHere()) {
      game.artifacts.get(98).destroy();
      game.monsters.get(41).moveToRoom();
    }

    // Centaur becomes Sauron
    if (game.artifacts.get(99).isHere()) {
      game.artifacts.get(99).destroy();
      game.monsters.get(12).moveToRoom();
    }

    // Vincingotrix dead, Invictus taken back
    if (game.artifacts.get(84).isHere() && !game.data['vc dead']) {
      game.data['vc dead'] = true;
      game.artifacts.get(32).destroy();
      game.effects.print(45);
    }

    // unicorn blood
    if (game.artifacts.get(82).isHere() && game.data['infected'] === false) {
      game.data['infected'] = true;
      game.effects.print(42);
      game.delay(2);
      for (let a of game.player.inventory) {
        game.history.write(a.name + " falls from your hands.", "no-space");
        a.moveToRoom(39);
      }
      game.artifacts.updateVisible();
      game.player.updateInventory();
      game.history.write("Everything goes black!", "special2");
      game.delay(2);
      game.history.write("You wake up an hour later, disoriented and not sure where you are.");
      game.player.moveToRoom(40);
    }

    // eggs hatch
    if (game.artifacts.get(33).isHere()) {
      game.artifacts.get(33).destroy();
      game.monsters.get(27).moveToRoom();
      game.monsters.get(28).moveToRoom();
    }

    // mylinth teleports you
    if (game.monsters.get(22).isHere() && !game.data['mylinth teleport']) {
      game.data['mylinth teleport'] = true;
      game.effects.print(18);
      game.player.moveToRoom(80);
    }

    // Erik changes your gender
    if (game.monsters.get(18).isHere() && !game.data['change gender']) {
      game.effects.print(14);
      game.data['change gender'] = true;
      sex_change();
      game.effects.print(16);
    }

    // Erik is dead, your gender changes back
    if (game.monsters.get(18).room_id === null && game.data['change back']) {
      game.effects.print(15);
      game.data['change back'] = true;
      sex_change();
    }

    // Mouse becomes tiger
    if (game.monsters.get(22).isHere() && !game.data['mouse tiger']) {
      game.data['mouse tiger'] = true;
      game.effects.print(19);
      game.monsters.get(23).moveToRoom();
    }

    // Lisolet turns against you
    let lis = game.monsters.get(29);
    if (lis.isHere() && game.player.room_id > 65 && lis.reaction === Monster.RX_FRIEND) {
      lis.reaction = Monster.RX_HOSTILE;
      game.history.write(lis.name + " looks up at the tower in awe. Then she begins to laugh wildly and draws her lance!", "special");
    }

  },

  "endTurn2": function() {
    let game = Game.getInstance();

    // ship
    if (game.player.room_id === 2 && !game.data['captain asked']) {
      game.data['captain asked'] = true;
      game.effects.print(39);

      let q1 = new ModalQuestion;
      q1.type = 'multiple_choice';
      q1.question = "Well, Outlander, will you pay it?";
      q1.choices = ['Yes', 'No', 'Say something else'];
      q1.callback = function (answer) {
        if (answer === 'Yes') {
          if (game.player.gold < 100) {
            game.effects.print(54);
            game.exit();
          } else {
            game.player.gold -= 100;
            game.effects.print(41);
            game.player.moveToRoom(3);
          }
        } else if (answer === 'no') {
          game.effects.print(53);
        } else {
          return true;  // ask the next question
        }
        return false; // don't ask the next question
      };

      let q2 = new ModalQuestion();
      q2.type = 'text';
      q2.question = "What do you say?";
      q2.callback = function (answer) {
        if (answer.toLowerCase() === 'quaal dracis') {
          game.effects.print(40);
          game.player.moveToRoom(3);
        }
        return true;
      };
      game.modal.questions = [q1, q2];
      game.modal.run();

    }

    if (game.player.room_id === 33 || game.player.room_id === 39 || game.player.room_id === 86 || game.player.room_id === 95) {
      let rl = game.diceRoll(1, 20);
      if (rl === 20) {
        game.effects.print(55);
        game.die(false);
      }
    }

    // Gwynnith makes Ossoric and Ossogotrix dissapear
    if (game.monsters.get(13).isHere() && !game.data['met gwynnith']) {
      game.data['met gwynnith'] = true;
      game.effects.print(21);
      let dragons = [game.monsters.get(27), game.monsters.get(28)];
      for (let d of dragons) {
        if (d.isHere()) {
          game.history.write(d.name + " instantly vanishes!", "special2");
          d.destroy();
        }
      }
    }

  },

  "ready": function(arg: string, old_wpn: Artifact, new_wpn: Artifact) {
    let game = Game.getInstance();
    // Ready Invictus w/o Vincingotrix in room
    if (new_wpn.id === 32 && !game.monsters.get(26).isHere()) {
      game.effects.print(43);
      new_wpn.destroy();
      game.data['ready invictus'] = 1;
      return false;
    }
    return true;
  },

  "say": function(arg) {
    let game = Game.getInstance();
    arg = arg.toLowerCase();
    if (arg === 'orowe' && game.player.room_id === 75) {
      if (game.data['befriended dragons'] && !game.data['ossoric dead'] && !game.monsters.get(27).isHere()) {
        game.effects.print(51);
        game.monsters.get(27).moveToRoom();
      }
      if (game.data['befriended dragons'] && !game.data['ossogotrix dead'] && !game.monsters.get(28).isHere()) {
        game.effects.print(52);
        game.monsters.get(28).moveToRoom();
      }
    }

    // teleport to forest
    if (arg === 'kjelthor' && game.player.room_id < 47 && game.data['befriended dragons'] && !game.data['kjelthor']) {
      game.data['kjelthor'] = 1;
      game.effects.print(46);
      game.player.moveToRoom(47);
    }

    if (arg === 'quaal dracis' && game.player.hasArtifact(30) && game.artifacts.get(30).is_worn) {
      // ragnar/woglinde
      let slab = game.artifacts.get(42);
      if (slab.isHere()) {
        slab.destroy();
        game.effects.print(20);
        if (game.player.gender === 'm') {
          game.monsters.get(10).moveToRoom();
        } else {
          game.monsters.get(9).moveToRoom();
        }
      } else if ([35, 44, 88, 98].indexOf(game.player.room_id) !== -1) {
        // go to dragons
        game.skip_battle_actions = true;
        game.effects.print(34);
        game.player.moveToRoom(45);
      } else if (game.player.room_id === 25) {
        // cave entrance
        game.effects.print(28);
        let rl = game.diceRoll(1, 4);
        if (rl === 1) {
          game.player.moveToRoom(26);
        } else if (rl === 2) {
          game.player.moveToRoom(36);
        } else if (rl === 3) {
          game.player.moveToRoom(80);
        } else {
          game.player.moveToRoom(89);
        }
      } else if (game.monsters.get(27).isHere() || game.monsters.get(28).isHere() && !game.data['qd dragon']) {
        // befriend some dragons
        if (!game.data['vc dead']) {
          game.effects.print(35);
        } else {
          game.data['qd dragon'] = true;
          if (game.data['ossoric dead'] || game.data['ossogotrix dead']) {
            game.effects.print(36);
          } else {
            game.monsters.get(27).reaction = Monster.RX_FRIEND;
            game.monsters.get(28).reaction = Monster.RX_FRIEND;
            game.effects.print(38);
            game.data['befriended dragons'] = true;
            let s = game.player.gender === 'm' ? ", wise and gallant warrior," : ", brave and beautiful warrior,";
            game.history.write('"' + game.player.name + s, "special");
            game.effects.print(22, "special");
          }
        }

      } else if (game.artifacts.get(31).isHere()) {
        // invictus
        game.artifacts.get(31).destroy();
        game.artifacts.get(32).moveToRoom();
        game.effects.print(50);

      } else {
        game.effects.print(56);
      }

    }

  },

  // 'power' event handler takes a 1d100 dice roll as an argument.
  // this event handler only runs if the spell was successful.
  "power": function(roll) {
    let game = Game.getInstance();

    // another chance to use invictus
    if (game.data['ready invictus'] === 1) {
      game.effects.print(44);
      game.artifacts.get(32).moveToRoom();
      game.data['ready invictus'] = 2;
    } else {

      if (roll <= 50) {
        game.history.write("You hear a loud sonic boom which echoes all around you!");
      } else {
        game.history.write("Some of your wounds seem to clear up.");
        let heal_amount = game.diceRoll(2, 6);
        game.player.heal(heal_amount);
      }
    }
  },

}; // end event handlers


// declare any functions used by event handlers and custom commands
function sex_change() {
  let game = Game.getInstance();
  game.player.gender = game.player.gender === 'm' ? 'f' : 'm';
  game.history.write(game.player.name + " is transformed into a " +
    (game.player.gender === 'm' ? 'male' : 'female') + "!", "special");
}
