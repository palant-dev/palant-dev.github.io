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

    var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    function formatDate(isoDate) {
        var parts = isoDate.split('-');
        var year = parts[0], month = parseInt(parts[1], 10) - 1, day = parseInt(parts[2], 10);
        return MONTH_NAMES[month] + ' ' + day + ', ' + year;
    }

    // Full post list renderer — used on the main Blog page
    function loadPostList(containerId, dataUrl) {
        var container = document.getElementById(containerId);
        if (!container) return;

        fetch(dataUrl)
            .then(function (r) {
                if (!r.ok) throw new Error('[partials-loader] Could not load ' + dataUrl + ' (' + r.status + ')');
                return r.json();
            })
            .then(function (posts) {
                var sorted = posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });

                container.innerHTML = sorted.map(function (post) {
                    var cat = post.category
                        ? '<span class="cat-links"><a href="#" title="View all posts in ' + post.category + '" rel="category tag">' + post.category + '</a></span>'
                        : '';
                    var img = post.image
                        ? '<div class="featured-image"><a href="' + post.url + '"><img src="' + post.image + '" alt="' + post.title + '"></a></div>'
                        : '';
                    var excerpt = post.excerpt ? '<p>' + post.excerpt + '</p>' : '';

                    return '<article class="hentry post">' +
                        '<header class="entry-header">' +
                        '<h2 class="entry-title"><a href="' + post.url + '">' + post.title + '</a></h2>' +
                        '<div class="entry-meta">' +
                        '<span class="entry-date"><time class="entry-date" datetime="' + post.date + '">' + formatDate(post.date) + '</time></span>' +
                        cat +
                        '</div>' +
                        '</header>' +
                        img +
                        '<div class="entry-content excerpt">' +
                        excerpt +
                        '<p class="more"><a href="' + post.url + '" class="more-link">Read More</a></p>' +
                        '</div>' +
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
    window.loadPostList = loadPostList;
})();
