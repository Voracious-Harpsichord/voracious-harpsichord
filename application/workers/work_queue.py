# # How to use this module:
# from workers import work_queue
# work_queue.enqueue(<taskName>, [<arg1>, <arg2>, <arg3>, ...])

from threading import *

#workers
from workers import test_worker
from workers import recEngine

tasks = {
    "test": test_worker.testing,
    "find_prob":recEngine.find_prob
}

#RYAN WHOLEY IS AWESOME!!!
class Asyncifyer():
  def __init__(self, func, args=[]):
    self.args = args
    self.func = func
    Thread(target=self.run).start()

  def run(self):
    try:
      self.func(*self.args)
    except Exception as e:
      print(e) 
      # try:
        # self.func()
      # except:
        # print('error with func:', self.func)

  def start(self):
    self.t.start()

def enqueue(taskname, args):  
    print("running task: " + taskname + " with arguments", args)
    Asyncifyer(tasks[taskname], args)

