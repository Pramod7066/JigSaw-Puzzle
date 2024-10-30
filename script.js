const canvas = document.getElementById('puzzleCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();
const rows = 4; // Number of rows in the puzzle
const cols = 4; // Number of columns in the puzzle
const pieceWidth = canvas.width / cols;
const pieceHeight = canvas.height / rows;
const snapThreshold = 20; // Distance threshold for snapping

let pieces = [];
let draggingPiece = null; // Currently dragged piece
let offsetX, offsetY;

// Set up initial image source from the selector
img.src = document.getElementById('imageSelector').value;

// Debug Image Loading
img.onload = function() {
    console.log('Image loaded successfully!');
    initializePieces(); // Initialize puzzle pieces
    drawPuzzle();       // Draw puzzle pieces
};

img.onerror = function() {
    console.error('Failed to load the image.');
};

// Initialize puzzle pieces
function initializePieces() {
    pieces = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            pieces.push({
                x: col * pieceWidth,
                y: row * pieceHeight,
                correctX: col * pieceWidth,
                correctY: row * pieceHeight,
                isPlaced: false // Track if piece is placed correctly
            });
        }
    }
}

// Draw puzzle pieces onto the canvas
function drawPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(piece => {
        ctx.drawImage(
            img,
            piece.correctX, piece.correctY, pieceWidth, pieceHeight, // Source image
            piece.x, piece.y, pieceWidth, pieceHeight                 // Canvas position
        );
    });
}

// Shuffle puzzle pieces randomly
function shufflePieces() {
    pieces.forEach(piece => {
        piece.x = Math.random() * (canvas.width - pieceWidth);
        piece.y = Math.random() * (canvas.height - pieceHeight);
        piece.isPlaced = false; // Reset placement status
    });
    drawPuzzle();
}

// Reset puzzle to original state
function resetPuzzle() {
    initializePieces(); // Reset pieces to their correct positions
    drawPuzzle();
}

// Load a new image when the selection changes
document.getElementById('imageSelector').addEventListener('change', function() {
    img.src = this.value; // Set image source to the selected option
    img.onload = function() {
        initializePieces();
        drawPuzzle();
    };
});

// Drag-and-drop functionality
canvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(canvas, e);
    draggingPiece = getPieceAtPos(mousePos.x, mousePos.y);
    if (draggingPiece) {
        offsetX = mousePos.x - draggingPiece.x; // Calculate offset
        offsetY = mousePos.y - draggingPiece.y;
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingPiece) {
        const mousePos = getMousePos(canvas, e);

        // Restrict the piece from moving outside the canvas boundaries
        let newX = mousePos.x - offsetX;
        let newY = mousePos.y - offsetY;

        // Apply boundary conditions
        if (newX < 0) newX = 0; // Left boundary
        if (newX + pieceWidth > canvas.width) newX = canvas.width - pieceWidth; // Right boundary
        if (newY < 0) newY = 0; // Top boundary
        if (newY + pieceHeight > canvas.height) newY = canvas.height - pieceHeight; // Bottom boundary

        draggingPiece.x = newX; // Update piece position with boundaries applied
        draggingPiece.y = newY;
        drawPuzzle();
    }
});

canvas.addEventListener('mouseup', () => {
    if (draggingPiece) {
        // Check if the piece is close enough to the correct position
        const deltaX = Math.abs(draggingPiece.x - draggingPiece.correctX);
        const deltaY = Math.abs(draggingPiece.y - draggingPiece.correctY);
        
        if (deltaX < snapThreshold && deltaY < snapThreshold) {
            // Snap to correct position if within the threshold
            draggingPiece.x = draggingPiece.correctX;
            draggingPiece.y = draggingPiece.correctY;
            draggingPiece.isPlaced = true; // Mark piece as placed
        }
    }
    draggingPiece = null;  // Release the piece
});

canvas.addEventListener('mouseleave', () => {
    draggingPiece = null;  // Release the piece when mouse leaves canvas
});

// Get mouse position relative to the canvas
function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Check if the mouse is over a piece
function getPieceAtPos(x, y) {
    return pieces.find(piece => {
        return (
            x >= piece.x && x <= piece.x + pieceWidth &&
            y >= piece.y && y <= piece.y + pieceHeight
        );
    });
}

// Event listener for shuffle button
document.getElementById('shuffleBtn').addEventListener('click', shufflePieces);

// Event listener for reset button
document.getElementById('resetBtn').addEventListener('click', resetPuzzle);

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    
    // Update button text based on the current theme
    if (document.body.classList.contains('dark-theme')) {
        themeToggle.textContent = 'Switch to Light Theme';
    } else {
        themeToggle.textContent = 'Switch to Dark Theme';
    }
});


