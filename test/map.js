function _array(){
    var list = {
        '__internal':true,
        list:[]
    };
    list.__proto__ = R2;
    return list;
}

function _internal(obj){
    return(obj && obj['__internal']);
}

function _parent(obj){
    return obj['__parent'];
}

function _exists(list){
    if(list == null){
        return false;
    }else{
        if(_internal(list)){
            if(list.list && list.list.length > 0){
                return true;
            }
        }
    }
    return false;
}

var OBJECT_OBJECT = '[object Object]',
    OBJECT_ARRAY = '[object Array]',
    OBJECT_NUMBER = '[object Number]',
    OBJECT_STRING = '[object String]';

var R0 = {
    _isFunction: function (obj) {
        return !!(obj && obj.constructor && obj.call && obj.apply);
    },

    _isObject: function (obj) {
        return Object.prototype.toString.call(obj) == OBJECT_OBJECT;
    },

    _isArray: function (obj) {
        return Object.prototype.toString.call(obj) == OBJECT_ARRAY;
    },

    _isNumber: function (obj) {
        return Object.prototype.toString.call(obj) == OBJECT_NUMBER;
    },

    _isString: function (obj) {
        return Object.prototype.toString.call(obj) == OBJECT_STRING;
    }
};

var R1 = {
    map:function(){
        var  m = {};
        m['__parent'] = this;
        m['__proto__'] = R1;
        return m;
    },
    parent:function(){
        return _parent(this);
    }
};

function _id(obj){
    if(obj != null){
        if(R0._isString(obj)){
            return obj;
        }else{
            if(obj['__id'] != null){
                return obj['__id'];
            }else if(obj['__name'] != null){
                return obj['__name'];
            }else{
                return obj.toString();
            }
        }
    }else{
        return '';
    }
}

function _object(map, key){
    var obj = null;
    var parent = null;
    var currentMap = map;
    while((obj = currentMap[key]) == null && (parent = _parent(currentMap)) != null){
        currentMap = parent;
    }
    return obj;
}

var R2 = {
    __:function(f, argus){
        var list = _array();
        if(_internal(this)){
            var m = {};
            for(var i = 0; i < this.list.length; i ++){
                var item = this.list[i];
                var ret = f.apply(item, argus);
                for(var j = 0; j < ret.length; j ++){
                    var r = ret[j];
                    var id = _id(r);
                    if(m[id] == null){
                        m[id] = true;
                        list.list.push(r);
                    }
                }
            }
        }else{
            list.list = list.list.concat(f.apply(this, argus));
        }
        return list;
    },
    __search:function(id, list, ret){
        if(id == null){
            for(i = 0; i < list.length; i ++){
                ret.push(node(this.map, list[i]));
            }
        }else{
            for(i = 0; i < list.length; i ++){
                var n = node(this.map, list[i]);
                if(_id(n) == id || (n.group != null && _id(n.group) == id)){
                    ret.push(n);
                }
            }
        }
        return ret;
    },
    _all:function(id){
        var ret = [];
        this.__search(id, this.os, ret);
        this.__search(id, this.is, ret);
        return ret;
    },
    all:function(id){
        return this.__(this._all, [id]);
    },
    _out:function(id){
        var ret = [];
        this.__search(id, this.os, ret);
        return ret;
        return ret;
    },
    out:function(id){
        return this.__(this._out, [id]);
    },
    _in:function(id){
        var ret = [];
        this.__search(id, this.is, ret);
        return ret;
    },
    in:function(id){
        return this.__(this._in, [id]);
    },
    _filter:function(id){
        var ret = [];
        this.__search(id, [this], ret);
        return ret;
    },
    filter:function(id){
        return this.__(this._filter, [id]);
    },
    unique:function(){
        if(_internal(this)){
            if(this.list.length == 1){
                return this.list[0]
            }
        }
        return this;
    },
    _common:function(obj){
        var list = [];

        var node1 = node(this.map, this);
        var node2 = node(this.map, obj);
        if(node1 && node2){
            var om1 = node1.om;
            var im1 = node1.im;

            var om2 = node2.om;
            var im2 = node2.im;
            for(var k in om1){
                if(om1[k] != null && (om2[k] != null || im2[k] != null)){
                    list.push(node(this.map, k));
                }
            }
            for(var k in im1){
                if(im1[k] != null && (om2[k] != null || im2[k] != null)){
                    list.push(node(this.map, k));
                }
            }
        }
        return list;
    },
    common:function(obj){
        return this.__(this._common, [obj]);
    },
    group:function(){
        var id = _id(this);
        var length = this.os.length;
        var nid = (id + "." + length);
        var g = node(this.map, nid);
        link(this.map, this, g);
        g.group = this;
        return g;
    },
    value:function(){
        if(_internal(this)){
            return null;
        }else{
            return _id(this);
        }
    },
    list:function(){
        if(_internal(this)){
            return this.list;
        }else{
            return [];
        }
    }
};

