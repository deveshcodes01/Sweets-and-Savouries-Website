import mongoose from 'mongoose';
import Product from '../models/Product.js';

function requireDatabase(res) {
  if (mongoose.connection.readyState === 1) return true;
  res.status(503).json({ message: 'Product catalogue is unavailable because the database is not connected.' });
  return false;
}

export async function getProducts(req, res, next) {
  if (!requireDatabase(res)) return;
  try {
    const products = await Product.find({ available: true }).sort({ name: 1 }).lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  if (!requireDatabase(res)) return;
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ message: 'Invalid product id.' });
  }
  try {
    const product = await Product.findOne({ _id: req.params.id, available: true }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found.' });
    res.json(product);
  } catch (error) {
    next(error);
  }
}

export async function getCategory(req, res, next) {
  if (!requireDatabase(res)) return;
  try {
    const category = String(req.params.category).trim();
    const products = await Product.find({ category, available: true }).sort({ name: 1 }).lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
}
