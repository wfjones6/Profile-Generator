const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");
const pdf = require('html-pdf');
const request = require('request');

const writeFileAsync = util.promisify(fs.writeFile);

var mColor;
var mData;
var mMapLocation;

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "userName",
      message: "Enter your GitHub Username: "
    },
    {
      type: "input",
      name: "colorChoice",
      message: "Enter a color (green, blue, pink, or red): "
    }
  ]);
}

function gitData(answers){
   var urlGit = 'https://api.github.com/users/' + answers.userName;

   const options = {
       url: urlGit,
       method: 'GET',
       headers: {
           'Accept': 'application/json',
           'Accept-Charset': 'utf-8',
           'User-Agent': 'request'
       }
   };

   request(options, (error, response, body) => {
     if (!error && response.statusCode == 200) {
        mData = JSON.parse(body);
        mData.colorChoice = answers.colorChoice;
        mMapLocation = "http://www.google.com/maps/place/" + mData.location;
        const html = generateHTML(mData);

	pdf.create(html, options).toFile('./index.pdf', function(err, res) {
	if (err) return console.log(err);
	console.log(res);
       });

       return writeFileAsync("index.html", html);
     }
   });
}

function generateHTML(userData) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"/>
    <title>Profile Generator</title>
</head>

<style>
  .green {
      background-color: green;
      color: white;
      padding: 10px
  }

  .blue {
      background-color: blue;
      color: white;
      padding: 10px;
  }

  .pink {
      background-color: pink;
      color: white;
      padding: 10px
  }

  .red {
      background-color: red;
      color: white;
      padding: 10px
  }

   h1 {text-align:center;}
   h2 {
      text-align:center;
   }
   h4 {text-align:center;}

ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: ${userData.colorChoice};
}

li {
  float: left;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #111111;
}
</style>

<body>
  <div class="jumbotron jumbotron-fluid">
   <div class="container">
    <header>
        <div class="wrapper" style="background-color:${userData.colorChoice};">
        <img src=${userData.avatar_url} class="rounded-circle mx-auto d-block" alt="Profile Image" style="width:150px;height:150px;">

        <h1 class=${userData.colorChoice}>Hi!</h1>
        <h2 class=${userData.colorChoice}>My name is ${userData.login}!</h2>
        <h4 class=${userData.colorChoice}>Currently @ ${userData.company}</h4>

        <ul>
          <li><a href=${mMapLocation}>${userData.location}</a></li>
          <li><a href=${userData.html_url}>GitHub</a></li>
          <li><a href=${userData.blog}>Blog</a></li>
        </ul>
        </div>
    </header>
    <main>
        </br>
        <h3>${userData.bio}</h3>
        </br>

        <div class="container">
          <div class="card-columns">
            <div class="card" style="background-color:${userData.colorChoice};">
              <div class="card-body text-center">
                <h3 class=${userData.colorChoice}>Public Repositories</h3>
                <h4 class=${userData.colorChoice}>${userData.public_repos}</h4>
              </div>
            </div>
            <div class="card" style="background-color:${userData.colorChoice};">
              <div class="card-body text-center">
                <h3 class=${userData.colorChoice}>Followers</h3>
                <h4 class=${userData.colorChoice}>${userData.followers}</h4>
              </div>
            </div>
            <div class="card" style="background-color:${userData.colorChoice};">
              <div class="card-body text-center">
                <h3 class=${userData.colorChoice}>GitHub Stars</h3>
                <h4 class=${userData.colorChoice}>${userData.public_gists}</h4>
              </div>
            </div>  
            <div class="card" style="background-color:${userData.colorChoice};">
              <div class="card-body text-center">
                <h3 class=${userData.colorChoice}>Following</h3>
                <h4 class=${userData.colorChoice}>${userData.following}</h4>
              </div>
            </div>
          </div>
        </div>

    </main>
   </div>
  </div>
</body>
</html>`;
}


promptUser()
  .then(function(answers) {

    mColor = answers.colorChoice;

    gitData(answers);

  })
 .catch(function(err) {
    console.log(err);
  });
