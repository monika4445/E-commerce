const { Order } = require("../models");
const { CartItem } = require("../models");
const { Product } = require("../models");
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(stripeSecretKey);

async function createOrder(req, res) {
  try {
    const { cartId, total, products } = req.body;

    const order = await Order.create({
      cartId,
      total,
      products,
    });

    const cartItems = await CartItem.findAll({
      where: { productId: products.map((p) => p.productId) },
    });

    for (const cartItem of cartItems) {
      const matchingProduct = await Product.findByPk(cartItem.productId);
      const { quantity } = cartItem;

      let updatedQuantity = matchingProduct.quantity - quantity;

      if (updatedQuantity < 0) {
        updatedQuantity = 0;
      }

      await Product.update(
        { quantity: updatedQuantity },
        { where: { id: matchingProduct.id } }
      );
    }

    await CartItem.destroy({ where: { cartId } });

    res.status(201).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await Order.findAll({ include: { all: true, nested: true }});
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getOrderById(req, res) {
  const { id } = req.params;
  try {
    const order = await Order.findOne({ where: { cartId: id } });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function orederPayment(req, res) {
  const { token, cartId, products } = req.body;

  try {
    const cartItems = await CartItem.findAll({
      where: { productId: products.map((p) => p.productId) },
      include: Product,
    });

    const total = cartItems.reduce((acc, item) => acc + item.Product.price, 0);

    stripe.customers
      .create({
        email: token.email,
        source: token.id,
      })
      .then((customer) =>
        stripe.charges.create({
          amount: total * 100,
          currency: "usd",
          customer: customer.id,
        })
      )
      .then(async (res) => {
        await CartItem.destroy({ where: { cartId } });
      });
    await Order.create({
      cartId,
      total,
      products,
    });

    for (const cartItem of cartItems) {
      const matchingProduct = await Product.findByPk(cartItem.productId);
      const { quantity } = cartItem;

      let updatedQuantity = matchingProduct.quantity - quantity;

      if (updatedQuantity < 1) {
        updatedQuantity = 0;
      }

      await Product.update(
        { quantity: updatedQuantity },
        { where: { id: matchingProduct.id } }
      );
    }
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  orederPayment,
};
