var assert = require("assert");
var Validator = require("../lib/validator");

/* passes()  */
describe('Validator', function(){
  describe('#passes()', function(){
    it('验证规则为空则返回true', function(){
      var v = new Validator({}, {});
      assert.equal(true, v.passes());
    })

    it('规则不为空，但数据为空时返回false', function(){
      var v = new Validator({}, {username: 'required'});
      assert.equal(false, v.passes());
    })
  })
})