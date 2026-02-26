document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("faculty-container");
  if (!container) return;

  try {
    const response = await fetch(
      "./data/faculty.json?nocache=" + new Date().getTime(),
    );
    const data = await response.json();
    var delay = 0;
    data.forEach((member) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";

      const photoSection = member.photo
        ? `<img src="${member.photo}" class="faculty-img" alt="${member.name}">`
        : `
          <div class="faculty-avatar">
            <i class="fas fa-user"></i>
          </div>
        `;

      col.innerHTML = `
         <div class="faculty-card" data-aos="fade-up" data-aos-delay="${delay}">
    ${photoSection}
      
        <h6>${member.name}</h6>
        <p>${member.designation}</p>
  
  </div>
      `;

      container.appendChild(col);
      delay += 100;
    });
  } catch (error) {
    container.innerHTML = `
      <div class="col-12 text-center text-danger">
        Failed to load faculty data.
      </div>
    `;
  }
});

function formatText(text) {
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}
