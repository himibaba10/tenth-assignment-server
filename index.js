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
    const cartCollection = client.db("brandDB").collection("cart");

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

    app.get("/products/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
    });

    app.post("/products", async (req, res) => {
      const addedProduct = req.body;
      const result = await productCollection.insertOne(addedProduct);
      res.send(result);
    });

    app.put("/product/update/:id", async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const query = { _id: new ObjectId(id) };

      const updateProduct = {
        $set: product,
      };

      const result = await productCollection.updateOne(query, updateProduct);

      res.send(result);
    });

    // For cart
    app.get("/:email", async (req, res) => {
      const email = req.params.email;

      const query = { email: email };
      const cursor = cartCollection.find(query);
      const result = await cursor.toArray();

      res.send(result);
    });

    app.post("/cart", async (req, res) => {
      const newProduct = req.body;
      const result = await cartCollection.insertOne(newProduct);
      res.send(result);
    });

    app.delete("/delete-product/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);

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
