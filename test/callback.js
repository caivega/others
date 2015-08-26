//return new (Function.prototype.bind.apply(cls, [null].concat(Array.prototype.slice.call(arguments))));

var fs = require('fs');
var path = require('path');

function call(item){
    if(item && item.cb){
        item.cb.apply(item.self || item, item.ps);
    }
}

function callWithError(item){
    if(item && item.ps && item.ps.length > 0){
        var err = item.ps[0];
        if(err){
            console.log(err);
        }else{
            call(item);
        }
    }
}

function read(file){
    call({
        ps:[file],
        cb:function(file){
            fs.readFile(file, function(err, content){
                if(err){
                    console.log(err);
                }else{
                    call({
                        ps:[err, file, content],
                        cb:function(err, file, content){
                            call({
                                ps:[file, content],
                                cb:function(file, content){
                                    console.log(file);
                                    console.log(content.toString());
                                }
                            })
                        }
                    });
                }
            });
        }
    });
}

function travel(dir, callback){
    fs.readdir(dir, function(err, filelist){
        callWithError({
            ps:[err, dir, filelist],
            cb:function(err, dir, filelist){
                for(var i = 0; i < filelist.length; i ++){
                    var file = filelist[i];
                    call({
                        ps:[dir, file],
                        cb:function(dir, file){
                            var filepath = path.join(dir, file);
                            fs.stat(filepath, function(err, stats){
                                callWithError({
                                    ps:[err, stats],
                                    cb:function(err, stats){
                                        if(stats.isFile()){
                                            callback(filepath);
                                        }else if(stats.isDirectory()){
                                            travel(filepath, callback);
                                        }
                                    }
                                })
                            });
                        }
                    })
                }
            }
        });
    });
}

travel('/Javelin/temp', function(filepath){
    read(filepath);
});