function node(map, obj){
    var id = _id(obj);
    var n = _object(map, id);
    if(n == null){
        n = {__id:id, is:[], im:{}, os:[], om:{}, map:map};
        n.__proto__ = R2;
        map[id] = n;
    }
    return n;
}

function link(map, obj1, obj2){
    var f = node(map, obj1);
    var t = node(map, obj2);

    var fid = _id(f);
    var tid = _id(t);

    var k = fid + '_' + tid;
    var l = _object(map, k);
    if(l == null){
        l = {__id:k, f: fid, t: tid, is:[], im:{}, os:[], om:{}, map:map};
        l.__proto__ = R2;
        f.os.push(tid);
        f.om[tid] = true;
        t.is.push(fid);
        t.im[fid] = true;
        map[k] = l;
    }
    return l;
}

function csv2map(map, csvfile, callback){
    var fs=require('fs');
    var CSVStream = require('csv-streamer');

    var csv = new CSVStream({headers:true,delimiter:'\t'});
    var no = 0;
    var last = null;
    csv.on('end', function(){
        callback && callback(map);
    });
    csv.on('data',function(line){
        var order = node(map, no).group();
        if(last != null){
            link(map, last, order);
        }
        json2map(map, line, order);
        no ++;
        last = order;

        //console.log(line);
    });

    fs.createReadStream(csvfile,{
        encoding:'utf8'
    }).pipe(csv);
}

function json2map(map, obj, order){
    if(R0._isObject(obj)){
        var ks = [];
        var vs = [];
        for(var k in obj){
            var v = obj[k];
            if(k != null){
                ks.push(k);
                if(v != null){
                    vs.push(v);
                    //link(map, obj, k);
                    //link(map, obj, v);
                    link(map, k, v);
                    json2map(map, v);
                }
            }
        }
        if(ks.length > 1){
            for(var i = 1; i < ks.length; i ++){
                link(map, ks[i - 1], ks[i]);
            }
        }
        if(vs.length > 1){
            for(var i = 1; i < vs.length; i ++){
                link(map, vs[i - 1], vs[i]);
            }
            if(order != null){
                var data = node(map, 'data').group();
                link(map, order, data);
                for(var i = 0; i < vs.length; i ++){
                    link(map, data, vs[i]);
                }
            }
        }
    }

    return map;
}

var allmap = {};
for(var i = 0; i < 10; i ++){
    for(var j = i; j < 10; j ++){
        var plus = node(allmap, '+').group();
        var plusn1 = node(allmap, '加数').group();
        var plusn2 = node(allmap, '被加数').group();
        var presult = node(allmap, '结果').group();
        link(allmap, i, plusn1);
        link(allmap, j, plusn2);
        link(allmap, i, plus);
        link(allmap, j, plus);
        link(allmap, (i + j), presult);
        link(allmap, (i + j), plus);

        var mul = node(allmap, '*').group();
        var muln1 = node(allmap, '乘数').group();
        var muln2 = node(allmap, '被乘数').group();
        var mresult = node(allmap, '结果').group();
        link(allmap, i, muln1);
        link(allmap, j, muln2);
        link(allmap, i, mul);
        link(allmap, j, mul);
        link(allmap, (i * j), mresult);
        link(allmap, (i * j), mul);
    }
}

//var list = node(allmap, '3').common(node(allmap, '9'));
//console.log(list);

