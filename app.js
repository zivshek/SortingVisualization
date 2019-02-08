let canvasW = 800;
let canvasH = 600;

let sortingVisualization = function(p) {
    
    let marginx = 40;
    let marginy = 60;
    let w = 5;
    let space = 0;

    let maxH = canvasH - marginy * 2;
    let bottomY = canvasH - marginy;
    let totalRecs = Math.floor((canvasW - marginx * 2)/ (w + space));

    let defaultRandomArray = [];
    let toSortArray = [];

    let bubbleTrackerOuter = 1;
    let bubbleTrackerInnder = -1;

    let sorted = false;

    p.setup = function() {
        p.createCanvas(canvasW, canvasH);

        defaultRandomArray = p.createRandomRecArray(totalRecs, marginx, space);
        toSortArray = defaultRandomArray.slice();
    };

    p.draw = function() {
        p.background(255);

        if (bubbleTrackerOuter != 1){
            for (let i = 0; i < 30; i++)
                p.bubbleSort();
        }

        for (let i = 0; i < toSortArray.length; i++) {
            toSortArray[i].draw(100);
        }
    };

    p.mouseClicked = function() {
        p.reset();
        bubbleTrackerOuter = toSortArray.length - 1;
        bubbleTrackerInnder = 0;
        // toSortArray = p.bubbleSort(toSortArray);
        // p.rePosition(toSortArray, marginx, space);
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

    p.rePosition = function() {
        for (let i = 0; i < toSortArray.length; i++) {
            toSortArray[i].x = marginx + w/2 + i * (w + space);
        }
    };

    p.bubbleSort = function() {
               
        // while (currEndIndex != 1) {
        //     for (let i = 0; i < array.length - 1; i++) {
        //         if (array[i].h > array[i + 1].h) {
        //             p.swap(array, i, i + 1);
        //             swapped = true;
        //         }
        //     }
        //let swapped = false;

        if (bubbleTrackerOuter != 1) {
            
            if (bubbleTrackerInnder < toSortArray.length - 1) {
                if (toSortArray[bubbleTrackerInnder].h > toSortArray[bubbleTrackerInnder+1].h){
                    p.swap(toSortArray, bubbleTrackerInnder, bubbleTrackerInnder+1);
                    swapped = true;
                    console.log("swapped");
                }
            }

            bubbleTrackerInnder++;
            
            if (bubbleTrackerInnder == toSortArray.length - 1){
                bubbleTrackerOuter--;
                bubbleTrackerInnder = 0;
            }
        }

        // if (!swapped)
        //     bubbleTrackerOuter = 1;

        p.rePosition();
    };

};

let sortingVisualizationP5 = new p5(sortingVisualization, window.document.getElementById('sorting'));