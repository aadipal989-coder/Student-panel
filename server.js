const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Import & Connection Setup
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./erp_database.db', (err) => {
    if (err) {
        console.error("Database Connection Error:", err.message);
    } else {
        console.log("Connected to SQLite Database successfully!");
    }
});

// Database Tables Creation
db.serialize(() => {
    // 1. Fee Status Table
    db.run(`CREATE TABLE IF NOT EXISTS fee_status (
        rollNo TEXT PRIMARY KEY,
        amountPaid INTEGER,
        status TEXT
    )`);

    // 2. Attendance Table
    db.run(`CREATE TABLE IF NOT EXISTS attendance (
        rollNo TEXT PRIMARY KEY,
        totalLectures INTEGER,
        totalPresent INTEGER,
        percentage REAL
    )`);

    // 3. Marks Table
    db.run(`CREATE TABLE IF NOT EXISTS marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rollNo TEXT,
        subject TEXT,
        marksObtained INTEGER,
        totalMarks INTEGER
    )`);
});


// Default Route
app.get('/', (req, res) => {
    res.send("Smart ERP Backend Server is Running!");
});

// API Endpoint: Fee Status Check
app.get('/api/fee-status', (req, res) => {
    res.json({
        success: true,
        message: "Fee status fetched successfully",
        data: studentData
    });
});

// Server Start
// Attendance GET Route
// 1. ATTENDANCE API ENDPOINTS
// ==========================================

// Attendance Fetch Route (GET)
app.get('/api/attendance/:rollNo', (req, res) => {
    const { rollNo } = req.params;
    const query = `SELECT * FROM attendance WHERE rollNo = ?`;
    
    db.get(query, [rollNo], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, data: row || { totalLectures: 0, totalPresent: 0, percentage: 0 } });
    });
});

// Attendance Update Route (POST)
app.post('/api/attendance', (req, res) => {
    const { rollNo, totalLectures, totalPresent } = req.body;
    const percentage = ((totalPresent / totalLectures) * 100).toFixed(2);

    const query = `
        INSERT INTO attendance (rollNo, totalLectures, totalPresent, percentage)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(rollNo) DO UPDATE SET
        totalLectures = excluded.totalLectures,
        totalPresent = excluded.totalPresent,
        percentage = excluded.percentage
    `;

    db.run(query, [rollNo, totalLectures, totalPresent, percentage], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Attendance updated successfully", percentage: percentage });
    });
});



// ==========================================

// ==========================================
// 2. MARKS API ENDPOINTS
// ==========================================

// Marks Fetch Route (GET)
app.get('/api/marks/:rollNo', (req, res) => {
    const { rollNo } = req.params;
    const query = `SELECT * FROM marks WHERE rollNo = ?`;

    db.all(query, [rollNo], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, data: rows });
    });
});

// Marks Entry Route (POST)
app.post('/api/marks', (req, res) => {
    const { rollNo, subject, marksObtained, totalMarks } = req.body;
    
    const query = `INSERT INTO marks (rollNo, subject, marksObtained, totalMarks) VALUES (?, ?, ?, ?)`;

    db.run(query, [rollNo, subject, marksObtained, totalMarks], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Marks recorded successfully", markId: this.lastID });
    });
});
// GET Route for Attendance Data
app.get('/api/attendance/:rollNo', (req, res) => {
    const rollNo = req.params.rollNo;
    const query = "SELECT * FROM attendance WHERE rollNo = ?";
    
    db.get(query, [rollNo], (err, row) => {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        if (!row) {
            // Agar record missing hai toh fallback dummy response
            return res.json({ 
                success: true, 
                data: { rollNo: rollNo, totalLectures: 0, totalPresent: 0, percentage: 0 } 
            });
        }
        res.json({ success: true, data: row });
    });
});
// POST Route to Save/Update Attendance
app.post('/api/attendance', (req, res) => {
    const { rollNo, totalLectures, totalPresent } = req.body;
    const percentage = totalLectures > 0 ? ((totalPresent / totalLectures) * 100).toFixed(2) : 0;

    const query = `
        INSERT INTO attendance (rollNo, totalLectures, totalPresent, percentage)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(rollNo) DO UPDATE SET
            totalLectures = excluded.totalLectures,
            totalPresent = excluded.totalPresent,
            percentage = excluded.percentage
    `;

    db.run(query, [rollNo, totalLectures, totalPresent, percentage], function(err) {
        if (err) {
            return res.status(500).json({ success: false, error: err.message });
        }
        res.json({ success: true, message: "Attendance updated successfully!" });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});