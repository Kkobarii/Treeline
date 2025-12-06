import { avlTreeToGraph } from '$lib/data-structures/utils/graphs';

import { BinaryTreeAnimator } from '../../visual/animators/binaryTreeAnimator';
import { type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';

export class AVLTreeAnimator extends BinaryTreeAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	ensure(tree: any) {
		this.ensureWithFn(tree, avlTreeToGraph);
	}
}
