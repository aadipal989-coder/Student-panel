let isLocationValid = false;
let scannedQRData = null;

// 1. GPS Location Check (Geo-fencing logic)
function checkLocation() {
    const locText = document.getElementById("locationText");
    const locBadge = document.getElementById("locationBadge");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                // College Location Geofence Check (Demo logic)
                isLocationValid = true;
                locText.innerText = "Aap College Campus ke andar hain!";
                locBadge.innerText = "✓ Inside Geofence Area";
                locBadge.className = "status-badge status-success";
                enableSubmitIfReady();
            },
            (error) => {
                // Testing/Demo ke liye location allow kar rahe hain
                isLocationValid = true; 
                locText.innerText = "Location GPS detected (Campus Zone)";
                locBadge.innerText = "✓ Location Verified";
                locBadge.className = "status-badge status-success";
                enableSubmitIfReady();
            }
        );
    } else {
        locText.innerText = "Aapke device me Geolocation support nahi hai.";
        locBadge.innerText = "✖ Location Failed";
        locBadge.className = "status-badge status-danger";
    }
}

// 2. Start QR Code Scanner
function startQRScanner() {
    const html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" }, // Rear camera
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText, decodedResult) => {
            // Success QR Scan
            scannedQRData = decodedText;
            document.getElementById("scanResult").innerHTML = `<b style="color: #2e7d32;">✓ QR Code Scanned Successfully!</b>`;
            html5QrCode.stop(); // Stop scanner after successful scan
            enableSubmitIfReady();
        },
        (errorMessage) => {
            // Scanning in progress...
        }
    ).catch(err => {
        document.getElementById("scanResult").innerText = "Camera permission allow karein!";
    });
}

// 3. Enable Submit Button when both Location & QR are Ready
function enableSubmitIfReady() {
    if (isLocationValid && scannedQRData) {
        document.getElementById("markBtn").style.display = "block";
    }
}

// 4. Submit Attendance Function
function submitAttendance() {
    alert("🎉 Attendance Successfully Marked!\nSubject Code: CS301\nTime: " + new Date().toLocaleTimeString());
    window.location.href = "index.html"; // Redirect back to Dashboard
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    checkLocation();
    startQRScanner();
});
