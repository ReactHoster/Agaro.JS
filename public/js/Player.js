/**
 * Player object
 * @class
 */
class Player {

    constructor(nick, id, color, bcolor, x, y, score, skin) {
        this.radius = PLAYER_RADIUS
        this.Radius = PLAYER_RADIUS / 2
        this.x = x
        this.y = y

        if (x && y) {
            this.pos = createVector(x, y)
        } else {
            this.pos = createVector(random(0, FIELD_SIZE), random(0, FIELD_SIZE))
        }

        this.velocity = createVector(0, 0)
        this.mass = PI * this.radius * this.radius
        this.speed = 20 * Math.pow(this.mass, -0.2)
        this.points = []

        this.nick = nick
        this.id = id
        this.block = []

        this.COLOR = color
        this.BORDER_COLOR = bcolor

        this.angle = Math.random() * TWO_PI

        this.score = score
        this.skin = Skins.if_skin_exists(skin)?skin:null
    }

    /**
     * Create points for player's shape
     * @function
     */
    makePoints() {
        this.Radius = lerp(this.Radius, this.radius, 0.1)

        this.points = []

        for (let i = 0; i <= 360; i++) {
            let angle = map(i, 0, 360, 0, TWO_PI)
            let x = this.Radius * cos(angle) + this.pos.x
            let y = this.Radius * sin(angle) + this.pos.y

            this.points.push({
                x: x,
                y: y
            })

            this.points[i].x = constrain(this.points[i].x, 5, FIELD_SIZE - 5)
            this.points[i].y = constrain(this.points[i].y, 5, FIELD_SIZE - 5)
        }
    }

    /**
     * Draws player
     * @function
     */
    draw() {

        // image(img, this.pos.x-this.radius/2, this.pos.y-this.radius/2, this.radius, this.radius)
        // noFill();
        // rect(25,25,100,100);


        // strokeWeight(4)

        // console.log(this.pos.x, this.pos.y)

        // test(this.pos.x/100, this.pos.y/100)

        // Set skin if not null
        if (this.skin !== 'random_color') {
            const pos_x = this.pos.x
            const pos_y = this.pos.y
            const radius = this.radius
            const score = parseInt(this.radius*2)

            image(skins[this.skin], (pos_x-radius), (pos_y-radius), score, score)
        }
        else {
            fill(this.COLOR)
            stroke(this.BORDER_COLOR)
        }

        beginShape()
        this.makePoints()
        this.points.forEach(p => {
            curveVertex(p.x, p.y)
        })
        endShape(CLOSE)

        textAlign(CENTER, CENTER)
        fill(255)
        stroke(0)
        strokeWeight(1)
        textFont(font)
        textSize(this.Radius / 1.5)
        text(this.nick, this.pos.x, this.pos.y)
    }


    /**
     * Locates player to the mouse position
     * @function
     */
    move() {
        let newVelocity = createVector(mouseX - w / 2, mouseY - h / 2)

        // Update values
        this.mass = PI * this.radius * this.radius;
        this.speed = 10 * Math.pow(this.mass, -0.2);
        newVelocity.setMag(this.speed * 0.95)

        this.velocity.lerp(newVelocity, 0.1)

        this.pos.x = constrain(this.pos.x, 5, FIELD_SIZE - 5)
        this.pos.y = constrain(this.pos.y, 5, FIELD_SIZE - 5)

        this.pos.add(this.velocity)
    }

    /**
     * Returns true if player eats another blob
     * @param {object} blob Blob object
     */
    eats(blob) {
        let d = p5.Vector.dist(this.pos, blob.pos)


        if (d < this.radius - blob.radius * 0.5 && this.radius > blob.radius) {
            if (this.radius < blob.radius + 8) return

            // A sum of 2 circles' area
            let sum = PI * this.radius * this.radius + PI * blob.radius * blob.radius * 6

            // R^2 = S / PI, then
            // R = square root of S / PI
            // this.radius = sqrt(sum / PI)
            this.radius = sqrt(sum / PI)
            // console.log(sum)
            return true
        } else {
            return false
        }
    }
}
