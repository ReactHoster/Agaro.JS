function connectToServer() {

    let nick = document.getElementById("nick").value
    let color = randomColor()

    // Check player name
    if (nick.trim() === '') {
        // $('#name_error').show()
        document.getElementById('name_error').style.display = 'block'
        return 0
    } else {
        document.getElementById('name_error').style.display = 'none'
    }

    player = new Player(nick, socket.id, color.body, color.border)

    // Say that we're connected
    socket.emit("start", {
        x: player.pos.x,
        y: player.pos.y,
        r: player.radius,
        b: player.COLOR,
        bc: player.BORDER_COLOR,
        n: player.nick
    })

    document.getElementById("menu").style.display = "none"

}

socket.on("blobs", data => {

    // Flush blobs
    blobs = []

    // Create blobs
    for (let i = 0; i < data.blobs.length; i++) {
        blobs.push(new Blob(data.blobs[i].x, data.blobs[i].y, data.blobs[i].r, data.blobs[i].c))
    }

    document.getElementById("menu").style.display = "flex"
})

socket.on("start", (data) => {

    // Create players
    for (let id in data.players) {
        let p = data.players[id]
        players[id] = new Player(p.n, p.id, p.b, p.bc, p.x, p.y)
        players[id].block = [data.players[id].block.row, data.players[id].block.col]
    }

    // Flush blobs
    blobs = []

    // Create blobs
    for (let i = 0; i < data.blobs.length; i++) {
        if (data.blobs[i]) blobs.push(new Blob(data.blobs[i].x, data.blobs[i].y, data.blobs[i].r, data.blobs[i].c))
    }

    gameStarted = true
    paused = false

    document.getElementById("playersStats").style.display = "block"

    console.log(players)

})

socket.on("heartbeat", (data) => {

    // Update positions and radiuses
    for (let id in data.players) {
        if (id !== socket.id && players[id]) {
            players[id].pos.x = data.players[id].x
            players[id].pos.y = data.players[id].y
            players[id].radius = data.players[id].r
        } else if (players[id]) {
            players[id].block = [data.players[id].block.row, data.players[id].block.col]
        }
    }

})

socket.on("newPlayer", (data) => {

    // Create new player
    players[data.id] = new Player(data.n, data.id, data.b, data.bc, data.x, data.y)

    // Update players stats
    // document.getElementById("playersStats").innerHTML = "<h3>Players: " + Object.keys(players).length + "</h3>"

    document.getElementById("count_players").innerHTML = Object.keys(players).length

    // Clear players name before adding players names
    document.getElementById("players_names").innerHTML = "";

    for (const [key, value] of Object.entries(players)) {
        for (const [key2, value2] of Object.entries(value)) {
            if (key2 === 'nick') {
                const ul = document.getElementById("players_names");
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(value2));
                ul.appendChild(li);
            }
        }
    }

})

socket.on("removePlayer", (data) => {
    console.log(data)
    // Delete player
    delete players[data]
    // delete players[data.id]

    console.log("Delete player:", data, "- data:", data)
    // console.log("Delete player:", data.id, "- data:", data)

    // if (data.id == socket.id) {
    if (data == socket.id) {
        gameStarted = false
        paused = true
        document.getElementById("playersStats").style.display = "none"
        document.getElementById("menu").style.display = "flex"
    }

    // Update players stats
    // document.getElementById("playersStats").innerHTML = "<h3>Players: " + Object.keys(players).length + "</h3>"

    console.log(Object.keys(players).length)

    document.getElementById("count_players").innerHTML = Object.keys(players).length

    // Clear players name before adding players names
    document.getElementById("players_names").innerHTML = "";

    for (const [key, value] of Object.entries(players)) {
        for (const [key2, value2] of Object.entries(value)) {
            if (key2 === 'nick') {
                const ul = document.getElementById("players_names");
                const li = document.createElement("li");
                li.appendChild(document.createTextNode(value2));
                ul.appendChild(li);
            }
        }
    }
})

socket.on("removeBlob", (data) => {
    console.log(data)
    console.log(data['players'])
    // Delete blob
    if (data.id !== socket.id) blobs.splice(data.i, 1)

    // Update players score
    // Clear players name before adding players names
    document.getElementById("players_names").innerHTML = "";
    
    // Get players names and scores
    const players_with_scores = {}
    for (const [key, value] of Object.entries(data['players'])) {
        players_with_scores[value['n']] = value['score']
    }

    // Sort players by score
    const sortable = Object.entries(players_with_scores)
        .sort(([,a],[,b]) => b-a)
        .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    // Put updated players list
    const ul = document.getElementById("players_names");
    Object.keys(sortable).forEach((player, i) => {
        const li = document.createElement("li");
        li.appendChild(document.createTextNode(`${player} - ${sortable[player]}`));
        ul.appendChild(li);
    })
})

socket.on("newBlob", (data) => {
    // Add blob
    blobs.push(new Blob(data.x, data.y, data.r, data.c))
})
