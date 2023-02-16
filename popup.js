class Popup {
    constructor(p5, x, y, font, timer = 2000) { // 2 secs
        this.msg = 'N/A';
        this._timer = timer;
        this.p5 = p5;
        this.x = x;
        this.y = y;
        this.alpha = 0;
        this.active = false;
        this.fontSize = 25;
        this.font = font;
    }

    reset() {
        this.timer = this._timer;
        this.alpha = 0;
        this.active = false;
    }

    setMsg(msg) {
        this.msg = msg;
        let bounds = this.font.textBounds(msg, this.x, this.y, this.fontSize);
        this.w = bounds.w + 30;
        this.h = bounds.h + 30;
        return this;
    }

    start() {
        this.reset(); // if this is called while a timer is already running, turn it off and display the new msg
        this.active = true;
    }

    update() {
        if (!this.active) {
            return;
        }

        if (this.timer > 0) {
            if (this.timer >= this._timer * 4 / 5) {
                this.alpha += this.p5.deltaTime / 1000 * 3;
                this.alpha = Math.min(1, this.alpha);
            } else if (this.timer <= this._timer / 5) {
                this.alpha -= this.p5.deltaTime / 1000 * 3;
                this.alpha = Math.max(0, this.alpha);
            }
            this.timer -= this.p5.deltaTime;
        } else {
            this.reset();
        }
    }

    draw() {
        if (this.active) {
            let a = this.p5.map(this.alpha, 0, 1, 0, 255);
            this.p5.push();
            this.p5.strokeWeight(2);
            this.p5.stroke(255, 189, 27, a);
            this.p5.rectMode(this.p5.CENTER);
            this.p5.fill(231, 84, 128, a * 0.7);
            this.p5.rect(this.x, this.y, this.w, this.h, 3);
            this.p5.textSize(this.fontSize);
            this.p5.noStroke();
            this.p5.fill(0, 0, 0, a);
            this.p5.textAlign(this.p5.CENTER);
            this.p5.text(this.msg, this.x, this.y);
            this.p5.pop();
        }
    }
}