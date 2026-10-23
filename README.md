# CoC7 Universal Books Library v0.2.0

**640 native CoC7 book items in 16 compendiums:** original 240 books in 12 genre packs, plus 400 new books in four separately searchable compendium packs (100 each): Occult & Folklore – Additional; Mythos Tomes – Additional; Religion & Philosophy – Additional; Fiction – Additional.

## Installation
Extract the `coc7-universal-books` directory to Foundry User Data `Data/modules/` (replace the previous version). Enable the module, restart/reload the world, then as GM run:

```js
await game.modules.get("coc7-universal-books").api.install()
```

The importer updates matching existing names and adds new books in world compendium packs under `Compendium Item / Books`. It does not populate World Items. Re-running should not create duplicate named entries.

## Content notes
- Curated historical titles and original fictional game props are labeled separately. The original titles are fictional and not historical bibliography.
- Book text is short scenario hooks, not reproduced published books.
- Mythos mechanical effects are **homebrew** and require Keeper review; not canonical official CoC7 tome stats.
- Later books should not appear in earlier eras unless the Keeper chooses an anachronism.
- Unverified in live Foundry v14 / CoC7 v8.16. Back up your world before installation.
