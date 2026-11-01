import { normalize } from "../lib";
import recentIcon from "../../partials/icons/icon-history.html?raw";
import favoriteIcon from "../../partials/icons/icon-heart.html?raw";


export type StoredPrayersType = "favorites" | "recent";
export default class PrayerCard extends HTMLElement {
    static get recentsKey() { return "prayer-card-recent" }
    static get favoritesKey() { return "prayer-card-favorites" }

    get favoriteCheckbox() { return this.querySelector<HTMLInputElement>(".favorite input") }
    get link() { return this.querySelector<HTMLAnchorElement>("h3 a") }
    get badge() { return this.querySelector<HTMLElement>(".badge") }
    get searchText() { return normalize(this.textContent || "") }
    get prayerId() { return this.dataset.prayerId || "" }

    connectedCallback() {
        this.addEventListener("click", this);
        this.addEventListener("auxclick", this);
        this.addEventListener("change", this);
    }

    handleEvent(event: Event) {
        const target = event.target as HTMLElement;

        switch (event.type) {
            case "click":
                target.closest("h3 a") && this.onLinkClick();
                break;
            case "auxclick":  // otevreni v nove karte prostrednim tlacitkem
                if ((event as MouseEvent).button != 1) return;
                target.closest("h3 a") && this.onLinkClick();
                break;
            case "change":
                target.closest(".favorite") && this.onFavoriteChange();
                break;
        }
    }

    protected onLinkClick() {
        // nevolame e.preventDefault(), protoze navigaci chceme
        if (!this.prayerId) return;
        const storedIds = PrayerCard.storedPrayersIds("recent");
        const ids = [this.prayerId, ...storedIds.filter(id => id != this.prayerId)].slice(0, 10);  // pridani na zacatek

        const target = document.querySelector<HTMLElement>("[data-panel=recent]")!;
        if (!target) return;

        // vykresleni pro filtraci neexistujicich + pro kliknuti prostrednim tlacitkem mysi
        const updatedIds = PrayerCard.renderPrayersList(target, ids, "recent");
        localStorage.setItem(PrayerCard.recentsKey, JSON.stringify(updatedIds));
    }

    protected onFavoriteChange() {
        let isChecked = this.favoriteCheckbox!.checked;

        const storedIds = PrayerCard.storedPrayersIds("favorites");
        let ids: string[];
        if (isChecked) {
            ids = [this.prayerId, ...storedIds.filter(id => id != this.prayerId)];  // pridani na zacatek
        } else {
            ids = storedIds.filter(id => id !== this.prayerId);  // odebrani
        }

        const target = document.querySelector<HTMLElement>("[data-panel=favorites]")!;
        if (!target) return;

        const updatedIds = PrayerCard.renderPrayersList(target, ids, "favorites");
        localStorage.setItem(PrayerCard.favoritesKey, JSON.stringify(updatedIds));
    }

    static renderPrayersList(target: HTMLElement, prayerIds: string[], type: StoredPrayersType): string[] {
        let updatedIds: string[] = [];

        let cardItems = prayerIds.map(id => {
            let card = document.querySelector(`[data-prayer-id=${id}]:not(.clone)`) as PrayerCard;  // klony vynechame
            if (!card) {
                return null;  // takove id neexistuje
            } else {
                updatedIds.push(id);
            }

            let cloned = card.cloneNode(true) as PrayerCard;
            type == "favorites" && (card.favoriteCheckbox!.checked = true);
            type == "favorites" && (cloned.favoriteCheckbox!.checked = true);
            cloned.querySelector("div")!.insertAdjacentHTML("afterbegin", (type == "favorites") ? favoriteIcon : recentIcon);
            cloned.classList.add("clone");

            let li = document.createElement("li");
            li.append(cloned);
            return li;
        }).filter(Boolean) as HTMLLIElement[];

        if (!cardItems.length) {
            let li = document.createElement("li");
            let i = document.createElement("i");
            i.textContent = (type == "favorites")
                ? "Zatím nemáte žádné oblíbené modlitby."
                : "Zatím nemáte naposledy navštívené modlitby.";
            li.append(i);
            cardItems.push(li);
        }

        target.replaceChildren(...cardItems);
        target.dispatchEvent(new Event("scroll"));  // prepocita napovedu scrollovani po prekresleni
        return updatedIds;
    }

    static storedPrayersIds(type: StoredPrayersType): string[] {
        try {
            const key = type == "favorites" ? PrayerCard.favoritesKey : PrayerCard.recentsKey;
            return JSON.parse(localStorage.getItem(key) || "[]") as string[];
        } catch {
            console.warn(`Failed to parse stored ${type} from localStorage`);
            return [];
        }
    }
}

customElements.define("prayer-card", PrayerCard);
