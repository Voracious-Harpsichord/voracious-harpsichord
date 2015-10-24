import work_queue

def before():
	print("before was run")
	return

def after():
	print("after was run")
	return

before()
work_queue.enqueue(before, 7, after)
after()
# enqueue("test", logger, "an arguement to be printed")