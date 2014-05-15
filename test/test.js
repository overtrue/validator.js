var assert = require("assert");
var validator = require("../lib/validator");

describe('Validator', function(){
  describe('#passes()', function(){
    it('should return true when the rule is empty', function(){
      v = new validator({}, {});
      assert.equal(true, v.passes());
    })
  })
})

describe('Validator', function(){
  describe('#passes()', function(){
    it('should return true when the rule is not empty', function(){
      v = new validator({}, {username: 'required'});
      assert.equal(false, v.passes());
    })
  })
})