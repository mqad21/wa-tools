const jsonfile = require("jsonfile");

const setSession = async (page, sessionFile) => {
    const readFileJson = () => {
        return new Promise()
    }
    
    return new Promise(async (resolve, reject) => {
        jsonfile.readFile(sessionFile, async function(err, obj) {
            if (err) {
                reject("Gagal memuat session WA");
            } else {
                await page.evaluate((obj) => {
                    for (let i = 0; i < Object.keys(obj).length; i++) {
                        localStorage.setItem(Object.keys(obj)[i], Object.values(obj)[i]);
                    }
                }, obj);
                page.reload();
                resolve("Berhasil memuat session WA");
            }
        });
    })
}

module.exports = setSession;