// --- 1. Global Setup: All 7 Timezones ---
const clocks = [
    { id: 'sf-clock', timezone: 'America/Los_Angeles' },        // San Francisco, CA
    { id: 'gnv-clock', timezone: 'America/New_York' },          // Gainesville, FL
    { id: 'shanghai-clock', timezone: 'Asia/Shanghai' },        // Shanghai, China
    { id: 'basel-clock', timezone: 'Europe/Zurich' },           // Basel, Switzerland
    { id: 'honolulu-clock', timezone: 'Pacific/Honolulu' },     // Honolulu, HI
    { id: 'paris-fr-clock', timezone: 'Europe/Paris' },         // Paris, France
    { id: 'paris-tx-clock', timezone: 'America/Chicago' }       // Paris, Texas
];

/**
 * Gets the current time components (H, M, S) for a given timezone.
 * Returns an object: {hour: number, minute: number, second: number}
 */
function getTimeComponents(timezone) {
    const now = new Date();
    
    // Create a formatter that returns the date/time string with the target timezone
    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // Force 24-hour output for easy parsing
        timeZone: timezone
    });

    // Example output for London: "22:15:30"
    const timeString = timeFormatter.format(now); 
    const [hourStr, minuteStr, secondStr] = timeString.split(':');
    
    return {
        hour: parseInt(hourStr, 10),
        minute: parseInt(minuteStr, 10),
        second: parseInt(secondStr, 10)
    };
}


// Draw the clock using the timezone string
function drawClock(clockData) {
    const { id, timezone } = clockData;
    const canvas = document.getElementById(id);
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius); 

    // Use a reliable interval function that calls itself immediately 
    // to avoid the initial 1-second delay.
    function renderTime() {
        // Clear canvas
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // Get reliable time components
        const time = getTimeComponents(timezone);
        
        // Draw Clock Face, Numbers, and Markers
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        
        // Draw Hands: Time is now guaranteed to be a number (0-23, 0-59, 0-59)
        // Hour Position Calculation: (Hour * 5) + (Minute / 12) * 5
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
    // Convert time position to radians
    // 60 minutes/seconds or 12 hours * 5 = 60 steps around the clock face
    let angle = Math.PI * (pos / 30) - (Math.PI / 2);

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    if (type === 'second') {
        ctx.strokeStyle = '#ff6347'; // Red for Second Hand
    } else {
        ctx.strokeStyle = '#3b3b3b'; // Dark color for Hour/Minute
    }

    ctx.moveTo(0, 0);
    ctx.rotate(angle);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-angle); // Rotate back
}

// --- 4. Initialization ---
clocks.forEach(clock => {
    drawClock(clock);
});
