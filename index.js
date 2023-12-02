const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://brandManager:TvQiQGqgE2kRaDIP@cluster0.gadig.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Brand server is running");
});

async function run() {
  try {
    await client.connect();

    const brandCollection = client.db("brandDB").collection("brands");
    const productCollection = client.db("brandDB").collection("products");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    // For Brand
    app.get("/brands", async (req, res) => {
      const cursor = brandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/brands/:name", async (req, res) => {
      const name = req.params.name;
      const query = { brand: name };
      const cursor = productCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // For Products
    app.get("/products/:id", async (req, res) => {
      const productId = req.params.id;
      const query = { _id: new ObjectId(productId) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const addedProduct = req.body;
      const result = await productCollection.insertOne(addedProduct);
      res.send(result);
    });
  } catch (err) {
    console.log(err.message);
  }
}
run();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
