// Shared filter for the grouped job listing pages (/delay, /perf, /ai).
// Hides non-matching job cards and collapses/hides empty category sections.
// Remembers each section's default open state so clearing the filter restores it.

(function () {
  const input = document.getElementById("job-filter");
  if (!input) return;

  const sections = Array.from(document.querySelectorAll("[data-category]"));
  // Capture the server-rendered default open state per section.
  const defaultOpen = new WeakMap();
  for (const section of sections) defaultOpen.set(section, section.open);

  function applyFilter(raw) {
    const q = (raw || "").trim().toLowerCase();

    for (const section of sections) {
      let anyVisible = false;
      section.querySelectorAll('[id$="grid"]').forEach((card) => {
        const li = card.parentElement;
        const match = card.id.toLowerCase().includes(q);
        if (li) li.style.display = match ? "" : "none";
        if (match) anyVisible = true;
      });

      // Hide whole section when nothing matches.
      section.style.display = anyVisible ? "" : "none";

      if (q) {
        // While filtering, open any section that has matches.
        section.open = anyVisible;
      } else {
        // Filter cleared: restore the original open state.
        section.open = defaultOpen.get(section);
      }
    }
  }

  input.addEventListener("input", (e) => applyFilter(e.target.value));
})();
