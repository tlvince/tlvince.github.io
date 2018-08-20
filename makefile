all: new

new:
	@read -p "Title: " title; \
	read -p "Abstract: " abstract; \
	url=$$(echo "$$title" | sed \
		-e "s/\(.*\)/\L\1/" \
		-e "s/\&/and/g" \
		-e "s/\s\+/-/g" \
		-e "s/[^a-z0-9-]//g"); \
	out="_posts/$$(date +%F)-$$url.md"; \
	echo "---" >> "$$out"; \
	echo "title: $$title" >> "$$out"; \
	echo "date: $$(date +'%F %T %z')" >> "$$out"; \
	echo "abstract: $$abstract" >> "$$out"; \
	echo "---" >> "$$out"; \
	echo -e "\n" >> "$$out"

.PHONY: all new
