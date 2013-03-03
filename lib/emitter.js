require.register('emitter', function (module, exports, require) {


// PubSub

function Emitter () {
    this.events = {};
    this.id = -1;
}

Emitter.prototype.emit = function (name) {
    if (!this.events[name]) return false;
    // the rest of the parameters without name
    var args = [].slice.call(arguments);
    args.splice(0,1);

    var subscribers = this.events[name],
        len = subscribers ? subscribers.length : 0;

    while (len--) {
        subscribers[len].callback.apply(this, args);
    }
    return this;
}

Emitter.prototype.on = function (name, callback) {
    if (!this.events[name]) this.events[name] = [];

    var token = (++this.id).toString();
    this.events[name].push({
        token: token,
        callback: callback
    });
    return token;
}

Emitter.prototype.off = function (token) {
    for (var name in this.events) {
        if (this.events[name]) {
            for (var i = 0, j = this.events[name].length; i < j; i++) {
                if (this.events[name][i].token === token) {
                    this.events[name].splice(i, 1);
                    return token;
                }
            }
        }
    }
    return this;
}

module.exports = Emitter;


});
