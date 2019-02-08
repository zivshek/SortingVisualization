let canvasW = 800;
let canvasH = 600;

let sortingVisualization = function(p) {
    
    let marginx = 40;
    let marginy = 60;
    let w = 5;
    let space = 1;

    let maxH = canvasH - marginy * 2;
    let bottomY = canvasH - marginy;
    let totalRecs = Math.floor((canvasW - marginx * 2)/ (w + space));

    let defaultRandomArray = [];
    let toSortArray = [];

    p.getToSortArray = function() {
        return toSortArray;
    };

    let sorted = false;

    p.setup = function() {
        p.createCanvas(canvasW, canvasH);

        defaultRandomArray = p.createRandomRecArray(totalRecs, marginx, space);
        toSortArray = defaultRandomArray.slice();
    };

    p.draw = function() {
        p.background(255);

        for (let i = 0; i < toSortArray.length; i++) {
            toSortArray[i].draw(100);
        }
    };

    p.mouseClicked = function() {
        toSortArray = p.bubbleSort(toSortArray);
        p.rePosition(toSortArray, marginx, space);
    };

    p.createRandomRecArray = function(count, startx, space) {
        let array = new Array(count);
        for (let i = 0; i < count; i++) {
            array[i] = new Rec(w, maxH, startx + w/2 + i * (w + space), bottomY, p);
        }
        return array;
    };

    p.swap = function(array, i1, i2){
        let temp = array[i1];
        array[i1] = array[i2];
        array[i2] = temp;
    }

    p.reset = function() {
        toSortArray = defaultRandomArray.slice();
    };

    p.rePosition = function(array, startx, space) {
        for (let i = 0; i < array.length; i++) {
            array[i].x = startx + w/2 + i * (w + space);
        }
    };

    p.bubbleSort = function(array) {
        p.reset();
        let swapped = false;
        let currEndIndex = array.length - 1;
        
        while (currEndIndex != 1) {
            for (let i = 0; i < array.length - 1; i++) {
                if (array[i].h > array[i + 1].h) {
                    p.swap(array, i, i + 1);
                    swapped = true;
                }
            }
            
            // if nothing swapped this round, it means the array is sorted
            if (!swapped)
                break;
            
            currEndIndex--;
            swapped = false;
        }
        sorted = true;
        return array;
    };

};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));