import subprocess, time, os

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
OUT = r"C:\Users\defre\Downloads\reels\reeledits\two\reel2hook3\screenshots"

urls = [
    ("ss1.png", "https://www.reddit.com/r/washu/comments/z5vwiz/any_recommendations_for_apartments/"),
    ("ss2.png", "https://www.reddit.com/r/washu/comments/1sq8awg/why_is_housing_so_difficult_here/"),
    ("ss3.png", "https://www.studlife.com/forum/2024/12/02/washus-rent-is-too-damn-high/"),
    ("ss4.png", "https://www.studlife.com/forum/2024/12/02/how-to-settle-your-housing-drama/"),
    ("ss5.png", "https://www.reddit.com/r/washu/comments/1ckaqm0/dbbs_phd_students_how_much_are_you_willing_to/"),
    ("ss6.png", "https://www.studlife.com/news/2026/04/02/new-requirements-for-sophomore-on-campus-housing-push-juniors-out/"),
    ("ss7.png", "https://www.reddit.com/r/washu/comments/cz7l5l/housing_after_sophomore_year/"),
    ("ss8.png", "https://www.reddit.com/r/washu/comments/ybvc5g/dont_rent_from_david_zhang/"),
    ("ss9.png", "https://www.reddit.com/r/washu/comments/ybvc5g/dont_rent_from_david_zhang/"),
    ("ss10.png", "https://www.reddit.com/r/washu/comments/ybvc5g/dont_rent_from_david_zhang/"),
]

for name, url in urls:
    out_path = os.path.join(OUT, name)
    print(f"Capturing {name}...")
    subprocess.run([
        CHROME,
        "--headless=new",
        "--disable-gpu",
        "--no-sandbox",
        "--disable-software-rasterizer",
        f"--window-size=800,1200",
        f"--screenshot={out_path}",
        "--hide-scrollbars",
        url
    ], timeout=30, capture_output=True)
    time.sleep(1)

print("Done!")
for f in sorted(os.listdir(OUT)):
    sz = os.path.getsize(os.path.join(OUT, f))
    print(f"  {f}: {sz} bytes")
