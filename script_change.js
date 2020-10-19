/* Arshad Muhammed */
$(function () {

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
	
	// 新增
	var target = 0;

    /* ------------------------------GAME CODE STARTS HERE------------------------------------------- */

    /* Move the cars */
    $(document).on('keydown', function (e) {
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

    $(document).on('keyup', function (e) {
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

	// 修改原来的left()和right()
	function new_left() {
		var mycar = parseInt(car.css('left'));
		if (mycar <= target){
			console.log('to left:'+target);
            car.css('left', target);
			cancelAnimationFrame(move_left);
			move_left = false;
		}else if (game_over === false && mycar > 0) {
            car.css('left', parseInt(car.css('left')) - 5);
            move_left = requestAnimationFrame(new_left);
        }
    }
    function new_right() {
		var mycar = parseInt(car.css('left'));
		if (mycar >= target){
			console.log('to right:'+target);
            car.css('left', target);
			cancelAnimationFrame(move_left);
			move_left = false;
		}else if (game_over === false && parseInt(car.css('left')) < container_width - car_width) {
            car.css('left', parseInt(car.css('left')) + 5);
            move_right = requestAnimationFrame(new_right);
        }
    }
	
    /* Move the cars and lines */
    anim_id = requestAnimationFrame(repeat);

    function repeat() {
        if (game_over === false) {
            if (collision(car, car_1) || collision(car, car_2) || collision(car, car_3)) {
                stop_the_game();
				console.log(car_1.css('left')+','+car_2.css('left')+','+car_3.css('left')+','+car.css('left')+' to '+target);
				alert(target);
            }
            
            score_counter++;
            
            if(score_counter % 20 == 0){
                score.text(parseInt(score.text()) + 1);
            }
            if(score_counter % 500 == 0){
            	speed++;
            	line_speed++;
            }
            
            car_down(car_1);   
            car_down(car_2);
            car_down(car_3);
            
            line_down(line_1);
            line_down(line_2);
            line_down(line_3);
			
			move_mycar();	// 小车移动

            anim_id = requestAnimationFrame(repeat);
        }
    }
    
    function car_down(car){
        var car_current_top = parseInt(car.css('top'));
        if(car_current_top > container_height){
            car_current_top = -200;
            var car_left = parseInt(Math.random() * (container_width - car_width));
            car.css('left', car_left);
        }
        car.css('top', car_current_top + speed);
    }
    
    function line_down(line){
        var line_current_top = parseInt(line.css('top'));
        if(line_current_top > container_height){
            line_current_top = -300;    
        }
        line.css('top', line_current_top + line_speed);
    }
	
	// 当前轮次是否已移动
	var moved = 0;
	function move_mycar(){
		// 获取自己小车的横坐标
		var mycar_left = parseInt(car.css('left'));
		// 获取所有小车的纵坐标
		var mycar_top = parseInt(car.css('top'));
		var car1_top = parseInt(car_1.css('top'));
		var car2_top = parseInt(car_2.css('top'));
		var car3_top = parseInt(car_3.css('top'));
		
		mycar_y1 = mycar_top - car_height;
		mycar_y2 = mycar_top + car_height;
		// 可以移动
		if( (moved==0 && mycar_y1>car1_top && (mycar_y2<car3_top || car1_top>car3_top)) ||
			(moved==1 && mycar_y1>car1_top && car1_top>car2_top && (mycar_y2<car3_top || car1_top>car3_top)) ||
			(moved==2 && mycar_y1>car1_top && car1_top>car3_top) ){
			target = get_aim();	// 获取目标移动位置
			// 向目标位置移动
			if(target < mycar_left){
				new_left();
			}else if(target > mycar_left){
				new_right();
			}
			moved += 1;
		}
		if(moved==3 && car3_top > car1_top){
			moved = 0;
		}
		
	}
	
	function get_aim(){
		var my_x = parseInt(car.css('left'));
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
            if(arr[i+1]-arr[i]-w>15+w){	// 将空间根据三辆小车划分为四份，判断每块空间是否能容纳一辆小车
                var a = (arr[i]+w+arr[i+1])/2;
                if(Math.abs(my_x - a)<Math.abs(my_x - ans)) ans = a;	// 找出距当前位置最近的可容纳小车的位置
            }
        }
        return ans>10000?my_x:ans-car_width/2;
	}

    restart_btn.click(function () {
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
    }
    
    /* ------------------------------GAME CODE ENDS HERE------------------------------------------- */


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
