const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/wikiDB");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const articleSchema = new mongoose.Schema ({
  title: String,
  content: String,

});

const Article = mongoose.model("Article", articleSchema);

const article = new Article ({
  title: "Test article",
  content: "This is a testing purpose article",
});

/*article.save(function(err, results) {
  if (err) {
    console.log(err);
  }
  else {
    console.log("Data has been successfully inserted on DB!");
  }
});*/

app.route("/articles")
.get(function(req, res) {
  Article.find(function(err, foundArticles) {
    if (!err) {
    res.send(foundArticles);
  } else {
    res.send(err);
  }
  });

})
.post(function(req, res) {
  console.log(req.body.title); /*Testar se o POST da API esta funcionando - deletar*/
  console.log(req.body.content); /*Testar se o POST da API esta funcionando - deletar*/

  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save(function (err) {
    if (!err) {
      res.send("Successfully added: "+req.body.title);
    } else {
      res.send(err);
    }
  });

})
.delete( function(req, res) {
  Article.deleteMany(function(err) {
    if (!err) {
      res.send("Successfully deleted all articles");
    } else {
      res.send(err);
    }
  });
});

app.route("/articles/:articleTitle")
.get(function(req, res) {

  Article.findOne({title: req.params.articleTitle}, function(err, foundArticle) {
    if (foundArticle) {
      res.send(foundArticle);
    } else {
      res.send("No articles matching that title was found!");
    }
  });

})
.post(function(req, res) {

})
.delete(function(req, res) {
  Article.deleteOne(
    {title: req.params.articleTitle},
    function(err) {
      if (!err) {
        res.send("Successfully deleted article: "+req.params.articleTitle);
      } else {
        res.send("An error has ocurred: "+err);
      };
    });
})
.put(function(req, res) {
  Article.replaceOne(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content},
    function(err) {
      if(!err){
      res.send("Successfully updated article.");
    };
  });
})
.patch(function(req, res) {
  Article.update(
    {title: req.params.articleTitle},
    req.body, function(err, response) {
      if (!err) {
        res.send("Article: " + req.params.articleTitle+" has been updated.")
      } else {
        res.send("The following error has ocurred: "+err);
      };
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
