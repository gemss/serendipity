const koa = require('koa');
const logger = require('koa-logger');
const KoaRouter = require('koa-router');
const serve = require('koa-static');
const parse = require('co-busboy');

var fs = require('fs');
var app = koa();
var os = require('os');
var path = require('path');

// log requests

var router = new KoaRouter();

app.use(logger())
    .use(router.routes())
    .use(router.allowedMethods());

// serve files from ./public
app.use(serve(__dirname + '/public'));


// handle uploads
router.post('/upload', function *() {
    // ignore non-POSTs
    if ('POST' != this.method) return;

    // the body isn't multipart, so busboy can't parse it
    if (!this.request.is('multipart/*')) return;

    // multipart upload
    var parts = parse(this);
    var part;

    while (part = yield parts) {
        var stream = fs.createWriteStream(path.join(__dirname, 'public', Math.random().toString()));
        part.pipe(stream);
        console.log('uploading %s -> %s', part.filename, stream.path);
    }

    // this.redirect('/');

    this.body = '{"code": "A00000"}';
});


router.get('/', function *() {
    // ignore non-POSTs
    if ('POST' != this.method) return yield next;

    // the body isn't multipart, so busboy can't parse it
    if (!this.request.is('multipart/*')) return yield next

    // multipart upload
    var parts = parse(this);
    var part;

    while (part = yield parts) {
        var stream = fs.createWriteStream(path.join(__dirname, 'public', Math.random().toString()));
        part.pipe(stream);
        console.log('uploading %s -> %s', part.filename, stream.path);
    }

    // this.redirect('/');

    this.body = '{"code": "A00000"}';
});

// listen

app.listen(3000);
console.log('listening on port 3000');