import {
	JSXConvertersFunction,
	RichText,
} from "@payloadcms/richtext-lexical/react"

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => {
	return {
		...defaultConverters,
		paragraph: ({ node, nodesToJSX }) => {
			const children = nodesToJSX({
				nodes: node.children,
			})

			if (!children?.length) {
				return (
					<p>
						<br />
					</p>
				)
			}

			return <p>{children}</p>
		},

		blocks: {
			// myTextBlock is the slug of the block
			// myTextBlock: ({ node }) => <div style={{ backgroundColor: 'red' }}>{node.fields.text}</div>,
		},
	}
}

export const Component = () => {
	return (
		<div>
			<h1>Component</h1>
			<RichText
				converters={jsxConverters}
				data={{
					root: {
						type: "root",
						format: "",
						indent: 0,
						version: 1,
						children: [],
						direction: "ltr",
					},
				}}
			/>
		</div>
	)
}
