// Declare the variables that would be updated later
// declared here to make them global

// the image
var image;

// original dimensions of the picture
var pic_width;
var pic_heigth;

// dimensions of the canvas
var cwidth;
var cheight;

// dimensions of the image after resizing
var newHeight;
var newWidth;

// positions to provide to the drawPicture function
var drawposX;
var drawposY;

// 
var topAmount = null;
var leftAmount = null;

document.addEventListener("DOMContentLoaded", () => {

    // get the canvas we are going to draw the image on
    const canvas = document.getElementById('myImage');
    const context = canvas.getContext('2d');

    // get focus buttons
    const focus = document.getElementById("plus");
    focus.addEventListener("click",focButton,false)

    const defoc = document.getElementById("minus");
    defoc.addEventListener("click",focButton,false)

    // 
    let gMouseDownX = 0;
    let gMouseDownY = 0;
    let gMouseDownOffsetX = 0;
    let gMouseDownOffsetY = 0;

    // create new image object
    image = new Image();
    // image.src = "bulldog2.jpeg";
    image.src = "bulldog.jpg";


    image.onload= function(){

        // get the dimensions of the picture
        pic_width = this.width;
        pic_heigth = this.height;

        // get the dimensions of the canvas
        cwidth = canvas.width;
        cheight = canvas.height;

        drawPositions();

        // the variables used in drawing will be the w & h of the drawing point
        // and the w and height of the picture

        context.drawImage(image,drawposX,drawposY,newWidth,newHeight);

    };

    function drawPositions() {

        drawposX = -(pic_width - cwidth)/2;
        drawposY = -(pic_heigth - cheight)/2;

        let picHW = pic_heigth / pic_width;
        let cHW = cheight / cwidth;

        if (picHW < cHW) {
            newHeight = cheight;
            newWidth = cheight / picHW;

            drawposY = 0;
            drawposX = -(newWidth - cwidth) / 2;

        } else if (picHW > cHW) {
            newWidth = cwidth;
            newHeight = cwidth * picHW;

            drawposX = 0;
            drawposY = -(newHeight - cheight) / 2;

        } else {
            newHeight = cheight;
            newWidth = cwidth;

            drawposY= -(newHeight - cheight) / 2;
            drawposX = -(newWidth - cwidth)  / 2;
        }
    }

    function addListeners() {
        canvas.addEventListener('mousedown', mouseDown, false);
        window.addEventListener('mouseup', mouseUp, false);
    }

    function mouseUp() {
        window.removeEventListener('mousemove', divMove, true);
    }

    function mouseDown(e) {
        gMouseDownX = e.clientX;
        gMouseDownY = e.clientY;

        var div = document.getElementById('myImage');

        //The following block gets the X offset (the difference between where it starts and where it was clicked)
        
        let leftside;
        if (leftAmount === null) {
            leftside = drawposX;
        } else {
            leftside = leftAmount;
        }

        gMouseDownOffsetX = gMouseDownX - leftside;

        //The following block gets the Y offset (the difference between where it starts and where it was clicked)
        let topside;
        if (topAmount === null) {
            topside = drawposY;
        } else {
            topside = topAmount;
        }

        gMouseDownOffsetY = gMouseDownY - topside;

        window.addEventListener('mousemove', divMove, true);
    }

    function divMove(e) {

        topAmount = e.clientY - gMouseDownOffsetY;
        
        if ((newHeight + topAmount) < cheight) {    
            topAmount = -(newHeight - cheight);
            
          // ez a rész felelős azért, hogy ha full elhúzom a egyik irányba, elengedem és után
          // újra megpróbálom mozgatni, akkor elugrik a másikba
          // ez itt hibás  
        } else if ((newHeight + topAmount) > newHeight) {
            topAmount = 0;
        }

        leftAmount = e.clientX - gMouseDownOffsetX;
        
        if ((newWidth + leftAmount) < cwidth ) {    
            leftAmount = -(newWidth - cwidth);


        } else if ((newWidth + leftAmount) > newWidth) {
            leftAmount = 0;
        }

        context.drawImage(image,leftAmount,topAmount,newWidth,newHeight);
    }

    function focButton(e) {
        let action = e.target.value;

        // currently where the picture is drawn
        let currentPosY;
        let currentPosX;

        if (topAmount === null) {
            currentPosY = drawposY;
        } else {
            currentPosY = topAmount;
        }

        if (leftAmount === null) {
            currentPosX = drawposX;
        } else {
            currentPosX = leftAmount;
        }
    
        if (action === "plus") {
            newHeight = newHeight * 1.1;
            newWidth = newWidth * 1.1;

            topAmount = -(newHeight - cheight) / 2;
            leftAmount = -(newWidth - cwidth) / 2;

            context.drawImage(image,leftAmount,topAmount,newWidth,newHeight);
        }
        
        if (action === "minus") {
            if (newHeight != cheight && newWidth != cwidth) {
                newHeight = newHeight / 1.1;
                newWidth = newWidth / 1.1;
    
                topAmount = -(newHeight - cheight) / 2;
                leftAmount = -(newWidth - cwidth) / 2;
    
                context.drawImage(image,leftAmount,topAmount,newWidth,newHeight);
            
            }

        }
    }

    addListeners();

});