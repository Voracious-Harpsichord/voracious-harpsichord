.PHONY: clean

clean:
	find . -name "*.pyc" -delete
	find . -name "__pycache__" -delete

image:
	docker build -t beautystash .

server:
	docker run -d -p 8080:8080 --name beautystash-dev beautystash
