import type { Position } from 'vis-network';

export function lerpPosition(a: Position, b: Position, t: number): Position {
	return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

export function approxEqualPos(a: Position, b: Position, eps = 0.5) {
	return Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;
}

export function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}
