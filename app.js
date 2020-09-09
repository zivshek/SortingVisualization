const canvasW = 800;
const canvasH = 600;

let sortingVisualization = function (p) {

    let originalArray, toSortArray, rectWidth
    let sorter = null;
    let sorterIndex = -1;
    const arraySize = 200;

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
    const sliderX = canvasW - 80;
    const sliderY = (buttonH + buttonSpacing) * 2;

    let popup;
    let popupFont;

    p.preload = function () {
        popupFont = p.loadFont('assets/Arial.otf');
    }

    p.setup = function () {
        p.createCanvas(canvasW, canvasH);
        originalArray = Array.from(Array(arraySize), (_, i) => i);
        p.shuffle(originalArray);
        p.reset();
        rectWidth = canvasW / originalArray.length;

        speedSlider = createCSlider(p, 1, 100, 2, 1);

        sorters.push(p.bubbleSort);
        sorters.push(p.selectionSort);
        sorters.push(p.insertionSort);
        sorters.push(p.mergeSort);
        sorters.push(p.quickSort);
        sorters.push(p.heapSort);

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

        popup = new Popup(p, canvasW / 2, canvasH / 2, popupFont);

        p.noStroke();
    };

    p.draw = function () {
        p.clear();
        p.background(255);

        p.push();
        for (let i = 0; i < toSortArray.length; i++) {
            let columnHeight = p.map(toSortArray[i], 0, arraySize - 1, 1, canvasH * 3 / 4);
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

        speedSlider.position(sliderX, sliderY);
        p.textAlign(p.CENTER);
        p.textSize(15);
        p.fill(p.color(52, 66, 145));
        p.text('Speed: ' + speedSlider.value(), sliderX - 110, sliderY + 5);
        p.pop();

        popup.update();
        popup.draw();
    };

    p.shuffle = function (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
    }

    p.mouseClicked = function () {
        let i = p.getClickedButtonId(p.mouseX, p.mouseY);
        if (i != -1) {
            if (i === resetButtonIndex) {
                p.reset();
            } else if (i === shuffleButtonIndex) {
                p.shuffle(originalArray);
                p.reset();
            } else {
                if (sorter != null) {
                    popup.setMsg(buttonTexts[sorterIndex] + " is running...");
                    popup.start();
                    return;
                }
                sorterIndex = i;
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
        if (sorter != null) {
            sorter.return();
            sorter = null;
            sorterIndex = -1;
        }
        toSortArray = originalArray.slice();
    };

    p.bubbleSort = function* () {
        let swapped;
        let sortedCount = 0;
        let loopCount = 0;
        do {
            swapped = false;
            for (let i = 0; i < toSortArray.length - 1 - sortedCount; i++) {
                if (toSortArray[i] > toSortArray[i + 1]) {
                    p.swap(toSortArray, i, i + 1);
                    swapped = true;
                }

                if (++loopCount % speedSlider.value() == 0) {
                    yield;
                }
            }

            sortedCount++;
        } while (swapped);
    };

    p.selectionSort = function* () {
        let loopCount = 0;

        for (let i = 0; i < toSortArray.length - 1; i++) {
            let minIndex = i;
            for (let j = i + 1; j < toSortArray.length; j++) {
                if (toSortArray[minIndex] > toSortArray[j]) {
                    minIndex = j;
                }
                if (++loopCount % speedSlider.value() == 0) {
                    yield;
                }
            }
            if (minIndex != i) {
                p.swap(toSortArray, i, minIndex);
            }
        }
    };

    p.insertionSort = function* () {
        let loopCount = 0;
        for (let i = 0; i < toSortArray.length; i++) {
            let j = i + 1;
            while (j > 0 && toSortArray[j] < toSortArray[j - 1]) {
                p.swap(toSortArray, j, j - 1);
                j--;
                if (++loopCount % speedSlider.value() == 0) {
                    yield;
                }
            }
        }
    };

    p.mergeSort = function* () {
        for (let currSize = 1; currSize < toSortArray.length; currSize *= 2) {
            for (let leftStart = 0; leftStart < toSortArray.length; leftStart += currSize * 2) {
                let mid = leftStart + currSize;
                let left = toSortArray.slice(leftStart, mid);
                let right = toSortArray.slice(mid, mid + currSize);
                yield* p.merge(left, right, leftStart, toSortArray);
            }
        }
    };

    p.merge = function* (left, right, start, a) {
        let nl = left.length;
        let nr = right.length;
        let il = 0;
        let ir = 0;
        let ia = start;
        let loopCount = 0;
        while (il < nl && ir < nr) {
            if (left[il] <= right[ir]) {
                a[ia++] = left[il++];
            }
            else {
                a[ia++] = right[ir++];
            }
            if (++loopCount % speedSlider.value() == 0) {
                yield;
            }
        }

        while (il < nl) {
            a[ia++] = left[il++];
            if (++loopCount % speedSlider.value() == 0) {
                yield;
            }
        }

        while (ir < nr) {
            a[ia++] = right[ir++];
            if (++loopCount % speedSlider.value() == 0) {
                yield;
            }
        }
    }

    p.quickSort = function* () {
        let start = 0;
        let end = toSortArray.length - 1;
        let stack = new Array(end - start + 1);
        let top = -1;
        stack[++top] = start;
        stack[++top] = end;
        let loopCount = 0;
        while (top >= 0) {
            end = stack[top--];
            start = stack[top--];

            let pivot = start;
            let i = start;
            let j = end + 1;
            while (i < j) {
                do {
                    i++;
                    if (++loopCount % speedSlider.value() == 0) {
                        yield;
                    }
                } while (toSortArray[i] <= toSortArray[pivot]);

                do {
                    j--;
                    if (++loopCount % speedSlider.value() == 0) {
                        yield;
                    }
                } while (toSortArray[j] > toSortArray[pivot]);

                if (i < j) {
                    p.swap(toSortArray, i, j);
                }
            }
            p.swap(toSortArray, pivot, j);
            pivot = j;

            if (pivot - start > 1) {
                stack[++top] = start;
                stack[++top] = pivot - 1;
            }

            if (end - pivot > 1) {
                stack[++top] = pivot + 1;
                stack[++top] = end;
            }
        }
    };

    p.heapSort = function* () {

    };

    p.swap = function (arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
    };
};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));
