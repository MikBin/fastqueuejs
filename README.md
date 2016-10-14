
# Javascript Fast Queue


Fast implementation of Queue in javascript using es6 classes and arrays.\
An offset pointer to the first element in the queue is used for performance reasons;
at each dequeue the pointer is updated.\
dequeued element are still in the internal array, the array is going to be resized when the quantity of dequeued elements  crosses a threshold parameter.\n

```javascript
/*The default threshold parameter is 1024 it can be changed during instantiation:*/
let queue = new FastQueueJs(2048);
/*or at run time*/
queue.setLimit(128);
```

## Dependencies

no dependencies, works with commonJs, amd, or browser global

## Usage Examples

```javascript
let queue = new FastQueueJs();

queue.enqueue('A');

queue.enqueueMany(['B']);
queue.enqueueMany(['R','A','C','A','D']);
queue.getLength(); //7

queue.dequeue();\\'A'

queue.dequeueMany(2);//['B','R','A']
queue.getLength(); //3

queue.isEmpty();//false

queue.peek();//'C'
queue.getLength();//3
queue.peek(2);//['C','A']
queue.getLength();//3

queue.last();//'D'
queue.getLength();//3
queue.last(2);//['D','A']
queue.getLength();//3

queue.flush();//['C','A','D']
queue.getLength();//0
/*flush() also removes all previously dequeued element reducin internal array size to zero*/
```



