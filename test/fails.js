var assert = require("assert");
var Validator = require("../lib/validator");

/* false()  */
describe('Validator', function(){
  describe('#fails()', function(){
    it('验证规则为空则返回false', function(){
      var v = new Validator({}, {});
      assert.equal(false, v.fails());
    })
 
    it('规则不为空，但数据为空时返回false', function(){
      var v = new Validator({}, {username: 'required'});
      assert.equal(true, v.fails());
    })
  })
})