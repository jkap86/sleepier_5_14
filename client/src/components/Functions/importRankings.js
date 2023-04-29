import { utils, read } from 'xlsx';
import { matchTeam } from './misc';


export const importRankings = (e, stateAllPlayers, setUploadedRankings) => {
    console.log('UPLOADING...')
    if (e.target.files[0]) {
        const filename = e.target.files[0].name
        const reader = new FileReader()
        reader.onload = (e) => {
            /*
            const results = []
            const lines = reader.result.split('\n');
            const headers = lines[0].split(',').map(h => h.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ''))
            const p = headers.findIndex(h => ['player', 'name', 'player name'].includes(h.toLowerCase()))
            const r = headers.findIndex(h => ['rank', 'rk'].includes(h.toLowerCase()))
            const pos = headers.findIndex(h => ['pos', 'position'].includes(h.toLowerCase()))
            const team = headers.findIndex(h => ['team', 'tm'].includes(h.toLowerCase()))

            if (!(headers[p] && headers[r] && headers[pos] && headers[team])) {
                console.log(lines)
                setUploadedRankings({
                    error: `error - column${!headers[p] ? ' Player' : ''}${!headers[r] ? ' Rank' : ''}${!headers[pos] ? ' Position' : ''}${!headers[team] ? ' Team' : ''} not found`,
                    filename: filename
                })
                return
            }

            let uploadedRankings = {}
            let notMatched = []

            lines.forEach((line, index) => {
                if (line && index > 0) {
                    const player = line.split(',').map(h => h.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ''))
                    const player_to_update = matchRankings(player[p].toLowerCase(), player[pos].slice(0, 2), matchTeam(player[team]), stateAllPlayers)
                    const rank = player[r]
                    if (player_to_update.error) {
                        notMatched.push({
                            name: player[p],
                            rank: rank,
                            position: player[pos].slice(0, 2),
                            team: player[team],
                            error: player_to_update.error
                        })
                    } else {
                        return uploadedRankings[player_to_update.id] = {
                            prevRank: rank,
                            newRank: rank
                        }

                    }
                }
            })

            */
            const data = e.target.result
            const workbook = read(data, { type: 'array' })
            const sheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[sheetName]
            let json = utils.sheet_to_json(worksheet)

            const cols = Object.keys(json[0])
            const p = cols.find(x => ['player', 'name', 'player name'].includes(x.trim().toLowerCase()))
            const r = cols.find(x => ['rank', 'rk', 'overall'].includes(x.trim().toLowerCase()))
            const pos = cols.find(x => ['pos', 'position'].includes(x.trim().toLowerCase()))
            const team = cols.find(x => ['team', 'tm'].includes(x.trim().toLowerCase()))

            if (!(p && r && pos)) {
                setUploadedRankings({ error: `error - column ${!p ? ' Player' : ''} ${!r ? ' Rank' : ''} ${!pos ? ' Position' : ''} ${!team ? ' Team' : ''} not found` })
                return
            }

            let uploadedRankings = {}
            let notMatched = []

            json.map(player => {
                const player_to_update = matchRankings(player[p].trim().toLowerCase().replace(/[^a-z]/g, ""), player[pos].slice(0, 2), matchTeam(player[team]), stateAllPlayers)
                const rank = player[r]
                if (player_to_update.error) {
                    notMatched.push({
                        name: player[p],
                        rank: rank,
                        position: player[pos],
                        team: player[team],
                        error: player_to_update.error
                    })
                } else {
                    return uploadedRankings[player_to_update.id] = {
                        prevRank: rank,
                        newRank: rank
                    }

                }
            })

            if (uploadedRankings.error) {
                console.log(uploadedRankings.error)
            }

            console.log(uploadedRankings)

            setUploadedRankings({
                rankings: uploadedRankings,
                notMatched: notMatched,
                filename: filename
            })

        }
        reader.readAsArrayBuffer(e.target.files[0])
    } else {
        console.log('no file')
    }
}

const matchRankings = (player_name, position, team, stateAllPlayers) => {
    let player = player_name.replace(/[^a-z]/g, "")
    if (player.endsWith('jr')) {
        player = player.replace('jr', '')
    }
    let start = 1
    let end = 4
    const players_to_search = Object.keys(stateAllPlayers).filter(p => stateAllPlayers[p]?.position === position && stateAllPlayers[p]?.active === true)
    let matches = players_to_search
        .filter(player_id =>
            player.includes(stateAllPlayers[player_id]?.search_full_name.slice(start, end))
            || stateAllPlayers[player_id]?.search_full_name.includes(player.slice(start, end))

        );

    while (matches.length > 1 && end <= 50) {
        end += 1
        matches = players_to_search
            .filter(player_id =>
                player.includes(stateAllPlayers[player_id]?.search_full_name.slice(start, end))
                || stateAllPlayers[player_id]?.search_full_name.includes(player.slice(start, end))

            );
    }

    if (matches.length === 1) {
        return {
            id: matches[0],
            ...stateAllPlayers[matches[0]]
        }
    } else {
        const matches_team = matches.filter(m => stateAllPlayers[m]?.search_full_name[0] === player[0] && team === (stateAllPlayers[m]?.team))
        if (matches_team.length === 1) {
            return {
                id: matches_team[0],
                ...stateAllPlayers[matches_team[0]]
            }
        } else {
            return {
                error: {
                    player: [player],
                    position: position,
                    matches: matches.map(player_id => stateAllPlayers[player_id])

                }
            }
        }
    }

}