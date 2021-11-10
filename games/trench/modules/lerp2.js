function lerp2(p1,p2,t){
	return [
		p1[0] + (p2[0] - p1[0]) * t,
		p1[1] + (p2[1] - p1[1]) * t,
	]
}

function quadraticLerp(p1,p2,p3,t){
	const l1 = lerp2(p1,p2,t)
	const l2 = lerp2(p2,p3,t)

	return lerp2(l1,l2,t)
}