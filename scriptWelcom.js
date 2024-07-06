
const storedUser_ = window.localStorage.key(0);
console.log(storedUser_);
document.getElementById('welcom').innerHTML = storedUser_ + ' ';
