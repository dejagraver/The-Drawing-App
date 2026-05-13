// mirrorDrawTool.js
// Symmetrical drawing tool - draws on both sides of a central axis
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)

function mirrorDrawTool() {
	this.name = "mirrorDraw";
	this.icon = "assets/mirrorDraw.png";

	//which axis is being mirrored (x or y) x is default
	this.axis = "x";
	//line of symmetry will be calculated when needed

	//start of my new code
	// Added thickness and opacity sliders for enhanced mirror drawing control
	var thicknessSlider;
	var opacitySlider;
	var thicknessPreview;
	var opacityPreview;
	// End of my new code

	//this changes in the jquery click handler. So storing it as
	//a variable self now means we can still access it in the handler
	var self = this;

	//where was the mouse on the last time draw was called.
	//set it to -1 to begin with
	var previousMouseX = -1;
	var previousMouseY = -1;

	//mouse coordinates for the other side of the Line of symmetry.
	var previousOppositeMouseX = -1;
	var previousOppositeMouseY = -1;

	this.draw = function() {
		//display the last save state of pixels
		updatePixels();

		//do the drawing if the mouse is pressed and over the canvas
		if (mouseIsPressed && helpers.isMouseOverCanvas()) {
			//start of my new code
			// Apply thickness and opacity settings to mirror drawing
			let thickness = thicknessSlider ? thicknessSlider.value() : 1;
			let opacity = opacitySlider ? opacitySlider.value() : 255;
			strokeWeight(thickness);
			var currentColor = color(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity);
			stroke(currentColor);
			//end of my new code

			//if the previous values are -1 set them to the current mouse location
			//and mirrored positions
			if (previousMouseX == -1) {
				previousMouseX = mouseX;
				previousMouseY = mouseY;
				previousOppositeMouseX = this.calculateOpposite(mouseX, "x");
				previousOppositeMouseY = this.calculateOpposite(mouseY, "y");
			}

			//if there are values in the previous locations
			//draw a line between them and the current positions
			else {
				line(previousMouseX, previousMouseY, mouseX, mouseY);
				previousMouseX = mouseX;
				previousMouseY = mouseY;

				//these are for the mirrored drawing the other side of the
				//line of symmetry
				var oX = this.calculateOpposite(mouseX, "x");
				var oY = this.calculateOpposite(mouseY, "y");
				line(previousOppositeMouseX, previousOppositeMouseY, oX, oY);
				previousOppositeMouseX = oX;
				previousOppositeMouseY = oY;
			}
		}
		//if the mouse isn't pressed reset the previous values to -1
		else {
			previousMouseX = -1;
			previousMouseY = -1;

			previousOppositeMouseX = -1;
			previousOppositeMouseY = -1;
		}

		//after the drawing is done save the pixel state. We don't want the
		//line of symmetry to be part of our drawing

		loadPixels();

		//push the drawing state so that we can set the stroke weight and color
		push();
		strokeWeight(1);
		stroke("black");
		//draw the line of symmetry
		if (this.axis == "x") {
			line(width / 2, 0, width / 2, height);
		} else {
			line(0, height / 2, width, height / 2);
		}
		//return to the original stroke
		pop();
	};

	/*calculate an opposite coordinate the other side of the
	 *symmetry line.
	 *@param n number: location for either x or y coordinate
	 *@param a [x,y]: the axis of the coordinate (y or y)
	 *@return number: the opposite coordinate
	 */
	this.calculateOpposite = function(n, a) {
		//get current line of symmetry
		//if the axis isn't the one being mirrored return the same
		//value
		var lineOfSymmetry = (this.axis == "x") ? width / 2 : height / 2;
		
		//if the axis isn't the one being mirrored return the same
		//value
		if (a != this.axis) {
			return n;
		}

		//if n is less than the line of symmetry return a coorindate
		//that is far greater than the line of symmetry by the distance from
		//n to that line.
		if (n < lineOfSymmetry) {
			return lineOfSymmetry + (lineOfSymmetry - n);
		}

		//otherwise a coordinate that is smaller than the line of symmetry
		//by the distance between it and n.
		else {
			return lineOfSymmetry - (n - lineOfSymmetry);
		}
	};


	//when the tool is deselected update the pixels to just show the drawing and
	//hide the line of symmetry. Also clear options
	this.unselectTool = function() {
		updatePixels();
		//clear options
		select("#toolPanelContent").html("");
	};

	//adds a button and click handler to the options area. When clicked
	//toggle the line of symmetry between horizonatl to vertical
	this.populateOptions = function() {
		select("#toolPanelContent").html("");
		//start of my new code
		// Add thickness and opacity sliders to mirror tool options
		createDiv("Thickness").parent(select("#toolPanelContent"));
		
		var sliderContainer = createDiv("");
		sliderContainer.parent(select("#toolPanelContent"));
		sliderContainer.style("display", "flex");
		sliderContainer.style("align-items", "center");
		sliderContainer.style("gap", "10px");
		
		thicknessSlider = createSlider(1, 20, 20);
		thicknessSlider.parent(sliderContainer);
		
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
		
		createDiv("Opacity").parent(select("#toolPanelContent"));
		
		var opacityContainer = createDiv("");
		opacityContainer.parent(select("#toolPanelContent"));
		opacityContainer.style("display", "flex");
		opacityContainer.style("align-items", "center");
		opacityContainer.style("gap", "10px");
		
		opacitySlider = createSlider(0, 255, 255);
		opacitySlider.parent(opacityContainer);
		
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
		// End of my new code
		
		var directionBtn = createButton('Make Horizontal');
		directionBtn.parent(select("#toolPanelContent"));
		directionBtn.id('directionButton');
		
		// 	//click handler
		select("#directionButton").mouseClicked(function() {
			var button = select("#" + this.elt.id);
			if (self.axis == "x") {
				self.axis = "y";
				button.html('Make Vertical');
			} else {
				self.axis = "x";
				button.html('Make Horizontal');
			}
		});
	};
}
