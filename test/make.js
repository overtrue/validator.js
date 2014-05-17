var assert = require("assert");
var Validator = require("../lib/validator");

/* make */
describe('Validator', function(){
  describe('#make()', function(){
    it('返回Validator实例', function() {
      var v = Validator.make({}, {});
      assert.equal('Validator', v.name);
    });
 
    it('参数异常', function() {
      assert.throws(function(){Validator.make()}, Error);
    });

    it('参数异常', function() {
      assert.throws(function(){Validator.make({})}, Error);
    });
  })
})