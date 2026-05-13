// undoRedo.js
// Handles undo/redo state management using canvas pixel arrays
// Used by: all drawing tools (saveState), sketch.js (initial state)
// start of my code

var undoStack = [];
var redoStack = [];
var maxHistorySize = 50;

function saveState() {
    // Save current canvas state
    loadPixels();
    var state = get();
    undoStack.push(state);
    
    // Clear redo stack when new action is made
    redoStack = [];
    
    // Limit history size
    if (undoStack.length > maxHistorySize) {
        undoStack.shift();
    }
}

function undo() {
    if (undoStack.length > 1) {
        // Remove the current state (the one we want to undo)
        var currentState = undoStack.pop();
        
        // Save it to redo stack
        redoStack.push(currentState);
        
        // Restore the previous state
        var previousState = undoStack[undoStack.length - 1];
        image(previousState, 0, 0);
        loadPixels();
    }
}

function redo() {
    if (redoStack.length > 0) {
        // Get the state to restore
        var nextState = redoStack.pop();
        
        // Save current state to undo stack (for future undo)
        loadPixels();
        undoStack.push(get());
        
        // Restore the next state
        image(nextState, 0, 0);
        loadPixels();
    }
}

// Keyboard shortcuts
function keyPressed() {
    // Ctrl+Z or Cmd+Z for undo
    if ((keyCode === 90) && (keyIsDown(CONTROL) || keyIsDown(91))) {
        if (keyIsDown(SHIFT)) {
            // Ctrl+Shift+Z or Cmd+Shift+Z for redo
            redo();
        } else {
            undo();
        }
        return false;
    }
    
    // Ctrl+Y or Cmd+Y for redo
    if ((keyCode === 89) && (keyIsDown(CONTROL) || keyIsDown(91))) {
        redo();
        return false;
    }
}

// Setup button click handlers
window.addEventListener('load', function() {
    var undoBtn = document.getElementById('undoButton');
    var redoBtn = document.getElementById('redoButton');
    
    if (undoBtn) {
        undoBtn.addEventListener('click', undo);
    }
    
    if (redoBtn) {
        redoBtn.addEventListener('click', redo);
    }
});
// end of my code