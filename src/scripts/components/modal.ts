let current: Modal | null = null;

export default class Modal {
    protected readonly dialog = document.createElement("dialog");

    constructor(templateId: string) {
        const template = document.getElementById(templateId) as HTMLTemplateElement;
        const closeButton = document.createElement("button");
        Object.assign(closeButton, {
            type: "button",
            className: "plain",
            textContent: "Zavřít"
        });
        closeButton.addEventListener("click", () => this.dialog.close());

        const content = template.content.cloneNode(true);
        this.dialog.classList.add("modal");
        this.dialog.closedBy = "any";
        this.dialog.append(closeButton, content);

        // zavira tlacitko, Escape i kliknuti mimo dialog
        this.dialog.addEventListener("close", () => {
            this.dialog.remove();
            current = null;
        });
    }

    static create(templateId: string) {
        if (current) return;
        current = new Modal(templateId);
        document.body.append(current.dialog);
        current.dialog.showModal();
    }
}
