const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const getLiveScore = require('./live_score');

// request.get('https://www.amazon.com/gp/part-finder', function(err, request, body) {
//   if (err) return next(err);
//   var $ = cheerio.load(body);

const getRecentMatches = () => {
    return rp.get('http://www.cricbuzz.com')
        .then(cricbuzzHome => {
            const home = cheerio.load(cricbuzzHome);
            return getLiveMatchesId(home);
        })
        .then(liveMatchIds => {
            if (liveMatchIds.length) {
                const promises = []
                liveMatchIds.forEach(matchId => {
                    promises.push(getLiveScore(matchId));
                });
                return Promise.all(promises);
            }
            return [];
        });
}

const getLiveMatchesId = ($) => {
    const d1 = $('#hm-scag-mtch-blk').children()[0].children[0];
    const links = [];
    d1.children.forEach(matchObj => {
        const link = matchObj.children[0].attribs.href;
        const linkArray = link.split('/');
        links.push(linkArray[2]);
    });
    return links;
}

module.exports = getRecentMatches;
