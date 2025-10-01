import { AnimationData } from "$lib/animation/animationData";
import { deepCopy } from "$lib/utils/utils";

export class TreeNode {
    id: number;

    constructor(id: number) {
        this.id = id;
    }
}

export class Tree<T> {
    root: TreeNode | null = null;
    currentId: number = 0;

    generateId(): number {
        return this.currentId++;
    }

    snapshot(): any {
        return deepCopy(this);
    }

    insert(value: T): AnimationData {
        const data: AnimationData = new AnimationData("Insert " + value, this.snapshot());
        this.insert_node(value, data);
        data.endSnapshot = this.snapshot();
        return data;
    }

    insert_node(value: T, data: AnimationData): TreeNode | null {
        throw new Error("Method not implemented.");
    }

    find(value: T): AnimationData {
        const data: AnimationData = new AnimationData("Find " + value, this.snapshot());
        const node = this.find_node(value, data);
        data.endSnapshot = this.snapshot();
        return data;
    }

    find_node(value: T, data: AnimationData): TreeNode | null {
        throw new Error("Method not implemented.");
    }

    delete(value: T): AnimationData {
        const data: AnimationData = new AnimationData("Delete " + value, this.snapshot());
        const success = this.delete_node(value, data);
        data.endSnapshot = this.snapshot();
        return data;
    }

    delete_node(value: T, data: AnimationData): boolean {
        throw new Error("Method not implemented.");
    }
}