const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');
const parseString = require('xml2js').parseString;

// request.get('https://www.amazon.com/gp/part-finder', function(err, request, body) {
//   if (err) return next(err);
//   var $ = cheerio.load(body);

const getRecentMatches = () => {
    let home;
    return Promise.all([
        rp.get('http://synd.cricbuzz.com/j2me/1.0/livematches.xml'),
        rp.get('http://www.cricbuzz.com'),
    ])
        .then(([xml, cricbuzzHome]) => {
            home = cheerio.load(cricbuzzHome);
            return parseXML(xml);
        })
        .then(liveMatches => {
            const matchIdsFromHome = getLiveMatchesId(home);
            const totalMatches = liveMatches.mchdata.match.length;
            const matchList = liveMatches.mchdata.match.reduce((result, match) => {
                const matchId = match.$.id;
                const matchState = match.state[0].$.mchState;
                if (matchId > 15000) {
                    result.push(generateMatchObj(matchId, match));
                } else if (matchState === 'preview' || matchState === 'innings break' || matchState === 'inprogress'
                    || matchState === 'rain') {
                    const fetchedId = matchIdsFromHome[`${match.$.mchDesc.substr(0,3).toLowerCase()}`];
                    if(fetchedId) {
                        result.push(generateMatchObj(fetchedId, match));
                    }
                }
                return result;
            }, []);
            return matchList;
        });
}


const generateMatchObj = (id, match) => ({
    id,
    type: match.$.type,
    series: match.$.srs,
    title: match.$.mchDesc,
    state: match.state[0].$.mchState,
    status: match.state[0].$.status,
    teams: match.Tm.map(team => ({
        name: team.$.Name || '',
        shortName: team.$.sName || ''
    })),
    date: match.Tme[0].$.Dt,
    startTime: match.Tme[0].$.stTme,
    url: match.$.datapath
})

const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, liveMatches) => {
            if (err) reject(err);
            else resolve(liveMatches);
        });
    });
}

const getLiveMatchesId = ($) => {
    const d1 = $('#hm-scag-mtch-blk').children()[0].children[0];
    const links = {};
    d1.children.forEach(matchObj => {
        const link = matchObj.children[0].attribs.href;
        const linkArray = link.split('/');
        links[linkArray[3].substr(0,3)] = linkArray[2];
    });
    return links;
}

module.exports = getRecentMatches;
