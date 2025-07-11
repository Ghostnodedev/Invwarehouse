"use strict"
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Only POST allowed' }));
    return;
  }
  
  let body = '';
  for await (const chunk of req) {
    body += chunk;
  }
  
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    res.statusCode = 400;
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }
  
  console.log('Received:', data);

  try {
    const product = await prisma.product.create({ data });
    res.statusCode = 201;
    res.end(JSON.stringify({ product }));
  } catch (error) {
    console.error('DB Error:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error.message }));
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

