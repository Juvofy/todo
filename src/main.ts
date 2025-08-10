import './style.css';
import { ToDoListItem } from './ToDoListItem';

const form = document.forms[0];
const ul = document.querySelector("ul")!;

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const text = data.get("text");
    form.reset();

    if (typeof text === "string" && text.trim()) {
        const item = new ToDoListItem(text);
        item.appendTo(ul);
    }
});