// --- 1. Global Setup: All 7 Locations with Offset relative to San Francisco (America/Los_Angeles) ---
// Since SF is UTC-8 (PST), the offset is (Target UTC Offset) - (-8).
// For Paris, TX (CST, UTC-6): -6 - (-8) = +2 hours ahead of SF.
const clocks = [
    { id: 'sf-clock', hourDiff: 0 },         // San Francisco, CA (Reference point)
    { id: 'gnv-clock', hourDiff: 3 },        // Gainesville, FL (EST is 3 hours ahead of PST)
    { id: 'shanghai-clock', hourDiff: 16 },  // Shanghai, China (PST is UTC-8; CST is UTC+8. Difference is 16 hours)
    { id: 'basel-clock', hourDiff: 9 },      // Basel, Switzerland (CET is 9 hours ahead of PST)
    { id: 'honolulu-clock', hourDiff: -2 },  // Honolulu, HI (HST is 2 hours behind PST)
    { id: 'paris-fr-clock', hourDiff: 9 },   // Paris, France (CET is 9 hours ahead of PST)
    { id: 'paris-tx-clock', hourDiff: 2 }    // Paris, Texas (CST is 2 hours ahead of PST)
];


// Draw the clock using the simple arithmetic difference from local time
function drawClock(clockData) {
    const { id, hourDiff } = clockData;
    const canvas = document.getElementById(id);
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    
    ctx.translate(radius, radius); 

    function renderTime() {
        ctx.restore();
        ctx.save(); 
        
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // --- FINAL FIX: Arithmetic Difference from Local Time ---
        const now = new Date();
        
        let hour = now.getHours();
        const minute = now.getMinutes();
        const second = now.getSeconds();

        // Apply the differential offset
        hour = (hour + hourDiff) % 24;
        if (hour < 0) {
            hour += 24; // Handle negative hours (e.g., Honolulu)
        }
        // ---------------------------------------------
        
        // Draw Clock Face, Numbers, and Markers 
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        
        // Draw Hands: 
        const hourPos = (hour % 12) * 5 + (minute / 12);

        drawHand(ctx, hourPos, radius * 0.5, radius * 0.07, 'hour'); 
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, 'minute'); 
        drawHand(ctx, second, radius * 0.9, radius * 0.02, 'second'); 
        
        requestAnimationFrame(renderTime);
    }
    
    renderTime();
}

// Function to draw the clock face and center dot (No Change)
function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#3b3b3b"; 
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#ff6347'; 
    ctx.fill();
}

// Draw Numbers on the clock face (No Change)
function drawNumbers(ctx, radius) {
    let ang;
    let num;
    ctx.font = radius * 0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillStyle = "#3b3b3b";

    for (num = 1; num < 13; num++) {
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

// Function to draw the clock hands (No Change)
function drawHand(ctx, pos, length, width, type) {
    let angle = Math.PI * (pos / 30) - (Math.PI / 2);

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    if (type === 'second') {
        ctx.strokeStyle = '#ff6347'; 
    } else {
        ctx.strokeStyle = '#3b3b3b'; 
    }

    ctx.moveTo(0, 0);
    ctx.rotate(angle);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-angle); 
}

// --- 4. Initialization ---
clocks.forEach(clock => {
    drawClock(clock);
});
