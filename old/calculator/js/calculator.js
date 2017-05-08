"use strict";

function preset(e){
	var v1 = 0;
	var v2 = 0;
	
	if (e == '+') {
			v1 = 2;
			v2 = 2;
		}
		else if (e == '-'){
			v1 = 3;
			v2 = 2;
		}
		else if (e == '*'){
			v1 = 3;
			v2 = 2;
		}
		else if (e == '/'){
			v1 = 8;
			v2 = 4;
		}
		else if (e == '^'){
			v1 = 2;
			v2 = 8;
		}
		else if (e == '№'){
			v1 = 8;
			v2 = 3;
		}
		else if (e == '%'){
			v1 = 7;
			v2 = 3;
		}
		else if (e == '_'){
			v1 = 13;
			v2 = 2;
		}
		else if (e == '__'){
			v1 = "A10";
			v2 = 16;
		}
		else if (e == '#'){
			v1 = "alert('HELLO, WORLD!')"
			$("input[name=second]").prop('disabled', true);
		}
	if(e != '#'){
		$("input[name=second]").prop('disabled', false);
	}
	if($("input[name=autopreset]").prop("checked")){
		$("input[name=first]").val(v1);
		$("input[name=second]").val(v2);
	}
}
$(document).ready(function() { // Ждём загрузки страницы	   
	preset($("select[name=action]").val());
	$("input[name=send]").click( function () { // Событие нажатия на кнопку "Расчёт"
		var action = $("select[name=action]").val(); // Получаем значение действия, которое нужно выполнить
		var first = $("input[name=first]").val(); // Переменная первого числа
		var second = $("input[name=second]").val() * 1; // Переменная второго числа
		var result; // Переменная результата
		if (action == '+') { // Если действие - сложение
			result = first * 1 + second; //  складываем
		}
		else if (action == '-'){ // Если действие вычитание
			result = first * 1 - second; // вычитаем
		}
		else if (action == '*'){ // Если действие умножение
			result = first * 1 * second; // умножаем
		}
		else if (action == '/'){ // Если действие деления
			result = first * 1 / second; // делим
		}
		else if (action == '^'){ // Если действие степени
			result = Math.pow(first * 1, second); // возводим
		}
		else if (action == '№'){ // Если действие степени
			result = Math.pow(first * 1, 1/second); // возводим
		}
		else if (action == '%'){ // Если действие остатка
			result = first * 1 % second; // делим, берём остаток
		}
		else if (action == '_'){
			if(second<=16 && second>=0){
				var xr = [];
				for(i=first * 1; i>=1; i=Math.round(i/second-0.5)){
					var xx = String(i % second);
					xx = xx.replace("10", "A");
					xx = xx.replace("11", "B");
					xx = xx.replace("12", "C");
					xx = xx.replace("13", "D");
					xx = xx.replace("14", "E");
					xx = xx.replace("15", "F");
					xr.unshift(xx);
				}
				result = xr.join("");
			}else{
				result = NaN;
			}
		}
		else if (action == '__'){
			if(second<=16 && second>=0){
				var x = 0;
				var y = String(first).toUpperCase().split("");
				for(i=0;i<y.length;i++){
					if(second>=11){ y[i]=y[i].replace("A", "10"); }
					if(second>=12){ y[i]=y[i].replace("B", "11"); }
					if(second>=13){ y[i]=y[i].replace("C", "12"); }
					if(second>=14){ y[i]=y[i].replace("D", "13"); }
					if(second>=15){ y[i]=y[i].replace("E", "14"); }
					if(second>=16){ y[i]=y[i].replace("F", "15"); }
					y[i]=y[i] * 1;
				}
				console.log(y);
				for(i=y.length-1; i>=0; i--){
					x=x+y[(y.length-i-1)]*Math.pow(second, i);
				}
				result=x;
			}else{
				result = NaN;
			}
		}
		else if(action == '#'){
			try{
				eval(first);
				result = 1;
			}
			catch(err){
				result = 0;
				throw(err)
			}
		}
		if (String(result) == "NaN"){
			result = "Error";
		}
		res.textContent = result; // записываем результат
	});
});