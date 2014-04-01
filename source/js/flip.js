(function($) {
    'use strict';

    var DIR = [[-1,0,1,0],[0,1,0,-1]];

    var getPosition = function(cell) {
        return cell.currentTarget.id.substring(4).split("-");
    }

    var getCell = function(posx, posy) {
        if(posy == null && typeof(posx)==typeof([1,2])) {
            return $('#cell'+posx[0]+'-'+posx[1]).get(0);
        }
        return $('#cell'+posx+'-'+posy).get(0);
    }

    var toggleColor = function(cell) {
        if(cell.style.backgroundColor == 'grey') {
            cell.style.backgroundColor = 'white';
        } else {
            cell.style.backgroundColor = 'grey';
        }
    }

    var flip = function(cell) {
        var pos = getPosition(cell);
        var row = pos[0];
        var col = pos[1];
        toggleColor(cell.currentTarget);
        for(var i=0; i<4; i++) {
            var nrow = parseInt(row)+DIR[0][i];
            var ncol = parseInt(col)+DIR[1][i];
            var ncell = getCell(nrow, ncol);
            if(ncell==null) continue;
            toggleColor(ncell);
        }
    }

    var startGame = function(o) {
        var col = $('#col').val();
        var row = $('#row').val();
        $('#col,#row,#start').remove();
        var $gameArea = $('#gameArea');
        var $table = $('<table>', {id:'gameBoard'});
        for(var i=0; i<row; i++) {
            var $thisrow = $('<tr>', {id:'row'+i});
            $table.append($thisrow);
            for(var j=0; j<col; j++) {
                var $thiscell = $('<td>', {id:'cell'+i+'-'+j, class:'gameCell'});
                $thiscell.click(flip);
                $thisrow.append($thiscell);
            }
        }
        $gameArea.html($table);
    }

    $('#start').bind('click', startGame);
})(jQuery);
