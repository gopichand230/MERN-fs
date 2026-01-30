const express = require("express")
const router = express.Router()
const Cart = require("../models/Cart.js")
const Product = require("../models/Product.js")

// ✅ Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  const userId = req.query.userId || req.body.userId   // allow both query & body
  console.log("Authenticated user:", userId)
  if (!userId) {
    return res.status(401).json({ "message": "Unauthorized. Login first" })
  }
  req.userId = userId
  next()
}

// ✅ Get cart items
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate("items.product")
    if (!cart) {
      return res.status(200).json({ items: [] })
    }
    return res.status(200).json(cart)
  } catch (err) {
    console.log("error while fetching cart", err)
    return res.status(500).json({ "message": "Internal server error" })
  }
})

// ✅ Add item to cart
router.post("/add", isAuthenticated, async (req, res) => {
  const { productId, quantity } = req.body
  try {
    let cart = await Cart.findOne({ user: req.userId })
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [] })
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId)
    if (existingItem) {
      existingItem.quantity += quantity
      await cart.save()
      return res.status(200).json({ "message": "Cart updated successfully" })
    } else {
      const product = await Product.findById(productId)
      if (!product) {
        return res.status(404).json({ "message": "Product not found or out of stock" })
      }
      cart.items.push({ product: productId, quantity })
      await cart.save()
      return res.status(200).json({ "message": "Added successfully" })
    }
  } catch (err) {
    console.log("error while adding to cart", err)
    return res.status(500).json({ "message": "Internal server error while adding to cart" })
  }
})

// ✅ Delete item from cart
router.delete("/", isAuthenticated, async (req, res) => {
  const { productId } = req.body   // frontend sends productId in body
  try {
    let cart = await Cart.findOne({ user: req.userId })
    if (!cart) {
      return res.status(404).json({ "message": "Cart not found" })
    }

    // Remove the item
    const initialLength = cart.items.length
    cart.items = cart.items.filter((item) => item.product.toString() !== productId)

    if (cart.items.length === initialLength) {
      return res.status(404).json({ "message": "Item not found in cart" })
    }

    await cart.save()
    return res.status(200).json({ "message": "Item deleted successfully" })
  } catch (err) {
    console.log("error while deleting from cart", err)
    return res.status(500).json({ "message": "Internal server error while deleting from cart" })
  }
})

module.exports = router