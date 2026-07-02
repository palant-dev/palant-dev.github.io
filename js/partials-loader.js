(function () {
    "use strict";

    function loadPartial(targetId, url, onLoaded) {
        var el = document.getElementById(targetId);
        if (!el) return;

        fetch(url)
            .then(function (r) {
                if (!r.ok) throw new Error('[partials-loader] Could not load ' + url + ' (' + r.status + ')');
                return r.text();
            })
            .then(function (html) {
                el.innerHTML = html;

                // Re-apply the header background image that main.js sets on DOM ready
                var headerImg = document.querySelector('.header-wrap > img');
                if (headerImg) {
                    document.querySelector('.header').style.backgroundImage = 'url(' + headerImg.src + ')';
                }

                if (typeof onLoaded === 'function') onLoaded(el);
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    // Simple list renderer — used in the sidebar Recent Posts widget
    function loadRecentPosts(listId, dataUrl) {
        var list = document.getElementById(listId);
        if (!list) return;

        fetch(dataUrl)
            .then(function (r) {
                if (!r.ok) throw new Error('[partials-loader] Could not load ' + dataUrl + ' (' + r.status + ')');
                return r.json();
            })
            .then(function (posts) {
                var recent = posts
                    .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
                    .slice(0, 3);

                list.innerHTML = recent
                    .map(function (post) {
                        return '<li><a href="' + post.url + '">' + post.title + '</a></li>';
                    })
                    .join('');
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    // Card grid renderer — used in the "More Articles" section at the bottom of article pages.
    // Pass data-current on the container element to exclude the current article from the list.
    function loadRecentPostsCards(containerId, dataUrl) {
        var container = document.getElementById(containerId);
        if (!container) return;

        var currentUrl = container.getAttribute('data-current') || '';

        fetch(dataUrl)
            .then(function (r) {
                if (!r.ok) throw new Error('[partials-loader] Could not load ' + dataUrl + ' (' + r.status + ')');
                return r.json();
            })
            .then(function (posts) {
                var cards = posts
                    .filter(function (post) { return post.url !== currentUrl; })
                    .sort(function (a, b) { return new Date(b.date) - new Date(a.date); })
                    .slice(0, 3);

                if (cards.length === 0) {
                    container.closest('.more-articles').style.display = 'none';
                    return;
                }

                container.innerHTML = cards.map(function (post) {
                    var img = post.image
                        ? '<img src="' + post.image + '" alt="' + post.title + '">'
                        : '';
                    var cat = post.category
                        ? '<span class="cat-links"><a href="#" rel="category tag">' + post.category + '</a></span>'
                        : '';
                    return '<article class="media-cell">' +
                        '<div class="media-box">' + img + '<div class="mask"></div><a href="' + post.url + '"></a></div>' +
                        '<header class="media-cell-desc">' + cat + '<h3><a href="' + post.url + '">' + post.title + '</a></h3></header>' +
                        '</article>';
                }).join('');
            })
            .catch(function (err) {
                console.error(err);
            });
    }

    window.loadPartial = loadPartial;
    window.loadRecentPosts = loadRecentPosts;
    window.loadRecentPostsCards = loadRecentPostsCards;
})();
