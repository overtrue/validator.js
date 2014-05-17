var assert = require("assert");
var Validator = require("../lib/validator");

/* new Validator */
describe('Validator', function(){
  describe('#constructor()', function(){
    it('返回Validator实例', function() {
      var v = new Validator({}, {});
      assert.equal('Validator', v.name);
    });
 
    it('参数异常', function() {
      assert.throws(function(){new Validator()}, Error);
    });
 
    it('参数异常', function() {
      assert.throws(function(){new Validator({})}, Error);
    });
  })
})