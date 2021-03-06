import json, os, os.path, regex
from django.core.management.base import BaseCommand
from adventure.models import Adventure, Room, RoomExit, Artifact, ArtifactMarking, Effect, Monster


class Command(BaseCommand):
    help = '''
    Imports data from Classic Eamon adventures. Requires the data files to be parsed by a separate program
    into four separate files: rooms.json, artifacts.json, effects.json, and monsters.json.
    '''

    def add_arguments(self, parser):
        parser.add_argument('folder', nargs=1, type=str,
                            help='The folder in your filesystem where the files are located')
        parser.add_argument('adventure_id', nargs=1, type=int,
                            help='The ID of the adventure')
        parser.add_argument('-c', '--change-case', action='store_const', const=True,
                            help='Provide this option to automatically change the names and descriptions'
                                 ' into sentence case.')

    def handle(self, folder, adventure_id, *args, **options):

        folder = folder[0]

        adventure = Adventure.objects.get_or_create(pk=adventure_id[0])[0]

        if adventure.name == '':
            print("Creating new adventure.")
            adventure.name = input("What is the adventure name?")
            adventure.slug = adventure.name.lower().replace(' ', '-')
            adventure.active = 1
            adventure.save()

        print("Importing data for adventure #{}: {}".format(adventure.id, adventure.name))

        # Rooms
        with open(folder + '/rooms.json', 'r') as datafile:
            data = datafile.read()
            rooms = json.loads(data)

            connections = ['n', 's', 'e', 'w', 'u', 'd', 'ne', 'se', 'sw', 'nw']
            required = ['id', 'name', 'description']
            for r in rooms:
                # print(r)
                if not validate('Room', required, r):
                    continue
                print('room #{}: {}'.format(r['id'], r['name']))
                room = Room.objects.get_or_create(adventure=adventure, room_id=r['id'])[0]
                room.name = r['name']
                room.description = regex.sub(r'\s{2,}', " ", r['description'])
                if options['change_case']:
                    room.description = sentence_case(room.description)
                room.is_dark = 0
                if "light" in r and not r['light']:
                    room.is_dark = 1
                room.save()
                for direction in connections:
                    if direction in r and int(r[direction]) != 0:
                        e = room.exits.get_or_create(direction=direction)[0]
                        e.room_to = int(r[direction])
                        if e.room_to == -99:
                            e.room_to = -999    # new style main hall exit
                        if e.room_to > 500:
                            e.door_id = e.room_to - 500
                            e.room_to = 0  # we get this from the door artifact later - see below
                        e.save()

        # Artifacts
        with open(folder + '/artifacts.json', 'r') as datafile:
            data = datafile.read()
            artifacts = json.loads(data)
            required = ['id', 'name', 'description', 'value', 'type', 'weight', 'room_id']
            for ar in artifacts:
                # print(ar)
                if not validate('Artifact', required, ar):
                    continue
                name = sentence_case(ar['name']) if options['change_case'] else ar['name']
                print('artifact #{ar[id]}: {name}'.format(ar=ar, name=name))
                desc = regex.sub(r'\s{2,}', " ", ar['description'])
                if options['change_case']:
                    desc = sentence_case(desc)
                a = Artifact.objects.get_or_create(adventure=adventure, artifact_id=ar['id'])[0]
                a.name = name
                a.description = desc
                a.value = int(ar['value'])
                a.type = int(ar['type'])
                a.weight = int(ar['weight'])
                a.room_id = int(ar['room_id'])
                a.is_open = 0
                if a.room_id > 500:
                    a.container_id = a.room_id - 500
                    a.room_id = None
                if a.room_id is not None:
                    if a.room_id > 200:
                        a.room_id -= 200
                        a.embedded = 1
                    if a.room_id < 0:
                        a.monster_id = abs(a.room_id) - 1
                        a.room_id = None
                # The custom fields are below here. Weapon stats (types 2 and 3) are present in all MAIN PGM versions,
                # while the custom fields for other types are only used in MAIN PGM v6 and above.
                field5 = int(ar['field5']) if 'field5' in ar else None
                field6 = int(ar['field6']) if 'field6' in ar else None
                field7 = int(ar['field7']) if 'field7' in ar else None
                field8 = int(ar['field8']) if 'field8' in ar else None
                if a.type == 2 or a.type == 3:
                    # weapons
                    a.weapon_odds = field5
                    a.weapon_type = field6
                    a.dice = field7
                    a.sides = field8
                elif a.type == 4:
                    # container - format 2 in EDX manual
                    a.key_id = field5
                    a.is_open = field6 or 0
                elif a.type == 5:
                    # light source - format 3
                    a.quantity = field5
                elif a.type == 6 or a.type == 9:
                    # drinkable/edible - format 4
                    a.dice = field5
                    a.sides = 1
                    a.quantity = field6
                    a.is_open = field7 or 0
                elif a.type == 7:
                    # readable - format 5
                    a.effect_id = field5
                    a.num_effects = field6
                    a.is_open = field7 or 0
                elif a.type == 8:
                    # door/gate - format 6
                    # "next room" (field5) is handled below
                    a.key_id = field6
                    a.is_open = 1 - (field7 or 0)
                elif a.type == 10:
                    # bound monster - format 7
                    a.monster_id = field5
                    a.key_id = field6
                    a.guard_id = field7
                elif a.type == 11:
                    # wearable - format 8
                    a.armor_class = field5
                    # Note about armor type: most of the shields found in Classic Eamon adventures weren't actually
                    # usable, so this field is mostly irrelevant. Most armor artifacts found in adventures will be
                    # armor_type zero. If you want to create a usable shield, edit it in the DB after import.
                    a.armor_type = field6
                    # TODO: set armor penalty - this isn't in the original DB; need to calculate it based on AC
                elif a.type == 12:
                    # disguised monster - format 9
                    a.monster_id = field5
                    a.effect_id = field6
                    a.num_effects = field7

                # if value is zero and room is zero, it's probably a dead body. use dead body artifact type.
                if a.value == 0 and a.room_id == 0:
                    a.type = 13
                a.save()

                # handling of "room beyond door"
                if a.type == 8 and 'field5' in ar and ar['field5']:
                    room_beyond = RoomExit.objects.filter(room_from__adventure_id=adventure.id, door_id=a.artifact_id)
                    print("Door logic: Trying to update exit on adventure {} door #{} to {}"
                          .format(adventure.name, a.artifact_id, ar['field5']))
                    if len(room_beyond):
                        # update the room_to field on the RoomExit object
                        print("Updating room_exit #" + str(room_beyond[0].id))
                        room_beyond[0].room_to = field5
                        room_beyond[0].save()

        # effects
        if os.path.isfile(folder + '/effects.json'):
            with open(folder + '/effects.json', 'r') as datafile:
                effects = json.loads(datafile.read())
                required = ['id', 'text']
                for ef in effects:
                    if not validate('Effect', required, ef):
                        continue
                    id = int(ef['id'])
                    text = regex.sub(r'\s{2,}', " ", ef['text'])
                    if options['change_case']:
                        text = sentence_case(text)
                    print('effect #{}: {}'.format(id, text))
                    e = Effect.objects.get_or_create(adventure=adventure, effect_id=id)[0]
                    e.text = text
                    e.save()
        else:
            print("No effects file found. Skipping.")

        # monsters
        with open(folder + '/monsters.json', 'r') as datafile:
            monsters = json.loads(datafile.read())
            required = ['id', 'name', 'description', 'hardiness', 'agility', 'friendliness', 'courage', 'room_id']
            for m in monsters:
                # print(m)
                if not validate("Monster", required, m):
                    continue
                id = int(m['id'])
                name = sentence_case(m['name']) if options['change_case'] else m['name']
                print('monster #{}: {}'.format(id, name))
                desc = regex.sub(r'\s{2,}', " ", m['description'])
                if options['change_case']:
                    desc = sentence_case(desc)
                mn = Monster.objects.get_or_create(adventure=adventure, monster_id=id)[0]
                mn.name = name
                mn.description = desc
                mn.hardiness = int(m['hardiness'])
                mn.agility = int(m['agility'])
                mn.friend_odds = int(m['friendliness'])
                if mn.friend_odds == 0:
                    mn.friendliness = 'hostile'
                elif mn.friend_odds >= 100:
                    mn.friendliness = 'friend'
                else:
                    mn.friendliness = 'random'
                mn.courage = int(m['courage'])
                mn.room_id = int(m['room_id'])
                if mn.room_id == 0:
                    mn.room_id = None
                # TODO: distinguish between v4-6 and v7 adventures, to know whether the fields represent
                # defense_odds and attack_odds, or whether they represent group size
                mn.defense_bonus = int(m['defense_odds']) if 'defense_odds' in m else 0
                mn.armor_class = int(m['armor_class']) if 'armor_class' in m else 0
                mn.weapon_id = 0
                if 'weapon_id' in m:
                    mn.weapon_id = m['weapon_id']
                    if mn.weapon_id > 0:
                        # move the weapon artifact into the monster's inventory, instead of room zero
                        wpn = Artifact.objects.get(adventure_id=adventure.id, artifact_id=mn.weapon_id)
                        if wpn:
                            wpn.room_id = None
                            wpn.monster_id = mn.monster_id
                            wpn.save()
                mn.attack_odds = int(m['offense_odds']) if 'offense_odds' in m else 50
                mn.weapon_dice = int(m['weapon_dice']) if 'weapon_dice' in m else 0
                mn.weapon_sides = int(m['weapon_sides']) if 'weapon_sides' in m else 0
                mn.save()


def sentence_case(string):
    """
    Converts a string to sentence case.
    From http://stackoverflow.com/questions/39969202/convert-uppercase-string-to-sentence-case-in-python
    Args:
        string: The input string

    Returns:
        The string, now in sentence case
    """
    return '. '.join(i.capitalize() for i in string.split('. '))


def validate(obj_type: str, required: list, obj: dict):
    for fld in required:
        if fld not in obj:
            print("{} '{}' does not have a value for the field '{}'. Import failed!"
                  .format(obj_type, obj['name'] if 'name' in obj else obj['text'][:25] if 'text' in obj else "???", fld))
            return False
    return True
