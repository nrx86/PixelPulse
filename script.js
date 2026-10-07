const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const quickPicks = document.querySelectorAll(".quick-picks button");

quickPicks.forEach((button) => {
    button.addEventListener("click", () => {
        input.value = button.textContent.trim();
        form.requestSubmit();
    });
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = input.value.trim();
    const results = document.getElementById("results");
    const resultsHeading = document.querySelector("section h2");

    if (!query) {
        results.innerHTML = "";
        resultsHeading.textContent = "Results";
        return;
    }

    resultsHeading.textContent = "Searching...";
    results.innerHTML = "";

    const url =
        "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
        "&gsrsearch=" + encodeURIComponent(query) +
        "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(String(response.status));
        }

        const data = await response.json();
        console.log(data);

        const items = data.query ? Object.values(data.query.pages) : [];
        render(items);
    } catch (error) {
        resultsHeading.textContent = "Something went wrong. Please try again.";
    }
});

function render(items) {
    const resultsHeading = document.querySelector("section h2");
    const results = document.getElementById("results");

    resultsHeading.textContent = `Results (${items.length})`;
    results.innerHTML = "";

    if (items.length === 0) {
        results.textContent = "No results for that word. Try another search.";
        return;
    }

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";

        const img = document.createElement("img");
        img.src = item.imageinfo?.[0]?.thumburl || "";
        img.alt = item.title || "Wikimedia image";

        const caption = document.createElement("p");
        caption.textContent = item.title;

        card.appendChild(img);
        card.appendChild(caption);
        results.appendChild(card);
    });
}