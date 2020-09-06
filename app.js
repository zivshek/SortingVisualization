const canvasW = 800;
const canvasH = 600;

let sortingVisualization = function (p) {

    let originalArray, toSortArray, rectWidth
    let sorter = null;
    const arraySize = 100;

    const buttonTexts = ["Bubble sort", "Selection sort", "Insertion sort", "Merge sort", "Quick sort", "Heap sort", "Reset", "Shuffle"];
    const resetButtonIndex = buttonTexts.length - 2;
    const shuffleButtonIndex = buttonTexts.length - 1;
    let buttons = [];
    let sorters = [];
    const buttonW = 150;
    const buttonH = 30;
    const buttonSpacing = 10;
    const maxButtonsPerLine = Math.floor((canvasW - 2 * buttonSpacing) / buttonW);
    const buttonStartX = buttonW / 2;
    const buttonStartY = 2 * buttonSpacing + buttonH / 2;

    let speedSlider;
    const sliderX = canvasW - 130;
    const sliderY = (buttonH + buttonSpacing) * 2;

    p.setup = function () {
        p.createCanvas(canvasW, canvasH);
        originalArray = Array.from(Array(arraySize), (_, i) => i);
        p.shuffle(originalArray);
        p.reset();
        rectWidth = canvasW / originalArray.length;

        speedSlider = p.createSlider(1, 50, 1, 1);

        speedSlider.position(sliderX, sliderY);
        console.log(sliderX);
        speedSlider.style('width', '120px');

        sorters.push(p.bubbleSort);

        let j = 0;
        let k = 0;
        for (let i = 0; i < buttonTexts.length; i++) {
            buttons.push(
                new CustomButton(
                    buttonStartX + j * (buttonW + buttonSpacing),
                    buttonStartY + k * (buttonH + buttonSpacing),
                    buttonW, buttonH, buttonTexts[i], i, p));
            j++;
            if (j == maxButtonsPerLine) {
                j = 0;
                k++;
            }
        }

        p.noStroke();
    };

    p.draw = function () {
        p.background(255);

        for (let i = 0; i < toSortArray.length; i++) {
            let columnHeight = p.map(toSortArray[i], 0, arraySize - 1, 5, canvasH * 3 / 4);
            p.rectMode(p.CORNER);
            p.fill(160);
            p.rect(i * rectWidth, canvasH, rectWidth, -columnHeight);
        }

        if (sorter != null) {
            if (sorter.next().done) {
                sorter = null;
            }
        }

        for (let i = 0; i < buttons.length; i++) {
            if (i === resetButtonIndex) {
                buttons[i].draw(p.color(200, 200, 0));
            } else if (i === shuffleButtonIndex) {
                buttons[i].draw(p.color(0, 200, 0));
            } else {
                buttons[i].draw(200);
            }
        }

        p.text('Speed', sliderX - 40, sliderY + 7);
    };

    p.shuffle = function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    p.mouseClicked = function () {
        let i = p.getClickedButtonId(p.mouseX, p.mouseY);
        console.log(i);
        if (i != -1) {
            if (i === resetButtonIndex) {
                p.reset();
            } else if (i === shuffleButtonIndex) {
                p.shuffle(originalArray);
                p.reset();
            } else {
                sorter = sorters[i]();
            }
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

    p.reset = function () {
        sorter = null;
        toSortArray = originalArray.slice();
    };

    p.bubbleSort = function* () {
        let swapped;
        let loopCount = 0;
        do {
            swapped = false;
            for (let i = 0; i < toSortArray.length - 1; i++) {
                if (toSortArray[i] > toSortArray[i + 1]) {
                    [toSortArray[i], toSortArray[i + 1]] = [toSortArray[i + 1], toSortArray[i]];
                    swapped = true;
                }

                loopCount++;
                if (loopCount % speedSlider.value() == 0) {
                    yield;
                }
            }
        } while (swapped);
    };
};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));