class Row {
    constructor(distance, width, level) {
        this.distance = distance
        this.width = width
        this.level = level
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

        // make the grid
        this.grid = new Array(this.width_in_squares)
        for (let i = 0; i < this.height_in_squares; i++) {
            this.grid[i] = new Array(this.height_in_squares).fill(0)
        }

        // make the rows
        let first_row = new Row(
            0,
            int(this.width_in_squares * (2 / 3)),
            1
        )
        this.rows = new Array(0)
        this.rows.push(first_row)
        this.rows.push(new Row(0, 9, 1))
        this.rows.push(new Row(0, 8, 1))
        this.rows.push(new Row(0, 7, 1))
        this.rows.push(new Row(0, 6, 1))
        this.rows.push(new Row(0, 5, 1))
        this.rows.push(new Row(0, 4, 1))
        this.rows.push(new Row(0, 3, 1))
        this.rows.push(new Row(0, 2, 1))
        this.rows.push(new Row(0, 1, 1))
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
