// server file set up based on HARCAM mongoose example 20
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

const exphbs = require("express-handlebars");


// Require all models
const db = require("./models");

const PORT = process.env.PORT || 3000;

// Initialize Express
const app = express();
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Routes

// A GET route for scraping the Jakarta Post website
app.get("/scrape", function (req, res) {
    scrape();
    // axios.get("https://www.thejakartapost.com/").then(function (response) {
    //     // Then, we load that into cheerio and save it to $ for a shorthand selector
    //     const $ = cheerio.load(response.data);

    //     $(".columnsNews").each((i, element) => {
    //         let result = {};
    //         result.title = $(element).find("h2.titleNews").text();
    //         result.link = $(element).find("a").attr("href");
    //         result.category = $(element).find(".date").children("span").text();

    //         let exists = false;

    //         db.Article.find({ title: result.title }).then(function (data) {
    //             if (result.link && result.category && !data.length) {
    //                 db.Article.create(result).then(dbArticle => {
    //                     console.log(dbArticle);
    //                 }).catch(err => console.log(err));
    //             }
    //         });
    //     });
    //     // res.send("Scrape complete.");
    // });

});

async function scrape() {
    // First, we grab the body of the html with axios
    await axios.get("https://www.thejakartapost.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        $(".columnsNews").each((i, element) => {
            let result = {};
            result.title = $(element).find("h2.titleNews").text();
            result.link = $(element).find("a").attr("href");
            result.category = $(element).find(".date").children("span").text();

            let exists = false;

            db.Article.find({ title: result.title }).then(function (data) {
                if (result.link && result.category && !data.length) {
                    db.Article.create(result).then(dbArticle => {
                        console.log(dbArticle);
                    }).catch(err => console.log(err));
                }
            });
        });
        // res.send("Scrape complete.");
        console.log("Finished");
    });
    res.redirect("/");
}


app.get("/", function (req, res) {
    db.Article.find({ saved: false }).then(function (articles) {
        res.render("index", { articles });
    });
});

app.delete("/delete", function (req, res) {
    db.Article.deleteMany({}).then(function (data) {
        console.log(data);
        res.render("index", data);
    });
});

app.put("/saveArticle/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true }).then(function (data) {
        console.log(data);
        res.send("Saved article.");
    });
});

app.get("/savedArticles", function (req, res) {
    db.Article.find({ saved: true }).then(function (articles) {
        res.render("saved", { articles });
    });
});

app.put("/removeFromSaved/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false }).then(function (data) {
        res.send("Removed from saved.");
    });
});

app.post("/saveComment/:id", function (req, res) {
    db.Note.create(req.body).then(function (dbNote) {
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
    }).then(function (dbArticle) {
        res.json(dbArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

app.get("/getComments/:id", function (req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("notes")
        .then(function (dbArticle) {
            res.json(dbArticle);
        }).catch(function (err) {
            res.json(err);
        });
});

app.delete("/deleteComment/:noteid", function (req, res) {
    db.Note.deleteOne({ _id: req.params.noteid }).then(function (data) {
        console.log(data);
        res.send("Deleted comment");
    })
});

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
