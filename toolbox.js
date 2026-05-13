//container object for storing the tools. Functions to add new tools and select a tool
// toolbox.js
// Manages tool selection and UI - stores all available tools
// Interacts with: sketch.js (selectedTool), all tool files, index.html (toolPanel)

function Toolbox() {

	var self = this;

	this.tools = [];
	this.selectedTool = null;

	var toolbarItemClick = function() {
		//remove any existing borders
		var items = selectAll(".sideBarItem");
		for (var i = 0; i < items.length; i++) {
			items[i].style('border', '0')
		}

		var toolName = this.id().split("sideBarItem")[0];
		
		//start of my new code
		
		self.selectTool(toolName);
		// Open tool panel and setup collapse button
		var panel = document.getElementById('toolPanel');
		var collapseBtn = document.getElementById('collapseBtn');
		if (panel) {
			panel.classList.add('open');
			if (collapseBtn) collapseBtn.classList.add('visible');
			
			// Setup collapse button
			setTimeout(function() {
				if (collapseBtn) {
					collapseBtn.onclick = function(e) {
						e.stopPropagation();
						panel.classList.remove('open');
						collapseBtn.classList.remove('visible');
					};
				}
			}, 100);
		}
		// End of my new code

		//call loadPixels to make sure most recent changes are saved to pixel array
		loadPixels();
		
		// Show/hide color slider based on tool
		if (toolName === 'sprayCanTool' || toolName === 'freehand' || toolName === 'mirrorDraw' || toolName === 'LineTo') {
			colorP.showColorSlider();
		} else {
			colorP.hideColorSlider();
		}

	}

	//add a new tool icon to the html page
	var addToolIcon = function(icon, name) {
		var sideBarItem = createDiv("<img src='" + icon + "'></div>");
		sideBarItem.class('sideBarItem')
		sideBarItem.id(name + "sideBarItem")
		sideBarItem.parent('sidebar');
		sideBarItem.mouseClicked(toolbarItemClick);
	};

	//add a tool to the tools array
	this.addTool = function(tool) {
		//check that the object tool has an icon and a name
		if (!tool.hasOwnProperty("icon") || !tool.hasOwnProperty("name")) {
			alert("make sure your tool has both a name and an icon");
		}
		this.tools.push(tool);
		addToolIcon(tool.icon, tool.name);
		//if no tool is selected (ie. none have been added so far)
		//make this tool the selected one.
		if (this.selectedTool == null) {
			this.selectTool(tool.name);
		}
	};

	this.selectTool = function(toolName) {
		//search through the tools for one that's name matches
		//toolName
		for (var i = 0; i < this.tools.length; i++) {
			if (this.tools[i].name == toolName) {
				//if the tool has an unselectTool method run it.
				if (this.selectedTool != null && this.selectedTool.hasOwnProperty(
						"unselectTool")) {
					this.selectedTool.unselectTool();
				}
				//select the tool and highlight it on the toolbar
				this.selectedTool = this.tools[i];
				select("#" + toolName + "sideBarItem").style("background", "transparent");
				select("#" + toolName + "sideBarItem").style("border", "none");

				//if the tool has an options area. Populate it now.
				if (this.selectedTool.hasOwnProperty("populateOptions")) {
					// Clear panel content first
					var panelContent = document.getElementById('toolPanelContent');
					if (panelContent) {
						panelContent.innerHTML = '';
					}
					this.selectedTool.populateOptions();
				}
			}
		}
	};

}
