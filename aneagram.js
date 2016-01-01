"use strict";
$(function () {
    var wordObjects = Object.create(null);

    var createWordObj = function (strWord) {
        return {
            //quick sort is twice as fast for small collections
            key: quickSort(strWord.replace(/\W/g, '').split("")).join(),
            word: strWord
        }
    };

    function compile(lines) {
        for (let word of lines) {
            var c = createWordObj(word);
            if (wordObjects[c.key]) {
                wordObjects[c.key].push(c.word);
            } else {
                wordObjects[c.key] = [c.word]
            }
        }
    }

    function printResults() {
        var strResult = '';
        for (let key in wordObjects) {
            if (wordObjects[key].length > 1) {
                for(let word of wordObjects[key]) {
                    strResult += word + ', ';
                }
                strResult += '\n';
            }
        }
        $("#results").text(strResult);
    }

    function printTimes() {
        window.performance.measure('open file', 'domComplete', 'mark_files_opened')
        window.performance.measure('split file', 'mark_files_opened', 'mark_files_split')
        window.performance.measure('creating objects', 'mark_files_split', 'mark_indexed')
        window.performance.measure('printing out results', 'mark_indexed', 'mark_printed')
        var items = window.performance.getEntriesByType('measure');

        for (let i of items) {
            $("#times").append('<tr><td>' + i.name + '</td><td>' + i.duration + 'ms</td></tr>');
        }
    }

    $.get("./wordlist.txt", function (data) {
        window.performance.mark('mark_files_opened');
        var lines = data.split('\n');

        window.performance.mark('mark_files_split');
        compile(lines);
        window.performance.mark('mark_indexed');
        printResults();
        window.performance.mark('mark_printed');
        printTimes();

        $("#times").append('<tr><td>items:</td><td>' + lines.length + '</td></tr>');
    });
});
