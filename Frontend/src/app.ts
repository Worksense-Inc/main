const API_BASE = "http://localhost:3000"; 

document.getElementById("ping").addEventListener("click", async () => {
  const r = await fetch(`${API_BASE}/api/hello`);
  const data = await r.json();
  document.getElementById("out").textContent = JSON.stringify(data, null, 2);
});