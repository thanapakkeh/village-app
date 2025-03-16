function login() {
  const houseNumber = document.getElementById("houseNumber").value.trim();
  const password = document.getElementById("password").value;
  const errorMsg = document.getElementById("errorMsg");

  if (!houseNumber || !password) {
    errorMsg.textContent = "กรุณากรอกข้อมูลให้ครบ";
    return;
  }

  const email = houseNumber.replaceAll("/", "_") + "@village.local";

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      errorMsg.textContent = "เข้าสู่ระบบไม่สำเร็จ: " + error.message;
    });
}