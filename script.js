// --- 1. Global Setup: All 7 Locations with Offset relative to San Francisco ---
// Offset is the number of hours AHEAD (+) or BEHIND (-) San Francisco (PST/PDT).
const clocks = [
    { id: 'sf-clock', hourDiff: 0 },         // San Francisco, CA (PST)
    { id: 'gnv-clock', hourDiff: 3 },        // Gainesville, FL (EST is 3 hours ahead)
    { id: 'shanghai-clock', hourDiff: 16 },  // Shanghai, China (CST is 16 hours ahead)
    { id: 'basel-clock', hourDiff: 9 },      // Basel, Switzerland (CET is 9 hours ahead)
    { id: 'honolulu-clock', hourDiff: -2 },  // Honolulu, HI (HST is 2 hours behind)
    { id: 'paris-fr-clock', hourDiff: 9 },   // Paris, France (CET is 9 hours ahead)
    { id: 'paris-tx-clock', hourDiff: 2 }    // Paris, Texas (CST is 2 hours ahead)
];

// --- Core Function: Get SF Time and apply difference ---
function getSFTimeComponents(hourDiff) {
    // 1. Get the current time in the browser's local timezone.
    const now = new Date();
    
    // 2. Determine the San Francisco time (PST is UTC-8, and EST is UTC-5). 
    //    We use IANA to reliably get the SF hour, which is often more stable 
    //    than using the local machine time for all calculations.
    
    let sfHour = now.getHours();
    let sfMinute = now.getMinutes();
    let sfSecond = now.getSeconds();

    // Use a single IANA call just for the SF time, which is the base.
    try {
        const timeFormatter = new Intl.DateTimeFormat('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            hour12: false, timeZone: 'America/Los_Angeles'
        });
        const timeString = timeFormatter.format(now);
        const parts = timeString.match(/(\d{2})[^\d](\d{2})[^\d](\d{2})/);
        
        if (parts && parts.length === 4) {
            sfHour = parseInt(parts[1], 10);
            sfMinute = parseInt(parts[2], 10);
            sfSecond = parseInt(parts[3], 10);
        }
    } catch (e) {
        // Fallback: If IANA fails, use the local machine time for SF's base
        // (This assumes the user's browser is set to SF time, which it appears to be).
    }

    // 3. Apply the differential offset from the SF base time
    let targetHour = sfHour + hourDiff;
    
    // Handle wrap-around (e.g., 23 + 3 = 26, should be 2)
    targetHour = targetHour % 24;
    // Handle wrap-behind (e.g., 0 - 2 = -2, should be 22)
    if (targetHour < 0) {
        targetHour += 24; 
    }

    return {
        hour: targetHour,
        minute: sfMinute,
        second: sfSecond
    };
}


// Draw the clock using the offset data
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

        // Get reliable time components
        const time = getSFTimeComponents(hourDiff);
        
        const hour = time.hour;
        const minute = time.minute;
        const second = time.second;
        
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

// Draw Face (No Change)
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

// Draw Numbers (No Change)
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

// Draw Hands (No Change)
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
