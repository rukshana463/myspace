// --- 1. Global Setup: All 7 Timezones using IANA identifiers ---
const clocks = [
    { id: 'sf-clock', timezone: 'America/Los_Angeles' },        // San Francisco, CA
    { id: 'gnv-clock', timezone: 'America/New_York' },          // Gainesville, FL
    { id: 'shanghai-clock', timezone: 'Asia/Shanghai' },        // Shanghai, China
    { id: 'basel-clock', timezone: 'Europe/Zurich' },           // Basel, Switzerland (Zurich is the official zone)
    { id: 'honolulu-clock', timezone: 'Pacific/Honolulu' },     // Honolulu, HI
    { id: 'paris-fr-clock', timezone: 'Europe/Paris' },         // Paris, France
    { id: 'paris-tx-clock', timezone: 'America/Chicago' }       // Paris, Texas (America/Chicago covers Central Time)
];

// Draw the clock using the timezone string
function drawClock(clockData) {
    const { id, timezone } = clockData;
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

        // Use Intl.DateTimeFormat to reliably get H, M, S for the specified time zone
        const now = new Date();
        
        // Use toLocaleTimeString for a single reliable string that includes DST adjustment
        const timeOptions = {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // Ensure 24-hour format
            timeZone: timezone
        };
        
        const timeString = now.toLocaleTimeString('en-US', timeOptions);
        
        // Safely parse the time string (e.g., "14:30:15")
        const [hourStr, minuteStr, secondStr] = timeString.split(':');
        
        const hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        const second = parseInt(secondStr, 10);

        // Check if parsing failed (resulting in NaN). If so, stop rendering.
        if (isNaN(hour) || isNaN(minute) || isNaN(second)) {
            console.error(`Failed to parse time for ${timezone}. Result: ${timeString}`);
            // Draw face but skip hands to prevent errors
            drawFace(ctx, radius);
            drawNumbers(ctx, radius);
            requestAnimationFrame(renderTime);
            return; 
        }

        // Draw Clock Face, Numbers, and Markers (functions remain unchanged)
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        
        // Draw Hands: 
        // Hour Position Calculation: (Hour % 12) * 5 + (Minute / 12) * 5
        const hourPos = (hour % 12) * 5 + (minute / 12);

        drawHand(ctx, hourPos, radius * 0.5, radius * 0.07, 'hour'); 
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, 'minute'); 
        drawHand(ctx, second, radius * 0.9, radius * 0.02, 'second'); 
        
        requestAnimationFrame(renderTime);
    }
    
    renderTime();
}

// (The rest of the helper functions: drawFace, drawNumbers, drawHand are unchanged)

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
