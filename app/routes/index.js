var File = require('../models/file');

module.exports = function(app){
	// File =========================================================================
	// List file
    app.get('/api/file/:user', function(req, res) {
	    File.find({ "owner": req.params.user },function(err, files) {
            console.log(req.params);
            if (err)
                res.send(err);
            var result = { "result" : files };
            res.json(result);
        });

        
    });

    // Save file
    app.post('/api/file',function(req, res){
    	console.log('saving file');
    	// file information:
    	var file = new File();      // create a new instance of the Bear model
        file.name = req.body.name;
        file.size = req.body.size;
        file.type = req.body.type;
        file.date = req.body.date;
        // set the bears name (comes from the request)
        // save the bear and check for errors
        file.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message: file.id });
        });
    });

    // Delete file
    app.delete('/api/file/delete/:id',function(req, res){
        File.findById(req.params.id, function(err, file){
            return file.remove(function(err){
                if(!err){
                    res.json({message: "succeeded!"});
                } else {
                    console.log(err);
                    res.json(err);
                }
            });
        });
    });


    // File parts ==============================================================
    // xor 3 part to get 1 part and return to client
    app.post('/api/part',function(req, res){
        console.log('xor file');
        // set the bears name (comes from the request)
        // save the bear and check for errors
        var strArrs = Object.keys(req.body).map(function(k) { return o[k] });
        var xor = require('../external/xor');
        var encoded = xor.encode('abcd','1234');
        console.log('decoded: '+ encoded);
        var fourthpart = xor.decode(encoded,'qwer');
        console.log('fourthpart: '+ fourthpart);
        var decoded = xor.encode(fourthpart,'1234');
        console.log('decoded: '+ decoded);

    });



    // frontend routes =========================================================
    // route to handle all angular requests
    app.get('/', function(req, res) {
        res.sendfile('./public/index.html'); // load our public/index.html file
    });
};