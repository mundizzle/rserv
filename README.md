# rserv

Minimal static file server with automating browser reload

## Install

### Global
```sh
sudo npm i -g rserv
```

### Local
```sh
npm i rserv --save-dev
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

### Node
```js
var rserv = require('rserv');

rserv({
  root: 'dest',
  port: '8080'
});
```

### Command Line (Must be installed gobally)

```sh
rserv
```

## Options

```
rserv --help


Usage: rserv [options]

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -p, --port [type]  port [3000]
  -r, --root [type]  root directory [.] (current directory)

```


