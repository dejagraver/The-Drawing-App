// helperFunctions.js
// Shared utility functions used across all tools
// Used by: all drawing tools (isMouseOverCanvas), sketch.js (clear button)
// start of my code
function HelperFunctions() {

	// jQuery/p5.js click event handler for clear button (defined in index.html)
	//Jquery click events. Notice that there is no this. at the
	//start we don't need to do that here because the event will
	//be added to the button and doesn't 'belong' to the object

	//event handler for the clear button event. Clears the screen
	select("#clearButton").mouseClicked(function() {
		background(255, 255, 255);
		// loadPixels() updates the pixel array - needed for mirrorDrawTool.js
		loadPixels();
	});

	// Utility function used by all drawing tools to prevent drawing outside canvas
	// Checks if mouse is within canvas bounds and not over toolPanel (from index.html)
	this.isMouseOverCanvas = function() {
		var toolPanel = select('#toolPanel'); // Defined in index.html
		if (toolPanel) {
			var rect = toolPanel.elt.getBoundingClientRect();
			if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
				return false; // Mouse is over tool panel
			}
		}
		return mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;
	};
}
