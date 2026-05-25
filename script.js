const form = document.querySelector(".contact-form");

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const button = form.querySelector("button");
    const previousText = button.textContent;
    button.textContent = "Talep alındı";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = previousText;
      button.disabled = false;
      form.reset();
    }, 1800);
  });
}

const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  const alpha = window.scrollY > 20 ? 0.96 : 0.9;
  header.style.background = `rgba(246, 243, 235, ${alpha})`;
});

const testLibrary = document.querySelector("[data-test-library]");

if (testLibrary) {
  const searchInput = testLibrary.querySelector("[data-test-search]");
  const filterButtons = [...testLibrary.querySelectorAll("[data-test-filter]")];
  const testItems = [...testLibrary.querySelectorAll("[data-test-item], [data-test-card]")];
  const emptyState = testLibrary.querySelector("[data-test-empty]");
  let activeCategory = "all";

  const applyFilters = () => {
    const query = searchInput.value.trim().toLocaleLowerCase("tr");
    let visibleCount = 0;

    for (const item of testItems) {
      const categoryMatch = activeCategory === "all" || item.dataset.category === activeCategory;
      const searchMatch = !query || item.dataset.search.includes(query);
      const visible = categoryMatch && searchMatch;
      item.hidden = !visible;
      if (visible) visibleCount += 1;
    }

    emptyState.hidden = visibleCount > 0;
  };

  searchInput.addEventListener("input", applyFilters);

  for (const button of filterButtons) {
    button.addEventListener("click", () => {
      activeCategory = button.dataset.testFilter;
      for (const item of filterButtons) item.classList.toggle("active", item === button);
      applyFilters();
    });
  }
}
