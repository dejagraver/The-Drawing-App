// sprayCanTool.js
// Spray paint effect tool with particle distribution
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)

function SprayCanTool(){
  // Tool configuration
  this.name = "sprayCanTool";
  this.icon = "assets/sprayCanPink.png";

  // Default spray settings
  var points = 300;
  var spread = 40;
  var hasDrawn = false;

  // Slider variables for spray customization
  var opacitySlider;
  var thicknessSlider;
  var radiusSlider;
  var speedSlider;
  var thicknessPreview;
  var opacityPreview;

  // Populate tool options panel with control sliders
  this.populateOptions = function(){
    select("#toolPanelContent").html("");

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
      let opacity = opacitySlider.value() / 255;
      opacityPreview.style("background-color", "rgba(0, 0, 0, " + opacity + ")");
    });
    
    // Thickness slider (1-20)
    createDiv("Thickness").parent(select("#toolPanelContent"));
    
    var sliderContainer = createDiv("");
    sliderContainer.parent(select("#toolPanelContent"));
    sliderContainer.style("display", "flex");
    sliderContainer.style("align-items", "center");
    sliderContainer.style("gap", "10px");
    
    thicknessSlider = createSlider(1, 20, 20);
    thicknessSlider.parent(sliderContainer);
    thicknessSlider.mousePressed((e) => { e.stopPropagation(); });
    
    thicknessPreview = createDiv("");
    thicknessPreview.parent(sliderContainer);
    thicknessPreview.style("width", "20px");
    thicknessPreview.style("height", "20px");
    thicknessPreview.style("border-radius", "50%");
    thicknessPreview.style("background-color", "black");
    thicknessPreview.style("flex-shrink", "0");
    thicknessPreview.style("margin-top", "5px");
    
    thicknessSlider.input(() => {
      let size = thicknessSlider.value();
      thicknessPreview.style("width", size + "px");
      thicknessPreview.style("height", size + "px");
    });
    
    // Radius slider (10-100)
    createDiv("Radius").parent(select("#toolPanelContent"));
    radiusSlider = createSlider(10, 100, 40);
    radiusSlider.parent(select("#toolPanelContent"));
    radiusSlider.mousePressed((e) => { e.stopPropagation(); });
    
    // Speed slider (50-500 particles)
    createDiv("Speed").parent(select("#toolPanelContent"));
    speedSlider = createSlider(50, 500, 300);
    speedSlider.parent(select("#toolPanelContent"));
    speedSlider.mousePressed((e) => { e.stopPropagation(); });
  };

  // Main draw function - creates spray effect
  this.draw = function(){
    // Draw spray particles when mouse pressed over canvas
    if(mouseIsPressed && helpers.isMouseOverCanvas()){
      // Get slider values or use defaults
      var opacity = opacitySlider ? opacitySlider.value() : 255;
      var thickness = thicknessSlider ? thicknessSlider.value() : 3;
      var radius = radiusSlider ? radiusSlider.value() : spread;
      var speed = speedSlider ? speedSlider.value() : points;

      // Apply color with opacity
      var currentColor = color(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity);
      stroke(currentColor);
      strokeWeight(thickness);

      // Generate spray particles in random distribution
      for(var i = 0; i < speed; i++){
        var angle = random(TWO_PI);
        var distance = random(0, radius) * random(0.5, 1.2);
        var speckleX = mouseX + cos(angle) * distance;
        var speckleY = mouseY + sin(angle) * distance;
        
        strokeWeight(random(0.3, thickness * 0.4));
        point(speckleX, speckleY);
      }

      hasDrawn = true;
    }
    // Save state for undo/redo when drawing finishes
    else if(hasDrawn){
      loadPixels();
      saveState();
      hasDrawn = false;
    }
  };
}
