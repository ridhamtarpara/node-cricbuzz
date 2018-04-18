const request = require('request');
const rp = require('request-promise');
const parser = require('xml2json');

const getRecentMatches = () => {
   return rp.get('http://synd.cricbuzz.com/j2me/1.0/livematches.xml')
        .then(xml => {
            const liveMatches = JSON.parse(parser.toJson(xml));
            // console.log(JSON.stringify(liveMatches.mchdata, null, 2));
            const totalMatches = liveMatches.mchdata.match.length;
            const matchList = liveMatches.mchdata.match.reduce((result, match) => {
                if (match.id > 15000) {
                    result.push({
                        id: match.id,
                        type: match.type,
                        series: match.srs,
                        title: match.mchDesc,
                        state: match.state.mchState,
                        status: match.state.status,
                        teams: match.Tm.map(team => ({
                            name: team.Name || '',
                            shortName: team.sName || ''
                        })),
                        date: match.Tme.Dt,
                        startTime: match.Tme.stTme,
                        url: match.datapath
                    });
                }
                return result;
            }, [])
            // console.log(JSON.stringify(matchList, null, 2));
            return matchList;
        })
}

module.exports = getRecentMatches;