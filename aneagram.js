/**
 * Created by asuspc on 12/31/2015.
 */


"use strict";

(function () {

    var wordObjects = [];
    var primeList = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47,
        53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127,
        131, 137, 139, 149, 151, 157, 163,167, 173, 179, 181, 191, 193, 197,
        199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277,
        281, 283, 293, 307, 311, 313, 317, 331, 337, 347]

    var makeHash = function (wordObject) {
        var hash =0,n = 0;
        for (let letter in wordObject) {
            n++;
            hash += letter.charCodeAt(0) * primeList[n++];
            hash += wordObject[letter] * primeList[n++];
        }
        return hash;
    };

    var compare = function (a, b) {
        return (JSON.stringify(a) === JSON.stringify(b));
    };

    var search = function (word) {
        var compareObj = createWordObj(word);
        var equalHashes = wordObjects.filter(g => g.hash === compareObj.hash);
        var anagrams = equalHashes.filter(a => compare(a.code, compareObj.code));
        var notSame = anagrams.filter(a => a.word !== word);
        return notSame.map(d => d.word);
    };

    var createWordObj = function (strWord) {

        var ret = {};

        for (let mixedCaseletter of strWord.replace(/\W/g, '').split("").sort())
        {
            var letter = mixedCaseletter.toLowerCase();

            if (ret[letter]) {
                ret[letter] = ret[letter] += 1;
            }
            else {
                ret[letter] = 1;
            }
        }

        return {
            code: ret,
            word: strWord,
            hash: makeHash(ret)
        }
    };

    var addResult = function (word, anneagram) {
        var newDiv = document.createElement("div");


        var text = word + ': ';
        for(let item of anneagram) {
            text += ','+item;
        }
        var newContent = document.createTextNode(text);
        newDiv.appendChild(newContent); //add the text node to the newly created div.

        // add the newly created element and its content into the DOM
        var currentDiv = document.getElementById("div1");
        document.body.insertBefore(newDiv, currentDiv);

    };


    //fetch text file
    $.get("./wordlist.txt", function (data) {

    //$.get("./testdic.txt", function (data) {

    //split on new lines

        var lines1 = data.split('\n');
        var lines = lines1.slice(0,4050);

        wordObjects = lines.map(createWordObj);


        for (let obj of wordObjects) {
            var word = obj.word;
            var anneagrams = search(obj.word);
            if(anneagrams.length > 0) {
                addResult(word, anneagrams);
            }
        }
    });

}());
