const userId = document.getElementById('userId').value;
const songList = document.getElementById('songList');
const aBtn = document.getElementById('Arrange');
const uBtn = document.getElementById('Unfinished');
const like = document.getElementById('likeButton');
const navPrev = document.getElementById('navPrev');
const navLike = document.getElementById('navLike');
//ajaxでとってきたユーザの曲情報を保持する配列
let musics = [];
(window.onload = function () {
    $.ajax({
        url: "/navPrev",
        type: 'POST',
        data: {
            userId: userId,
            
        },
        success: function (res) {
            musics['arranged'] = res['arranged'];
            musics['unfinished'] = res['unfinished'];
            console.log(musics);
            for (var i = 0; i < musics['arranged'].length; i++) {
                $(songList).append(`
            <a href="/music_arrangement/`+ musics['arranged'][i].id + `">
            <div class="mypage__song-List">
                <ul class="mypage__song-content">
                    <li class="mypage__song-content--MusicName">`+ musics['arranged'][i].mTitle + `<br>
                    <span class="mypage__song-content--UserName">`+ musics['arranged'][i].mName + `</span>
                    </li>
                    <li class="mypage__song-content--Provider">`+ musics['arranged'][i].mProvider + `</li>
                    <li class="mypage__song-content--GoodAndDl">
                <p class="mypage__song-content--Good">`+ musics['arranged'][i].mGood + `</p>
                <p class="mypage__song-content--Dl">`+ musics['arranged'][i].mDl + `</p>
            </li>
        </ul>
    </div>
</a>`)
            }
        }
    });  
})
navPrev.addEventListener('click', () => {
    $.ajax({
        url: "/navPrev",
        type: 'POST',
        data: {
            userId: userId,
        },
        success: function (res) {
            musics['arranged'] = res['arranged'];
            musics['unfinished'] = res['unfinished'];
            console.log(musics);
            $(songList).empty();
            for (var i = 0; i < musics['arranged'].length; i++) {
                $(songList).append(`
            <a href="/music_arrangement/`+ musics['arranged'][i].id + `">
                <ul class="mypage__song-content">
                    <li class="mypage__song-content--MusicName">`+ musics['arranged'][i].mTitle + `<br>
                    <span class="mypage__song-content--UserName">`+ musics['arranged'][i].mName + `</span>
                    </li>
                    <li class="mypage__song-content--Provider">`+ musics['arranged'][i].mProvider + `</li>
                    <li class="mypage__song-content--GoodAndDl">
                <p class="mypage__song-content--Good">`+ musics['arranged'][i].mGood + `</p>
                <p class="mypage__song-content--Dl">`+ musics['arranged'][i].mDl + `</p>
            </li>
        </ul>
</a>`)
            }
        }
    })
})
uBtn.addEventListener('click', ()=> {
    $(songList).empty();
    for (var i = 0; i < musics['unfinished'].length; i++) {
        $(songList).append(`
    <a href="/music_unfinished/`+ musics['unfinished'][i].id + `">
        <ul class="mypage__song-content">
            <li class="mypage__song-content--MusicName">`+ musics['unfinished'][i].uTitle + `<br>
            <span class="mypage__song-content--UserName">`+ musics['unfinished'][i].uName + `</span>
            </li>
            <li class="mypage__song-content--Provider">`+ musics['unfinished'][i].uProvider + `</li>
            <li class="mypage__song-content--GoodAndDl">
                <p class="mypage__song-content--Good">`+ musics['unfinished'][i].uGood + `</p>
                <p class="mypage__song-content--Dl">`+ musics['unfinished'][i].uDl + `</p>
            </li>
        </ul>
</a>`)
    }
})
aBtn.addEventListener('click', () => {
    $(songList).empty();
    for (var i = 0; i < musics['arranged'].length; i++) {
        $(songList).append(`
    <a href="/music_arrangement/`+ musics['arranged'][i].id + `">
        <ul class="mypage__song-content">
            <li class="mypage__song-content--MusicName">`+ musics['arranged'][i].mTitle + `<br>
            <span class="mypage__song-content--UserName">`+ musics['arranged'][i].mName + `</span>
            </li>
            <li class="mypage__song-content--Provider">`+ musics['arranged'][i].mProvider + `</li>
            <li class="mypage__song-content--GoodAndDl">
        <p class="mypage__song-content--Good">`+ musics['arranged'][i].mGood + `</p>
        <p class="mypage__song-content--Dl">`+ musics['arranged'][i].mDl + `</p>
    </li>
</ul>
</a>`)
    }
})
navLike.addEventListener('click', () => {
    $.ajax({
        url: "/navLike",
        type: 'POST',
        data: {
            userId: userId,
            
        },
        success: function (res) {
            console.log(res);
            musics['arranged'] = res['arranged'];
            musics['unfinished'] = res['unfinished'];
            console.log(res);
            $(songList).empty();
            for (var i = 0; i < musics['unfinished'].length; i++) {
                $(songList).append(`
            <a href="/music_arrangement/`+ musics['arranged'][i].id + `">
                <ul class="mypage__song-content">
                    <li class="mypage__song-content--MusicName">`+ musics['arranged'][i].mTitle + `<br>
                    <span class="mypage__song-content--UserName">`+ musics['arranged'][i].mName + `</span>
                    </li>
                    <li class="mypage__song-content--Provider">`+ musics['arranged'][i].mProvider + `</li>
                    <li class="mypage__song-content--GoodAndDl">
                <p class="mypage__song-content--Good">`+ musics['arranged'][i].mGood + `</p>
                <p class="mypage__song-content--Dl">`+ musics['arranged'][i].mDl + `</p>
            </li>
        </ul>
</a>`)
            }
        }

    })
})
