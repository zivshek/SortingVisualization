let canvasW = 800;
let canvasH = 800;

let sortingVisualization = function (p) {

    let numbers, columnWidth, sorter, sorting;

    let buttonTexts = ["Bubble sort", "Selection sort", "Insertion sort", "Merge sort", "Quick sort", "Heap sort"];
    let buttons = [];
    let buttonW = 100;
    let buttonH = 30;
    let buttonSpacing = 10;
    let buttonStartX = buttonW / 2;
    let buttonStartY = buttonSpacing + buttonH / 2;

    p.setup = function () {
        p.createCanvas(canvasW, canvasH);

        numbers = Array(50).fill().map(() => p.random(1));
        columnWidth = canvasW / numbers.length;
        sorter = p.bubbleSort();

        for (let i = 0; i < buttonTexts.length; i++) {
            buttons.push(new CustomButton(buttonStartX + i * (buttonW + buttonSpacing), buttonStartY, buttonW, buttonH, buttonTexts[i], i, p));
        }

        p.noStroke();
    };

    p.draw = function () {
        p.background(0);

        for (let i = 0; i < numbers.length; i++) {
            let columnHeight = p.map(numbers[i], 0, 1, 0, canvasH);
            p.rect(i * columnWidth, canvasH, columnWidth, -columnHeight);
        }

        if (sorting) {
            if (sorter.next().done) {
                sorting = false;
            }
        }

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].draw(200);
        }
    };

    p.mouseClicked = function () {
        let i = p.getClickedButtonId(p.mouseX, p.mouseY);
        console.log(i);
        if (i == -1) {

        }
        else {
            console.log(sorting);
            sorting = true;
        }
    };

    p.getClickedButtonId = function (x, y) {
        for (let i = 0; i < buttons.length; i++) {
            if (buttons[i].clicked(x, y)) {
                return buttons[i].id;
            }
        }
        return -1;
    };

    p.bubbleSort = function* () {
        for (let i = numbers.length - 1; i > 0; i--) {
            for (let j = 0; j < i; j++) {
                if (numbers[j] > numbers[j + 1]) {
                    // swap
                    let t = numbers[j];
                    numbers[j] = numbers[j + 1];
                    numbers[j + 1] = t;
                }
                yield;
            }
        }
    };
};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));