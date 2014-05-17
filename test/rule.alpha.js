var assert = require("assert");
var Validator = require("../lib/validator");

/* required */
describe('Validator', function(){
  describe('#alpha()', function(){
    var rules = {
        string: 'alpha'
      }

    it('正常(字符串"abc")', function() {
      var input = {
        string: 'abc'
      }
      var v = Validator.make(input, rules);
      assert.equal(true, v.passes());
    });

    it('正常(字符串"ABC")', function() {
      var input = {
        string: 'ABC'
      }
      var v = Validator.make(input, rules);
      assert.equal(true, v.passes());
    });

    it('失败(含数字)', function() {
      var input = {
        string: 'abc0s'
      }
      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });

    it('失败(数字前置)', function() {
      var input = {
        string: '1sbcdAb'
      }
      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });

    it('失败(数字后置)', function() {
      var input = {
        string: 'sbcdAb9'
      }
      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });

    it('失败(含其它字符)', function() {
      var input = {
        string: 'on_focus'
      }
      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });

    it('失败(空白)', function() {
      var input = {
        string: ''
      }

      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });

    it('失败(字符"*")', function() {
      var input = {
        string: '*'
      }
      var v = Validator.make(input, rules);
      assert.equal(false, v.passes());
    });
  });
});