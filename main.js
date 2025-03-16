// ดึง Auth instance
const auth = firebase.auth();

function login() {
  const houseNumber = document.getElementById("houseNumber").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";

  if (!houseNumber || !password) {
    errorMsg.textContent = "กรุณากรอกข้อมูลให้ครบถ้วน";
    return;
  }

  // แปลงบ้านเลขที่เป็น email ภายใน
  const email = houseNumber.replace("/", "_") + "@village.local";

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      sessionStorage.setItem("houseNumber", houseNumber);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error(error);
      errorMsg.textContent = "เข้าสู่ระบบไม่สำเร็จ: " + error.message;
    });
}

function logout() {
  auth.signOut().then(() => {
    sessionStorage.clear();
    window.location.href = "index.html";
  });
}

function loadDashboard() {
  const houseNumber = sessionStorage.getItem("houseNumber");
  const resultDiv = document.getElementById("result");

  if (!houseNumber) {
    resultDiv.innerHTML = "<p style='color:red;'>กรุณาเข้าสู่ระบบใหม่</p>";
    return;
  }

  // จำลองข้อมูลบ้าน (ในโปรเจกต์จริงจะดึงจาก Firestore หรือ API)
  const mockData = {
    "399/1": { สถานะ: "มียอดค้าง", ยอดรวมค้างชำระ: 500, อัปเดตล่าสุด: "2025-03-15" },
    "399/2": { สถานะ: "ไม่มีค้างชำระ", ยอดรวมค้างชำระ: 0, อัปเดตล่าสุด: "2025-03-16" }
  };

  const data = mockData[houseNumber];

  if (!data) {
    resultDiv.innerHTML = "<p>ไม่พบข้อมูลบ้านเลขที่ " + houseNumber + "</p>";
    return;
  }

  const updated = formatThaiDate(data["อัปเดตล่าสุด"]);

  if (data["ยอดรวมค้างชำระ"] > 0) {
    resultDiv.innerHTML = `
      <div class="card">
        <p><strong>สถานะ:</strong> ❗ ${data["สถานะ"]}</p>
        <p><strong>ยอดค้างชำระ:</strong> ${data["ยอดรวมค้างชำระ"]} บาท</p>
        <p><strong>อัปเดตล่าสุด:</strong> ${updated}</p>
      </div>`;
  } else {
    resultDiv.innerHTML = `
      <div class="card">
        <p><strong>สถานะ:</strong> ✅ ไม่มีค้างชำระ</p>
        <p><strong>ยอดค้างชำระ:</strong> 0 บาท</p>
        <p><strong>อัปเดตล่าสุด:</strong> ${updated}</p>
      </div>`;
  }
}

function formatThaiDate(dateStr) {
  const d = new Date(dateStr);
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
                  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return d.getDate() + " " + months[d.getMonth()] + " " + (d.getFullYear() + 543);
}

// โหลดข้อมูลเมื่ออยู่หน้า dashboard
if (window.location.pathname.includes("dashboard.html")) {
  window.addEventListener("DOMContentLoaded", loadDashboard);
}
