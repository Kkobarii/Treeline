export type StepLabelParams = Record<string, string | number>;

/**
 * Shared label model used by step types across the app.
 * `label` is a translation key and `params` contains replacement values.
 */
export class StepLabel {
	constructor(
		public readonly label: string,
		public readonly params: StepLabelParams = {},
	) {}
}
