const request = require('request');
const rp = require('request-promise');
const _ = require('lodash')

const getLiveScore = (id) => {
    try{
        return rp.get(`http://push.cricbuzz.com/match-api/${id}/commentary.json`)
        .then(matchInfo => {
            matchInfo = JSON.parse(matchInfo);

            // check if valid id
            if (matchInfo.id) {
                const output = {
                    id: matchInfo.id,
                    type: matchInfo.type,
                    series: matchInfo.series.name,
                    status: matchInfo.status,
                    state: matchInfo.state,
                    startTime: matchInfo.start_time,
                    venue: { name: matchInfo.venue.name, location: matchInfo.venue.location }
                };
                if (output.state !== 'preview') {
                    const players = matchInfo.players;
                    const teams = getTeamInfo(matchInfo.team1, matchInfo.team2);
                    const score = {};
                    score.runRate = ((matchInfo || {}).score || {}).crr;
                    score.target = ((matchInfo || {}).score || {}).target;
                    score.detail = getScoreDetails((matchInfo || {}).score, teams);
                    if (output.state == 'inprogress') {
                        score.partnership = ((matchInfo || {}).score || {}).prtshp;
                        score.batsmen = getPlayerInfo(((matchInfo || {}).score|| {}).batsman, players)
                        score.bowlers = getPlayerInfo(((matchInfo || {}).score|| {}).bowler, players)
                        score.lastBallDetail = getLastBallDetail((matchInfo || {}).comm_lines, players, (((matchInfo || {}).score || {}).prev_overs || '').trim(), score.detail.batting.overs)
                    }
                    output.score = score;
                    output.teams = teams;
                }
                return output;
            }
            throw new Error('No match found');
        });
    } catch (e) {
        throw e;
    }
}

const getLastBallDetail = (comm_lines, players, prevOvers, over) => {
    if(!over.includes(".")) {
        over = parseInt(over, 10);
        over = `${over-1}.6`
    }
    const lassBallCommentaryDetails = _.find(comm_lines, {
        o_no: over
    });
    let lassBallDetail = {};
    if (lassBallCommentaryDetails) {
         lassBallDetail = {
            batsman: getPlayerInfo(lassBallCommentaryDetails.batsman, players),
            bowler: getPlayerInfo(lassBallCommentaryDetails.bowler, players),
            events: lassBallCommentaryDetails.all_evt,
            commentary : lassBallCommentaryDetails.comm,
            score: getLastBallStatus(prevOvers),
        };   
    }
    return lassBallDetail;
}

const getLastBallStatus = (prevOvers) => {
    const ballArray = (prevOvers || "").split(' ');
    const lastBall = ballArray.length ? ballArray[ballArray.length - 1] === '|' ? ballArray[ballArray.length - 2] || null : ballArray[ballArray.length - 1] : "-";
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