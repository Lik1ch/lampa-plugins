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

            // Assuming results are in div.shortstory (common for DLE sites)
            $('div.shortstory').each(function () {
                var elem = $(this);
                var link = elem.find('a.short-poster');
                var title = link.text().trim();
                var url = link.attr('href');
                var poster = elem.find('img').attr('src');

                if (title && url) {
                    cards.push({
                        title: title,
                        original_title: title, // Can add logic for original title if needed
                        release_year: elem.find('.short-year').text() || '', // Adjust selector if needed
                        poster: poster ? this.url + poster : '', // Ensure full URL
                        url: url.startsWith('http') ? url : this.url + url
                    });
                }
            });

            return cards;
        },

        // Function to parse movie details and get stream (iframe)
        detail: function (html) {
            var $ = Lampa.$(html);
            // Find the iframe in the player section
            var iframe = $('div.player-box iframe').attr('src') || $('iframe.player-iframe').attr('src');

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
    var current_balancers = Lampa.Storage.get('online_balancer') || ['collaps', 'alloha', 'videocdn']; // Default balancers
    if (current_balancers.indexOf(balancer) === -1) {
        current_balancers.unshift(balancer);
        Lampa.Storage.set('online_balancer', current_balancers);
    }

    console.log('Uakino plugin loaded');

})();
