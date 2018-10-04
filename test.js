const getRecentMatches = require('./bin/recent_match');
const getLiveScore = require('./bin/live_score');

module.exports = {
  getRecentMatches,
  getLiveScore,
}
getRecentMatches()
.then(data => {
  console.log(JSON.stringify({getRecentMatches:data}, null, 2));
})

getLiveScore(21460)
.then(data => {
  console.log('\n\n\n\n\n\n');
  console.log(JSON.stringify({getLiveScore:data}, null, 2));
})

setTimeout(() => {
    
}, 20000);