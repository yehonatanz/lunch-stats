## Dependencies you need
- `python>=3.8`
- `make`
- Basic unix commands
- lunch.txt - manually export the WhatsApp chat to ./lunch.txt

## Building
```bash
make
```

## Developing
```bash
make dev
```

The only build artifact is `docs/reports.json`

## Project files
- `parser.py` - converts `lunch.txt` to `reports.json`
- client side is in `docs/index.html` and `docs/index.js` - served by Github Pages


## How to open a PR
Just do it, but I can't promise I'll get to review it and/or decide to merge it unless you discuss it beforehand via an issue.
