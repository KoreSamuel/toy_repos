require('esbuild').buildSync({
  entryPoints: ['app.jsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['chrome95'],
  outfile: 'out.js',
})