const request = require('request');
const rp = require('request-promise');
const _ = require('lodash')

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
                const teams = getTeamInfo(matchInfo.team1, matchInfo.team2);
                const score = {};
                score.runRate = matchInfo.score.crr;
                score.target = matchInfo.score.target;
                score.detail = getScoreDetails(matchInfo.score, teams);
                score.partnership = matchInfo.score.prtshp;
                score.lastBall = getLastBallStatus(matchInfo.score.prev_overs.trim());
                score.batsmen = getPlayerInfo(matchInfo.score.batsman, players)
                score.bowlers = getPlayerInfo(matchInfo.score.bowler, players)
                output.score = score;
                output.teams = teams;
                // output.game
                return output;
            }
            throw new Error('No match found');
        });
}

const getLastBallStatus = (prevOvers) => {
    const ballArray = (prevOvers || "").split(' ');
    const lastBall = ballArray.length ? ballArray[ballArray.length - 1] === '|' ? ballArray[ballArray.length - 2] || null : ballArray[ballArray.length - 1] : null;
    return lastBall === '.' ? 0 : lastBall;
}

const getPlayerInfo = (playerArray, players) => {
    return playerArray.map(player => {
        const playerDetail = getPlayerObj(player.id, players);
        player.name = playerDetail.f_name;
        player.shortName = playerDetail.name;
        return player;
    });
}

const getPlayerObj = (id, players) => {
    return _.find(players, { id });
}

const getTeamInfo = (team1, team2) => {
    const teams = {};
    const assignTeamToObject = (team) => {
        teams[team.id] = {
            name: team.name,
            shortName: team.s_name,
        }
    }
    assignTeamToObject(team1);
    assignTeamToObject(team2);
    return teams;   
}

const getScoreDetails = (score, teams) => {
    const scoreDetail = {
        currentInnings: 1
    }
    
    const getInningsDetail = (innings) => {
        const inningsDetail = teams[innings.id];
        const inningsInfo = innings.innings[0];
        inningsDetail.score = inningsInfo.score;
        inningsDetail.overs = inningsInfo.overs;
        inningsDetail.wickets = inningsInfo.wkts;
        return inningsDetail;
    }

    scoreDetail.batting = getInningsDetail(score.batting);
    
    if (score.bowling) {
        scoreDetail.currentInnings = 2;
        scoreDetail.bowling = getInningsDetail(score.bowling);
    }

    return scoreDetail;
}


module.exports = getLiveScore;