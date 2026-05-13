// tooltip.js
// Adds tooltip positioning for undo/redo buttons
// Depends on: index.html (undoButton, redoButton elements)
// start of my code

document.addEventListener('DOMContentLoaded', function() {
  const undoBtn = document.getElementById('undoButton');
  const redoBtn = document.getElementById('redoButton');
  
  function positionTooltip(button) {
    const tooltip = button.querySelector('.tooltip');
    const rect = button.getBoundingClientRect();
    tooltip.style.top = (rect.bottom + 15) + 'px';
  }
  
  if (undoBtn) undoBtn.addEventListener('mouseenter', () => positionTooltip(undoBtn));
  if (redoBtn) redoBtn.addEventListener('mouseenter', () => positionTooltip(redoBtn));
});

// end of my code