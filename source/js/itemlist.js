(function($) {
    'use strict';
    var Item = Backbone.Model.extend({
        initialize: function() {
            this.view = new ItemView(this);
        },
    });
    var ItemView = Backbone.View.extend({
        tagName: 'div',
        initialize: function(model) {
            _.bindAll(this, 'render');
            this.model = model;
        },
        render: function() {
            $(this.el).html(this.model.get('name'));
            return this;
        },
    });
    var List = Backbone.Collection.extend({
        model: Item,
        initialize: function(options) {
            this.bind('add', options.view.addFriend);
        },
    });
    var ListView = Backbone.View.extend({
        el: $('body'),
        events: {
            'click button#add_friend': 'promptFriend'
        },
        initialize: function() {
            _.bindAll(this, 'promptFriend', 'addFriend');
            this.collection = new List({view:this});
        },
        promptFriend: function() {
            var name = prompt('What\' the name of your friend?');
            if(!name || name.length==0) {
                return;
            }
            this.collection.add(new Item({name:name}));
        },
        addFriend: function(model) {
            $('div#friend_list').append(model.view.render().el);
        },
    });
    var listView = new ListView();
})(jQuery);
