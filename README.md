mod-validator [Development in progress！！！！]
============

a js validation module inspired by laravel validation.

#Usage

```javascript
$ npm install mod-validator
```

# Basic
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

  if(v.fails()) {
    console.log(v.messages);
  }
```

# custom
- ## custom message

```
var messages = {
   required: ':attribute 不能为空.',
   // ...
}
...
v = validator.make(data, rules);
v.mergeMessage(messages);
if(v.fails()) {
  console.log(v.messages);
}

//------------------------------------------

v.mergeMessage({required: ':attribute 不能为空.'}) == v.mergeMessage('required', ':attribute 不能为空.');
```

```

- ## custom attribute alias

```javascript
var attributes = {
   username: '用户名',
   password: '密码'
   //...
}
v = validator.make(data, rules);
v.mergeAttribute(messages);
if(v.fails()) {
  console.log(v.messages);
}

//------------------------------------------

v.mergeAttribute({username: '用户名'}) == v.mergeAttribute('username', '用户名');
```

- ## custom value alias
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
