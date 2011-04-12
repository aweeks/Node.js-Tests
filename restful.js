var http = require("http");
var events = require("events");
var querystring = require("querystring");

var HEADERS = {
  'Content-Type': 'text/html'
};

var HEAD = "<html>\n<body>";

var TAIL = "</body>\n</html>";

var FORM = '<form action="/" method="post">Key: <input type="text" name="key" /><br />Value: <input type="text" name="value" /><br /><input type="submit" value="Submit" /></form>';


var db = {'/foo': 'bar'};

function doRequest(request, response) {

    switch(request.method) {
        case 'HEAD':
            server.emit('head', request, response);
            break;
        case 'GET':
            server.emit('get', request, response);
            break;
        case 'POST':
            server.emit('post', request, response);
            break;
        case 'PUT':
            server.emit('put', request, response);
            break;
        case 'DELETE':
            server.emit('delete', request, response);
            break;
        case 'TRACE':
            server.emit('trace', request, response);
            break;
        case 'OPTIONS':
            server.emit('options', request, response);
            break;
        case 'PATCH':
            server.emit('patch', request, response);
            break;
        default:
            response.end();
            break;
    }
}

function doGet(request, response) {

    console.log("GET:" + request.url);
    console.log(db);

    if( request.url in db ) {
        response.writeHead( 200, HEADERS );
        response.write( HEAD + "<p>" + db[request.url] + "</p>" + FORM + TAIL );
        response.end();
    } else {
        response.writeHead( 200, HEADERS );
        response.write( HEAD + FORM + TAIL );
        response.end();
    }

}


function doPost(request, response) { 
    buffer = [];
    
    request.on('data', function (chunk) {
        buffer.push(chunk.toString('utf8'));
    });
    
    request.on('end', function() {
        var data = "";
        for( var n = 0; n<buffer.length; n++ ) {
            data = data + buffer[n];
        }
        var query = querystring.parse(data);

        db['/' + query.key] = query.value;
        
        response.writeHead(302, {'Location': '/' + query.key } );
        response.end();
    });

}


function doClose( errno ) {

}

var server = http.createServer(doRequest);
server.on('get', doGet);
server.on('post', doPost);
server.on('close', doClose);

server.listen(8000);

