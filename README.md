# shader-art

Render paintings in GLSL.

![Example output](https://media.giphy.com/media/4Tf0SdgqHNS2S1BACG/giphy.gif)

Video capture from a fragment shader implementing *Deny II*, Bridget Riley (1967)

### Notes

Fragment shaders assume access the `time`, `mouse` and `resolution` uniforms
provided by [GLSL Sandbox](http://glslsandbox.com/).

Metadata describing the shaders is collected in `index.json`.
