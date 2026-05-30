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
  const scrolled = window.scrollY > 20;
  header.style.background = "#ffffff";
  header.style.boxShadow = scrolled ? "0 1px 0 rgba(5, 5, 5, 0.08)" : "none";
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

const verificationForm = document.querySelector("[data-verification-form]");

if (verificationForm) {
  const params = new URLSearchParams(window.location.search);
  const reportId = params.get("rapor") || "UA-2026-0526-0142";
  const input = verificationForm.querySelector("[data-verification-input]");
  const output = document.querySelector("[data-report-id]");
  const message = document.querySelector("[data-verification-message]");

  input.value = reportId;
  output.textContent = reportId;

  verificationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    output.textContent = input.value.trim() || reportId;
    message.textContent = "Örnek doğrulama kaydı güncellendi.";
  });
}
