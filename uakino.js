// Plugin for Lampa to add Uakino.club as an online source

(function () {
    'use strict';

    // Define the balancer name
    var balancer = 'uakino';

    // Register the new online parser
    Lampa.Online.register(balancer, {
        // Base URL of the site
        url: 'https://uakino.best',

        // Function to generate search URL
        search: function (params) {
            // Use GET for search as it works
            return this.url + '/index.php?do=search&subaction=search&story=' + encodeURIComponent(params.query);
        },

        // Function to parse search results HTML and return cards
        card: function (html) {
            var cards = [];
            var $ = Lampa.$(html);

            // Updated selector based on typical structure
            $('div.movie-item').each(function () {
                var elem = $(this);
                var link = elem.find('h3 a');
                var title = link.text().trim();
                var url = link.attr('href');
                var poster = elem.find('img').attr('src');

                var year = '';
                var metadata = elem.find('.metadata').text();
                if (metadata) {
                    var match = metadata.match(/Рік виходу: (\d+)/);
                    if (match) year = match[1];
                }

                if (title && url) {
                    if (poster && !poster.startsWith('http')) {
                        poster = this.url + poster;
                    }
                    if (url && !url.startsWith('http')) {
                        url = this.url + url;
                    }
                    cards.push({
                        title: title,
                        original_title: title, // Can add logic for original title if needed
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
            // Try multiple possible selectors for the iframe
            var iframe = $('div.player-box iframe').attr('src') ||
                         $('iframe.player-iframe').attr('src') ||
                         $('div#player iframe').attr('src') ||
                         $('div.player iframe').attr('src') ||
                         $('div.full-video iframe').attr('src') ||
                         $('iframe').first().attr('src'); // Fallback to first iframe

            if (iframe && iframe.indexOf('http') === -1) {
                iframe = 'https:' + iframe;
            }

            // Assuming single stream; can extend for qualities or episodes
            return {
                file: iframe ? [{ quality: 'HD', url: iframe }] : []
            };
        }
    });

    // Add the balancer to the list of available online sources
    var current_balancers = Lampa.Storage.get('online_balancer') || ['collaps', 'alloha', 'videocdn']; // Reverted to singular key
    if (current_balancers.indexOf(balancer) === -1) {
        current_balancers.unshift(balancer);
        Lampa.Storage.set('online_balancer', current_balancers);
    }

    console.log('Uakino plugin loaded');

})();
