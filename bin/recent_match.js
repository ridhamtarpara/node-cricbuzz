const request = require('request');
const rp = require('request-promise');
const parseString = require('xml2js').parseString;

const getRecentMatches = () => {
   return rp.get('http://synd.cricbuzz.com/j2me/1.0/livematches.xml')
        .then(xml => parseXML(xml))
        .then(liveMatches => {
            const totalMatches = liveMatches.mchdata.match.length;
            const matchList = liveMatches.mchdata.match.reduce((result, match) => {
                if (match.$.id > 15000 || match.state[0].$.mchState === 'preview') {
                    result.push({
                        id: match.$.id,
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
                    });
                }
                return result;
            }, []);
            return matchList;
        });
}

const parseXML = (xml) => {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, liveMatches) => {
            if (err) reject(err);
            else resolve(liveMatches);
        }); 
    });
}

module.exports = getRecentMatches;
