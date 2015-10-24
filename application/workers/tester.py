#Note: 	This module doesn't do anything for the application
#		it just tests what would happen if we used the worker_queue module from another module.

import work_queue

work_queue.enqueue("test", ["Hello World"])