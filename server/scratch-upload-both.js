require('dotenv').config()
const cloudinary = require('./src/lib/cloudinary')

const base = 'C:/Users/jeana/AppData/Local/Temp/claude/C--Users-jeana-Desktop-Seedarrt-final/85aa5dcc-8f73-470a-880f-a33da8fb5d74/scratchpad/imgpad'

async function main() {
  const graphisme = await cloudinary.uploader.upload(`${base}/graphisme-padded6.png`, { folder: 'seedarrt/site', resource_type: 'image' })
  console.log('GRAPHISME', graphisme.public_id, graphisme.secure_url)

  const peinture = await cloudinary.uploader.upload(`${base}/peinture-padded6.png`, { folder: 'seedarrt/site', resource_type: 'image' })
  console.log('PEINTURE', peinture.public_id, peinture.secure_url)

  await cloudinary.uploader.destroy('seedarrt/site/bt2h0zabcquvdsve8kyu', { resource_type: 'image' })
  console.log('old graphisme (12% pad) deleted')
}

main().catch(e => { console.error(e); process.exit(1) })
