// --- 1. Global Setup: All 7 Timezones with Fixed UTC Offsets ---
// Note: Offset is in hours, relative to UTC (e.g., -8 for San Francisco)
const clocks = [
    { id: 'sf-clock', offset: -8 },      // San Francisco, CA (UTC-8)
    { id: 'gnv-clock', offset: -5 },     // Gainesville, FL (UTC-5)
    { id: 'shanghai-clock', offset: 8 }, // Shanghai, China (UTC+8)
    { id: 'basel-clock', offset: 1 },    // Basel, Switzerland (UTC+1)
    { id: 'honolulu-clock', offset: -10 }, // Honolulu, HI (UTC-10)
    { id: 'paris-fr-clock', offset: 1 }, // Paris, France (UTC+1)
    { id: 'paris-tx-clock', offset: -6 } // Paris, Texas (UTC-6)
];

/**
 * Gets the current time components (H, M, S) for a fixed UTC offset.
 */
function getTimeComponents(offset) {
    const now = new Date();
    
    // Get the current UTC time (milliseconds)
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); 

    // Create a new date object for the target location by applying the offset
    // Offset is in hours, converted to milliseconds (offset * 3600000)
    const targetTimeMs = utcTime + (offset * 3600000);
    const targetDate = new Date(targetTimeMs);
    
    return {
        hour: targetDate.getHours(),
        minute: targetDate.getMinutes(),
        second: targetDate.getSeconds()
    };
}


// Draw the clock using the timezone data
function drawClock(clockData) {
    const { id, offset } = clockData;
    const canvas = document.getElementById(id);
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius); 

    function renderTime() {
        // Clear canvas
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // Get reliable time components via fixed offset
        const time = getTimeComponents(offset);
        
        // Draw Clock Face, Numbers, and Markers (functions remain unchanged)
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        
        // Draw Hands
        // Hour Position: (Hour % 12) * 5 + (Minute / 12) * 5
        const hourPos = (time.hour % 12) * 5 + (time.minute / 12);

        drawHand(ctx, hourPos, radius * 0.5, radius * 0.07, 'hour'); 
        drawHand(ctx, time.minute, radius * 0.8, radius * 0.07, 'minute'); 
        drawHand(ctx, time.second, radius * 0.9, radius * 0.02, 'second'); 
        
        requestAnimationFrame(renderTime);
    }
    
    // Start the clock updates
    renderTime();
}

// Function to draw the clock face and center dot (No Change)
function drawFace(ctx, radius) {
    // Outer Circle
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#3b3b3b"; 
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    // Center dot (Red)
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
