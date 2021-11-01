
const express    = require("express");
const bodyParser = require("body-parser");
const ejs        = require("ejs");
const mongoose   = require('mongoose');

const app   = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB");

const articleSchema = {
    title: String,
    content: String
};

const Article = new mongoose.model("Article", articleSchema);

//====================================================================== Req Target All Article

app.route("/articles")
    .get("/articles", function (req, res) {
        Article.find(function (err, element) {
            if (!err) {
                res.send(element);
            }
            else{
                res.send(err);
            }
        })
    })
    .post("/articles", function (req, res) {
        
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err){
                res.send("Successfully added a new article.");
            }
            else {
                res.send(err);
            }
        });
    })
    .delete("/articles", function (err, res) {
        Article.delete(function (err) {
            if (!err){
                res.send("Successfully deleted all articles");
            }
            else{
                res.send(err);
            }
        })
    });

//====================================================================== Req Target A Specific Article

app.route("/articles/:articleTitle")
    .get(function (req, res) {
        const title = req.params.articleTitle;
        Article.findOne({title: title}, function(err, element){
            if(!err){
                if(element){
                    res.send(element);
                }
                else{
                    res.send("Article not found!");
                }
            }
            else{
                res.send(err);
            }
        })        
    })
    .put(function (req, res){
        const title      = req.params.articleTitle;
        const newTitle   = req.body.title;
        const newContent = req.body.content;

        Article.update(
            {title: title},
            {
                title: newTitle,
                content: newContent
            },
            {overwrite: true},
            function (err){
                if (!err){
                    res.send("Successfully updated article.");
                }
                else {
                    res.send(err);
                }
            }
        )
    })
    .patch(function (req, res){
        const title      = req.params.articleTitle;

        Article.update(
            {title: title},
            {$set: req.body},
            function (err){
                if (!err){
                    res.send("Successfully updated article.");
                }
                else{
                    res.send(err);
                }
            }
        )
    })
    .delete(function (req, res) {
        const title      = req.params.articleTitle;

        Article.deleteOne(
            {title: title},
            function (err) {
                if (!err){
                    res.send("Successfully deleted article.");
                }
                else{
                    res.send(err);
                }
            }
        )
    });


app.listen(3000, function(){
    console.log("Server started on port 3000");
})