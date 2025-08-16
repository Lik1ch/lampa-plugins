// Plugin for Lampa to add Uakino.club as an online source

(function () {
    'use strict';

    // Define the balancer name
    var balancer = 'uakino';

    // Register the new online parser
    Lampa.Online.register(balancer, {
        // Base URL of the site
        url: 'https://uakino.club',

        // Function to generate search URL
        search: function (params) {
            // Use GET for search as it works
            return this.url + '/index.php?do=search&subaction=search&story=' + encodeURIComponent(params.query);
        },

        // Function to parse search results HTML and return cards
        card: function (html) {
            var cards = [];
            var $ = Lampa.$(html);

            // Use selectors from the test script
            $('.all_entry').each(function () {
                var elem = $(this);
                var title = elem.find('.all_entry_c .title').text().trim();
                var url = elem.find('a').attr('href');
                var poster = elem.find('img').attr('src');
                var descr = elem.find('.all_entry_c .text').text().trim();

                var year = '';
                // Try to extract year from descr if possible
                var yearMatch = descr.match(/Рік виходу:\s*(\d{4})/);
                if (yearMatch) year = yearMatch[1];

                if (title && url) {
                    if (poster && !poster.startsWith('http')) {
                        poster = this.url + poster;
                    }
                    if (url && !url.startsWith('http')) {
                        url = this.url + url;
                    }
                    cards.push({
                        title: title,
                        original_title: title,
                        release_year: year,
                        poster: poster || '',
                        url: url
                    });
                }
            });

            return cards;
        },

        // Function to parse movie details and get stream (iframe)
        detail: function (html) {
            var $ = Lampa.$(html);
            // Try various selectors for the iframe
            var iframe = $('div.player-box iframe').attr('src') ||
                         $('iframe.player-iframe').attr('src') ||
                         $('div#player iframe').attr('src') ||
                         $('div.player iframe').attr('src') ||
                         $('div.full-video iframe').attr('src') ||
                         $('iframe').attr('src') || // Fallback to any iframe
                         $('div[data-player-url]').attr('data-player-url'); // If data attribute

            if (iframe && !iframe.startsWith('http')) {
                iframe = 'https:' + iframe;
            }

            // Assuming single stream
            return {
                file: iframe ? [{ quality: 'HD', url: iframe }] : []
            };
        }
    });

    // Add the balancer to the list of available online sources
    var current_balancers = Lampa.Storage.get('online_balancers', ['collaps', 'alloha', 'videocdn']);
    if (current_balancers.indexOf(balancer) === -1) {
        current_balancers.unshift(balancer);
        Lampa.Storage.set('online_balancers', current_balancers);
    }

    console.log('Uakino plugin loaded');

})();
