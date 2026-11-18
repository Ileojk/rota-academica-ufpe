(() => {
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#site-search");
  const status = document.querySelector("#search-status");
  const emptyState = document.querySelector("#empty-state");
  const searchableItems = [...document.querySelectorAll("[data-searchable]")];
  const topicGrid = document.querySelector("#topic-grid");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");
  const themeToggle = document.querySelector(".theme-toggle");
  const themeColor = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme, save = false) {
    const isDark = theme === "dark";
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Ativar tema claro" : "Ativar tema escuro");
    themeToggle.title = isDark ? "Ativar tema claro" : "Ativar tema escuro";
    themeColor.content = isDark ? "#171615" : "#990000";

    if (save) {
      try {
        localStorage.setItem("rota-academica-theme", isDark ? "dark" : "light");
      } catch {}
    }
  }

  applyTheme(document.documentElement.dataset.theme || "light");
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });

  const normalize = (value) => value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

  function filterContent(rawQuery) {
    const query = normalize(rawQuery);
    let matches = 0;
    let topicMatches = 0;

    searchableItems.forEach((item) => {
      const content = normalize(`${item.dataset.searchable || ""} ${item.textContent || ""}`);
      const visible = !query || content.includes(query);
      item.hidden = !visible;
      if (visible && query) {
        matches += 1;
        if (item.classList.contains("topic-card")) topicMatches += 1;
      }
    });

    const noTopicMatches = Boolean(query) && topicMatches === 0;
    emptyState.hidden = !noTopicMatches;
    emptyState.querySelector("strong").textContent = matches
      ? "Encontrei isso fora da matriz curricular."
      : "Não achei esse termo no mapa.";
    emptyState.querySelector("p").textContent = matches
      ? "O resultado pode estar no resumo do PPC, nas bolsas, no guia de TCC ou nas dúvidas."
      : "Tente buscar pelo nome de uma disciplina, ACEX, estágio ou TCC.";
    topicGrid.hidden = Boolean(query) && topicMatches === 0;
    status.textContent = query
      ? matches === 0
        ? ""
        : `${matches} ${matches === 1 ? "resultado encontrado" : "resultados encontrados"} para “${rawQuery.trim()}”.`
      : "";
  }

  function scrollToFirstResult() {
    const firstMatch = searchableItems.find((item) => !item.hidden);
    const section = firstMatch?.closest("section") || document.querySelector("#matriz");
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterContent(input.value);
    if (input.value.trim()) scrollToFirstResult();
  });

  input.addEventListener("input", () => filterContent(input.value));

  document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.query;
      filterContent(input.value);
      scrollToFirstResult();
    });
  });

  document.querySelector("#clear-search").addEventListener("click", () => {
    input.value = "";
    filterContent("");
    input.focus();
  });

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    mainNav.classList.toggle("is-open", !isOpen);
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuToggle.setAttribute("aria-expanded", "false");
      mainNav.classList.remove("is-open");
    });
  });
})();
