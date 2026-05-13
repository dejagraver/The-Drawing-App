// eraserTool.js
// Cut and erase modes - removes portions of the canvas
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)
// start of my code
function eraserTool() {
    // Tool configuration
    this.icon = "assets/scissorsTool.svg";
    this.name = "eraserTool";

    // Store selected area coordinates and dimensions
    var selectedArea = {
        startX: -1,
        startY: -1,
        endX: -1,
        endY: -1
    };
    var isSelecting = false;
    var hasDrawn = false;
    var selectedMode = null; // Track which mode is active
    var eraserSizeSlider; // Slider for eraser size
    var previewDiv; // Preview circle for eraser size

    // Populate tool options panel with mode selection grid
    this.populateOptions = function() {
        select("#toolPanelContent").html("");
        
        // Create mode selection grid
        createDiv("Edit Mode").parent(select("#toolPanelContent"));
        var modeGrid = createDiv();
        modeGrid.parent(select("#toolPanelContent"));
        modeGrid.style('display', 'grid');
        modeGrid.style('grid-template-columns', 'repeat(2, 1fr)');
        modeGrid.style('gap', '5px');
        modeGrid.style('margin-top', '10px');
        modeGrid.style('margin-bottom', '15px');
        
        // Define edit modes
        var modes = [
            {name: 'cut', icon: 'assets/scissor.png'},
            {name: 'erase', icon: 'assets/eraser.svg'}
        ];
        
        // Create button for each mode
        for (let i = 0; i < modes.length; i++) {
            let btnDiv = createDiv();
            btnDiv.parent(modeGrid);
            btnDiv.style('width', '40px');
            btnDiv.style('height', '40px');
            btnDiv.style('border', '2px solid transparent');
            btnDiv.style('border-radius', '5px');
            btnDiv.style('cursor', 'pointer');
            btnDiv.style('display', 'flex');
            btnDiv.style('align-items', 'center');
            btnDiv.style('justify-content', 'center');
            btnDiv.style('background-color', '#f0f0f0');
            
            let img = createImg(modes[i].icon);
            img.parent(btnDiv);
            img.style('max-width', '80%');
            img.style('max-height', '80%');
            
            let modeName = modes[i].name;
            btnDiv.mousePressed(() => {
                selectedMode = modeName;
                // Highlight selected button
                selectAll('#toolPanelContent > div > div').forEach(el => el.style('border', '2px solid transparent'));
                btnDiv.style('border', '2px solid #f299cd');
            });
        }
        
        // Eraser size slider with preview
        createDiv("Eraser Size").parent(select("#toolPanelContent"));
        
        var sliderContainer = createDiv("");
        sliderContainer.parent(select("#toolPanelContent"));
        sliderContainer.style("display", "flex");
        sliderContainer.style("align-items", "center");
        sliderContainer.style("gap", "10px");
        
        eraserSizeSlider = createSlider(10, 100, 30);
        eraserSizeSlider.parent(sliderContainer);
        eraserSizeSlider.mousePressed((e) => { e.stopPropagation(); });
        
        previewDiv = createDiv("");
        previewDiv.parent(sliderContainer);
        previewDiv.style("width", "30px");
        previewDiv.style("height", "30px");
        previewDiv.style("border-radius", "50%");
        previewDiv.style("background-color", "black");
        previewDiv.style("flex-shrink", "0");
        previewDiv.style("margin-top", "5px");
        
        eraserSizeSlider.input(() => {
            let size = eraserSizeSlider.value();
            previewDiv.style("width", size + "px");
            previewDiv.style("height", size + "px");
        });
        
        createDiv("Select a mode, then drag on canvas").parent(select("#toolPanelContent"));
    };

    // Main draw function - handles cut and erase modes
    this.draw = function() {
        // Cut mode - rectangular selection
        if(selectedMode === 'cut' && mouseIsPressed && helpers.isMouseOverCanvas()) {
            if(!isSelecting) {
                // Start new selection
                selectedArea.startX = mouseX;
                selectedArea.startY = mouseY;
                isSelecting = true;
                // loadPixels() - Captures current canvas state to allow updatePixels() to restore it
                loadPixels();
            }
            
            // Update end position as mouse moves
            selectedArea.endX = mouseX;
            selectedArea.endY = mouseY;
            
            // updatePixels() - Restores canvas to saved state, removing previous border
            updatePixels();
            
            // Calculate rectangle bounds
            let x = min(selectedArea.startX, selectedArea.endX);
            let y = min(selectedArea.startY, selectedArea.endY);
            let w = abs(selectedArea.endX - selectedArea.startX);
            let h = abs(selectedArea.endY - selectedArea.startY);
            
            // push() - Saves current drawing settings (stroke, fill, etc.)
            push();
            noFill();
            stroke(255, 150, 0, 100);
            strokeWeight(2);
            rect(x, y, w, h);
            // pop() - Restores previous drawing settings
            pop();
            
            hasDrawn = true;
        }
        //Erase mode - circular eraser
        else if(selectedMode === 'erase' && mouseIsPressed && helpers.isMouseOverCanvas()) {
            let size = eraserSizeSlider ? eraserSizeSlider.value() : 30;
            fill(255);
            noStroke();
            ellipse(mouseX, mouseY, size, size);
            hasDrawn = true;
        }
        else if(hasDrawn) {
            // Only save state for cut mode (erase mode saves continuously)
            if(selectedMode === 'cut') {
                // updatePixels() - Removes the orange border by restoring canvas to saved state
                updatePixels();
                
                // Calculate final selection area
                let x = min(selectedArea.startX, selectedArea.endX);
                let y = min(selectedArea.startY, selectedArea.endY);
                let w = abs(selectedArea.endX - selectedArea.startX);
                let h = abs(selectedArea.endY - selectedArea.startY);
                
                // Draw white rectangle to erase selected area
                fill(255);
                noStroke();
                rect(x, y, w, h);
            }
            
            //loadPixels() - Captures the erased canvas for undo/redo
            loadPixels();
            // saveState() - Saves canvas to undo/redo history
            saveState();
            
            // Reset
            isSelecting = false;
            hasDrawn = false;
            selectedArea = {startX: -1, startY: -1, endX: -1, endY: -1};
        }
    };
}

// end of my code