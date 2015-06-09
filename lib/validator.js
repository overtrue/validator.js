/**
 * mod-validator
 *
 * @author  overtrue <anzhengchao@gmail.com>
 * @link    https://github.com/overtrue/validator.js
 * @version 0.0.9
 * @license MIT
 */

/**
 * mod-validator
 *
 * @return {Void}
 */
(function() {

  // numeric rules
  var _numericRules = ['Numeric', 'Integer'];

  // messages
  var _messages = {
        accepted         : "The :attribute must be accepted.",
        alpha            : "The :attribute may only contain letters.",
        alpha_dash       : "The :attribute may only contain letters, numbers, and dashes.",
        alpha_num        : "The :attribute may only contain letters and numbers.",
        array            : "The :attribute must be an array.",
        object           : "The :attribute must be an object.",
        between          : {
           numeric : "The :attribute must be between :min and :max.",
           string  : "The :attribute must be between :min and :max characters.",
           array   : "The :attribute must have between :min and :max items.",
        },
        confirmed        : "The :attribute confirmation does not match.",
        different        : "The :attribute and :other must be different.",
        digits           : "The :attribute must be :digits digits.",
        digits_between   : "The :attribute must be between :min and :max digits.",
        email           : "The :attribute format is invalid.",
        allow            : "The selected :attribute is invalid.",
        integer          : "The :attribute must be an integer.",
        ip               : "The :attribute must be a valid IP address.",
        max              : {
          numeric : "The :attribute may not be greater than :max.",
          string  : "The :attribute may not be greater than :max characters.",
          array   : "The :attribute may not have more than :max items.",
        },
        min              : {
          numeric : "The :attribute must be at least :min.",
          string  : "The :attribute must be at least :min characters.",
          array   : "The :attribute must have at least :min items.",
        },
        not_in           : "The selected :attribute is invalid.",
        numeric          : "The :attribute must be a number.",
        regex            : "The :attribute format is invalid.",
        required         : "The :attribute field is required.",
        required_if      : "The :attribute field is required when :other is :value.",
        required_with    : "The :attribute field is required when :values is present.",
        required_without : "The :attribute field is required when :values is not present.",
        same             : "The :attribute and :other must match.",
        size             : {
          numeric : "The :attribute must be :size.",
          string  : "The :attribute must be :size characters.",
          array   : "The :attribute must contain :size items.",
        },
        url              : "The :attribute format is invalid.",
        def              : 'The :attribute attribute has errors.',
  };

  // attribute alias
  var _attributes    = {};

  // attribute value alias
  var _values        = {};

  // input data
  var _input         = {};

  // validation rules
  var _rules         = {};

  // failed rules
  var _failedRules   = {};

  // errors
  var _errors        = {};

  // attribute replacers
  var _replacers     = {};

  // translator
  var _translator  = {
      trans: function(key){
        return key;
      }
    };

  // Based on jquery's extend function
  function extend() {
    var src, copy, name, options, clone;
    var target = arguments[0] || {};
    var i = 1;
    var length = arguments.length;

    for ( ; i < length; i++ ) {
      // Only deal with non-null/undefined values
      if ( (options = arguments[ i ]) != null ) {
        // Extend the base object
        for ( name in options ) {
          src = target[ name ];
          copy = options[ name ];

          // Prevent never-ending loop
          if ( target === copy ) {
            continue;
          }

          // Recurse if we're merging plain objects or arrays
          if ( copy && typeof copy === "object" ) {
            clone = src && typeof src === "object" ? src : {};

            // Never move original objects, clone them
            target[ name ] = extend( clone, copy );

          // Don't bring in undefined values
          } else if ( copy !== undefined ) {
            target[ name ] = copy;
          }
        }
      }
    }

    // Return the modified object
    return target;
  }

  //php function:in_array
  function in_array(needle, haystack, argStrict) {
    var key = '',
        strict = !! argStrict;

      for (key in haystack) {
        if (strict ? (haystack[key] === needle) : haystack[key] == needle) {
          return true;
        }
      }

      return false;
  }

  /**
   * determine needle is a object
   *
   * @param {Mixed} needle
   *
   * @return {Boolean}
   */
  function is_object(needle) {
    return (typeof needle === 'object');
  }

  /**
   * determine object is a empty object
   *
   * @param {Object} obj
   *
   * @return {Boolean}
   */
  function isEmptyObject(obj){
      for(var n in obj){return false}
      return true;
  }

  /**
   * determine needle is a array
   *
   * @param {Mixed} needle
   *
   * @return {Boolean}
   */
  function is_array(arr) {
    return typeof arr === 'object' && typeof arr.length === 'number' && !(arr.propertyIsEnumerable('length')) &&
      typeof arr.splice === 'function';
  }

  /**
   * determine needle is a function
   *
   * @param {Mixed} needle
   *
   * @return {Boolean}
   */
  function is_function(needle) {
    return (typeof needle === 'function');
  }

  /**
   * determine needle is a object
   *
   * @param {Mixed} needle
   *
   * @return {Boolean}
   */
  function is_string(needle) {
    return (typeof needle === 'string');
  }

  /**
   * explode the rules into an array of rules.
   *
   * @return {Void}
   */
  function _explodeRules(rules) {
    for (var i in rules) {
      if (is_string(rules[i])) {
        rules[i] = rules[i].split('|');
      }
    }
    return rules;
  }

  /**
   * parse the rule
   *
   * @param {Array} rule
   *
   * @return {Object}
   */
  function _parseRule(rule) {
    var parameters = [];

    // The format for specifying validation rules and parameters follows an
    // easy {rule}:{parameters} formatting convention. For instance the
    // rule "Max:3" states that the value may only be three letters.
    if (rule.indexOf(':')) {
      var ruleInfo  = rule.split(':');
      parameters = _parseParameters(ruleInfo[0], ruleInfo[1]);
    }

    return { parameters: parameters, rule: ruleInfo[0]};
  }

  /**
   * parse parameters of rule
   *
   * @param {String} rule
   * @param {String} parameter
   *
   * @return {Array}
   */
  function _parseParameters(rule, parameter) {
    if (rule.toLowerCase() == 'regex') return [parameter];
    if (is_string(parameter)) {
      return parameter.split(',');
    };

    return [];
  }

  /**
   * add a failure rule
   *
   * @param {String} attribute
   * @param {String} rule
   * @param {Array}  parameters
   *
   * @return {Void}
   */
  function _addFailure(attribute, rule, parameters) {
    _addError(attribute, rule, parameters);
    if (! _failedRules[attribute]) {
      _failedRules[attribute] = {};
    }
    _failedRules[attribute][rule] = parameters;
  }

  /**
   * add a error message
   *
   * @param {String} attribute
   * @param {String} rule
   * @param {Array}  parameters
   *
   * @return {Void}
   */
  function _addError(attribute, rule, parameters) {
    if (_errors[attribute]) {
      return;
    };
    _errors[attribute] = _formatMessage(_getMessage(attribute, rule) || '', attribute, rule, parameters);
  }

  /**
   * get value of arrtibute
   *
   * @param {String} attribute
   *
   * @return {Mixed}
   */
  function _getValue(attribute) {
    return _input[attribute] || null;
  }

  /**
   * get attribute message
   *
   * @param {String} attribute
   * @param {String} rule
   *
   * @return {String}
   */
  function _getMessage(attribute, rule) {

    var message = _messages[rule];
    if (is_object(message)) {
      var value = _getValue(attribute);
      if (is_array(value) && message['array']) {
        return message['array'];
      } else if (_resolvers.numeric(value) && message['numeric']) {
        return message['numeric'];
      } else if (is_string(value) && message['string']){
        return message['string'];
      }
    };

    return message;
  }

  /**
   * replace attributes.
   *
   * @param {String} message
   * @param {String} attribute
   * @param {String} rule
   * @param {Array}  parameters
   *
   * @return {String}
   */
  function _formatMessage(message, attribute, rule, parameters) {
    parameters.unshift(_getAttribute(attribute));

    for(i in parameters){
      message = message.replace(/:[a-zA-z_][a-zA-z_0-9]+/, parameters[i]);
    }

    if (typeof _replacers[rule] === 'function') {
      message = _replacers[rule](message, attribute, rule, parameters);
    }

    return message;
  }

  /**
   * get attribute name
   *
   * @param {String} attribute
   *
   * @return {String}
   */
  function _getAttribute(attribute) {
    if (is_string(_attributes[attribute])) {
      return _attributes[attribute];
    }

    if ((line = _translator.trans(attribute)) !== attribute) {
      return line;
    } else {
      return attribute.replace('_', ' ');
    }
  }

  /**
   * determine if the given attribute has a rule in the given set.
   *
   * @param {String}       attribute
   * @param {String|array} rules
   *
   * @return {Boolean}
   */
  function _hasRule(attribute, rules) {
    return ! _getRule(attribute, rules) == null;
  }

  /**
   * get rule and parameters of a rules
   *
   * @param {String}       attribute
   * @param {String|array} rules
   *
   * @return {Array|null}
   */
  function _getRule(attribute, rules) {
    rules = rules || [];

    if ( ! rules[attribute]) {
      return;
    }

    for(var i in rules[attribute]) {
      var value = rules[attribute][i];
      parsedRule = _parseRule(rule);

      if (in_array(parsedRule.rule, rules))
        return [parsedRule.rule, parsedRule.parameters];
    }
  }

  /**
   * get attribute size
   *
   * @param {String}  attribute
   * @param {Mixed}   value
   *
   * @return {Number}
   */
  function _getSize(attribute, value) {
    hasNumeric = _hasRule(attribute, _numericRules);

    // This method will determine if the attribute is a number, string, or file and
    // return the proper size accordingly. If it is a number, then number itself
    // is the size. If it is a file, we take kilobytes, and for a string the
    // entire length of the string will be considered the attribute size.
    if (/^[0-9]+$/.test(value) && hasNumeric) {
      return getValue(attribute);
    } else if (value && is_string(value) || is_array(value)) {
      return value.length;
    }

    return 0;
  }

  /**
   * check parameters count
   *
   * @param {Number} count
   * @param {Array}  parameters
   * @param {String} rule
   *
   * @return {Void}
   */
  function _requireParameterCount(count, parameters, rule) {
    if (parameters.length < count) {
      throw Error('Validation rule"' + rule + '" requires at least ' + count + ' parameters.');
    }
  }

  /**
   * all failing check
   *
   * @param {Array} attributes
   *
   * @return {Boolean}
   */
  function _allFailingRequired(attributes) {
    for (var i in attributes) {
      var akey = attributes[i];

      if (resolvers.validateRequired(key, self._getValue(key))) {
        return false;
      }
    }

    return true;
  }

  /**
   * determine if any of the given attributes fail the required test.
   *
   * @param  array  $attributes
   * @return bool
   */
  function _anyFailingRequired(attributes) {
    for (var i in attributes) {
      var key = attributes[i];
      if ( ! _resolvers.validateRequired(key, self.date[key])) {
        return true;
      }
    }

    return false;
  }


  var _resolvers = {
    accepted: function(attribute, value) {
      var acceptable = ['yes', 'on', '1', 1, true, 'true'];

      is_string(value) && (value = value.toLowerCase());

      return (this.required(attribute, value) && in_array(value, acceptable, true));
    },

    alpha: function(attribute, value) {
      if (!value) { return false;};
      return ((new RegExp('^[a-z]+$', 'i')).test(value));
    },

    alpha_dash: function(attribute, value) {
      return ((new RegExp('^[a-z0-9\-_]+$', 'i')).test(value));
    },

    alpha_num: function(attribute, value) {
      return ((new RegExp('^[a-z0-9]+$', 'i')).test(value));
    },

    array: function(attribute, value) {
      return is_array(value);
    },

    object: function(attribute, value) {
      return is_object(value);
    },

    between: function(attribute, value, parameters) {
      _requireParameterCount(2, parameters, 'between');

      var size = _getSize(attribute, value);

      return size >= parameters[0] && size <= parameters[1];
    },

    confirmed: function(attribute, value, parameters) {
      return this.same(attribute, value, [attribute + '_confirmation']);
    },

    same: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'same');

      var other = _getValue(parameters[0]);

      return (other && value == other);
    },

    different: function(attribute, value, parameters) {
      return ! this.same(attribute, value, parameters);
    },

    digits: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'digits');

      return (new RegExp('^\d{' + Math.abs(parameters[0]) + '}$')).test(value);
    },

    digits_between: function(attribute, value, parameters) {
      _requireParameterCount(2, parameters, 'digits_between');

      return ((new RegExp('^\d{' + Math.abs(parameters[0]) + '}$')).test(value)
                && value > parameters[0]
                && value < parameters[1]);
    },

    email: function(attribute, value) {
      var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

      return regex.test(value);
    },

    "in": function(attribute, value, parameters) {
      return in_array(value || '', parameters);
    },

    not_in: function(attribute, value, parameters) {
      return !in_array(value || '', parameters);
    },

    integer: function(attribute, value) {
      return /^(?:-?(?:0|[1-9][0-9]*))$/.test(value);
    },

    ip: function(attribute, value) {
      var ipv4Maybe = /^(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)\.(\d?\d?\d)$/
          , ipv6 = /^::|^::1|^([a-fA-F0-9]{1,4}::?){1,7}([a-fA-F0-9]{1,4})$/;
      return ipv4Maybe.test(value) || ipv6.test(value);
    },

    max: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'max');

      return _getSize(attribute, value) <= parameters[0];
    },

    min: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'min');

      return _getSize(attribute, value) >= parameters[0];
    },

    numeric: function(attribute, value) {
      return /^[0-9]+$/.test(value);
    },

    regex: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'regex');

      return (new RegExp(parameters[0])).test(value);
    },

    required: function(attribute, value) {
      if (!value || undefined === value) {
        return false;
      } else if ((is_string(value) || is_array(value) || is_object(value)) && !value.length) {
        return false;
      }

      return true;
    },

    required_if: function(attribute, value, parameters) {
      _requireParameterCount(2, parameters, 'required_if');

      var _input = getValue(parameters[0]);

      var values = parameters.splice(1);

      if (in_array(data, values)) {
        return resolvers.required(attribute, value);
      }

      return true;
    },

    required_with: function(attribute, value, parameters) {
      if ( ! self._allFailingRequired(parameters)) {
        return resolvers.required(attribute, value);
      }

      return true;
    },

    required_without: function(attribute, value, parameters) {
      if (self._anyFailingRequired(parameters)) {
        return resolvers.required(attribute, value);
      }

      return true;
    },

    size: function(attribute, value, parameters) {
      _requireParameterCount(1, parameters, 'size');

      return _getSize(attribute, value) == parameters[0];
    },

    url: function(attribute, value) {
      var strRegex = "^((https|http|ftp|rtsp|mms)?://)"
              + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp user@
              + "(([0-9]{1,3}/.){3}[0-9]{1,3}" // IP- 199.194.52.184
              + "|" // ip or domain
              + "([0-9a-z_!~*'()-]+/.)*" // domain- www.
              + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]/." // sub domain
              + "[a-z]{2,6})" // first level domain- .com or .museum
              + "(:[0-9]{1,4})?" // port- :80
              + "((/?)|" // a slash isn't required if there is no file name
              + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";
              var regex = new RegExp(strRegex);

              return regex.test(str_url);
    }
  };

  var Validator = function(input, rules, customMessages) {
    if (undefined === input || undefined === rules) {
      throw Error('Validator constructor requires at least 2 parameters.');
    };
    // reset data expect _messages,_atteibutes, _values
    _input       = input;
    _rules       = rules;
    _failedRules = {};
    _errors      = {};
    _messages    = extend({}, _messages, customMessages || {});
  };

  Validator.prototype = {
    name: 'Validator',
    constructor: Validator,

    // error messages
    // {username: xxxx, password: xxxx}
    messages: function() {
      return _errors;
    },

    errors: function(){
      return _errors;
    },

    // faildRules
    faildRules: _failedRules,

    // set translator
    setTranslator: function(translator){
      _translator = translator || _translator;
    },

    /**
     * exec validate
     *
     * @return {Boolean}
     */
    passes: function() {
      rulesArray = _explodeRules(_rules);

      for (var attribute in rulesArray) {

        var rules = rulesArray[attribute];
        for (var i in rules) {
          if (_errors[attribute]) {
            continue;
          };
          var ruleString  = rules[i];
          var parsedRule  = _parseRule(ruleString);
          var rule        = parsedRule.rule;
          var parameters  = parsedRule.parameters;
          var value       = _input[attribute] || null;
          var validatable = is_function(_resolvers[rule]);

          if (validatable && ! _resolvers[rule](attribute, value, parameters)) {
            _addFailure(attribute, rule, parameters);
          }
        }
      }

      return isEmptyObject(_errors);
    },

    /**
     * return the validate value
     *
     * @return {Boolean}
     */
    fails: function() {
      return ! this.passes();
    },

    /**
     * add custom messages
     *
     * @param {String/Object} rule
     * @param {String}        message
     *
     * @return {Void}
     */
    mergeMessage: function(rule, message) {
      if (is_object(rule)) {
        _messages = extend({}, _messages, rule);
      } else if (is_string(rule)) {
        _messages[rule] = message;
      }
    },

    /**
     * add attributes alias
     *
     * @param {String/Object} attribute
     * @param {String}        alias
     *
     * @return {Void}
     */
    mergeAttribute: function(attribute, alias) {
      if (is_object(attribute)) {
        _attributes = extend({}, _attributes, attribute);
      } else if (is_string(attribute)) {
        _attributes[attribute] = alias;
      }
    },

    /**
     * add values alias
     *
     * @param {String/Object} attribute
     * @param {String}        alias
     *
     * @return {Void}
     */
    mergeValue: function(value, alias) {
      if (is_object(value)) {
        _values = extend({}, _values, value);
      } else if (is_string(rule)) {
        _values[value] = alias;
      }
    },

    /**
     * add message replacers
     *
     * @param {String/Object} rule
     * @param {Function}      fn
     *
     * @return {Void}
     */
    mergeReplacers: function(rule, fn) {
      if (is_object(rule)) {
        _replacers = extend({}, _replacers, rule);
      } else if (is_string(rule)) {
        _replacers[rule] = fn;
      }
    }

  };

  /**
   * register a user custom rule
   *
   * @param {String}   rule
   * @param {Function} fn
   * @param {Object}   errMsg
   *
   * @return {Void}
   */
  Validator.register = function(rule, fn, errMsg) {
    _resolvers[rule] = fn;
    _messages[rule] = (is_string(errMsg)) ? errMsg : _messages['def'];
  };

  /**
   * make a Validator instance
   *
   * @param {Object} data
   * @param {Object} rule
   * @param {Object} messages
   *
   * @return {Object}
   */
  Validator.make = function(data, rule, messages){
    return new Validator(data, rule, messages);
  };

  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = Validator;
  } else {
    window.Validator = window.validator = Validator;
  }

}());
