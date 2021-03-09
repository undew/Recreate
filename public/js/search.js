'use strict'
var app = new Vue({
    el: "#app",
    // オプションの設定
    data: {
        arranged: true,
        unfinished:false,
        musicList: [],
        newList:[]
    },
    created: function () {
        const word = document.getElementById('word').value;
        var url = "/search/" + word;
        console.log(url);
        $.ajax({
            url: url,
            type: "GET",
        }).done(function(data, textStatus, jqXHR){
            this.musicList = data;
            console.log(this.musicList);
            const ary = [];
            for (var i = 0; i < this.musicList.arranged.length; i++) {
                ary.push(this.musicList.arranged[i]);
            }
            this.newList = ary;
        }.bind(this))
        .fail(function (jqXHR, textStatus, errorThrown) {
                console.log("通信失敗！");
            alert('商品の取得に失敗しました。');
        })
    },
    methods: {
        showMusicList: function (key) {
            const ary = [];
            if (key == "Ar") {
                for (var i = 0; i < this.musicList.arranged.length; i++) {
                    ary.push(this.musicList.arranged[i]);
                }
                this.arranged = true;
                this.unfinished = false;
            }
            if (key == 'Un') {
                for (var i = 0; i < this.musicList.unfinished.length; i++) {
                    ary.push(this.musicList.unfinished[i]);
                }
                this.arranged = false;
                this.unfinished = true;
            }
            this.newList = ary;
            return;
        },
    },

    
})
