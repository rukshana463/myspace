// --- 1. Global Setup: All 7 Timezones using IANA identifiers ---
const clocks = [
    { id: 'sf-clock', timezone: 'America/Los_Angeles' },        // San Francisco, CA
    { id: 'gnv-clock', timezone: 'America/New_York' },          // Gainesville, FL
    { id: 'shanghai-clock', timezone: 'Asia/Shanghai' },        // Shanghai, China
    { id: 'basel-clock', timezone: 'Europe/Zurich' },           // Basel, Switzerland
    { id: 'honolulu-clock', timezone: 'Pacific/Honolulu' },     // Honolulu, HI
    { id: 'paris-fr-clock', timezone: 'Europe/Paris' },         // Paris, France
    { id: 'paris-tx-clock', timezone: 'America/Chicago' }       // Paris, Texas
];

// Draw the clock using the timezone string
function drawClock(clockData) {
    const { id, timezone } = clockData;
    const canvas = document.getElementById(id);
    
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    // Save context state to maintain center after translation
    ctx.save(); 
    ctx.translate(radius, radius); 

    function renderTime() {
        // Restore context state (undoes previous drawing actions but keeps translation)
        ctx.restore();
        ctx.save(); 
        
        // Clear canvas by drawing a fresh circle
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // --- Reliable Time Parsing (DST-Aware, Pure JS) ---
        const now = new Date();
        
        // Define the formatter to force 24-hour, 2-digit output
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false, 
            timeZone: timezone
        });

        const timeString = timeFormatter.format(now); 
        
        // Use a regex to safely extract the three number groups, regardless of separator
        const parts = timeString.match(/(\d{2})[^\d](\d{2})[^\d](\d{2})/);
        
        let hour = 0, minute = 0, second = 0;

        if (parts && parts.length === 4) {
            hour = parseInt(parts[1], 10);
            minute = parseInt(parts[2], 10);
            second = parseInt(parts[3], 10);
        } else {
             // Fallback to local time if parsing fails (prevents blank screen)
             const localNow = new Date();
             hour = localNow.getHours();
             minute = localNow.getMinutes();
             second = localNow.getSeconds();
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
