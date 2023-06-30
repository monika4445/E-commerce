const express = require("express");
const cors = require("cors");
const { user_routes } = require("./routes/user");
const { product_routes } = require("./routes/product");

require("dotenv").config();
const path = require("path");

const app = express();
const PORT = process.env.PORT;

//const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
//const stripe = require("stripe")(stripeSecretKey);

app.use(express.json());
app.use(cors());
user_routes(app);
product_routes(app);


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
