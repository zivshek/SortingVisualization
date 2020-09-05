let canvasW = 800;
let canvasH = 800;

let sortingVisualization = function (p) {

    let marginx = 40;
    let marginy = 260;
    let w = 20;
    let space = 0;

    let maxH = canvasH - marginy * 2;
    let bottomY = canvasH - marginy;
    let totalRecs = Math.floor((canvasW - marginx * 2) / (w + space));

    let defaultRandomArray = [];
    let toSortArray = [];

    let sorted = false;
    let sorting = false;
    let speed = 50;

    let buttonTexts = ["Bubble sort", "Selection sort", "Insertion sort", "Merge sort", "Quick sort", "Heap sort"];
    let buttons = [];
    let buttonW = 100;
    let buttonH = 30;
    let buttonSpacing = 10;
    let buttonStartX = marginx + buttonW / 2;
    let buttonStartY = bottomY + buttonSpacing + buttonH / 2;

    let currentSortingFunc;
    let sortingFuncs = [];

    p.setup = function () {
        p.createCanvas(canvasW, canvasH);

        defaultRandomArray = p.createRandomRecArray(totalRecs, marginx, space);
        toSortArray = defaultRandomArray.slice();

        sortingFuncs.push(p.bubbleSort);
        sortingFuncs.push(p.selectionSort);

        for (let i = 0; i < buttonTexts.length; i++) {
            buttons.push(new CustomButton(buttonStartX + i * (buttonW + buttonSpacing), buttonStartY, buttonW, buttonH, buttonTexts[i], i, p));
        }
    };

    p.draw = function () {
        p.background(240);

        if (!sorted && sorting) {
            currentSortingFunc().next();
        }

        for (let i = 0; i < toSortArray.length; i++) {
            toSortArray[i].x = marginx + w / 2 + i * (w + space);
            toSortArray[i].draw(100);
        }

        for (let i = 0; i < buttons.length; i++) {
            buttons[i].draw(200);
        }
    };

    p.mouseClicked = function () {
        let i = p.getClickedButtonId(p.mouseX, p.mouseY);
        if (i == -1 || i > sortingFuncs.length - 1) {
            currentSortingFunc = null;
            p.reset();
        }
        else {
            currentSortingFunc = sortingFuncs[i];
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
    }

    p.createRandomRecArray = function (count, startx, space) {
        let array = new Array(count);
        for (let i = 0; i < count; i++) {
            array[i] = new Rec(w, maxH, startx + w / 2 + i * (w + space), bottomY, p);
        }
        return array;
    };

    p.swap = function (array, i1, i2) {
        let temp = array[i1];
        array[i1] = array[i2];
        array[i2] = temp;
    }

    p.reset = function () {
        toSortArray = defaultRandomArray.slice();
        sorted = false;
        sorting = false;
    };

    p.bubbleSort = function* () {
        for (let j = toSortArray.length - 1; j > 0; j--) {
            for (let i = 0; i < j; i++) {
                if (toSortArray[i].h > toSortArray[i + 1].h) {
                    p.swap(toSortArray, i, i + 1);
                }
                yield;
            }
        }
        sorted = true;
    };

    p.selectionSort = function* () {
        let swapped;
        let sortedCount = 0;
        do {
            swapped = false;
            let currentSmallestIndex = sortedCount;
            for (let i = sortedCount; i < toSortArray.length - 1; i++) {
                if (toSortArray[i].h < toSortArray[currentSmallestIndex].h) {
                    currentSmallestIndex = i;
                    swapped = true;
                }
            }
            if (swapped) {
                p.swap(toSortArray, sortedCount, currentSmallestIndex);
                sortedCount++;

                yield;
            }
        } while (swapped);
        sorted = true;
    };
};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));