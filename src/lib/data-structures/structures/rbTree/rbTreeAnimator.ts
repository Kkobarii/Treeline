import { rbTreeToGraph } from '$lib/data-structures/utils/graphs';

import { BinaryTreeAnimator } from '../../visual/animators/binaryTreeAnimator';
import { type DataStructureAnimatorOpts } from '../../visual/animators/dataStructureAnimator';

export class RBTreeAnimator extends BinaryTreeAnimator {
	constructor(opts: DataStructureAnimatorOpts) {
		super(opts);
	}

	ensure(tree: any) {
		this.ensureWithFn(tree, rbTreeToGraph);
	}
}
