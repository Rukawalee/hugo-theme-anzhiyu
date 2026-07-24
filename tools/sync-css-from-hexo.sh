#!/usr/bin/env bash
# Sync gold CSS from a built Hexo reference site (100% style baseline).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HEXO_CSS="${1:-$ROOT/../hexo-example/public/css/index.css}"
OUT="$ROOT/assets/css/main.css"
if [[ ! -f "$HEXO_CSS" ]]; then
  echo "missing Hexo CSS: $HEXO_CSS (run hexo generate first)" >&2
  exit 1
fi
cp -f "$HEXO_CSS" "$OUT"
echo "synced $(wc -c < "$OUT") bytes from $HEXO_CSS -> $OUT"
