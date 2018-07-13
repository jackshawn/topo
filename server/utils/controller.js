const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
function addMapping(router, mapping) {
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            let path = url.substring(4);
            router.get(path, mapping[url]);
            console.log(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            let path = url.substring(5);
            router.post(path, mapping[url]);
            console.log(`register URL mapping: POST ${path}`);
        } else if (url.startsWith('DELETE ')) {
            let path = url.substring(7);
            router.delete(path, mapping[url]);
            console.log(`register URL mapping: DELETE ${path}`);
        } else {
            console.log(`invalid URL: ${url}`);
        }
    }
}

function addControllers(router, dir) {
    var files = fs.readdirSync(dir);
    var js_files = files.filter((f) => {
        return f.endsWith('.js');
    });

    for (var f of js_files) {
        console.log(`process controller: ${f}...`);
        let mapping = require(dir + '/' + f);
        addMapping(router, mapping);
    }
}

module.exports = function (dir) {
    addControllers(router, path.resolve(__dirname, '../controllers'));
    return router.routes();
};
