"use strict";

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const server = express();
server.use(cors());

server.use(express.json());

const PORT = process.env.PORT;
// Mongoos
const mongoose = require("mongoose");
let BooksModel;
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);

  const BookSchema = new mongoose.Schema({
    title: String,
    desciption: String,
    status: String,
    clientEmail: String,
    imgURL: String,
  });

  BooksModel = mongoose.model("Books", BookSchema);

  // seadData();
}

async function seadData() {
  const book1 = new BooksModel({
    title: "Practical C++ Programming",
    desciption:
      "Teaches the programming language, covering topics including syntax, coding standards, object classes, templates, debugging, and the C++ preprocessor.",
    status: "not-completed",
    clientEmail: "bashar.damen97@gmail.com",
    imgURL:
      "https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1174502526l/408437._SX318_.jpg",
  });
  const book2 = new BooksModel({
    title: "Data Science Programming All-in-One For Dummies",
    desciption:
      "This friendly guide charts a path through the fundamentals of data science and then delves into the actual work: linear regression, logical regression, machine learning, neural networks, recommender engines, and cross-validation of models.",
    status: "done",
    clientEmail: "bashar.damen97@gmail.com",
    imgURL:
      "https://images-na.ssl-images-amazon.com/images/I/51fG813TY+L._SX397_BO1,204,203,200_.jpg",
  });
  const book3 = new BooksModel({
    title: "Lean UX: Applying Lean Principles to Improve User Experience",
    desciption: "This book shows you how to use Lean UX on your own projects.",
    status: "done",
    clientEmail: "bashar.damen97@gmail.com",
    imgURL: "https://images-na.ssl-images-amazon.com/images/I/61oZN95sgkL.jpg",
  });
  const book4 = new BooksModel({
    title:
      "The Joy of UX: User Experience and Interactive Design for Developers",
    desciption:
      "The Joy of UX shows you how, with plenty of concrete examples. Firmly grounded in reality, this guide will help you optimize usability and engagement while also coping with difficult technical, schedule, and budget constraints.",
    status: "not-completed",
    clientEmail: "bashar.damen97@gmail.com",
    imgURL:
      "https://images-na.ssl-images-amazon.com/images/I/41xVnZ97W4L._SX258_BO1,204,203,200_.jpg",
  });

  await book1.save();
  await book2.save();
  await book3.save();
  await book4.save();
}

/* ===================================Routs=====================================*/
server.get("/", homeRedirect);

server.get("/books", myBooksRedirector);
server.post("/addBook", addBookHandler);
server.delete('/deletBook/:id', deleteBookHandler )
server.put('/updateBook/:id', updateBookHandler)
/* ================================Functions===================================*/
function homeRedirect(req, res) {
  res.send("Welcome Home");
}

function myBooksRedirector(req, res) {
  const email = req.query.email;
  BooksModel.find({ clientEmail: email }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

async function addBookHandler(req, res) {
  console.log(req.body);
  // bookTitle: 'asd',
  // bookDescription: 'asd',
  // bookStatus: 'In Progress',
  // ownerEmail: 'bashar.damen97@gmail.com'
  
  const { bookTitle, bookDescription, bookStatus, clientEmail } = req.body;

  await BooksModel.create({
    title : bookTitle,
    desciption : bookDescription,
    status: bookStatus,
    clientEmail : clientEmail,
  })

  BooksModel.find({ clientEmail: clientEmail }, (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.send(result);
    }
  });
}

function deleteBookHandler (req, res){
  const bookId = req.params.id;
  const email = req.query.email;
  BooksModel.deleteOne({_id: bookId}, (err,result)=>{
    BooksModel.find({clientEmail: email},(err, result)=>{
      if(err){
        console.log(err);
      }else{
        console.log(result);
        res.send(result);
      }
    })
  })
}

function updateBookHandler(req,res){
const id = req.params.id;
const { bookTitle, bookDescription, bookStatus, clientEmail } = req.body;

BooksModel.findByIdAndUpdate(id,{title: bookTitle, desciption:bookDescription, status:bookStatus}, (err,result)=>{
  BooksModel.find({clientEmail: clientEmail}, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.send(result)
    }
  })
})
}

server.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
