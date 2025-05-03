document.addEventListener("gesturestart", function(e) {
    e.preventDefault();
});

const GameState = Object.freeze({
    MENU: 0,
    PLAY: 1,
    OVER: 2
});

const WIDTH_IN_BLOCKS = 20


let game_state = GameState.MENU;
let grid;
let latched = false;

function setup() {
    createCanvas(document.body.clientWidth, document.body.clientHeight);
    background(Theme.background);

    grid = new Grid(
        width / WIDTH_IN_BLOCKS,
        width,
        height - 50,
        0,
        40
    );

    frameRate(10)
}

function draw() {
    background(Theme.background);
    credit()

    // handle touches
    if ((touches.length == 1 || touches.length == 2) && !latched) {
        latched = true
        for (let touch of touches) {
            handleInteraction(touch.x, touch.y)
        }
    } else if (touches.length == 0) {
        latched = false
    }

    for (var row of grid.rows) {
        row.distance++

        row.distance %= 1 + WIDTH_IN_BLOCKS - row.width
    }

    grid.clear()
    grid.fill_with_rows()
    grid.show()

    if (game_state == GameState.MENU) {
        start_menu()
    } else if (game_state == GameState.OVER) {
        summary_menu()
    }

}

function handleInteraction(x, y) {
    push()
    console.log("handle")
    fill(255)
    ellipse(x, y, 10, 10)

    if (game_state == GameState.MENU) {
        game_state = GameState.PLAY
    } else if (game_state == GameState.PLAY) {
        game_state = GameState.OVER
    } else if (game_state == GameState.OVER) {
        game_state = GameState.MENU
    }

    pop()
}

function mousePressed() {
    console.log("mouse")
    handleInteraction(mouseX, mouseY)
}

function credit() {
    push()
    fill(Theme.primary)
    textAlign(CENTER, CENTER);
    text("Block Stacker", width / 2, 20);
    pop()
}

function start_menu() {
    push()

    const menu_height = 200
    const menu_width = 200

    stroke(Theme.back_highlight)
    strokeWeight(3)
    fill(Theme.back_highlight2)

    rect(
        (width - menu_width) / 2,
        (height - menu_height) / 2,
        menu_width,
        menu_height,
        20
    );

    push()

    noStroke()
    textAlign(CENTER, CENTER);

    fill(Theme.primary)
    textSize(20)
    text("Welcome!", width / 2, (height / 2) - 15);

    fill(Theme.back_highlight)
    textSize(15)
    text("Tap anywhere to start...", width / 2, (height / 2) + 15);

    pop()
    pop()
}

function summary_menu() {
    push()

    const menu_height = 200
    const menu_width = 200

    stroke(Theme.accent1)
    strokeWeight(3)
    fill(Theme.back_highlight2)

    rect(
        (width - menu_width) / 2,
        (height - menu_height) / 2,
        menu_width,
        menu_height,
        20
    );

    push()

    noStroke()
    textAlign(CENTER, CENTER);

    fill(Theme.primary)
    textSize(20)
    text("Game Over!", width / 2, (height / 2) - 15);

    // TODO(austin.jones): add in score and timer

    fill(Theme.back_highlight)
    textSize(15)
    text("Tap anywhere to restart...", width / 2, (height / 2) + 15);

    pop()
    pop()
}
