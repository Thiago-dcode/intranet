export function roundTo(n, place) {
  const num = Number.parseFloat(n);

  if (isNaN(num)) return n;

  return num.toFixed(place);
}
export  function generateRandomColor(){
    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal; 
    randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    let randColor = randomNumber.padStart(6, 0);   
    return `#${randColor.toUpperCase()}`
}