# # How to use this module:
# from workers import work_queue
# work_queue.enqueue(<taskName>, [<arg1>, <arg2>, <arg3>, ...])

from threading import *

#workers
import test_worker

tasks = {
    "test": test_worker.testing
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
    except: 
      try:
        self.func()
      except:
        print('error with func:', self.func)

  def start(self):
    self.t.start()

def enqueue(taskname, args):  
    print("running task: " + taskname + " with arguments", args)
    Asyncifyer(tasks[taskname], args)

