const { parseFile } = require('../lib/parse');
const path = require('path');
const fs = require('fs');

function parseIndividualFile(file, options = {}) {
  const { out = file.replace(/\.html$/, '.compiled.html') } = options;
  const html = parseFile(file);
  fs.writeFileSync(out, html);
}

function parseFolder(folder, getOption = false) {
	
  let options = {
    outDir: './compiled',
    ignores: [/^partial$/, /^compiled$/, /\.compiled\.html$/],
    include: [/\.html$/, /\.css$/],
  };
  let userOptions = {};
  try {
    userOptions = JSON.parse(
      fs.readFileSync(path.join(folder, 'sht.config.json')).toString(),
    );
  } catch (e) {
    userOptions = {};
    // ignore
  }
  options = {
    ...options,
    ...userOptions,
  };
  const { outDir: _outDir, ignores, include } = options;
  const outDir = path.join(folder, _outDir);
  if (getOption === true) return options;
  try {
	  
	fs.mkdirSync(outDir);  
	  
	const dirs = fs.readdirSync(folder).filter(f => fs.statSync(path.join(folder, f)).isDirectory());
	
	dirs.forEach(dir => {
		
		if (ignores.some(reg => reg.test(dir))) return;
		fs.mkdirSync(outDir + "\\" + dir);
		
		nFolder = folder + "\\" + dir;
		nOutDir = outDir + "\\" + dir
		const files = fs.readdirSync(nFolder);
		
		files.forEach(filename => {
			
			const filepath = path.join(nFolder, filename);
				const out = path.join(nOutDir, filename);
				fs.copyFileSync(filepath, out );
		});
	});
	
	
	
  } catch (e) {
    
  }
  const files = fs.readdirSync(folder);
  files.forEach(filename => {
    if (ignores.some(reg => reg.test(filename))) return;
    //if (include.test(filename)) {
	if (include.some(reg => reg.test(filename))) {
      const filepath = path.join(folder, filename);
      const out = path.join(outDir, filename);
      parseIndividualFile(filepath, { out });
    }
  });
  return true;
}

module.exports = {
  parseIndividualFile,
  parseFolder,
};
