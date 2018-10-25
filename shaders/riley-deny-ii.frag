// Source artwork:
// Bridget Riley, "Deny II" (1967)
// https://www.tate.org.uk/art/artworks/riley-deny-ii-t02030

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 light = vec3(172., 196., 230.) / 255.;
const vec3 mid = vec3(92., 115., 146.) / 255.;
const vec3 dark = 0.95 * vec3(60., 77., 95.) / 255.;
const vec3 bg = vec3(67., 77., 86.) / 255.;

const float r = 0.25;
const float numCells = 19.;

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, -s, s, c);
	return m * v;
}

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))*43758.5453123);
}
	
void main( void ) {
	// Normalize position
	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	// Define grid
	vec2 grid = position * numCells;
	vec2 gridPos = fract(grid);
	vec2 gridCoord = floor(grid);
	vec2 gridCoordNorm = gridCoord / (numCells - 1.);
	
	// Flip y-axis
	gridPos.y = 1. - gridPos.y;
	
	// Move points to center of grid cells
	gridPos -= vec2(0.5, 0.5);
	
	// Move origin relative to mouse and offset
	gridCoordNorm += 0.5 - mouse;
	gridCoordNorm.y -= 0.45;
	
	// Apply vector field 1
	gridPos = rotate(gridPos, M_PI * -gridCoordNorm.y);
	
	// Apply vector field 2
	gridPos = rotate(gridPos, M_PI * fract(0.5 - abs(gridCoordNorm.x - 0.5)));
	
	// Squash in the x-axis
	gridPos.x *= sqrt(2.5);
	
	// Define anti-aliased points
	float dist = distance(vec2(0.), gridPos);
	float epsilon = fwidth(dist);
	float alpha = smoothstep(r, r - epsilon, dist);

	// Rotate and mirror gradient
	vec2 colorPos = gridCoordNorm;
	colorPos = colorPos.x < 0.5
	 ? rotate(colorPos, M_PI * 0.75) + sqrt(0.5)
	 : rotate(colorPos, M_PI * 1.25);
	colorPos = fract(colorPos);
	
	// Define gradient stops
	vec3 color;
	color = mix(light, light, smoothstep(0., 0., colorPos.y));
	color = mix(color, dark, smoothstep(0., 0.27, colorPos.y));
	color = mix(color, mid, smoothstep(0.4, 0.75, colorPos.y));
	color = mix(color, light, smoothstep(0.75, 1.0, colorPos.y));
	
	// Draw points
	gl_FragColor = vec4(color, 1.) * alpha + vec4(bg, 1.) * (1. - alpha);
	
	// Add noise
	vec3 noise = vec3(random(position));
	gl_FragColor -= vec4(noise, 1.) * 0.01;
}