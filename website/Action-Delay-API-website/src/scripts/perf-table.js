// Interaction for the /perf comparison tables.
// - Each service collapses into a `.perf-parent` row; its region/size variants are
//   `.perf-child` rows (hidden until expanded). Singleton services are plain
//   `.perf-parent` rows that link straight to the job.
// - Clicking an expandable parent toggles its child rows.
// - Clicking a <th data-sort> sorts the table by *blocks* (parent + its children
//   move together). Tables default to ascending p50 (1d).
// - #job-filter hides non-matching parents/children and collapses empty sections.

(function () {
  const sections = Array.from(document.querySelectorAll("[data-category]"));
  const numericSorts = new Set(["now", "p50", "p50-30d"]);

  function sortKeyAttr(key) {
    switch (key) {
      case "name": return "data-name";
      case "provider": return "data-provider";
      case "now": return "data-now";
      case "p50": return "data-p50";
      case "p50-30d": return "data-p50-30d";
      default: return "data-name";
    }
  }

  function childrenOf(tbody, key) {
    return Array.from(tbody.querySelectorAll("tr.perf-child")).filter(
      (c) => c.getAttribute("data-key") === key
    );
  }

  // ---- block-aware sort --------------------------------------------------
  function sortTable(table, key, asc) {
    const tbody = table.querySelector("tbody");
    if (!tbody) return;
    const attr = sortKeyAttr(key);
    const numeric = numericSorts.has(key);

    // Group rows into blocks: a parent (or stray row) + its trailing children.
    const blocks = [];
    let cur = null;
    for (const row of Array.from(tbody.children)) {
      if (row.classList.contains("perf-parent")) {
        cur = { head: row, kids: [] };
        blocks.push(cur);
      } else if (row.classList.contains("perf-child")) {
        if (cur) cur.kids.push(row);
        else blocks.push({ head: row, kids: [] });
      } else {
        cur = null;
        blocks.push({ head: row, kids: [] });
      }
    }

    blocks.sort((a, b) => {
      // Grouped (expandable) services always pinned above singletons.
      const ga = a.head.getAttribute("data-expandable") === "true" ? 0 : 1;
      const gb = b.head.getAttribute("data-expandable") === "true" ? 0 : 1;
      if (ga !== gb) return ga - gb;
      const av = a.head.getAttribute(attr) || "";
      const bv = b.head.getAttribute(attr) || "";
      const cmp = numeric ? (parseFloat(av) || 0) - (parseFloat(bv) || 0) : av.localeCompare(bv);
      return asc ? cmp : -cmp;
    });

    for (const blk of blocks) {
      tbody.appendChild(blk.head);
      for (const kid of blk.kids) tbody.appendChild(kid);
    }

    table.querySelectorAll("th[data-sort] .sort-ind").forEach((el) => (el.textContent = ""));
    const active = table.querySelector(`th[data-sort="${key}"] .sort-ind`);
    if (active) active.textContent = asc ? " ▲" : " ▼";
  }

  for (const table of document.querySelectorAll(".perf-table")) {
    const tbody = table.querySelector("tbody");
    const state = { key: "p50", asc: true };

    table.querySelectorAll("th[data-sort]").forEach((th) => {
      th.addEventListener("click", () => {
        const key = th.getAttribute("data-sort");
        state.asc = state.key === key ? !state.asc : true;
        state.key = key;
        sortTable(table, state.key, state.asc);
      });
    });
    sortTable(table, state.key, state.asc);

    // Expand / collapse.
    table.querySelectorAll('tr.perf-parent[data-expandable="true"]').forEach((parent) => {
      parent.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // let any links through
        const key = parent.getAttribute("data-key");
        const expanded = parent.getAttribute("aria-expanded") === "true";
        parent.setAttribute("aria-expanded", expanded ? "false" : "true");
        for (const kid of childrenOf(tbody, key)) kid.hidden = expanded;
      });
    });
  }

  // ---- filter ------------------------------------------------------------
  const input = document.getElementById("job-filter");
  if (!input) return;

  const defaultOpen = new WeakMap();
  for (const section of sections) defaultOpen.set(section, section.open);

  function applyFilter(raw) {
    const q = (raw || "").trim().toLowerCase();

    for (const section of sections) {
      let anyVisible = false;

      section.querySelectorAll(".perf-table tbody").forEach((tbody) => {
        tbody.querySelectorAll("tr.perf-parent").forEach((parent) => {
          const key = parent.getAttribute("data-key");
          const expandable = parent.getAttribute("data-expandable") === "true";
          const kids = childrenOf(tbody, key);
          const parentMatch = (parent.getAttribute("data-name") || "").includes(q);

          let anyKidShown = false;
          for (const kid of kids) {
            const kidMatch = (kid.getAttribute("data-name") || "").includes(q);
            const show = q ? parentMatch || kidMatch : false; // collapse when no query
            kid.hidden = !show;
            if (show) anyKidShown = true;
          }

          const visible = q ? parentMatch || anyKidShown : true;
          parent.style.display = visible ? "" : "none";
          if (!visible) for (const kid of kids) kid.hidden = true;
          if (expandable) {
            parent.setAttribute("aria-expanded", anyKidShown ? "true" : "false");
          }
          if (visible) anyVisible = true;
        });
      });

      section.style.display = anyVisible ? "" : "none";
      section.open = q ? anyVisible : defaultOpen.get(section);
    }
  }

  input.addEventListener("input", (e) => applyFilter(e.target.value));
})();
