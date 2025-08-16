(function(){
    'use strict';

    var plugin_name = 'Uakino-Test';

    function startPlugin(){
        console.log('✅ Плагін ' + plugin_name + ' підключено');

        // Реєструємо фейковий пошук
        Lampa.Api.add(plugin_name, {
            search: function(query, call){
                let results = [
                    {
                        title: "Тестовий фільм (" + plugin_name + ")",
                        url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
                        poster: "https://via.placeholder.com/300x450.png?text=Uakino+Test",
                        type: "movie",
                        plugin: plugin_name
                    }
                ];
                call(results);
            },
            play: function(item, call){
                call({
                    file: item.url
                });
            }
        });

        Lampa.Listener.send('app', {
            type: 'plugin',
            action: 'start',
            name: plugin_name
        });
    }

    if(window.appready) startPlugin();
    else Lampa.Listener.follow('app', function(e){
        if(e.type === 'ready') startPlugin();
    });

})();
