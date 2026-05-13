// imageApiTool.js
// Giphy API integration - search and place images on canvas
// Dependencies: undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)

function ImageAPI() {
    // Tool configuration
    this.icon = "assets/search.png";
    this.name = "imageSearch";
    this.uploadedImage = null;
    
    // Tool settings and state tracking
    var sizeSlider;
    var opacitySlider;
    var wasDrawing = false;
    var mouseWasPressed = false;
    var API_KEY = 'lrgTvmbVbnJBLqaql8bVl1eYAqFd7E8G';
    var cachedImages = [];
    
    // Populate tool options panel with search and image controls
    this.populateOptions = function() {
        select("#toolPanelContent").html("");
        var self = this;
        
        // Create search input container with icon
        var searchContainer = createDiv('');
        searchContainer.parent(select("#toolPanelContent"));
        searchContainer.style('position', 'relative');
        searchContainer.style('margin-bottom', '40px');
        searchContainer.style('margin-right', '20px');
        
        var searchIcon = createImg('assets/search.png');
        searchIcon.parent(searchContainer);
        searchIcon.style('position', 'absolute');
        searchIcon.style('left', '8px');
        searchIcon.style('top', '8px');
        searchIcon.style('width', '16px');
        searchIcon.style('height', '16px');
        searchIcon.style('pointer-events', 'none');
        
        // Search input field
        var searchInput = createInput('');
        searchInput.parent(searchContainer);
        searchInput.attribute('placeholder', 'Search giphy...');
        searchInput.style('width', '100%');
        searchInput.style('padding', '8px 8px 8px 32px');
        searchInput.style('border-radius', '8px');
        searchInput.style('border', '1px solid #D2C9CE');
        searchInput.style('box-sizing', 'border-box');
        searchInput.style('display', 'block');
        
        // Scrollable container for image results
        var gridContainer = createDiv('');
        gridContainer.parent(select("#toolPanelContent"));
        gridContainer.style('max-height', 'calc(100vh - 200px)');
        gridContainer.style('overflow-y', 'auto');
        gridContainer.style('padding', '10px 5px 10px 0');
        
        // Grid layout for search results
        var imageGrid = createDiv('');
        imageGrid.parent(gridContainer);
        imageGrid.id('imageGrid');
        imageGrid.style('display', 'grid');
        imageGrid.style('grid-template-columns', 'repeat(2, 1fr)');
        imageGrid.style('gap', '8px');
        imageGrid.style('margin-top', '30px');
        
        // Fetch images from Giphy API on search
        searchInput.changed(function() {
            let query = this.value();
            if (query) {
                fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${encodeURIComponent(query)}&limit=50`)
                    .then(response => response.json())
                    .then(data => {
                        imageGrid.html('');
                        cachedImages = data.data;
                        if (cachedImages.length > 0) {
                            cachedImages.forEach(item => {
                                let imageUrl = item.images.fixed_width_small.url;
                                let img = createImg(imageUrl);
                                img.parent(imageGrid);
                                img.style('width', '100%');
                                img.style('cursor', 'pointer');
                                img.style('border-radius', '4px');
                                img.mousePressed(function() {
                                    loadImage(item.images.original.url, (loadedImg) => {
                                        self.uploadedImage = loadedImg;
                                        self.populateOptions();
                                    });
                                });
                            });
                        }
                    })
                    .catch(error => {});
            }
        });
        
        // Display cached images if available
        if (cachedImages.length > 0) {
            cachedImages.forEach(item => {
                let imageUrl = item.images.fixed_width_small.url;
                let img = createImg(imageUrl);
                img.parent(imageGrid);
                img.style('width', '100%');
                img.style('cursor', 'pointer');
                img.style('border-radius', '4px');
                img.mousePressed(function() {
                    loadImage(item.images.original.url, (loadedImg) => {
                        self.uploadedImage = loadedImg;
                        self.populateOptions();
                    });
                });
            });
        }
        
        // Show size and opacity controls when image selected
        if (this.uploadedImage) {
            createDiv("Size (px)").parent(select("#toolPanelContent")).style('margin-top', '20px');
            sizeSlider = createSlider(20, 400, 100);
            sizeSlider.parent(select("#toolPanelContent"));
            
            createDiv("Opacity").parent(select("#toolPanelContent"));
            opacitySlider = createSlider(0, 255, 255);
            opacitySlider.parent(select("#toolPanelContent"));
            
            createDiv("Click on canvas to place image").parent(select("#toolPanelContent")).style('margin-top', '10px');
        }
    };
    
    // Main draw function - places selected image on canvas
    this.draw = function() {
        if (this.uploadedImage) {
            // Prevent drawing when hovering over tool panel
            var toolPanel = document.getElementById('toolPanel');
            var isPanelOpen = toolPanel && toolPanel.classList.contains('open');
            var isPanelHovered = isPanelOpen && mouseX > 70 && mouseX < 250;
            
            if (isPanelHovered) return;
            
            let size = sizeSlider ? sizeSlider.value() : 100;
            let opacity = opacitySlider ? opacitySlider.value() : 255;
            
            // Place image on single click
            if (mouseIsPressed && !mouseWasPressed && helpers.isMouseOverCanvas()) {
                wasDrawing = true;
                push();
                tint(255, opacity);
                image(this.uploadedImage, mouseX - size / 2, mouseY - size / 2, size, size);
                noTint();
                pop();
            }
            
            // Save state for undo/redo after placing image
            if (!mouseIsPressed && wasDrawing) {
                loadPixels();
                saveState();
                wasDrawing = false;
            }
            
            mouseWasPressed = mouseIsPressed;
        }
    };
}