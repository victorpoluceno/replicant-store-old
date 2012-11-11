function initTest(){
    Replicant.initialize("", "");
    var TestObject = Replicant.Object.extend("TestObject");    
    return new TestObject();
}

test("initialize test", function(){
    Replicant.initialize("", "");  
    ok(true);
});

test("extend test", function (){
    Replicant.initialize("", "");  
    var TestObject = Replicant.Object.extend("TestObject");
    ok(TestObject);
});

test("get/set/unset test", function(){
    testObject = initTest();
    equal(testObject.get('foo'), undefined);
    testObject.set('foo', 'bar');
    equal(testObject.get('foo'), 'bar');
    testObject.unset('foo');
    equal(testObject.get('foo'), undefined);
});

asyncTest("save test", function() {
    testObject = initTest();
    testObject.save({foo: "bar"}, {
        success: function(object) {
            ok(object);
            equal(object.foo, 'bar');
            testObject.save({foo: "barx"}, {
                success: function(object) {
                    ok(object);
                    equal(object.foo, 'barx');
                    start();
                }
            });
        },
    });
});

asyncTest("destroy test", function() {
    expect(3);

    testObject = initTest();
    testObject.destroy({
        error: function (object, err){
            ok(object);
            ok(err);
        }
    });

    testObject.save({}, {
        success: function (object){
            testObject.destroy({
                success: function (object){
                    ok(object);
                    start();
                }
            });
        }
    });
});

asyncTest("fetch test", function (){
    expect(5);

    testObject = initTest();
    
    testObject.fetch({
        error: function (object, err){
            ok(object);
            ok(err);
        }
    });

    testObject.save({'foo': 'bar'}, {
        success: function (object){
            testObject.fetch({
                success: function (object){
                    ok(object);
                    equal(object.foo, 'bar');
                }
            });

            testObject.set('foo', 'barx');
            testObject.fetch({
                success: function (object){
                    equal(object.foo, 'bar');
                    start();
                }
            });
        }
    });
});
