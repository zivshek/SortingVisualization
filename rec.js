class Rec {

    constructor(w, maxh, x, bottomy, p5) {
        this.p5 = p5;
        this.w = w;
        // randomly set height between 1 and maxh
        this.h = Math.floor(Math.random() * (maxh - 1)) + 1;
        this.x = x;
        this.y = bottomy - this.h / 2;
    }

    draw(color) {
        this.p5.rectMode(this.p5.CENTER);
        this.p5.noStroke();
        this.p5.fill(color);
        this.p5.rect(this.x, this.y, this.w, this.h);
    }
}