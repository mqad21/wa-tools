const loadSession = async (page, obj) => {
    await page.evaluate((obj) => {
        for (let i = 0; i < Object.keys(obj).length; i++) {
            localStorage.setItem(Object.keys(obj)[i], Object.values(obj)[i]);
        }
    }, obj);
    page.reload();
}

module.exports = loadSession;