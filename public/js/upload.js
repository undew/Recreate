
const pA = document.getElementById('popularArrange');
const pU = document.getElementById('popularUnfinished');
let sound = document.getElementById('file');

pU.addEventListener('click', () => {
    pU.style.backgroundColor = '#303841';
    pU.style.color = 'white';
    pA.style.backgroundColor = 'white';
    pA.style.color = '#303841';
    $(".upload__main").empty();
    $(".upload__main").append(`
        <form action="/unfinishedResult" method="post" enctype="multipart/form-data">
        <div class="unfinished__main">
            <section class="unfinished__main--file">
                <h3>音源ファイル</h3>
                <label for="file_upload">
                    <p>音源を選択する</p>
                    <input type="file" name="file" id="file" accept="audio/wav,audio/mp3">
                    <input type="hidden" name="time" id="time" value="">        
        </label>
            </section>
            <section class="unfinished__main--title">
                <h3>タイトル</h3>
                <input type="text" name="title" value="">
            </section>
            <section class="unfinished__main--info">
                <h3>概要</h3>
                <p><textarea name="info" id="" cols="30" rows="10"></textarea></p>
            </section>
            <section class="unfinished__main--tag">
                <h3>タグ</h3>
                <p><input type="text" name="tag" value=""></p>
            </section>
            </div>
            <button type="submit" class="unfinished__main--form">音源を投稿する</button>
        </form>
        `
    );
    sound = document.getElementById('file');
    sound.addEventListener('change', (e) => {
        e.preventDefault();
        var file = sound.files[0];
        var time = document.getElementById('time');
        var audio = document.createElement('audio');
        console.log(file);
        var fileURL = URL.createObjectURL(file);
        audio.src = fileURL;
        audio.ondurationchange = function () {  
            var timeM = Math.floor(this.duration % (24 * 60 * 60) % (60 * 60) / 60);
            var timeS = this.duration % (24 * 60 * 60) % (60 * 60) % 60;
            time.value = timeM + ":" + Math.round(timeS);
          URL.revokeObjectURL(this.src);
        };
    })
    
    
})
pA.addEventListener('click', () => {
    pA.style.backgroundColor = '#303841';
    pA.style.color = 'white';
    pU.style.backgroundColor = 'white';
    pU.style.color = '#303841';
    $(".upload__main").empty();
    $(".upload__main").append(
            '<form action="/arrangeResult" method="post" enctype="multipart/form-data">'+
            '<div class="arrangeList__main">'+
            '<section class="arrangeList__main--file">'+
            '<h3>音源ファイル</h3>'+
            '<label for="file_upload">'+
            '<p>音源を選択する</p>'+
            '<input type="file" name="file" id="file" accept="audio/wav,audio/mp3">'+
            '<input type="hidden" name="time" id="time" value="">'+ 
            '</label>'+
            '</section>'+
            '<section class="arrangeList__main--title">'+
            '<h3>タイトル</h3>'+
            '<input type="text" name="title">'+
            '</section>'+
            '<section class="arrangeList__main--info">'+
            '<h3>概要</h3>'+
            '<p><textarea name="info" id="" cols="30" rows="10"></textarea></p>'+
            '</section>'+
            '<section class="arrangeList__main--tag">'+
            '<h3>タグ</h3>'+
            '<p><input type="text" name="tag></p>'+
            '</section>'+
            '<section class="arrangeList__main--provider">'+
            '<h3>使わせてもらう未完成曲</h3>'+
            '<select name="provider" id="">'+
            '<option value="0">ゴリにゃ / なんかできたやつ</option>'+
            '</select>'+
            '</section>'+
            '</div>'+
            '<section class="arrangeList__main--attention">'+
            '<ul>'+
            '<li><input type="checkbox" id="commercial" name="com" checked="checked"><label for="commercial" class="com">商用利用不可</label></li>'+
            '<li><input type="checkbox" id="reprinting" name="rep"><label for="reprinting" class="com">転載不可</label></li>'+
            '</ul>'+
            '</section>'+
            '<button type="submit" class="arrangeList__main--form">音源を投稿する</button>'+
            '</form>'
    );
    sound = document.getElementById('file');
    sound.addEventListener('change', (e) => {
    e.preventDefault();
    var file = sound.files[0];
    var time = document.getElementById('time');
    var audio = document.createElement('audio');
    console.log(file);
    var fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    audio.ondurationchange = function () {  
        var timeM = Math.floor(this.duration % (24 * 60 * 60) % (60 * 60) / 60);
        var timeS = this.duration % (24 * 60 * 60) % (60 * 60) % 60;
        time.value = timeM + ":" + Math.round(timeS);
      URL.revokeObjectURL(this.src);
    };
})
})

sound.addEventListener('change', (e) => {
    e.preventDefault();
    var file = sound.files[0];
    var time = document.getElementById('time');
    var audio = document.createElement('audio');
    console.log(file);
    var fileURL = URL.createObjectURL(file);
    audio.src = fileURL;
    audio.ondurationchange = function () {  
        var timeM = Math.floor(this.duration % (24 * 60 * 60) % (60 * 60) / 60);
        var timeS = this.duration % (24 * 60 * 60) % (60 * 60) % 60;
        time.value = timeM + ":" + Math.round(timeS);
      URL.revokeObjectURL(this.src);
    };
})

