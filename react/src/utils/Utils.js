export function roundTo(n, place) {
  const num = Number.parseFloat(n);

  if (isNaN(num)) return n;

  return num.toFixed(place);
}
export function generateRandomColor() {
  let maxVal = 0xffffff; // 16777215
  let randomNumber = Math.random() * maxVal;
  randomNumber = Math.floor(randomNumber);
  randomNumber = randomNumber.toString(16);
  let randColor = randomNumber.padStart(6, 0);
  return `#${randColor.toUpperCase()}`;
}

export function capitalize(str) {
  return str.toLowerCase().charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

export function maxWords(str, num) {
  const sliptedStr = str.split(" ");
  let _str = ''
  for (let i = 0; i < sliptedStr.length; i++) {
    
    _str += capitalize(sliptedStr[i]) + ' ';
    if(i + 1 === num) break;
    
  }
  return _str + "...";
}
