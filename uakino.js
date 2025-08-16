(function(){
    'use strict';

    var plugin_name = 'Uakino';

    function startPlugin(){
        console.log('✅ Плагін ' + plugin_name + ' успішно підключений до Lampa!');

        Lampa.Listener.send('app', {
            type: 'plugin',
            action: 'start',
            name: plugin_name
        });

        // Додаємо тестове джерело
        Lampa.Api.add(plugin_name, {
            search: function(query, call){
                call([
                    {
                        title: "Тестовий фільм з " + plugin_name,
                        url: "https://example.com/video.mp4",
                        poster: "https://via.placeholder.com/300x450.png?text=Uakino+Test",
                        type: "movie",
                        plugin: plugin_name
                    }
                ]);
            },
            play: function(item, call){
                call({
                    file: item.url
                });
            }
        });
    }

    if(window.appready) startPlugin();
    else Lampa.Listener.follow('app', function(e){
        if(e.type === 'ready') startPlugin();
    });

})();
