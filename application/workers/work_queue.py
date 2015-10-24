# import multi threading library and make a queue
from multiprocessing import Pool
Q = Pool()
# import workers
# import test_worker

# library of worker function mapped to kerywords
# tasks = {
#     "test": test_worker.test
# }

def this_func(num):
    print(num)
    return num + 1

def that_func(num):
    print(num)
    return num + 1

def enqueue(func, arg, callback):
    print("enqueue was called")
    result = Q.apply_async(func, args=(arg,))
    print("async was called")
    # print(result.get())

# this_func(1)
enqueue(this_func, 1, that_func)
# that_func(1)