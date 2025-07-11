"use strict"
const { put } = require('@vercel/blob');

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

const getblob = async(req,res)=>{
    try {
        const blob = process.env.BLOB;
            const request = {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch(blob, request);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return res.status(200).json({data: data})
    } catch (error) {
        console.error("Error fetching blob data:", error);
        return res.status(500).json({error: "Failed to fetch blob data"});
    }
}
module.exports =  getblob