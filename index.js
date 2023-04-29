const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());

// vercel domain: https://espresso-emporium-server.vercel.app

// DB_USER=jkrBookShop
// DB_PASS=eqWC50TP9rkUxKUB


// -----> mongodb uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.imt29d6.mongodb.net/?retryWrites=true&w=majority`;
// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.iea9q.mongodb.net/?retryWrites=true&w=majority`
const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// mongo compass uri
// const uri = 'mongodb://0.0.0.0:27017/'
// const client = new MongoClient(uri);

async function run() {
  try {
    const coffeeCollection = client.db("espressoEmporium").collection("coffee");

    // add a coffee
    app.post("/coffee", async (req, res) => {
      const data = req.body;
      const result = await coffeeCollection.insertOne(data);
      res.send(result);
    });

    // view all coffee
    app.get("/coffee", async (req, res) => {
      const query = {};
      const cursor = coffeeCollection.find(query);
      const data = await cursor.toArray();
      res.send(data);
    });

    //view single coffee detail
    app.get("/coffee/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = await coffeeCollection.findOne(query);
      res.send(data);
    });

    //update single coffee
    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      console.log(data)
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          ... (data.name && { name: data.name }),
          ... (data.chef && { chef: data.chef }),
          ... (data.supplier && { supplier: data.supplier }),
          ... (data.taste && { taste: data.taste }),
          ... (data.category && { category: data.category }),
          ... (data.details && { details: data.details }),
          ... (data.image && { image: data.image })
        }
      }
      const result = await coffeeCollection.updateOne(query, updateDoc, options);
      res.json(result)
    })

    // Delete a single coffee
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeeCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // console.log(client)
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Espresso Emporium");
});

app.listen(port, () => {
  console.log("Listening to port", port);
});