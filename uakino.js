(function() {
    'use strict';

    var network = new Lampa.Reguest();

    function uakino(query, callback) {
        var url = 'https://uakino.club/index.php?do=search&subaction=search&story=' + encodeURIComponent(query);

        network.clear();
        network.native(url, function(html) {
            var results = [];
            var dom = $(html);

            dom.find('.all_entry').each(function() {
                var item = {};
                item.title = $(this).find('.all_entry_c .title').text().trim();
                item.url   = $(this).find('a').attr('href');
                item.poster= $(this).find('img').attr('src');
                item.descr = $(this).find('.all_entry_c .text').text().trim();
                results.push(item);
            });

            callback(results);
        }, function(a, c) {
            callback([]);
        });
    }

    Lampa.Component.add('uakino', {
        name: 'Uakino',
        type: 'search',
        onSearch: function(query, call) {
            uakino(query, function(results) {
                call(results);
            });
        }
    });

})();
