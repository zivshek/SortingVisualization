// ========== cslider.js ===========
// copied from https://editor.p5js.org/Comissar/sketches/IHUYuzjR
// bug fixes from Hao
// 1. fixed a bug that the spos starts from the middle of the slider
// 2. fixed mouse over check is incorrect

function createCSlider(p5, a, b, c, d) {
    r = new CSlider(p5, a, b, c, d);
    return r;
}

class CSlider {
    constructor(p5, min, max, value = (min + max) / 2, step = 1) {
        this.p5 = p5;
        this.width = 130;
        this.height = 20;
        this.widthtoheight = this.width - this.height;
        this.ratio = this.width / this.widthtoheight;
        this.x = 10;
        this.y = -1000;
        this.spos = this.x + this.width / 2 - this.height / 2;
        this.newspos = this.spos;
        this.sposMin = this.x - this.widthtoheight / 2;
        this.sposMax = this.x + this.widthtoheight / 2;
        this.vmin = min;
        this.vmax = max;
        this.svalue = this.p5.constrain(value, this.vmin, this.vmax);
        this.vstep = step;
        this.loose = 1;
        this.over = false;
        this.locked = false;
    }

    update(mouseX, mouseY) {
        this.over = this.mouseOver(mouseX, mouseY);
        if (this.p5.mouseIsPressed && this.over) {
            this.locked = true;
        }
        if (!this.p5.mouseIsPressed) {
            this.locked = false;
        }
        if (this.locked) {
            this.newspos = this.p5.constrain(this.p5.mouseX - this.height / 2, this.sposMin, this.sposMax);
            this.svalue = this.vmin + (this.vmax - this.vmin) * ((this.newspos - this.sposMin) / (this.sposMax - this.sposMin));
            if (this.vstep > 0) {
                this.svalue = this.p5.constrain(this.vmin + this.p5.round((this.svalue - this.vmin) / this.vstep) * this.vstep, this.vmin, this.vmax);
            }
            this.newspos = this.x - this.widthtoheight / 2 + this.widthtoheight * ((this.svalue - this.vmin) / (this.vmax - this.vmin));
        }
        if (this.p5.abs(this.newspos - this.spos) > 1) {
            this.spos = this.spos + (this.newspos - this.spos) / this.loose;
        }
    }

    mouseOver(x, y) {
        if (x > this.x - this.width / 2 && x < this.x + this.width / 2 &&
            y > this.y - this.height / 2 && y < this.y + this.height / 2) {
            return true;
        } else {
            return false;
        }
    }

    display() {
        this.p5.noStroke();
        this.p5.fill(204);
        this.p5.rect(this.x, this.y, this.width, this.height, 30);
        if (this.over || this.locked) {
            this.p5.fill(0, 0, 0);
        } else {
            this.p5.fill(102, 102, 102);
        }
        this.p5.rect(this.spos, this.y, this.height, this.height, 30);
    }

    getPos() {
        // Convert spos to be values between
        // 0 and the total width of the scrollbar
        return this.spos * this.ratio;
    }

    value() {
        return this.svalue;
    }

    position(xp, yp, mouseX = this.p5.mouseX, mouseY = this.p5.mouseY) {
        this.x = xp;
        this.y = yp;
        if (this.vstep > 0) {
            this.svalue = this.p5.constrain(this.vmin + this.p5.round((this.svalue - this.vmin) / this.vstep) * this.vstep, this.vmin, this.vmax);
        }
        this.spos = this.x - this.widthtoheight / 2 + this.widthtoheight * ((this.svalue - this.vmin) / (this.vmax - this.vmin));
        //console.log(this.smin);
        this.newspos = this.spos;
        this.sposMin = this.x - this.widthtoheight / 2;
        this.sposMax = this.x + this.widthtoheight / 2;
        this.p5.push();
        this.update(mouseX, mouseY);
        this.display();
        this.p5.pop();
    }
}