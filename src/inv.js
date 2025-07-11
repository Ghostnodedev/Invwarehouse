"use strict";
const { PrismaClient } = require('@prisma/client');

let prisma;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Allow', 'POST');
    res.end(JSON.stringify({ error: `Method ${req.method} not allowed` }));
    return;
  }

  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        awb: data.awb || null,
        quantity: data.quantity,
        price: data.price,
        tax: data.tax,
        subTotal: data.subTotal !== undefined ? data.subTotal : data.price * data.quantity,
        total: data.total !== undefined ? data.total : (data.price * data.quantity) + data.tax,
        merchant: data.merchant,
        sellerName: data.sellerName,
        sellerEmail: data.sellerEmail || null,
        sellerPhone: data.sellerPhone || null,
        warehouseName: data.warehouseName,
        warehouseAddr: data.warehouseAddr,
        warehouseLat: data.warehouseLat,
        warehouseLng: data.warehouseLng,
      }
    });

    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Product created', product }));
  } catch (err) {
    console.error('Error creating product:', err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Failed to create product' }));
  }
};


module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Allow', 'GET');
    return res.end(JSON.stringify({ error: `Method ${req.method} not allowed` }));
  }

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(products));
  } catch (error) {
    console.error('Error fetching products:', error);
    res.statusCode = 500;
    return res.end(JSON.stringify({ error: 'Failed to fetch products' }));
  }
};
