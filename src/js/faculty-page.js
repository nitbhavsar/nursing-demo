/* faculty-page.js
   Fetches faculty.json and renders cards into #facultyGrid
   Handles department filter, skeleton loaders, initials avatar
   Gracefully hides empty fields (qualification, department, experience)
*/

(function () {
  const grid = document.getElementById("facultyGrid");
  const empty = document.getElementById("facultyEmpty");
  const filters = document.querySelectorAll(".faculty-filter .filter-btn");

  if (!grid) return;

  // Colour palette for initials avatars (cycles through)
  const AVATAR_COLORS = [
    ["#0f4c5c", "#2ec4b6"],
    ["#1a6b7a", "#3dd6c8"],
    ["#0a3340", "#2ec4b6"],
    ["#134f5c", "#48d9cb"],
    ["#0d5c6e", "#25b0a3"],
  ];

  // Generate initials from full name
  function getInitials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");
  }

  // Build one faculty card HTML string
  function buildCard(member, index) {
    const initials = getInitials(member.name);
    const [bg, accent] = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const featuredClass = member.featured ? "fc-featured" : "";

    // Photo or initials avatar
    const photoHTML = member.photo
      ? `<img src="..${member.photo}" alt="${member.name}" loading="lazy" />`
      : `<div class="fc-initials-avatar" style="--bg:${bg};--accent:${accent};">
           <span>${initials}</span>
         </div>`;

    // Featured badge (Vice Principal etc)
    const featuredBadge = member.featured
      ? `<div class="fc-badge">${member.designation}</div>`
      : "";

    // Only render qualification row if not empty
    const qualHTML = member.qualification
      ? `<p class="fc-qualification">
           <i class="fas fa-graduation-cap"></i> ${member.qualification}
         </p>`
      : "";

    // Only render footer if at least one field has data
    const footerItems = [];
    if (member.department) {
      footerItems.push(
        `<span class="fc-dept"><i class="fas fa-layer-group"></i> ${member.department}</span>`,
      );
    }
    if (member.experience) {
      const currentYear = new Date().getFullYear();
      const years = currentYear - parseInt(member.experience, 10);
      footerItems.push(
        `<span class="fc-exp"><i class="fas fa-briefcase"></i> ${years} Yrs</span>`,
      );
    }
    const footerHTML = footerItems.length
      ? `<div class="fc-footer">${footerItems.join("")}</div>`
      : "";

    return `
      <div class="faculty-card ${featuredClass}"
           data-dept="${member.department || ""}"
           data-aos="fade-up"
           data-aos-delay="${(index % 4) * 60}">

        <div class="fc-photo-wrap">

          ${photoHTML}
          ${featuredBadge}
        </div>

        <div class="fc-body">
          <h3>${member.name}</h3>
          <p class="fc-designation">${member.designation}</p>
          ${qualHTML}
          ${footerHTML}
        </div>

      </div>
    `;
  }

  // Render cards into grid
  function renderCards(data) {
    if (!data.length) {
      grid.innerHTML = "";
      empty.style.display = "flex";
      return;
    }
    empty.style.display = "none";
    grid.innerHTML = data.map((m, i) => buildCard(m, i)).join("");
    if (window.AOS) AOS.refresh();
  }

  // Filter handler
  let allFaculty = [];

  function applyFilter(dept) {
    const filtered =
      dept === "all"
        ? allFaculty
        : allFaculty.filter((m) => m.department === dept);
    renderCards(filtered);
  }

  filters.forEach((btn) => {
    btn.addEventListener("click", function () {
      filters.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      applyFilter(this.dataset.filter);
    });
  });

  // Fetch JSON and initialise
  const url = window.FACULTY_JSON_URL || "/data/faculty.json";

  fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load faculty data");
      return res.json();
    })
    .then((data) => {
      allFaculty = data;
      renderCards(data);
    })
    .catch((err) => {
      console.error(err);
      grid.innerHTML = `
        <div class="faculty-error">
          <i class="fas fa-exclamation-circle"></i>
          <p>Unable to load faculty data. Please try again later.</p>
        </div>
      `;
    });
})();
