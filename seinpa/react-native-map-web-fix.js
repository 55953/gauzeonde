const chalk = require('chalk');
const { readFile, writeFile, copyFile } = require('fs').promises;
console.log(chalk.green('here'));
function log(...args) {
  console.log(chalk.yellow('[react-native-maps]'), ...args);
}
async function reactNativeMaps() {
  log('📦 Creating web compatibility of react-native-maps using an empty module loaded on web builds');
  const modulePath = 'node_modules/react-native-maps';
  await writeFile(`${modulePath}/lib/index.web.js`, 'module.exports = {}', 'utf-8');
  await copyFile(`${modulePath}/lib/index.d.ts`, `${modulePath}/lib/index.web.d.ts`);
  const pkg = JSON.parse(await readFile(`${modulePath}/package.json`));
  pkg['react-native'] = 'lib/index.js';
  pkg['main'] = 'lib/index.web.js';
  await writeFile(`${modulePath}/package.json`, JSON.stringify(pkg, null, 2), 'utf-8');
  log('✅ script ran successfully');
}
reactNativeMaps();

//
//add this to your package.json scripts section to run this script automatically after installing dependencies
/**
 * "scripts": {
  ...
  "postinstall": "node ./bin/postInstall && node react-native-map-web-fix.js",
  ...
}
 */

// run npm install or yarn install to execute the script automatically