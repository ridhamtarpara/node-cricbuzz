# Cric-Live

Node package for live cricker scores and more.

  - Get latest match listing
  - Get live scores
  - More to come

# Features

#### Get recent matches
  ```javascript
  const cricLive = require('cric-live');
    
cricLive.getRecentMatches()
    .then(currentMatches => {
        console.log(currentMatches);
        /*
        [ 
            {
                "id": "20080",
                "type": "T20",
                "series": "Indian Premier League, 2018",
                "title": "SRH vs CSK",
                "state": "inprogress",
                "status": "SRH elect to field",
                "teams": [
                    {
                        "name": "Hyderabad",
                        "shortName": "SRH"
                    },
                    {
                        "name": "Chennai",
                        "shortName": "CSK"
                    }
                ],
                "date": "Apr 22 2018",
                "startTime": "10:30"
            },
            ...
        ] 
        */
    });
  ```
  
 #### Get live scores
 
 ```javascript
const cricLive = require('cric-live');
    
cricLive.getLiveScore(2)
    .then(liveScore => {
        console.log(liveScore);
        /*
        {
            "type": "T20",
            "series": "Indian Premier League, 2018",
            "status": "Sunrisers Hyderabad opt to bowl",
            "state": "inprogress",
            "venue": {
              "name": "Rajiv Gandhi International Stadium",
              "location": "Hyderabad, India"
            },
            "score": {
              "runRate": 5.62,
              "target": "",
              "detail": {
                "currentInnings": 1,
                "batting": {
                  "name": "Chennai Super Kings",
                  "shortName": "CSK",
                  "score": 59,
                  "overs": 10.2,
                  "wickets": 2
                }
              },
              "partnership": "28(21)",
              "batsmen": [[Object], [Object]],
              "bowlers": [[Object], [Object]],
              "lastBallDetail": {
                "batsman": [[Object]],
                "bowler": [[Object]],
                "commentary": "Deepak Hooda to Raina, 1 run, to sweeper cover",
                "score": 1
              }
            },
            "teams": {
              "58": {
                "name": "Chennai Super Kings",
                "shortName": "CSK",
                "score": 60,
                "overs": 10.4,
                "wickets": 2
              },
              "255": {
                "name": "Sunrisers Hyderabad",
                "shortName": "SRH"
              }
            }
          }
         */
    });
 ```
 
 ## Disclaimer
 
This package uses cric buzz api and its an unofficial package. And it is only for your personal and non-commercial use. You may not use the package for commercial purposes or in any way that is unlawful, or harms us or any other person or entity, as determined in our sole discretion. Package contributors are not responsible for any misuse.
 
 