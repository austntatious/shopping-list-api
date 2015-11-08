var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = function() {
    this.items = [];
    this.id = 0;
};

Storage.prototype.add = function(name) {
    var item = {name: name, id: this.id};
    this.items.push(item);
    this.id += 1;
    return item;
};

Storage.prototype.removeById = function(id) {
    //find id and delete from looping thru this.items array and delete obj
    var index = this.items.indexOf(this.id = id);
    var item = this.items.splice(index, 1);
    return item;
};  // DOES THIS WORK?!?!?!??!

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
    console.log('new item added: ' + req.body.name);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    var id = req.params.id;
    if (!req.body) {
        return res.sendStatus(400);
    }
    // search items array in storage object for id, if doesnt exist
    // return 404
    function findId(id) {
        var result = storage.items.filter(function(obj){
        return obj.id === id;
        });
        return result;
    }
    if (findId(id).length === 0) {
        return res.sendStatus(404);
    }
    
    var item = storage.removeById(id);
    res.status(201).json(item);
    console.log('item id:' + id + ' removed!');
    
});


app.listen(process.env.PORT || 8080, function() {
    console.log('Server is running at port 8080!');
});