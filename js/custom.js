// вывод по дням
// учет проездов
// учет выходных



$(function(){
	var bgPlan = {};
	
	bgPlan.DOM = {
		input: '.bg-plan__input',
		days: '.bg-plan__days',
		output: '.bg-plan__output',
		date: {
			current: '.bg-plan-date__current'
		}
	};

	bgPlan.params = {
		days: getDays(),
		sum: 35000,
		add: 9500
	}

	bgPlan.firstStart = function(){
		$(bgPlan.DOM.days).attr('placeholder', bgPlan.params.days);
	}

	bgPlan.error = function(msg){
		alert(msg);
		return false;
	}

	bgPlan.setDate = function(){
		var date = new Date();
		$(bgPlan.DOM.date.current).text(date.toLocaleString());
	}

	bgPlan.calc = function(sum, days){
		return (sum / days).toFixed(2);
	}

	bgPlan.events = function(){
		$(bgPlan.DOM.input).keyup(function(){
			bgPlan.params.sum = $(this).val();
			bgPlan.render();
		});
		$(bgPlan.DOM.days).keyup(function(){
			bgPlan.params.days = $(this).val();
			bgPlan.render();
		});
	}

	bgPlan.render = function(){
		if(!bgPlan.params.days) bgPlan.error('Введите дни');
		$(bgPlan.DOM.output).text(bgPlan.calc(bgPlan.params.sum, bgPlan.params.days));
	}

	bgPlan.init = function(){
		bgPlan.firstStart();
		bgPlan.events();
		bgPlan.setDate();
	}

	bgPlan.init();

});

function getDays(){
	var date = new Date();
	var monthDays = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	var currentDay = date.getDate();
	return monthDays - (currentDay - 1);
}