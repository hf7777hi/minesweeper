const canvas = document.getElementById('main');  
const ctx = canvas.getContext('2d');
// -----
const PANEL=10;
const startY = Math.floor(canvas.height%PANEL/2);
const startX = Math.floor(canvas.width%PANEL/2);
const dy = Math.floor(canvas.height/PANEL);
const dx = Math.floor(canvas.width/PANEL);
let bomList = [];
const RATE = 15;
const BOM_NUM = Math.floor(PANEL*PANEL*RATE/100);
const BOM = '💣';
let openPanel = {};
// -----
main();

/**
 * 
 * @param {boolean} debug 
 */
function main(debug=false) {
  init();
  if(debug) {
    openBom();
    debug=false;
  }
  canvas.addEventListener('click', game, false);
  return;
  /**
   * 初期化
   */
  function init() {
    bomList = [];
    openPanel = {};
    for(let y = startY; y<=(canvas.height - dy); y+=dy) {
      for(let x = startX; x<=(canvas.width - dx); x+=dx) {
        draw(x, y);
      }
    }
    setBom();
    return;

    /**
     * 爆弾を設置
     */
    function setBom() {
      for(var i=0; i<BOM_NUM; i++) {
        index = Math.floor(Math.random() * (PANEL*PANEL));
        if (bomList.indexOf(index) < 0) {
          bomList.push(index);
        } else {
          // TODO
          bomList.push(Math.floor(Math.random() * (PANEL*PANEL)));
        }
      }
    }
  }
}
/**
 * 
 * @param {*} e 
 */
function game(e) {
  let rect = e.target.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;
  x = Math.floor(x/dx) * dx + startX;
  y = Math.floor(y/dy) * dy + startY;

  let count = open(x, y);
  if (count == BOM) {
    canvas.removeEventListener('click', game, false);
    openBom();
    console.log('Game Over.');
    alert('Game Over.');
  }
  if(isClear()) {
    canvas.removeEventListener('click', game, false);
    console.log('Game Clear.');
    alert('Game Clear.');
  }
  return;
  /**
   * パネルを開く
   * @param {int} x 
   * @param {int} y 
   */
  function open(x, y) {
    let count = judge(conversionIndex(x, y));
    ctx.clearRect(x, y, dx, dy);
    draw(x, y, '#C0C0C0', count);
    return count;
    /**
     * x, y座標をindex値に変換
     * @param {int} x パネルのx座標開始値
     * @param {int} y パネルのy座標開始値
     * @returns {int} index 
     */
    function conversionIndex(x, y) {
      let indexY = (y - startY) / dy;
      let indexX = (x - startX) / dx;
      return indexY * PANEL + indexX;
    }
  }
  /**
   * 判定処理
   * @param {int} index 
   */
  function judge(index) {
    if (openPanel[index]) return openPanel[index];
    if (isGameOver(index)) return BOM;
    openPanel[index]=bomCount(index);
    return openPanel[index];
    /**
     * 周囲の爆弾カウント
     * @param {int} index 
     * @returns {int} count 爆弾数
     */
    function bomCount(index) {
      let count = 0;
      let indexY = Math.floor(index/PANEL);
      let indexX = Math.floor(index%PANEL);
      for(let y=indexY-1; y<=indexY+1; y++) {
        if (y < 0 || y >= PANEL) continue;
        for(let x=indexX-1; x<=indexX+1; x++) {
          if (x < 0 || x >= PANEL) continue;
          if (bomList.indexOf(y * PANEL + x) >= 0) count++;
        }
      }
      return count;
    }
    /**
     * GameOver
     */
    function isGameOver(index) {
      return (bomList.indexOf(index) >= 0);
    }
  }
  /**
   * クリア判定
   * @returns {boolean}
   */
  function isClear() {
    return (Object.keys(openPanel).length >= PANEL * PANEL - bomList.length);
  }
}
/**
 * 描画
 * @param {int} x 
 * @param {int} y 
 * @param {String} fillStyle 
 * @param {String} text 
 * @param {String} textColor 
 */
function draw(x, y, fillStyle='blue', text, textColor='black') {
  ctx.beginPath();
  ctx.rect(x, y, dx, dy);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  if (text !== void 0) {
    ctx.font = "20px 'ＭＳ Ｐゴシック'";
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, dx/2+x, dy/2+y, dx);
  }
}
/**
 * 爆弾を表示
 */
function openBom() {
  bomList.forEach(index => {
    draw(Math.floor(index%PANEL)*dx+startX, Math.floor(index/PANEL)*dy+startY, '#C0C0C0', BOM, 'red');
  });
}