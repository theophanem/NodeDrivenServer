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