function readFile(filepath){
    var fs=require('fs');
    var content = fs.readFileSync(String(filepath));
    return content;
}

//function getGeoNumber(string){
//    if(string.match(/(.*)[NSWE]/)){
//        var list = string.split(/[°′″'"]/);
//        if(list && list.length > 1){
//            var r = 1.0;
//            var unit = list.pop();
//            var sum = 0.0;
//            for(var i = 0; i < list.length; i ++){
//                var num = Number(list[i]);
//                sum += num/r;
//                r = r * 60.0;
//            }
//            if(unit == 'S' || unit == 'W'){
//                return -Number(sum.toFixed(6));
//            }else{
//                return Number(sum.toFixed(6));
//            }
//        }else{
//            return null;
//        }
//    }else{
//        return null;
//    }
//
//}

//function getLongitude(string){
//    return getGeoNumber(string);
//}
//
//function getLatitude(string){
//    return getGeoNumber(string);
//}

//function main(datamap){
//    var capital = node(datamap, 'Capital');
//    var lat = node(datamap, 'Latitude');
//    var lng = node(datamap, 'Longitude');
//    var cn_long = node(datamap, '国家全称');
//    var cn_short = node(datamap, '国家简称');
//    var en_long = node(datamap, '英文全称');
//    var en_short = node(datamap, '英文简称');
//    var en_sj = node(datamap, '英文简写');
//    var en_ss = node(datamap, '英文缩写');
//
//    var geo = JSON.parse(readFile('data/world.geo.json'));
//    for(var i = 0; i < geo.features.length; i ++){
//        var feature = geo.features[i];
//        var name = feature.properties.name;
//        var country = node(datamap, name);
//        var data = country.in('data').unique();
//
//        var cp = data.common(capital).unique().value();
//        var lg = data.common(lng).unique().value();
//        var lt = data.common(lat).unique().value();
//        var cnl = data.common(cn_long).unique().value();
//        var cns = data.common(cn_short).unique().value();
//        var enl = data.common(en_long).unique().value();
//        var ens = data.common(en_short).unique().value();
//        var ensj = data.common(en_sj).unique().value();
//        var enss = data.common(en_ss).unique().value();
//        if(cp == null || lg == null || lt == null){
//            if(enl != null){
//                country = node(datamap, enl);
//                data = country.in('data').unique();
//
//                cp = data.common(capital).unique().value();
//                lg = data.common(lng).unique().value();
//                lt = data.common(lat).unique().value();
//            }
//            if(cp == null || lg == null || lt == null) {
//                if(ens != null){
//                    country = node(datamap, ens);
//                    data = country.in('data').unique();
//
//                    cp = data.common(capital).unique().value();
//                    lg = data.common(lng).unique().value();
//                    lt = data.common(lat).unique().value();
//                }
//                if(cp == null || lg == null || lt == null){
//                    console.error(i, name, cp, lg, lt, cnl, cns, enl, ens, ensj, enss);
//                }
//            }
//        }
//
//        //console.log([lg, lt]);
//        feature.properties.cp = [getLongitude(lg), getLatitude(lt)];
//        if(enss != null){
//            feature.sid = enss;
//        }
//        //console.log(feature.properties.cp);
//        //console.log(i, name, cp, lg, lt, cnl, cns, enl, ens, ensj, enss);
//    }
//
//    console.log(JSON.stringify(geo));
//}
//var datamap = R1.map();
//csv2map(datamap, 'data/geo.csv', function(datamap){
//    //var newmap = datamap.map();
//    csv2map(datamap, 'data/国家缩写代码.csv', function(mainmap){
//        main(mainmap);
//    });
//});

//var chinaObj = {name:'rect1', "x":114.45304107666016,"y":191.13400268554688,"width":997.303955078125,"height":824.7150268554688};
//var chinaMap = {};
//var china = json(chinaMap, chinaObj);
//
//var cnObj = {name:'rect2', "x":796.2393188476562,"y":475.9200134277344,"width":171.6407470703125,"height":126.05999755859375};
//var cnMap = {};
//var cn = json(cnMap, cnObj);

//console.log(cn);