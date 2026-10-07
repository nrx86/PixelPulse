const form = document.getElementById("searchForm");
const input = document.getElementById("searchInput");
const quickPicks = document.querySelectorAll(".quick-picks button");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query= input.value.trim();
    if (!query) {
        document.getElementById("results").innerHTML = "";
        document.querySelector("section h2").textContent = "Results";
        return;
    }

    const url =
    "https://commons.wikimedia.org/w/api.php?action=query&generator=search" +
    "&gsrsearch=" + encodeURIComponent(query) +
    "&gsrnamespace=6&gsrlimit=12&prop=imageinfo&iiprop=url&iiurlwidth=300&format=json&origin=*";
    
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(response.status);
    }

    const data = await response.json();
    console.log(data);

   const items = data.query ? Object.values(data.query.pages) : [];
    render(items);
});

quickPicks.forEach((button) => {
    button.addEventListener("click", () => {
        input.value = button.textContent;
        form.requestSubmit();
    });
});

function render(items) {
    const resultsHeading = document.querySelector("section h2");
    resultsHeading.textContent = `Results (${items.length})`;
    const results = document.getElementById("results");

    results.innerHTML = "";

    items.forEach((item) => {
        const card = document.createElement("article");
        card.className = "card";
        const img = document.createElement("img");
        img.src = item.imageinfo[0].thumburl;
        img.alt = item.title;
        const caption = document.createElement("p");
        caption.textContent = item.title;
        card.appendChild(img);
        card.appendChild(caption);
        results.appendChild(card);
    });
}