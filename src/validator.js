
(function(data, validateRules, messages){

  /**
   * numeric rules  
   *
   * @type {Array}
   */
  var numericRules = ['Numeric', 'Integer'];

  /**
   * messages
   */
  var messages = {
        accepted         : "The :attribute must be accepted.",
        after            : "The :attribute must be a date after :date.",
        alpha            : "The :attribute may only contain letters.",
        alpha_dash       : "The :attribute may only contain letters, numbers, and dashes.",
        alpha_num        : "The :attribute may only contain letters and numbers.",
        array            : "The :attribute must be an array.",
        before           : "The :attribute must be a date before :date.",
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
        "in"               : "The selected :attribute is invalid.",
        integer          : "The :attribute must be an integer.",
        ip               : "The :attribute must be a valid IP address.",
        max              : {
          numeric : "The :attribute may not be greater than :max.",
          string  : "The :attribute may not be greater than :max characters.",
          array   : "The :attribute may not have more than :max items.",
        },
        mimes            : "The :attribute must be a file of type: :values.",
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

      //custom messages
      custom : {},

      // attribute alias 
      attributes : {},
        
      // attribute value alias
      values : {},

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
   * string to time
   *
   * @param {String} text 
   * @param {Number} now  
   *
   * @return {Number}
   */
  function strtotime(text, now) {
    //  discuss at: http://phpjs.org/functions/strtotime/
    //     version: 1109.2016
    // original by: Caio Ariede (http://caioariede.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Caio Ariede (http://caioariede.com)
    // improved by: A. Matías Quezada (http://amatiasq.com)
    // improved by: preuter
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Mirko Faber
    //    input by: David
    // bugfixed by: Wagner B. Soares
    // bugfixed by: Artur Tchernychev
    //        note: Examples all have a fixed timestamp to prevent tests to fail because of variable time(zones)
    //   example 1: strtotime('+1 day', 1129633200);
    //   returns 1: 1129719600
    //   example 2: strtotime('+1 week 2 days 4 hours 2 seconds', 1129633200);
    //   returns 2: 1130425202
    //   example 3: strtotime('last month', 1129633200);
    //   returns 3: 1127041200
    //   example 4: strtotime('2009-05-04 08:30:00 GMT');
    //   returns 4: 1241425800

    var parsed, match, today, year, date, days, ranges, len, times, regex, i, fail = false;

    if (!text) {
      return fail;
    }

    // Unecessary spaces
    text = text.replace(/^\s+|\s+$/g, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/[\t\r\n]/g, '')
      .toLowerCase();

    // in contrast to php, js Date.parse function interprets:
    // dates given as yyyy-mm-dd as in timezone: UTC,
    // dates with "." or "-" as MDY instead of DMY
    // dates with two-digit years differently
    // etc...etc...
    // ...therefore we manually parse lots of common date formats
    match = text.match(
      /^(\d{1,4})([\-\.\/\:])(\d{1,2})([\-\.\/\:])(\d{1,4})(?:\s(\d{1,2}):(\d{2})?:?(\d{2})?)?(?:\s([A-Z]+)?)?$/);

    if (match && match[2] === match[4]) {
      if (match[1] > 1901) {
        switch (match[2]) {
        case '-':
          {
            // YYYY-M-D
            if (match[3] > 12 || match[5] > 31) {
              return fail;
            }

            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        case '.':
          {
            // YYYY.M.D is not parsed by strtotime()
            return fail;
          }
        case '/':
          {
            // YYYY/M/D
            if (match[3] > 12 || match[5] > 31) {
              return fail;
            }

            return new Date(match[1], parseInt(match[3], 10) - 1, match[5],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        }
      } else if (match[5] > 1901) {
        switch (match[2]) {
        case '-':
          {
            // D-M-YYYY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        case '.':
          {
            // D.M.YYYY
            if (match[3] > 12 || match[1] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        case '/':
          {
            // M/D/YYYY
            if (match[1] > 12 || match[3] > 31) {
              return fail;
            }

            return new Date(match[5], parseInt(match[1], 10) - 1, match[3],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        }
      } else {
        switch (match[2]) {
        case '-':
          {
            // YY-M-D
            if (match[3] > 12 || match[5] > 31 || (match[1] < 70 && match[1] > 38)) {
              return fail;
            }

            year = match[1] >= 0 && match[1] <= 38 ? +match[1] + 2000 : match[1];
            return new Date(year, parseInt(match[3], 10) - 1, match[5],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        case '.':
          {
            // D.M.YY or H.MM.SS
            if (match[5] >= 70) {
              // D.M.YY
              if (match[3] > 12 || match[1] > 31) {
                return fail;
              }

              return new Date(match[5], parseInt(match[3], 10) - 1, match[1],
                match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
            }
            if (match[5] < 60 && !match[6]) {
              // H.MM.SS
              if (match[1] > 23 || match[3] > 59) {
                return fail;
              }

              today = new Date();
              return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
                match[1] || 0, match[3] || 0, match[5] || 0, match[9] || 0) / 1000;
            }

            // invalid format, cannot be parsed
            return fail;
          }
        case '/':
          {
            // M/D/YY
            if (match[1] > 12 || match[3] > 31 || (match[5] < 70 && match[5] > 38)) {
              return fail;
            }

            year = match[5] >= 0 && match[5] <= 38 ? +match[5] + 2000 : match[5];
            return new Date(year, parseInt(match[1], 10) - 1, match[3],
              match[6] || 0, match[7] || 0, match[8] || 0, match[9] || 0) / 1000;
          }
        case ':':
          {
            // HH:MM:SS
            if (match[1] > 23 || match[3] > 59 || match[5] > 59) {
              return fail;
            }

            today = new Date();
            return new Date(today.getFullYear(), today.getMonth(), today.getDate(),
              match[1] || 0, match[3] || 0, match[5] || 0) / 1000;
          }
        }
      }
    }

    // other formats and "now" should be parsed by Date.parse()
    if (text === 'now') {
      return now === null || isNaN(now) ? new Date()
        .getTime() / 1000 | 0 : now | 0;
    }
    if (!isNaN(parsed = Date.parse(text))) {
      return parsed / 1000 | 0;
    }

    date = now ? new Date(now * 1000) : new Date();
    days = {
      'sun': 0,
      'mon': 1,
      'tue': 2,
      'wed': 3,
      'thu': 4,
      'fri': 5,
      'sat': 6
    };
    ranges = {
      'yea': 'FullYear',
      'mon': 'Month',
      'day': 'Date',
      'hou': 'Hours',
      'min': 'Minutes',
      'sec': 'Seconds'
    };

    function lastNext(type, range, modifier) {
      var diff, day = days[range];

      if (typeof day !== 'undefined') {
        diff = day - date.getDay();

        if (diff === 0) {
          diff = 7 * modifier;
        } else if (diff > 0 && type === 'last') {
          diff -= 7;
        } else if (diff < 0 && type === 'next') {
          diff += 7;
        }

        date.setDate(date.getDate() + diff);
      }
    }

    function process(val) {
      var splt = val.split(' '), // Todo: Reconcile this with regex using \s, taking into account browser issues with split and regexes
        type = splt[0],
        range = splt[1].substring(0, 3),
        typeIsNumber = /\d+/.test(type),
        ago = splt[2] === 'ago',
        num = (type === 'last' ? -1 : 1) * (ago ? -1 : 1);

      if (typeIsNumber) {
        num *= parseInt(type, 10);
      }

      if (ranges.hasOwnProperty(range) && !splt[1].match(/^mon(day|\.)?$/i)) {
        return date['set' + ranges[range]](date['get' + ranges[range]]() + num);
      }

      if (range === 'wee') {
        return date.setDate(date.getDate() + (num * 7));
      }

      if (type === 'next' || type === 'last') {
        lastNext(type, range, num);
      } else if (!typeIsNumber) {
        return false;
      }

      return true;
    }

    times = '(years?|months?|weeks?|days?|hours?|minutes?|min|seconds?|sec' +
      '|sunday|sun\\.?|monday|mon\\.?|tuesday|tue\\.?|wednesday|wed\\.?' +
      '|thursday|thu\\.?|friday|fri\\.?|saturday|sat\\.?)';
    regex = '([+-]?\\d+\\s' + times + '|' + '(last|next)\\s' + times + ')(\\sago)?';

    match = text.match(new RegExp(regex, 'gi'));
    if (!match) {
      return fail;
    }

    for (i = 0, len = match.length; i < len; i++) {
      if (!process(match[i])) {
        return fail;
      }
    }

    // ECMAScript 5 only
    // if (!match.every(process))
    //    return false;

    return (date.getTime() / 1000);
  }

  var Validator = function(data, rules, customMessages) {
    this.data       = data;
    this.rules      = rules;
    this.messages   = {};
    this.errors     = {};

    extend({}, messages, customMessages || {});
  };

  Validator.prototype = {
    constructor: Validator,

    /**
     * exec validate
     *
     * @return {Boolean} 
     */
    passes: function() {
      rulesArray = this._explodeRules(this.rules);

      for (var attribute in rulesArray) {
         var rules = rulesArray[attribute];
        for (var i in rules) {
          var rule        = rules[i];
          var parsedRule  = this._parseRule(rule);
          var resover     = parsedRule.rule;
          var parameters  = parsedRule.parameters;
          var value       = this.data[attribute] || null;
          var validatable = this.resolvers[resover] == 'function';

          if (validatable && !this.resolvers[resover].call(this, attribute, value, parameters)) {
            this._addFailure(attribute, rule, parameters);
          }
        }
      }

      return !this.errors.length;
    },

    /**
     * return the validate value
     *
     * @return {Boolean} 
     */
    fails: function() {
      return !this.passes();
    },

    /**
     * explode the rules into an array of rules.
     *
     * @return {Void} 
     */
    _explodeRules: function(rules) {
      for (var i in rules) {
        if (typeof rules[i] == 'string') {
          rules[i] = rules[i].split('|');
        }
      }

      return rules;
    },

    /**
     * parse the rule
     *
     * @param {Array} rule 
     *
     * @return {Object} 
     */
    _parseRule: function (rule) {
      var parameters = [];

      // The format for specifying validation rules and parameters follows an
      // easy {rule}:{parameters} formatting convention. For instance the
      // rule "Max:3" states that the value may only be three letters.
      if (rule.indexOf(':')) {
        ruleInfo  = rule.split(':');
        rule      = ruleInfo[0];
        parameter = ruleInfo[1];

        parameters = this._parseParameters(rule, parameter);
      }

      return { parameters: parameters, rule: rule};
    },

    /**
     * parse parameters of rule
     *
     * @param {String} rule      
     * @param {String} parameter
     *
     * @return {Array} 
     */
    _parseParameters: function(rule, parameter)
    {
      if (rule.toLowerCase() == 'regex') return [parameter];
      if (typeof parameter === 'string') {
        return parameter.split(',');
      };

      return [];
    },

    /**
     * add a failure rule
     *
     * @param {String} attribute  
     * @param {String} rule       
     * @param {Array}  parameters 
     */
    _addFailure: function(attribute, rule, parameters) {
      _addError(attribute, rule, parameters);
      result.failedRules[attribute] || (result.failedRules[attribute] = {});
      result.failedRules[attribute][rule] = parameters;
    },

    /**
     * add a error message
     *
     * @param {String} attribute  
     * @param {String} rule       
     * @param {Array}  parameters 
     */
    _addError: function(attribute, rule, parameters) {
      message = _getMessage(attribute, rule);

      //message = doReplacements(message, attribute, rule, parameters);
      //message = attribute + ' error';
      var msg = {};
          msg[attribute] = message;

      result.messages.push(msg);
    },

    /**
     * get value of arrtibute
     *
     * @param {String} attribute 
     *
     * @return {Mixed} 
     */
    _getValue: function(attribute) {
      return this.data[attribute];
    },

    /**
     * get attribute message
     *
     * @param {String} attribute 
     * @param {String} rule      
     *
     * @return {String} 
     */
    _getMessage: function(attribute, rule) {
      return attribute + ' - ' + rule + " error";
    },


    resolvers : {

      /**
       * determine if the given attribute has a rule in the given set.
       *
       * @param {String}       attribute
       * @param {String|array} rules
       * 
       * @return {Boolean}
       */
      _hasRule: function(attribute, rules)
      {
        return ! this._getRule(attribute, rules) == null;
      },

      /**
       * get rule and parameters of a rules
       *
       * @param {String}       attribute
       * @param {String|array} rules
       * 
       * @return {Array|null}
       */
      _getRule: function(attribute, rules)
      {
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
      },

      /**
       * get attribute size
       *
       * @param {String}  attribute
       * @param {Mixed}   value
       * 
       * @return {Number}
       */
      _getSize: function(attribute, value)
      {
        hasNumeric = this._hasRule(attribute, numericRules);

        // This method will determine if the attribute is a number, string, or file and
        // return the proper size accordingly. If it is a number, then number itself
        // is the size. If it is a file, we take kilobytes, and for a string the
        // entire length of the string will be considered the attribute size.
        if (/^[0-9]+$/.test(value) && hasNumeric) {
          return getValue(attribute);
        } else if (typeof value === 'array' || typeof value === 'string') {
          return value.length;
        } 

        return 0;
      },

      /**
       * check parameters count 
       *
       * @param {Number} count      
       * @param {Array}  parameters 
       * @param {String} rule
       *
       * @return {Void}
       */
      _requireParameterCount: function(count, parameters, rule) {
        if (parameters.length < count) {
          throw Error('Validation rule"' + rule + '" requires at least ' + count + ' parameters.');
        }
      },

      /**
       * all failing check
       *
       * @param {Array} attributes
       * 
       * @return {Boolean}
       */
      _allFailingRequired: function(attributes)
      {
        for (var i in attributes) {
          var akey = attributes[i];

          if (validateRequired(key, _getValue(key))) {
            return false;
          }
        }

        return true;
      },

      /**
       * determine if any of the given attributes fail the required test.
       *
       * @param  array  $attributes
       * @return bool
       */
      _anyFailingRequired: function(attributes) {
        for (var i in attributes) {
          var key = attributes[i];
          if ( ! this.validateRequired(key, this.date[key])) {
            return true;
          }
        }

        return false;
      },

      accepted: function(attribute, value) {
        var acceptable = ['yes', 'on', '1', 1, true, 'true'];

        return (validateRequired(attribute, value) && in_array(value, acceptable, true));
      },

      after: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'after');
        // not a Date instance 
        if ( ! (date = strtotime(parameters[0]))) {
          return strtotime(value) > strtotime(getValue(parameters[0]));
        } else {
          return strtotime(value) > date;
        }
      },

      before: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'before');
        // not a Date instance 
        if ( ! (date = strtotime(parameters[0]))) {
          return strtotime(value) < strtotime(getValue(parameters[0]));
        } else {
          return strtotime(value) < date;
        }
      },

      alpha: function(attribute, value) {
        return (new RegExp('^[a-z]+$', 'i')).test(value);
      },
      
      alpha_dash: function(attribute, value) {
        return (new RegExp('^[a-z0-9\-_]+$', 'i')).test(value);
      },
      
      alpha_num: function(attribute, value) {
        return (new RegExp('^[a-z0-9]+$', 'i')).test(value);
      },
      
      array: function(attribute, value) {
        return typeof value === 'array';
      },
      
      between: function(attribute, value, parameters) {
        this._requireParameterCount(2, parameters, 'between');

        var size = _getSize(attribute, value);

        return size >= parameters[0] && size <= parameters[1];
      },
      
      confirmed: function(attribute, value, parameters) {
        return validateSame(attribute, value, [attribute + '_confirmation']);
      },

      same: function(attribute, value, parameters)
      {
        this._requireParameterCount(1, parameters, 'same');

        var other = getValue(parameters[0]);

        return (other && value == other);
      },

      different: function(attribute, value, parameters) {
        return ! validateSame(attribute, value, parameters);
      },

      date: function(attribute, value) {
        if (value instanceof Date) return true;

        if (strtotime(value) === false) return false;

        date = new Date(value);

        return (isFinite(value) && typeof date === 'object');
      },
      
      digits: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'digits');

        return (new RegExp('^\d{' + Math.abs(parameters[0]) + '}$').test(value))
      },
      
      digits_between: function(attribute, value, parameters) {
        this._requireParameterCount(2, parameters, 'digits_between');
        
        return (new RegExp('^\d{' + Math.abs(parameters[0]) + '}$').test(value) 
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
        return ipv4Maybe.test(value) || ipv6.test(value);;
      },

      max: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'max');

        return this._getSize(attribute, value) <= parameters[0];
      },

      min: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'min');

        return _getSize(attribute, value) >= parameters[0];
      },
     
      numeric: function(attribute, value) {
        return /^[0-9]+$/.test(value);
      },
     
      regex: function() {
        this._requireParameterCount(1, parameters, 'regex');

        return (new RegExp(parameters[0])).test(value);
      },
      
      required: function(attribute, value) {
        if (typeof value == undefined) {
          return false;
        } else if ((typeof value == 'string' || typeof value == 'array' || typeof value == 'object') && !value.length) {
          return false;
        } 

        return true;
      },

      required_if: function(attribute, value, parameters) {
        this._requireParameterCount(2, parameters, 'required_if');

        var data = getValue(parameters[0]);

        var values = parameters.splice(1);

        if (in_array(data, values)) {
          return this.validateRequired(attribute, value);
        }

        return true;
      },
      
      required_with: function(attribute, value, parameters) {
        if ( ! this._allFailingRequired(parameters)) {
          return this.validateRequired(attribute, value);
        }

        return true;
      },
     
      required_without: function(attribute, value, parameters) {
        if (anyFailingRequired(parameters)) {
          return this.validateRequired(attribute, value);
        }

        return true;
      },
      
      size: function(attribute, value, parameters) {
        this._requireParameterCount(1, parameters, 'size');

        return this._getSize(attribute, value) == parameters[0];
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
    }
  };

  // register new resolver
  Validator.register = function(rule, fn, errMsg) {
    this.prototype.resolvers[rule] = fn;
    messages[rule] = (typeof errMsg === 'string') ? errMsg : messages['def'];
  };
  // validator.make(data,rules,messages);
  Validator.make = Validator.constructor;

  if (typeof module !== 'undefined' && typeof require !== 'undefined') {
    module.exports = Validator;
  } else {
    window.Validator = Validator;
  }

}());