const API_URL = "https://health-backend-44r7.onrender.com"; // Ensure this matches your flask URL

// Simple security check for demonstration
function checkAdmin() {
    const code = document.getElementById("adminCode").value;
    if(code === "1234") { // Hardcoded password for demo
        document.getElementById("adminLoginOverlay").style.display = "none";
        loadAllData();
    } else {
        alert("Invalid Access Code");
    }
}

function showSection(sectionId) {
    document.querySelectorAll('.admin-section').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

    document.getElementById('sec_' + sectionId).style.display = 'block';

    document.querySelector(`[onclick="showSection('${sectionId}')"]`)?.classList.add('active');

}

async function loadAllData() {
    loadAppointments();
    loadRecords();
    loadMedications();
}

// 1. Fetch Appointments
async function loadAppointments() {
    try {
        const res = await fetch(`${API_URL}/admin/all_appointments`, { method: "POST" });
        const data = await res.json();
        
        const tbody = document.getElementById("adminApptTable");
        tbody.innerHTML = "";
        
        if(data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6' class='text-center'>No appointments found</td></tr>";
            return;
        }

        data.forEach(appt => {
            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold">${appt.patient_name}</td>
                    <td>${appt.age || 'N/A'}</td>
                    <td><span class="status-badge bg-blue">${appt.doctor}</span></td>
                    <td>${appt.date} at ${appt.time}</td>
                    <td>${appt.user_email}</td>
                    <td>
    <button class="btn btn-sm btn-outline-success"
            onclick="completeAppointment(${appt.id})">
        Complete
    </button>
</td>


                    </tr>
            `;
        });
    } catch(err) { console.error(err); }
}

// 2. Fetch Health Records
async function loadRecords() {
    try {
        const res = await fetch(`${API_URL}/admin/all_records`, { method: "POST" });
        const data = await res.json();
        
        const grid = document.getElementById("adminRecordsGrid");
        grid.innerHTML = "";
        
        if(data.length === 0) {
            grid.innerHTML = "<p class='text-center'>No records found</p>";
            return;
        }

        data.forEach(rec => {
            grid.innerHTML += `
                <div class="col-md-6">
                    <div class="admin-card">
                        <div class="d-flex justify-content-between">
                            <h5>${rec.patient_name} <small class="text-muted">(${rec.age} yrs)</small></h5>
                            <span class="badge bg-danger">${rec.blood_group || '?'}</span>
                        </div>
                        <hr>
                        <div class="row">
                            <div class="col-6">
                                <small class="text-muted">Height/Weight</small><br>
                                <strong>${rec.height}cm / ${rec.weight}kg</strong>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Emergency Contact</small><br>
                                <strong>${rec.emergency_phone || 'N/A'}</strong>
                            </div>
                        </div>
                        <div class="mt-3">
                            <small class="text-muted">Conditions:</small>
                            <p class="mb-1">${rec.medical_conditions || 'None'}</p>
                            <small class="text-muted">Allergies:</small>
                            <p class="mb-0 text-danger">${rec.allergies || 'None'}</p>
                        </div>
                    </div>
                </div>
            `;
        });
    } catch(err) { console.error(err); }
}

// 3. Fetch Medications
async function loadMedications() {
    try {
        const res = await fetch(`${API_URL}/admin/all_medications`, { method: "POST" });
        const data = await res.json();
        
        const tbody = document.getElementById("adminMedTable");
        tbody.innerHTML = "";
        
        if(data.length === 0) {
            tbody.innerHTML = "<tr><td colspan='5' class='text-center'>No medication logs found</td></tr>";
            return;
        }

        data.forEach(med => {
            tbody.innerHTML += `
                <tr>
                    <td class="fw-bold">${med.patient_name}</td>
                    <td><i class="fas fa-capsules text-primary"></i> ${med.med_name}</td>
                    <td>${med.dosage}</td>
                    <td>${med.frequency}</td>
                    <td>${med.duration} days</td>
                </tr>
            `;
        });
    } catch(err) { console.error(err); }
}
// --------------------------------------------------
// MARK APPOINTMENT AS COMPLETED (ADMIN ACTION)
// --------------------------------------------------
async function completeAppointment(id) {
    if (!confirm("Mark this appointment as completed?")) return;

    try {
        const res = await fetch(`${API_URL}/admin/appointment/complete`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id })
        });

        const out = await res.json();
        alert(out.msg);

        loadAppointments(); // refresh admin table
    }
    catch (err) {
        alert("Server error. Check Flask console.");
        console.error(err);
    }
}




