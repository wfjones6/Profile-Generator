const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

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

   const request = require('request');

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
        mMapLocation = "http://www.google.com/maps/place/" + mData.location;
        const html = generateHTML(mData);
        return writeFileAsync("index.html", html);
     }
   });
}

function generateHTML(answers) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Profile Generator</title>
</head>
</body>
<body>
    <header>
        <div class="wrapper">
        <img src=${answers.avatar_url} alt="Profile Image" style="width:150px;height:150px;">
        </div>
        <h1>Hi!</h1>
        <h2>My name is ${answers.login}!</h2>
        <h5>Currently @ ${answers.company}</h5>
        <p><a href=${mMapLocation}>${answers.location}</a></p>
        <p><a href=${answers.html_url}>GitHub</a></p>
        <p><a href=${answers.blog}>Blog</a></p>
    </header>
    <main>
        <h3>${answers.bio}</h3>
        <div class="card">
            <h3>Public Repositories</h3>
            <h4>${answers.public_repos}</h4>
        </div>

        <div class="card">
                <h3>Followers</h3>
                <h4>${answers.followers}</h4>
        </div>

        <div class="card">
                <h3>GitHub Stars</h3>
                <h4>${answers.public_gists}</h4>
        </div>

        <div class="card">
                <h3>Following</h3>
                <h4>${answers.following}</h4>
        </div>

    </main>
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
