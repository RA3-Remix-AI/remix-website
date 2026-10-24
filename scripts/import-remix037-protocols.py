"""Read the three native 037 protocol panels and their original icons.

Inputs are local decoded analysis, the base manifest and decompressed base bin.
All game files are read-only; source identifiers are kept in the JSON snapshot.
"""
import argparse
import io
import json
import re
import struct
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--analysis', type=Path, required=True)
parser.add_argument('--base-manifest', type=Path, required=True)
parser.add_argument('--base-bin', type=Path, required=True)
parser.add_argument('--global-stream', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
read_json = lambda p: json.loads(p.read_text(encoding='utf-8-sig'))
assets = read_json(args.analysis / 'assets.json')
strings = read_json(args.analysis / 'mod-strings.json')
decoded = read_json(args.analysis / 'decoded-token-assets.json')
manifest = args.base_manifest.read_bytes()
header = struct.unpack_from('<12I', manifest)
refbase = 48 + header[3] * 48
namebase = refbase + header[8] + header[9]
sourcebase = namebase + header[10]
base_assets = []
binary_offset = 4
for index in range(header[3]):
    row = struct.unpack_from('<12I', manifest, 48 + index * 48)
    def string_at(start):
        return manifest[start:manifest.index(0, start)].decode('utf-8', errors='replace')
    base_assets.append({'type_id': row[0], 'instance_id': row[1],
                        'refs': [struct.unpack_from('<II', manifest, refbase + row[4] + j * 8) for j in range(row[5])],
                        'name': string_at(namebase + row[6]), 'source': string_at(sourcebase + row[7]),
                        'binary_offset': binary_offset, 'binary_size': row[8], 'base': True})
    binary_offset += row[8]
def unpack(data):
    if len(data) < 5 or data[1] != 0xfb or (data[0] & 0x7e) != 0x10:
        return data
    width = 4 if data[0] & 0x80 else 3
    expected = int.from_bytes(data[2:2 + width], 'big')
    pos = 2 + width * (2 if data[0] & 1 else 1)
    output = bytearray()
    while pos < len(data):
        code = data[pos]; pos += 1
        length = distance = 0
        if code < 0x80:
            d = data[pos]; pos += 1
            literal = code & 3; length = ((code >> 2) & 7) + 3; distance = ((code & 0x60) << 3) + d + 1
        elif code < 0xc0:
            d, e = data[pos:pos + 2]; pos += 2
            literal = d >> 6; length = (code & 0x3f) + 4; distance = ((d & 0x3f) << 8) + e + 1
        elif code < 0xe0:
            d, e, f = data[pos:pos + 3]; pos += 3
            literal = code & 3; length = ((code & 12) << 6) + f + 5; distance = ((code & 16) << 12) + (d << 8) + e + 1
        else:
            literal = ((code & 31) << 2) + 4 if code < 0xfc else code & 3
        output.extend(data[pos:pos + literal]); pos += literal
        if length:
            start = len(output) - distance
            output.extend((output[start:] * ((length + distance - 1) // distance))[:length])
        if code >= 0xfc:
            break
    assert len(output) == expected
    return bytes(output)

with args.global_stream.open('rb') as stream:
    magic, _, count, _ = struct.unpack('>4s3I', stream.read(16))
    assert magic == b'BIG4'
    entries = {}
    for _ in range(count):
        offset, size = struct.unpack('>2I', stream.read(8))
        name = bytearray()
        while (char := stream.read(1)) != b'\0':
            name.extend(char)
        entries[name.decode('ascii').lower()] = (offset, size)
    def big_entry(name):
        offset, size = entries[name]
        stream.seek(offset)
        return unpack(stream.read(size))
    manifest = big_entry('data\\global.manifest')
    global_bin = big_entry('data\\global.bin')
header = struct.unpack_from('<12I', manifest)
refbase = 48 + header[3] * 48
namebase = refbase + header[8] + header[9]
sourcebase = namebase + header[10]
global_assets = []
binary_offset = 4
for index in range(header[3]):
    row = struct.unpack_from('<12I', manifest, 48 + index * 48)
    global_assets.append({'type_id': row[0], 'instance_id': row[1],
                          'refs': [struct.unpack_from('<II', manifest, refbase + row[4] + j * 8) for j in range(row[5])],
                          'name': string_at(namebase + row[6]), 'source': string_at(sourcebase + row[7]),
                          'binary_offset': binary_offset, 'binary_size': row[8], 'global': True})
    binary_offset += row[8]
byname = {a['name']: a for a in base_assets + global_assets + assets}
bykey = {(a['type_id'], a['instance_id']): a for a in base_assets + global_assets + assets}
native = (args.analysis / 'Extracted/data/mod.bin').open('rb')
base_stream = args.base_bin.open('rb')
def blob(asset):
    if asset.get('global'):
        start = asset['binary_offset']
        return global_bin[start:start + asset['binary_size']]
    stream = base_stream if asset.get('base') else native
    stream.seek(asset['binary_offset'])
    return stream.read(asset['binary_size'])
def uint(data, offset):
    return struct.unpack_from('<I', data, offset)[0]
def ref(asset, index):
    return bykey.get(tuple(asset['refs'][index - 1])) if index else None
def refs(asset):
    return [bykey[tuple(key)]['name'] for key in asset['refs'] if tuple(key) in bykey]
def state_data(asset):
    data = blob(asset)
    result = {}
    for key, offset in [('name', 8), ('description', 16), ('kind', 24)]:
        length, pointer = struct.unpack_from('<II', data, offset)
        token = data[pointer:pointer + length].decode('utf-8')
        result[key] = strings.get(token.lower(), token)
    result['imageAsset'] = ref(asset, uint(data, 4))['name']
    return result

output = root / 'public/materials/remix037/protocols'
output.mkdir(parents=True, exist_ok=True)
protocols = []
for faction, suffix in [('盟军', 'Allied'), ('苏联', 'Soviet'), ('升阳', 'Japan')]:
    panel = byname['PlayerTechStoreTemplate:PlayerTechStore_' + suffix]
    data = blob(panel)
    row_count, row_pointer = struct.unpack_from('<II', data, 8)
    assert row_count == 5
    for row in range(row_count):
        col_count, col_pointer = struct.unpack_from('<II', data, row_pointer + row * 8)
        assert col_count == 3
        for col in range(col_count):
            purchase = ref(panel, uint(data, col_pointer + col * 4))
            purchase_data = blob(purchase)
            tech = ref(purchase, uint(purchase_data, 4))
            state = ref(purchase, uint(purchase_data, 8))
            info = state_data(state)
            tech_data = blob(tech)
            count, pointer = struct.unpack_from('<II', tech_data, 8)
            dependencies = [ref(tech, uint(tech_data, pointer + i * 4))['name'] for i in range(count)]
            ranks = [int(m[1]) for dep in dependencies if (m := re.search(r'Generic_Rank_(\d+)$', dep))]
            powers = []
            for button in assets:
                if not button['name'].startswith('PlayerPowerButtonTemplate:'):
                    continue
                button_data = blob(button)
                power = ref(button, uint(button_data, 4))
                if not power or not power['name'].startswith('SpecialPowerTemplate:') or tech['name'] not in refs(power):
                    continue
                power_data = blob(power)
                command_state = ref(button, uint(button_data, uint(button_data, 8) + 4))
                command_info = state_data(command_state)
                # Native SDK SpecialPowerTemplate: TargetType at 20, ReloadTime at 32.
                powers.append({'id': power['name'], 'cooldown': struct.unpack_from('<f', power_data, 32)[0],
                               'target': ['地点', '地点与方向', '选取对象', '对象或地点', '无需选点'][uint(power_data, 20)],
                               'button': button['name'], 'description': command_info['description'],
                               'state': command_state['name']})
            image = byname[info['imageAsset']]
            fields = struct.unpack('<9I', blob(image))
            texture = ref(image, fields[1])
            raw = blob(texture)
            dds_offset = raw.find(b'DDS ')
            assert dds_offset >= 0
            atlas = Image.open(io.BytesIO(raw[dds_offset:])).convert('RGBA')
            _, _, w, h, x, y, tw, th, rotated = fields
            assert (atlas.width, atlas.height) == (tw, th) and not rotated
            ident = tech['name'].split(':')[1].removeprefix('PlayerTech_')
            atlas.crop((x, y, x + w, y + h)).save(output / (ident + '.png'))
            protocols.append({'id': ident, 'faction': faction, 'row': row + 1, 'column': col + 1,
                              'points': uint(tech_data, 4), 'rank': max(ranks) if ranks else None,
                              'dependencies': dependencies, **info, 'powers': powers,
                              'image': '/materials/remix037/protocols/' + ident + '.png',
                              'verifiedFields': [
                                  {'object': 'GameObject:PlayerSpellBook', 'module': module['$type'],
                                   'field': 'BuildCostBonus', 'value': module['BuildCostBonus']}
                                  for module in decoded['GameObject:PlayerSpellBook']['Behaviors']
                                  if 'BuildCostBonus' in module and any(power['id'] == module.get('SpecialPowerTemplate') for power in powers)
                              ],
                              'source': {'panel': panel['name'], 'purchase': purchase['name'],
                                         'tech': tech['name'], 'state': state['name'], 'path': tech['source']}})
snapshot = {'version': 'Remix 0.3.7', 'retrievedAt': '2026-10-24',
            'scope': 'All 45 buttons in the three native five-row, three-column protocol panels.',
            'protocols': protocols}
(root / 'src/content/protocols037.json').write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
native.close()
base_stream.close()
print(f'Imported {len(protocols)} protocol buttons, dependencies and original icons.')
