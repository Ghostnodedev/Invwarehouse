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
        const blob = "https://7gjoygkjk57uf9qc.public.blob.vercel-storage.com/pro.json.txt";
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

const pushdata = async(req,res)=>{
    const data = req.body;
    if (!data || !Array.isArray(data)) {
        return res.status(400).json({error: "Invalid data format"});
    }
    console.log(data)
     const jsonString = JSON.stringify(data, null, 2);
     try {
        const blob = "pro.json.txt"
        const {url} = await put(blob, jsonString, {
            access: 'public',
        })
    console.log("Data pushed to blob successfully!");
    console.log("Blob URL:", url);
     } catch (error) {
        console.error("Error pushing data to blob:", error);
        return res.status(500).json({error: "Failed to push data to blob"});
     }
}
module.exports = pushdata;