"""Refresh the Eleventy credits snapshot from the studio's published Sheet."""
import csv
import io
import json
import sys
import tempfile
from pathlib import Path
from urllib.parse import urlsplit
from urllib.request import urlopen

SHEET = (
    "https://docs.google.com/spreadsheets/d/e/"
    "2PACX-1vTqcYP2KT4bTN_04WapAapr7aMpEfrLjv4YIMqyBNIYDcjzlwDbKlDnUxg9SlGmqMsLF3UqmGYj8zR6"
    "/pub?output=csv"
)
SNAPSHOT = Path(__file__).resolve().parents[1] / "src/_data/credits.json"


def read_credits(source):
    reader = csv.DictReader(source, strict=True)
    required = {"Artist", "Track", "Service", "Artist Page Link"}
    if not required.issubset(reader.fieldnames or []):
        raise ValueError("Expected the published credits sheet headers")

    artists = {}
    for row in reversed(list(reader)):
        if not any(row.values()):
            continue
        name = (row["Artist"] or "").strip()
        track = (row["Track"] or "").strip()
        if not name or not track:
            raise ValueError("A credit is missing its artist or track")
        if name not in artists:
            link = (row["Artist Page Link"] or "").strip()
            url = urlsplit(link)
            artists[name] = {
                "name": name,
                "url": link if url.scheme in {"http", "https"} and url.hostname else "",
                "tracks": [],
            }
        artists[name]["tracks"].append({"title": track, "role": (row["Service"] or "").strip()})

    if not artists:
        raise ValueError("The credits sheet has no tracks")
    return list(artists.values())


if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8-sig", newline="") as source:
            credits = read_credits(source)
    else:
        with urlopen(SHEET, timeout=20) as response:
            credits = read_credits(io.TextIOWrapper(response, encoding="utf-8-sig", newline=""))

    with tempfile.NamedTemporaryFile(mode="w", encoding="utf-8", dir=SNAPSHOT.parent, delete=False) as out:
        json.dump(credits, out, ensure_ascii=False, indent=2)
        out.write("\n")
    Path(out.name).replace(SNAPSHOT)
    print(f"Synced {sum(len(artist['tracks']) for artist in credits)} tracks by {len(credits)} artists.")
