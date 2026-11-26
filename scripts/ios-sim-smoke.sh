#!/usr/bin/env bash
# Launch test on a real iOS simulator (macOS only, used by .github/workflows/ios-sim.yml).
# Builds the Release configuration (same JS bundle + native code TestFlight gets), installs it,
# launches it, and fails if the process is gone after 30s. Then drives every tab with Maestro.
# Crash reports, device log and screenshots land in ./sim-out for upload.
set -uo pipefail
BUNDLE_ID=com.innovationartistescort.iaeelite
OUT="$PWD/sim-out"; mkdir -p "$OUT"

UDID=$(xcrun simctl list devices available -j | python3 -c '
import json,sys
d=json.load(sys.stdin)["devices"]
c=[x for k,v in d.items() if "iOS" in k for x in v if x["name"].startswith("iPhone")]
pro=[x for x in c if "Pro" in x["name"] and "Max" not in x["name"]]
print((pro or c)[-1]["udid"])')
echo "simulator: $UDID"
xcrun simctl boot "$UDID" 2>/dev/null; xcrun simctl bootstatus "$UDID" -b

APP=$(find build/Build/Products/Release-iphonesimulator -maxdepth 1 -name '*.app' | head -1)
[ -n "$APP" ] || { echo "FAIL: no .app built"; exit 1; }
EXE=$(/usr/libexec/PlistBuddy -c 'Print CFBundleExecutable' "$APP/Info.plist")
xcrun simctl install "$UDID" "$APP"

xcrun simctl spawn "$UDID" log stream --style compact --predicate "process == \"$EXE\"" > "$OUT/device.log" 2>&1 &
LOGPID=$!
xcrun simctl launch "$UDID" "$BUNDLE_ID"
for t in 5 15 30; do
  sleep $(( t == 5 ? 5 : t == 15 ? 10 : 15 ))
  xcrun simctl io "$UDID" screenshot "$OUT/launch-${t}s.png" >/dev/null 2>&1
done
ALIVE=0
xcrun simctl spawn "$UDID" launchctl list | grep -q "$BUNDLE_ID" && ALIVE=1
kill $LOGPID 2>/dev/null
cp ~/Library/Logs/DiagnosticReports/${EXE}* "$OUT/" 2>/dev/null
grep -iE "fatal|exception|crash|error" "$OUT/device.log" | head -80 > "$OUT/device-errors.txt"

if [ "$ALIVE" != 1 ]; then
  echo "FAIL: app is not running 30s after launch"
  echo "--- crash reports ---"; ls "$OUT"/${EXE}* 2>/dev/null && head -c 6000 "$OUT"/${EXE}* 
  echo "--- device log errors ---"; cat "$OUT/device-errors.txt"
  exit 1
fi
echo "PASS: app alive 30s after launch"

# Tab walk: every screen must render and the app must survive it.
export PATH="$PATH:$HOME/.maestro/bin"
if command -v maestro >/dev/null; then
  maestro --device "$UDID" test e2e/tabs.yaml --test-output-dir "$OUT/maestro" || { echo "FAIL: tab walk"; cp ~/Library/Logs/DiagnosticReports/${EXE}* "$OUT/" 2>/dev/null; exit 1; }
  echo "PASS: tab walk"
fi
