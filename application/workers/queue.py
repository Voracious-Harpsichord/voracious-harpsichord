#from rq import Queue
#from redis import Redis

from redis import Redis
from rq import Queue
print(dir(rq))
print(dir(redis))


# from test_worker import testing
# # Tell RQ what Redis connection to use
# q = Queue(connection=Redis())

# job = q.enqueue(testing, "testing")
# print(job.result)