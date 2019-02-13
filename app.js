let canvasW = 800;
let canvasH = 600;

let sortingVisualization = function(p) {
    
    let marginx = 40;
    let marginy = 60;
    let w = 2;
    let space = 0;

    let maxH = canvasH - marginy * 2;
    let bottomY = canvasH - marginy;
    let totalRecs = Math.floor((canvasW - marginx * 2)/ (w + space));

    let defaultRandomArray = [];
    let toSortArray = [];

    let sorted = false;
    let speed = 50;

    p.setup = function() {
        p.createCanvas(canvasW, canvasH);

        defaultRandomArray = p.createRandomRecArray(totalRecs, marginx, space);
        toSortArray = defaultRandomArray.slice();
    };

    p.draw = function() {
        p.background(255);

        if (!sorted) {
            p.bubbleSort().next();  
        }
        
        for (let i = 0; i < toSortArray.length; i++) {
            toSortArray[i].draw(100);
        }
    };

    p.mouseClicked = function() {
        p.reset();
        
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
        sorted = false;
    };

    p.rePosition = function() {
        for (let j = 0; j < toSortArray.length; j++) {
            toSortArray[j].x = marginx + w/2 + j * (w + space);
        }
    };

    p.bubbleSort = function*() {     
        let swapped;
        do {
            swapped = false;
            for (let i = 0; i < toSortArray.length - 1; i++) {
                if (toSortArray[i].h > toSortArray[i+1].h) {
                    p.swap(toSortArray, i, i+1);
                    swapped = true;
                    
                    if (i % speed == 0){
                        p.rePosition();
                        yield i;
                    }
                }
            }
        } while (swapped);
        p.rePosition();
        sorted = true;
    };

};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));