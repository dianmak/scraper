# scraper

**Overview**

This app scrapes The Jakarta Post website for articles and enters them to a Mongo database. Users are able to save articles as well as save and delete comments on these saved articles. Lastly, users are able to delete all articles, both saved and unsaved.

Note to grader: I scraped each article's category instead of summary because The Jakarta Post does not display article summaries on its home page.

**How to Use**
URL: https://limitless-savannah-12468.herokuapp.com/
* Click "Scrape some articles!" to scrape articles from the home page of https://www.thejakartapost.com/ 
* Click "Save" to save an article.
* Click on the headline to go to the article link.
* Click on "Saved" tab in the nav bar to view saved articles.
* Click on "Comments" to open comments dialog box. 
    * Enter comment into text box, click "Save comment".
* Click on red "x" button to delete comments.
* To scrape for any new articles, simply click the "Scrape some articles!" button on the home page. 

**Technology Utilized**
* Front End
    * HTML
    * CSS
    * Bootstrap
    * Handlebars
* Logic
    * Javascript language (jQuery)
* Scraping
    * Cheerio
    * Axios
* Database
    * MongoDB
    * Mongoose ORM
    * mLab
* Server and routing
    * Express
* Deployment
    * Heroku
