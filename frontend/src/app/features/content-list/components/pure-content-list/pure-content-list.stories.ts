import { argsToTemplate, StoryObj, type Meta } from '@storybook/angular';
import { ContentType, PureContentListComponent, Type } from 'src/app/features/content-list/components/pure-content-list/pure-content-list.component';

const meta: Meta<PureContentListComponent> = {
	title: 'Features/Content List/Pure Content List',
	component: PureContentListComponent,
	render: (args: any) => ({
		props: args,
		template: `<div style="resize:both;overflow:hidden"><pure-content-list ${argsToTemplate(args)}></pure-content-list></div>`,
	}),
};

export default meta;

const exampleFile = {
	type: Type.File,
	name: 'element',
	mimeType: 'text/plain',
	size: 239,
	createdAt: new Date(Date.now()).toISOString(),
	updatedAt: new Date(Date.now()).toISOString(),
};

const exampleDirectory = {
	type: Type.Directory,
	name: 'element',
	size: 239,
	createdAt: new Date(Date.now()).toISOString(),
	updatedAt: new Date(Date.now()).toISOString(),
};

const defaultContent: Array<Omit<ContentType, 'id' | 'isSelected'>> = [
	exampleDirectory,
	exampleDirectory,
	exampleDirectory,
	exampleDirectory,
	exampleDirectory,
	exampleDirectory,
	exampleFile,
	exampleFile,
	exampleFile,
	exampleFile,
	exampleFile,
	exampleFile,
];

export const Default: StoryObj<PureContentListComponent> = {
	args: {
		content: defaultContent.map((item, index) => ({ ...item, id: index, isSelected: false }) as ContentType),
	},
};

export const Selected: StoryObj<PureContentListComponent> = {
	args: {
		isInSelectMode: true,
		content: defaultContent.map((item, index) => ({ ...item, id: index, isSelected: Math.random() > 0.3 }) as ContentType),
	},
};
