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

  // Check missing or null/undefined
  const missing = requiredFields.filter(
    (f) => data[f] === undefined || data[f] === null
  );
  if (missing.length) {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: "Missing fields", missing }));
    return;
  }

  // Validate types
  if (
    typeof data.name !== "string" ||
    typeof data.sku !== "string" ||
    typeof data.price !== "number" ||
    typeof data.tax !== "number" ||
    typeof data.quantity !== "number" ||
    typeof data.merchant !== "string" ||
    typeof data.sellerName !== "string" ||
    typeof data.warehouseName !== "string" ||
    typeof data.warehouseAddr !== "string" ||
    typeof data.warehouseLat !== "number" ||
    typeof data.warehouseLng !== "number"
  ) {
    res.statusCode = 400;
    res.end(
      JSON.stringify({
        error:
          "Invalid field types. Check that quantity, price, tax, lat, lng are numbers and others are strings.",
      })
    );
    return;
  }

  // Calculate subtotal and total
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


const createapi = async(req,res)=>{
    const store = []
    const body = req.body
    console.log(body)
    if (!body.id || !body.sku || !body.units || !body.cost || !body.supplier || !body.lat || !body.lng){
        console.warn("please fill all the feilds")
        return{
            res: res.status(400).json({error: "Please fill all the fields"}),
        }
    }
    store.push(body)
    console.log(store)
    return res.status(200).json({
        message: "Data received successfully",
        data: store
    })
} 
module.exports = createapi

