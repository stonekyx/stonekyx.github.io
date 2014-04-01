(function($) {
    var CellView = Backbone.View.extend({
        tagName: 'td',
        className: 'gameCell',
        initialize: function(options) {
            _.bindAll(this, 'toggleColor', 'render', 'cellInRow', 'cellInCol');
            this.options = options;
        },
        render: function() {
            this.$el.on('click', this.toggleColor);
            this.el.id = 'cell'+this.options.row+'-'+this.options.col;
            return this;
        },
        toggleColor: function(e) {
            var col = this.options.col;
            var row = this.options.row;
            [this, this.cellInRow(row+1), this.cellInRow(row-1), this.cellInCol(col+1), this.cellInCol(col-1)].forEach(function(elt, i) {
                if(elt) {
                    if(elt.$el.hasClass("filled")) {
                        elt.$el.removeClass("filled");
                    } else {
                        elt.$el.addClass("filled");
                    }
                }
            });
        },
        cellInRow: function(rowIdx) {
            if(typeof rowIdx === typeof 0) {
                var row = this.options.rowView.rowAt(rowIdx);
                if(row) {
                    return row.cellAt(this.options.col);
                }
            }
            return null;
        },
        cellInCol: function(colIdx) {
            if(typeof colIdx === typeof 0) {
                return this.options.rowView.cellAt(colIdx);
            }
            return null;
        }
    });
    var RowView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function(options) {
            _.bindAll(this, 'render', 'cellAt', 'rowAt');
            this.options = options;
        },
        render: function() {
            this.$el.html('');
            this.cellList = [];
            for(var i=0; i<this.options.cellCount; i++) {
                var cellView = new CellView({row:this.options.row, col:i, rowView: this});
                this.cellList.push(cellView);
                this.$el.append(cellView.render().el);
            }
            return this;
        },
        cellAt: function(idx) {
            if(typeof idx === typeof 0) {
                return this.cellList[idx];
            }
            return null;
        },
        rowAt: function(idx) {
            if(typeof idx === typeof 0) {
                return this.options.boardView.rowAt(idx);
            }
            return null;
        }
    });
    var BoardView = Backbone.View.extend({
        tagName: 'table',
        initialize: function(options) {
            _.bindAll(this, 'render', 'rowAt');
            this.options = options;
        },
        render: function() {
            this.$el.html('');
            this.rowList = [];
            for(var i=0; i<this.options.row; i++) {
                var rowView = new RowView({row:i, cellCount:this.options.col, boardView:this});
                this.rowList.push(rowView);
                this.$el.append(rowView.render().el);
            }
            return this;
        },
        rowAt: function(idx) {
            if(typeof idx === typeof 0) {
                return this.rowList[idx];
            }
            return null;
        }
    });
    var AppView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click button#start': 'startGame'
        },
        initialize: function() {
            _.bindAll(this, 'startGame');
        },
        startGame: function() {
            var row = document.getElementById('row').value;
            var col = document.getElementById('col').value;
            $('#gameArea').html(new BoardView({row:row, col:col}).render().el);
        }
    });
    var appView = new AppView();
})(jQuery);
