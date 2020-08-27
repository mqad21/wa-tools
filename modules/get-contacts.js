const getContacts = async (page) => {
    const menuSelector =
        "#side > header > div._3euVJ > div > span > div:nth-child(3) > div";
    const menu = await page.$(menuSelector);
    await menu.click();

    const newGroupSelector =
        "#side > header > div._3euVJ > div > span > div.PVMjB._4QpsN > span > div > ul > li:nth-child(1) > div";
    const newGroup = await page.$(newGroupSelector);
    await newGroup.click();

    await page.waitForSelector("div._1qDvT._2gSSF");

    console.log("Mengambil kontak...");
    const contactSelector = "#app > div > div > div.YD4Yw > div._1-iDe._1xXdX > span > div > span > div > div > div._1qDvT._2gSSF div > div div > div > div._2kHpK > div._3dtfX > div span._357i8";
    await page.waitForSelector(contactSelector);

    let contacts = await page.evaluate(async(contactSelector) => {
        let results = [];

        const list = document.querySelector("div._1qDvT._2gSSF");

        async function getContact(contactSelector){
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    let contact = document.querySelectorAll(contactSelector);
                    resolve(contact);
                }, 50);
            });
        };
    
        async function scrollLoop(list, contactSelector) {
            const limit = parseInt(list.scrollHeight / list.offsetHeight);
            for (let x = 1; x <= limit; x++) {
                let contact = await getContact(contactSelector);
                for (let i = 0; i < contact.length; i++) {
                    results.push(contact[i].textContent);
                }
                list.scrollTo(0, x * list.offsetHeight);
            }
            list.scrollTop = 0;
            return Promise.resolve(true);
        };    

        await scrollLoop(list, contactSelector);

        results = [...new Set(results)];

        return results;
    },contactSelector);

    const backSelector =
        "#app > div > div > div.YD4Yw > div._1-iDe._1xXdX > span > div > span > div > header > div > div._3SrqU > button > span";
    const back = await page.$(backSelector);
    await back.click();

    console.log(contacts);
    return contacts;
};

module.exports = getContacts;