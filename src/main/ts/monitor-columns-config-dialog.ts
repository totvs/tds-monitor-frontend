import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-columns-config-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { i18n } from './util/i18n';
import { columnConfig, columnText } from './monitor-columns';
import { MonitorCheckbox } from './monitor-checkbox';

@customElement('monitor-columns-config-dialog')
export class MonitorColumnsConfigDialog extends MonitorDialog {

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("COLUMNS_CONFIG", "Columns Configuration");
		this.progress = 'none';
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		const columns = columnConfig();
		const onCheckBoxChanged = (event: Event) => {
			const checkbox = event.target as MonitorCheckbox;

			checkbox.parentElement.dataset.visible = `${checkbox.checked}`;
		}

		return html`
            <ul @drop="${this.onDrop}" @dragover="${this.onDragOver}">
            ${columns.map((column) => html`
				<li
					draggable="true"
					@dragstart="${this.onDragStart}"
					data-id="${column.id}"
					data-align="${column.align}"
					data-visible="${column.visible}"
					data-width="${column.width}"
				>
					<monitor-checkbox ?checked="${column.visible}" @change="${onCheckBoxChanged}"></monitor-checkbox>
					<span>${columnText[column.id]}</span>
				</li>
            `)}
            </ul>
		`;
	}

	onDragStart(event: DragEvent) {
		const target = event.target as HTMLElement;

		event.dataTransfer.setData("id", target.dataset.id);
		event.dataTransfer.dropEffect = "move";
	}

	onDragOver(event: DragEvent) {
		event.preventDefault();
		event.dataTransfer.dropEffect = "move"

		//let target = document.elementFromPoint(event.offsetX, event.offsetY) as HTMLElement;
		let target = (this.renderRoot as Document).elementFromPoint(event.clientX, event.clientY) as HTMLElement;

		if (!(target instanceof HTMLLIElement)) {
			target = target.closest('li');
		}

		this.renderRoot.querySelectorAll('li.drop-before, li.drop-after').forEach(li => {
			li.classList.remove('drop-before', 'drop-after');
		});

		const rect = target.getBoundingClientRect();

		if (event.clientY > (rect.top + (rect.height / 2))) {
			target.classList.add('drop-after');
		}
		else {
			target.classList.add('drop-before');
		}
	}

	onDrop(event: DragEvent) {
		event.preventDefault();

		const ul = this.renderRoot.querySelector('ul');

		let target = event.target as Element;

		if (!(target instanceof HTMLLIElement)) {
			target = target.closest('li');
		}

		if ((target) && target.classList.contains('drop-after')) {
			target = target.nextElementSibling;
		}

		const id = event.dataTransfer.getData("id"),
			item = this.renderRoot.querySelector(`[data-id=${id}]`);

		if (target)
			ul.insertBefore(item, target);
		else
			ul.appendChild(item);

		this.renderRoot.querySelectorAll('li.drop-before, li.drop-after').forEach(li => {
			li.classList.remove('drop-before', 'drop-after');
		});
	}

	onOkButtonClicked(event: Event) {
		const app = document.querySelector('monitor-app');
		const columns = Array.from(this.renderRoot.querySelectorAll('li'))
			.map(({ dataset }) => {
				return {
					id: dataset.id,
					visible: JSON.parse(dataset.visible),
					align: dataset.align,
					width: Number.parseInt(dataset.width)
				} as MonitorColumn;
			});

		app.config = Object.assign<MonitorSettingsConfig, MonitorSettingsConfig>(app.config, {
			columns
		});

		app.dispatchEvent(new CustomEvent<string>('settings-update', {
			detail: i18n.localize("UPDATE_SETTINGS", "Update settings."),
			bubbles: true,
			composed: true
		}));

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
