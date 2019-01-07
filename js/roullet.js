var roulletNum = 2;

function deleteElement(element) {
    $(element).parent().prev().remove();
    $(element).parent().remove();
    roulletNum--;
}

function removeOverlay() {
  $(".overlay").hide().find("h1").text("").find("h2").text("");
}


window.onload = function(){

    var rate;
    var colors = ["#7EA0E8","#72C4FF","#8EEDE9","#4BDFC7", "#52D166", "#B3E670", "#F4D549"];
    var fillColor;
    var text;
    var point;

    draw();
    appendRoultte('당첨');
    appendRoultte('꽝');
    make();


    $('#start_btn').click(function(){
        rotation();
    });

    $('#make').click(function() {
        make();
    })

    $('#add').click(function() {
        appendRoultte('');
        roulletNum++;
    })

    function appendRoultte(text) {
        if (roulletNum > 20) {
            alert("최대 갯수를 초과하였습니다.");
            return;
        }
        var html = '<div class="col-md-10 col-lg-10 col-xs-4 col-sm-4">';
        html += '<input class="form-control" type="text" style="" maxlength="5" value="' + text + '"/></div>';
        html += '<div class="col-md-1 col-lg-1 col-xs-1 col-sm-1">'
        html += '<button type="button" class="btn btn-danger" style="margin:0 0 30px 0" onclick="deleteElement(this)"><span class="glyphicon glyphicon-trash"></span></button></div></div>'
        $("#list").append(html);
    }

    /**
     * 회전
     */
    function rotation() {
        var random = randomize(0, 360);

        $("#circle").rotate({
          angle:0,
          animateTo:360 * 50 + random,
          center: ["50%", "50%"],
          easing: $.easing.easeInOutElastic,
          callback: function(){
                        var n = $(this).getRotateAngle();
                        endAnimate(n);
                    },
          duration: 10000
       });
    }

    /**
     * 당첨
     */
    function endAnimate($n){
        var n = $n;

        var real_angle = n%360;

        var resultText;

        for (var i = rate.length; i >= 0; i--) {

            if (real_angle < 360 - rate[i]) {
                resultText = text[i];
                break;
            }
        }
        
        $(".overlay").show().find("h2").text(resultText);
        $(".overlay").find("h1").text($("#title").val());
    }

    function randomize($min, $max){
        return Math.floor(Math.random() * ($max - $min + 1)) + $min;
    }

    /**
     * 원 그리기
     */
    function draw() {
        var canvas = document.getElementById('circle');
            if (canvas.getContext)
            {
                var ctx = canvas.getContext('2d');

                var X = canvas.width / 2;
                var Y = canvas.height / 2;
                var R = 250;
                ctx.beginPath();
                ctx.arc(X, Y, R, 0, 2 * Math.PI, true);
                // ctx.lineWidth = 1;
                // ctx.strokeStyle = '#ffffff';

                ctx.stroke();
            }
    }

    /**
     * 룰렛 그리기
     */
    function make() {
        var textRadius = 160;

        rate = new Array();
        fillColor = new Array();
        text = new Array();

        rate.push(0);
        var angle = 360 / roulletNum;

        var list = $("#list").find("div");
        text.push(list.find("input").val());

        for (var i = 0; i < roulletNum; i++) {

            if (i > 0) {
                list = list.next().next();
                text.push(list.find("input").val());
            }
            fillColor.push(colors[i % 7]);
            rate.push(angle + (angle * i));
        }

        fillColor.push("#EFA078");
        var canvas = document.getElementById('circle');
        if (canvas.getContext)
        {
            var ctx = canvas.getContext('2d');

            ctx.clearRect(0,0,600,600);

            for (var i = 1; i < rate.length; i++) {
                var angle = (Math.PI/180) * rate[i-1];
                var arc = (Math.PI/180) * rate[i] - angle;
                ctx.beginPath();
                ctx.moveTo(300, 300);
                ctx.lineWidth = 5;
                ctx.strokeStyle = fillColor[i];
                ctx.arc(300,300,250,(Math.PI/180)*rate[i-1], (Math.PI/180)*rate[i],false);
                ctx.fillStyle = fillColor[i];
                ctx.stroke();
                ctx.fill();

                ctx.save();

                ctx.translate(300 + Math.cos(angle + arc / 2) * textRadius, 300 + Math.sin(angle + arc / 2) * textRadius);

                ctx.rotate(angle + arc / 2 + Math.PI / 2);
                var roulletText = text[i - 1];
                ctx.fillStyle = "white";
                ctx.font="25px Arial";
                ctx.fillText(roulletText, -ctx.measureText(roulletText).width / 2, 0);

                ctx.closePath();

                ctx.restore();
            }

            ctx.beginPath();
            ctx.moveTo(300, 300);
            // ctx.lineWidth = 3;
            // ctx.strokeStyle = '#000000';
            ctx.arc(300,300,250,(Math.PI/180)*360,(Math.PI/180)*360,true);
            ctx.stroke();
        }

    }


};