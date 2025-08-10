export class ToDoListItem {
    private root = document.createElement("li");
    private checkbox = document.createElement("input");
    private label = document.createElement("label");
    private removeButton = document.createElement("button");
    private checkButton = document.createElement("button");
    private span = document.createElement("span");

    constructor(public text: string) {
        // Sets text to the span
        this.span.append(text);

        // Set up the checkbox
        this.checkbox.type = "checkbox";
        // Add a class to apply styles
        this.checkButton.classList.add("check");

        // Set up the remove button
        this.removeButton.append("\u00d7");
        this.removeButton.classList.add("remove");
        this.removeButton.addEventListener("click", () => {
            this.root.remove();
        });

        this.label.append(this.span, this.checkbox, this.checkButton);
        this.root.append(this.label, this.removeButton);
    }


    public appendTo(node: HTMLElement) {
        node.append(this.root);
    }
}