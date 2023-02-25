let x = innerWidth/4, 
    y = innerHeight/4, 
    gl = c.getContext("webgl"), 
    pid = gl.createProgram(),
    draw = t => {
        uniforms.time([t]);
        uniforms.mouse([x, y]);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        requestAnimationFrame(draw);
    },
    resize = (w, h) => {
        if (c.width === w && c.height===h)
            return
        let wh = [c.width=w,c.height=h];
        uniforms.resolution(wh)
        gl.viewport(0, 0, ...wh)
    },
    uniforms = {mouse: '2f', resolution: '2f', time: '1f'};

gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,3,-1,-1,3,-1]), gl.STATIC_DRAW);
c.innerHTML.split('---').forEach((src, i) => {
    let id = gl.createShader(i?gl.FRAGMENT_SHADER:gl.VERTEX_SHADER);
    gl.shaderSource(id, src);
    gl.compileShader(id);
    gl.attachShader(pid, id);
});
gl.linkProgram(pid);
gl.useProgram(pid);

Object.keys(uniforms).forEach(uf => {
     let loc = gl.getUniformLocation(pid, uf), f = gl[`uniform${uniforms[uf]}`]
     uniforms[uf] = v => f.call(gl, loc, ...v) || v
});

let vertices = gl.getAttribLocation(pid, "vertices")
gl.vertexAttribPointer(vertices, 2, gl.FLOAT, 0, 0, 0);
gl.enableVertexAttribArray(vertices);

addEventListener("mousemove", e => {x=e.pageX; y=e.pageY});
addEventListener("resize", () => resize(innerWidth, innerHeight));

resize(innerWidth, innerHeight);
requestAnimationFrame(draw);

