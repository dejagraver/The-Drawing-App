// colourPalette.js
// Manages color selection UI and stores selected color
// Used by: ALL drawing tools (colorP.selectedColour), toolbox.js (color slider visibility)

function ColourPalette() {
  var self = this;

  // Tool configuration for toolbox.js integration
  self.icon = "assets/sprayCan.png";
  self.name = "colourPalette";
  
  // Single source of truth for colour - accessed by all drawing tools
  self.selectedColour = "#000000"; // Used by freehandTool.js, sprayCanTool.js, lineToTool.js, mirrorDrawTool.js, stampTool.js
 

  // Start of my new code
  // UI state
  self.state = "hidden";
  self.isExpanded = false;

  // UI references
  self.ui = {
    container: null,
    preview: null,
    picker: null
  };

  // p5.js stroke() and fill() functions
  // Applies color globally to all drawing operations
  self.applySelectedColour = function(c) {
    self.selectedColour = c;
    stroke(c);
    fill(c);

    if (self.ui.preview) {
      self.ui.preview.style("background-color", c.toString());
    }
    
    if (self.isExpanded && self.ui.container) {
      self.ui.container.style("background-color", c.toString());
    }
  };
  
  self.init = function() {
    self.selectedColour = color(0);
    self.createColorSlider();
    self.createColorPresets();
  };

  self.createColorPresets = function() {
    var presets = document.getElementById('colorPresets');
    var colors = [
      [255, 0, 0], [200, 0, 0], [100, 0, 0],
      [255, 165, 0], [200, 130, 0], [100, 65, 0],
      [255, 255, 0], [200, 200, 0], [100, 100, 0],
      [0, 255, 0], [0, 200, 0], [0, 100, 0],
      [0, 0, 255], [0, 0, 200], [0, 0, 100],
      [128, 0, 128], [100, 0, 100], [50, 0, 50],
      [255, 192, 203], [200, 150, 160], [100, 75, 80],
      [0, 0, 0], [128, 128, 128], [255, 255, 255]
    ];
    
    colors.forEach(function(rgb) {
      var swatch = document.createElement('div');
      swatch.className = 'color-preset';
      swatch.style.backgroundColor = 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')';
      swatch.addEventListener('click', function() {
        self.applySelectedColour(color(rgb[0], rgb[1], rgb[2]));
        if (self.sliders) {
          self.sliders.r.value(rgb[0]);
          self.sliders.g.value(rgb[1]);
          self.sliders.b.value(rgb[2]);
          self.sliders.preview.style('background-color', 'rgb(' + rgb[0] + ',' + rgb[1] + ',' + rgb[2] + ')');
          self.sliders.r.elt.style.background = 'linear-gradient(to right, rgb(0,' + rgb[1] + ',' + rgb[2] + '), rgb(255,' + rgb[1] + ',' + rgb[2] + '))';
          self.sliders.g.elt.style.background = 'linear-gradient(to right, rgb(' + rgb[0] + ',0,' + rgb[2] + '), rgb(' + rgb[0] + ',255,' + rgb[2] + '))';
          self.sliders.b.elt.style.background = 'linear-gradient(to right, rgb(' + rgb[0] + ',' + rgb[1] + ',0), rgb(' + rgb[0] + ',' + rgb[1] + ',255))';
        }
      });
      presets.appendChild(swatch);
    });
  };

  self.createColorSlider = function() {
    var slider = document.getElementById('colorSlider');
    var presets = document.getElementById('colorPresets');
    
    slider.appendChild(presets);
    
    var sliderContent = document.createElement('div');
    sliderContent.id = 'colorSliderContent';
    slider.appendChild(sliderContent);
    
    var colorPreview = createDiv();
    colorPreview.parent(sliderContent);
    colorPreview.style('width', '30px');
    colorPreview.style('height', '30px');
    colorPreview.style('border-radius', '6px');
    colorPreview.style('background-color', 'rgb(0,0,0)');
    
    createSpan('Red').parent(sliderContent).style('font-size', '10px');
    var rSlider = createSlider(0, 255, 0);
    rSlider.parent(sliderContent);
    rSlider.style('width', '75px');
    rSlider.style('transform', 'rotate(-90deg)');
    rSlider.style('margin', '37px 0');
    rSlider.addClass('red-slider');
    
    createSpan('Green').parent(sliderContent).style('font-size', '10px');
    var gSlider = createSlider(0, 255, 0);
    gSlider.parent(sliderContent);
    gSlider.style('width', '75px');
    gSlider.style('transform', 'rotate(-90deg)');
    gSlider.style('margin', '37px 0');
    gSlider.addClass('green-slider');
    
    createSpan('Blue').parent(sliderContent).style('font-size', '10px');
    var bSlider = createSlider(0, 255, 0);
    bSlider.parent(sliderContent);
    bSlider.style('width', '75px');
    bSlider.style('transform', 'rotate(-90deg)');
    bSlider.style('margin', '37px 0');
    bSlider.addClass('blue-slider');
    
    var updateColor = function() {
      var r = rSlider.value();
      var g = gSlider.value();
      var b = bSlider.value();
      colorPreview.style('background-color', 'rgb(' + r + ',' + g + ',' + b + ')');
      
      rSlider.elt.style.background = 'linear-gradient(to right, rgb(0,' + g + ',' + b + '), rgb(255,' + g + ',' + b + '))';
      gSlider.elt.style.background = 'linear-gradient(to right, rgb(' + r + ',0,' + b + '), rgb(' + r + ',255,' + b + '))';
      bSlider.elt.style.background = 'linear-gradient(to right, rgb(' + r + ',' + g + ',0), rgb(' + r + ',' + g + ',255))';
      
      self.applySelectedColour(color(r, g, b));
    };
    
    rSlider.input(updateColor);
    gSlider.input(updateColor);
    bSlider.input(updateColor);
    
    updateColor();
    
    self.sliders = {r: rSlider, g: gSlider, b: bSlider, preview: colorPreview};
  };

  self.showColorSlider = function() {
    var slider = document.getElementById('colorSlider');
    if (slider) slider.classList.add('visible');
  };

  self.hideColorSlider = function() {
    var slider = document.getElementById('colorSlider');
    if (slider) slider.classList.remove('visible');
  };

  self.draw = function() {
    // No drawing action
  };

    // End of my new code



}