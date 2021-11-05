const fs = require('fs');
//  addExportsToYWebsocket
const data = JSON.parse(fs.readFileSync(require.resolve('y-websocket/package.json'), { encoding: 'utf-8' }));
data['exports']['./bin/*'] = './bin/*';
fs.writeFileSync(require.resolve('y-websocket/package.json'), JSON.stringify(data, null, 2));
