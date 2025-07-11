"use strict";
const { PrismaClient } = require("@prisma/client");

let prisma;
if (!global.prisma) {
  global.prisma = new PrismaClient();
}
prisma = global.prisma;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Allow", "POST");
    res.end(JSON.stringify({ error: `Method ${req.method} not allowed` }));
    return;
  }

  // Read and parse JSON body
  let body = "";
  for await (const chunk of req) {
    body += chunk;
  }

  let data;
  try {
    data = JSON.parse(body);
  } catch (err) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Invalid JSON" }));
    return;
  }

  // Define required fields exactly as in your schema (excluding optional ones)
  const requiredFields = [
    "name",
    "sku",
    "quantity",
    "price",
    "tax",
    "merchant",
    "sellerName",
    "warehouseName",
    "warehouseAddr",
    "warehouseLat",
    "warehouseLng",
  ];

  // Check for missing fields (only undefined or null counts)
  const missing = requiredFields.filter(
    (field) => data[field] === undefined || data[field] === null
  );

  if (missing.length > 0) {
    console.warn("please fill all the fields", missing);
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Missing fields", missing }));
    return;
  }

  // Calculate subTotal and total
  const subTotal = data.price * data.quantity;
  const total = subTotal + data.tax;

  try {
    // Create product record in database
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        awb: data.awb || null,
        quantity: data.quantity,
        price: data.price,
        tax: data.tax,
        subTotal: subTotal,
        total: total,
        merchant: data.merchant,
        sellerName: data.sellerName,
        sellerEmail: data.sellerEmail || null,
        sellerPhone: data.sellerPhone || null,
        warehouseName: data.warehouseName,
        warehouseAddr: data.warehouseAddr,
        warehouseLat: data.warehouseLat,
        warehouseLng: data.warehouseLng,
      },
    });

    res.statusCode = 201;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Product created", product }));
  } catch (err) {
    console.error("Error creating product:", err);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "Failed to create product" }));
  }
};

const createapi = async (req, res) => {
  const store = [];
  const body = req.body;
  console.log(body);
  if (
    !body.id ||
    !body.sku ||
    !body.units ||
    !body.cost ||
    !body.supplier ||
    !body.lat ||
    !body.lng
  ) {
    console.warn("please fill all the feilds");
    return {
      res: res.status(400).json({ error: "Please fill all the fields" }),
    };
  }
  store.push(body);
  console.log(store);
  return res.status(200).json({
    message: "Data received successfully",
    data: store,
  });
};
module.exports = createapi;
