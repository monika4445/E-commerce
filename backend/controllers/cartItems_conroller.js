const { CartItem } = require("../models");
const { Cart } = require("../models");
const { Product } = require("../models");
const { Image } = require("../models");

async function allCartItems(req, res) {
  try {
    const cartItems = await CartItem.findAll({
      include: [{ model: Cart }, { model: Product }],
    });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getCartItem(req, res) {
  const { id } = req.params;
  try {
    const cart = await Cart.findOne({ where: { userId: id } });
    if (cart) {
      const cartItems = await CartItem.findAll({
        where: { cartId: cart.id },
        include: {
          model: Product,
        },
      });

      for (const cartItem of cartItems) {
        const product = cartItem.Product;

        console.log(product.Image);
        if (product) {
          const image = await Image.findAll({
            where: { productId: product.id },
          });
          if (image) {
            product.dataValues.Image = image;
          }
        }
      }

      res.status(201).json({ cartItems });
    } else {
      res.status(404).json({ error: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function createCartAndCartItem(req, res) {
  const { userId, productId, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      cart = await Cart.create({ userId });
    }
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId },
    });
    if (!cartItem) {
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity,
      });
    } else {
      cartItem.quantity += quantity;
      await cartItem.save();
    }

    res.json({ cartItem });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteCartItem(req, res) {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findOne({ where: { productId: id } });
    console.log(cartItem);
    if (cartItem) {
      await CartItem.destroy({ where: { productId: id } });
      res.json({ message: "Cart item deleted successfully" });
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function incrementCartItem(req, res) {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findOne({ where: { productId: id } });
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.quantity > 0) {
      await CartItem.update(
        { quantity: cartItem.quantity + 1 },
        { where: { productId: id } }
      );
      const updatedCartItem = await CartItem.findOne({
        where: { productId: id },
      });
      console.log(updatedCartItem, "updatedCartItem");
      res.json({ cartItem: updatedCartItem });
    } else {
      res.json({ cartItem });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function decrementCartItem(req, res) {
  const { id } = req.params;
  try {
    const cartItem = await CartItem.findOne({ where: { productId: id } });
    if (!cartItem) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (cartItem.quantity > 1) {
      await CartItem.update(
        { quantity: cartItem.quantity - 1 },
        { where: { productId: id } }
      );
      const updatedCartItem = await CartItem.findOne({
        where: { productId: id },
      });
      console.log(updatedCartItem, "updatedCartItem");
      res.json({ cartItem: updatedCartItem });
    } else {
      res.json({ cartItem });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  allCartItems,
  getCartItem,
  deleteCartItem,
  createCartAndCartItem,
  incrementCartItem,
  decrementCartItem,
};
