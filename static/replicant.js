// TODO remove jquery usage
// TODO need to unify error codes and messages
// FIXME para doc on save should be optional
// TODO use bulk operations

var Replicant = {
    initialize: function(){
    },

    Object: klass({
        initialize: function (){
            this.doc = {};
        },

        set: function (key, value){
            this.doc[key] = value;
        },

        get: function (key){
            return this.doc[key];
        },

        unset: function(key){
            delete this.doc[key];
        },

        fetch: function(callback){
            if (!this.meta || this.meta == undefined){
                callback.error(this.doc, 'Unsaved object');
            } else {
                Pouch('idb://store1', $.proxy(function(err, db) {
                    if (err){ // error opening database
                        callback.error(this.doc, err);
                    }
                    db.get(this.meta.id, $.proxy(function(err, doc){
                        if (err){
                            callback.error(this.doc, err);
                        } else {
                            this.doc = doc;
                            callback.success(this.doc)
                        }
                    }, this));
                }, this));
            }
        },

        save: function (data, callback){
            if (data){
                this.doc = data;
            }

            Pouch('idb://store1', $.proxy(function(err, db) {
                if (err){ // error opening database
                    callback.error(this.doc, err);
                }

                if (!this.meta){ // first save create a doc
                    db.post(this.doc, $.proxy(function (err, res){
                        if (err){
                            callback.error(this.doc, err);
                        } else {
                            this.meta = res;
                            db.replicate.to('http://localhost:2020/store1', function (err, changes){
                                if (err){
                                    console.log(err);
                                }
                            });
                            callback.success(this.doc);
                        }
                    }, this));
                } else {
                    var newData = $.extend({}, this.doc); // copy doc
                    newData['_id'] = this.meta.id;
                    newData['_rev'] = this.meta.rev;
                    db.put(newData, $.proxy(function (err, res){
                        if (err){
                            callback.error(this.doc, err);
                        } else {
                            this.meta['rev'] = res.rev;
                            callback.success(this.doc)
                        }
                    }, this));
                }
            }, this));
        },

        destroy: function (callback){
            if (!this.meta || this.meta == undefined){
                callback.error(this.doc, 'Unsaved object');
            } else {
                Pouch('idb://store1', $.proxy(function(err, db) {
                    if (err){ // error opening database
                        callback.error(this.doc, err);
                    }
                    
                    db.remove({_id: this.meta.id, _rev: this.meta.rev}, $.proxy(function(err, res){
                        if (err){
                            callback.error(this.doc, err);
                        } else {
                            db.replicate.to('http://localhost:2020/store1', function (err, changes){
                                if (err){
                                    console.log(err);
                                }
                            });
                            callback.success(this.doc)
                        }
                    }, this));
                }, this));
            }
        }
    }), 
}
