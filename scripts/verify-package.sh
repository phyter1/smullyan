#!/usr/bin/env bash
#
# Verify that the published artefact resolves correctly.
#
# NOTE: tsdown's in-build `publint` and `attw` options ALREADY run against a
# real packed tarball - tsdown shells out to the detected package manager
# (`pnpm pack --pack-destination <tmp> --config.ignore-scripts=true`) and feeds
# the bytes to publint/attw. So `files` IS validated during `pnpm build`.
#
# This script exists for two reasons the in-build check does not cover:
#   1. tsdown wraps its pack+check step in a try/catch and only LOGS failures;
#      this script fails hard on a non-zero exit code, with nothing swallowed.
#   2. It pins the exact seven entry points, so a subpath silently dropped from
#      the exports map is caught rather than merely not-checked.
#
# `attw --pack .` only supports npm, so we pack with pnpm and pass the tarball.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

OUT_DIR="$(mktemp -d)"
trap 'rm -rf "$OUT_DIR"' EXIT

echo "==> packing"
pnpm pack --pack-destination "$OUT_DIR" >/dev/null
# -maxdepth is a global option and must precede the -name primary. Putting it
# after makes GNU find warn and macOS/BSD find treat ordering positionally.
TARBALL="$(find "$OUT_DIR" -maxdepth 1 -name '*.tgz' -print -quit)"

if [ -z "$TARBALL" ]; then
  echo "error: pnpm pack produced no tarball" >&2
  exit 1
fi

echo "==> publint"
pnpm exec publint --strict "$TARBALL"

# Resolution modes checked by attw: node10, node16-cjs, node16-esm, bundler.
# The 'node16' profile ignores node10 only (node10 cannot see subpath exports)
# and still requires node16-cjs, node16-esm and bundler to pass.
echo "==> attw (node16 + bundler resolution, all seven entry points)"
pnpm exec attw "$TARBALL" \
  --profile node16 \
  --format table-flipped \
  --entrypoints . ./birds ./agent ./option ./result ./task ./reader ./pipe

echo "==> package verification passed"
