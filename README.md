mod-validator [![Build Status](https://travis-ci.org/joychao/mod-validator.png)](https://travis-ci.org/joychao/mod-validator)
============

一个类似laravel的js验证模块.

## 安装

```javascript
$ npm install mod-validator
```

## 基本用法
```javascript
var Validator = require("validator");
var rules = {
  username: 'required|min:5',
  password: 'required|confirmed|min:6|max:16',
}

var data = {
  username: 'test',
  password: '123456',
}

var v = Validator.make(data, rules); // 或者: var  v = new Validator(data, rules)

if(v.fails()) {
  console.log(v.messages());
  //or
  console.log(v.errors());
}
```

### 定义验证规则
  - "|" 分隔的字符串形式
  ```javascript
  var rules = {
    username: 'required|min:5',
    password: 'required|confirmed|min:6|max:16',
    email: 'email'
  }
  ```

  - 数组形式
  ```javascript
  var rules = {
    username: ['required', 'min:5'],
    password: ['required', ['confirmed'], ['min:6'], ['max:16'],
    email: ['required', 'email']
  }
  ```

### API
 - 获取验证结果
   + 语法：
     + `{Boolean}` Validator.passes() 是否通过
     + `{Boolean}` Validator.fails() 是否验证失败
   + 举例：
   ```javascript
    var rules = {
      username: 'required|min:5',
      password: 'required|confirmed|min:6|max:16',
    }

    var data = {
      username: 'test',
      password: '123456',
    }

    v = validator.make(data, rules);

    if (v.passes()) {
      // 如果全部通过验证
    } 
    // 或者
    if (v.fails()) {
      // 如果没通过验证
    } 
   ```

 - 自定义错误消息
   + 语法：`{Void}` Validator.mergeMessage(attribute [, message]) 
      - Validator.mergeMessage({attributeName, message})
      - Validator.mergeMessage('attributeName', 'message')
   + 属性替换：在消息字符串用使用`:attribute` 作为属性名占位符。
   + 举例：
    ```javascript
    var messages = {
       required: ':attribute 不能为空.',
       // ...
    }
    ...
    v = validator.make(data, rules);
    v.mergeMessage(messages);
    if(v.fails()) {
      console.log(v.errors());
    }

    //------------------------------------------

    v.mergeMessage({required: ':attribute 不能为空.'}) 
    //以上用法等同于：
    v.mergeMessage('required', ':attribute 不能为空.');
    ```


- 自定义属性别名
  + 语法：`{Void}` Validator.mergeAttribute(attribute [, alias]) 
    + Validator.mergeAttribute({attributeName, alias})
    + Validator.mergeAttribute('attributeName', 'alias')
  + 举例：

  ```javascript
  var attributes = {
     username: '用户名',
     password: '密码'
     //...
  }
  v = validator.make(data, rules);
  v.mergeAttribute(attributes);

  if(v.fails()) {
    console.log(v.messages());
  }

  //------------------------------------------

  v.mergeAttribute({username: '用户名'}) 
  // 以上等同于：
  v.mergeAttribute('username', '用户名');
  ```

###custom value alias
//TODO

#License

The MIT License (MIT)

Copyright (c) 2014 Joy <anzhengchao@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
