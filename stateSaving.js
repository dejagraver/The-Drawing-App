// stateSaving.js
// Save/load canvas states to localStorage and download images
// Used by: sketch.js (initial toolbox setup), localStorage API

function StateSavingTool() {
    this.icon = "assets/stateSaving.svg";
    this.name = "stateSaving";
    
    var savedBackgrounds = [];
    var previewsVisible = false;
    
    // Image upload variables
    var uploadedImage = null;
    var hasImageToPlace = false;
    
    // Slider variables for image customization
    var opacitySlider;
    var sizeSlider;
    var opacityPreview;
    
    // Load saved backgrounds on init
    var stored = localStorage.getItem('savedBackgrounds');
    if (stored) {
        savedBackgrounds = JSON.parse(stored);
    }
    
    this.populateOptions = function() {
        select("#toolPanelContent").html("");
        var self = this;
        
        var saveBtn = createButton('Save to Image Gallery');
        saveBtn.parent(select("#toolPanelContent"));
        saveBtn.style('display', 'block');
        saveBtn.style('margin-bottom', '10px');
        saveBtn.mousePressed(function() {
            loadPixels();
            var canvas = get();
            var dataURL = canvas.canvas.toDataURL();
            savedBackgrounds.push({image: dataURL, timestamp: Date.now()});
            localStorage.setItem('savedBackgrounds', JSON.stringify(savedBackgrounds));
            if (previewsVisible) {
                displayPreviews();
            }
        });

        var saveImageBtn = createButton('Save Image to Computer');
        saveImageBtn.parent(select("#toolPanelContent"));
        saveImageBtn.style('display', 'block');
        saveImageBtn.style('margin-bottom', '15px');
        saveImageBtn.mousePressed(function() {
            saveCanvas('myPicture', 'jpg');
        });
        
        // Image Upload Section
        var uploadLabel = createDiv('Upload Image to Place on Canvas');
        uploadLabel.parent(select("#toolPanelContent"));
        uploadLabel.style('margin-bottom', '5px');
        uploadLabel.style('font-size', '14px');
        uploadLabel.style('font-weight', 'bold');
        
        var uploadInput = createFileInput(function(file) {
            if (file.type === 'image') {
                uploadedImage = null;
                hasImageToPlace = false;
                loadImage(file.data, function(img) {
                    uploadedImage = img;
                    hasImageToPlace = true;
                    // Reset sliders to default
                    if (opacitySlider) opacitySlider.elt.value = 255;
                    if (sizeSlider) sizeSlider.elt.value = 200;
                    // Update previews
                    if (opacityPreview) opacityPreview.style('background-color', 'rgba(0, 0, 0, 1)');
                });
            }
        });
        uploadInput.parent(select("#toolPanelContent"));
        uploadInput.style('display', 'block');
        uploadInput.style('margin-bottom', '15px');
        uploadInput.style('width', '100%');
        uploadInput.style('padding', '8px 12px');
        uploadInput.style('border-radius', '8px');
        uploadInput.style('border', '1px solid #D2C9CE');
        uploadInput.style('background', 'white');
        uploadInput.style('color', '#1F2937');
        uploadInput.style('font-size', '14px');
        uploadInput.style('box-sizing', 'border-box');
        
        // Opacity slider (0-255)
        createDiv("Opacity").parent(select("#toolPanelContent"));
        
        var opacityContainer = createDiv("");
        opacityContainer.parent(select("#toolPanelContent"));
        opacityContainer.style("display", "flex");
        opacityContainer.style("align-items", "center");
        opacityContainer.style("gap", "10px");
        
        opacitySlider = createSlider(0, 255, 255, 1);
        opacitySlider.parent(opacityContainer);
        opacitySlider.mousePressed((e) => { e.stopPropagation(); });
        
        opacityPreview = createDiv("");
        opacityPreview.parent(opacityContainer);
        opacityPreview.style("width", "20px");
        opacityPreview.style("height", "20px");
        opacityPreview.style("border-radius", "50%");
        opacityPreview.style("background-color", "rgba(0, 0, 0, 1)");
        opacityPreview.style("flex-shrink", "0");
        opacityPreview.style("margin-top", "5px");
        
        opacitySlider.input(() => {
            var opacity = opacitySlider.value() / 255;
            opacityPreview.style("background-color", "rgba(0, 0, 0, " + opacity + ")");
        });
        
        // Size slider (10-500)
        createDiv("Size").parent(select("#toolPanelContent"));
        
        sizeSlider = createSlider(10, 500, 200);
        sizeSlider.parent(select("#toolPanelContent"));
        sizeSlider.mousePressed((e) => { e.stopPropagation(); });
        
        // Instruction text
        var instructionText = createDiv('Click on canvas to place image');
        instructionText.parent(select("#toolPanelContent"));
        instructionText.style('margin-top', '10px');
        instructionText.style('font-size', '12px');
        instructionText.style('color', '#666');
        instructionText.style('font-style', 'italic');

        // Saved Backgrounds Gallery Toggle - moved below sliders
        var toggleBtn = createButton('Show Image Gallery ▼');
        toggleBtn.parent(select("#toolPanelContent"));
        toggleBtn.style('display', 'block');
        toggleBtn.style('width', '100%');
        toggleBtn.style('padding', '8px 12px');
        toggleBtn.style('border-radius', '8px');
        toggleBtn.style('border', '1px solid #D2C9CE');
        toggleBtn.style('background', 'white');
        toggleBtn.style('color', '#1F2937');
        toggleBtn.style('font-size', '14px');
        toggleBtn.style('cursor', 'pointer');
        toggleBtn.style('margin-bottom', '15px');
        toggleBtn.style('box-sizing', 'border-box');
        toggleBtn.mousePressed(function() {
            previewsVisible = !previewsVisible;
            if (previewsVisible) {
                toggleBtn.html('Hide Saved Backgrounds ▲');
                displayPreviews();
            } else {
                toggleBtn.html('Show Saved Backgrounds ▼');
                hidePreviews();
            }
        });
    };
    
    function displayPreviews() {
        var container = select('#toolPanelContent');
        var existing = selectAll('.bg-preview');
        existing.forEach(function(el) { el.remove(); });
        
        // Create a scrollable container for previews
        var previewContainer = createDiv('');
        previewContainer.parent(container);
        previewContainer.id('savedBackgroundsContainer');
        previewContainer.class('bg-preview-container');
        
        savedBackgrounds.forEach(function(bg, i) {
            var preview = createImg(bg.image);
            preview.parent(previewContainer);
            preview.class('bg-preview');
            preview.style('width', '100%');
            preview.style('display', 'block');
            preview.style('margin-bottom', '5px');
            preview.style('cursor', 'pointer');
            preview.mousePressed(function() {
                var img = loadImage(bg.image, function() {
                    image(img, 0, 0);
                    loadPixels();
                    saveState();
                });
            });
        });
    }
    
    function hidePreviews() {
        var existing = selectAll('.bg-preview');
        existing.forEach(function(el) { el.remove(); });
        
        var container = select('#savedBackgroundsContainer');
        if (container) {
            container.remove();
        }
    }
    
    this.draw = function(){
        // Place uploaded image on click
        if (mouseIsPressed && hasImageToPlace && uploadedImage && helpers.isMouseOverCanvas()) {
            var opacity = opacitySlider ? opacitySlider.value() : 255;
            var size = sizeSlider ? sizeSlider.value() : 200;
            
            // Apply tint with opacity
            tint(255, opacity);
            image(uploadedImage, mouseX, mouseY, size, size);
            noTint();
            
            loadPixels();
            saveState();
            
            // Keep the image loaded to allow placing multiple times
            // User can upload a new image to replace the current one
        }
    };
}

