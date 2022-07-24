
let process = false;

async function Main () {
    process = true;
    setTimeout(function() {
        console.log('Hello World')
    },5000);
    process = false;
}
setInterval(function() {
    if (!process){
        Main(process);
    }
}, 1000);

