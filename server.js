const express = require("express")
const cors = require("cors")

const app = express()

app.use(cors())
app.use(express.json())

let users = []
let items = []

// register
app.post("/register",(req,res)=>{
const {name,email,password} = req.body

users.push({
id:Date.now(),
name,
email,
password
})

res.json({message:"user created"})
})

// login
app.post("/login",(req,res)=>{
const {email,password} = req.body

const user = users.find(u => u.email === email && u.password === password)

if(!user){
return res.status(401).json({message:"login failed"})
}

res.json(user)
})

// add item
app.post("/items",(req,res)=>{
const {title,description} = req.body

items.push({
id:Date.now(),
title,
description
})

res.json({message:"item added"})
})

// get items
app.get("/items",(req,res)=>{
res.json(items)
})

app.listen(3000,()=>{
console.log("Server running on http://localhost:3000")
})n