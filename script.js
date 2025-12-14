// --- 1. Global Setup ---
const clocks = [
    { id: 'sf-clock', timezone: 'America/Los_Angeles' }, // San Francisco
    { id: 'gnv-clock', timezone: 'America/New_York' }    // Gainesville (Eastern Time)
];

// Draw the clock using the timezone string
function drawClock(clockId, timezone) {
    const canvas = document.getElementById(clockId);
    const ctx = canvas.getContext('2d');
    const radius = canvas.height / 2;
    ctx.translate(radius, radius); // Move (0,0) to the center of the canvas

    setInterval(() => {
        // Clear canvas
        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();

        // Get the current time for the specific timezone
        const now = new Date();
        const localizedTime = now.toLocaleString('en-US', { timeZone: timezone });
        const time = new Date(localizedTime);

        let hour = time.getHours();
        let minute = time.getMinutes();
        let second = time.getSeconds();

        // Draw Clock Face and Numbers
        drawFace(ctx, radius);
        
        // Draw Hands
        drawHand(ctx, hour * 5 + (minute / 12) * 5, radius * 0.5, radius * 0.07, 'hour'); // Hour hand
        drawHand(ctx, minute, radius * 0.8, radius * 0.07, 'minute'); // Minute hand
        drawHand(ctx, second, radius * 0.9, radius * 0.02, 'second'); // Second hand
        
    }, 1000); // Update every second
}

// Function to draw the clock face and center dot
function drawFace(ctx, radius) {
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#34495e"; // Dark color for the face
    ctx.lineWidth = radius * 0.05;
    ctx.stroke();

    // Center dot (Neon Pink)
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f'; // Neon Pink
    ctx.fill();
    
    // Draw minute markers (Neon Cyan)
    for(let i = 0; i < 60; i++) {
        const len = (i % 5 === 0) ? radius * 0.1 : radius * 0.05;
        const angle = (i * Math.PI / 30);
        ctx.strokeStyle = (i % 5 === 0) ? '#0ff' : '#0ff'; // All neon cyan
        ctx.lineWidth = (i % 5 === 0) ? 3 : 1;

        ctx.rotate(angle);
        ctx.translate(0, -radius);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, len);
        ctx.stroke();
        ctx.translate(0, radius);
        ctx.rotate(-angle);
    }
}

// Function to draw the clock hands
function drawHand(ctx, pos, length, width, type) {
    // Convert time position to radians
    let angle = Math.PI * (pos / 30) - (Math.PI / 2);

    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";

    if (type === 'second') {
        ctx.strokeStyle = '#f0f'; // Neon Pink for Second Hand
    } else {
        ctx.strokeStyle = '#34495e'; // Dark color for Hour/Minute
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
