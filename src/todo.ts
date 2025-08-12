import { version } from "../package.json";
import { TodoItem } from "./todo-item";

export class Todo {
    private readonly ul = document.createElement("ul");
    private readonly form = document.createElement("form");
    private readonly STORAGE_KEY = `todo-v${version}`;
    private readonly items: Item[] = [];

    constructor() {
        const input = document.createElement("input");
        input.placeholder = "Enter your today task..";
        input.name = "text";

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.ariaLabel = "Plus";

        this.form.append(input, submitButton);

        this.form.addEventListener("submit", e => {
            e.preventDefault();

            const data = new FormData(this.form);
            const text = data.get(input.name);
            this.form.reset();

            if (typeof text === "string" && text.trim()) {
                this.add([text, false]);
                this.save();
            }
        });
    }

    init(root: HTMLElement) {
        for (const cached of this.load()) {
            this.add(cached);
        }
        root.append(this.form, this.ul);
    }

    public add(item: Item) {
        const node = new TodoItem(...item);
        this.ul.appendChild(node.root);
        this.items.push(item);

        node.checkbox.addEventListener("change", () => {
            item[1] = node.checkbox.checked;
            this.save();
        });

        node.removeButton.addEventListener("click", () => {
            node.root.remove();
            this.items.splice(this.items.indexOf(item), 1);
            this.save();
        });
    }

    private save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }

    private load(): Item[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? "[]");
    }
}

export type Item = ConstructorParameters<typeof TodoItem>;