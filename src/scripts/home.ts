import { normalize } from "./lib";
import PrayerCard, { type StoredPrayersType } from "./components/prayer-card";


/* Code related to remembering the last opened panel */
const lastPanelKey = "last-opened-panel";
let storedLastPanel = localStorage.getItem(lastPanelKey) || "";
document.querySelectorAll<HTMLInputElement>("#prayer-tabs input[name=prayer-tab]").forEach(tab => {
    tab.value == storedLastPanel && (tab.checked = true);
    tab.addEventListener("change", () => localStorage.setItem(lastPanelKey, tab.value));
});
/* End of code related to remembering the last opened panel */


/* Code related to rendering the favorites and recents lists */
(["favorites", "recent"] as StoredPrayersType[]).forEach(type => {
    const panel = document.querySelector<HTMLElement>(`[data-panel=${type}]`)!;
    const storedIds = PrayerCard.storedPrayersIds(type);
    if (!storedIds.length) return;  // v HTML zustane placeholder text
    PrayerCard.renderPrayersList(panel, storedIds, type);
});
/* End of code related to rendering the favorites and recents lists */


/* Code related to the search functionality */
const searchInput = document.querySelector<HTMLInputElement>("#search input[type=search]")!;
searchInput.addEventListener("input", filterPrayers);

interface SearchableItem {
    item: HTMLElement;
    text: string;
}
const prayerSections = document.querySelectorAll<HTMLElement>("section:not(#rosary):not(#prayer-tabs):has(prayer-card)");
const prayers: SearchableItem[] = [];
prayerSections.forEach(section => {
    const cards = section.querySelectorAll<PrayerCard>("prayer-card");
    cards.forEach(card => {
        prayers.push({ item: card.closest("li")!, text: card.searchText });
    });
});

function filterPrayers(event: Event) {
    const query = normalize((event.target as HTMLInputElement).value);
    prayers.forEach(prayer => {
        prayer.item.hidden = query.length >= 2 && !prayer.text.includes(query);
    });

    prayerSections.forEach(section => {
        section.hidden = !section.querySelector("li:not([hidden])");
    });
}
/* End of code related to the search functionality */
