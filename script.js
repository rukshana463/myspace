// --- 1. Global Setup: All 7 Timezones with IANA identifiers and Fixed UTC Offsets ---
// offset: UTC hour offset (Standard Time). Used for fallback calculation.
const clocks = [
    { id: 'sf-clock', timezone: 'America/Los_Angeles', offset: -8 },        // San Francisco, CA (UTC-8)
    { id: 'gnv-clock', timezone: 'America/New_York', offset: -5 },          // Gainesville, FL (UTC-5)
    { id: 'shanghai-clock', timezone: 'Asia/Shanghai', offset: 8 },        // Shanghai, China (UTC+8)
    { id: 'basel-clock', timezone: 'Europe/Zurich', offset: 1 },           // Basel, Switzerland (UTC+1)
    { id: 'honolulu-clock', timezone: 'Pacific/Honolulu', offset: -10 },     // Honolulu, HI (UTC-10)
    { id: 'paris-fr-clock', timezone: 'Europe/Paris', offset: 1 },         // Paris, France (UTC+1)
    { id: 'paris-tx-clock', timezone: 'America/Chicago', offset: -6 }       // Paris, Texas (UTC-6)
];


/**
 * Fallback: Calculates time using a fixed UTC offset (in hours).
 * This ignores DST but is a reliable last resort if IANA strings fail.
 */
function getFallbackTime(offset) {
    const now = new Date();
    // Get the current UTC time in milliseconds
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000); 

    // Apply the fixed offset (offset * 3600000 ms per hour)
    const targetTimeMs = utcTime + (offset * 3600000);
    const targetDate = new Date(targetTimeMs);
    
    return {
        hour: targetDate.getHours(),
        minute: targetDate.getMinutes(),
        second: targetDate.getSeconds()
    };
}


// Draw the clock using the timezone string
function drawClock(clockData) {
    const { id, timezone, offset } = clockData;
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

        let hour = 0, minute = 0, second = 0;
        let timeCorrected = false;

        // --- ATTEMPT 1: Primary DST-Aware Method (Intl.DateTimeFormat) ---
        try {
            const now = new Date();
            const timeFormatter = new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false, 
                timeZone: timezone
            });

            const timeString = timeFormatter.format(now); 
            const parts = timeString.match(/(\d{2})[^\d](\d{2})[^\d](\d{2})/);
            
            if (parts && parts.length === 4) {
                hour = parseInt(parts[1], 10);
                minute = parseInt(parts[2], 10);
                second = parseInt(parts[3], 10);
                timeCorrected = true;
            }
        } catch (e) {
            console.error(`Error in primary time method for ${timezone}:`, e);
        }
        
        // --- ATTEMPT 2: Fallback to Fixed UTC Offset ---
        if (!timeCorrected) {
             const fallbackTime = getFallbackTime(offset);
             hour = fallbackTime.hour;
             minute = fallbackTime.minute;
             second = fallbackTime.second;
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
