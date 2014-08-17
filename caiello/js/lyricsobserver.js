var PlayerObservable = function() {
    this.subscribers = [];// will be only one :)
}
 
PlayerObservable.prototype = {
    subscribe: function(callback) {
        this.subscribers.push(callback);
    },
    unsubscribe: function(callback) {
        for (var i=0 ; i < this.subscribers.length; i++) {
            if (this.subscribers[i] === callback) {
                this.subscribers.splice(i, 1);//removing the suscriber..
                return;//stop the iteration
            }
        }
    },
    publish: function(data) {
        // Iterate over the subscribers array and call each of
        // the callback functions.
        for (var i=0 ; i < this.subscribers.length; i++) {
            this.subscribers[i](data);
        }        
    }
};

var LyricsObserver = function (data) {
    console.log(data);
}
 
// Here's where it gets used.
observable = new PlayerObservable();
observable.subscribe(LyricsObserver);
observable.publish('Published new song!');