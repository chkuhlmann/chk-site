# Spotify discography prototype

The gallery has been promoted to the production `/credits/` template.
`npm run preview:credits` now serves that same finished static gallery at
http://127.0.0.1:8091/credits-preview/ without browser API calls or review controls.

The original experiment's source snapshot and matching fixtures are retained
here as reference material. They are not the production data source.
Production reads `config/credits-source.json` and the published Google Sheet
through `npm run sync:credits`; see the main README for publishing setup.

`npm run build:live` refreshes the Sheet and Spotify data before a local build.
Normal local and pull-request builds use `src/_data/releases.json`. The live
Pages workflow refreshes automatically on every push to main.
