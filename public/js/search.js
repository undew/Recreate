'use strict'

var app = new Vue({
    el: "#app",
    // オプションの設定
    data: {
        searchWord: "",
        ArStyle: {
            "background": "#303841",
            "color":"#FFFFFF",
        },
        UnStyle: {
            "background": "#FFFFFF",
            "color":"#303841",
        },
        arranged: true,
        unfinished:false,
        musicList: [],
        newList:[]
    },
    created: function () {
        const word = document.getElementById('word').value;
        this.searchWord = word;
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
        search: function () {
            const word = document.getElementById('word').value;
            this.searchWord = word;
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
        showMusicList: function (key) {
            const ary = [];
            if (key == "Ar") {
                for (var i = 0; i < this.musicList.arranged.length; i++) {
                    ary.push(this.musicList.arranged[i]);
                }
                this.arranged = true;
                this.unfinished = false;
                this.ArStyle["background"] = "#303841";
                this.ArStyle["color"] = "#FFFFFF";
                this.UnStyle["background"] = "#FFFFFF";
                this.UnStyle["color"] = "#303841";
            }
            if (key == 'Un') {
                for (var i = 0; i < this.musicList.unfinished.length; i++) {
                    ary.push(this.musicList.unfinished[i]);
                }
                this.arranged = false;
                this.unfinished = true;
                this.UnStyle["background"] = "#303841";
                this.UnStyle["color"] = "#FFFFFF";
                this.ArStyle["background"] = "#FFFFFF";
                this.ArStyle["color"] = "#303841";
            }
            this.newList = ary;
            return;
        },
    },
})

