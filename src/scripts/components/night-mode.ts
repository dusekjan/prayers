import moonIcon from "../../partials/icons/icon-moon.html?raw";
import sunIcon from "../../partials/icons/icon-sun.html?raw";


export default class NightMode extends HTMLElement {
    get storageKey() { return "night-mode" }
    get checkbox() { return this.querySelector<HTMLInputElement>("input")! }
    get icon() { return this.querySelector<SVGElement>("svg")! }

    connectedCallback() {
        this.innerHTML = `
            <label>
                <input class="visually-hidden" type="checkbox" aria-label="Noční režim">
                ${moonIcon}
            </label>
        `;
        this.checkbox.checked = localStorage.getItem(this.storageKey) == "1";
        this.checkbox.addEventListener("change", () => this.onChange());
        this.render();
    }

    protected onChange() {
        this.render();
        localStorage.setItem(this.storageKey, this.checkbox.checked ? "1" : "0");
    }

    protected render() {
        const isNight = this.checkbox.checked;
        document.body.classList.toggle("dark", isNight);
        this.icon.outerHTML = isNight ? sunIcon : moonIcon;
    }
}

customElements.define("night-mode", NightMode);
