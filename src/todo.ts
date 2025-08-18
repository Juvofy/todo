import { version } from "../package.json";
import { TodoItem } from "./todo-item";
import Juvofy from "./svg/juvofy.svg";

export class Todo {
    private readonly ul = document.createElement("ul");
    private readonly topBar = document.createElement("form");
    private readonly STORAGE_KEY = `todo-v${version}`;
    private readonly items: Item[] = [];

    constructor() {
        const logo = document.createElement("img");
        logo.draggable = false;
        logo.src = Juvofy;

        const input = document.createElement("input");
        input.placeholder = "Enter your today task..";
        input.type = "text";

        const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.ariaLabel = "Plus";

        this.topBar.append(input, submitButton, logo);

        this.topBar.addEventListener("submit", e => {
            e.preventDefault();

            if (input.value.trim()) {
                this.add([input.value, false]);
                this.save();
            }

            this.topBar.reset();
        });
    }

    init(root: HTMLElement) {
        for (const cached of this.load()) {
            if (cached) {
                this.add(cached);
            }
        }
        root.append(this.topBar, this.ul);
    }

    private dragging = false;

    public add(item: Item) {
        const node = new TodoItem(...item);
        this.ul.appendChild(node.root);
        this.items.push(item);

        node.checkbox.addEventListener("change", () => {
            item[1] = node.checkbox.checked;
            this.save();
        });

        node.editButton.addEventListener("click", () => {
            const newText = window.prompt("Edit text:");
            if (newText !== null) {
                item[0] = newText;
                node.span.replaceChildren(newText);
                this.save();
            }
        });

        node.removeButton.addEventListener("click", () => {
            node.root.remove();
            this.items.splice(this.items.indexOf(item), 1);
            this.save();
        });

        let dragImage: HTMLElement | undefined;

        const startDrag = (e: MouseEvent | TouchEvent) => {
            if (
                this.dragging ||
                !(e.target instanceof HTMLElement) ||
                e.target.closest("button")
            ) {
                return;
            }

            this.dragging = true;
            document.addEventListener("mousemove", move);
            document.addEventListener("touchmove", move);
            document.addEventListener("mouseup", endDrag);
            document.addEventListener("touchend", endDrag);
        };

        const move = (e: MouseEvent | TouchEvent) => {
            if (!dragImage) {
                node.root.classList.add("dragging");
                ({ root: dragImage } = new TodoItem(...item));
                dragImage.classList.add("drag-image");
                this.ul.appendChild(dragImage);
            }

            const { clientY } = e instanceof MouseEvent ? e : e.touches[0];

            dragImage.style.top = `${clientY}px`;
        };

        const endDrag = (e: MouseEvent | TouchEvent) => {
            dragImage?.remove();
            dragImage = undefined;

            node.root.classList.remove("dragging");
            document.removeEventListener("mousemove", move);
            document.removeEventListener("touchmove", move);
            document.removeEventListener("mouseup", endDrag);
            document.removeEventListener("touchend", endDrag);

            node.root.remove();

            const { clientY } = e instanceof MouseEvent ? e : e.touches[0];

            const [closest] = Array.from(this.ul.children).sort((a, b) => {
                const aRect = a.getBoundingClientRect();
                const bRect = b.getBoundingClientRect();
                const aDistance = Math.abs(aRect.top - clientY);
                const bDistance = Math.abs(bRect.top - clientY);
                return aDistance - bDistance;
            });

            const fromIndex = this.items.indexOf(item);
            const toIndex = Array.from(this.ul.children).indexOf(closest);
            this.ul.insertBefore(node.root, closest);

            this.items.splice(fromIndex, 1);
            this.items.splice(toIndex, 0, item);

            this.save();

            setTimeout(() => this.dragging = false, 1);
        };

        node.root.addEventListener("mousedown", startDrag);
        node.root.addEventListener("touchstart", startDrag);
    }

    private save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.items));
    }

    private load(): Item[] {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) ?? "[]");
    }
}

export type Item = ConstructorParameters<typeof TodoItem>;