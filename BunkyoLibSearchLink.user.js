// ==UserScript==
// @name        Bunkyo lib search link
// @namespace   http://inasphere.net/
// @description 文京区立図書館サイトに検索リンクを付加する
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.0.2/jquery.min.js
// @include     http://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWNEWBOOK.CSP*
// @include     https://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWNEWBOOK.CSP*
// @include     http://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWSRCHLIST.CSP*
// @include     https://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWSRCHLIST.CSP*
// @include     http://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWSRCHTYPE.CSP*
// @include     https://www.lib.city.bunkyo.tokyo.jp/opw/OPW/OPWSRCHTYPE.CSP*
// ==/UserScript==

(function($) {

    var AMAZON = 'http://www.amazon.co.jp/s/ref=nb_sb_noss?url=search-alias%3Dstripbooks&field-keywords=';
    var GOOGLE = 'http://www.google.co.jp/search?hl=ja&q=';

    // 新着
    if (location.pathname.indexOf('OPWNEWBOOK') > -1) {
        $('th:contains("受入日")').parents('table').find('tr[class!="basemark"]').each(function() {
            var book = $(this).find('td:eq(1)').find('a').text();
            $(this).find('td:eq(1)').prepend(makeLink(book));
        });
    // 検索結果
    } else if (location.pathname.indexOf('OPWSRCHLIST') > -1) {
        $('th:contains("蔵書区分")').parents('table').find('tr[class!="basemark"]').each(function() {
            var book = $(this).find('td:eq(2)').find('a').text();
            $(this).find('td:eq(2)').prepend(makeLink(book));
        });
    // 詳細
    } else if (location.pathname.indexOf('OPWSRCHTYPE') > -1) {

        // 非ログイン
        if (location.search.indexOf('OPWUSERINFO') === -1) {
            var book = $('td:contains("タイトル"):eq(1)').next().find('a').text();
            $('td:contains("タイトル"):eq(1)').next().prepend(makeLink(book));
        // ログイン
        } else {
            var book = $('td:contains("タイトル"):eq(1)').next().text();
            // タイトルと読み仮名（半角カナ）が混在しているのでタイトル部分だけ切り出す
            var halfWidthKanaIndex = null;
            for (i = 0; i < book.length; i++) {
                if(book.charCodeAt(i) >= 0xff61 && book.charCodeAt(i) <= 0xffa0) {
                    halfWidthKanaIndex = i;
                    break;
                }
            }
            if (halfWidthKanaIndex !== null) {
                book = book.substring(0, halfWidthKanaIndex);
            }

            $('td:contains("タイトル"):eq(1)').next().prepend(makeLink(book));
        }
    }

    function makeLink(book) {
        var encodedBook = encodeURIComponent(book);
        return '<a href="' + AMAZON + encodedBook + '" target="_blank">【a】</a> <a href="' + GOOGLE + encodedBook + '" target="_blank">【g】</a>';
    }
})(jQuery);