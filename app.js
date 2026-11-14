(() => {
  const form = document.querySelector("#search-form");
  const input = document.querySelector("#site-search");
  const status = document.querySelector("#search-status");
  const emptyState = document.querySelector("#empty-state");
  const searchableItems = [...document.querySelectorAll("[data-searchable]")];
  const topicGrid = document.querySelector("#topic-grid");
  const menuToggle = document.querySelector(".menu-toggle");
  const mainNav = document.querySelector("#main-nav");

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
      ? "Encontrei isso nos atalhos ou nas dúvidas abaixo."
      : "Essa rota ainda não apareceu.";
    emptyState.querySelector("p").textContent = matches
      ? "Role a página para ver os resultados encontrados."
      : "Tente outro termo ou explore os atalhos oficiais.";
    topicGrid.hidden = Boolean(query) && topicMatches === 0;
    status.textContent = query
      ? matches === 0
        ? ""
        : `${matches} ${matches === 1 ? "resultado encontrado" : "resultados encontrados"} para “${rawQuery.trim()}”.`
      : "";
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    filterContent(input.value);
    if (input.value.trim()) document.querySelector("#rotas").scrollIntoView({ behavior: "smooth", block: "start" });
  });

  input.addEventListener("input", () => filterContent(input.value));

  document.querySelectorAll(".suggestion").forEach((button) => {
    button.addEventListener("click", () => {
      input.value = button.dataset.query;
      filterContent(input.value);
      document.querySelector("#rotas").scrollIntoView({ behavior: "smooth", block: "start" });
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
