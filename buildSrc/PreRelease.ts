import fs from 'fs';
import path from 'path';

fs.writeFileSync(path.resolve(__dirname, '..', 'build', 'config','initial.json'), JSON.stringify({
  "apiURL": "https://sogos.api.unthrottled.io"
}, null, 2))
