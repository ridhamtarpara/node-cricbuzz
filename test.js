const getRecentMatches = require('./bin/recent_match');
const getLiveScore = require('./bin/live_score');

module.exports = {
  getRecentMatches,
  getLiveScore,
}

getLiveScore(20077)
.then(data => {
    console.log(JSON.stringify(data, null, 2));
})

setTimeout(() => {
    
}, 20000);