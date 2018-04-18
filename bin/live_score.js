const request = require('request');
const rp = require('request-promise');

const getLiveScore = (id) => {
    return rp.get(`http://push.cricbuzz.com/match-api/${id}/commentary.json`)
        .then(matchInfo => {
            matchInfo = JSON.parse(matchInfo);
            // check if valid id
            if (matchInfo.id) {
                const output = {
                    type: matchInfo.type,
                    series: matchInfo.series.name,
                    status: matchInfo.status,
                    state: matchInfo.state,
                    venue: { name: matchInfo.venue.name, location: matchInfo.venue.location }
                };
                const players = matchInfo.players;
                return output;
            }
            throw new Error('No match found');
        });
}

module.exports = getLiveScore;