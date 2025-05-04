class Row {
    constructor(distance, width, level) {
        this.distance = distance
        this.width = width
        this.level = level
    }

    end() {
        return this.distance + this.width
    }
}

class Grid {
    constructor(size, width, height, x, y) {
        this.x = x
        this.y = y
        this.width = width
        this.height = height
        this.square_size = size
        this.width_in_squares = int(width / size)
        this.height_in_squares = int(height / size)
        this.lor = false // left or right

        // make the grid
        this.grid = new Array(this.width_in_squares)
        for (let i = 0; i < this.height_in_squares; i++) {
            this.grid[i] = new Array(this.height_in_squares).fill(0)
        }

        let two_thirds_width = int(this.width_in_squares * (2 / 3))

        // make the rows
        let first_row = new Row(2, two_thirds_width, 1)
        this.rows = new Array(1).fill(first_row)
    }

    mod_width() {
        return this.width_in_squares * this.square_size
    }

    mod_height() {
        return this.height_in_squares * this.square_size
    }

    clear() {
        for (let i = 0; i < this.width_in_squares; i++) {
            for (let j = 0; j < this.height_in_squares; j++) {
                this.grid[i][j] = 0;
            }
        }
    }

    reset() {
        let two_thirds_width = int(this.width_in_squares * (2 / 3))

        // make the rows
        let first_row = new Row(2, two_thirds_width, 1)
        this.rows = new Array(1).fill(first_row)
    }

    update() {
        const last_row = this.rows.at(-1)

        const turn =
            (this.lor && last_row.distance == 0) ||
            (!this.lor && (last_row.distance + last_row.width) == this.width_in_squares)

        if (turn) {
            this.lor = !this.lor;
            return;
        }

        last_row.distance += this.lor ? -1 : 1;
    }

    freeze_row() {
        const penultimate_row = this.rows.at(-2)
        const last_row = this.rows.at(-1)

        let next_row_distance = last_row.distance
        let next_row_width = last_row.width

        if (penultimate_row) {
            // last_row comes up short
            if (penultimate_row.distance >= (last_row.end())) {
                return false;
            }

            // last_row goes long
            if (last_row.distance >= (penultimate_row.end())) {
                return false;
            }

            next_row_distance = Math.max(last_row.distance, penultimate_row.distance)
            next_row_width =
                Math.min(
                    penultimate_row.end(),
                    last_row.end()
                ) - next_row_distance
        }

        last_row.width = next_row_width
        last_row.distance = next_row_distance
        var next_row = new Row(next_row_distance, next_row_width, 1)

        this.rows.push(next_row)

        return true;
    }

    fill_with_rows() {
        const rows_to_show = this.rows.slice(-1 * (this.height_in_squares - 1))

        for (let j = 0; j < rows_to_show.length; j++) {
            const row = rows_to_show[j]
            for (let i = 0; i < row.width; i++) {
                const idx = i + row.distance;
                this.grid[idx][this.height_in_squares - j - 1] = row.level;
            }
        }
    }

    show() {
        push()

        translate(this.x, this.y)
        stroke(Theme.back_highlight2)
        strokeWeight(4);

        // draw vert bars
        for (let i = 1; i < this.width_in_squares; i++) {
            let x = i * this.square_size
            line(x, 0, x, this.mod_height());
        }
        // draw horz bars
        for (let j = 1; j < this.height_in_squares; j++) {
            let y = j * this.square_size
            line(0, y, this.width, y);
        }

        // draw squares
        for (let i = 0; i < this.width_in_squares; i++) {
            for (let j = 0; j < this.height_in_squares; j++) {
                let square = this.grid[i][j]

                if (square == 0) {
                    continue;
                }

                let x = i * this.square_size
                let y = j * this.square_size

                push()

                stroke(Theme.primary)
                fill(Theme.background);
                rect(x, y, this.square_size, this.square_size)

                pop()
            }
        }
        pop()
    }
}
