export class TodoListItem {
	public readonly root = document.createElement("li");
	public readonly checkbox = document.createElement("input");
	public readonly label = document.createElement("label");
	public readonly removeButton = document.createElement("button");
	public readonly checkButton = document.createElement("button");
	public readonly span = document.createElement("span")

	constructor(text: string, checked: boolean) {
		this.span.append(text);

		this.checkbox.type = "checkbox";
		this.checkbox.checked = checked;
		this.checkButton.disabled = true;
		this.checkButton.classList.add("check");
		this.checkButton.ariaLabel = "Checkmark";

		this.removeButton.ariaLabel = "Cross";
		this.removeButton.classList.add("remove");

		this.label.append(this.span, this.checkbox, this.checkButton);
		this.root.append(this.label, this.removeButton);
	}
}
