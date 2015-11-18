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
    var removedItem;
    this.items = this.items.filter(function(item) {
        if (item.id === id) {
            console.log('aca');
            removedItem = item;
        }

        return item.id !== id;
    });

    return removedItem;  
};

var storage = new Storage();
storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(req, res) {
    res.json(storage.items);
});

app.delete('/items/:id', jsonParser, function(req, res) {
    var id = req.params.id;
    if (!req.body) {
        return res.sendStatus(400);
    }

    var removedItem = storage.removeById(parseInt(id));
    if (!removedItem) {
        return res.sendStatus(404);
    }
    
    res.status(200).json(removedItem);
});

app.post('/items', jsonParser, function(req, res) {
    if (!req.body) {
        return res.sendStatus(400);
    }
    
    var item = storage.add(req.body.name);
    res.status(201).json(item);
    console.log('new item added: ' + req.body.name);
});


app.listen(process.env.PORT || 8080, function() {
    console.log('Server is running at port 8080!');
});