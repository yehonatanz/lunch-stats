docs/build/reports.json: lunch.txt parser.py
	mkdir -p docs/build
	python3 parser.py < lunch.txt > $@

lunch.txt:
	@echo Please export Forter lunch only IL chat to lunch.txt
	exit 1

.PHONY: clean
clean:
	rm -rf docs/build

.PHONY: dev
dev: docs/build/reports.json
	./dev.sh
