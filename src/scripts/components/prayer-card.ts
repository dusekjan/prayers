import { normalize } from "../lib";

export default class PrayerCard extends HTMLElement {
    get favoriteButton() { return this.querySelector<HTMLInputElement>(".favorite input") }
    get link() { return this.querySelector<HTMLAnchorElement>("h3 a") }
    get searchText() { return normalize(this.textContent || "") }

    connectedCallback() {
        this.addEventListener("click", this);
        this.addEventListener("change", this);
    }

    handleEvent(event: Event) {
        const target = event.target as HTMLElement;

        switch (event.type) {
            case "click":
                target.closest("h3 a") && this.onLinkClick();
                break;
            case "change":
                target.closest(".favorite") && this.onFavoriteChange();
                break;
        }
    }

    protected onLinkClick() {
        // nevolame e.preventDefault(), protoze navigaci chceme

        localStorage.setItem("placeholder-key", "placeholder-value");
    }

    protected onFavoriteChange() {

    }
}

customElements.define("prayer-card", PrayerCard);
