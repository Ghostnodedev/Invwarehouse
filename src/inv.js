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

  // Read raw body
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

  console.log("Received data:", data);

  // Required fields
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

  // Check missing fields (null or undefined)
  const missing = requiredFields.filter(
    (f) => data[f] === undefined || data[f] === null
  );

  console.log("Missing fields:", missing);

  if (missing.length) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Missing fields", missing }));
    return;
  }

  // Calculate totals server-side
  const subTotal = data.price * data.quantity;
  const total = subTotal + data.tax;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        sku: data.sku,
        awb: data.awb || null,
        quantity: data.quantity,
        price: data.price,
        tax: data.tax,
        subTotal,
        total,
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
