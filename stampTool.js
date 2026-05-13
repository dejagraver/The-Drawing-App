// Preload stamp images before sketch starts
function preloadStampImages() {
    stampImages = []; 
    let stampFilenames = [
        'assets/pinkFlowersStamp1.png',
        'assets/Sparklesstamp2.png'
    ];
    for (let filename of stampFilenames) {
        stampImages.push(loadImage(filename));
    }
}

// Helper function to draw stamp centered at mouse position
function drawStampAtMouse(stampImage, size) {
    let x = mouseX - size / 2;
    let y = mouseY - size / 2;
    image(stampImage, x, y, size, size);
}

// stampTool.js
// Stamp tool - places images or geometric shapes on canvas
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)

function StampTool() {
    // Tool configuration
    this.icon = "assets/stampIcon.png";
    this.name = "StampTool";

    // Stamp settings and state tracking
    var selectedStampIndex = 0;
    var sizeSlider;
    var opacitySlider;
    var stampTypeSelect;
    var stampSelect;
    var stampType = 'image';
    var wasDrawing = false;

    // Populate tool options panel with stamp controls
    this.populateOptions = function() {
        select("#toolPanelContent").html("");

        // Stamp type dropdown selector
        createDiv("Type").parent(select("#toolPanelContent"));
        stampTypeSelect = createSelect();
        stampTypeSelect.option('Image', 'image');
        stampTypeSelect.option('Circle', 'circle');
        stampTypeSelect.option('Triangle', 'triangle');
        stampTypeSelect.option('Square', 'square');
        stampTypeSelect.option('Rectangle', 'rectangle');
        stampTypeSelect.option('Star', 'star');
        stampTypeSelect.option('Octagon', 'octagon');
        stampTypeSelect.parent(select("#toolPanelContent"));
        stampTypeSelect.changed(() => {
            stampType = stampTypeSelect.value();
            if (stampType === 'image') {
                select('#stampGrid').show();
            } else {
                select('#stampGrid').hide();
            }
        });
        // Create grid for stamp image selection
        var stampGrid = createDiv();
        stampGrid.id('stampGrid');
        stampGrid.parent(select("#toolPanelContent"));
        stampGrid.style('display', 'grid');
        stampGrid.style('grid-template-columns', 'repeat(2, 1fr)');
        stampGrid.style('gap', '5px');
        stampGrid.style('margin-top', '10px');
        
        // Populate grid with stamp images
        for (let i = 0; i < stampImages.length; i++) {
            let imgDiv = createDiv();
            imgDiv.parent(stampGrid);
            imgDiv.style('width', '60px');
            imgDiv.style('height', '60px');
            imgDiv.style('border', '2px solid transparent');
            imgDiv.style('border-radius', '5px');
            imgDiv.style('cursor', 'pointer');
            imgDiv.style('overflow', 'hidden');
            imgDiv.style('display', 'flex');
            imgDiv.style('align-items', 'center');
            imgDiv.style('justify-content', 'center');
            imgDiv.style('transition', 'transform 0.2s ease');
            
            let img = createImg(stampImages[i].canvas.toDataURL());
            img.parent(imgDiv);
            img.style('max-width', '100%');
            img.style('max-height', '100%');
            
            imgDiv.mousePressed(() => {
                selectedStampIndex = i;
                selectAll('#stampGrid > div').forEach(el => el.style('border', '2px solid transparent'));
            });
            
            imgDiv.elt.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            imgDiv.elt.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        }

        // Size and opacity sliders
        createDiv("Size").parent(select("#toolPanelContent"));
        sizeSlider = createSlider(20, 200, 200);
        sizeSlider.parent(select("#toolPanelContent"));
        
        createDiv("Opacity").parent(select("#toolPanelContent"));
        opacitySlider = createSlider(0, 255, 255);
        opacitySlider.parent(select("#toolPanelContent"));
    };

    // Main draw function - places stamps on canvas
    this.draw = function() {
        // Draw stamp when mouse pressed over canvas
        if (mouseIsPressed && helpers.isMouseOverCanvas()) {
            wasDrawing = true;
            let size = sizeSlider ? sizeSlider.value() : 50;
            let opacity = opacitySlider ? opacitySlider.value() : 255;
            let c = colorP.selectedColour;

            // Draw selected stamp type
            if (stampType === 'image' && stampImages && stampImages[selectedStampIndex]) {
                tint(255, opacity);
                drawStampAtMouse(stampImages[selectedStampIndex], size);
                noTint();
            } else if (stampType === 'circle') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                ellipse(mouseX, mouseY, size, size);
            } else if (stampType === 'triangle') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                triangle(
                    mouseX, mouseY - size / 2,
                    mouseX - size / 2, mouseY + size / 2,
                    mouseX + size / 2, mouseY + size / 2
                );
            } else if (stampType === 'square') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                rectMode(CENTER);
                rect(mouseX, mouseY, size, size);
            } else if (stampType === 'rectangle') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                rectMode(CENTER);
                rect(mouseX, mouseY, size, size * 0.6);
            } else if (stampType === 'star') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                push();
                translate(mouseX, mouseY);
                beginShape();
                for (let i = 0; i < 10; i++) {
                    let angle = TWO_PI / 10 * i - HALF_PI;
                    let r = i % 2 === 0 ? size / 2 : size / 4;
                    let x = cos(angle) * r;
                    let y = sin(angle) * r;
                    vertex(x, y);
                }
                endShape(CLOSE);
                pop();
            } else if (stampType === 'octagon') {
                fill(red(c), green(c), blue(c), opacity);
                noStroke();
                push();
                translate(mouseX, mouseY);
                beginShape();
                for (let i = 0; i < 8; i++) {
                    let angle = TWO_PI / 8 * i - HALF_PI;
                    let x = cos(angle) * size / 2;
                    let y = sin(angle) * size / 2;
                    vertex(x, y);
                }
                endShape(CLOSE);
                pop();
            }
        }
        // Save state for undo/redo when stamping finishes
        else if (wasDrawing) {
            loadPixels();
            saveState();
            wasDrawing = false;
        }
    };
}