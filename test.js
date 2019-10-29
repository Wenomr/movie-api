
for (let i = 0, p = Promise.resolve(); i < 10; i++) {
    p = p.then(_ => new Promise(resolve =>
        setTimeout(function () {
            console.log(i);
            resolve();
        }, 1000)
    ));
}