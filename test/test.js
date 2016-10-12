let FastQueueJs = require('../distes6/fastqueuejs.js');

let chai = require('chai');

let should = chai.should();

let assert = chai.assert;

let expect = chai.expect;



describe('FastQueueJs', function() {
	let queue = new FastQueueJs();
	describe('#enqueue()', function() {
		it('should insert an element in the queue', function() {

			queue.enqueue(13);
			expect(queue._queue.length).to.equal(1);
			queue.enqueue(3);
			expect(queue._queue.length).to.equal(2);
		});
	});

	describe('#enqueueMany(n)', function() {
		it('should insert many element in the queue', function() {

			queue.enqueueMany([23]);
			expect(queue._queue.length).to.equal(3);
			queue.enqueueMany([1, 2, 3, 4, 5]);
			expect(queue._queue.length).to.equal(8);
		});
	});

	describe('#dequeue()', function() {
		it('should pop the first in the queue', function() {

			let out = queue.dequeue();
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(7);
			expect(out).to.equal(13);
			out = queue.dequeue();
			expect(out).to.equal(3);
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(6);

		});
	});

	describe('#dequeueMany(n)', function() {
		it('should pop the first n elements in the queue', function() {

			let out = queue.dequeueMany(2);
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(4);
			expect(out).to.deep.equal([23, 1]);

		});
	});

	describe('#peek(n)', function() {
		it('should return the first(s) value(s) without popping the queue', function() {

			let out = queue.peek();
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(4);
			expect(out).to.equal(2);

			out = queue.peek(3);
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(4);
			expect(out).to.deep.equal([2, 3, 4]);

		});
	});

	describe('#last(n)', function() {
		it('should return the lasts(s) value(s) without popping the queue', function() {

			let out = queue.last();
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(4);
			expect(out).to.equal(5);

			out = queue.last(3);
			expect(queue._queue.length).to.equal(8);
			expect(queue.getLength()).to.equal(4);
			expect(out).to.deep.equal([3, 4, 5]);

		});
	});

	describe('#flush()', function() {
		it('should return all elements in the queue and completely empty it', function() {

			let out = queue.flush();
			expect(queue._queue.length).to.equal(0);
			expect(queue.getLength()).to.equal(0);
			expect(out).to.deep.equal([2, 3, 4, 5]);

			out = queue.dequeue();
			should.not.exist(out);

		});
	});



});


/*
 *SPEED TEST
 */
describe('-speedTest default sizelimit', function() {
	let queue = new FastQueueJs(),
		queue1 = new FastQueueJs(),
		queue2 = new FastQueueJs();
	let testLength = 1000000;
	let enqueuePercent = 0.50000001;
	let temp = 0;



	console.time('default limit of 1024 elements');
	for (let i = 0; i < testLength; ++i) {
		temp = Math.random();
		if (temp < enqueuePercent) {
			queue1.enqueue(temp);
		} else {
			queue1.dequeue();
		}
	}
	console.log(queue1.getLength());
	console.timeEnd('default limit of 1024 elements');
	//queue1.flush();

	//queue.flush();
	queue.setLimit(128);
	console.time('limit of 128 elements');
	for (let i = 0; i < testLength; ++i) {
		temp = Math.random();
		if (temp < enqueuePercent) {
			queue.enqueue(temp);
		} else {
			queue.dequeue();
		}
	}
	console.log(queue.getLength());
	console.timeEnd('limit of 128 elements');

	//queue2.flush();
	queue2.setLimit(16 * 1024);
	console.time('limit of 16*1024 elements');
	for (let i = 0; i < testLength; ++i) {
		temp = Math.random();
		if (temp < enqueuePercent) {
			queue2.enqueue(temp);
		} else {
			queue2.dequeue();
		}
	}
	console.log(queue2.getLength());
	console.timeEnd('limit of 16*1024 elements');

});