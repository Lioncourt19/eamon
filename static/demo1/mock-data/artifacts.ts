/**
 * JSON data that mocks what would come from the back-end API
 */
export var ARTIFACTS: Object[] = [
  {
    "id": 1,
    "name": "throne",
    "description": "You see the king's throne. It has a large sunburst on top.",
    "type": 1,
    "room_id": 3,
    "weight": 999,
    "value": 0,
    "embedded": true
  },
  {
    "id": 2,
    "name": "gold bars",
    "description": "You see a pile of gold bars. They look heavy but are probably worth a lot of money.",
    "type": 0,
    "room_id": 4,
    "weight": 50,
    "value": 1000
  },
  {
    "id": 3,
    "name": "magic sword",
    "description": "You see a shiny magic sword.",
    "type": 3,
    "container_id": 12,
    "weight": 3,
    "value": 500,
    "hands": 1,
    "weapon_type": 5,
    "weapon_odds": 20,
    "dice": 2,
    "sides": 8
  },
  {
    "id": 4,
    "name": "spear",
    "description": "You see a standard 10-foot-long spear.",
    "type": 2,
    "room_id": null,
    "monster_id": 1,
    "weight": 5,
    "value": 10,
    "hands": 1,
    "weapon_type": 4,
    "weapon_odds": 10,
    "dice": 1,
    "sides": 5
  },
  {
    "id": 5,
    "name": "gold key",
    "description": "You see a gold key sitting next to the throne.",
    "type": 1,
    "room_id": 3,
    "monster_id": null,
    "weight": 1,
    "value": 0
  },
  {
    "id": 6,
    "name": "healing potion",
    "description": "You see a bottle of healing potion.",
    "type": 6,
    "room_id": 3,
    "monster_id": null,
    "weight": 1,
    "value": 20,
    "quantity": 3,
    "dice": 1,
    "sides": 6
  },
  {
    "id": 7,
    "name": "bread",
    "description": "You see a loaf of bread.",
    "type": 9,
    "room_id": 1,
    "weight": 1,
    "value": 1,
    "quantity": 3
  },
  {
    "id": 8,
    "name": "sword",
    "description": "You see a good-quality sword.",
    "type": 2,
    "room_id": null,
    "monster_id": 3,
    "weight": 5,
    "value": 10,
    "hands": 1,
    "weapon_type": 5,
    "weapon_odds": 10,
    "dice": 1,
    "sides": 8
  },
  {
    "id": 9,
    "name": "torch",
    "description": "You see a torch.",
    "type": 5,
    "room_id": null,
    "monster_id": 0,
    "weight": 1,
    "value": 1,
    "quantity": 20
  },
  {
    "id": 10,
    "name": "red book",
    "description": "You see a red book.",
    "type": 1,
    "room_id": 6,
    "weight": 5,
    "value": 1,
    "markings": [
      "In the darkest depths of Mordor",
      "I met a girl so fair",
      "But Gollum and the Evil One",
      "Crept up and slipped away with her."
    ]
  },
  {
    "id": 11,
    "name": "black book",
    "description": "You see a black book with a skull on it.",
    "type": 1,
    "room_id": 6,
    "weight": 5,
    "value": 1,
    "quantity": 3
  },
  {
    "id": 12,
    "name": "chest",
    "description": "You see a big treasure chest. It's too heavy to carry.",
    "type": 4,
    "room_id": 4,
    "weight": 999,
    "value": 0
  },
  {
    "id": 13,
    "name": "jewels",
    "description": "You see a bag of jewels.",
    "type": 1,
    "room_id": null,
    "container_id": 12,
    "weight": 3,
    "value": 500
  },
  {
    "id": 14,
    "name": "magic wand",
    "description": "You see a magic wand. The tip glows blue with a mystical energy.",
    "type": 1,
    "room_id": null,
    "container_id": 12,
    "weight": 3,
    "value": 500
  },
  {
    "id": 15,
    "name": "Plate armor",
    "description": "You see a suit of well-worn plate armor.",
    "type": 11,
    "room_id": 7,
    "weight": 30,
    "value": 200,
    "armor_type": 0,
    "armor_class": 5,
    "armor_penalty": 60
  },
  {
    "id": 16,
    "name": "Halberd",
    "description": "You see a very large halberd. It looks dangerous but too big to wield comfortably.",
    "type": 2,
    "room_id": 7,
    "weight": 10,
    "value": 20,
    "hands": 2,
    "weapon_type": 4,
    "weapon_odds": -10,
    "dice": 2,
    "sides": 5
  },
  {
    "id": 17,
    "name": "Magic shield",
    "description": "You see a glowing shield with strange runes carved into it.",
    "type": 11,
    "room_id": 7,
    "weight": 2,
    "value": 200,
    "armor_type": 1,
    "armor_class": 2,
    "armor_penalty": 2
  }
];
