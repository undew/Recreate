
$(function () {
    $('#triming_image').on('change', function (event) {
        console.log("www");
        var trimingImage = event.target.files;
        
        // imageタグは1つしかファイルを送信できない仕組みと複数送信する仕組みの二通りありますので、サーバー側でチェックを忘れないようにしてください。
        if(trimingImage.length > 1){
            console.log(trimingImage.length + 'つのファイルが選択されました。');
            return false;
        }
        // 改め代入します。
        trimingImage = trimingImage[0];

        var fileReader = new FileReader();
        fileReader.onload = function(e){
            var int32View = new Uint8Array(e.target.result);
            // see https://en.wikipedia.org/wiki/List_of_file_signatures
            // ファイルのヘッダを参照し、マイムタイプを疑似的に取得します。フレームワークによってはもっと簡単に正確に読めるものもあります。
            // 下記は厳しい設定です。正規の手順を踏んでもアップロードできないカメラなどがあります。
            // （私の環境ではアクションカメラの写真などは下記に引っ掛かりました。）
            if((int32View.length>4 && int32View[0]==0xFF && int32View[1]==0xD8 && int32View[2]==0xFF && int32View[3]==0xE0)
            || (int32View.length>4 && int32View[0]==0xFF && int32View[1]==0xD8 && int32View[2]==0xFF && int32View[3]==0xDB)
            || (int32View.length>4 && int32View[0]==0xFF && int32View[1]==0xD8 && int32View[2]==0xFF && int32View[3]==0xD1)
            || (int32View.length>4 && int32View[0]==0x89 && int32View[1]==0x50 && int32View[2]==0x4E && int32View[3]==0x47)
            || (int32View.length>4 && int32View[0]==0x47 && int32View[1]==0x49 && int32View[2]==0x46 && int32View[3]==0x38)
            || (int32View.length=2 && int32View[0]==0x42 && int32View[1]==0x4D && int32View[2]==0x46 && int32View[3]==0x38)
            ){ 
                // success
                $('#trimed_image').css('display', 'block');
                $('#trimed_image').attr('src', URL.createObjectURL(trimingImage));
                return true;
            } else {
                // failed
                alert('No Suport ' + trimingImage.type + ' type image');
                // exeファイルのアップロードを考えると下記よりもいいプラクティスがある可能性があります。
                $('#trimed_image').val('');
                return false;
            }
        };
        fileReader.readAsArrayBuffer(trimingImage);
        
        fileReader.onloadend = function(e){
            var image = document.getElementById('trimed_image');
            var button = document.getElementById('crop_btn');
            var close = document.getElementById('close_btn');
            console.log(button, close);
            var popup = document.getElementById('js-popup');
            if(!popup) return;
            popup.classList.toggle('is-show');
          
            var blackBg = document.getElementById('js-black-bg');
            var closeBtn = document.getElementById('js-close-btn');
          
            closePopUp(blackBg);
            closePopUp(closeBtn);
          
            var croppable = false;
            var cropper = new Cropper(image, {
                aspectRatio: 1,
                viewMode: 1,
                ready: function () {
                    croppable = true;
                },
            });
            button.onclick = function () {
                var croppedCanvas;
                let triming = document.getElementById('triming');
                croppedCanvas = cropper.getCroppedCanvas();
                console.log(croppedCanvas);
                var result = document.getElementById('results');
                var roundedImage;
                roundedCanvas = croppedCanvas;
                roundedImage = document.createElement('img');
                roundedImage.src = roundedCanvas.toDataURL();
                let textarea = document.getElementById('resultImage');
                textarea.value = roundedCanvas.toDataURL();
                roundedImage.name = 'trimed';
                roundedImage.id = 'trimed';
                result.innerHTML = `<span><img src="../../img/updateProfile.svg"></span>`;
                result.appendChild(roundedImage);
                triming.innerHTML = `<img src="" alt="トリミング画像" id="trimed_image" style="display: none;" />`;
                console.log(result);
                popup.classList.toggle('is-show');
            }
            close.onclick = function () {
                console.log('hello');
                popup.classList.toggle('is-show');
                let triming = document.getElementById('triming');
                triming.innerHTML = `<img src="" alt="トリミング画像" id="trimed_image" style="display: none;" />`;
            }
            function closePopUp(elem) {
                elem.addEventListener('click', function() {
                  popup.classList.toggle('is-show');
                })
                
              }
        };
    });
});