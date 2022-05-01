## Dependencies you need
- `python>=3.8`
- `make`
- Basic unix commands

## Building
```bash
# Manually export the WhatsApp chat to ./lunch.txt and then:
make
```

All build artifacts reside in `build/`, even intermediate ones.

The final build artifact is `docs/index.html`, which is served by Github Pages.

## Project files
- `parser.py` - converts `lunch.txt` to `reports.json`
- client side is defined in `index.html` and `index.js`


## How to open a PR
Just do it, but I can't promise I'll get to review it and/or decide to merge it unless you discuss it beforehand via an issue.
