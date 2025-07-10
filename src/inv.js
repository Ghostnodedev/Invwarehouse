"use strict"
const createapi = async(req,res)=>{
    const store = []
    const body = req.body
    console.log(body)
    if(body.id || body.sku || body.units || body.cost || body.supplier || body.lat && body.lng){
        console.warn("please fill all the feilds")
        return{
            res: res.status(400).json({error: "Please fill all the fields"}),
        }
    }
    store.push({body})
    console.log(store)
    return res.status(200).json({
        message: "Data received successfully",
        data: store
    })
} 
module.exports = createapi