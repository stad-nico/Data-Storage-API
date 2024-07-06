import { Component, HostBinding, Input } from '@angular/core';
import { DirectoryContentFile } from 'generated';
import { SelectableProvider } from 'src/app/features/content-list/components/pure-content-list/components/selectable-list-item/selectable.component';
import { ISelectable } from 'src/app/shared/models/ISelectable';

@Component({
	selector: 'file-list-item',
	standalone: true,
	templateUrl: './file-list-item.component.html',
	styleUrl: './file-list-item.component.css',
	providers: [SelectableProvider(FileListItemComponent)],
})
export class FileListItemComponent implements ISelectable {
	@Input({ required: true })
	public metadata!: DirectoryContentFile;

	@HostBinding('class.selected')
	public selected: boolean = false;

	public select(): void {
		this.selected = true;
	}

	public unselect(): void {
		this.selected = false;
	}

	protected formatBytes(bytes: number, decimals: number = 2): string {
		if (!+bytes) return '0 B';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}

	protected formatDate(dateOrString: Date | string): string {
		const date = dateOrString instanceof Date ? dateOrString : new Date(Date.parse(dateOrString));

		const month = date.toLocaleDateString('de-DE', { month: 'short' });
		const year = date.toLocaleDateString('de-DE', { year: '2-digit' });

		return `${date.getDay()} ${month} ${year}`;
	}
}