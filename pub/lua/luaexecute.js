/*
 Lua Executor
  Copyright (c) 2014 Felipe Daragon
  
 Base64 Decode function
  Copyright (c) 2013 Kevin van Zonneveld (http://kvz.io) 
  and Contributors (http://phpjs.org/authors)
 
 License: MIT
 
 This script finds a DIV element (or any number of DIV elements) that contain
 a luacode attribute, gets its value, which must be a Lua script in the form
 of a base64-encoded string, and executes it using the Lua VM. The innerHTML
 of each DIV element is updated with the output of the Lua script.
 If you want to allow the Lua script to call JavaScript and don't want its
 output to be HTML escaped, call LuaExecutor.enableSafeMode(false) before
 executing the Lua script.
 
*/
var Module = 
{
    print : function (x) 
    {
        if (LuaExecutor.settings.escapeOutput == true) {
            x = LuaExecutor.escapeHTML(x);
        }
        LuaExecutor.outputElement.innerHTML = (LuaExecutor.outputElement.innerHTML ? LuaExecutor.outputElement.innerHTML + '<br>' : '') + x;
    }
};
var LuaExecutor = 
{
    outputElement : undefined, scriptAttr : 'luacode', settings : {
        disableJS : true, escapeOutput : true 
    },
    run : function (initscript) 
    {
        var l = document.getElementsByTagName('div');
        if (initscript != '') {
            initscript = LuaExecutor.base64Decode(initscript);
        }
        for (var i = 0; i < l.length; i++) 
        {
            if (l[i].hasAttribute(LuaExecutor.scriptAttr) == true) 
            {
                LuaExecutor.outputElement = l[i];
                var luacode = l[i].getAttribute(LuaExecutor.scriptAttr);
                luacode = LuaExecutor.base64Decode(luacode);
                if (LuaExecutor.settings.disableJS == true) {
                    luacode = 'js = {} ' + initscript + ' ' + luacode;
                }
                Lua.execute(luacode);
            }
        }
    },
    enableSafeMode : function (b) 
    {
        LuaExecutor.settings.escapeOutput = b;
        LuaExecutor.settings.disableJS = b;
    },
    escapeHTML : function (text) 
    {
        return text .replace(/&/g, "&amp;") .replace(/</g, "&lt;") .replace(/>/g, "&gt;") .replace(/"/g, 
        "&quot;") .replace(/'/g, "&#039;");
    },
    base64Decode : function (data) 
    {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = '', tmp_arr = [];
        if (!data) {
            return data;
        }
        data += '';
        do 
        {
            // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(data.charAt(i++));
            h2 = b64.indexOf(data.charAt(i++));
            h3 = b64.indexOf(data.charAt(i++));
            h4 = b64.indexOf(data.charAt(i++));
            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;
            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            }
            else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            }
            else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        }
        while (i < data.length);
        dec = tmp_arr.join('');
        return dec;
    }
}
