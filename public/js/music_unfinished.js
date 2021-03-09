
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
wavesurfer.load("../../" + audioPath);
play.addEventListener('click', () => {
    let sound = document.getElementsByClassName('play')[0];
    console.log(sound);
    if (!sound) {
        console.log(0);
        wavesurfer.play();
        play.classList.toggle('play');
        play.style.backgroundImage = "url(../../img/arStop.svg)";
        
    } else {
        console.log(1);
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