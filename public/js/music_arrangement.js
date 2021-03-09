
const userId = document.getElementById('userId').value;
const musicId = document.getElementById('musicId').value;
const like = document.getElementById('likeButton');
const filename = document.getElementById('filename').value;
const likeDB = document.getElementById('likeDB').value;
const likeColumn = document.getElementById('likeColumn').value;
const audioPath = document.getElementById('audioPath').value;
const play = document.getElementById('play');
// const seekbar = document.querySelector("#seekbar");  // <input type="range">
const curtime = document.querySelector("#curtime");  // <span>
const alltime = document.querySelector("#alltime");  // <span>
let Good = document.getElementById('Good').value;
let timerid;
/**
 * Howlを使った理由
 * 音声の再生場所を数字で表すため
 */
var sd = new Howl({
    src: "../../" + audioPath
});
//Howlの方はミュートする
sd.mute(true);
sd.once('load', () => {
    duration = sd.duration();
})
//オーディオファイルの読み込み
var wavesurfer = WaveSurfer.create({
    container: document.querySelector('#waveform'),
    backend: 'MediaElement',
    barWidth: 3,
    barHeight: 1, // the height of the wave
    barGap: null,
    autoCenter:true
});
//音声ファイルを読み込む（mp3, wav, oggなど）
console.log(audioPath);
wavesurfer.load("../../" + audioPath);
play.addEventListener('click', () => {
    let sound = document.getElementsByClassName('play')[0];
    console.log(sound);
    if (!sound) {
        console.log(0);
        sd.play();
        wavesurfer.play();
        play.classList.toggle('play');
        play.style.backgroundImage = "url(../../img/arStop.svg)";
        
    } else {
        console.log(1);
        sd.pause(); 
        wavesurfer.pause();
        play.classList.toggle('play');
        play.style.backgroundImage = "url(../../img/arPlay.svg)";
    }

})
//スペースキーを押すことでも再生と停止を行う。
document.onkeydown = function(e) {
    var keyCode = false;
 
    if (e) key = e;
    if (key.keyCode == 32) {
        play.click();
    }
};

//曲の秒数を変換する
function getMMSS(sec){
    const mm = Math.floor( sec / 60 );  // 分
    const ss = Math.floor( sec % 60 );  // 秒
  
    return(
      ("00" + mm).slice(-2) + ":" + ("00" + ss).slice(-2)
    );
}

sd.on("play", ()=>{
    const len = duration;  //曲の長さを取得
    console.log(len);
    // タイマースタート
    timerid = setInterval(()=>{
      let cur = sd.seek();  
      // 現在の再生時間を更新
      curtime.innerHTML = getMMSS(cur);
    }
    , 200);  // 0.2秒ごとに実行
  });
  
  /**
   * [event] 曲の一時停止時の実行
   */
  sd.on("pause", ()=>{
    // タイマーを解除
    clearInterval(timerid);
  });
  
  /**
   * [event] 曲の再生終了時に実行
   */
  sd.on("end", ()=>{
    // タイマーを解除
    clearInterval(timerid);
  });
like.addEventListener('click', () => {
    console.log('hello')
    $.ajax({
        url: "/like",
        type: 'POST',
        data: {
            id: userId,
            musicId: musicId,
            Good: Good,
            filename: filename,
            likeDB: likeDB,
            likeColumn:likeColumn
        },
        success: function (res) {
            if (res == "red") {
                like.style.backgroundColor = "#60CFFF";
                Good = Number(Good) + 1;
                $(like).empty();
                $(like).append(Good)
            } else if (res == "white") {
                like.style.backgroundColor = "#D3D6DB";
                Good = Number(Good) - 1;
                $(like).empty();
                $(like).append(Good)
            }
        }
        
        
    })
})