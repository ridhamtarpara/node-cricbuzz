const getRecentMatches = require('./bin/recent_match');
const getLiveScore = require('./bin/live_score');

module.exports = {
  getRecentMatches,
  getLiveScore,
}

getLiveScore(20743)
.then(data => {
  console.log(data);
})

setTimeout(() => {
    
}, 20000);