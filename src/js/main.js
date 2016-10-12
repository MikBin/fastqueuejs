/**
 * ------------------------------------------------------------------------
 * Class Definitions
 * ------------------------------------------------------------------------
 */

const FastQueueJs = (() => {
    class FastQueueJs {
        constructor(sizeLimit = 1024) {
            this._limit = ~~sizeLimit;
            this._queue = [];
            this._first = 0;
        }

        enqueue(value) {
            this._queue.push(value);

            return this;
        };
        dequeue() {
            /**should throw if empty? */
            let out;
            if (!this.isEmpty()) {
                out = this._queue[this._first];
                this._first++;
                if (this._first === this._limit) {
                    this.removeDequeued();
                }
            }

            return out;
        };
        removeDequeued() {
            let l = this._queue.length,
                i = this._first,
                queue = this._queue;
            while (i > 0) {
                l--;
                i--;
                queue[i] = queue[l];

            }

            queue.length = queue.length - this._first;
            this._first = 0;
        };
        enqueueMany(list) {
            if (list.length) {
                this._queue.push(...list);

            }
            return this;
        };
        dequeueMany(howMany) {
            let l = this.getLength();

            if (howMany <= l) {
                let first = this._first;
                this._first += howMany;
                let out = this._queue.slice(first, first + howMany);
                if (this._first >= this._limit) {
                    this.removeDequeued();
                }

                return out;
            } else {
                return this.flush();
            }
        };
        isEmpty() {
            return this.getLength() === 0;
        };
        flush() {
            if (this.getLength() === 0) {
                return [];
            }
            this.removeDequeued();
            let queue = this._queue;
            this._queue = [];
            this._first = 0;
            return queue;
        };
        peek(n = 1) {
            if (n === 1) {
                return this._queue[this._first];
            } else {

                let max = this._first + n;
                if (max >= this._queue.length) {
                    return this._queue.slice(this._first);
                }

                return this._queue.slice(this._first, this._first + n);
            }

        };
        last(n = 1) {
            if (n === 1) {
                return this._queue[this._queue.length - 1];
            } else {
                if (n < this.getLength()) {
                    return this._queue.slice(this._queue.length - n);
                }
                return this._queue.slice(this._first);
            }
        };
        getLength() {
            return this._queue.length - this._first;
        };
        setLimit(sizeLimit) {
            this._limit = !isNaN(sizeLimit) ? ~~sizeLimit : 1024;
        };

    };
    return FastQueueJs;
})();

export default FastQueueJs;