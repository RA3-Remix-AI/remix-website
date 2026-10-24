"""Import a curated, read-only content snapshot from a locally decoded Remix 037.

Usage: python scripts/import-remix037.py --analysis <decoded-directory>
       --base-manifest <base-static.manifest> --base-bin <decompressed-static.bin>
Requires Pillow. Does not modify the game or source archive.
"""
import argparse
import io
import json
import struct
from pathlib import Path
from PIL import Image

parser = argparse.ArgumentParser()
parser.add_argument('--analysis', type=Path, required=True)
parser.add_argument('--base-manifest', type=Path, required=True)
parser.add_argument('--base-bin', type=Path, required=True)
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
base = args.analysis
read = lambda path: json.loads(path.read_text(encoding='utf-8-sig'))
decoded = read(base / 'decoded-token-assets.json')
strings = read(base / 'mod-strings.json')
assets = read(base / 'assets.json')
byname = {a['name']: a for a in assets}
bykey = {(a['type_id'], a['instance_id']): a for a in assets}
manifest = args.base_manifest.read_bytes()
header = struct.unpack_from('<12I', manifest)
refbase = 48 + header[3] * 48
namebase = refbase + header[8] + header[9]
sourcebase = namebase + header[10]
binary_offset = 4
for index in range(header[3]):
    row = struct.unpack_from('<12I', manifest, 48 + index * 48)
    def string_at(start):
        return manifest[start:manifest.index(0, start)].decode('utf-8', errors='replace')
    asset = {'type_id': row[0], 'instance_id': row[1],
             'refs': [struct.unpack_from('<II', manifest, refbase + row[4] + j * 8) for j in range(row[5])],
             'name': string_at(namebase + row[6]), 'source': string_at(sourcebase + row[7]),
             'binary_offset': binary_offset, 'binary_size': row[8], 'base': True}
    byname.setdefault(asset['name'], asset)
    bykey.setdefault((row[0], row[1]), asset)
    binary_offset += row[8]
curated = read(root / 'docs/materials/remix037-curation.json')
output = root / 'public/materials/remix037'
output.mkdir(parents=True, exist_ok=True)
result = []
with (base / 'Extracted/data/mod.bin').open('rb') as stream, args.base_bin.open('rb') as base_stream:
    def blob(asset):
        selected = base_stream if asset.get('base') else stream
        selected.seek(asset['binary_offset'])
        return selected.read(asset['binary_size'])

    for entry in curated:
        object_id = 'GameObject:' + entry['id']
        unit = decoded[object_id]
        portrait = byname[unit['SelectPortrait']]
        fields = struct.unpack('<9I', blob(portrait))
        texture = bykey[tuple(portrait['refs'][fields[1] - 1])]
        raw = blob(texture)
        offset = raw.find(b'DDS ')
        assert offset >= 0, texture['name']
        atlas = Image.open(io.BytesIO(raw[offset:])).convert('RGB')
        _, _, width, height, x, y, tw, th, rotated = fields
        assert (atlas.width, atlas.height) == (tw, th) and not rotated
        atlas.crop((x, y, x + width, y + height)).save(output / (entry['id'] + '.png'))
        text = lambda field: strings.get(str(unit.get(field, '')).lower(), '')
        costs = (unit.get('ObjectResourceInfo') or {}).get('BuildCost', [])
        side = unit['Side'].split(':')[-1]
        result.append({
            **entry,
            'name': text('DisplayName'),
            'faction': {'Allies': '盟军', 'Soviet': '苏联', 'Japan': '升阳'}[side],
            'role': text('TypeDescription'),
            'price': next((c['Amount'] for c in costs if c['Account'] == 0), None),
            'time': unit['BuildTime'],
            'hp': unit['Body']['MaxHealth'],
            'image': '/materials/remix037/' + entry['id'] + '.png',
            'source': {'object': object_id, 'portrait': portrait['name'],
                       'texture': texture['name'], 'assetSource': texture['source']},
        })
snapshot = {'version': 'Remix 0.3.7', 'retrievedAt': '2026-10-24',
            'evidence': 'Local decoded game objects, Chinese strings and native portrait assets.',
            'scope': 'Curated object reference; not a complete playable roster or proof of production access.',
            'units': result}
(root / 'src/content/remix037.json').write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(result)} unit objects and matching original portraits.')
