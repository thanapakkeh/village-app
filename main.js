const API_DUE = "https://script.google.com/macros/s/AKfycbw4-jXR0IdO7vvf-phzTwIhCZZFJELd8hpFISf47Iyby0tJ6CkvzCLhAd0IiQUN7WpwAw/exec";
const API_CLEAR = "https://script.google.com/macros/s/AKfycbyHcHWbqxS6N1HRj-xnaLN7jpvIFqtETwcbmHFson7giDyyKNeT2V5rloXg2B46r11HXw/exec";

async function login() {
  const houseNumber = document.getElementById("houseNumber").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  errorMsg.textContent = "";

  if (!houseNumber) {
    errorMsg.textContent = "❗ กรุณากรอกบ้านเลขที่";
    return;
  }

  try {
    const [dueRes, clearRes] = await Promise.all([fetch(API_DUE), fetch(API_CLEAR)]);
    const dueData = await dueRes.json();
    const clearData = await clearRes.json();

    const houseMap = {};
    clearData.forEach(item => houseMap[item["บ้านเลขที่"]] = item);
    dueData.forEach(item => houseMap[item["บ้านเลขที่"]] = item);

    const match = houseMap[houseNumber];
    if (!match) {
      errorMsg.textContent = `❌ ไม่พบบ้านเลขที่ ${houseNumber}`;
    } else {
      sessionStorage.setItem("houseData", JSON.stringify(match));
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    errorMsg.textContent = "⚠️ เกิดข้อผิดพลาดในการโหลดข้อมูล";
    console.error(err);
  }
}

function loadDashboard() {
  const resultDiv = document.getElementById("result");
  const houseData = JSON.parse(sessionStorage.getItem("houseData"));

  if (!houseData) {
    resultDiv.innerHTML = `<p style="color:red;">❌ ไม่พบข้อมูล กรุณาเข้าสู่ระบบใหม่</p>`;
    return;
  }

  const status = (houseData["สถานะ"] || "").trim();
  const updated = formatThaiDate(houseData["อัปเดตล่าสุด"]);

  if (status.includes("มียอด")) {
    resultDiv.innerHTML = `
      <div class="card">
        <p><strong>📅 ช่วงค้างชำระ:</strong> ${houseData["ช่วงค้างชำระ"] || "-"}</p>
        <p><strong>💰 ยอดค้างชำระ:</strong> ${houseData["ยอดรวมค้างชำระ"] || "0"} บาท</p>
        <p><strong>📅 อัปเดตล่าสุด:</strong> ${updated}</p>
      </div>`;
  } else {
    resultDiv.innerHTML = `
      <div class="card">
        <p>✅ <strong>ไม่มีค้างชำระ</strong></p>
        <p>💰 ยอดค้างชำระ: 0 บาท</p>
        <p><strong>📅 อัปเดตล่าสุด:</strong> ${updated}</p>
      </div>`;
  }
}

function logout() {
  sessionStorage.clear();
  window.location.href = "index.html";
}

function formatThaiDate(dateString) {
  if (!dateString) return "-";
  const d = new Date(dateString);
  const months = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
                  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}

if (window.location.pathname.includes("dashboard.html")) {
  window.addEventListener("DOMContentLoaded", loadDashboard);
}