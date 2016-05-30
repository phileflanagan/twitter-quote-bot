console.log("Twitter bot starting");
var unirest = require('unirest');
var Twit = require('twit');
var client = require('./client');
var T = new Twit(client);

//grab a quote from andruxnet-random-famous-quotes api
function getquote(){
  unirest.post("https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous")
  .header("X-Mashape-Key", "uuMk7ICvSdmshWzLqYVCB8lniJcPp1LF2mqjsnPgDiR7GDD50x")
  .header("Content-Type", "application/x-www-form-urlencoded")
  .header("Accept", "application/json")
  .end(function (result) {
    quote = JSON.parse(result.body).quote;
    author = JSON.parse(result.body).author;

    //format the quote
    fullquote = '"' + quote + '" ' + '-' + author;

    // if quote is longer than 140, recursively grab a new quote until it's
    // shorter than 140
    if (fullquote.length > 140 ) {
      getquote();
    }

    //if quote is tweetable, then tweet
    else {
      T.post('statuses/update', { status: fullquote }, function(err, data, response) {
        if (err == undefined) {
          console.log("Sucessfully tweeted:");
          console.log(fullquote);
        } else {
          console.log("Something went wrong: ");
          console.log(err);
        }
      })
    } //end of else
  }); //end of end()
} //end of getquote()


// The bot will post once upon launch
// Then it will post every 43200000 milliseconds
// 43200000 is half a day in milliseconds
getquote();
setInterval(getquote, 43200000); 
