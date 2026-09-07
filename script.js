// Aage chal kar hum yahan Firebase ka data connect karenge
console.log("Student Dashboard Loaded Successfully!");
const ctx = document.getElementById('attendanceChart').getContext('2d');

new Chart(ctx, {
    type: 'pie',
    data: {
        labels: ['Present', 'Absent'],
        datasets: [{
            data: [41, 9], // 41 Present, 9 Absent
            backgroundColor: [
                '#2395fadd', // Green for Present
                '#d32f2f'  // Red for Absent
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            }
        }
    }
});
// Dynamic Day & Timetable Generator
document.addEventListener("DOMContentLoaded", () => {
    const days = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
    const today = new Date();
    const currentDayName = days[today.getDay()];

    // Set Present Day in Header
    document.getElementById("currentDay").innerText = currentDayName;

    // College Subjects Schedule Data
    const scheduleData = [
        {
            time: "09:10 AM - 10:05 AM",
            subject: "Mathematics-III",
            code: "BAS301",
            faculty: "Dr. Rajesh Verma",
            facultyCode: "KIT102",
            room: "CS BUILDING / Floor-2 / R201",
            type: "LECTURE"
        },
        {
            time: "10:05 AM - 11:00 AM",
            subject: "Data Structures",
            code: "CS301",
            faculty: "Prof. Amit Sharma",
            facultyCode: "KIT205",
            room: "CS BUILDING / Floor-2 / R202",
            type: "LECTURE"
        },
        {
            time: "11:50 AM - 12:45 PM",
            subject: "Web Technology",
            code: "CS305",
            faculty: "Er. Neha Gupta",
            facultyCode: "KIT309",
            room: "LAB BUILDING / Floor-1 / LAB-2",
            type: "PRACTICAL / LAB"
        }
    ];

    // Render Slots
    const timetableContainer = document.getElementById("timetableList");
    timetableContainer.innerHTML = ""; // Clear existing static html

    scheduleData.forEach(slot => {
        const slotHTML = `
            <div class="tt-slot">
                <div class="tt-time">${slot.time}</div>
                <div class="tt-detail">Subject: <span class="tt-highlight">${slot.subject}</span></div>
                <div class="tt-detail">Subject Code: <b>${slot.code}</b></div>
                <div class="tt-detail">Faculty: <span class="tt-faculty">${slot.faculty}</span></div>
                <div class="tt-detail">Faculty Code: <b>${slot.facultyCode}</b></div>
                <div class="tt-detail">Location/Room: <b>${slot.room}</b></div>
                <div class="tt-tag">${slot.type}</div>
            </div>
        `;
        timetableContainer.innerHTML += slotHTML;
    });
});
window.toggleMenu = function() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");
    
    if (sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        overlay.style.display = "none";
    } else {
        sidebar.classList.add("open");
        overlay.style.display = "block";
    }
};


