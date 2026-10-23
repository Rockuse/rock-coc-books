const MODULE_ID = 'coc7-universal-books';
const GENRES = [
  ['Literature & Fiction','literature-fiction'],
  ['History & Archaeology','history-archaeology'],
  ['Science & Mathematics','science-mathematics'],
  ['Medicine & Psychology','medicine-psychology'],
  ['Religion & Philosophy','religion-philosophy'],
  ['Occult & Folklore','occult-folklore'],
  ['Mythos Tomes','mythos-tomes'],
  ['Politics & Law','politics-law'],
  ['Arts & Music','arts-music'],
  ['Travel & Geography','travel-geography'],
  ['Technology & Engineering','technology-engineering'],
  ['Reference & Education','reference-education'],
  ['Occult & Folklore – Additional','occult-folklore-extra'],
  ['Mythos Tomes – Additional','mythos-tomes-extra'],
  ['Religion & Philosophy – Additional','religion-philosophy-extra'],
  ['Fiction – Additional','fiction-extra']
];

async function install() {
  if (!game.user?.isGM) throw new Error('Only a GM can install the Books Library.');
  const findFolder = (name, parent) => game.folders.find(f => f.type === 'Compendium' && f.name === name && (f.folder?.id ?? null) === (parent?.id ?? null));
  let parent = findFolder('Compendium Item', null);
  if (!parent) parent = await Folder.create({name:'Compendium Item',type:'Compendium'});
  let books = findFolder('Books',parent);
  if (!books) books = await Folder.create({name:'Books',type:'Compendium',folder:parent.id});
  const results=[];
  for (const [genre, slug] of GENRES) {
    const response = await fetch(`modules/${MODULE_ID}/data/${slug}.json`);
    if (!response.ok) throw new Error(`Unable to load ${genre}: HTTP ${response.status}`);
    const records = await response.json();
    const name = `coc7-universal-books-${slug}`;
    let pack = game.packs.get(`world.${name}`);
    if (!pack) pack = await CompendiumCollection.createCompendium({name,label:`Books – ${genre}`,type:'Item',package:'world',system:'CoC7'});
    if (pack.locked) await pack.configure({locked:false});
    if (pack.folder?.id !== books.id) await pack.configure({folder:books.id});
    const index = await pack.getIndex();
    const existing = new Map(index.map(e => [e.name.toLocaleLowerCase(),e._id]));
    let created=0,updated=0;
    for (const record of records) {
      const found = existing.get(record.name.toLocaleLowerCase());
      if (found) {
        const doc=await pack.getDocument(found);
        await doc.update({img:record.img,system:record.system,flags:record.flags});
        updated++;
      } else {
        await pack.importDocument(new Item.implementation(record,{temporary:true}));
        created++;
      }
    }
    results.push({genre,total:records.length,created,updated});
  }
  console.table(results);
  ui.notifications.info(`Books Library: ${results.reduce((n,r)=>n+r.total,0)} books installed/updated in ${results.length} compendiums.`);
  return results;
}
Hooks.once('ready',()=>{const mod=game.modules.get(MODULE_ID);if(mod) mod.api={install};});
