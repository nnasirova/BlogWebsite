 //jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const homeStartingContent1 = "Once a new technology rolls over you, if you're not part of the steamroller, you're part of the road.";
const homeStartingContent2="Stewart Brand, Writer";
const aboutContent = "Hi, I am Nigina. Several years ago, I decided to immerse myself into the world of information technology. Nowadays, technology is a drive for success for both individuals and businesses. In this blog, I share my journey into the IT world and write articles about new technologies that I learn along the way. You will find it all here: from software development and database administration to IT project management and delivery. I hope this information will inspire you to begin your new career in Information Technology.";
const contactContent = "Have ideas on improving my content? Share them with me!";

const app = express();

app.set('view engine', 'ejs');


app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://nigina:Test123@cluster0.vkau1.mongodb.net/blogDB", {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){

  Post.find({}, function(err, posts){
    res.render("home", {
      startingContent: homeStartingContent1,
      startingContent2: homeStartingContent2,
      posts: posts
      });
  });
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });


  post.save(function(err){
    if (!err){
        res.redirect("/");
    }
  });
});

app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server started successfully");
});
