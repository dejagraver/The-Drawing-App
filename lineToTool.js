// lineToTool.js
// Straight line drawing tool with live preview
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)
function LineToTool(){
	this.icon = "assets/lineTo.svg";
	this.name = "LineTo";

	// Track line start position and drawing state
	var startMouseX = -1;
	var startMouseY = -1;
	var drawing = false;
	
	// start of my code
	// Added slider variables for line opacity and thickness customization along with previews
	var thicknessSlider;
	var opacitySlider;
	var thicknessPreview;
	var opacityPreview;

	// Populate tool options panel with control sliders
	this.populateOptions = function(){
		// p5.js referenced
		select("#toolPanelContent").html("");
		
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
		
		// Opacity slider (0-255)
		createDiv("Opacity").parent(select("#toolPanelContent"));
		
		var opacityContainer = createDiv("");
		opacityContainer.parent(select("#toolPanelContent"));
		opacityContainer.style("display", "flex");
		opacityContainer.style("align-items", "center");
		opacityContainer.style("gap", "10px");
		
		opacitySlider = createSlider(0, 255, 255);
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
		// End p5.js referenced
		// End of my new code

	};
	// Main draw function - draws line with preview
	this.draw = function(){
		//only draw when mouse is clicked and over canvas
		if(mouseIsPressed && helpers.isMouseOverCanvas()){
			// start of my new code
			// Get slider values or use defaults, pply thickness and opacity settings to line drawing
			let thickness = thicknessSlider ? thicknessSlider.value() : 1;
			let opacity = opacitySlider ? opacitySlider.value() : 255;			
			strokeWeight(thickness);
			var currentColor = color(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity);
			stroke(currentColor);
			// end of my new code

			//if it's the start of drawing a new line
			if(startMouseX == -1){
				startMouseX = mouseX;
				startMouseY = mouseY;
				drawing = true;
				//save the current pixel Array
				loadPixels();
			}
			// Update preview line as mouse moves
			else{
				//update the screen with the saved pixels to hide any previous
				//line between mouse pressed and released
				updatePixels();
				//draw the line
				line(startMouseX, startMouseY, mouseX, mouseY);
			}

		}
		// Finalize line and reset when mouse released
		else if(drawing){
			//save the pixels with the most recent line and reset the
			//drawing bool and start locations
			loadPixels();
			drawing = false;
			startMouseX = -1;
			startMouseY = -1;
		}
	};


}
