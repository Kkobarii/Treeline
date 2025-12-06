export const Colors = {
	Black: '#000000',
	White: '#FFFFFF',

	Green: '#7CFC00',
	Blue: '#1E90FF',
	Red: '#FF4500',
	Yellow: '#FFD700',
	Node: '#9fd4ff',

	ValueNode: '#ffb347',
	ValueNodeHighlight: '#ffa500',
	Info: '#aaaaaa',
	Id: '#dddddd',

	RBTreeRed: '#ff3333',
	RBTreeBlack: '#333333',
};

export function shadeColor(color: string, percent: number) {
	var R = parseInt(color.substring(1, 3), 16);
	var G = parseInt(color.substring(3, 5), 16);
	var B = parseInt(color.substring(5, 7), 16);

	R = (R * (100 + percent)) / 100;
	G = (G * (100 + percent)) / 100;
	B = (B * (100 + percent)) / 100;

	R = R < 255 ? R : 255;
	G = G < 255 ? G : 255;
	B = B < 255 ? B : 255;

	R = Math.round(R);
	G = Math.round(G);
	B = Math.round(B);

	var RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
	var GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
	var BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

	return '#' + RR + GG + BB;
}
