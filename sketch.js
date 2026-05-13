// sketch.js
// Main entry point - initializes all tools, color palette, and drawing loop
// Depends on: all tool files, colourPalette.js, helperFunctions.js, undoRedo.js

// Global variables shared across all tool files
var toolbox = null;  // Toolbox instance from toolbox.js - manages all drawing tools
var colorP = null;   // ColourPalette instance from colourPalette.js - manages color selection
var helpers = null;  // HelperFunctions instance from helperFunctions.js - provides utility functions

//start of my new code
var previewLayer;    // p5.Graphics layer for drawing previews without affecting main canvas
var stampImages = []; // Array of preloaded stamp images used by stampTool.js
var headerFont;      // Custom font for header text

function preload() {
	headerFont = loadFont("assets/fonts/interVariableFont.ttf");
	preloadStampImages(); // Defined in stampTool.js - loads stamp images before setup
}
// End of my new code

function setup() {
	//create a canvas to fill the content div from index.html
	canvasContainer = select('#content');
	var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
	c.parent("content");
	
	// create overlay graphics for previews (used by lineToTool.js for line preview)
	previewLayer = createGraphics(width, height);
	previewLayer.clear();

	//create helper functions and the color palette
	helpers = new HelperFunctions(); // From helperFunctions.js - provides isMouseOverCanvas() utility
	colorP = new ColourPalette();    // From colourPalette.js - manages color selection UI
	colorP.init();                   
	
	//create a toolbox for storing the tools
	toolbox = new Toolbox(); // From toolbox.js - manages tool selection and UI

	//add the tools to the toolbox - each tool file defines its own constructor
	toolbox.addTool(new FreehandTool());    // freehandTool.js - various brush strokes
	toolbox.addTool(new LineToTool());      // lineToTool.js - straight line drawing
	// start of my new code
	toolbox.addTool(new SprayCanTool());    // sprayCanTool.js - spray paint effect
	toolbox.addTool(new mirrorDrawTool());  // mirrorDrawTool.js - symmetrical drawing
	toolbox.addTool(new StampTool());       // stampTool.js - stamp shapes and images
	toolbox.addTool(new ImageAPI());        // imageApiTool.js - Giphy image search
	toolbox.addTool(new StateSavingTool()); // stateSaving.js - save/load canvas states
	toolbox.addTool(new eraserTool());      // eraserTool.js - cut and erase modes
	// end of my new code
	background(255);
	
	// Save initial blank canvas state for undo - uses undoRedo.js saveState() function
	loadPixels();
	saveState(); // From undoRedo.js - saves canvas to undo history
}

function draw() {
	//clear preview layer each frame; it will be redrawn by the tool if needed
	if(previewLayer){
		previewLayer.clear();
	}
	//call the draw function from the selected tool.
	//hasOwnProperty is a javascript function that tests
	//if an object contains a particular method or property
	//if there isn't a draw method the app will alert the user
	if (toolbox.selectedTool.hasOwnProperty("draw")) {
		toolbox.selectedTool.draw();
	} else {
		alert("it doesn't look like your tool has a draw method!");
	}
	// composite preview layer over main canvas
	if(previewLayer){
		image(previewLayer, 0, 0);
	}
}