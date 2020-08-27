const puppeteer = require("puppeteer");
const startWa = require("./start-wa");
const fs = require("fs");
const { log } = require("console");

const sendMessageAt = async ({ wa, contacts, time, message }) => {
  const { page, browser } = wa;

  function runAtTime(time) {
    console.log("Menunggu waktu kirim pesan...");
    return new Promise((resolve, reject) => {
      let now = new Date();
      const startTime = Date.parse(time);
      while (now.getTime() < startTime) {
        now = new Date();
      }
      resolve(true);
    });
  }

  await runAtTime(time);
  console.log("Waktu tiba!");

  for (let i = 0; i < contacts.length; i++) {
    let contact = contacts[i];
    //Search contact
    const searchSelector =
      "#side > div._2EoyP > div > label > div > div._3FRCZ.copyable-text.selectable-text";
    const search = await page.$(searchSelector);
    await search.click();
    await search.type(contact);

    //Click chat
    const contactTargetSelector = "span[title='" + contact + "']";
    await page.waitForSelector(contactTargetSelector, {
      timeout: 0,
    });
    const target = await page.$(contactTargetSelector);
    await target.click();

    //Type message
    const inputSelector =
      "#main > footer > div._3ee1T._1LkpH.copyable-area > div._3uMse > div > div._3FRCZ.copyable-text.selectable-text";
    const input = await page.$(inputSelector);
    await input.click();
    await input.type(message);
    await page.keyboard.press("Enter");
    console.log("Berhasil mengirim pesan!");

    //Close search
    const closeSelector = "#side > div._2EoyP > div > button";
    const close = await page.$(closeSelector);
    await close.click();
  }

  // await browser.close();
};

module.exports = sendMessageAt;
