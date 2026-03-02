import os, glob

api_dir = os.path.join('src', 'app', 'api')
routes = glob.glob(os.path.join(api_dir, '**', 'route.ts'), recursive=True)
patched = 0
skipped = 0

for r in routes:
    with open(r, 'r', encoding='utf-8') as f:
        content = f.read()
    if 'export const dynamic' not in content:
        with open(r, 'w', encoding='utf-8') as f:
            f.write("export const dynamic = 'force-dynamic';\n" + content)
        print(f'Patched: {r}')
        patched += 1
    else:
        skipped += 1

print(f'\nDone. Patched: {patched}, Already had dynamic: {skipped}')
