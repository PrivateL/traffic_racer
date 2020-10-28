/* Arshad Muhammed */
$(function() {

    var anim_id;

    //saving dom objects to variables
    var container = $('#container');
    var car = $('#car');
    var car_1 = $('#car_1');
    var car_2 = $('#car_2');
    var car_3 = $('#car_3');
    var line_1 = $('#line_1');
    var line_2 = $('#line_2');
    var line_3 = $('#line_3');
    var restart_div = $('#restart_div');
    var restart_btn = $('#restart');
    var score = $('#score');
    var high_score = localStorage.getItem('high_score');
    $('#high_score').text(high_score);

    //saving some initial setup
    var container_left = parseInt(container.css('left'));
    var container_width = parseInt(container.width());
    var container_height = parseInt(container.height());
    var car_width = parseInt(car.width());
    var car_height = parseInt(car.height());

    //some other declarations
    var game_over = false;

    var score_counter = 1;

    var speed = 2;
    var line_speed = 5;

    var move_right = false;
    var move_left = false;
    var move_up = false;
    var move_down = false;

    var p = 1;
    var ans_x = 0;
    var my_x = 0;
    var move_speed=0;
    /* ------------------------------GAME CODE STARTS HERE------------------------------------------- */

    /* Move the cars */
    $(document).on('keydown', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37 && move_left === false) {
                move_left = requestAnimationFrame(left);
            } else if (key === 39 && move_right === false) {
                move_right = requestAnimationFrame(right);
            } else if (key === 38 && move_up === false) {
                move_up = requestAnimationFrame(up);
            } else if (key === 40 && move_down === false) {
                move_down = requestAnimationFrame(down);
            }
        }
    });

    $(document).on('keyup', function(e) {
        if (game_over === false) {
            var key = e.keyCode;
            if (key === 37) {
                cancelAnimationFrame(move_left);
                move_left = false;
            } else if (key === 39) {
                cancelAnimationFrame(move_right);
                move_right = false;
            } else if (key === 38) {
                cancelAnimationFrame(move_up);
                move_up = false;
            } else if (key === 40) {
                cancelAnimationFrame(move_down);
                move_down = false;
            }
        }
    });

    function left() {
        if (game_over === false && parseInt(car.css('left')) > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(left);
        }
    }

    function right() {
        if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(right);
        }
    }
    function left1(x) {
        if(game_over != false ) return;
        if (parseInt(car.css('left')) - x > 0) {
            car.css('left', parseInt(car.css('left')) - x);
        }
        else{
            car.css('left', 0);
        }
    }

    function right1(x) {
        if(game_over != false ) return;
        if (parseInt(car.css('left')) + x < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + x);
        }
        else{
            car.css('left', container_width - car_width);
        }
    }
    function up() {
        if (game_over === false && parseInt(car.css('top')) > 0) {
            car.css('top', parseInt(car.css('top')) - 3);
            move_up = requestAnimationFrame(up);
        }
    }

    function down() {
        if (game_over === false && parseInt(car.css('top')) < container_height - car_height) {
            car.css('top', parseInt(car.css('top')) + 3);
            move_down = requestAnimationFrame(down);
        }
    }

    /* Move the cars and lines */
    anim_id = requestAnimationFrame(repeat);
    
    function repeat() {
        if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
            stop_the_game();
            return;
        }

        score_counter++;

        if (score_counter % 20 == 0) {
            score.text(parseInt(score.text()) + 1);
        }
        if (score_counter % 500 == 0) {
            speed++;
            line_speed++;
        }

        car_down(car_1);
        car_down(car_2);
        car_down(car_3);

        line_down(line_1);
        line_down(line_2);
        line_down(line_3);
        my_x = parseInt(car.css('left'));//get_my_x(car);//
        ans_x = find_x(my_x);
        if(ans_x<my_x && my_x-ans_x>=3) {move_speed = isok(); if(move_speed>0){left1(Math.max(2,(my_x - ans_x)/move_speed));} }
        else if(ans_x>my_x && ans_x-my_x>=3) {move_speed = isok(); if(move_speed>0){right1(Math.max(2,(ans_x - my_x)/move_speed));} }
        console.log(move_speed);

        anim_id = requestAnimationFrame(repeat);
    }
    function isok(){
        var my_top = parseInt(car.css('top'))-car_height*2 - Math.min(speed,130);
        var tops = new Number(3);
        tops[0]=parseInt(car_1.css('top'));
        tops[1]=parseInt(car_2.css('top'));
        tops[2]=parseInt(car_3.css('top'));
        var minTop = Math.max(tops[0],tops[1],tops[2]);
        if(minTop >= my_top) return 0;
        return Math.max(1,Math.round((my_top-minTop)/speed));
    }
    function find_x(my_x){
        p=0;
        var w = car_width;
        var arr = new Array(5)
        arr[0] = -w;
        arr[1] = parseInt(car_1.css('left'));
        arr[2] = parseInt(car_2.css('left'));
        arr[3] = parseInt(car_3.css('left'));
        arr[4] = container_width;
        arr.sort(function(a,b){return a-b});
        var ans = 10240;
        for(var i=0;i<4;i++){
            if(arr[i+1]-arr[i]-w>15+w){
                var a = (arr[i]+w+arr[i+1])/2;
                if(Math.abs(my_x - a)<Math.abs(my_x - ans)) ans = a;
            }
        }
        return ans>10000?my_x:ans-car_width/2;
    }

    function car_down(car) {
        var car_current_top = parseInt(car.css('top'));
        if (car_current_top > container_height) {
            
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
            p+=1;
        }
        car.css('top', car_current_top + speed);
    }

    function line_down(line) {
        var line_current_top = parseInt(line.css('top'));
        if (line_current_top > container_height) {
            line_current_top = -300;
        }
        line.css('top', line_current_top + line_speed);
    }

    restart_btn.click(function() {
        location.reload();
    });

    function stop_the_game() {
        game_over = true;
        cancelAnimationFrame(anim_id);
        cancelAnimationFrame(move_right);
        cancelAnimationFrame(move_left);
        cancelAnimationFrame(move_up);
        cancelAnimationFrame(move_down);
        restart_div.slideDown();
        restart_btn.focus();
        setHighScore();
    }

    function setHighScore() {
        if (high_score < parseInt(score.text())) {
            high_score = parseInt(score.text());
            localStorage.setItem('high_score', parseInt(score.text()));
        }
        $('#high_score').text(high_score);
    }

    /* ------------------------------GAME CODE ENDS HERE------------------------------------------- */

    function get_my_x($div1){
        return $div1.offset().left;
    }
    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;

        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }



});
