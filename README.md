# rserv

Static server with auto reload

## Install

### Global
```sh
sudo npm install -g rserv
```

### Local
```sh
npm install --save-dev rserv
```

## Usage

### NPM

##### configure `package.json`
```json
"scripts": {
  "start": "node rserv"
}
```

#### start
```sh
npm run start
```

### Programmatic
```js
var rserv = require('rserv');

rserv({
  "root": "dest"
  "port": "8080"
  "socket": "1337"
});
```

### Command Line

```sh
rserv
```

## options
```
-root   root folder
-port   file server port
-socket web sockets port
```

##### defaults
```
-root   . (current directory)
-port   8080
-socket 1337
```

##### config via `package.json`
```json
"rserv": {
  "root": "dest"
  "port": "8080"
  "socket": "1337"
}
```