import { debounce, normalize } from "./lib";
import PrayerCard from "./components/prayer-card";

const searchInput = document.querySelector<HTMLInputElement>("#search input[type=search]")!;
searchInput.addEventListener("input", debounce(filterPrayers, 300));

interface SearchableItem {
    item: HTMLElement;
    text: string;
}
const prayerSections = document.querySelectorAll<HTMLElement>("section:not(#rosary):not(#prayer-tabs):has(prayer-card)");
const prayers: SearchableItem[] = [];
prayerSections.forEach(section => {
    const cards = section.querySelectorAll<PrayerCard>("prayer-card");
    cards.forEach(card => {
        prayers.push({
            item: card.closest("li")!,
            text: card.searchText
        });
    });
});

function filterPrayers(event: Event) {
    const query = normalize((event.target as HTMLInputElement).value);
    prayers.forEach(prayer => {
        prayer.item.hidden = query.length >= 3 && !prayer.text.includes(query);
    });

    prayerSections.forEach(section => {
        section.hidden = !section.querySelector("li:not([hidden])");
    });
}
