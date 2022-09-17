
class ScoreBoard {
    constructor() {
        console.log('loaded')
    }

    /**
     * Set players count
     * @param _players {Object}
     */
    static set_players_count(_players) {
        document.getElementById("count_players").innerHTML = Object.keys(_players).length
    }

    /**
     * Set players score board
     * @param _players {Object}
     */
    static set_score_board(_players) {
        // Clear players name before adding players names
        this.clear_previous_score_board()

        const players_with_scores = {}
        for (const [key, value] of Object.entries(_players)) {
            if (value["nick"] !== undefined) {
                players_with_scores[value['nick']] = value['score']
            }
            else {
                players_with_scores[value['n']] = value['score']
            }
        }

        const sorted = this.sort_by_score(players_with_scores)

        // Put updated players list
        const ul = document.getElementById("players_names");
        Object.keys(sorted).forEach((player, i) => {
            const li = document.createElement("li");
            li.appendChild(document.createTextNode(`${player}: ${sorted[player]}`));
            ul.appendChild(li);
        })
    }

    // Clear players name before adding players names
    static clear_previous_score_board() {
        document.getElementById("players_names").innerHTML = "";
    }

    /**
     * Sort players by score
     * @param _players {Object}
     */
    static sort_by_score(_players) {
        // Sort players by score
        return Object.entries(_players)
            .sort(([, a], [, b]) => b - a)
            .reduce((r, [k, v]) => ({...r, [k]: v}), {})
    }

}

// export default new ScoreBoard()
