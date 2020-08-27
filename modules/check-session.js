const fs = require('fs');

const checkSession = (path) => {
    return new Promise((resolve, reject) => {
        try {
            if (fs.existsSync(path)) {
                console.log("Session WA ada");
                return resolve(true);
            } else {
                console.log("Session WA tidak ada");
                return resolve(false);
            }
        } catch (err) {
            console.log(err);
        }
    });
}

module.exports = checkSession;