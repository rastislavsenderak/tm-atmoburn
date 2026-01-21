/* abs-map3d-reader - utils for reading atmoburn "map3D" database; version 1.0.1 */
// !!! requires Dexie to be loaded before this file

(function (global) {
    'use strict';

    // TODO: lazy loading/opening DB, maybe...
    const db = new Dexie("map3D");  // žiadne db.version(...)
    db.open().then(() => {
        console.debug("DB map3D opened, version:", db.verno);
    }).catch(Dexie.NoSuchDatabaseError, err => {
        console.error("DB map3D does not exist", err);
    }).catch(err => {
        console.error("DB map3D failed to open", err);
    });

    // --- Format Date to string, for example "2025-02-28 20:41".
    global.readAllFleetsFromMap3D = async function () {
        const mapMeta = db.table("mapMeta");

        // get all keys
        // const keys = await mapMeta.keys();

        const prefix = "f";
        const keys = await mapMeta.where("ndx").between(prefix, prefix + "\uffff", true, true).keys();

        const records = await mapMeta.bulkGet(keys);

        for (const r of records) {
            console.log(`ndx=${r.ndx}, items=${r.items}`)
        }
    }

})(typeof window !== 'undefined' ? window : this);
