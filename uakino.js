(function(){
    'use strict';

    // назва джерела
    var plugin_name = 'Uakino';

    function startPlugin(){
        Lampa.Api.add(plugin_name, {
            // пошук фільмів
            search: function(query, call){
                fetch('https://uakino.club/index.php?do=search&subaction=search&story=' + encodeURIComponent(query))
                    .then(r => r.text())
                    .then(html => {
                        let dom = new DOMParser().parseFromString(html, 'text/html');
                        let items = [];

                        dom.querySelectorAll('.th-item').forEach(el => {
                            let title = el.querySelector('.th-title a')?.innerText.trim();
                            let link  = el.querySelector('.th-title a')?.href;
                            let img   = el.querySelector('img')?.src;

                            items.push({
                                title: title,
                                url: link,
                                poster: img,
                                type: 'movie',
                                plugin: plugin_name
                            });
                        });

                        call(items);
                    })
                    .catch(e => {
                        console.log('Uakino error', e);
                        call([]);
                    });
            },

            // відкриття посилання (отримання відео)
            play: function(item, call){
                fetch(item.url)
                    .then(r => r.text())
                    .then(html => {
                        let dom = new DOMParser().parseFromString(html, 'text/html');
                        // приклад: знаходимо iframe з відео
                        let iframe = dom.querySelector('iframe')?.src;

                        call({
                            file: iframe
                        });
                    })
                    .catch(e => {
                        console.log('Uakino play error', e);
                        call(false);
                    });
            }
        });

        Lampa.Listener.send('app', {type:'plugin', action:'start', name: plugin_name});
    }

    if(window.appready) startPlugin();
    else Lampa.Listener.follow('app', function(e){ if(e.type === 'ready') startPlugin(); });

})();
