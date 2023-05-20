//server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

class PriorityQueue {
    constructor() {
        this.collection = [];
    }

    enqueue(element) {
        if (this.isEmpty()) {
            this.collection.push(element);
        } else {
            let added = false;
            for (let i = 1; i <= this.collection.length; i++) {
                if (element[1] < this.collection[i - 1][1]) {
                    this.collection.splice(i - 1, 0, element);
                    added = true;
                    break;
                }
            }
            if (!added) {
                this.collection.push(element);
            }
        }
    };

    isEmpty() {
        return (this.collection.length === 0)
    };
}

const lostAndFoundQueue = new PriorityQueue();

// Enable CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route to add an item
// Route to add an item
app.post('/addItem', (req, res) => {
    console.log(req.body); // Let's print out the body we received
    const { item, priority } = req.body;

    // Add item to queue with priority
    lostAndFoundQueue.enqueue([item, priority]);

    // Write to JSON file
    fs.writeFile('items.json', JSON.stringify(lostAndFoundQueue.collection, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error writing file' });
        }

        res.status(200).json({ message: 'Item added successfully' });
    });
});



// Route to get all items
app.get('/items', (req, res) => {
    res.status(200).json(lostAndFoundQueue.collection);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
