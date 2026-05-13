// freehandTool.js
// Multiple stroke type drawing tool (pencil, pen, marker, crayon, paintBrush, thickWetPaint)
// Dependencies: colourPalette.js (color), undoRedo.js (saveState), helperFunctions.js (isMouseOverCanvas)

function FreehandTool(){
	// Tool configuration
	this.icon = "assets/freehandTool.png";
	this.name = "freehand";

	// Track previous mouse position for smooth drawing
	var previousMouseX = -1;
	var previousMouseY = -1;
	var hasDrawn = false;
	
	// start of my new code
	// Added thickness and opacity sliders for enhanced drawing control
	// Slider and stroke type variables
	var thicknessSlider;
	var opacitySlider;
	var thicknessPreview;
	var opacityPreview;
	var selectedStrokeType = 'marker';
	
	// Populate tool options panel with stroke controls
	this.populateOptions = function(){
		select("#toolPanelContent").html("");
		
		// Create stroke type selection grid
		createDiv("Stroke Type").parent(select("#toolPanelContent"));
		var strokeGrid = createDiv();
		strokeGrid.parent(select("#toolPanelContent"));
		strokeGrid.style('display', 'grid');
		strokeGrid.style('grid-template-columns', 'repeat(3, 1fr)');
		strokeGrid.style('gap', '5px');
		strokeGrid.style('margin-top', '10px');
		strokeGrid.style('margin-bottom', '15px');

		// Available stroke types with icons
		var strokeTypes = [
			{name: 'pencil', icon: 'assets/freehandStrokeIcons/pencil.png'},
			{name: 'pen', icon: 'assets/freehandStrokeIcons/pen.svg'},
			{name: 'marker', icon: 'assets/freehandStrokeIcons/marker.png'},
			{name: 'crayon', icon: 'assets/freehandStrokeIcons/crayon.png'},
			{name: 'paintBrush', icon: 'assets/freehandStrokeIcons/paintBrush.png'},
			{name: 'thickWetPaint', icon: 'assets/freehandStrokeIcons/thickWetPaint.png'}
		];
		
		// Create button for each stroke type
		for (let i = 0; i < strokeTypes.length; i++) {
			let btnDiv = createDiv();
			btnDiv.parent(strokeGrid);
			btnDiv.style('width', '40px');
			btnDiv.style('height', '40px');
			btnDiv.style('border', 'none');
			btnDiv.style('border-radius', '5px');
			btnDiv.style('cursor', 'pointer');
			btnDiv.style('overflow', 'hidden');
			btnDiv.style('display', 'flex');
			btnDiv.style('align-items', 'center');
			btnDiv.style('justify-content', 'center');
			btnDiv.style('background-color', '#f0f0f0');
			
			let img = createImg(strokeTypes[i].icon);
			img.parent(btnDiv);
			img.style('max-width', '80%');
			img.style('max-height', '80%');
			
			let strokeName = strokeTypes[i].name;
			btnDiv.mousePressed(() => {
				selectedStrokeType = strokeName;
				selectAll('#toolPanelContent > div > div').forEach(el => el.style('border', '2px solid transparent'));
				btnDiv.style('border', 'none');
			});
			
		}
		
		// Thickness slider with live preview
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
		
		// Opacity slider
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
	};

	// Main draw function - handles different stroke types
	this.draw = function(){
		// Draw when mouse pressed over canvas
		if(mouseIsPressed && helpers.isMouseOverCanvas()){
			// Marker stroke - rectangular with bleeding effect
			if (selectedStrokeType === 'marker') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					noStroke();
					rectMode(CENTER);
					
					let steps = dist(previousMouseX, previousMouseY, mouseX, mouseY);
					for (let i = 0; i <= steps; i += 0.3) {
						let x = lerp(previousMouseX, mouseX, i / steps);
						let y = lerp(previousMouseY, mouseY, i / steps);
						
						// Bleeding effect - multiple layers
						for (let j = 0; j < 5; j++) {
							let bleedOffset = random(-thickness * 0.4, thickness * 0.4);
							let bleedOpacity = opacity * random(0.05, 0.15);
							fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), bleedOpacity);
							rect(x + bleedOffset, y + bleedOffset, thickness * 1.5, thickness * 0.8, 2);
						}
						
						// Core rectangular stroke
						fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity * 0.5);
						rect(x, y, thickness, thickness * 0.6, 2);
					}
					
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
			// Pencil stroke - grainy texture effect
			else if (selectedStrokeType === 'pencil') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					noStroke();
					
					let steps = dist(previousMouseX, previousMouseY, mouseX, mouseY);
					for (let i = 0; i < steps; i += 1) {
						let x = lerp(previousMouseX, mouseX, i / steps);
						let y = lerp(previousMouseY, mouseY, i / steps);
						
						for (let j = 0; j < 8; j++) {
							let offsetX = random(-thickness/3, thickness/3);
							let offsetY = random(-thickness/3, thickness/3);
							let grainOpacity = opacity * random(0.2, 0.4);
							let size = random(0.5, 1.5);
							fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), grainOpacity);
							ellipse(x + offsetX, y + offsetY, size, size);
						}
					}
					
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
			// Pen stroke - smooth solid line
			else if (selectedStrokeType === 'pen') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					strokeCap(ROUND);
					strokeWeight(thickness);
					stroke(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity);
					line(previousMouseX, previousMouseY, mouseX, mouseY);
					
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
			// Crayon stroke - waxy chunky texture
			else if (selectedStrokeType === 'crayon') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					noStroke();
					
					let steps = dist(previousMouseX, previousMouseY, mouseX, mouseY);
					for (let i = 0; i < steps; i += 0.8) {
						let x = lerp(previousMouseX, mouseX, i / steps);
						let y = lerp(previousMouseY, mouseY, i / steps);
						
						// Waxy chunky texture
						for (let j = 0; j < 15; j++) {
							let offsetX = random(-thickness/2, thickness/2);
							let offsetY = random(-thickness/2, thickness/2);
							let waxOpacity = opacity * random(0.4, 0.8);
							let size = random(2, 4);
							fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), waxOpacity);
							ellipse(x + offsetX, y + offsetY, size, size);
						}
					}
					
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
			// Paint brush stroke - watercolor flow effect
			else if (selectedStrokeType === 'paintBrush') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					noStroke();
					
					let steps = dist(previousMouseX, previousMouseY, mouseX, mouseY);
					for (let i = 0; i <= steps; i += 0.3) {
						let x = lerp(previousMouseX, mouseX, i / steps);
						let y = lerp(previousMouseY, mouseY, i / steps);
						
						// Core watercolor stroke
						fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity * 0.15);
						ellipse(x, y, thickness * 1.2, thickness * 1.2);
						
						// Water flow effect - flowing outward
						for (let j = 0; j < 20; j++) {
							let flowDist = random(thickness * 0.3, thickness * 0.7);
							let angle = random(TWO_PI);
							let flowX = x + cos(angle) * flowDist;
							let flowY = y + sin(angle) * flowDist;
							let flowOpacity = opacity * 0.08;
							fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), flowOpacity);
							ellipse(flowX, flowY, thickness * 0.4, thickness * 0.4);
						}
					}
					
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
			// Thick wet paint stroke - splatter and drag effect
			else if (selectedStrokeType === 'thickWetPaint') {
				let thickness = thicknessSlider ? thicknessSlider.value() : 1;
				let opacity = opacitySlider ? opacitySlider.value() : 255;
				
				if (previousMouseX == -1){
					previousMouseX = mouseX;
					previousMouseY = mouseY;
				}
				else{
					noStroke();
					
					let steps = dist(previousMouseX, previousMouseY, mouseX, mouseY);
					for (let i = 0; i <= steps; i += 0.8) {
						let x = lerp(previousMouseX, mouseX, i / steps);
						let y = lerp(previousMouseY, mouseY, i / steps);
						
						// Determine movement direction
						let deltaX = abs(mouseX - previousMouseX);
						let deltaY = abs(mouseY - previousMouseY);
						let isVertical = deltaY > deltaX;
						
						// Paint splatters
						if (random() > 0.5) {
							for (let j = 0; j < 12; j++) {
								let splatDist = random(thickness * 2.5, thickness * 3);
								let splatAngle = random(TWO_PI);
								let splatX = x + cos(splatAngle) * splatDist;
								let splatY = y + sin(splatAngle) * splatDist;
								
								// Drag trail behind splatter
								let dragAngle = atan2(mouseY - previousMouseY, mouseX - previousMouseX);
								for (let k = 0; k < 6; k++) {
									let dragDist = k * random(4, 8);
									let dragX = splatX - cos(dragAngle) * dragDist;
									let dragY = splatY - sin(dragAngle) * dragDist;
									let dragOpacity = opacity * random(0.5, 0.8) * (1 - k / 6);
									fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), dragOpacity);
									rectMode(CENTER);
									if (isVertical) {
										rect(dragX, dragY, random(1, 3), random(3, 8), 1);
									} else {
										rect(dragX, dragY, random(3, 8), random(1, 3), 1);
									}
								}
								
								let splatSize = random(4, 10);
								fill(red(colorP.selectedColour), green(colorP.selectedColour), blue(colorP.selectedColour), opacity * random(0.7, 0.95));
								rectMode(CENTER);
								if (isVertical) {
									rect(splatX, splatY, splatSize * 0.6, splatSize, 2);
								} else {
									rect(splatX, splatY, splatSize, splatSize * 0.6, 2);
								}
							}
						}
					}
					previousMouseX = mouseX;
					previousMouseY = mouseY;
					hasDrawn = true;
				}
			}
		}
		// Save state for undo/redo when drawing finishes
		else{
			if (hasDrawn) {
				loadPixels();
				saveState();
				hasDrawn = false;
			}
			// Reset previous mouse position
			previousMouseX = -1;
			previousMouseY = -1;
		}
	};
}
//end of my code