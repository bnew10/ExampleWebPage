function addRows(driveList) {
    driveList.forEach(function(elem, idx, arr) {
        var row = document.getElementById("driveTable").insertRow();
        row.setAttribute("id", elem[0].toLowerCase())
        
        for (var i = 0; i < elem.length; i++) {
            var tdCell = row.insertCell(-1);
            tdCell.innerHTML = elem[i];
        }
    })
}

function addDrivePaths(pathList) {
    var keys = Object.keys(pathList);
        
    var table = document.getElementById('driveTable');
    keys.forEach(function(elem, idx, arr) {
        var row = table.rows.namedItem(elem);
        
        var tdCell = row.insertCell(-1);
        tdCell.innerHTML = pathList[elem];
        
    })
}

function parsePage(url, cb) {
    var req = new XMLHttpRequest();  
    req.onreadystatechange = function(e) {
        if (e.target.readyState == 4 && e.target.status == 200) {
            cb(JSON.parse(e.target.responseText));
        }
    }
    req.open('GET', url);   
    req.send(null);   
}

function grabData(objs) {
    var list = [];
    sortByKey(objs, "mount");
    objs.forEach(function (elem, idx, arr) {
                    list.push([elem.mount.charAt(elem["mount"].length-1),
                               bToTb(elem.usage.total), 
                               bToTb(elem.usage.free), 
                               bToTb(elem.usage.used),
                               roundToHun(elem.usage.used/elem.usage.total)]);
                 });
    return list;
}

function grabDrivePaths(objs) {
    return objs["list"];
}

function refresh() {
    window.location.reload();
}

function bToTb(num) {
    var newNum = num/Math.pow(10, 12);
    
    return roundToHun(newNum);
}

function roundToHun(num) {
    return Math.round(num*100)/100;
}

function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}


parsePage('http://loras.ow:8080/', function(data){
    addRows(grabData(data));
    parsePage('http://data.ow:4500/drives.json', function(data){
       addDrivePaths(grabDrivePaths(data)); 
    });    
});


