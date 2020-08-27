const scrapData = () => {
        // //Scrapping Data
    // let data = await page.evaluate(async () => {
    //     const chatDiv = "#main ._2-aNW";

    //     function scrollToTop() {
    //         return new Promise((resolve, reject) => {
    //             var i = 0;
    //             var interval = setInterval(function() {
    //                 const scrollableSection = document.querySelector(chatDiv);
    //                 scrollableSection.scrollTop = 0;
    //                 if (i > 2500) {
    //                     clearInterval(interval);
    //                     resolve(true);
    //                 }
    //                 i++;
    //             }, 100);
    //         })
    //     }

    //     await scrollToTop();

    //     const chatIn = "div.message-in span.selectable-text span";
    //     const chatOut = "div.message-out span.selectable-text span";
    //     const chatInElem = document.querySelectorAll(chatIn);
    //     const chatOutElem = document.querySelectorAll(chatOut);
    //     let wordsIn = [];
    //     for (let i = 0; i < chatInElem.length; i++) {
    //         let split = chatInElem[i].textContent.split(" ");
    //         for (let i = 0; i < split.length; i++) {
    //             wordsIn.push(split[i].toLowerCase().replace(".", "").replace(",", "").replace("?", ""));
    //         }
    //     }
    //     let countsIn = {};
    //     for (let i = 0; i < wordsIn.length; i++) {
    //         countsIn[wordsIn[i]] = 1 + (countsIn[wordsIn[i]] || 0);
    //     }

    //     wordsInObj = Object.keys(countsIn);
    //     countInObj = Object.values(countsIn);

    //     let wordsOut = [];
    //     for (let i = 0; i < chatOutElem.length; i++) {
    //         let split = chatOutElem[i].textContent.split(" ");
    //         for (let i = 0; i < split.length; i++) {
    //             wordsOut.push(split[i].toLowerCase().replace(".", "").replace(",", "").replace("?", ""));
    //         }
    //     }
    //     let countsOut = {};
    //     for (let i = 0; i < wordsOut.length; i++) {
    //         countsOut[wordsOut[i]] = 1 + (countsOut[wordsOut[i]] || 0);
    //     }

    //     wordsOutObj = Object.keys(countsOut);
    //     countOutObj = Object.values(countsOut);

    //     let resultIn = [];
    //     for (let i = 0; i < wordsInObj.length; i++) {
    //         resultIn.push({
    //             word: wordsInObj[i],
    //             count: countInObj[i],
    //             type: "F"
    //         });
    //     }

    //     let resultOut = [];
    //     for (let i = 0; i < wordsOutObj.length; i++) {
    //         resultOut.push({
    //             word: wordsOutObj[i],
    //             count: countOutObj[i],
    //             type: "Q"
    //         });
    //     }
    //     return resultIn.concat(resultOut);
    // });

    // console.log(data);
    // new ObjectsToCsv(data).toDisk('./data.csv');
}