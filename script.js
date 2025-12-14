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

// Draw the clock using the timezone string
function drawClock(clockId, timezone) {
    const canvas = document.getElementById(clockId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius); 

    // Use a variable to store the interval ID
    const intervalId = setInterval(() => {
        // Clear canvas
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // 🌟 FIX: Use Intl.DateTimeFormat for reliable time zone extraction 🌟
        const now = new Date();
        
        const hourFormatter = new Intl.DateTimeFormat('en', {
            hour: 'numeric',
            hour12: false,
            timeZone: timezone
        });
        const minuteFormatter = new Intl.DateTimeFormat('en', {
            minute: 'numeric',
            timeZone: timezone
        });
        const secondFormatter = new Intl.DateTimeFormat('en', {
            second: 'numeric',
            timeZone: timezone
        });
        
        let hour = parseInt(hourFormatter.format(now));
        let minute = parseInt(minuteFormatter.format(now));
        let second = parseInt(secondFormatter.format(now));
        
        // Draw Clock Face, Numbers, and Markers
        drawFace(ctx, radius);
        drawNumbers(ctx, radius);
        
        // Draw Hands
        drawHand(ctx, hour * 5 + (minute / 12) * 5, radius * 0.5, radius * 0.07, 'hour'); 
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, 'minute'); 
        drawHand(ctx, second, radius * 0.9, radius * 0.02, 'second'); 
        
    }, 1000); 
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
    drawClock(clock.id, clock.timezone);
});
