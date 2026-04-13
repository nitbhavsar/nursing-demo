document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("faculty-container");
  if (!container) return;

  // Show skeleton loaders while fetching
  showSkeletons(container, 6);

  try {
    const response = await fetch(
      "./data/faculty.json?nocache=" + new Date().getTime(),
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    container.innerHTML = "";

    if (!data.length) {
      showEmpty(container);
      return;
    }

    let delay = 0;
    const currentYear = new Date().getFullYear();

    data.slice(0, 6).forEach((member) => {
      const col = document.createElement("div");
      col.className = "col-md-6 col-lg-4";

      const name = formatText(member.name || "");
      const designation = formatText(member.designation || "");
      const dept = member.department ? formatText(member.department) : null;
      const qual = member.qualification || null;
      const exp = currentYear - parseInt(member.experience, 10) || null;

      // Photo or initials avatar
      const initials = getInitials(name);
      const photoSection = member.photo
        ? `<img src=".${member.photo}" class="faculty-img" alt="${name}" loading="lazy">`
        : `<div class="faculty-avatar">${initials}</div>`;

      // Optional meta pills
      const metaPills = [
        dept
          ? `<span class="faculty-pill"><i class="fas fa-layer-group"></i>${dept}</span>`
          : "",
        qual
          ? `<span class="faculty-pill"><i class="fas fa-graduation-cap"></i>${qual}</span>`
          : "",
        exp
          ? `<span class="faculty-pill"><i class="fas fa-briefcase"></i>${exp}</span>`
          : "",
      ]
        .filter(Boolean)
        .join("");

      col.innerHTML = `
        <div class="faculty-card" data-aos="fade-up" data-aos-delay="${delay}">
          <div class="faculty-card__photo-wrap">
            ${photoSection}
            <div class="faculty-card__photo-ring"></div>
          </div>
          <div class="faculty-card__body">
            <h6 class="faculty-card__name">${name}</h6>
            <p class="faculty-card__role">${designation}</p>
            ${metaPills ? `<div class="faculty-card__pills">${metaPills}</div>` : ""}
          </div>
        </div>
      `;

      container.appendChild(col);
      delay += 100;
    });

    // Re-init AOS for dynamically added elements
    if (typeof AOS !== "undefined") AOS.refresh();
  } catch (error) {
    console.error("Faculty load error:", error);
    container.innerHTML = `
      <div class="col-12 text-center faculty-error">
        <i class="fas fa-circle-exclamation"></i>
        <p>Unable to load faculty data. Please try again later.</p>
      </div>
    `;
  }
});

/* ── Helpers ─────────────────────────────────────────────── */

function formatText(text) {
  return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
}

function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function showSkeletons(container, count) {
  container.innerHTML = Array.from({ length: count })
    .map(
      () => `
      <div class="col-md-6 col-lg-4">
        <div class="faculty-card faculty-card--skeleton">
          <div class="faculty-skeleton__photo"></div>
          <div class="faculty-skeleton__line faculty-skeleton__line--name"></div>
          <div class="faculty-skeleton__line faculty-skeleton__line--role"></div>
          <div class="faculty-skeleton__line faculty-skeleton__line--pill"></div>
        </div>
      </div>`,
    )
    .join("");
}

function showEmpty(container) {
  container.innerHTML = `
    <div class="col-12 text-center faculty-error">
      <i class="fas fa-users-slash"></i>
      <p>No faculty members found.</p>
    </div>
  `;
}
