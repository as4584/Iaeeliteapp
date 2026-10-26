"""Capture QA screenshots of the web build at iPhone viewports.

Usage: python scripts/screens.py [base_url] [out_dir] [devices]
  devices: comma list of se,15,max (default: all)
Web rendering approximates iOS layout/typography; native-only behavior (Mail
composer, haptics, NativeTabs chrome) must be verified on device — see docs/QA.md.
"""
import sys
import time
import urllib.request

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8099"
OUT = sys.argv[2] if len(sys.argv) > 2 else "docs/qa/screens"
DEVICES = {
    "se": {"width": 375, "height": 667},   # iPhone SE (smallest supported)
    "15": {"width": 393, "height": 852},   # iPhone 15/16
    "max": {"width": 430, "height": 932},  # Pro Max
}
pick = sys.argv[3].split(",") if len(sys.argv) > 3 else list(DEVICES)


def wait_for_server(timeout=180):
    end = time.time() + timeout
    while time.time() < end:
        try:
            urllib.request.urlopen(BASE, timeout=5)
            return
        except Exception:
            time.sleep(2)
    raise SystemExit(f"Server not reachable at {BASE}")


def shot(page, name, dev, full=False):
    page.wait_for_timeout(1400)
    page.screenshot(path=f"{OUT}/{dev}-{name}.png", full_page=full)
    print("saved", f"{dev}-{name}.png")


def tid(page, test_id):
    return page.locator(f'[data-testid="{test_id}"]').first


def run():
    import os
    os.makedirs(OUT, exist_ok=True)
    wait_for_server()
    errors = []
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for dev in pick:
            ctx = browser.new_context(viewport=DEVICES[dev], device_scale_factor=2, is_mobile=True, has_touch=True,
                                      reduced_motion="reduce")
            page = ctx.new_page()
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: m.type == "error" and errors.append(m.text))

            page.goto(BASE + "/", wait_until="networkidle", timeout=180000)
            shot(page, "01-home", dev)
            if dev == "15":
                shot(page, "01-home-full", dev, full=True)
            page.goto(BASE + "/services", wait_until="networkidle")
            shot(page, "02-services", dev)
            page.goto(BASE + "/services?c=spaces", wait_until="networkidle")
            shot(page, "02b-spaces", dev)
            page.goto(BASE + "/service/artist-transport", wait_until="networkidle")
            shot(page, "03-detail", dev)
            page.goto(BASE + "/service/secure-detail", wait_until="networkidle")
            shot(page, "03b-detail-secure", dev)

            page.goto(BASE + "/request", wait_until="networkidle")
            shot(page, "04-request-empty", dev)
            tid(page, "continue").click()
            shot(page, "04b-request-error", dev)
            tid(page, "select-full-engagement").click()
            shot(page, "04c-request-selected", dev)
            tid(page, "continue").click()
            page.get_by_role("textbox", name="City", exact=True).fill("New York")
            page.get_by_role("textbox", name="Event date", exact=True).fill("March 14")
            shot(page, "05-request-when", dev)
            tid(page, "continue").click()
            page.get_by_role("textbox", name="Name", exact=True).fill("Jordan Reyes")
            page.get_by_role("textbox", name="Email", exact=True).fill("jordan@example.com")
            page.get_by_role("textbox", name="Best number", exact=True).fill("(201) 555-0142")
            shot(page, "05b-request-who", dev)
            tid(page, "continue").click()
            shot(page, "06-request-review", dev)

            page.goto(BASE + "/request-result?status=sent", wait_until="networkidle")
            shot(page, "07-result-sent", dev)
            page.goto(BASE + "/request-result?status=cancelled", wait_until="networkidle")
            shot(page, "07b-result-cancelled", dev)
            page.goto(BASE + "/connect", wait_until="networkidle")
            shot(page, "08-connect", dev)
            page.goto(BASE + "/service/does-not-exist", wait_until="networkidle")
            shot(page, "09-detail-missing", dev)
            ctx.close()
        browser.close()
    uniq = sorted(set(errors))
    print(f"console/page errors: {len(uniq)}")
    for e in uniq[:20]:
        print("  ERR", e[:300])


if __name__ == "__main__":
    run()
