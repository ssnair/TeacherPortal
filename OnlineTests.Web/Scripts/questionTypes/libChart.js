function getVScaleFactor(height, gutter, max){
		return (height - (2 * gutter))/max;
}

function setBackgroundColor(x, y, width, height, background_color,r){
			var radius = 10;
			var background = r.rect(x, y, width, height);
			background.attr ("stroke-width", "0");
			background.attr ("fill", background_color);    		
}
	
function getVScaleFactor(height, gutter, max){
	return (height - (2 * gutter))/max;
}
	
function setVValuesAxis(x, y, min, max, width, height, bars, gutter, grid_lines_color,
		use_background_color, background_color, label_background_color, label_text_color,
		show_scale, show_axis, show_gridlines, scale_intervals, show_groups_labels, show_groups_background, symbols, rtl,
		symbol_position,r){

	var valuesInterval = max / getCalculatedInterval(min, max, scale_intervals);  

	
	var bar_width = getVBarWidth(width, bars, gutter),
		bars_space = getVBarSpace(bar_width, gutter),
		font_size = 12;
	//set axis positions
	var y_pos_ini = getVYPosIni(y, height, gutter, max);    	
	var y_pos_zero = getVYPosZero(y_pos_ini, height, gutter, max);
	var y_pos_negative = getVYPosNegative(y_pos_zero, height, gutter, max, min);
	var x_pos_ini = getVXPosIni(x, bars_space);
	var x_pos_fin = getVXPosFin(x_pos_ini, width);
	//set background color
	if(use_background_color){
		var background_height = (min < 0 ? (max + Math.abs(min)) : max) * getVScaleFactor(height, gutter, max);
		setBackgroundColor(x_pos_ini, y_pos_ini, width, background_height, background_color,r);
	}
	//setting the scale values

	var interval_pos = (y_pos_zero - y_pos_ini)/(max/valuesInterval);
	var y_value_pos = (min < 0 ? y_pos_negative - 1 : y_pos_zero - 1);
	var x_value_pos, gridline, text_start_point, text, symbol;
	
	
	
	for(var i=(min < 0 ? min : 0); i<=max; i+=valuesInterval) {		
		x_value_pos = x_pos_ini - 5;
		if(show_scale){
			if(Object.prototype.toString.call(symbols[0]) === '[object Array]'){
				symbol = symbols[0][0];
			} else {
				symbol = symbols[0];
			}
			if(symbol_position == 'prefix'){
				text = (symbol.length > 0 ? symbol + ' ' : '') + addCommasToNumber((Math.round(i * 10) / 10).toString());
			} else {
				text = addCommasToNumber((Math.round(i * 10) / 10).toString()) + (symbol.length > 0 ? ' ' + symbol : '');
			}
			text_start_point = rtl && (BrowserDetect.browser == 'Chrome' || BrowserDetect.browser == 'Opera') ? 'start' : 'end';
			r.text(x_value_pos, y_value_pos, text)
			.attr('font-size', font_size.toString())
			.attr('text-anchor', text_start_point);
		}
		if(show_gridlines){
			gridline = r.path("M" + x_pos_ini.toString() + "," + (y_value_pos + 1).toString() + "L"+ (x_pos_fin).toString() + "," + (y_value_pos + 1).toString());
			gridline.attr("stroke", grid_lines_color);    			
		}
		y_value_pos -= interval_pos;
	}
	//drawing the axis
	if(show_axis){
		r.path("M" + x_pos_ini.toString() + "," + (y_pos_ini).toString() + "L" + x_pos_ini.toString() + "," + (min < 0 ? y_pos_negative : y_pos_zero).toString()); //y axis
		r.path("M" + x_pos_ini.toString() + "," + (y_pos_zero).toString() + "L"+ (x_pos_fin).toString() + "," + (y_pos_zero).toString()); //x axis    		
	}

}

function getVBarWidth(width, bars, gutter){
	return 100 * (width / (bars * (100 + gutter) + gutter));
}

function getVBarSpace(bar_width, gutter){
	return bar_width * gutter / 100;
}

function getVYPosIni(y, height, gutter, max){
	return y + height - gutter - (max * getVScaleFactor(height, gutter, max));
}

function getVYPosZero(y_pos_ini, height, gutter, max){
	return y_pos_ini + (max * getVScaleFactor(height, gutter, max));
}

function getVYPosBaseline(y_pos_zero, height, gutter, max, value){
	return y_pos_zero - (value * getVScaleFactor(height, gutter, max));
}

function getVYPosNegative(y_pos_zero, height, gutter, max, min){
	return y_pos_zero + Math.abs(min * getVScaleFactor(height, gutter, max));
}

function getVXPosIni(x, bars_space){
	return x + bars_space;
}

function getVXPosFin(x_pos_ini, width){
	return x_pos_ini + width;
}

function getCalculatedInterval(min, max, scale_intervals){
	if(!scale_intervals || scale_intervals < 1){
		scale_intervals = 10;
	}
	var interval = scale_intervals;
	if(min < 0){
		for(var i=1; i<=max; i++) {
			if(max%i == 0){
				interval = i;
				if(i >= scale_intervals){
					break;
				}
			}
		}    		
	}
	return interval;
}	

function addCommasToNumber(number) {
	var parts = number.toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");
}
