docs/index.html: build/index.html
	mkdir -p docs
	cp "$<" "$@"

build/index.html: build/reports.json index.html index.js
	printf "$$(cat index.html)" "$$(base64 build/reports.json)" "$$(cat index.js)" > $@

build/reports.json: lunch.txt parser.py
	mkdir -p build
	python3 parser.py < lunch.txt > $@

lunch.txt:
	@echo Please export Forter lunch only IL chat to lunch.txt
	exit 1

clean:
	rm -rf build
