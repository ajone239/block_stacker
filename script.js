document.addEventListener("gesturestart", function(e) {
    e.preventDefault();
});

const GameState = Object.freeze({
    MENU: 0,
    PLAY: 1,
    OVER: 2
});

const WIDTH_IN_BLOCKS = 20
const INIT_FRAME_RATE = 10
const VERSION = "1.0.7"

let game_state = GameState.MENU;
let grid;
let latched = 0;

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

    frameRate(INIT_FRAME_RATE)
}

function draw() {
    background(Theme.background);
    credit()


    // handle touches
    if (touches.length == 1 && latched <= 0) {
        for (let touch of touches) {
            handleInteraction(touch.x, touch.y)
        }
        latched = 5
    } else {
        latched--;
    }

    if (game_state == GameState.MENU) {
        grid.show()
        start_menu()
        return;
    } else if (game_state == GameState.OVER) {
        grid.show()
        summary_menu()
        return;
    }

    grid.update()
    grid.clear()
    grid.fill_with_rows()
    grid.show()

    frameRate(INIT_FRAME_RATE + int(grid.rows.length / 5))
}

function handleInteraction(_x, _y) {
    if (game_state == GameState.MENU) {
        game_state = GameState.PLAY
    } else if (game_state == GameState.PLAY) {
        if (latched > 0) {
            return;
        }

        let success = grid.freeze_row()

        if (!success) {
            game_state = GameState.OVER
        }
    } else if (game_state == GameState.OVER) {
        game_state = GameState.MENU
        grid.clear()
        grid.reset()
    }
}

function keyPressed() {
    if (key == ' ') {
        handleInteraction(0, 0);
    }
}

function mousePressed() {

    handleInteraction(mouseX, mouseY)
}

function credit() {
    push()
    fill(Theme.primary)
    textAlign(CENTER, CENTER);
    text("Block Stacker", width / 2, 20);

    text(`Version: ${VERSION}`, 1 * width / 4, 20);
    text(`Level: ${grid.rows.length}`, 3 * width / 4, 20);

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

    const menu_height = 300
    const menu_width = 300

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
    textSize(15)
    text("Game Over!", width / 2, (height / 2) - 25);

    textSize(20)
    text(`You made it to level ${grid.rows.length}!`, width / 2, (height / 2));

    fill(Theme.back_highlight)
    textSize(15)
    text("Tap anywhere to restart...", width / 2, (height / 2) + 25);

    pop()
    pop()
}
