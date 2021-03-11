
const pA = document.getElementById('popularArrange');
const pU = document.getElementById('popularUnfinished');
const tagWord = document.querySelectorAll('.tagWord');
console.log(pU);
pU.addEventListener('click', () => {
    $.ajax({
        url: "/popularArrange",
        type:'POST',
        data: {
            key: 'music_unfinished'
        },
        success: function(res){
            const List = document.getElementById('songList');
            pU.style.backgroundColor = '#303841';
            pU.style.color = 'white';
            pA.style.backgroundColor = 'white';
            pA.style.color = '#303841';
            $(List).empty();
            for (var i = 0; i < res.length; i++) {
                $(List).append(
                    '<a href="/music_unfinished/'+res[i].id +'">'+
                    '<div class="index__UnfinishedSong-List">' +
                    '<ul class="index__UnfinishedSong-content Un">' +
                    '<li class="index__UnfinishedSong-content--MusicName">' + res[i].uTitle + '<br>' +
                    '<span class="index__UnfinishedSong-content--UserName">' + res[i].uName + '</span></li>' +
                    '<li class="index__UnfinishedSong-content--Tag">' +
                    '<p>' + res[i].uTag + '</p>' +
                    '</li>' +
                    '<li class="index__UnfinishedSong-content--Provider">' + res[i].uProvider + '</li>' +
                    '<li class="index__UnfinishedSong-content--Created">' + res[i].uCreated + '</li>' +
                    '<li class="index__UnfinishedSong-content--Time">' + res[i].uTime + '</li>' +
                    '<li class="index__UnfinishedSong-content--GoodAndDl">' +
                    '<p class="index__UnfinishedSong-content--Good">' + res[i].uGood + '</p>' +
                    '<p class="index__UnfinishedSong-content--Dl">' + res[i].uDl + '</p>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</a>')
            };
        }
    });
})
pA.addEventListener('click', () => {
    $.ajax({
        url: "/popularArrange",
        type:'POST',
        data: {
            key: 'music_arrangement'
        },
        success: function(res){
            const List = document.getElementById('songList');
            pA.style.backgroundColor = '#303841';
            pA.style.color = 'white';
            pU.style.backgroundColor = 'white';
            pU.style.color = '#303841';
            $(List).empty();
            for (var i = 0; i < res.length; i++) {
                $(List).append(
                    '<a href="/music_arrangement/'+res[i].id+'">'+
                    '<div class="index__arrangedSong-List">' +
                    '<ul class="index__arrangedSong-content">' +
                    '<li class="index__arrangedSong-content--MusicName">' + res[i].mTitle + '<br>' +
                    '<span class="index__arrangedSong-content--UserName">' + res[i].mName + '</span></li>' +
                    '<li class="index__arrangedSong-content--Tag">' +
                    '<p>' + res[i].mTag + '</p>' +
                    '</li>' +
                    '<li class="index__arrangedSong-content--Provider">' + res[i].mProvider + '</li>' +
                    '<li class="index__arrangedSong-content--Created">' + res[i].mCreated + '</li>' +
                    '<li class="index__arrangedSong-content--Time">' + res[i].mTime + '</li>' +
                    '<li class="index__arrangedSong-content--GoodAndDl">' +
                    '<p class="index__arrangedSong-content--Good">' + res[i].mGood + '</p>' +
                    '<p class="index__arrangedSong-content--Dl">' + res[i].mDl + '</p>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</a>')
            };
        }
    });
})
var app = new Vue({
    el: "#app",
    data: {
        searchWord: [
            { message: 'studio one' },
            {message:'Funk'},
            {message:'POP'},
        ]
    },
    methods: {
        search: function (keyword) {
            var html = "<form method='post' action='/search' id='refresh' style='display: none;'>" +
            "<input type='hidden' name='word' value='"+ keyword +"' >" +
            "</form>";
          
          $("body").append(html);
          
          $("#refresh").submit();
        },
    }
})