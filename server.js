var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var multer = require('multer');
var fs = require('fs');
const { Console } = require('console');
const UPLOAD_FOLDER = __dirname + "/uploads";

// configuration =================

mongoose.connect('mongodb://localhost:27017/kahndb', { useNewUrlParser: true })     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
const output = fs.createWriteStream(__dirname + '/stdout.log');
const errorOutput = fs.createWriteStream(__dirname + '/stderr.log');
const logger = new Console(output, errorOutput);

var Todo = mongoose.model('Todo', {
	text : String,
	done: false
});
var Image = mongoose.model('Image', {
	data: String,
	contentType: String,
	portrait: Boolean
});

const multerConfig = {
	storage: multer.diskStorage({
	//Setup where the user's file will go
		destination: function(req, file, next){
			next(null, UPLOAD_FOLDER + "/images");
		},   
    
    //Then give the file a unique name
		filename: function(req, file, next){
			console.log("test", file);
			const ext = file.mimetype.split('/')[1];
			next(null, file.fieldname + '-' + Date.now() + '.'+ext);
		}
    }),   
    
    //A means of ensuring only images are uploaded. 
    fileFilter: function(req, file, next){
        if(!file)
			next();
        const image = file.mimetype.startsWith('image/');
        if (image) {
			console.log('Picture uploaded');
			next(null, true);
        } else {
			console.log("File not supported");
			return next();
        }
    }
};

app.get('/api/todos', function(req, res) {
	Todo.find(function(err, todos) {
		if (err)
			res.send(err)

		res.json(todos); // return all todos in JSON format
	});
});

app.post('/api/todos', function(req, res) {
	Todo.create({
		text : req.body.text,
		done : false
	}, function(err, todo) {
		if (err)
			res.send(err);

		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});

});

app.delete('/api/todos/:todo_id', function(req, res) {
	Todo.remove({
		_id : req.params.todo_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		Todo.find(function(err, todos) {
			if (err)
				res.send(err)
			res.json(todos);
		});
	});
});

app.get('/api/image', function(req, res) {
	Image.find(function(err, images) {
		if (err)
			res.send(err)

		res.json(images);
	});
});

app.post('/api/image', multer(multerConfig).single('image'), function(req, res) {
	console.log(req.file);
	var b64 = Buffer.from(fs.readFileSync(req.file.path)).toString('base64');
	var isPortrait = false;
	Image.create({
		data: b64,
		contentType: req.file.mimetype,
		portrait: isPortrait
	}, function(err, img) {
		if (err)
			res.send(err);
		console.log("Uploaded");
		res.redirect('/#!/gallery?success');
	});
});

app.delete('/api/image/:image_id', function(req, res) {
	Image.remove({
		_id : req.params.image_id
	}, function(err, todo) {
		if (err)
			res.send(err);

		Image.find(function(err, images) {
			if (err)
				res.send(err)
			res.json(images);
		});
	});
});

app.get('*', function(req, res) {
	res.sendFile('./public/index.html', {root: __dirname}); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("Server run with success");