var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
if (window.document) {
    try {
        window.document.createElement("DIV").style.setProperty("opacity", "0", "");
    }
    catch (error) {
        var prototype = Element.prototype, setAttribute = prototype.setAttribute, setAttributeNS = prototype.setAttributeNS, styleprototype = CSSStyleDeclaration.prototype, setProperty = prototype["setProperty"];
        prototype.setAttribute = function (name, value) {
            setAttribute.call(this, name, value + "");
        };
        prototype.setAttributeNS = function (space, local, value) {
            setAttributeNS.call(this, space, local, value + "");
        };
        styleprototype.setProperty = function (name, value, priority) {
            styleprototype["call"](this, name, value + "", priority);
        };
    }
    Date.prototype["format"] = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds() //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
}
String.prototype["lTrim"] = function (r) { if (r) {
    this.replace();
} return this.replace(/(^\s*)/g, ""); };
//祛除右空格
String.prototype["rTrim"] = function (r) { if (r) {
    this.replace();
} return this.replace(/(\s*$)/g, ""); };
//祛除左右空格
String.prototype["Trim"] = function (r) { if (r) {
    this.replace();
} return this.replace(/(\s*$)|(^\s*)/g, ""); };
var div = document.createElement("div"), dcurSty = div["currentStyle"] || window.getComputedStyle(div, null), dsty = div.style;
var surport = { opacity: dcurSty.opacity || dsty.opacity ? true : false };
var temp_vendorSymbol = ["webkit", "ms", "moz", "Moz", "o", "O"];
function temp_vendorSymbolFunc(object, name) {
    if (name in object)
        return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = temp_vendorSymbol.length; i < n; ++i) {
        var prefixName = temp_vendorSymbol[i] + name;
        if (prefixName in object)
            return prefixName;
    }
}
var fcamelCase = function (all, letter) {
    return (letter + "").toUpperCase();
};
var Ns = {
    CSS: null,
    ns: {
        nsPrefix: {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/"
        },
        qualify: function (name) {
            var i = name.indexOf(":"), prefix = name;
            if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns")
                name = name.slice(i + 1);
            return this.nsPrefix.hasOwnProperty(prefix) ? {
                space: this.nsPrefix[prefix],
                local: name
            } : name;
        },
        attr: function (name, value) {
            name = Ns.ns.qualify(name);
            function attrNull() {
                this.removeAttribute(name);
            }
            function attrNullNS() {
                this.removeAttributeNS(name.space, name.local);
            }
            function attrConstant() {
                this.setAttribute(name, value);
            }
            function attrConstantNS() {
                this.setAttributeNS(name.space, name.local, value);
            }
            function attrFunction() {
                var x = value.apply(this, arguments);
                if (x == null)
                    this.removeAttribute(name);
                else
                    this.setAttribute(name, x);
            }
            function attrFunctionNS() {
                var x = value.apply(this, arguments);
                if (x == null)
                    this.removeAttributeNS(name.space, name.local);
                else
                    this.setAttributeNS(name.space, name.local, x);
            }
            return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
        },
    }
};
Ns.CSS = {
    getUnitType: function (property) {
        if (/^(rotate|skew)/i.test(property)) {
            return "deg";
        }
        else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
            return "";
        }
        else {
            return "px";
        }
    },
    getUnitFormatType: function (property) {
        if (/^(rotate|skew)/i.test(property)) {
            return property + "({0}deg)";
        }
        else if (/(^(alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
            return "{0}";
        }
        else if (/^(scale|scaleX|scaleY|scaleZ)/.test(property)) {
            return property + "({0})";
        }
        else {
            return "{0}px";
        }
    },
    getDisplayType: function (element) {
        var tagName = element && element.tagName.toString().toLowerCase();
        if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
            return "inline";
        }
        else if (/^(li)$/i.test(tagName)) {
            return "list-item";
        }
        else if (/^(tr)$/i.test(tagName)) {
            return "table-row";
        }
        else if (/^(table)$/i.test(tagName)) {
            return "table";
        }
        else if (/^(tbody)$/i.test(tagName)) {
            return "table-row-group";
        }
        else {
            return "block";
        }
    },
    parseProperty: function (property) {
        var s = property.split("-"), i = 0, l = s.length, p = "";
        for (; i < l; i++) {
            if (i == 0) {
                p = s[i].toLowerCase();
            }
            else {
                p += s[i].charAt(0).toUpperCase() + s[i].slice(1);
            }
        }
        return p;
    },
    extractValue: function (value, property) {
        return parseFloat(value);
    },
    getHeightWidth: function (dom, prop) {
        var v = "", p;
        if ((v = dom.css(prop)) == "auto" && (v = dom.css("max-" + prop)
            , v != "auto" ? dom.property("_animation_toggle_fix", (p = {} || dom.property("_animation_toggle_fix"))["max-" + prop] = v != "auto" ? v : "") : "") == "auto") {
            this.getHeightWidth(dom.parent(), prop);
        }
        else {
            return v;
        }
    }
};
var ns = (function () {
    function ns() {
        this.selected = [];
        this._cache = {};
    }
    ns.dateDiff = function (d1, d2, format) {
        d1 = new Date(d1);
        d2 = new Date(d2);
        var diff = Math.abs(d1.getTime() - d2.getTime());
        if (format == "object") {
            var rt = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0, ms: 0 };
            rt.year = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
            diff = diff - (1000 * 60 * 60 * 24 * 365 * rt.year);
            rt.month = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
            diff = diff - (1000 * 60 * 60 * 24 * 30 * rt.month);
            rt.day = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff = diff - (1000 * 60 * 60 * 24 * rt.day);
            rt.hour = Math.floor(diff / (1000 * 60 * 60));
            diff = diff - (1000 * 60 * 60 * rt.hour);
            rt.minute = Math.floor(diff / (1000 * 60));
            diff = diff - (1000 * 60 * rt.minute);
            rt.second = Math.floor(diff / (1000));
            diff = diff - 1000 * rt.second;
            rt.ms = diff;
            return rt;
        }
        else if (format == "day") {
            var rt1 = { day: 0, hour: 0, minute: 0, second: 0, ms: 0 };
            rt1.day = Math.floor(diff / (1000 * 60 * 60 * 24));
            diff = diff - (1000 * 60 * 60 * 24 * rt1.day);
            rt1.hour = Math.floor(diff / (1000 * 60 * 60));
            diff = diff - (1000 * 60 * 60 * rt1.hour);
            rt1.minute = Math.floor(diff / (1000 * 60));
            diff = diff - (1000 * 60 * rt1.minute);
            rt1.second = Math.floor(diff / (1000));
            diff = diff - 1000 * rt1.second;
            rt1.ms = diff;
            return rt1;
        }
        else {
            return diff;
        }
    };
    ns.fixNumberString = function (num, count) {
        if (count > 0) {
            var length = num.toString().length;
            if (length >= count) {
                return num;
            }
            for (var i = 0; i < count - length; i++) {
                num = "0" + num;
            }
            return num;
        }
    };
    ns.loadJson = function (url, method, data, callback) {
        return ns.ajax.load(url, method, data, callback, "application/json");
    };
    ns.load = function (url, method, data, callback, mimeType) {
        if (mimeType === void 0) { mimeType = "text/html"; }
        return ns.ajax.load(url, method, data, callback, mimeType);
    };
    ns.post = function (url, data, callback) {
        return ns.ajax.load(url, "post", data, callback, "application/json");
    };
    ns.html = function (url, data, callback) {
        return ns.ajax.load(url, "get", data, callback, "text/html");
    };
    ns.querystring = function () {
        var qs = new ns.Map();
        var href = window.location.href;
        var indexofPos = href.lastIndexOf('?') + 1, indexofj = href.indexOf("#");
        if (indexofj < indexofPos) {
            href = href.substr(indexofPos);
        }
        else {
            href = href.substr(indexofPos, indexofj - indexofPos);
        }
        var hrefs = href.split('&');
        for (var i = 0; i < hrefs.length; i++) {
            if (hrefs[i]) {
                var kv = hrefs[i].split("=");
                qs.set(kv[0], kv[1]);
            }
        }
        return qs;
    };
    ns.queryParameters = function () {
        var qs = {};
        var href = window.location.href;
        var indexofPos = href.lastIndexOf('?') + 1, indexofj = href.indexOf("#");
        if (indexofj < indexofPos) {
            href = href.substr(indexofPos);
        }
        else {
            href = href.substr(indexofPos, indexofj - indexofPos);
        }
        var hrefs = href.split('&');
        for (var i = 0; i < hrefs.length; i++) {
            if (hrefs[i]) {
                var kv = hrefs[i].split("=");
                qs[kv[0]] = kv[1];
            }
        }
        return qs;
    };
    ns.require = function (val, exp, call) {
        if (!exp) {
            return true;
        }
        var rt = true;
        if (exp == "notnull") {
            rt = !!val;
        }
        else if (exp instanceof RegExp) {
            rt = exp.test(val);
        }
        else if (typeof exp === "function") {
            rt = exp.call(this, val);
        }
        else if (exp instanceof Array) {
            exp.forEach(function (d) {
                rt = ns.require(val, d);
                return !rt;
            });
        }
        else if (typeof exp === "object") {
            return val in exp;
        }
        if (!rt && call) {
            call.call(this, null);
        }
        return rt;
    };
    ns.gotoNs = function (gotoNs, curNs) {
        if (!gotoNs) {
            return curNs;
        }
        if (!curNs) {
            return curNs;
        }
        gotoNs.split(".").forEach(function (d) {
            if (curNs[d] != null && curNs[d] != undefined) {
                curNs = curNs[d];
            }
            else {
                curNs = undefined;
                return true;
            }
        });
        return curNs;
    };
    ns.guid = function (seqchar) {
        var s = [];
        seqchar = seqchar == null ? "-" : seqchar;
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23] = seqchar;
        var uuid = s.join("");
        return uuid;
    };
    ns.scrollTop = function () {
        var scrollPos;
        if (window.pageYOffset) {
            scrollPos = window.pageYOffset;
        }
        else if (document.compatMode && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        }
        else if (document.body) {
            scrollPos = document.body.scrollTop;
        }
        return scrollPos;
    };
    ns.scrollLeft = function () {
        var scrollPos;
        if (window.pageXOffset) {
            scrollPos = window.pageXOffset;
        }
        else if (document.compatMode && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollLeft;
        }
        else if (document.body) {
            scrollPos = document.body.scrollLeft;
        }
        return scrollPos;
    };
    ns.slice = function (list) {
        return [].slice.call(list);
    };
    ns.requote = function (s) {
        return s.replace(/[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g, "\\$&");
    };
    ns.dispatch = function () {
        var ar = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ar[_i - 0] = arguments[_i];
        }
        var disp = new ns.Dispatch(), i = -1, n = arguments.length;
        while (++i < n) {
            var evn = arguments[i];
            if (evn.indexOf(',') > 0) {
                evn.split(',').forEach(function (d) { disp[d] = ns["dispatch_event"](disp); });
            }
            else {
                disp[arguments[i]] = ns["dispatch_event"](disp);
            }
        }
        return disp;
    };
    ns.select = function (exp, context) {
        return new ns().select(exp, context);
    };
    ns.rebind = function (target, source, arg) {
        function rebind(target, source, method) {
            return function () {
                var value = method.apply(source, arguments);
                return value === source ? target : value;
            };
        }
        var i = 1, n = arguments.length, method;
        while (++i < n)
            target[method = arguments[i]] = rebind(target, source, source[method]);
        return target;
    };
    ns.Layer = function (conf) {
        if (!conf) {
            conf = { title: "Popup Layer 弹出框", iconClass: ".fa .fa-dialog", loading: false, left: "13.5%", top: "240px", height: "280px;", width: "60%", titleCss: "" };
        }
        conf.title = conf.title || "Popup Layer 弹出框";
        conf.left = conf.left || "13.5%";
        conf.top = conf.top || "240px";
        conf.height = conf.height || "280px;";
        conf.iconClass = conf.iconClass || ".fa .fa-dialog";
        conf.titleCss = conf.titleCss || " ";
        conf.width = conf.width || "60%";
        conf.loading = conf.loading == null || conf.loading == undefined ? false : conf.loading;
        conf.drag = conf.drag == null || conf.drag == undefined ? true : conf.drag;
        var landingObject = { landing: null };
        var lay = ns.tag.div(".pop-lay *display:none;float:left;width:" + conf.width + ";border-color:#e0e0e0;border-width:0.1px;position:fixed;left:" + conf.left + ";top:" + conf.top + ";min-height:280px;height:" + conf.height + ";border-style:solid;background-color:white;").css({ "box-shadow": "gray 0 0 30px;" })
            .div("*margin-bottom:1px;").landingline({ width: "13", height: "1", "margin-top": "35px;", hide: true }, landingObject).end()
            .div().end()
            .div(".info-bar *border-left-color:rgb(0,156,204);border-left-width:3px;border-left-style:solid;margin-left:0px;cursor:pointer;height:19px;")
            .div("*text-overflow:ellipsis;line-height:18px;font-size:12px;cursor:auto;margin-left:10px;float:left;pading-left:3px;color:#808080;" + conf.titleCss)
            .span(conf.iconClass + " *width:15px;height:15px;line-height:15px;").end().span("*height:15px;line-height:15px;margin-left:4px;")
            .if(conf.title instanceof Function, conf.title, function () {
            this.text(conf.title);
        }).end().end().div(".screen-close .fa .fa-close *float:right;margin-right:5px;cursor:pointer; .hover-color").event("click", function () {
            lay.ns().hide(400);
        }).end().div("*clear:both;").end().end()
            .div(".lay-content").if(!!conf.renderbody, conf.renderbody, function () { this.if(typeof (conf.renderbody) == "string", function () { this.attr({ text: conf.renderbody }); }); })
            .end()
            .end().render("body");
        lay.landingline = landingObject.landing;
        lay.remove = function () {
            lay.object.remove();
        };
        lay.object = lay.ns();
        if (!conf.loading) {
            lay.landingline.ns().hide();
        }
        if (conf.drag) {
            lay.drag(lay._ns, lay._ns.find(".info-bar"));
        }
        return lay;
    };
    ns.parseHtml = function (tag) {
        if (typeof tag !== "string") {
            return tag;
        }
        var obj = null;
        tag = tag.trim();
        if (/^\S*<tr/i.test(tag)) {
            obj = document.createElement("tbody");
            obj.innerHTML = tag;
        }
        else if (/^\S*<td/i.test(tag)) {
            obj = document.createElement("tr");
            obj.innerHTML = tag;
        }
        else if (/^\S*<li/i.test(tag)) {
            obj = document.createElement("ul");
            obj.innerHTML = tag;
        }
        else if (/^(altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color\-profile|cursor|definition\-src|defs|desc|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font|font\-face|font\-face\-format|font\-face\-name|font\-face\-src|font\-face\-uri|foreignObject|g|glyph|glyphRef|hkern|image|line|linearGradient|marker|mask|metadata|missing\-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|svg|switch|symbol|text|textPath|title|tref|tspan|use|view|vkern)/i.test(tag)) {
            var xmlnames = {
                ns: 'http://www.w3.org/2000/svg',
                xmlns: 'http://www.w3.org/2000/xmlns/',
                xlink: 'http://www.w3.org/1999/xlink'
            };
            var element = document.createElementNS(xmlnames.ns, tag);
        }
        else if (/^\S*</.test(tag)) {
            obj = document.createElement("div");
            obj.innerHTML = tag;
        }
        else {
            return document.createElement(tag);
        }
        return obj.children[0];
    };
    ns.selectionMatchs = function (n, s) {
        var obj = document.createElement("div"), selectMatcher = obj["matches"] || obj[temp_vendorSymbolFunc(obj, "matchesSelector")], selectMatches = function (n, s) {
            return selectMatcher.call(n, s);
        };
        return selectMatches(n, s);
    };
    ns.next = function (d) {
        var r = d, rs = [];
        if ((r = r.nextSibling) != null) {
            rs.push(r);
        }
        return rs;
    };
    ns.nexts = function (d) {
        var r = d, rs = [];
        while ((r = r.nextSibling) != null) {
            rs.push(r);
        }
        return rs;
    };
    ns.children = function (d) {
        var rs = [];
        var cs = d.childNodes;
        for (var i = 0; i < cs.length; i++) {
            rs.push(cs[i]);
        }
        return rs;
    };
    ns.prev = function (d) {
        var r = d, rs = [];
        if ((r = r.previousSibling) != null) {
            rs.push(r);
        }
        return rs;
    };
    ns.prevs = function (d) {
        var r = d, rs = [];
        if ((r = r.previousSibling) != null) {
            rs.push(r);
        }
        return rs;
    };
    ns.prototype.parseNodeList = function (nl) {
        for (var i = 0; i < nl.length; i++) {
            this.selected.push(nl[i]);
        }
    };
    ns.prototype.cache = function (key) {
        if (!key) {
            key = "temp";
        }
        this._cache[key] = this.selected;
        return this;
    };
    ns.prototype.revert = function (key) {
        if (!key) {
            key = "temp";
        }
        this.selected = this._cache[key];
        return;
    };
    ns.prototype.remove = function () {
        this.each(function () {
            this.parentNode ? this.parentNode.removeChild(this) : null;
        });
        return this;
    };
    ns.prototype.queriesSelection = function (exp, context) {
        if (!context || !context.querySelectorAll) {
            if (context instanceof ns) {
                var me = this;
                context.each(function () {
                    me.parseNodeList(this.querySelectorAll(exp));
                });
                return this;
            }
            this.parseNodeList(document.querySelectorAll(exp));
            return this;
        }
        this.parseNodeList(context.querySelectorAll(exp));
        return this;
    };
    ns.prototype.getBoundingHeight = function () {
        return this.getBoundingRect().height;
    };
    ns.prototype.getBoundingWidth = function () {
        return this.getBoundingRect().width;
    };
    ns.prototype.getBoundingRect = function () {
        return this.first().node().getBoundingClientRect() || { width: 0, top: 0, bottom: 0, height: 0, left: 0, right: 0 };
    };
    ns.prototype.render = function (tagr) {
        tagr.render(this, true);
        return this;
    };
    ns.prototype.select = function (exp, context) {
        this.selected = [];
        if (typeof exp === "string") {
            if (/^</.test(exp)) {
                return this.select(ns.parseHtml(exp));
            }
            else {
                return this.queriesSelection(exp, context);
            }
        }
        else if (exp instanceof ns) {
            this.selected = exp.selected;
            return this;
        }
        else if (exp.nodeType || exp == window) {
            this.selected.push(exp);
            return this;
        }
    };
    ns.prototype.find = function (exp) {
        if (typeof exp === "string") {
            if (/^</.test(exp)) {
                return ns.select(ns.parseHtml(exp));
            }
            else {
                return new ns().queriesSelection(exp, this);
            }
        }
        else if (exp instanceof ns) {
            return new ns().select(exp);
        }
        else if (exp.nodeType) {
            return new ns().select(exp);
        }
    };
    ns.prototype.each = function (fn, args) {
        this.selected.forEach(function (val, index, arry) {
            fn.apply(val, [val, index, arry].concat(args));
        });
        return this;
    };
    ns.prototype.eaching = function (fn, args) {
        var r = [];
        this.selected.forEach(function (val, index, arry) {
            var rs = fn.apply(this, [val, index, arry].concat(args));
            if (rs) {
                r.push(rs);
            }
        });
        return r;
    };
    ns.prototype.call = function (fn, pos, args) {
        if (pos != null && pos > 0) {
            return fn.call(this.at(pos), args);
        }
        else {
            return this.each(fn, args);
        }
    };
    ns.prototype.calling = function (fn, pos, args) {
        if (this.selected.length == 1) {
            pos = 0;
        }
        if (pos != null && pos > -1) {
            return fn.call(this.at(pos), args);
        }
        else {
            return this.eaching(fn, args);
        }
    };
    ns.prototype.parseHtml = function (tag) {
        this.selected = [];
        this.selected.push(ns.parseHtml(tag));
        return tag;
    };
    ns.prototype.on = function (evn, fn, args) {
        if (!evn) {
            return this;
        }
        return this.each(function () {
            try {
                this.addEventListener(evn, fn, false);
            }
            catch (e) {
                try {
                    this.attachEvent('on' + evn, fn);
                }
                catch (e) {
                    this['on' + evn] = fn;
                }
            }
        });
    };
    ns.prototype.off = function (evn, fn, args) {
        if (!evn) {
            return this;
        }
        return this.each(function () {
            try {
                this.removeEventListener(evn, fn, false);
            }
            catch (e) {
                try {
                    this.detachEvent('on' + evn, fn);
                }
                catch (e) {
                    delete this['on' + evn];
                }
            }
        });
    };
    ns.prototype.once = function (evn, fn, args) {
        if (!evn) {
            return this;
        }
        var self = this, tempFn = function () {
            fn.apply(this, ns.slice(arguments));
            self.off(evn, tempFn);
        };
        this.on(evn, tempFn);
        return this;
    };
    ns.prototype.trigger = function (evn) {
        if (!evn) {
            return this;
        }
        return this.each(function () {
            if (this.dispatchEvent && document.createEvent) {
                var e = document.createEvent("MouseEvents");
                e.initEvent(evn, true, true);
                this.dispatchEvent(e);
            }
            else if (document.all) {
                this[evn]();
            }
        });
    };
    ns.camelCase = function (string) {
        return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, fcamelCase);
    };
    ns.prototype.css = function (prop, value) {
        var cssProperty = function (prop, value) {
            var p = prop;
            if (prop === "float") {
                p = this.style.cssFloat ? "cssFloat" : "styleFloat";
            }
            if (prop === "opacity") {
                //"opacity:" + p + ";filter:alpha(opacity=" + p * 100 + ");";
                p = "opacity";
                cssProperty.call(this, "filter", "filter:alpha(opacity=" + parseFloat(value) * 100 + ")");
            }
            var curElSty = this.currentStyle || window.getComputedStyle(this, null), elSty = this.style;
            p = Ns.CSS.parseProperty(p);
            try {
                if (p in curElSty) {
                    try {
                        curElSty[p] = value;
                    }
                    catch (ex) { }
                }
                curElSty.setProperty(p, value);
            }
            catch (ex) {
                try {
                    if (p in elSty) {
                        try {
                            elSty[p] = value;
                        }
                        catch (ex) { }
                    }
                    elSty.setProperty(p, value);
                }
                catch (ex) {
                    try {
                        elSty.cssText += ";" + prop + ":" + value + ";";
                    }
                    catch (ex) {
                        console.log("don't allow to modify the css");
                    }
                }
            }
        }, cssgetProperty = function (prop) {
            var curElSty = this.currentStyle || window.getComputedStyle(this, null), elSty = this.style;
            if (prop === "float") {
                var p = this.style.cssFloat ? "cssFloat" : "styleFloat";
            }
            if (prop === "opacity") {
                return elSty.opacity ||
                    curElSty.opacity ||
                    (elSty.filters.alpha ? elSty.filters.alpha.opacity : 100) / 100;
            }
            return elSty[prop] || curElSty[prop];
        }, me = this;
        if (arguments.length === 1) {
            if (typeof prop === "string") {
                return cssgetProperty.call(this.node(), Ns.CSS.parseProperty(prop));
            }
            else {
                for (var p in prop)
                    this.each(function () { cssProperty.call(this, p, prop[p]); });
            }
        }
        else if (arguments.length === 2) {
            if (typeof prop === "string") {
                cssProperty.call(this.node(), prop, value);
            }
            else if (typeof value === "function") {
                for (var p in prop)
                    this.each(function () { value.call(this, [(p, prop[p])]); });
            }
        }
        return this;
    };
    ns.prototype.attr = function (name, value) {
        if (arguments.length < 2) {
            if (typeof name === "string") {
                var node = this.node();
                name = Ns.ns.qualify(name);
                return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
            }
            for (value in name)
                this.each(Ns.ns.attr(value, name[value]));
            return this;
        }
        return this.each(Ns.ns.attr(name, value));
    };
    ns.prototype.prop = function (name, value) {
        if (!value) {
            var node = this.node();
            return node[name];
        }
        node[name] = value;
        return this;
    };
    ns.prototype.html = function (html, pos) {
        if (html != null) {
            this.call(function (d) { this.innerHTML = html; }, pos);
            return this;
        }
        return this.calling(function (d) { return this.node().innerHTML; }, pos);
    };
    ns.prototype.outHtml = function (pos) {
        return this.calling(function (d) { return this.node().outterHTML; }, pos);
    };
    ns.prototype.value = function (val, pos) {
        if (val != null) {
            this.call(function (d) { if (this.node instanceof Function) {
                this.node().value = val;
            }
            else {
                this.value = val;
            } }, pos);
            return this;
        }
        return this.calling(function (d) { return this.node().value; }, pos);
    };
    ns.prototype.text = function (txt, pos) {
        if (txt != null) {
            this.call(function (d) { if (this.node instanceof Function) {
                this.node(0).innerText = txt;
            }
            else {
                this.innerText = txt;
            } }, pos);
            return this;
        }
        return this.calling(function (d) { return this.node(0).innerText; }, pos);
    };
    ns.prototype.tag = function (pos) {
        return this.calling(function (d) {
            return this.node().tagName;
        }, pos);
    };
    ns.prototype.node = function (pos) { if (pos != null) {
        return this.selected[pos];
    }
    else {
        if (this.selected.length == 1) {
            return this.selected[0];
        }
        return this.selected;
    } };
    ns.prototype.is = function (exp, pos) {
        if (pos != null) {
            return ns.selectionMatchs(this.node(pos), exp);
        }
        var b = true;
        this.selected.forEach(function (d) { b = b && ns.selectionMatchs(d, exp); });
        return b;
    };
    ns.prototype.first = function () { return this.at(0); };
    ns.prototype.lt = function (pos) { this.selected = this.selected.slice(0, pos); return this; };
    ns.prototype.gt = function (pos) { this.selected = this.selected.slice(pos); return this; };
    ns.prototype.odd = function () { var r = []; this.selected.forEach(function (d, i) { if (i % 2 !== 0) {
        r.push(d);
    } }); this.selected = r; return this; };
    ns.prototype.eve = function () { var r = []; this.selected.forEach(function (d, i) { if (i % 2 === 0) {
        r.push(d);
    } }); this.selected = r; return this; };
    ns.prototype.last = function () { return this.at(this.length - 1); };
    ns.prototype.at = function (pos) { this.selected = [this.selected[pos]]; return this; };
    ns.prototype.eq = function (eq) { if (typeof eq === "number") {
        return this.at(eq);
    }
    else if (typeof eq === "string") {
        return this.filter(eq);
    }
    else {
        return eq.call(this, null);
    } };
    ns.prototype.filter = function (exp) {
        if (exp instanceof Function) {
            return this.each(exp);
        }
        var b = [];
        this.selected.forEach(function (d) { if (ns.selectionMatchs(d, exp)) {
            b.push(d);
        } });
        this.selected = b;
        return this;
    };
    ns.prototype.next = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.next(d).forEach(function (d) { if (d)
                rs.push(d); });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.prev = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.prev(d).forEach(function (d) { if (d)
                rs.push(d); });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.nexts = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.nexts(d).forEach(function (d) { if (d)
                rs.push(d); });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.prevs = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.prevs(d).forEach(function (d) { if (d)
                rs.push(d); });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.children = function (exp, pos) {
        var rs = [];
        var rns = new ns();
        this.call(function (d) {
            ns.children(d).forEach(function (d) { if (d)
                rs.push(d); });
        }, pos);
        rns.selected = rs;
        return exp ? rns.filter(exp) : rns;
    };
    ns.prototype.parent = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            rs.push(d.parentNode);
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.insertBefore = function (dom, after) {
        var node = dom instanceof ns ? dom.node() : ns.parseHtml(dom);
        this.each(function () {
            if (this.insertBefore) {
                this.insertBefore(node, after);
            }
        });
        return this;
    };
    ns.prototype.append = function (name) {
        if (name instanceof ns) {
            var me = this;
            name.each(function () { var self = this; me.each(function () { this.appendChild(self); }); });
            return this;
        }
        else if (name.nodeType) {
            this.each(function () { this.appendChild(name); });
        }
        else if (name.length && name[0].length) {
            var me = this;
            name.each(function () { var self = this; me.each(function () { this.appendChild(self); }); });
            return this;
        }
        else {
            name = ns.parseHtml(name);
            return this.select(function () {
                return this.appendChild(name.apply(this, arguments));
            });
        }
    };
    ns.prototype.appendTo = function (name) {
        if (name instanceof ns) {
            var me = this;
            name.each(function () { var self = this; me.each(function () { self.appendChild(this); }); });
            return this;
        }
        else {
            name = ns.parseHtml(name);
            return this.select(function () {
                return name.appendChild(this);
            });
        }
    };
    ns.prototype.empty = function () { this.html(""); return this; };
    Object.defineProperty(ns.prototype, "length", {
        get: function () {
            return this.selected.length;
        },
        enumerable: true,
        configurable: true
    });
    ns.databind = function (data) { var d = new ns.data(); d.selector = this; d.datum(data); d.extends(this); return d; };
    ns.prototype.databind = function (data, exp) { return ns.databind(data).bind(exp); };
    ns.prototype.pager = function (num, mode) { };
    ns.tween = function (target, props) {
        return new ns.Tween(target, props);
    };
    ns.prototype.animate = function (target, speed, callback, applyfn) {
        var successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { };
        callback = callback || {};
        var onchanged = callback.onchanged || function () { }, unit = {}, speed = speed || 300, applyfn = applyfn || this.css;
        //
        for (var i in target) {
            unit[i] = Ns.CSS.getUnitFormatType(i);
        }
        callback.onchanged = function (d, s) {
            var tween = this;
            setTimeout(function () {
                if (!d) {
                    onchanged.apply(this, [d, s]);
                    return;
                }
                if ("tweenjs_count" in d) {
                    delete d.tweenjs_count;
                }
                for (var i in d) {
                    d[i] = unit[i].replace("{0}", d[i]);
                }
                if (d.opacity && d.opacity <= 0) {
                    this.css("display", "none");
                }
                //tween.pluginData.dom.css(d);
                applyfn.call(this, d);
                onchanged.apply(this, [d, s]);
            });
        };
        this.each(function (val, index, array) {
            var nss = ns.select(val), start = {};
            for (var i in target) {
                start[i] = parseFloat(Ns.CSS.extractValue(nss.css(i), i));
                target[i] = parseFloat(Ns.CSS.extractValue(target[i], i));
            }
            if (start["opacity"] && target.opacity > 0 && nss.css("display") === "none") {
                nss.css("display", Ns.CSS.getDisplayType(nss.node()));
            }
            ns.tween().initialize(start, callback, { dom: nss }).to(target, speed).call(successback);
        });
    };
    ns.prototype.show = function (speed, callback) {
        var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { };
        callback = callback || {};
        var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
        callback.onchanged = function (d, s) {
            var tween = this;
            setTimeout(function () {
                if (!d) {
                    onchanged.apply(me, arguments);
                    return;
                }
                if ("tweenjs_count" in d)
                    delete d.tweenjs_count;
                tween.pluginData.dom.css(d);
                onchanged.apply(me, arguments);
            });
        };
        if (!this["animateTweens"]) {
            this["animateTweens"] = {};
        }
        this.each(function () {
            var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
            nss.css("display", Ns.CSS.getDisplayType(nss.node()));
            me["animateTweens"].show =
                ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 1 }, speed).call(function () {
                    //delete nss.eq(0).tweenanimate;
                    delete me["animateTweens"].show;
                    successback.call(nss, null);
                });
        });
        return this;
    };
    ns.prototype.hide = function (speed, callback) {
        var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { };
        callback = callback || {};
        var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
        callback.onchanged = function (d, s) {
            var tween = this;
            setTimeout(function () {
                if (!d) {
                    onchanged.apply(me, arguments);
                    return;
                }
                if ("tweenjs_count" in d)
                    delete d.tweenjs_count;
                tween.pluginData.dom.css(d);
                onchanged.apply(me, arguments);
            });
        };
        if (!this["animateTweens"]) {
            this["animateTweens"] = {};
        }
        this.each(function (val, index, array) {
            var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
            me["animateTweens"].hide = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 0 }, speed).call(function () {
                nss.css("display", "none");
                delete me["animateTweens"].hide;
                successback.call(nss, null);
            });
        });
        return this;
    };
    ns.prototype.removeClass = function (cls) {
        var r = false, j = 0, value, clses = cls.split(/\s+/), i = 0, n = clses.length;
        this.each(function () {
            if (value = this.classList) {
                while (i < n)
                    if (value.contains(clses[i])) {
                        value.remove(clses[i]);
                        i++;
                    }
            }
            else {
                value = this.getAttribute("class");
                while (i < n) {
                    value = value.replace(new RegExp("(?:^|\\s+)" + ns.requote(clses[i]) + "(?:\\s+|$)", "g"), "");
                    i++;
                }
                this.setAttribute("class", value);
            }
            j++;
        });
        return this;
    };
    ns.prototype.hasClass = function (cls) {
        var r = true, j = 0, value, clses = cls.split(/\s+/), i = 0, n = clses.length;
        this.each(function () {
            if (value = this.classList) {
                while (i < n) {
                    if (!value.contains(clses[i])) {
                        r = false;
                        return true;
                    }
                    i++;
                }
            }
            else {
                value = this.getAttribute("class");
                while (i < n) {
                    //value = value.replace(, "");
                    if (!new RegExp("(?:^|\\s+)" + ns.requote(clses[i]) + "(?:\\s+|$)", "g").test(value)) {
                        r = false;
                        break;
                    }
                    i++;
                }
                this.setAttribute("class", value);
            }
            j++;
        });
        return r;
    };
    ns.prototype.class = function (cls) { return this.attr("class", cls); };
    ns.prototype.addClass = function (cls) {
        if (!cls) {
            return this;
        }
        var r = false, j = 0, value;
        this.each(function () {
            if ((value = this.classList) && value.add) {
                value.add(cls);
            }
            else {
                value = this.getAttribute("class");
                //if (new RegExp("(?:^|\\s+)" + ns.requote(cls) + "(?:\\s+|$)", "g").test(value)) r = true;
                this.setAttribute("class", value + " " + cls);
            }
            j++;
        });
        return this;
    };
    ns.popup = { top: 10, bottom: 10, popupitems: {}, position: "bottom" };
    return ns;
}());
var ns;
(function (ns) {
    var Map = (function () {
        function Map() {
            this.me = {};
        }
        Map.prototype.set = function (key, value) { return this.me[key] = value; };
        Map.prototype.get = function (key) { return this.me[key]; };
        Map.prototype.has = function (key) { return key in this.me; };
        Map.prototype.remove = function (key) {
            return (key = key) in this.me && delete this.me[key];
        };
        Object.defineProperty(Map.prototype, "isEmpty", {
            get: function () {
                for (var key in this.me)
                    return false;
                return true;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "entity", {
            get: function () {
                var entity = {};
                for (var key in this.me)
                    entity[key] = this.me[key];
                return entity;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "entries", {
            get: function () {
                var entries = [];
                for (var key in this.me)
                    entries.push({
                        key: key,
                        value: this.me[key]
                    });
                return entries;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "size", {
            get: function () {
                var size = 0;
                for (var key in this.me)
                    ++size;
                return size;
            },
            enumerable: true,
            configurable: true
        });
        Map.prototype.empty = function () {
            this.me = {};
            return this;
        };
        Map.prototype.forEach = function (f) {
            for (var key in this.me)
                f.call(this, key, this.me[key]);
            return this;
        };
        Object.defineProperty(Map.prototype, "length", {
            get: function () {
                return this.keys.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "keys", {
            get: function () {
                var keys = [];
                for (var key in this.me)
                    keys.push(key);
                return keys;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Map.prototype, "values", {
            get: function () {
                var values = [];
                for (var key in this.me)
                    values.push(this.me[key]);
                return values;
            },
            enumerable: true,
            configurable: true
        });
        return Map;
    }());
    ns.Map = Map;
    var data = (function () {
        function data(data) {
            this.container = null;
            this.extendObject = null;
            this.source = [];
            this.data = [];
            this._caches = new Map();
            data ? this.datum(data) : null;
        }
        data.bind = function (template, dataitem, datatype, index) {
            var temp = template, reg = /\{bind\(([^\{\}]+)\)\}/, //全匹配正则
            rpath = /path\((\s*[\w\.]+\s*)\)/i, //路径匹配正则
            rexp = /exp[ression]{0,1}\[(\s*\S+\s*)\]/, //表达式匹配正则
            rdef = /def[ault]{0,1}\((\s*\S+\s*)\)/, //默认值匹配正则
            rcol = /col[lection]{0,1}\((\s*\S*\s*)\)/, //集合匹配正则
            rfunc = /func[tion]{0,1}\((\s*\S+\s*)\)/, //函数处理匹配正则
            v = temp;
            var curindex = index || 1;
            datatype = datatype ? datatype : "json";
            //如果没模板存在那么返回数据行
            if (!temp) {
                return dataitem;
            }
            else if (typeof temp !== "string") {
                temp = ns.select(temp).at(0).outHtml();
            }
            v = v.replace("{number}", curindex);
            //类型为json
            if (datatype.toLowerCase() === "json") {
                var curd = dataitem, rggs;
                //循环匹配是否存在绑定
                while ((rggs = reg.exec(v)) != null) {
                    var i = 1, vpath = "", vexp = null, vdef = null, vcol = null, vfunc = null, func = function (v) { return v; };
                    while (!rggs[i]) {
                        i++;
                    } //找到绑定
                    vpath = rpath.exec(rggs[i])[1]; //路径
                    vcol = rcol.exec(rggs[i]); //集合
                    vpath = vpath ? vpath : "";
                    vpath = vpath.replace(/\)$/, "");
                    vcol = vcol ? vcol.replace(/\)$/, "") : null;
                    var vlu = ns.gotoNs(curd, vpath); //定向值
                    //如果不等于null，则按集合处理
                    if (vcol != null && vcol != undefined) {
                        vlu = JSON.stringify(ns.gotoNs(vlu, vcol[1]));
                    }
                    else {
                        vexp = rexp.exec(rggs[i]); //验证表达式
                        vexp = vexp ? vexp[1] : null;
                        vexp = vexp ? vexp.replace(/\)$/, "") : null;
                        vdef = rdef.exec(rggs[i]); //验证默认值
                        vdef = vdef ? vdef[1] : null;
                        vfunc = rfunc.exec(rggs[i]); //函数处理
                        vfunc = vfunc ? vfunc[1] : null;
                        vfunc = vfunc ? vfunc.replace(/\)$/, "") : null;
                        vdef = vdef ? vdef.replace(/\)$/, "") : ""; //如果默认值不存在，则为""
                        //表达式特殊处理
                        if (vexp) {
                            vexp = vexp.replace("$default$", vdef).replace("$template$", template).replace("$dataitem$", dataitem).replace("$datatype$", datatype);
                            //转换函数
                            var vexpfunc = Function("value", "return " + vexp + ";");
                            //表达式验证
                            if (vexpfunc instanceof Function) {
                                vlu = vexpfunc.call(null, vlu);
                            }
                        }
                        //找到函数函数
                        if (vfunc) {
                            func = ns.gotoNs(window, vfunc);
                        }
                        //函数处理
                        if (func instanceof Function) {
                            vlu = func.apply(null, [vlu, temp, dataitem, datatype]);
                        }
                        //如果vlu为null则转成默认值
                        if (vlu == null || vlu == undefined || (vlu !== vdef && vlu === "" && vdef !== "")) {
                            vlu = vdef;
                        }
                    }
                    //替换验证的地方区域
                    v = v.replace(reg, !(vlu == null || vlu == undefined) ? vlu : "").replace(/ns-binder-item-template/ig, "ns-binder-item");
                }
            }
            return v;
        };
        data.clone = function (d) {
            var rd = null;
            if (d instanceof Boolean || d instanceof Number || d instanceof String || d instanceof Function) {
                rd = d;
            }
            else if (d instanceof Array) {
                rd = [];
                for (var i = 0; i < d.length; i++) {
                    rd.push(d[i]);
                }
            }
            else {
                rd = {};
                for (var j in d) {
                    rd[j] = ns.data.clone(d[j]);
                }
            }
            return rd;
        };
        data.data = function (data) { var d = new ns.data(); d.datum(data); return d; };
        data.prototype.bind = function (dom, config) {
            var i = 0, listen = config ? config : { template: "" }, me = this, savedHtml, template = config.template ? config.template : "", executeEmpty = function () { };
            this.container = ns.select(dom);
            if (!template || template.toLowerCase() == "auto") {
                template = this.container.select(".ns-binder-item-template").at(0).outHtml();
            }
            savedHtml = this.container.selectAll(".ns-binder-item-header").outerHTML();
            (listen.start ? listen.start : executeEmpty).call(this, this.container, template);
            this.container.html(savedHtml + template);
            var h = "", html;
            this.each(function (d) {
                (listen.binding ? listen.binding : executeEmpty).call(this, d, i);
                var h2 = ns.data.bind(template, d, "json", i++);
                h += h2;
                var html = ns.select(ns.parseHtml(h2));
                (listen.binded ? listen.binded : executeEmpty).call(this, d, html, i);
                me.container.append(html);
            });
            me.container.select(".ns-binder-item-template").style("display", "none");
            //me.container.html(me.container.select(".ns-binder-item-header").outHtml() + h);
            (listen.end ? listen.end : executeEmpty).call(this, this.container, template);
            return this;
        };
        data.prototype.datum = function (data) { this.source = ns.data.clone(data); this.data = data; };
        data.contains = function (array, value, pk) {
            var r = false;
            if (pk && pk != "*") {
                var pks = Array.isArray(pk) ? pk : pk.split(',');
                array.each(function (d) {
                    var el = true;
                    for (var j = 0; j < pks.length; j++) {
                        if (value[pks[j]] != array[d][pks[j]]) {
                            el = false;
                            break;
                        }
                    }
                    if (j >= pks.length && el) {
                        r = true;
                        return true;
                    }
                });
            }
            else {
                array.each(function (d) {
                    var el = true;
                    for (var j in pk.split(',')) {
                        el = el && (array[j] == value[j]);
                        if (!el) {
                            break;
                        }
                    }
                    if (el) {
                        r = true;
                    }
                });
            }
            return r;
        };
        //查询不一样的结果集，去除相同属性的值
        data.distinct = function (ds, pk) {
            var ss = [], l = ds.length;
            for (var s = 0; s < l; s++) {
                if (!ss[0]) {
                    ss.push(ds[s]);
                }
                else if (data.contains(ss, ds[s], pk)) {
                    continue;
                }
                else {
                    ss.push(ds[s]);
                }
            }
            return ss;
        };
        data.union = function (fs, sec, where) {
            if (!where) {
                for (var i in fs) {
                    for (var j in sec) {
                        fs[i][j] = sec[j];
                    }
                }
                return fs;
            }
            else {
                for (var i in fs) {
                    //
                    var temp = data.where(sec, where);
                    for (var j in temp) {
                        fs[i][j] = sec[j];
                    }
                }
            }
        };
        data.propertyJoin = function (fs, sec, where, alias) {
            if (!where) {
                for (var i in fs) {
                    for (var j in sec) {
                        fs[i][alias + j] = sec[j];
                    }
                }
                return fs;
            }
            else {
                for (var i in fs) {
                    //
                    var temp = data.where(sec, fs[where] + "=[" + where + "]");
                    for (var j in temp) {
                        fs[i][alias + j] = sec[j];
                    }
                }
            }
        };
        data.select = function (ds, pks) {
            if (!pks || !ds) {
                return ds;
            }
            var ss = [];
            var fs = pks.split(",");
            for (var i in ds) {
                var s = {};
                for (var j = 0; j < fs.length; j++) {
                    s[fs[j]] = ds[i][fs[j]];
                }
                ss[i] = s;
            }
            return ss;
        };
        data.sort = function (ds, st) {
            //排序，并且在不影响不相同属性值得情况下对相同属性值的对象进行排序
            function depencySort(ds, sort, sameProp) {
                if (!st || !ds) {
                    return ds;
                }
                var res = [];
                var sorts = sort.trim().split(" ");
                var key = sorts[0];
                var asc = true;
                if (sorts.length > 1 && sorts[1] && sorts[1].toLowerCase() == "desc") {
                    asc = false;
                }
                var indexes = data.samePosition(ds, sameProp);
                if (asc && indexes[0] == -1) {
                    for (var j = 0; j < ds.length; j++) {
                        for (var k = j + 1; k < ds.length; k++) {
                            if (data.compare(ds[j][key], ds[k][key]) == 1) {
                                var t = ds[k];
                                ds[k] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                }
                else if (asc && indexes[0] != -1) {
                    for (var j = 0; j < indexes.length; j++) {
                        for (var k = j + 1; k < indexes.length; k++) {
                            if (data.compare(ds[indexes[j]][key], ds[indexes[k]][key]) == 1) {
                                var t = ds[indexes[k]];
                                ds[indexes[k]] = ds[indexes[j]];
                                ds[indexes[j]] = t;
                            }
                        }
                    }
                }
                else if (!asc && indexes[0] == -1) {
                    for (var j = 0; j < ds.length; j++) {
                        for (var k = j + 1; k < ds.length; k++) {
                            if (data.compare(ds[j][key], ds[k][key]) == -1) {
                                var t = ds[k];
                                ds[k] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                }
                else {
                    for (var j = 0; j < indexes.length; j++) {
                        for (var k = j + 1; k < indexes.length; k++) {
                            if (data.compare(ds[indexes[j]][key], ds[indexes[k]][key]) == -1) {
                                var t = ds[indexes[k]];
                                ds[indexes[k]] = ds[indexes[j]];
                                ds[indexes[j]] = t;
                            }
                        }
                    }
                }
                return ds;
            }
            function depencySortSimple(ds, sort, sameProp) {
                if (!ds) {
                    return ds;
                }
                var res = [], asc = true, l = ds.length, t;
                if (sort && sort.toLowerCase() == "desc") {
                    asc = false;
                }
                if (asc) {
                    for (var i = 0; i < l; i++) {
                        for (var j = i + 1; j < l; j++) {
                            if (data.compare(ds[i], ds[j]) == 1) {
                                var t = ds[i];
                                ds[i] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                }
                else {
                    for (var i = 0; i < l; i++) {
                        for (var j = i + 1; j < l; j++) {
                            if (data.compare(ds[i], ds[j]) == 1) {
                                var t = ds[j];
                                ds[j] = ds[i];
                                ds[i] = t;
                            }
                        }
                    }
                }
                return ds;
            }
            if (!st || /^asc$|^desc$/.test(st)) {
                ds = depencySortSimple(ds, st || "asc");
                return ds;
            }
            var sts = st.split(','), same = "";
            for (var i = 0; i < sts.length; i++) {
                ds = depencySort(ds, sts[i], same["Trim"](/,$|^,/));
                same += sts[i].trim().split(' ')[0] + ',';
            }
            return ds;
        };
        data.same = function (ds, sameProp) {
            var indexes = data.samePosition(ds, sameProp), res = [];
            if (indexes[0] == -1) {
                return [];
            }
            for (var i = 0; i < indexes.length; i++) {
                res.push(ds[indexes[i]]);
            }
            return res;
        };
        //取出相同属性值的索引位置
        data.samePosition = function (ds, sameProp) {
            if (!sameProp) {
                return [-1];
            }
            var sps = sameProp.trim().split(',');
            var res = [], temp, p = true, startPos = false, l = ds.length;
            res.push(-1);
            for (var k = 0; k < l; k++) {
                temp = ds[k];
                for (var j = k + 1; j < l; j++) {
                    p = true;
                    for (var i = 0; i < sps.length; i++) {
                        if (ds[j][sps[i]] == temp[sps[i]]) {
                            p = true;
                        }
                        else {
                            p = false;
                            break;
                        }
                    }
                    if (p) {
                        startPos = true;
                        res.push(j);
                    }
                }
                if (startPos) {
                    res[0] = k;
                    break;
                }
            }
            return res;
        };
        data.compare = function (first, second) {
            if (!second || !first) {
                return;
            }
            if (typeof first === "string" || typeof second === "string") {
                var ft = first.toString(), sc = second.toString();
                for (var i = 0; i < ft.length; i++) {
                    var ascii1 = ft.charCodeAt(i);
                    var ascii2 = sc.charCodeAt(i);
                    if (ascii1 > ascii2) {
                        return 1;
                    }
                    else if (ascii1 < ascii2) {
                        return -1;
                    }
                    else {
                        continue;
                    }
                }
                return 0;
            }
            else if (typeof first == "date" || typeof second === "date") {
                first = new Date(first);
                second = new Date(second);
                return first < second ? -1 : (first == second ? 0 : 1);
            }
            else {
                if (first < second) {
                    return -1;
                }
                else if (first > second) {
                    return 1;
                }
                else {
                    return 0;
                }
            }
        };
        data.where = function (ds, where) {
            if (!where) {
                return ds;
            }
            var splitReg = /===|\>|\<|\<=|\>=|\!==|==|!=/;
            function simpleWhere(ds, where) {
                var me = this;
                function whereEqual(ds, key, value, equal) {
                    var res = [];
                    ds.each(function (i, args) {
                        if (this[key] == value && equal) {
                            res.push(this);
                        }
                        else if (this[key] != value && !equal) {
                            res.push(this);
                        }
                    });
                    return res;
                }
                function whereCompare(ds, key, value, bigger) {
                    var res = [];
                    ds.each(function (i, args) {
                        var compare = me.compare(this, value);
                        if (compare == bigger) {
                            res.push(this);
                        }
                    });
                    return res;
                }
                // authorid=''   and authorName=''
                if (!where || !ds) {
                    return ds;
                }
                var compObj = { left: '', mid: '', right: '' };
                if (typeof where == "string") {
                    var splitRes = where.split(splitReg);
                    compObj.left = splitRes[0];
                    compObj.mid = splitReg.exec(where)[0];
                    compObj.right = splitRes[1]; // key == value | key>value | key<value |key>=value|key<=value | key!=value | key=value| key==value[$window]
                }
                else {
                    compObj.left = where.left;
                    compObj.mid = where.mid;
                    compObj.right = where.right;
                }
                var compValue = {
                    _left: null,
                    _right: null,
                    left: null,
                    right: null,
                    mid: null
                };
                if (compObj.left[0] == '[') {
                    compValue.left = undefined;
                    compValue._left = compObj.left.substring(1, compObj.left.length - 1);
                }
                else {
                    compValue.left = compObj.left;
                }
                if (compObj.right[0] == '[') {
                    compValue.right = undefined;
                    compValue._right = compObj.right.substring(1, compObj.right.length - 1);
                }
                else {
                    compValue.right = /'|"/.test(compObj.right) ? compObj.right.substring(1, compObj.right.length - 1) : compObj.right;
                }
                var res = [];
                for (var i = 0; i < ds.length; i++) {
                    if (compValue._left) {
                        compValue.left = ds[i][compValue._left];
                    }
                    if (compValue._right) {
                        compValue.right = ds[i][compValue._right];
                    }
                    var fntemp = "function(){}";
                    switch (compObj.mid) {
                        case "===":
                        case "==":
                            compValue.left == compValue.right ? res.push(ds[i]) : null;
                            break;
                        case "!=":
                        case "!==":
                            compValue.left != compValue.right ? res.push(ds[i]) : null;
                            break;
                        case ">=":
                            compValue.left >= compValue.right ? res.push(ds[i]) : null;
                            break;
                        case "<=":
                            compValue.left <= compValue.right ? res.push(ds[i]) : null;
                            break;
                        case ">":
                            compValue.left > compValue.right ? res.push(ds[i]) : null;
                            break;
                        case "<":
                            compValue.left < compValue.right ? res.push(ds[i]) : null;
                            break;
                    }
                }
                return res;
            }
            var ws = where.trim().split(/and|,/ig);
            var res = ds;
            for (var i = 0; i < ws.length; i++) {
                res = simpleWhere(res, ws[i]);
            }
            return res;
        };
        data.prototype.filter = function () {
            return this;
        };
        data.prototype.reset = function () {
            this.data = this.source;
        };
        data.prototype.max = function (property) {
            return this.property(property);
        };
        data.prototype.property = function (property) {
            var p = [];
            this.each(function (d) {
                p.push(d[property]);
            });
            return p;
        };
        data.prototype.each = function (fn) {
            var l = this.data.length;
            for (var i = 0; i < l; i++) {
                if (!!fn.call(this, this.data[i], i)) {
                    break;
                }
            }
            return this;
        };
        data.prototype.first = function (fn) {
            if (arguments.length) {
                return this.eq(0, fn);
            }
            return this.eq(0);
        };
        data.prototype.last = function (fn) {
            var l = this.data.length - 1;
            if (arguments.length) {
                return this.eq(l, fn);
            }
            return this.eq(l);
        };
        data.prototype.eq = function (index, fn) {
            if (typeof fn === "function") {
                fn.call(this, this.data[index], index);
                return this;
            }
            if (index === "first")
                index = 0;
            if (index === "last")
                index = this.data.length - 1;
            return this.data[index];
        };
        data.prototype.forEach = function (fn) {
            var l = this.data.length;
            for (var i = 0; i < l; i++) {
                this.data[i] = fn.call(this, this.data[i], i);
            }
            return this;
        };
        data.prototype.temp = function () {
            this._caches["__temp__"] = this.data;
            return this;
        };
        data.prototype.revert = function (key) {
            if (!key)
                key = "__temp__";
            this.data = this._caches.get(key);
            return this;
        };
        data.prototype.extract = function (cachekey) {
            return this._caches ? this._caches.get(cachekey) : [];
        };
        data.prototype.sort = function (se) {
            this.data = data.sort(this.data, se);
            return this;
        };
        data.prototype.where = function (where) {
            if (typeof where === "function") {
                var l = this.data.length, d, ds = [];
                for (var i = 0; i < l; i++) {
                    if (!!where.call(this, this.data[i], i)) {
                        ds.push(this.data[i]);
                    }
                }
                this.datum(ds);
            }
            else
                this.data = data.where(this.data, where);
            return this;
        };
        data.prototype.cache = function (key) {
            if (!key)
                key = "__temp__";
            if (!this._caches)
                this._caches = new Map();
            this._caches.set(key, this.data);
            return this;
        };
        data.prototype.empty = function () {
            this.source = this.data = [], delete this._caches;
            return this;
        };
        data.prototype.deleteCache = function (cacheKey) {
            if (cacheKey && this._caches[cacheKey]) {
                delete this._caches[cacheKey];
            }
            return this;
        };
        data.prototype.count = function () {
            if (typeof arguments[0] === "function")
                return arguments[0].call(this, null);
            return this.data.length;
        };
        data.prototype.equal = function (property, value, fn) {
            var ds = [];
            if (typeof value === "function") {
                this.each(function (d) { if (value.call(null, d[property], d)) {
                    ds.push(d);
                } });
            }
            else if (typeof value === "object") {
                this.each(function (d) { if (d[property] == value[property]) {
                    ds.push(d);
                } });
            }
            else {
                this.each(function (d) { if (d[property] == value) {
                    ds.push(d);
                } });
            }
            if (arguments.length < 3) {
                this.data = ds;
            }
            else {
                typeof fn === "function" ? fn.call(this, ds) : "";
            }
            return this;
        };
        data.prototype.call = function (fn) {
            if (arguments.length) {
                if (typeof arguments[0] === "function") {
                    arguments[0].apply(this, arguments[1] && typeof arguments[1] !== "function" ? (typeof arguments[1] !== "arrary" ? [arguments[1]] : arguments[1]) : []);
                }
                if (arguments.length > 2) {
                    this.call.apply(this, ns.slice(arguments).slice(2));
                }
            }
            return this;
        };
        data.prototype.selfback = function (fn) {
            if (typeof fn === "function") {
                if (arguments.length === 1)
                    return this.call(fn);
                var args = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    if (typeof this[arguments[i]] === "function") {
                        args.push(arguments[i].call(this, null));
                    }
                    else {
                        args.push(arguments[i].fn.apply(this, arguments[i].args || []));
                    }
                }
                fn.apply(this, args);
            }
            return this;
        };
        data.prototype.index = function (property, value) {
            var index = -1;
            if (property && value) {
                this.each(function (d, i) {
                    if (d[property] === value) {
                        index = i;
                        return true;
                    }
                });
            }
            else if (property) {
                if (typeof property === "function") {
                    this.each(function (d, i) {
                        if (property.call(this, d, i)) {
                            index = i;
                            return true;
                        }
                    });
                }
                else {
                    this.each(function (d, i) {
                        if (property in d) {
                            index = i;
                            return true;
                        }
                    });
                }
            }
            return index;
        };
        data.prototype.distinct = function (pks, fn) {
            if (!fn) {
                this.data = data.distinct(this.data, pks);
            }
            else {
                this.data = fn.call(this, data.distinct(this.data, pks), pks);
            }
            return this;
        };
        data.prototype.selfLinkage = function (prop, tag) {
            var me = this, parsedData = [], tags, tagfn = tag ? typeof tag === "function" ? tag
                : (tags = tag.split(/,|;/g), function (d, ad) { for (var i = 0; i < tags.length && tags[i] in ad; i++) {
                    d[tags[i]] = ad[tags[i]];
                } })
                : function (d, ad) { for (var i in ad) {
                    d[i] = ad[i];
                } };
            return this.distinct(prop, function (ds, pks) {
                ds.forEach(function (data) {
                    var d;
                    me.cache().equal(pks, data[pks]).each(function (ad) {
                        if (!d) {
                            d = ad;
                        }
                        tagfn(d, ad);
                    }).revert();
                    parsedData.push(d);
                });
            }).datum(parsedData);
        };
        data.prototype.join = function () {
            //static propertyJoin
        };
        data.prototype.groupby = function (fields, fn) {
            if (!fields) {
                return this;
            }
            fields = Array.isArray(fields) ? fields : fields.split(',');
            var pos = 0, vals = [], tempVals = {}, me = this, ds = [], datas = { groups: [], datas: this.data };
            for (var f in fields) {
                tempVals = {};
                //获取groupby 的值，有多少个
                datas.datas.forEach(function (d) {
                    if (d[f] in tempVals) {
                        return;
                    }
                    tempVals[d[f]] = f;
                    vals.push(d[f]);
                });
                vals.forEach(function (value) {
                    ds = [];
                    datas.datas.forEach(function (d) { if (d[f] == value) {
                        ds.push(d);
                    } });
                    //fn.call(me, ds, f, pos);
                    datas.datas = ds;
                    datas.groups.push({ index: pos, position: pos, value: value, field: f });
                });
            }
            if (!fn) {
                return datas;
            }
            this.data = fn.call(datas);
            return this;
        };
        //行列转换，格式 tagRow valueRow
        data.prototype.xpose = function (xposes, isdelete) {
            xposes = Array.isArray(xposes) ? xposes : xposes.split(','), isdelete = !!isdelete;
            for (var x = 0; x < xposes.length; x++) {
                var rc = xposes[x].split(/\->|=>/), r = rc[0], r1 = r[0] === "'" ? r.slice(1, r.length) : "", c = rc.length < 2 ? r : rc[1];
                this.forEach(function (d) {
                    d[r1 || d[r]] = d[c];
                    if (isdelete) {
                        delete d[r];
                    }
                    return d;
                });
            }
            return this;
        };
        data.prototype.append = function (data) {
            if (typeof data === "function") {
                data.call(this, null);
            }
            else if (data instanceof Array) {
                var me = this;
                data.forEach(function (d) { me.data.push(d); });
            }
            else {
                this.data.push(data);
            }
        };
        data.prototype.add = function (data) {
            if (typeof data === "function") {
                data.call(this, null);
            }
            else {
                this.data.push(data);
            }
        };
        data.prototype.select = function (pks) {
            return new data(ns.data.select(this.data, pks));
        };
        //重新组建数据
        data.prototype.reorganize = function (fn) {
            var l = this.data.length, p, temp = [];
            for (var i = 0; i < l; i++) {
                if ((p = fn.call(this, this.data[i], i))) {
                    temp.push(p);
                }
            }
            this.data = temp;
            return this;
        };
        Object.defineProperty(data.prototype, "selector", {
            get: function () { return this.container; },
            set: function (val) { this.container = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(data.prototype, "extends", {
            get: function () { return this.extendObject; },
            set: function (val) { this.extendObject = val; },
            enumerable: true,
            configurable: true
        });
        return data;
    }());
    ns.data = data;
    ns["dispatch_event"] = function (dispatch) {
        var listeners = [], listenerByName = new Map();
        function event() {
            var z = listeners, i = -1, n = z.length, l;
            while (++i < n)
                if (l = z[i].on)
                    l.apply(this, arguments);
            return dispatch;
        }
        event["on"] = function (name, listener) {
            var l = listenerByName.get(name), i;
            if (arguments.length < 2)
                return l && l.on;
            if (l) {
                l.on = null;
                listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
                listenerByName.remove(name);
            }
            if (listener)
                listeners.push(listenerByName.set(name, {
                    on: listener
                }));
            return dispatch;
        };
        event["off"] = function (name) {
            var l = listenerByName.get(name), i;
            if (l) {
                l.on = null;
                listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
                listenerByName.remove(name);
            }
            return dispatch;
        };
        return event;
    };
    var Dispatch = (function () {
        function Dispatch() {
            this.keyEvents = new Map();
        }
        Dispatch.prototype.on = function (type, listener) {
            var i = type.indexOf("."), name = "";
            if (i >= 0) {
                name = type.slice(i + 1);
                type = type.slice(0, i);
            }
            if (type)
                return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
            if (arguments.length === 2) {
                if (listener == null)
                    for (type in this) {
                        if (this.hasOwnProperty(type))
                            this[type].on(name, null);
                    }
                return this;
            }
        };
        Dispatch.prototype.off = function (type, name) {
            if (arguments.length < 2) {
                var i = type.indexOf(".");
                name = "";
                if (i >= 0) {
                    name = type.slice(i + 1);
                    type = type.slice(0, i);
                }
            }
            if (type)
                return this[type].on(name, null);
        };
        Dispatch.prototype.register = function () {
            var name = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                name[_i - 0] = arguments[_i];
            }
            var i = -1, n = arguments.length;
            while (++i < n) {
                if (arguments[i] in this) {
                    continue;
                }
                this[arguments[i]] = ns["dispatch_event"](this);
            }
            return this;
        };
        Dispatch.prototype.trigger = function (type, self, args) {
            if (type in this) {
                this[type].apply(self, args);
            }
        };
        return Dispatch;
    }());
    ns.Dispatch = Dispatch;
    var Ticker = (function () {
        function Ticker() {
        }
        Ticker.interval = function (int) {
            if (arguments.length) {
                ns.Ticker.m_interval = arguments[0];
                if (!ns.Ticker.m_inited) {
                    return;
                }
                ns.Ticker.setup();
                return;
            }
            return ns.Ticker.m_interval;
        };
        Ticker.fps = function (value) {
            if (value) {
                ns.Ticker.interval(1000 / value);
                return;
            }
            return 1000 / ns.Ticker.m_interval;
        };
        Ticker.init = function () {
            if (ns.Ticker.m_inited) {
                return;
            }
            ns.Ticker.m_inited = true;
            ns.Ticker.times = [];
            ns.Ticker.tickTimes = [];
            ns.Ticker.startTime = ns.Ticker.getNowTime();
            ns.Ticker.times.push(ns.Ticker.lastTime = 0);
            ns.Ticker.interval(ns.Ticker.m_interval);
        };
        Ticker.getNowTime = function () { return ((ns.Ticker.now && ns.Ticker.now.call(performance)) || (new Date().getTime())) - ns.Ticker.startTime; };
        Ticker.reset = function () {
            if (ns.Ticker.raf) {
                var f = window.cancelAnimationFrame || window["webkitCancelAnimationFrame"] ||
                    window["mozCancelAnimationFrame"] || window["oCancelAnimationFrame"] || window["msCancelAnimationFrame"];
                f && f(ns.Ticker.timerId);
            }
            else {
                clearTimeout(ns.Ticker.timerId);
            }
            ns.Ticker["off"]("tick");
            ns.Ticker.timerId = ns.Ticker.times = ns.Ticker.tickTimes = null;
            ns.Ticker.startTime = ns.Ticker.lastTime = 0;
            ns.Ticker.m_inited = false;
        };
        Ticker.getMeasuredTickTime = function (ticks) {
            var ttl = 0, times = ns.Ticker.tickTimes;
            if (!times || times.length < 1) {
                return -1;
            }
            // by default, calculate average for the past ~1 second:
            ticks = Math.min(times.length, ticks || (ns.Ticker.fps() | 0));
            for (var i = 0; i < ticks; i++) {
                ttl += times[i];
            }
            return ttl / ticks;
        };
        Ticker.getMeasuredFPS = function (ticks) {
            if (!ns.Ticker.times || ns.Ticker.times.length < 2) {
                return -1;
            }
            // by default, calculate fps for the past ~1 second:
            ticks = Math.min(ns.Ticker.times.length - 1, ticks || (ns.Ticker.fps() | 0));
            return 1000 / ((ns.Ticker.times[0] - ns.Ticker.times[ticks]) / ticks);
        };
        Ticker.setPaused = function (value) {
            ns.Ticker.paused = value;
        };
        Ticker.getPaused = function () {
            return ns.Ticker.paused;
        };
        Ticker.getTime = function (runTime) { return ns.Ticker.startTime ? ns.Ticker.getNowTime() - (runTime ? ns.Ticker.pausedTime : 0) : -1; };
        Ticker.getEventTime = function (runTime) {
            return ns.Ticker.startTime ? (ns.Ticker.lastTime || ns.Ticker.startTime) - (runTime ? ns.Ticker.pausedTime : 0) : -1;
        };
        Ticker.getTicks = function (pauseable) {
            return ns.Ticker.ticks - (pauseable ? ns.Ticker.pausedTicks : 0);
        };
        Ticker.handleSynch = function () {
            ns.Ticker.timerId = null;
            ns.Ticker.setup();
            // run if enough time has elapsed, with a little bit of flexibility to be early:
            if (ns.Ticker.getNowTime() - ns.Ticker.lastTime >= (ns.Ticker.m_interval - 1) * 0.97) {
                ns.Ticker.tick();
            }
        };
        Ticker.handleRAF = function () {
            ns.Ticker.timerId = null;
            ns.Ticker.setup();
            ns.Ticker.tick();
        };
        Ticker.handleTimeout = function () {
            ns.Ticker.timerId = null;
            ns.Ticker.setup();
            ns.Ticker.tick();
        };
        Ticker.tick = function () {
            var paused = ns.Ticker.paused;
            var time = ns.Ticker.getNowTime();
            var elapsedTime = time - ns.Ticker.lastTime;
            ns.Ticker.lastTime = time;
            ns.Ticker.ticks++;
            if (paused) {
                ns.Ticker.pausedTicks++;
                ns.Ticker.pausedTime += elapsedTime;
            }
            if (ns.Ticker.dispatch["tick"]) {
                var maxDelta = ns.Ticker.maxDelta, event = {
                    delta: (maxDelta && elapsedTime > maxDelta) ? maxDelta : elapsedTime,
                    paused: paused,
                    time: time,
                    runTime: time - ns.Ticker.pausedTime
                };
                ns.Ticker.dispatch["tick"].call(ns.Ticker, event);
            }
            ns.Ticker.tickTimes.unshift(ns.Ticker.getNowTime() - time);
            while (ns.Ticker.tickTimes.length > 100) {
                ns.Ticker.tickTimes.pop();
            }
            ns.Ticker.times.unshift(time);
            while (ns.Ticker.times.length > 100) {
                ns.Ticker.times.pop();
            }
        };
        Ticker.setup = function () {
            if (ns.Ticker.timerId != null) {
                return;
            } // avoid duplicates
            var mode = ns.Ticker.timingMode || (ns.Ticker.useRAF && ns.Ticker.RAF_SYNCHED);
            if (mode == ns.Ticker.RAF_SYNCHED || mode == ns.Ticker.RAF) {
                var f = window.requestAnimationFrame || window["webkitRequestAnimationFrame"] || window["mozRequestAnimationFrame"] || window["oRequestAnimationFrame"] || window["msRequestAnimationFrame"];
                if (f) {
                    ns.Ticker.timerId = f(mode == ns.Ticker.RAF ? ns.Ticker.handleRAF : ns.Ticker.handleSynch);
                    ns.Ticker.raf = true;
                    return;
                }
            }
            ns.Ticker.raf = false;
            ns.Ticker.timerId = setTimeout(ns.Ticker.handleTimeout, ns.Ticker.m_interval);
        };
        Ticker.RAF_SYNCHED = "synched";
        Ticker.RAF = "raf";
        Ticker.m_inited = false;
        Ticker.now = window.performance && (performance.now || performance["mozNow"] || performance["msNow"] || performance["oNow"] || performance["webkitNow"]);
        Ticker.startTime = 0;
        Ticker.pausedTime = 0;
        Ticker.ticks = 0;
        Ticker.pausedTicks = 0;
        Ticker.m_interval = 50;
        Ticker.lastTime = 0;
        Ticker.times = null;
        Ticker.tickTimes = null;
        Ticker.runTime = null;
        Ticker.raf = true;
        Ticker.TIMEOUT = "timeout";
        Ticker.useRAF = false;
        Ticker.timingMode = null;
        Ticker.maxDelta = 0;
        Ticker.paused = false;
        Ticker.dispatch = ns.dispatch("tick");
        return Ticker;
    }());
    ns.Ticker = Ticker;
    ns.rebind(Ticker, Ticker.dispatch, "on");
    ns.Ticker["_on"] = ns.Ticker["on"];
    ns.Ticker["on"] = function (evn, fn) {
        if (!ns.Ticker.m_inited) {
            ns.Ticker.init();
        }
        ns.Ticker["_on"].apply(ns.Ticker, arguments);
    };
    ns.rebind(Ticker, Ticker.dispatch, "off");
    var Tween = (function () {
        function Tween(target, props, pluginData) {
            this.ignoreGlobalPause = false;
            this.loop = false;
            this.duration = 0;
            this.pluginData = null;
            this._paused = false;
            this._curQueueProps = null;
            this._initQueueProps = null;
            this._steps = null;
            this._actions = null;
            this._prevPosition = 0;
            this._stepPosition = 0;
            this._prevPos = -1;
            this._target = null;
            this._useTicks = false;
            this.initialize = function (target, props, pluginData) {
                this._target = target;
                if (props) {
                    this._useTicks = props.useTicks;
                    this.ignoreGlobalPause = props.ignoreGlobalPause;
                    this.loop = props.loop;
                    if (props.override) {
                        Tween.removeTweens(target);
                    }
                    if (props.onchanged) {
                        this.on("onchanged", props.onchanged);
                    }
                }
                this.pluginData = pluginData || {};
                this._curQueueProps = {};
                this._initQueueProps = {};
                this._steps = [];
                this._actions = [];
                this._catalog = [];
                if (!props || !props.paused) {
                    this.register(this, true);
                }
                if (props && props.position != null) {
                    this.setPosition(props.position, Tween.NONE);
                }
                return this;
            };
            this.wait = function (duration) {
                if (duration == null || duration <= 0) {
                    return this;
                }
                var o = this._cloneProps(this._curQueueProps);
                return this._addStep({ d: duration, p0: o, e: this._linearEase, p1: o });
            };
            this.w = this.wait;
            this.t = this.to;
            this.c = this.call;
            this.s = this.set;
            this.dispatch = ns.dispatch("onchanged", "oncompleted");
            ns.rebind(this, this.dispatch, "on");
            ns.rebind(this, this.dispatch, "off");
            this.initialize(target, props, pluginData);
        }
        Tween.get = function (target, props, pluginData) { return new Tween(target, props, pluginData); };
        Tween.prototype.to = function (props, duration, ease) {
            if (isNaN(duration) || duration < 0) {
                duration = 0;
            }
            return this._addStep({ d: duration || 0, p0: this._cloneProps(this._curQueueProps), e: ease, p1: this._cloneProps(this._appendQueueProps(props)) });
        };
        Tween.prototype.call = function (callback, params, scope) {
            return this._addAction({ f: callback, p: params ? params : [this], o: scope ? scope : this._target });
        };
        Tween.prototype.set = function (props, target) {
            return this._addAction({ f: this._set, o: this, p: [props, target ? target : this._target] });
        };
        Tween.prototype.play = function (tween) {
            return this.call(tween.setPaused, [false], tween);
        };
        Tween.prototype.pause = function (tween) {
            if (!tween) {
                tween = this;
            }
            return this.call(tween.setPaused, [true], tween);
        };
        Tween.prototype.setPosition = function (value, actionsMode) {
            if (value < 0) {
                value = 0;
            }
            if (actionsMode == null) {
                actionsMode = 1;
            }
            // normalize position:
            var t = value;
            var end = false;
            if (t >= this.duration) {
                if (this.loop) {
                    t = t % this.duration;
                }
                else {
                    t = this.duration;
                    end = true;
                }
            }
            if (t == this._prevPos) {
                return end;
            }
            // handle tweens:
            if (this._target) {
                if (end) {
                    // addresses problems with an ending zero length step.
                    this._updateTargetProps(null, 1);
                }
                else if (this._steps.length > 0) {
                    // find our new tween index:
                    for (var i = 0, l = this._steps.length; i < l; i++) {
                        if (this._steps[i].t > t) {
                            break;
                        }
                    }
                    var step = this._steps[i - 1];
                    this._updateTargetProps(step, (this._stepPosition = t - step.t) / step.d, t);
                }
            }
            // run actions:
            var prevPos = this._prevPos;
            this._prevPos = t; // set this in advance in case an action modifies position.
            this._prevPosition = value;
            if (actionsMode != 0 && this._actions.length > 0) {
                if (this._useTicks) {
                    // only run the actions we landed on.
                    this._runActions(t, t);
                }
                else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                }
                else {
                    this._runActions(prevPos, t);
                }
            }
            if (end) {
                this.setPaused(true);
            }
            if (this.dispatch.onchanged) {
                this.dispatch.onchanged.call(this, this._target);
            }
            return end;
        };
        Tween.prototype.tick = function (delta) {
            if (this._paused) {
                return;
            }
            this.setPosition(this._prevPosition + delta);
        };
        Tween.prototype.setPaused = function (value) {
            if (this._paused != !!value) {
                this._paused = !!value;
                this.register(this, !value);
            }
            return this;
        };
        Tween.prototype.clone = function () {
            throw ("Tween can not be cloned.");
        };
        Tween.prototype.toString = function () {
            return "[Tween]";
        };
        Tween.prototype._updateTargetProps = function (step, ratio, position) {
            var p0, p1, v, v0, v1, arr;
            if (!step && ratio == 1) {
                p0 = p1 = this._curQueueProps;
            }
            else {
                // apply ease to ratio.
                if (step.e) {
                    ratio = step.e(ratio, 0, 1, 1);
                }
                p0 = step.p0;
                p1 = step.p1;
            }
            for (var n in this._initQueueProps) {
                if ((v0 = p0[n]) == null) {
                    p0[n] = v0 = this._initQueueProps[n];
                }
                if ((v1 = p1[n]) == null) {
                    p1[n] = v1 = v0;
                }
                if (v0 == v1 || ratio == 0 || ratio == 1 || (typeof (v0) != "number")) {
                    // no interpolation - either at start, end, values don't change, or the value is non-numeric.
                    v = ratio == 1 ? v1 : v0;
                }
                else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = Tween.plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, position, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        }
                        else {
                            v = v2;
                        }
                    }
                }
                if (!ignore) {
                    this._target[n] = v;
                }
            }
        };
        Tween.prototype._runActions = function (startPos, endPos, includeStart) {
            var sPos = startPos;
            var ePos = endPos;
            var i = -1;
            var j = this._actions.length;
            var k = 1;
            if (startPos > endPos) {
                // running backwards, flip everything:
                sPos = endPos;
                ePos = startPos;
                i = j;
                j = k = -1;
            }
            while ((i += k) != j) {
                var action = this._actions[i];
                var pos = action.t;
                if (pos == ePos || (pos > sPos && pos < ePos) || (includeStart && pos == startPos)) {
                    action.f.apply(action.o, action.p);
                    if (this.dispatch.oncompleted) {
                        this.dispatch.oncompleted.call(this, action.o, action.p);
                    }
                }
            }
        };
        Tween.prototype._appendQueueProps = function (o) {
            var arr, value, v2;
            for (var n in o) {
                if (this._initQueueProps[n] == null) {
                    value = this._target[n];
                    // init plugins:
                    if (arr = ns.Tween.plugins[n]) {
                        for (var i = 0, l = arr.length; i < l; i++) {
                            v2 = arr[i].init(this, n, value);
                            if (v2 != Tween.IGNORE) {
                                value = v2;
                            }
                        }
                    }
                    this._initQueueProps[n] = value;
                }
                this._curQueueProps[n] = o[n];
            }
            return this._curQueueProps;
        };
        Tween.prototype._cloneProps = function (props) {
            var o = {};
            for (var n in props) {
                o[n] = props[n];
            }
            return o;
        };
        Tween.prototype._addStep = function (o) {
            if (o.d > 0) {
                this._steps.push(o);
                o.t = this.duration;
                this.duration += o.d;
            }
            return this;
        };
        Tween.prototype._addAction = function (o) {
            o.t = this.duration;
            this._actions.push(o);
            return this;
        };
        Tween.prototype._set = function (props, o) {
            for (var n in props) {
                o[n] = props[n];
            }
        };
        Tween.prototype.remove = function () {
            ns.Tween.removeTweens(this._target);
        };
        Tween.tick = function (delta, paused) {
            var _tweens = ns.Tween.tweens, tween;
            for (var i = _tweens.length - 1; i >= 0; i--) {
                tween = _tweens[i];
                if (paused && !tween.ignoreGlobalPause) {
                    continue;
                }
                tween.tick(tween._useTicks ? 1 : delta);
            }
        };
        Tween.removeTweens = function (target) {
            if (!target.tweenjs_count) {
                return;
            }
            var _tweens = ns.Tween.tweens;
            for (var i = _tweens.length - 1; i >= 0; i--) {
                if (_tweens[i]._target == target) {
                    _tweens.splice(i, 1);
                }
            }
            target.tweenjs_count = 0;
        };
        Tween.installPlugin = function (plugin, properties) {
            var priority = plugin.priority;
            if (priority == null) {
                plugin.priority = priority = 0;
            }
            for (var i = 0, l = properties.length, p = ns.Tween.plugins; i < l; i++) {
                var n = properties[i];
                if (!p[n]) {
                    p[n] = [plugin];
                }
                else {
                    var arr = p[n];
                    for (var j = 0, jl = arr.length; j < jl; j++) {
                        if (priority < arr[j].priority) {
                            break;
                        }
                    }
                    p[n].splice(j, 0, plugin);
                }
            }
        };
        Tween.prototype.register = function (tween, value) {
            var target = tween._target;
            if (value) {
                if (target) {
                    target.tweenjs_count = target.tweenjs_count ? target.tweenjs_count + 1 : 1;
                }
                ns.Tween.tweens.push(tween);
            }
            else {
                if (target) {
                    target.tweenjs_count--;
                }
                var i = ns.Tween.tweens.indexOf(tween);
                if (i != -1) {
                    ns.Tween.tweens.splice(i, 1);
                }
            }
        };
        Tween.NONE = 0;
        Tween.LOOP = 1;
        Tween.REVERSE = 2;
        Tween.IGNORE = {};
        Tween.tweens = [];
        Tween.plugins = {};
        return Tween;
    }());
    ns.Tween = Tween;
    if (ns.Ticker) {
        ns.Ticker["on"]("tick", function (e) {
            ns.Tween.tick(e.delta, e.paused);
        });
    }
    var tag = (function () {
        function tag(tag, parent) {
            this.tag = "body";
            this.html = "";
            this.cssHtml = "";
            this.callbacks = [];
            this.id = "idtag_" + ns.guid();
            this.events = [];
            this._text = "";
            this._data = [];
            this.isrendered = false;
            this.tag = tag || this.tag;
            this.parent = parent;
            if (this.parent) {
                this.root = this.parent.root;
            }
            else {
                this.root = this;
            }
            var me = this;
            "click,dbclick,blur,mouseover,mouseout,mousemove,changed,keydown,keyup".split('.').forEach(function (d) {
                me[this] = function (fn, filter) { me.event(d, fn, filter); };
            });
            this["hover"] = function (onFn, outFn, filter) {
                if (!(outFn instanceof Function)) {
                    outFn = null;
                    filter = outFn;
                }
                if (onFn) {
                    me.event("mouseover", onFn, filter);
                    me.event("mousemove", onFn, filter);
                }
                if (outFn) {
                    me.event("mouseout", outFn, filter);
                }
            };
        }
        tag.body = function () { return new ns.tag().begin(); };
        tag.div = function (exp) { return new ns.tag("div").begin(exp); };
        tag.table = function (exp) { return new ns.tag("table").begin(exp); };
        tag.iframe = function (exp) { return new ns.tag("iframe").begin(exp); };
        tag.frame = function (exp) { return new ns.tag("frame").begin(exp); };
        tag.p = function (exp) { return new ns.tag("p").begin(exp); };
        tag.ul = function (exp) { return new ns.tag("ul").begin(exp); };
        tag.header = function (exp) { return new ns.tag("header").begin(exp); };
        tag.style = function (src) { return new ns.tag("link").begin().attr({ rel: "stylesheet", href: src }).end().render(ns.select("head")); };
        tag.script = function (src) { return new ns.tag("script").begin().attr({ type: "text/javascript", src: src }).end().render(); };
        tag.landing = function (parent, callback) {
            var t = ns.tag.div()
                .css({ position: "fixed", left: "450px;", top: "230px;" })
                .style().text("@-webkit-keyframes vague7 { 0% { height: 5px;} 50% { height: 30px;}100% { height: 5px;}} @keyframes vague7 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }"
                + "@-webkit-keyframes vague2 { 0% { height: 5px;}50% { height: 30px;}100% { height: 5px;}} @keyframes vague2 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }"
                + "@-webkit-keyframes vague3 { 0% { height: 5px;}50% { height: 30px;}100% { height: 5px;}} @keyframes vague3 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }"
                + "@-webkit-keyframes vague4 { 0% { height: 5px;}50% { height: 30px;}100% { height: 5px;}} @keyframes vague4 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }"
                + "@-webkit-keyframes vague5 { 0% { height: 5px;}50% { height: 30px;}100% { height: 5px;}} @keyframes vague5 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }"
                + "@-webkit-keyframes vague6 { 0% { height: 5px;}50% { height: 30px;}100% { height: 5px;}} @keyframes vague6 {0% { height: 5px;} 50% { height: 30px;}100% {height: 5px;} }").end()
                .div().css({ color: "#886ed7", "text-align": "center", position: "relative" }).text("<p>loading</p>")
                .end()
                .div().css({ position: "relative" })
                .div().attr({ id: "vague1" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague7 2.5s infinite", "-webkit-animation": "vague7 2.5s infinite", "animation-delay": "0s", "-webkit-animation-delay": "0s" }).end()
                .div().attr({ id: "vague2" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague2 2.5s infinite", "-webkit-animation": "vague2 2.5s infinite", "animation-delay": "0.5s", "-webkit-animation-delay": "0.5s" }).end()
                .div().attr({ id: "vague3" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague3 2.5s infinite", "-webkit-animation": "vague3 2.5s infinite", "animation-delay": "1s", "-webkit-animation-delay": "1s" }).end()
                .div().attr({ id: "vague4" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague4 2.5s infinite", "-webkit-animation": "vague4 2.5s infinite", "animation-delay": "1.5s", "-webkit-animation-delay": "1.5s" }).end()
                .div().attr({ id: "vague5" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague5 2.5s infinite", "-webkit-animation": "vague5 2.5s infinite", "animation-delay": "2s", "-webkit-animation-delay": "2s" }).end()
                .div().attr({ id: "vague6" }).css({ height: "5px", width: "5px", margin: "5px;", float: "left", "background-color": "#886ed7", "animation": "vague6 2.5s infinite", "-webkit-animation": "vague6 2.5s infinite", "animation-delay": "2.5s", "-webkit-animation-delay": "2.5s" }).end()
                .end()
                .end().render(parent, false);
            callback ? callback.call(t, parent) : null;
            return t;
        };
        tag.landingline = function (parent, config) {
            if (typeof config === "function") {
                config = { callback: config };
            }
            if (!config) {
                config = {};
            }
            config.override = config.override || -1;
            if (config.override < 0) {
                config.override = 0;
            }
            config.time = config.time || 3;
            config.width = config.width || 5;
            config.background = config.backround || "#886ed7";
            config.height = config.height || 1;
            config.delay = config.delay || 0;
            var t = ns.tag.div(".landing-line-container").if(!!config.id, function () { this.id = config.id; })
                .style().text("@-webkit-keyframes landingline_animate { 0% { margin-left: 0;} 5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}} @keyframes landingline_animate { 0% { margin-left: 0;}5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}}").end()
                .div().attr({}).css({ height: config.height + "px", width: config.width + "%", margin: "0px;", float: "left", "background-color": config.background, "animation": "landingline_animate " + config.time + "s infinite", "-webkit-animation": "landingline_animate " + config.time + "s infinite", "animation-delay": config.delay + "s", "-webkit-animation-delay": config.delay + "s", ";": config.csstext || ";" }).end()
                .end().render(parent, config.override);
            config.callback ? config.callback.call(t, parent) : null;
            t.hide = function () {
                t._ns.hide();
            };
            t.show = function () { t._ns.show(); };
            if (config.hide) {
                t.hide();
            }
            return t;
        };
        tag.timepicker = function (conf) {
            function context_s() { }
            if (!conf) {
                conf = {};
            }
            var context = new context_s();
            context.mesh = "hmh" || "";
            context.min = conf.min;
            if (!context.min) {
                context.min = 0;
            }
            context.max = conf.max || 24;
            context.width = conf.width || "210px";
            context.height = conf.height || "98%";
            context.top = conf.top || "200px;";
            context.left = conf.left || "auto;";
            context.right = conf.right || "auto;";
            context.zindex = conf.zindex || 99;
            context.value = "";
            context.hours = "";
            context.mins = "";
            context.format = conf.format || "hh:mm:ss";
            var container = ns.tag.div(".timepicker-lay *float:left;width:100%;position:absolute;left:0px;top:0px;min-height:280px;height:100%;overflow-y:auto;;z-index:" + context.zindex).css({ "box-shadow": "gray 0 0 30px;", "background-color": "rgba(0, 0, 0, 0.12);" })
                .event("click", function () { context.container.hide(); })
                .style().text(".timepicker-item{ border-bottom-color:#e0e0e0;border-top-color:#e0e0e0;} .timepicker-item:hover{ border-bottom-color:#d4e5f5;border-top-color:#d4e5f5;background-color:#d4e5f5;}").end()
                .end().render("body");
            context.container = container.ns();
            context.renderHours = function (mesh) {
                var data = [];
                var min = context.min;
                mesh = mesh.toLowerCase();
                if (mesh == "h") {
                    for (; min < context.max; min++) {
                        data.push(min + ":00");
                    }
                }
                else if (mesh == "hh") {
                    for (; min < context.max; min++) {
                        data.push(ns.fixNumberString(min, 2) + ":00");
                    }
                }
                else if (mesh == "hmh") {
                    for (; min < context.max; min++) {
                        data.push(min + ":00");
                        data.push(min + ":30");
                    }
                }
                else if (mesh == "hhmh") {
                    for (; min < context.max; min++) {
                        data.push(ns.fixNumberString(min, 2) + ":00");
                        data.push(ns.fixNumberString(min, 2) + ":30");
                    }
                }
                context.height = (10 + 32 * data.length) + "px";
                ns.tag.div(".timepicker-wrap *width:" + context.width + ";margin-left:" + context.left + ";background-color:white;height:" + context.height + ";margin-right:" + context.right + ";margin-top:10px;margin-bottom:10px;border-radius:5px;").ul("*list-style:none;margin:0px;padding:0px;")
                    .li("*height:10px;line-height:5px;font-weight:500;display:inline-block;float:left;width:100%;background-color:#808080;border-top-left-radius:5px;border-top-right-radius:5px;").end()
                    .datum(data).list(function (d) {
                    this.li(".timepicker-item *height:30px;line-height:30px;font-size:18px;font-weight:500;border-bottom-width:1px;border-bottom-style:solid;margin-bottom:-1px;border-top-width:1px;border-top-style:solid;cursor:pointer;display:inline-block;float:left;width:100%;")
                        .event("click", function (e) {
                        var ds = d.split(":");
                        context.hours = ds[0];
                        context.mins = ds[1];
                        context.clickCallback(d, "h", mesh, this, e);
                    }).span("*margin-left:15px;display:inline-block").text(d).end()
                        .end();
                })
                    .li("*height:70px;line-height:5px;font-weight:500;display:inline-block;float:left;width:100%;background-color:#808080;border-bottom-left-radius:5px;border-bottom-right-radius:5px;margin-top:auto;margin-bottom:0px;")
                    .span(" *margin-left:15px;display:inline-block;color:white;margin-top:20px;cursor:pointer;").text("Close").event("click", function () { context.container.hide(); }).end()
                    .end()
                    .end().end()
                    .render(context.container);
                context.dispatch.rendered.call(this, mesh, data);
            };
            context.clickCallback = function (val, type, mesh, target, e) {
                context.container.hide();
                context.dispatch.selected.call(this, val, type, mesh, target, e);
            };
            context.dispatch = ns.dispatch("selected", "rendered");
            context.renderMins = function (mesh) {
                var data = [];
                var min = context.min;
                var d = 1;
                if (/m{1,2}(\d+)/i.test(mesh)) {
                    d = window["parseInt"](/m{1,2}(\d+)/i.exec(mesh)[1]);
                }
                if (/mm/.test(mesh)) {
                    for (var i = 0; i < 60; i = i + d) {
                        data.push(ns.fixNumberString(i, 2));
                    }
                }
                else {
                    for (var i = 0; i < 60; i = i + d) {
                        data.push(i);
                    }
                }
                context.height = (10 + 32 * data.length) + "px";
                ns.tag.div(".timepicker-wrap *width:" + context.width + ";margin-left:" + context.left + ";background-color:white;height:" + context.height + ";margin-right:" + context.right + ";margin-top:10px;margin-bottom:10px;border-radius:5px;").ul("*list-style:none;margin:0px;padding:0px;")
                    .li("*height:10px;line-height:5px;font-weight:500;display:inline-block;float:left;width:100%;background-color:#808080;border-top-left-radius:5px;border-top-right-radius:5px;").end()
                    .datum(data).list(function (d) {
                    this.li(".timepicker-item *height:30px;line-height:30px;font-size:18px;font-weight:500;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e0e0e0;margin-bottom:-1px;border-top-width:1px;border-top-style:solid;border-top-color:#e0e0e0;cursor:pointer;display:inline-block;float:left;width:100%;")
                        .event("click", function () {
                        context.mins = d;
                        context.clickCallback(d, "m", mesh, this);
                    }).span("*margin-left:15px;display:inline-block").text(d).end()
                        .end();
                })
                    .li("*height:70px;line-height:5px;font-weight:500;display:inline-block;float:left;width:100%;background-color:#808080;border-bottom-left-radius:5px;border-bottom-right-radius:5px;margin-top:auto;margin-bottom:0px;")
                    .span("*margin-left:15px;display:inline-block;color:white;margin-top:20px;cursor:pointer;").text("Close").event("click", function () { context.container.hide(); }).end()
                    .end()
                    .end().end()
                    .end().render(context.container);
                context.dispatch.rendered.call(this, mesh, data);
            };
            context.render = function (format) { };
            return context;
        };
        tag.datetimepicker = function (conf) {
            function context_s() { }
            ;
            var context = new context_s();
            if (typeof conf === "function") {
                conf = { callback: conf };
            }
            if (!conf) {
                conf = {};
            }
            context.format = conf.format || "yyyy-MM-dd hh:mm:ss";
            conf.override = conf.override || -1;
            conf.background = conf.backround || "#886ed7";
            conf.changed = conf.changed || function () { };
            conf.startSun = conf.startSun == null ? false : conf.startSun;
            conf.minDate = new Date();
            context.parent = conf.parent;
            context.zindex = conf.zindex || 99;
            var currentDate = new Date();
            conf.headformat = conf.headformat || "hans";
            context.width = 210;
            context.height = 25;
            context.headformats = {
                "short": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                "full": ["Sunday", "Monday", "Tuesday", "Wendnesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "hans": ["日", "一", "二", "三", "四", "五", "六", "日"],
            };
            context.monthdays = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            //
            context.input = new ns.tag("input").begin("*width:" + context.width + "px;height:" + context.height + "px;line-height:" + context.height + "px;cursor:default; " + conf.css || "").event("click", function () {
                context.container.show();
                context.render();
                context.container.css();
                var selector = ns.select(this);
                var c = selector.getBoundingRect(), y = c.top + (ns.scrollTop() || 0), x = c.left + (ns.scrollLeft() || 0), w = c.width, h = c.height;
                var abottom = true;
                if (y - 10 - selector.getBoundingHeight() - 10 < 0) {
                    abottom = false;
                }
                if (!abottom) {
                    //arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": (context.object.getBoundingHeight() - 2) + "px", "border-color": fill + " transparent transparent transparent" });
                    context.container.css({ "left": (x + 8) + "px", "top": (y - context.object.getBoundingHeight() - 10) + "px", }); // "background-color": fill, "border-color": fill 
                }
                else {
                    //arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + fill + " transparent" });
                    context.container.css({ "left": (x + 8) + "px", "top": (y + h + 10) + "px", }); //"background-color": fill, "border-color": fill
                }
            }).attr({ type: "textbox", readonly: true }).end()
                .render(context.parent);
            var container = ns.tag.div("*z-index:" + context.zindex + ";text-align:left;width:" + context.width + "px;line-height:19.2px;font-size:16px;display:none;position:absolute;border-color:#e0e0e0;border-width:0.1px;border-style:solid;background-color:white;").attr({})
                .style().text(".datepicker-left-arrow{width:0px;height:0px;margin:0px;padding:0px;border-top:7px solid transparent;border-right:14px solid black;border-bottom:7px solid transparent;  }.datepicker-right-arrow{width:0px;height:0px;margin:0px;padding:0px;border-top:7px solid transparent;border-left:14px solid black;border-bottom:7px solid transparent;  }.datetimepicker-old{ color:#999999;}.datetimepicker-disabled{ color:#999999;}.datetimepicker-new{ color:#999999;}.datetimepicker{height:30px;line-height:30px;} .datetimepicker-pick:hover{color:black;background-color:#d4e5f5;}.datetimepicker-disabled:hover{color:black;background-color:#fafafa;color:#888888;}  .datetimepicker-current{color:black;background-color:#d4e5f5;}").end()
                .div(".datepicker-header *font-weight:200;line-height:28px;text-align:center;width:100%;height:28px;")
                .div(".datepicker-left-arrow  *float:left;margin-left:1%;margin-top:8px;").event("click", function () { context.goPrev(); }).end()
                .div("*width:85%;height:28px;float:left;").host("titleContainer", context)
                .end()
                .div(".datepicker-right-arrow *float:left;margin-top:8px;").event("click", function () { context.goNext(); }).end()
                .end()
                .table("*margin-left:2%;margin-right:2%;width:96%").host("contentContainer", context).attr({ class: "ns_datepicker" }).css({})
                .end()
                .end()
                .end().render();
            //ns.select("body").on("click", function (e) {
            //    if (e.target != container.ns().selected[0]) {
            //        var date = new Date(context.year, context.month - 1, context.day, context.hour, context.minute, context.second);
            //        context.value(date);
            //        return;
            //    }
            //});
            context.goPrev = function () {
                var date = new Date(context.year, context.month, context.day, context.hour, context.minute, context.second);
                if (context.currentType == "year") {
                    context.categories.year.start -= 20;
                    context.renderYears(context.categories.year.mesh, context.categories.year.start);
                }
                else if (context.currentType == "month") {
                    context.year -= 1;
                    context.renderMonth(context.categories.month.mesh);
                }
                else if (context.currentType == "day") {
                    context.month -= 1;
                    if (context.month <= 0) {
                        context.year -= 1;
                        context.month = 12;
                    }
                    context.renderDays(context.categories.day.mesh);
                }
                else if (context.currentType == "hour") {
                    context.day -= 1;
                    if (context.day <= 0) {
                        context.month -= 1;
                        if (context.month <= 0) {
                            context.year -= 1;
                            context.month = 12;
                        }
                        context.day = context.month == 2 ? ((context.year % 400 === 0 || context.year % 4 === 0) ? 29 : 28) : context.monthdays[context.month];
                    }
                    context.renderHours(context.categories.hour.mesh);
                }
                else if (context.currentType == "minute") {
                    context.hour -= 1;
                    context.renderMins(context.categories.minute.mesh);
                }
                else if (context.currentType == "second") {
                    context.minute -= 1;
                    context.renderSecond(context.categories.second.mesh);
                }
            };
            context.goNext = function () {
                if (context.currentType == "year") {
                    context.categories.year.start += 20;
                    context.renderYears(context.categories.year.mesh, context.categories.year.start);
                }
                else if (context.currentType == "month") {
                    context.year += 1;
                    context.renderMonth(context.categories.month.mesh);
                }
                else if (context.currentType == "day") {
                    context.month += 1;
                    if (context.month > 12) {
                        context.year += 1;
                        context.month = 1;
                    }
                    context.renderDays(context.categories.day.mesh);
                }
                else if (context.currentType == "hour") {
                    context.day += 1;
                    if (context.day > (context.month == 2 ? ((context.year % 400 === 0 || context.year % 4 === 0) ? 29 : 28) : context.monthdays[context.month])) {
                        context.month += 1;
                        if (context.month > 12) {
                            context.year += 1;
                            context.month = 1;
                        }
                        context.day = 1;
                    }
                    context.renderHours(context.categories.hour.mesh);
                }
                else if (context.currentType == "minute") {
                    context.hour += 1;
                    context.renderMins(context.categories.minute.mesh);
                }
                else if (context.currentType == "second") {
                    context.minute += 1;
                    context.renderSecond(context.categories.second.mesh);
                }
            };
            context.updateYearValue = function (year) {
                context.year = year;
                context.container.find(".datetimepicker-year").text(year);
            };
            context.container = container.ns();
            context.renderHours = function (mesh, min, max, y, m, d) {
                context.currentType = "hour";
                var showDates = [[]];
                var fixnumber = 1;
                if (/hh/i.test(mesh)) {
                    fixnumber = 2;
                }
                min = 0 || min;
                max = max || 23;
                var hours = new Date().getHours();
                for (var i = 0, j = -1; i < 24; i++) {
                    if (i % 4 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: ns.fixNumberString(i, 2) + ":00", h: (i < min || i > max ? " datetimepicker-disabled  " : "") + (hours == i ? " datetimepicker-current" : "") + " datetimepicker-pick", ho: i, m: context.month, d: context.day, y: context.year });
                }
                ns.tag.div(".datepicker-title *float:left;width:100%;text-align:center")
                    .div(".datetimepicker-year *width:25%;float:left;color:#999999;font-weight:500;line-height:28px;line-height:28px;text-align:center;margin-left:20px").text(context.year).end()
                    .div(".datetimepicker-month *width:25%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.month).end()
                    .div(".datetimepicker-month *width:25%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.day).end()
                    .end().render(context.titleContainer, true);
                new ns.tag("tbody").begin().datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("hour", { year: b.y, month: b.m, day: b.d, hour: b.ho }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() && currentDate.getMonth() == b.m && currentDate.getDate() === b.d ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.renderDays = function () {
                context.currentType = "day";
                var currentDate = new Date();
                var showDates = [[]];
                var month = context.month;
                var year = context.year;
                var preyear = context.year;
                var week = (conf.startSun ? 0 : -1) + new Date(year, month - 1, 1).getDay();
                var day = month === 2 && (year % 400 === 0 || year % 4 === 0) ? 29 : (month === 2 ? 28 : context.monthdays[month]);
                var month_1 = month - 1;
                preyear = month_1 < 1 ? preyear - 1 : preyear;
                month_1 = month_1 < 1 ? 12 : month_1;
                var predays = month_1 === 2 && (preyear % 400 === 0 || preyear % 4 === 0) ? 29 : (month_1 === 2 ? 28 : context.monthdays[month_1]);
                if (week <= 0) {
                    week = 7;
                }
                var j = 0;
                for (var i = 1; i <= week; i++) {
                    showDates[0].push({ text: predays - week + i, m: month_1, h: "datetimepicker-old", d: predays - week + i, y: preyear });
                }
                for (var i = week, k = 1; i < day + week; i++, k++) {
                    if (i % 7 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: k, h: "datetimepicker-current-month", m: month, d: k, y: year });
                }
                for (var i = week + day, k = 1; i < 42; i++, k++) {
                    if (i % 7 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: k, h: "datetimepicker-new", m: month + 1, d: k, y: year });
                }
                var title = year + "-" + new Date().getDate();
                ns.tag.div(".datepicker-title *float:left;width:100%;text-align:center")
                    .div(".datetimepicker-year *width:30%;float:left;color:#999999;font-weight:500;line-height:28px;line-height:28px;text-align:center;margin-left:20px").text(context.year).end()
                    .div(".datetimepicker-month *width:35%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.month).end()
                    .end().render(context.titleContainer, true);
                new ns.tag("tbody").begin()
                    .tr().datum(conf.startSun ? context.headformats[conf.headformat].slice(0, 7) : context.headformats[conf.headformat].slice(1, 8)).list(function (d) { this.td("*text-align:center;color:#999999;").attr({ class: "datepicker_dow" }).text(d).end(); }).end().end().host("list", context).datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("day", { year: b.y, month: b.m, day: b.d }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() && currentDate.getMonth() + 1 == b.m && currentDate.getDate() === b.d ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.renderMonth = function (mesh, min, max) {
                context.currentType = "month";
                var currentDate = new Date();
                var y = context.year;
                var showDates = [[]];
                var fixnumber = 1;
                if (/MM/i.test(mesh)) {
                    fixnumber = 2;
                }
                min = 0 || min;
                max = max || 12;
                showDates[0] = [];
                var hours = new Date().getHours();
                for (var i = 0, j = 0; i < 12; i++) {
                    if (i % 3 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: ns.fixNumberString(i + 1, fixnumber), h: (i < min || i > max ? " datetimepicker-disabled  " : "") + (hours == i ? " datetimepicker-current" : "") + " datetimepicker-pick", m: i + 1, y: y });
                }
                ns.tag.div(".datepicker-title *float:left;width:100%")
                    .div(".datetimepicker-year *width:18%;float:left;color:#999999;font-weight:500;line-height:28px;line-height:28px;text-align:center;width:98%;").text(y).end()
                    .end().render(context.titleContainer, true);
                new ns.tag("tbody").begin().datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("month", { year: b.y, month: b.m }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() && (currentDate.getMonth() + 1) == b.m ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.renderYears = function (mesh, start, min, max) {
                context.currentType = "year";
                var currentDate = new Date();
                var showDates = [[]];
                var fixnumber = 4;
                if (!start) {
                    start = new Date().getFullYear() - 10;
                }
                if (/yyyy/i.test(mesh)) {
                    fixnumber = 4;
                }
                var y = new Date().getFullYear();
                min = 0 || min;
                max = max || Number.MAX_VALUE;
                showDates[0] = [];
                var t = start;
                for (var i = 0, j = -1; i < 20; i++) {
                    t = start + i;
                    if (i % 4 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: ns.fixNumberString(t, fixnumber), h: (t < min || t > max ? " datetimepicker-disabled  " : "") + (start == y ? " datetimepicker-current" : "") + " datetimepicker-pick", y: t });
                }
                new ns.tag("tbody").begin().datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("year", { year: b.y, ytext: b.text }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.renderMins = function (mesh, min, max, y, m, d, h) {
                context.currentType = "minute";
                var currentDate = new Date();
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [[]];
                var fixnumber = 1;
                if (/mm/i.test(mesh)) {
                    fixnumber = 2;
                }
                min = 0 || min;
                max = max || 59;
                var mins = new Date().getMinutes();
                for (var i = 0, j = -1; i < 60; i++) {
                    if (i % 6 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: ns.fixNumberString(i, fixnumber), h: (i < min || i > max ? " datetimepicker-disabled  " : "") + (mins == i ? " datetimepicker-current" : "") + " datetimepicker-pick", mi: i, ho: context.hour, m: context.month, d: context.day, y: context.year });
                }
                ns.tag.div(".datepicker-title *float:left;width:100%;text-align:center")
                    .div(".datetimepicker-year *width:20%;float:left;color:#999999;font-weight:500;line-height:28px;line-height:28px;text-align:center;margin-left:10px").text(context.year).end()
                    .div("*float:left").text("-").end()
                    .div(".datetimepicker-month *width:14%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.month).end()
                    .div("*float:left").text("-").end()
                    .div(".datetimepicker-month *width:14%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.day).end()
                    .div("*float:left").text("&nbsp; ").end()
                    .div(".datetimepicker-month *width:20%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.hour + ":00").end()
                    .end().render(context.titleContainer, true);
                new ns.tag("tbody").begin().datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("mins", { year: b.y, month: b.m, day: b.d, hour: b.ho, minute: b.mi }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() && currentDate.getMonth() == b.m && currentDate.getDate() === b.d ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.renderSecond = function (mesh, min, max, y, m, d, h) {
                context.currentType = "second";
                var currentDate = new Date();
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [[]];
                var fixnumber = 1;
                if (/mm/i.test(mesh)) {
                    fixnumber = 2;
                }
                min = 0 || min;
                max = max || 59;
                var mins = new Date().getMinutes();
                for (var i = 0, j = -1; i < 60; i++) {
                    if (i % 6 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: ns.fixNumberString(i, fixnumber), h: (i < min || i > max ? " datetimepicker-disabled  " : "") + (mins == i ? " datetimepicker-current" : "") + " datetimepicker-pick", s: i, mi: context.minute, ho: context.hour, m: context.month, d: context.day, y: context.year });
                }
                ns.tag.div(".datepicker-title *float:left;width:100%;text-align:center")
                    .div(".datetimepicker-year *width:20%;float:left;color:#999999;font-weight:500;line-height:28px;line-height:28px;text-align:center;margin-left:10px").text(context.year).end()
                    .div("*float:left").text("-").end()
                    .div(".datetimepicker-month *width:14%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.month).end()
                    .div("*float:left").text("-").end()
                    .div(".datetimepicker-month *width:14%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.day).end()
                    .div("*float:left").text("&nbsp; ").end()
                    .div(".datetimepicker-month *width:20%;float:left;color:black;text-align:center;height:28px;line-height:28px;font-weight:500;").text(context.hour + ":" + ns.fixNumberString(context.minute, 2)).end()
                    .end().render(context.titleContainer, true);
                new ns.tag("tbody").begin().datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td("*text-align:center;height:25px;line-height:25px;  .datetimepicker-pick").event("click", function (e) {
                            if (ns.select(this).hasClass("datetimepicker-disbled")) {
                                return;
                            }
                            context.clickCallback("second", { year: b.y, month: b.m, day: b.d, hour: b.ho, minute: b.minute, second: b.s }, e);
                        }).attr({ class: "ns_datepicker_day " + b.h + " " + (b.y == currentDate.getFullYear() && currentDate.getMonth() == b.m && currentDate.getDate() === b.d ? " datetimepicker-current" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end().render(context.contentContainer, true);
            };
            context.render = function () {
                var exec = datetimepicker_reg.exec(context.format);
                if (exec[1]) {
                    if (exec[2] && /yy|yyyy/.test(exec[2])) {
                        context.hasYear = true;
                        context.categories.year = { mesh: exec[2], start: currentDate.getFullYear() - 10 };
                    }
                    if (exec[3] && /MM|MMM|M|MMMM/.test(exec[3])) {
                        context.hasMonth = true;
                        context.categories.month = { mesh: exec[3] };
                    }
                    if (exec[4] && /dd|d/.test(exec[4])) {
                        context.hasDay = true;
                        context.categories.day = { mesh: exec[4] };
                    }
                }
                if (exec[5]) {
                    if (exec[6] && /hh|h/.test(exec[6])) {
                        context.hasHour = true;
                        context.categories.hour = { mesh: exec[6] };
                    }
                    if (exec[7] && /mm|m/.test(exec[7])) {
                        context.hasMins = true;
                        context.categories.minute = { mesh: exec[7] };
                    }
                    if (exec[8] && /ss|s/.test(exec[8])) {
                        context.hasSecond = true;
                        context.categories.second = { mesh: exec[8] };
                    }
                }
                if (context.hasYear) {
                    context.renderYears(context.categories.year.mesh, context.categories.year.start);
                }
                else if (context.hasMonth) {
                    context.renderMonth(context.categories.month.mesh);
                }
                else if (context.hasDay) {
                    context.renderDays(context.categories.month.mesh);
                }
                else if (context.hasHour) {
                    context.renderHours(context.categories.month.mesh);
                }
                else if (context.hasMins) {
                    context.renderMins(context.categories.month.mesh);
                }
            };
            var datetimepicker_reg = /((yyyy|yy|y|yyy)\-(MM|M|MMM|MMMM)\-(dd|d))?(\s?(hh|h)\:?(mm|m|00)\:?(ss|s|00))?/;
            context.hasMonth = false;
            context.hasDay = false;
            context.hasHour = false;
            context.hasMins = false;
            context.hasSecond = false;
            context.hasYear = false;
            context.year = 0;
            context.month = 0;
            context.day = 0;
            context.hours = 0;
            context.mintue = 0;
            context.second = 0;
            context.date = null;
            context.categories = {};
            context.previousDatetimePicker = null;
            context.nextDatetimePicker = null;
            context.dateGap = null;
            context.clickCallback = function (type, value, e) {
                var end = false;
                if (type == "year") {
                    context.year = value.year;
                    console.log(context.year);
                    if (context.hasMonth) {
                        context.renderMonth(context.categories.mesh);
                    }
                }
                else if (type == "month") {
                    context.year = value.year;
                    context.month = value.month;
                    if (context.hasDay) {
                        context.renderDays(context.categories.mesh);
                    }
                }
                else if (type == "day") {
                    context.year = value.year;
                    context.month = value.month;
                    context.day = value.day;
                    if (context.hasHour) {
                        context.renderHours(context.categories.mesh);
                    }
                    else {
                        end = true;
                    }
                }
                else if (type == "hour") {
                    context.year = value.year;
                    context.month = value.month;
                    context.day = value.day;
                    context.hour = value.hour;
                    if (context.hasMins) {
                        context.renderMins(context.categories.mesh);
                    }
                    else {
                        end = true;
                    }
                }
                else if (type == "mins") {
                    context.year = value.year;
                    context.month = value.month;
                    context.day = value.day;
                    context.hour = value.hour;
                    context.minute = value.minute;
                    if (context.hasSecond) {
                        context.renderSecond(context.categories.mesh);
                    }
                    else {
                        end = true;
                    }
                }
                else if (type == "second") {
                    context.year = value.year;
                    context.month = value.month;
                    context.day = value.day;
                    context.hour = value.hour;
                    context.mintue = value.mintue;
                    context.second = value.second;
                    end = true;
                }
                context.selectedDate = new Date(context.year, context.month - 1, context.day, context.hour, context.minute, context.second);
                if (end) {
                    if (context.previousDatetimePicker != null && context.previousDatetimePicker.selectedDate > this.selectedDate) {
                        alert("不能选择比所关联的时间更小的时间");
                        return;
                    }
                    if (context.nextDatetimePicker != null && context.nextDatetimePicker.selectedDate < this.selectedDate) {
                        alert("不能选择比所关联的时间更大的时间");
                        return;
                    }
                    context.input.ns().value(context.selectedDate.format(context.format));
                    context.container.hide();
                }
            };
            context.value = function (v) {
                if (v) {
                    context.input.ns().value(v);
                    context.selectedDate = new Date(v);
                    return this;
                }
                return context.input.ns().value();
                ;
            };
            context.mesh = conf.mesh;
            //if (conf.previousDatetimePicker) {
            //    context.previouseDatetimePicker = conf.previouseDatetimePicker;
            //    conf.previouseDatetimePicker.nextDatetimePicker = context;
            //} else if (conf.nextDatetimePicker) {
            //    context.nextDatetimePicker = conf.nextDatetimePicker;
            //    conf.nextDatetimePicker.previouseDatetimePicker = context;
            //}
            //context.render();
            return context;
        };
        tag.hoverip = function (conf) {
            function hoverip() { }
            ;
            if (!conf) {
                conf = {};
            }
            var speed = conf.speed || 300, deplay = 300;
            var showed = false, selector = null, timerid, rendered = false, offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5, offsetY = conf.offsetY || 5, origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()), _html = conf.html || "<div id='" + id + "' style=\"display:none;width:" + (!conf.width ? "auto" : conf.width) + ";line-height: 20px;border-radius: 1px; box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding-top: 10px;padding-left: 5px;padding-bottom: 10px;pointer-events: none; position: absolute; \" class='ns-hovertip'><div class='ns-hovertip-contentbox'  style=\" font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>", _arrow = conf.arrowHtml || "<span class='ns-hovertip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: " + (conf.arrowWidth ? conf.arrowWidth : 10) + "px;border-style: solid;'></span>", _container = null, arrow = null, abottom = conf.bottom == null ? true : conf.bottom, isrunning = false, aleft = conf.left == null ? true : conf.left, fill = conf.fill == null ? "" : conf.fill, enableMove = conf.enableMove != null ? conf.enableMove : true, disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false, isrendered = false, deplayHide = conf.delayHide || 0, deplayHideTimerid, startingEventName = conf.startingEventName == null ? "mouseover" : conf.startingEventName, endingEventName = conf.endingEventName || "mouseout";
            var context = new hoverip();
            function trigger(e) {
                if (deplayHideTimerid) {
                    window.clearTimeout(deplayHideTimerid);
                }
                timerid = setTimeout(function () {
                    isrunning = true;
                    //dispatch["showing"].call(toolip, e);
                    context.show(e);
                    conf.show ? conf.show.call(this, null) : null;
                }, deplay);
            }
            context.cascading = function (dom) {
                if (dom) {
                    selector = ns.select(dom);
                }
                selector.on(startingEventName, function (e) {
                    trigger(e);
                }).on(endingEventName, function () {
                    if (deplayHide && showed) {
                        deplayHideTimerid = setTimeout(function () {
                            deplayHideTimerid = 0;
                            context.hide();
                            conf.hide ? conf.hide.call(this, null) : null;
                        }, deplayHide);
                    }
                    else {
                        showed ? context.hide() : window.clearTimeout(timerid);
                    }
                    isrunning = false;
                });
                return this;
            };
            context.render = function () {
                var c = selector.getBoundingRect(), y = c.top + (ns.scrollTop() || 0), x = c.left + (ns.scrollLeft() || 0), w = c.width, h = c.height;
                abottom = false;
                aleft = true;
                if (x - selector.getBoundingWidth() - offsetwidth - offsetX < 0) {
                    aleft = false;
                }
                if (y - offsetheight - selector.getBoundingHeight() - offsetY < 0) {
                    abottom = false;
                }
                if (disabledArrow) {
                    this.select(".ns-hovertip-arrow").hide(0);
                }
                if (/left|right/ig.test(origin)) {
                    if (/^right$/i.test(origin)) {
                        aleft = false;
                    }
                    if (aleft) {
                        arrow.css({ "left": (selector.getBoundingWidth()) + "px", "top": (h / 2 - arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": "transparent transparent transparent " + fill });
                        context.object.css({ "left": (x - selector.getBoundingWidth() - arrow.getBoundingWidth() - offsetX) + "px", "top": y + "px", "background-color": fill, "border-color": fill });
                    }
                    else {
                        arrow.css({ "left": (0 - arrow.getBoundingWidth()) + "px", "top": (h / 2 - arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": " transparent " + fill + " transparent transparent" });
                        context.object.css({ "left": (x + w + offsetX) + "px", "top": y + "px", "background-color": fill, "border-color": fill });
                    }
                }
                else {
                    if (/^bottom$/i.test(origin)) {
                        abottom = true;
                    }
                    if (!abottom) {
                        arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": (context.object.getBoundingHeight() - 2) + "px", "border-color": fill + " transparent transparent transparent" });
                        context.object.css({ "left": (x + offsetX - 2) + "px", "top": (y - context.object.getBoundingHeight() - (disabledArrow ? 0 : (arrow.getBoundingHeight() / 2 - 4.5)) - offsetY) + "px", "background-color": fill, "border-color": fill });
                    }
                    else {
                        arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + fill + " transparent" });
                        context.object.css({ "left": (x + offsetX - 2) + "px", "top": (y + h + offsetY) + "px", "background-color": fill, "border-color": fill });
                    }
                }
                isrendered = true;
                //dispatch["render"].call(this, { arrow: { bottom: abottom, left: aleft }, arrowobject: arrow, container: this });
                return this;
            };
            context.content = function (content) {
                if (content) {
                    context.object.find(".ns-hovertip-contentbox").html(content);
                    return this;
                }
                else
                    return context.object.find(".ns-hovertip-contentbox").html();
            };
            context.show = function (e) {
                if (!disabledArrow) {
                    arrow.show(0);
                }
                context.object.show(speed);
                if (!isrendered)
                    this.render();
                showed = true;
                //dispatch["show"].call(this, null);
                conf.show ? conf.show.call(this, context.object, arrow) : null;
                return this;
            };
            context.hide = function () {
                showed = false;
                window.clearTimeout(timerid);
                context.object.hide(speed);
                //dispatch["hide"].call(this, null);
                conf.hide ? conf.hide.call(this, context.object, arrow) : null;
                return this;
            };
            context.stopHideAnimation = function () {
                this.animateTweens.hide.setPaused(true);
            };
            context.empty = function () { context.object.remove(); };
            context.object = ns.select(ns.parseHtml(_html));
            arrow = ns.select(ns.parseHtml(_arrow));
            context.object.append(arrow);
            //context.trigger = trigger;
            context.object.appendTo(ns.select("body"));
            if (conf.cascading) {
                context.cascading(conf.cascading);
            }
            if (conf.content) {
                context.content(conf.content);
            }
            if (conf.autoShow) {
                context.show();
            }
            return context;
        };
        tag.nearip = function (conf) {
            function hoverip() { }
            ;
            if (!conf) {
                conf = {};
            }
            var speed = conf.speed || 300, deplay = 300;
            var showed = false, selector = null, timerid, rendered = false, offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5, offsetY = conf.offsetY || 5, origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()), _html = conf.html || "<div id='" + id + "' style=\"display:none;width:" + (!conf.width ? "auto" : conf.width) + ";line-height: 20px;border-radius: 1px; box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding-top: 10px;padding-left: 5px;padding-bottom: 10px; position: absolute; \" class='ns-nearip'><div class='ns-nearip-contentbox'  style=\" font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>", _arrow = conf.arrowHtml || "<span class='ns-nearip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: " + (conf.arrowWidth ? conf.arrowWidth : 10) + "px;border-style: solid;'></span>", _container = null, arrow = null, abottom = conf.bottom == null ? true : conf.bottom, isrunning = false, aleft = conf.left == null ? true : conf.left, fill = conf.fill == null ? "" : conf.fill, enableMove = conf.enableMove != null ? conf.enableMove : true, disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false, isrendered = false, deplayHide = conf.delayHide || 0, deplayHideTimerid, startingEventName = conf.startingEventName == null ? "mouseover" : conf.startingEventName, endingEventName = conf.endingEventName || "mouseout";
            var context = new hoverip();
            function trigger(e) {
                if (deplayHideTimerid) {
                    window.clearTimeout(deplayHideTimerid);
                }
                timerid = setTimeout(function () {
                    isrunning = true;
                    //dispatch["showing"].call(toolip, e);
                    context.show(e);
                    conf.show ? conf.show.call(this, null) : null;
                }, deplay);
            }
            context.cascading = function (dom) {
                if (dom) {
                    selector = ns.select(dom);
                }
                selector.on(startingEventName, function (e) {
                    trigger(e);
                    ns.select("body").once("click", function () {
                    });
                });
                return this;
            };
            context.render = function () {
                var c = selector.getBoundingRect(), y = c.top + (ns.scrollTop() || 0), x = c.left + (ns.scrollLeft() || 0), w = c.width, h = c.height;
                abottom = false;
                aleft = true;
                if (x - selector.getBoundingWidth() - offsetwidth - offsetX < 0) {
                    aleft = false;
                }
                if (y - offsetheight - selector.getBoundingHeight() - offsetY < 0) {
                    abottom = false;
                }
                if (disabledArrow) {
                    this.select(".ns-nearip-arrow").hide(0);
                }
                if (/left|right/ig.test(origin)) {
                    if (/^right$/i.test(origin)) {
                        aleft = false;
                    }
                    if (aleft) {
                        arrow.css({ "left": (selector.getBoundingWidth()) + "px", "top": (h / 2 - arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": "transparent transparent transparent " + fill });
                        context.object.css({ "left": (x - selector.getBoundingWidth() - arrow.getBoundingWidth() - offsetX) + "px", "top": y + "px", "background-color": fill, "border-color": fill });
                    }
                    else {
                        arrow.css({ "left": (0 - arrow.getBoundingWidth()) + "px", "top": (h / 2 - arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": " transparent " + fill + " transparent transparent" });
                        context.object.css({ "left": (x + w + offsetX) + "px", "top": y + "px", "background-color": fill, "border-color": fill });
                    }
                }
                else {
                    if (/^bottom$/i.test(origin)) {
                        abottom = true;
                    }
                    if (!abottom) {
                        arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": (context.object.getBoundingHeight() - 2) + "px", "border-color": fill + " transparent transparent transparent" });
                        context.object.css({ "left": (x + offsetX - 2) + "px", "top": (y - context.object.getBoundingHeight() - (disabledArrow ? 0 : (arrow.getBoundingHeight() / 2 - 4.5)) - offsetY) + "px", "background-color": fill, "border-color": fill });
                    }
                    else {
                        arrow.css({ "left": (selector.getBoundingWidth() / 2 - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + fill + " transparent" });
                        context.object.css({ "left": (x + offsetX - 2) + "px", "top": (y + h + offsetY) + "px", "background-color": fill, "border-color": fill });
                    }
                }
                isrendered = true;
                //dispatch["render"].call(this, { arrow: { bottom: abottom, left: aleft }, arrowobject: arrow, container: this });
                return this;
            };
            context.content = function (content) {
                if (content) {
                    context.object.find(".ns-nearip-contentbox").html(content);
                    return this;
                }
                else
                    return context.object.find(".ns-nearip-contentbox").html();
            };
            context.show = function (e) {
                if (!disabledArrow) {
                    arrow.show(0);
                }
                context.object.show(speed);
                if (!isrendered)
                    this.render();
                showed = true;
                //dispatch["show"].call(this, null);
                conf.show ? conf.show.call(this, context.object, arrow) : null;
                return this;
            };
            context.hide = function () {
                showed = false;
                window.clearTimeout(timerid);
                context.object.hide(speed);
                //dispatch["hide"].call(this, null);
                conf.hide ? conf.hide.call(this, context.object, arrow) : null;
                return this;
            };
            context.stopHideAnimation = function () {
                this.animateTweens.hide.setPaused(true);
            };
            context.object = ns.select(ns.parseHtml(_html));
            arrow = ns.select(ns.parseHtml(_arrow));
            context.object.append(arrow);
            //context.trigger = trigger;
            context.object.appendTo(ns.select("body"));
            if (conf.cascading) {
                context.cascading(conf.cascading);
            }
            if (conf.content) {
                context.content(conf.content);
            }
            if (conf.autoShow) {
                context.show();
            }
            return context;
        };
        tag.toolip = function (conf) {
            function tooltip() { }
            ;
            if (!conf) {
                conf = {};
            }
            var speed = conf.speed || 300, deplay = 300;
            var showed = false, selector = null, timerid, rendered = false, offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5, offsetY = conf.offsetY || 5, origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()), _html = conf.html || "<div id='" + id + "' style=\"display:none;line-height: 20px;text-align: center;border-radius: 5px;box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px;pointer-events: none; position: absolute; left: 638px; top: 229.098px;\" class='ns-hovertip'><div class='ns-hovertip-contentbox'  style=\"text-align:center; max-width:220px; font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>", _arrow = conf.arrowHtml || "<span class='ns-hovertip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: 10px;border-style: solid;'></span>", _container = null, arrow = null, abottom = true, isrunning = false, aleft = true, fill = conf.fill == null ? "" : conf.fill, enableMove = conf.enableMove != null ? conf.enableMove : true, disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false, isrendered = false, deplayHide = conf.delayHide || 0, deplayHideTimerid, startingEventName = conf.startingEventName || "mouseover", endingEventName = conf.endingEventName || "mouseout";
            var context = new tooltip();
            context.cascading = function (dom) {
                if (dom) {
                    selector = ns.select(dom);
                }
                selector.on("mouseover", function (e) {
                    timerid = setTimeout(function () {
                        isrunning = true;
                        //dispatch.showing.call(toolip, e);
                        context.show(e);
                    }, deplay);
                }).on("mouseout", function () {
                    showed ? context.hide() : window.clearTimeout(timerid);
                    isrunning = false;
                });
                if (enableMove) {
                    selector.on("mousemove", function (e) {
                        if (isrunning) {
                            context.show(e);
                        }
                    });
                }
                return this;
            };
            context.render = function (x, y) {
                var c = selector.getBoundingRect(), w = c.width, h = c.height, w2 = w / 2, h2 = h / 2, xw = x - w2, yh = y - h - 20;
                abottom = true;
                aleft = true;
                if (xw - offsetwidth < 0) {
                    xw = offsetwidth;
                }
                if (yh - offsetheight < 0) {
                    yh = y + offsetheight;
                    abottom = false;
                }
                if (disabledArrow) {
                    arrow.hide(0);
                }
                //if (dispatch.rendering.call(this, { rect: c, x: x, y: y }) !== true) {
                if (abottom) {
                    arrow.css({ "left": (x - xw - 10) + "px", "top": h + "px", "border-color": fill + " transparent transparent transparent" });
                    context.object.css({ "left": xw + "px", "top": (yh - offsetY) + "px", "background-color": fill, "border-color": fill });
                }
                else {
                    arrow.css({ "left": (x - xw - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + fill + " transparent" });
                    context.object.css({ "left": xw + "px", "top": (yh + offsetY) + "px", "background-color": fill, "border-color": fill });
                }
                isrendered = true;
                //dispatch.render.call(this, { arrow: { bottom: abottom, left: aleft }, arrow: arrow, container: this });
            };
            context.content = function (content) {
                if (content) {
                    context.object.find(".ns-hovertip-contentbox").html(content);
                    return this;
                }
                else
                    return context.object.find(".ns-hovertip-contentbox").html();
            };
            context.show = function (e) {
                var x = e.pageX || (e.clientX ? e.clientX + document.documentElement.scrollLeft : 0), y = e.pageY || (e.clientY ? e.clientY + document.documentElement.scrollTop : 0);
                if (!disabledArrow) {
                    arrow.show(0);
                }
                context.object.show(speed);
                if (enableMove || (!enableMove && !isrendered))
                    this.render(x, y);
                showed = true;
                //dispatch["show"].call(this, null);
                conf.show ? conf.show.call(this, null) : null;
                return this;
            };
            context.hide = function () {
                showed = false;
                window.clearTimeout(timerid);
                context.object.hide(speed);
                //dispatch["hide"].call(this, null);
                conf.hide ? conf.hide.call(this, null) : null;
            };
            context.stopHideAnimation = function () {
                context.object.animateTweens.hide.setPaused(true);
            };
            context.object = ns.select(ns.parseHtml(_html));
            arrow = ns.select(ns.parseHtml(_arrow));
            context.object.append(arrow);
            //context.trigger = trigger;
            context.object.appendTo(ns.select("body"));
            if (conf.cascading) {
                context.cascading(conf.cascading);
                context.render();
            }
            if (conf.content) {
                context.content(conf.content);
            }
            if (conf.autoShow) {
                conf.show();
            }
            return context;
        };
        tag.dialog = function (conf) {
            if (!conf) {
                conf = {};
            }
            conf.title = conf.title || "Information";
            conf.width = conf.width || 440;
            conf.height = conf.height || 210;
            conf.enableDrag = conf.enableDrag != null ? conf.enableDrag : true;
            function context_con() { }
            var context = new context_con();
            context.object = ns.tag.div().attr({ class: "ns-dialog" }).css({ "border": "1px solid #e0e0e0;", "z-index": 99, "line-height": " 20px", "min-width": conf.width + "px", "min-height": conf.height + "px", "text-align": "left", "border-radius": "5px", "font-size": "14px", padding: "10px", position: "fixed", "font-family": "Verdana;", left: "160px;", right: "auto", top: "120px;", "background-color": "white" })
                .div().attr({ class: "ns-dialog-menubar" }).css({ height: "30px;", "background-color": "rgb(0, 122, 204);", color: "#000000", }).callback(conf.rendermeenu)
                .div().attr({ class: "ns-dialog-title" }).css({ float: "left" }).h3().text(conf.title).css({ color: "white", "line-height": "30px", margin: "0px", "padding-left": "5px;" }).end().end()
                .div().attr({ class: "ns-dialog-menu" }).css({ float: "right" }).div().css({ cursor: " pointer", width: "60px", height: "30px", "line-height": "30px" }).text("[ close ]").event("click", function () { context.hide(); }).end().end()
                .div().css({ clear: "both" })
                .end().end()
                .div().landingline({}, context).end()
                .div().attr({ class: "ns-dialog-content" }).css({ width: conf.width + "px", margin: "30px auto", "min-height": (conf.height - 35) + "px", "background-color": "white" }).host("content", context)
                .if(!!conf.content, conf.content, function () { })
                .end().render(ns.select("body"));
            context.show = function () {
                context.object._ns.show();
                context.mask._ns.show();
                if (conf.show) {
                    conf.show.call(context, null);
                }
            };
            context.hide = function () {
                context.object._ns.hide();
                context.mask._ns.hide();
                if (conf.hide) {
                    conf.hide.call(context, null);
                }
            };
            context.drag = function () { context.object.drag(context.object._ns, context.object._ns.find(".ns-dialog-menubar")); };
            context.mask = ns.tag.div().attr({ "class": "ns-dialog-mask" }).css({ "background-color": "#eee" }).end().render(ns.select("body"));
            if (conf.autoshow && context.show) {
                context.show();
            }
            if (conf.enableDrag) {
                context.drag();
            }
            context.empty = function (emptymask) {
                if (!emptymask) {
                    context.object._ns.find("input,textarea,select").each(function () { ns.select(this).value(""); });
                }
                else {
                    context.object._ns.find("input,textarea,select").each(function () { ns.select(this).value(""); });
                }
            };
            return context;
        };
        tag.dropselection = function (conf) { };
        tag.sequence = function () {
            var fn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fn[_i - 0] = arguments[_i];
            }
            if (arguments.length) {
                var param = null;
                for (var i = 0; i < arguments.length; i++) {
                    param = arguments[i].call(this, param);
                }
                return param;
            }
            else {
                return;
            }
        };
        tag.ev_simple = function (conf) {
            var ev = {
                editor: null,
                plugin: {
                    value: function (v) {
                    },
                    parse: function (v) { return v; }
                },
                readonly: false || !!conf.readonly, status: "coding"
            };
            conf.height = conf.height || "140px;";
            conf.width = conf.width || "99%";
            if (conf.plugin) {
                ev.plugin = conf.plugin;
            }
            ev.editor =
                ns.tag.div(".edit-container *width:" + conf.width + ";height:" + conf.height + ";color:rgb(34,34,34);font-size:12px;padding-bottom:2px;border-width:0px;border-style:solid;border-color:#e0e0e0;margin:5px;")
                    .div(".edit-core *font-size:12px;height:100%;;width:100%;left:0px;width:100%;border-width:0px;border-style:solid;border-color:#e0e0e0;border-top-width:0px;margin-bottom:15px;").css({ "box-shadow": "gray 1px 1px #888888;", "padding-top": "5px;", "padding-bottom": "20px;", "padding-left": "3px;" })
                    .div(".edit-header *diplay:none;font-size:12px;height:20px;left:0px;width:99%;border-width:0.3px;border-style:solid;border-color:#e0e0e0;height:24px;").host("menu", ev)
                    .ul(".edit-icon-menu .icon-menu-left *float:left;font-size:12px;margin:0px;padding:0px;margin-right:2px;list-style:none;").host("leftMenu", ev)
                    .end()
                    .ul(".edit-icon-menu .icon-menu-right *float:right;font-size:12px;margin:0px;padding:0px;margin-right:0.2px;list-style:none;").host("rightMenu", ev)
                    .li(".icon-menu-item   *height:16px;width:16px;padding:4px;float:left;cursor:pointer :title:preview").attr("ns-command", "preview").span(".fa .fa-eye-slash *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end()
                    .li(".icon-menu-item   *height:16px;width:16px;padding:4px;float:left;cursor:pointer").attr("title", "full screen").attr("ns-command", "fullscreen").span(".fa .fa-laptop *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end()
                    .end()
                    .end()
                    .div(".edit-document-preview *display:none;height:100%;width:100%;").host("previewContainer", ev).iframe("*width:98%;height:100%;").end().end()
                    .div(".edit-domain *display:block;height:100%;").host("editContainer", ev)
                    .textarea(".text-domain *width:98%;height:84%;overflow:auto;font-size:14px;padding:5px;border-width:1px;background-color:#fafafa").host("editText", ev).event("focus", function () {
                    ev['menu'].ns().show();
                }).end()
                    .end()
                    .end()
                    .end();
            ev.editor.beReady = function () { return true; };
            ns.select("body").on("click", function (e) {
                var target = ev.editor.ns().selected[0];
                for (var it in e.path) {
                    if (e.path[it] === target) {
                        e.cancelBubble = true;
                        e.returnValue = true;
                        return;
                    }
                }
                ev['menu'].ns().hide();
            });
            ev['cmdParser'] = ns.dispatch("unlocking", "locking", "preview", "coding", "settings", "fullscreen", "minscreen");
            ev['processCmd'] = function (cmd, e) {
                ev['cmdParser'].trigger(cmd, ev, e);
            };
            ev['status'] = "";
            ev["mode"] = "text";
            ev["encodeValue"] = function (v) {
                return ev.plugin.parse(v);
            };
            ev["text"] = function () {
                if (arguments.length) {
                    return ev["editText"].ns().value(arguments[0]);
                }
                else
                    return ev["editText"].ns().value();
            };
            ev["initing"] = function () {
                var ifr = ev["previewContainer"].ns().find("iframe");
                ns.select("body", ifr.selected[0].contentDocument).on("click", function () {
                    ev.readonly ? "" : ev['menu'].ns().show();
                });
                ev.editor.ns().find("[ns-command]").on("click", function (e) {
                    ev['processCmd'](ns.select(this).attr("ns-command"), e);
                });
                ev['cmdParser'].on("locking", function (e) {
                    ev['status'] = "locked";
                    //ev.event.trigger("statusChanged", context, e);
                });
                ev['cmdParser'].on("unlocking", function (e) {
                    ev['status'] = "unlocked";
                    //ev.event.trigger("statusChanged", context, e);
                });
                ev['cmdParser'].on("preview", function (e) {
                    ev["editContainer"].ns().hide();
                    var ifr = ev["previewContainer"].ns().find("iframe");
                    ns.select("body", ifr.selected[0].contentDocument).html(ev['encodeValue'](ev['text']()));
                    ev["previewContainer"].ns().show();
                    ev.status = "preview";
                    //context.previewContainer.ns().css({ color: "rgb(0,122,204);" });
                    ev["rightMenu"].ns().find("[ns-command=preview]").attr("ns-command", "coding");
                });
                ev['cmdParser'].on("coding", function (e) {
                    ev["editContainer"].ns().show();
                    ev.status = "coding";
                    ev["previewContainer"].ns().hide();
                    ev["rightMenu"].ns().find("[ns-command=coding]").attr("ns-command", "preview");
                });
                ev["cmdParser"].on("fullscreen", conf.fullScreen || function (e) {
                });
                ev["cmdParser"].on("minscreen", conf.misScreen || function (e) {
                });
                if (ev.status == "preview") {
                    ev["cmdParser"].trigger("preview");
                }
            };
            if (conf.autorender) {
                ev.editor.render(conf.parent, true);
            }
            if (conf.callback) {
                conf.callback.call(ev, conf);
            }
            return ev;
        };
        tag.editView = function (conf) {
            if (!conf) {
                conf = {};
            }
            var context = { object: null, tag: null, processCmd: null, isSimple: false, plugin: null, encodeValue: null, enable3DMenu: true, value: function () { }, editText: null, cmdParser: ns.dispatch("unlocking", "locking", "preview", "coding", "settings", "fullscreen", "minscreen"), mode: conf.mode || "markdown", status: conf.status || "unlocked", event: new Dispatch() };
            conf.width = conf.width || 440;
            conf.height = conf.height || 210;
            context.isSimple = conf.simple || false;
            context.plugin = {
                markdown: {
                    encode: function (txt) {
                        return this.parser(txt);
                    },
                    parser: function (txt) {
                        return "";
                    }
                }
            };
            context.encodeValue = function () {
                var text = context.editText.ns().value();
                return context.plugin[context.mode].encode(text);
            };
            context.enable3DMenu = "enable3DMenu" in conf ? conf.enable3DMenu : true;
            context.value = function () {
                return context.editText.ns().value();
            };
            context.tag = ns.tag.div(".edit-container *width:99%;height:" + conf.height + "px;color:rgb(34,34,34);font-size:12px;padding-bottom:2px;border-width:0px;border-style:solid;border-color:#e0e0e0;")
                .if(!!conf.parent, function () {
                this.parent = conf.parent;
                this.root = conf.parent.root;
            })
                .div(".edit-header *font-size:12px;height:20px;left:0px;width:100%;border-bottom-width:0.3px;border-bottom-style:solid;border-bottom-color:#e0e0e0;height:24px;").if(context.enable3DMenu, function () { this.css({ "box-shadow": "0px 1px 0.1px #888888;" }); })
                .ul(".edit-icon-menu .icon-menu-left *float:left;font-size:12px;margin:0px;padding:0px;margin-right:2px;").host("leftMenu", context)
                .end()
                .ul(".edit-icon-menu .icon-menu-right *float:right;font-size:12px;margin:0px;padding:0px;margin-right:0.2px;").host("rightMenu", context)
                .li(".icon-menu-item   *height:16px;width:16px;padding:4px; :title:preview").attr("ns-command", "preview").span(".fa .fa-eye-slash *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end()
                .if(!context.isSimple, function () {
                this.li(".icon-menu-item   *height:16px;width:16px;padding:4px; :title:settings").attr("ns-command", "settings").span(".fa .fa-cog *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end()
                    .li(".icon-menu-item   *height:16px;width:16px;padding:4px;").attr("title", "full screen").attr("ns-command", "fullscreen").span(".fa .fa-laptop *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end()
                    .li(".icon-menu-item  *height:16px;width:16px;padding:4px;").attr("title", "Locked").attr("ns-command", "locking").span(".fa .fa-lock *height:16px;line-height:16px;width:16px;text-align:center;font-size:14px;").end().end();
            })
                .end()
                .end()
                .div(".edit-core *font-size:12px;height:" + (conf.height - 20) + "px;width:100%;left:0px;width:100%;border-width:0px;border-style:solid;border-color:#e0e0e0;border-top-width:0px;").css({ "box-shadow": "gray 1px 1px #888888;", "padding-top": "5px;", "padding-bottom": "20px;", "padding-left": "3px;" })
                .div(".edit-document-preview *display:none;").host("previewContainer", context).iframe().end().end()
                .div(".edit-domain *display:block;").host("editContainer", context)
                .textarea(".text-domain *width:100%;height:" + (conf.height - 20) + "px;overflow:auto;font-size:14px;").host("editText", context).end()
                .end()
                .end()
                .end();
            context.processCmd = function (cmd, e) {
                context.cmdParser.trigger(cmd, context, e);
            };
            if (conf.dom) {
                context.tag.render(conf.dom, true);
            }
            context["initing"] = function () {
                context.tag.ns().find("[ns-command]").on("click", function (e) {
                    context.processCmd(ns.select(this).attr("ns-command"), e);
                });
                context.cmdParser.on("locking", function (e) {
                    context.status = "locked";
                    context.event.trigger("statusChanged", context, e);
                });
                context.cmdParser.on("unlocking", function (e) {
                    context.status = "unlocked";
                    context.event.trigger("statusChanged", context, e);
                });
                context.cmdParser.on("preview", function (e) {
                    context["editContainer"].ns().hide();
                    var ifr = context["previewContainer"].ns().find("iframe");
                    ns.select("body", ifr.selected[0].contentDocument).html(context.encodeValue());
                    context["previewContainer"].ns().show();
                    //context.previewContainer.ns().css({ color: "rgb(0,122,204);" });
                    context["rightMenu"].ns().find("[ns-command=preview]").attr("ns-command", "coding");
                });
                context.cmdParser.on("coding", function (e) {
                    context["editContainer"].ns().show();
                    context["previewContainer"].ns().hide();
                    context["rightMenu"].ns().find("[ns-command=coding]").attr("ns-command", "preview");
                });
                context.cmdParser.on("fullscreen", conf.fullScreen || function (e) {
                });
                context.cmdParser.on("minscreen", conf.misScreen || function (e) {
                });
                context.cmdParser.on("settings", conf.settings || function (e) {
                });
            };
            return context;
        };
        tag.prototype.editView = function (conf) {
            if (!conf) {
                conf = {};
            }
            conf.parent = this;
            var me = this;
            this["editViewObject"] = ns.tag.editView(conf);
            this.callback(function () {
                me["editViewObject"].initing();
            }, 0);
            return this;
        };
        tag.prototype.datetimepicker = function (conf, host, hostname) {
            if (!conf) {
                conf = {};
            }
            conf.parent = this; //var me = this;
            host[hostname] = ns.tag.datetimepicker(conf);
            return this;
        };
        tag.prototype.drag = function (moveDom, bindDom, opacity) {
            var bindDom = typeof bindDom === "string" ? this._ns.select(bindDom) : bindDom || this._ns;
            var opacity = opacity ? opacity : 1;
            var moveDom = moveDom ? typeof moveDom === "string" ? this._ns.select(moveDom) : moveDom : bindDom;
            var resumPointer = "";
            function parseInt1(o) {
                var i = parseInt(o);
                return isNaN(i) ? 0 : i;
            }
            var me = this;
            var listen = function () {
                ns.select(bindDom).on("mousedown", function (a) {
                    var o = moveDom.node ? moveDom.node() : moveDom;
                    var d = document;
                    if (!a)
                        a = window.event;
                    if (!a.pageX)
                        a.pageX = a.clientX;
                    if (!a.pageY)
                        a.pageY = a.clientY;
                    var x = a.pageX, y = a.pageY;
                    if (o.setCapture)
                        o.setCapture();
                    else if (window.captureEvents)
                        window.captureEvents.call(window, Event["MOUSEMOVE"] | Event["MOUSEUP"]);
                    var backData = { x: moveDom.css("top"), y: moveDom.css("left") };
                    resumPointer = moveDom.css("cursor");
                    moveDom.css({ "cursor": "pointer" });
                    function move(a) {
                        if (!a)
                            a = window.event;
                        if (!a.pageX)
                            a.pageX = a.clientX;
                        if (!a.pageY)
                            a.pageY = a.clientY;
                        var tx = a.pageX - x + parseInt1(moveDom.css("left")), ty = a.pageY - y + parseInt1(moveDom.css("top"));
                        moveDom.css({ left: tx + "px", top: ty + "px" });
                        x = a.pageX;
                        y = a.pageY;
                    }
                    function up(a) {
                        if (!a)
                            a = window.event;
                        if (o.releaseCapture)
                            o.releaseCapture();
                        else if (window.captureEvents)
                            window.captureEvents.call(window, Event["MOUSEMOVE"] | Event["MOUSEUP"]);
                        d.onmousemove = null;
                        d.onmouseup = null;
                        if (!a.pageX)
                            a.pageX = a.clientX;
                        if (!a.pageY)
                            a.pageY = a.clientY;
                        if (!document.body["pageWidth"])
                            document.body["pageWidth"] = document.body.clientWidth;
                        if (!document.body["pageHeight"])
                            document.body["pageHeight"] = document.body.clientHeight;
                        //if (a.pageX < 1 || a.pageY < 1 || a.pageX > document.body["pageWidth"] || a.pageY > document.body["pageHeight"]) {
                        //    moveDom.css({ left: backData.y, top: backData.x });
                        //}
                        moveDom.css({ "cursor": resumPointer });
                        ns.select(d).off("mousemove", move);
                        ns.select(d).off("mouseup", up);
                    }
                    ns.select(d).on("mousemove", move);
                    ns.select(d).on("mouseup", up);
                });
            };
            if (bindDom) {
                listen();
            }
        };
        tag.prototype.landingline = function (conf, host) {
            host = host || this;
            this.callback(function () {
                host.landing = ns.tag.landingline(this, conf);
            }, 2);
            return this;
        };
        tag.prototype.toolip = function (conf, host) {
            var me = host || this;
            if (!conf) {
                conf = {};
            }
            this.callback(function () {
                conf.cascading = this;
                var toolip = ns.tag.toolip(conf);
                me.toolip = toolip;
            }, 1);
            return this;
        };
        tag.prototype.hoverip = function (conf, host) {
            var me = host || this;
            if (!conf) {
                conf = {};
            }
            this.callback(function () {
                conf.cascading = this;
                var hoverip = ns.tag.hoverip(conf);
                me.hoverip = hoverip;
            }, 1);
            return this;
        };
        tag.prototype.sequence = function () {
            var fn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fn[_i - 0] = arguments[_i];
            }
            if (arguments.length) {
                var param = null;
                for (var i = 0; i < arguments.length; i++) {
                    param = arguments[i].call(this, param);
                }
                return param == null || param == undefined ? this : param;
            }
            return this;
        };
        tag.prototype.w = function (html) { document.write(html); };
        tag.prototype.begin = function (exp) {
            this.html += "<" + this.tag + " id='" + this.id + "' ";
            if (exp) {
                this.proc(exp);
            }
            return this;
        };
        tag.prototype.attr = function (prop, val) {
            if (arguments.length > 1 || typeof val == "string") {
                if (typeof val !== "string") {
                    val = JSON.stringify(val);
                }
                if (prop === "id") {
                    this.id = val.trim("#");
                }
                if (prop === "text") {
                    this._text = val;
                }
                if (prop === "class") {
                    if (/class='/ig.test(this.html)) {
                        this.html = this.html.replace(/class='/, " class='" + val + " ");
                    }
                    else {
                        this.html += " " + prop + "='" + val + "'";
                    }
                }
                else if (new RegExp(prop + "='([^'])*'", "ig").test(this.html)) {
                    this.html = this.html.replace(new RegExp(prop + "='([^'])*'", "ig"), " " + prop + "='" + val + "' ");
                }
                else {
                    this.html += " " + prop + "='" + val + "'";
                }
                return this;
            }
            if (typeof prop === "function") {
                prop.call(this, this.html, val);
                return this;
            }
            if (typeof prop === "object") {
                for (var p in prop) {
                    this.attr(p, prop[p]);
                }
                return this;
            }
            return this.ns().attr(prop);
        };
        tag.prototype.end = function () {
            if (!/style/i.test(this.html) && this.cssHtml) {
                this.html += " style='" + this.cssHtml + "' >" + this._text;
            }
            if (this.html.indexOf('>') <= 0) {
                this.html += ">" + this._text;
            }
            this.html += "</" + this.tag + ">";
            if (this.parent) {
                if (this.parent.isrendered) {
                    this.parent._ns.append(this.html);
                    this.isrendered = true;
                    return this.parent;
                }
                else {
                    this.parent.html += this.html;
                    return this.parent;
                }
            }
            return this;
        };
        tag.prototype.ns = function (select) {
            if (select) {
                this._ns = ns.select(select);
                this.isrendered = true;
            }
            if (!this._ns && this.beReady()) {
                this._ns = ns.select("#" + this.id);
            }
            this._ns["tagRender"] = this;
            this._ns["tagrender"] = function () { return this.tagRender; };
            return select ? this : this._ns;
        };
        tag.prototype.css = function (prop, val) {
            if (val) {
                this.cssHtml += " " + prop + ":" + val + ";";
                return this;
            }
            if (typeof prop === "function") {
                prop.call(this, this.cssHtml, val);
                return this;
            }
            else if (typeof prop === "object") {
                for (var p in prop) {
                    this.css(p, prop[p]);
                }
                return this;
            }
            return this.css(prop);
        };
        tag.prototype.child = function (tag) {
            if (!/style=/i.test(this.html) && this.cssHtml) {
                this.html += " style='" + this.cssHtml + "' >" + this._text;
            }
            if (this.html.indexOf('>') <= 0) {
                this.html += ">" + this._text;
            }
            var t = new ns.tag(tag, this);
            t.isrendered = this.isrendered;
            return t;
        };
        tag.prototype.beReady = function () { return this.root.isrendered; };
        tag.prototype.render = function (dom, override) {
            var rt = this, me = this;
            if (dom instanceof ns.tag) {
                if (dom.beReady()) {
                    dom = dom.ns();
                }
                else {
                    var me = this;
                    this.waiting(function () {
                        return dom.beReady();
                    }, function () {
                        me.render(dom);
                    }, 10);
                    return rt;
                }
            }
            if (dom && (typeof dom === "string" || dom instanceof ns || ("nodeType" in dom))) {
                dom = ns.select(dom);
                if (override === true) {
                    dom.html(this.html);
                }
                else if (typeof override === "number") {
                    var cd = dom.children();
                    if (cd.length > 0) {
                        dom.insertBefore(ns.parseHtml(this.html), cd.eq(override).node());
                    }
                    else {
                        dom.append(ns.parseHtml(this.html));
                    }
                }
                else {
                    dom.append(ns.parseHtml(this.html));
                }
            }
            else if (typeof dom === "function") {
                dom.call(this, ns.parseHtml(this.html));
            }
            else {
                document.write(this.html);
            }
            this._ns = ns.select("#" + this.id);
            ns.data.sort(this.callbacks, "prioty").forEach(function (d) {
                if (!d.func) {
                    return;
                }
                d.caller._ns = ns.select("#" + d.caller.id);
                d.caller._ns.tagRender = d.caller;
                d.func.apply(d.caller._ns, d.params);
            });
            this.events.forEach(function (d) {
                d.caller._ns = ns.select("#" + d.caller.id);
                if (d.filter) {
                    d.caller._ns = d.caller._ns.find(d.filter);
                }
                d.caller._ns.on(d.event, d.func);
            });
            this.isrendered = true;
            return rt || this;
        };
        tag.prototype.sync = function (fn) { fn.apply(this, ns.slice(arguments).slice(1)); return this; };
        tag.prototype.async = function (fun, args) {
            var me = this;
            setTimeout(function (args) { fun.call(me, null); }, 1, args);
            return this;
        };
        tag.prototype.event = function (evn, fn, filter) {
            if (!evn) {
                return this;
            }
            this.root.events.push({ func: fn, event: evn, caller: this, filter: filter });
            return this;
        };
        tag.prototype.callback = function (fn, prioty) {
            if (!prioty) {
                prioty = prioty || -1;
            }
            this.root.callbacks.push({ func: fn, params: ns.slice(arguments).slice(1), caller: this, prioty: -1 });
            return this;
        };
        tag.prototype.transferCssProperty = function (p) {
            return p;
        };
        tag.prototype.proc = function (exp) {
            var es = exp.split(/\s+/g), me = this;
            var isend = false;
            es.forEach(function (v) {
                if (/^#/.test(v)) {
                    me.attr("id", v.substr(1));
                }
                else if (/^\./.test(v)) {
                    me.attr("class", v.substr(1));
                }
                else if (/^:/.test(v)) {
                    v = v.substr(1);
                    var vs = v.split(/[a-zA-Z0-9\S]+;/g);
                    vs.forEach(function (v1) { var vs1 = v1.split(':'); if (vs1.length >= 1 && vs1[0]) {
                        me.attr(vs1[0], vs1[1]);
                    } });
                }
                else if (/^@/.test(v)) {
                    v = v.substr(1);
                    me.host(v, window);
                }
                else if (/^\*/.test(v)) {
                    v = v.substr(1);
                    var vs = v.split(';');
                    vs.forEach(function (v1) { var vs1 = v1.split(':'); if (vs1.length >= 1 && vs1[0]) {
                        me.css(me.transferCssProperty(vs1[0]), vs1[1]);
                    } });
                }
                else if (/^end$/i.test(v)) {
                    me.end();
                    isend = true;
                }
                else if (/^e/.test(v)) {
                    v = v.substr(1);
                    var vs = v.split(';');
                    vs.forEach(function (v1) {
                        var vs1 = v1.split(':');
                        if (vs1.length == 2 && vs1[0] && vs1[1]) {
                            me.event(vs[0], ns.gotoNs(vs1[1]));
                        }
                    });
                }
                else {
                }
            });
            return isend ? this.parent : this;
        };
        tag.prototype.boudingRect = function () { return this._ns.getBoundingRect(); };
        tag.prototype.Attr = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            this._ns.attr.call(this._ns, ns.slice(arguments));
        };
        tag.prototype.Css = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i - 0] = arguments[_i];
            }
            this._ns.css.call(this._ns, ns.slice(arguments));
        };
        tag.prototype.table = function (exp) { return this.child("table").begin(exp); };
        tag.prototype.iframe = function (exp) { return this.child("iframe").begin(exp); };
        tag.prototype.div = function (exp) { return this.child("div").begin(exp); };
        tag.prototype.h1 = function (exp) { return this.child("h1").begin(exp); };
        tag.prototype.h2 = function (exp) { return this.child("h2").begin(exp); };
        tag.prototype.h3 = function (exp) { return this.child("h3").begin(exp); };
        tag.prototype.h4 = function (exp) { return this.child("h4").begin(exp); };
        tag.prototype.selectTag = function (exp) { return this.child("select").begin(exp); };
        tag.prototype.span = function (exp) { return this.child("span").begin(exp); };
        tag.prototype.p = function (exp) { return this.child("p").begin(exp); };
        tag.prototype.ul = function (exp) { return this.child("ul").begin(exp); };
        tag.prototype.li = function (exp) { return this.child("li").begin(exp); };
        tag.prototype.ol = function (exp) { return this.child("ol").begin(exp); };
        tag.prototype.em = function (exp) { return this.child("em").begin(exp); };
        tag.prototype.tr = function (exp) { return this.child("tr").begin(exp); };
        tag.prototype.td = function (exp) { return this.child("td").begin(exp); };
        tag.prototype.option = function (exp) { return this.child("option").begin(exp); };
        tag.prototype.label = function (exp) { return this.child("label").begin(exp); };
        tag.prototype.script = function (exp) { return this.child("script").begin(exp); };
        tag.prototype.link = function (exp) { return this.child("link").begin(exp); };
        tag.prototype.style = function (exp) { return this.child("style").begin(exp); };
        tag.prototype.video = function (exp) { return this.child("video").begin(exp); };
        tag.prototype.title = function (exp) { return this.child("title").begin(exp); };
        tag.prototype.meta = function (exp) { return this.child("meta").begin(exp); };
        tag.prototype.tbody = function (exp) { return this.child("tbody").begin(exp); };
        tag.prototype.theader = function (exp) { return this.child("theader").begin(exp); };
        tag.prototype.input = function (exp) { return this.child("input").begin(exp); };
        tag.prototype.textbox = function (exp) { return this.child("input").begin(exp).attr("type", "textbox"); };
        tag.prototype.pwd = function (exp) { return this.child("input").begin(exp).attr("type", "password"); };
        tag.prototype.textarea = function (exp) { return this.child("textarea").begin(exp); };
        tag.prototype.img = function (exp) { return this.child("img").begin(exp); };
        tag.prototype.check = function (exp) { return this.child("input").begin(exp).attr("type", "checkbox"); };
        tag.prototype.a = function (exp) { return this.child("a").begin(exp); };
        tag.prototype.text = function (text) {
            if (this.isrendered) {
                return this._ns.text(text);
            }
            else {
                if (text == null) {
                    return this._text;
                }
                else {
                    this._text = text;
                    return this;
                }
            }
        };
        tag.prototype.datum = function (data) { if (data) {
            this._data = data;
            return this;
        } return this._data; };
        tag.prototype.list = function (template) {
            if (typeof template === "function") {
                var fn = template;
                template = new ns.template();
                template.item(fn);
            }
            else if (template instanceof Array) {
                if (this.parent.tag === "select" || this.tag == "select") {
                    this.datum(template);
                    template = new ns.template();
                    template.item(function (d) { this.option().attr({ "value": d.value }).text(d.text).end(); });
                }
            }
            template.context = this;
            template.call(this._data);
            return this;
        };
        tag.prototype.wait = function (time, fn, args) {
            if (typeof fn === "function") {
                var fname = "temp_func_" + ns.guid();
                ns.tag[fname] = fn;
                ns.tag[fname].target = this;
                this.script().text("setTimeout(function(){ ns.tag." + fname + ".call(ns.tag." + fname + ".target," + JSON.stringify(args) + "); }, time);").end();
            }
            return this;
        };
        tag.prototype.clickAjax = function (url, method, callback, ifexp, mimeType) {
            var me = this;
            if (typeof callback === "function") {
                callback = { success: callback };
            }
            me.event("click", function (e) {
                me.if(ifexp, me.ajax(url, method, null, {
                    beforesend: function () {
                        me._ns.attr({ "disabled": "disabled" });
                        callback.beforesend ? callback.beforesend.apply(this, ns.slice(arguments)) : null;
                    },
                    completed: function () {
                        me._ns.attr({ "disabled": null });
                        callback.completed ? callback.completed.apply(this, ns.slice(arguments)) : null;
                    }, success: callback.success, error: callback.error
                }, mimeType));
                ;
            });
            return this;
        };
        tag.prototype.ajax = function (url, method, data, callback, mimeType) {
            ns.ajax.load(url, method, data, callback, mimeType);
            return this;
        };
        tag.prototype.refreshing = function (url, method, data, callback, mimeType) {
            if (arguments.length == 0) {
                var p = this["refeshing_params"];
                data = p.data;
                url = p.url;
                method = p.method;
                callback = p.callback;
                mimeType = p.mimeType;
            }
            else if (arguments.length == 1) {
                data = url;
                var p = this["refeshing_params"];
                url = p.url;
                method = p.method;
                callback = p.callback;
                mimeType = p.mimeType;
            }
            this["refeshing_params"] = { url: url, method: method, callback: callback, mimeType: mimeType, data: data };
            this.ajax(url, method, data, callback, mimeType);
            return this;
        };
        tag.prototype.ajaxlist = function (ajax, list, landing) {
            ajax = ajax || {};
            var suc = ajax.success, me = this;
            ajax.success = function (d) {
                if (d.result) {
                    var html = "";
                    var data = d.data || d.d;
                    for (var i = 0; i < d.length; i++)
                        html += list.call(null, data[i]);
                    me._ns.append(ns.select(ns.parseHtml(html)));
                }
                suc ? suc.call(me, d) : null;
            };
            ns.ajax.load(ajax.url, ajax.method, ajax.data, ajax, ajax.mimeType);
        };
        tag.popup = function (conf) {
            if (!conf) {
                conf = {};
            }
            function ns_popdialog() { }
            var pop = new ns_popdialog();
            var position = ns.popup.position || "bottom", speed = conf.speed || 3000, delay = conf.delay || 3000, autoStartAnimation = conf.autoAnimation == null ? true : conf.autoAnimation, disabledHover = conf.disabledHover == null ? false : conf.disabledHover, offsetX = conf.offsetX || -1, mode = conf.mode || "popup", offsetY = conf.offsetY || -1, warningColor = "yellow", alertColor = "#60AC39", errorColor = "red", timerid = 0, level = conf.level || "alert", id = "nspopup" + ns.guid(), popdom = null, screenWidth = window.screen.width - 10, screenHeight = window.screen.height - 10, hiding = false, showtweens = null, hidetweens = null;
            var _html = "<div id='" + id + "' style=\"left:auto;line-height: 20px;min-width:240px;min-height:30px;text-align: left;border-radius: 5px;box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px; position: fixed; color:#000000; font-family:Verdana;right:10px;\" class='ns-popup'><div class='ns-popup-contentbox'  style=\"\">{content}</div></div>";
            pop.render = function (x, y) {
                if (x && x !== 0) {
                    offsetX = x;
                }
                if (y && y !== 0) {
                    offsetY = y;
                }
                if (mode == "popup") {
                    var ox = offsetX === -1 || offsetX === "auto" ? 10 : offsetX, oy = offsetY === -1 || offsetY === "auto" ? 10 : offsetY;
                    if (position == "top") {
                        this.object.css({ "top": ns.popup.top + (ns.popup.top <= 10 ? 0 : oy) + "px", right: ox + "px" });
                        ns.popup.top += this.object.getBoundingHeight() + (ns.popup.top <= 10 ? 0 : oy);
                    }
                    else {
                        this.object.css({ bottom: ns.popup.bottom + (ns.popup.bottom <= 10 ? 0 : oy) + "px", right: ox + "px" });
                        ns.popup.bottom += this.object.getBoundingHeight() + (ns.popup.bottom <= 10 ? 0 : oy);
                    }
                }
                else {
                    var ox = offsetX === -1 || offsetX === "auto" ? screenWidth / 2 - 30 : offsetX + 10, oy = offsetY === -1 || offsetY === "auto" ? screenHeight / 2 - 40 : offsetY + 10;
                    this.css({ "top": (oy) + "px", left: (ox) + "px" });
                }
                this.show(300);
                return autoStartAnimation ? this.startTick() : this;
            };
            pop.show = function (speed, callback) {
                var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { };
                callback = callback || {};
                var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
                callback.onchanged = function (d, s) {
                    var tween = this;
                    setTimeout(function () {
                        if (!d) {
                            onchanged.apply(me, arguments);
                            return;
                        }
                        if ("tweenjs_count" in d)
                            delete d.tweenjs_count;
                        tween.pluginData.dom.css(d);
                        onchanged.apply(me, arguments);
                    });
                };
                //pop.object.each(function () {
                var nss = ns.select(pop.object), start = parseFloat(nss.css("opacity"));
                nss.css("display", Ns.CSS.getDisplayType(nss.node()));
                showtweens = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 1 }, speed).call(function () {
                    //delete nss.eq(0).tweenanimate;
                    showtweens = null;
                    ns.popup.popupitems[id] = { position: position, popup: this };
                    successback.call(nss, null);
                    pop.startTick();
                });
            };
            pop.hide = function (speed, callback) {
                var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { };
                callback = callback || {};
                var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
                callback.onchanged = function (d, s) {
                    var tween = this;
                    setTimeout(function () {
                        if (!d) {
                            onchanged.apply(me, arguments);
                            return;
                        }
                        if ("tweenjs_count" in d)
                            delete d.tweenjs_count;
                        tween.pluginData.dom.css(d);
                        onchanged.apply(me, arguments);
                    });
                };
                pop.object.each(function () {
                    var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
                    hidetweens = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 0 }, speed).call(function () {
                        nss.css("display", "none");
                        hiding = false;
                        hidetweens = null;
                        delete ns.popup.popupitems[id];
                        if (position === "top") {
                            var ntop = parseFloat(nss.css("top"));
                            if (ns.popup.top > ntop) {
                                ns.popup.top = ntop - offsetY;
                            }
                        }
                        else {
                            var nbottom = parseFloat(nss.css("bottom"));
                            if (ns.popup.bottom > nbottom) {
                                ns.popup.bottom = nbottom - offsetY;
                            }
                        }
                        successback.call(nss, null);
                    });
                });
                return this;
            };
            pop.startTick = function (time) {
                timerid = window.setTimeout(function () {
                    hiding = true;
                    pop.hide(speed);
                }, delay || time);
                return this;
            };
            pop.clearTick = function () {
                if (timerid) {
                    window.clearTimeout(timerid);
                }
                return this;
            };
            pop.css = function (prop, val) { if (val) {
                pop.object.css(prop, val);
            }
            else {
                pop.object.css(prop);
            } return this; };
            pop.content = function (content) {
                if (content) {
                    pop.object.find(".ns-popup-contentbox").html(content);
                    return this;
                }
                else
                    return pop.object.find(".ns-popup-contentbox").html();
            };
            pop.alert = function (msg, css) { this.content(msg).css({ "background-color": alertColor }).render().css(css); return this; };
            pop.warning = function (msg, css) { this.content(msg).css({ "background-color": warningColor }).render().css(css); return this; };
            pop.error = function (msg, css) { this.content(msg).css({ "background-color": errorColor }).render().css(css); return this; };
            pop.msg = function (msg, css) { this.content(msg).render().css(css); return this; };
            pop.stopAnimate = function () {
                if (hiding || hidetweens) {
                    hidetweens.setPaused(true);
                }
                if (showtweens) {
                    showtweens.setPaused(true);
                }
            };
            popdom = ns.parseHtml(_html);
            ns.select("body").append(popdom);
            pop.object = ns.select(popdom);
            pop.object.on("mouseover", function () {
                if (disabledHover) {
                    return;
                }
                pop.clearTick();
                if (hiding) {
                    hidetweens ? hidetweens.setPaused(true) : null;
                    hidetweens = null;
                    pop.show(300);
                }
            }).on("mouseout", function () {
                pop.startTick();
            });
            return pop;
        };
        tag.prototype.show = function (speed, callback) { this._ns.show(speed, callback); return this; };
        tag.prototype.writeScript = function (fn, callback) {
            if (typeof fn === "function") {
                var fname = "temp_func_" + ns.guid("_");
                var fname1 = "generate_func_" + ns.guid("_");
                ns.tag[fname] = fn;
                ns.tag[fname].target = this;
                this.script().text("function " + fname1 + "(){ ns.tag." + fname + ".call(ns.tag." + fname + ".target || ns.tag." + fname + ", JSON.stringify(ns.slice(arguments)) ); };" + (callback === true ? fname1 + "()" : "") + ";").end();
                if (callback === true || callback === false) {
                    return this;
                }
                if (callback) {
                    callback.call(this, fname1);
                    return this;
                }
                return fname1;
            }
            return this;
        };
        tag.prototype.ajaxWait = function (url, method, callback, mimetype) {
            var me = this;
            if (typeof callback === "function") {
                return this.ajax(url, method, null, window[this.writeScript(function (d) { callback(); }).toString()], mimetype);
            }
        };
        tag.prototype.require = function (reg, mode, call) {
            if (!this._ns || !this._ns.length) {
                this._ns = ns.select("#" + this.id);
            }
            var tag = this._ns.tag(), val = "", rt = true, me = this;
            if (/input|textarea|select/ig.test(tag)) {
                val = this._ns.value();
            }
            else {
                val = this._ns.attr("ns-value");
            }
            if (!mode) {
                mode = "hoverip";
            }
            if (!arguments.length) {
                reg = JSON.parse(this._ns.attr("require"));
            }
            if (!(reg instanceof Array)) {
                reg = [reg];
            }
            if (!reg.length) {
                return true;
            }
            reg.forEach(function (d) {
                if (!d) {
                    return true;
                }
                var color = me._ns.css("border-color");
                rt = ns.require(val, /notnull/.test(d.exp) ? d.exp : new RegExp(d.exp, d.flag), function () {
                    if (me._ns["require"]) {
                        me._ns.css({ "border-color": "red" });
                        me._ns["require"].content(d.ero).show();
                        return !rt;
                    }
                    var conf = JSON.parse(me._ns.attr("require-conf"));
                    if (!conf) {
                        conf = {};
                    }
                    conf.cascading = me._ns;
                    conf.endingEventName = conf.endingEventName == null ? "focus" : conf.endingEventName;
                    conf.startingEventName = conf.startingEventName == null ? "" : conf.startingEventName;
                    conf.offsetY = conf.offsetY == null ? 5 : conf.offsetY;
                    conf.offsetheight = conf.offsetheight == null ? 5 : conf.offsetheight;
                    conf.content = d.ero;
                    conf.fill = conf.fill || "";
                    conf.origin = conf.origin || "top";
                    conf.width = me._ns.getBoundingWidth() + "px";
                    conf.autoShow = true;
                    conf.hide = function () {
                        me._ns.css({ "border-color": color });
                        //me._ns["require"]._ns.hide(0);
                    };
                    if (/alert/.test(mode)) {
                        alert(conf.content);
                    }
                    if (/hoverip/.test(mode)) {
                        me._ns.css({ "border-color": "red" });
                        me._ns["require"] = ns.tag.hoverip(conf);
                    }
                });
                return !rt;
            });
            return rt;
        };
        tag.prototype.host = function (host, target) { if (!(target instanceof Object)) {
            throw "必须为object类型，引用传递";
        } if (!host) {
            return this;
        } target[host] = this; return this; };
        tag.prototype.waiting = function (locker, callback, time) {
            time = time || 100;
            var tid = -1;
            var me = this, params = ns.slice(arguments).slice(2), tfn = function () {
                if (typeof locker === "string") {
                    var lock = me._ns.length ? me._ns.attr(locker) : "";
                    if (/true/.test(lock)) {
                        clearTimeout(tid);
                        return callback.apply(me, params);
                    }
                    ;
                }
                else if (locker instanceof Function && locker.call(me, null)) {
                    clearTimeout(tid);
                    return callback.apply(me, params);
                }
                else {
                    clearTimeout(tid);
                    setTimeout(tfn, time);
                }
            };
            tid = setTimeout(tfn, time);
        };
        tag.prototype.if = function (exp, fn, erfn) {
            var res = false;
            if (typeof exp === "function") {
                res = exp.call(this, null);
            }
            else
                res = exp;
            if (res === true) {
                fn.call(this, null);
            }
            else if (erfn) {
                erfn.call(this, null);
            }
            return this;
        };
        return tag;
    }());
    ns.tag = tag;
    var template = (function () {
        function template() {
        }
        template.prototype.call = function (data) {
            var e = this;
            data.forEach(function (d, index, array) {
                e._itemFunc.call(e.context, d, index, index == 0 ? -1 : index == data.length - 1 ? 1 : 0, array);
            });
        };
        template.prototype.item = function (item) { if (item) {
            this._itemFunc = item;
        } return this._itemFunc; };
        return template;
    }());
    ns.template = template;
    var watcher = (function () {
        function watcher() {
            this._ = {};
            this.dispatch = new Dispatch();
        }
        watcher.prototype.define = function (target, field, conf) { Object.defineProperty(target, field, conf); return this; };
        watcher.define = function (target, field, conf) { Object.defineProperty(target, field, conf); return this; };
        watcher.prototype.watch = function (model) {
            for (var i in model) {
                this.dispatch.register(i);
                this.define(this, i, {
                    get: function () {
                        return this._[i];
                    },
                    set: function (val) {
                        this.dispatch[i].call(this, null);
                        this._[i] = val;
                    },
                    enumerable: true,
                    configurable: true
                });
            }
            return this;
        };
        watcher.prototype.on = function (evn, fn) {
            this.dispatch.on(evn, fn);
        };
        watcher.prototype.off = function (evn, fn) {
            this.dispatch.off(evn.fn);
        };
        return watcher;
    }());
    ns.watcher = watcher;
    var Promise = (function () {
        function Promise() {
            this.callbacks = { success: [], faild: [], callback: [] };
            this._status = "";
        }
        Promise.prototype.sucess = function () {
            var fn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fn[_i - 0] = arguments[_i];
            }
            if (fn instanceof Function) {
                this.callbacks.success.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () { me.callbacks.success.push(fn); });
            }
            return this;
        };
        Promise.prototype.faild = function () {
            var fn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fn[_i - 0] = arguments[_i];
            }
            if (fn instanceof Function) {
                this.callbacks.faild.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () { me.callbacks.faild.push(fn); });
            }
            return this;
        };
        Promise.prototype.callback = function () {
            var fn = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                fn[_i - 0] = arguments[_i];
            }
            if (fn instanceof Function) {
                this.callbacks.callback.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () { me.callbacks.callback.push(fn); });
            }
            return this;
        };
        Promise.prototype.then = function (sfn, ffn, cfn) {
            if (!sfn) {
                return this;
            }
            this.callbacks.success.push(sfn);
            ffn ? this.callbacks.faild.push(ffn) : null;
            cfn ? this.callbacks.callback.push(cfn) : null;
            return this;
        };
        Promise.prototype.reset = function () { this._status = ""; this.callbacks = { success: [], faild: [], callback: [] }; return this; };
        Promise.prototype.resetStatus = function () { this._status = ""; return this; };
        Promise.prototype.execute = function (status) {
            this._status = status;
            var args = ns.slice(arguments).slice(1);
            if (this._status == "success") {
                for (var i = 0; i < this.callbacks.success.length; i++) {
                    this.callbacks.success[i].call(this, args);
                }
            }
            else {
                for (var i = 0; i < this.callbacks.faild.length; i++) {
                    this.callbacks.faild[i].call(this, args);
                }
            }
            for (var i = 0; i < this.callbacks.callback.length; i++) {
                this.callbacks.callback[i].call(this, args);
            }
        };
        return Promise;
    }());
    ns.Promise = Promise;
    var commandParse = (function () {
        function commandParse(context) {
            this.dispatch = new Dispatch();
            this.context = context;
        }
        commandParse.prototype.parse = function (input) {
        };
        commandParse.prototype.parameter = function (params) {
        };
        commandParse.prototype.exec = function (input, param) { };
        commandParse.prototype.regiest = function (cmd, func) {
            if (cmd in this.dispatch) {
                this.dispatch.on(cmd, func);
            }
        };
        commandParse.prototype.unregiest = function () { };
        return commandParse;
    }());
    ns.commandParse = commandParse;
    var ajax = (function () {
        function ajax(url, mimeType, response, callback) {
            this.url = "";
            this.contentType = "application/json";
            this.type = "";
            this.data = "";
            this.headers = [];
            this._mimeType = "";
            this._responseType = "";
            this.method = "get";
            this._dispatch = ns.dispatch("beforesend", "progress", "load", "error", "completed", "success");
            this.url = url;
            var me = this;
            function xhrHasResponse(request) {
                var type = request.responseType;
                return type && type !== "text" ? request.response : request.responseText;
            }
            function respond() {
                var status = me.request.status, result;
                if (!status && xhrHasResponse(me.request) || status >= 200 && status < 300 || status === 304) {
                    try {
                        /xml/.test(me._mimeType) ? me._dispatch.success.call(me, me.request.responseXML, me.request) :
                            /json/.test(me._mimeType) ? me._dispatch.success.call(me, JSON.parse(me.request.responseText), me.request)
                                : me._dispatch.success.call(me, me.request.responseText, me.request);
                    }
                    catch (e) {
                        me._dispatch.error.call(me, e);
                        return;
                    }
                    me._dispatch.load.call(me, result);
                }
                else {
                    me._dispatch.error.call(me, me.request);
                }
            }
            this.request = new XMLHttpRequest();
            this.request.onreadystatechange = function () {
                me._dispatch.completed.call(me, me.request);
                me.request.readyState > 3 && respond();
            };
            if (window["XDomainRequest"] && !("withCredentials" in this.request) && /^(http(s)?:)?\/\//.test(this.url))
                this.request = new window["XDomainRequest"]();
            if (mimeType) {
                this._mimeType = mimeType;
            }
            if (response instanceof Function) {
                this._dispatch.on("success", response);
            }
        }
        ajax.prototype.header = function (name, value) {
            name = (name + "").toLowerCase();
            if (arguments.length < 2)
                return this.headers[name];
            if (value == null)
                delete this.headers[name];
            else
                this.headers[name] = value + "";
            return this;
        };
        ajax.prototype.onprogress = function (event) {
            try {
                this._dispatch.progress.call(this, this.request);
            }
            finally {
            }
        };
        ajax.prototype.mimeType = function (value) {
            if (!arguments.length)
                return this._mimeType;
            this._mimeType = value == null ? null : value + "";
            return this;
        };
        ajax.prototype.send = function (method, data, callback) {
            if (arguments.length === 2 && typeof data === "function")
                callback = data, data = null;
            this.method = method || this.method;
            if (typeof data === "object") {
                var d = "";
                for (var i in data) {
                    d += i + "=" + encodeURIComponent(data[i]) + "&";
                }
                data = d;
            }
            this.url = this.method.toLowerCase() == "get" ? this.url.indexOf("?") > 0 ? this.url + "&" + data : this.url + "?" + data : this.url;
            this.request.open(this.method, this.url, true);
            if (this._mimeType != null && !("accept" in this.headers))
                this.headers["accept"] = this._mimeType + ",*/*";
            if (this.request.setRequestHeader)
                if (!/head|get/i.test(method)) {
                    this.request.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");
                }
            for (var name in this.headers)
                this.request.setRequestHeader(name, this.headers[name]);
            if (this.mimeType != null && this.request.overrideMimeType)
                this.request.overrideMimeType(this._mimeType);
            if (this._responseType != null)
                this.request.responseType = this._responseType;
            //if (callback != null) xhr.on("error", callback).on("load", function (request) {
            //    callback(null, request);
            //});
            this._dispatch.beforesend.call(this, this.request);
            this.request.send(data == null ? null : data);
            return this;
        };
        ajax.prototype.abort = function () {
            this.request.abort();
            return this;
        };
        ajax.prototype.get = function (d, callback) {
            var s = "";
            if (typeof d === "object") {
                for (var i in d) {
                    s += i + "=" + d[i] + "&";
                }
            }
            else {
                s = d;
            }
            return this.send.apply(this, ["get", s, callback]);
        };
        ajax.prototype.post = function (d, callback) {
            return this.send.apply(this, ["post", d, callback]);
        };
        ajax.prototype.on = function (evn, fn) { this._dispatch.on(evn, fn); };
        ajax.loadJson = function (url, method, data, callback) {
            return ns.ajax.load(url, method, data, callback, "application/json");
        };
        ajax.load = function (url, method, data, callback, mimeType) {
            if (mimeType === void 0) { mimeType = "text/html"; }
            if (typeof callback === "function") {
                var xhr = new ajax(url, mimeType, function (json) {
                    callback.call(this, json, xhr);
                });
                if (method && "get" == method.toLowerCase()) {
                    xhr.get(data);
                }
                else if (method && "post" == method.toLowerCase()) {
                    xhr.post(data);
                }
                else {
                    return xhr.send.apply(xhr, [method, data, callback]);
                }
            }
            else {
                var xhr = new ajax(url, mimeType);
                callback.beforesend ? xhr.on("beforesend", callback.beforesend) : null;
                callback.progress ? xhr.on("progress", callback.progress) : null;
                callback.load ? xhr.on("load", callback.load) : null;
                callback.error ? xhr.on("error", callback.error) : null;
                callback.completed ? xhr.on("completed", callback.completed) : null;
                callback.success ? xhr.on("success", callback.success) : null;
                if (method && "get" == method.toLowerCase()) {
                    xhr.get(data);
                }
                else if (method && "post" == method.toLowerCase()) {
                    xhr.post(data);
                }
                else {
                    return xhr.send.apply(xhr, [method, data, callback]);
                }
            }
        };
        ajax.post = function (url, data, callback) {
            return ns.ajax.load(url, "post", data, callback, "application/json");
        };
        ajax.html = function (url, data, callback) {
            ns.ajax.load(url, "get", data, callback, "text/html");
        };
        return ajax;
    }());
    ns.ajax = ajax;
    var svg = (function (_super) {
        __extends(svg, _super);
        function svg(tag, parent) {
            _super.call(this, tag, parent);
        }
        svg.prototype.child = function (tag) {
            if (!/style=/i.test(this.html) && this.cssHtml) {
                this.html += " style='" + this.cssHtml + "' >" + this._text;
            }
            if (this.html.indexOf('>') <= 0) {
                this.html += ">" + this._text;
            }
            var t = new ns.svg(tag, this);
            t.isrendered = this.isrendered;
            return t;
        };
        svg.prototype.begin = function (exp) { _super.prototype.begin.call(this, exp); return this; };
        svg.svg = function (exp) { return new ns.svg("svg").begin(exp); };
        svg.g = function (exp) { return new ns.svg("g").begin(exp); };
        svg.tspan = function (exp) { return new ns.svg("tspan").begin(exp); };
        svg.prototype.altGlyph = function (exp) { return this.child("altGlyph").begin(exp); };
        svg.prototype.altGlyphDef = function (exp) { return this.child("altGlyphDef").begin(exp); };
        svg.prototype.altGlyphItem = function (exp) { return this.child("altGlyphItem").begin(exp); };
        svg.prototype.animate = function (exp) { return this.child("animate").begin(exp); };
        svg.prototype.animateColor = function (exp) { return this.child("animateColor").begin(exp); };
        svg.prototype.animateMotion = function (exp) { return this.child("animateMotion").begin(exp); };
        svg.prototype.animateTransform = function (exp) { return this.child("animateTransform").begin(exp); };
        svg.prototype.circle = function (exp) { return this.child("circle").begin(exp); };
        svg.prototype.clipPath = function (exp) { return this.child("clipPath").begin(exp); };
        svg.prototype.colorProfile = function (exp) { return this.child("color-Profile").begin(exp); };
        svg.prototype.cursor = function (exp) { return this.child("cursor").begin(exp); };
        svg.prototype.defs = function (exp) { return this.child("defs").begin(exp); };
        svg.prototype.desc = function (exp) { return this.child("desc").begin(exp); };
        svg.prototype.ellipse = function (exp) { return this.child("ellipse").begin(exp); };
        svg.prototype.feBlend = function (exp) { return this.child("feBlend").begin(exp); };
        svg.prototype.feColorMatrix = function (exp) { return this.child("feColorMatrix").begin(exp); };
        svg.prototype.feComponentTransfer = function (exp) { return this.child("feComponentTransfer").begin(exp); };
        svg.prototype.feComposite = function (exp) { return this.child("feComposite").begin(exp); };
        svg.prototype.feDiffuseLighting = function (exp) { return this.child("feDiffuseLighting").begin(exp); };
        svg.prototype.feDisplacementMap = function (exp) { return this.child("feDisplacementMap").begin(exp); };
        svg.prototype.feDistantLight = function (exp) { return this.child("feDistantLight").begin(exp); };
        svg.prototype.feFlood = function (exp) { return this.child("feFlood").begin(exp); };
        svg.prototype.feFuncA = function (exp) { return this.child("feFuncA").begin(exp); };
        svg.prototype.feFuncB = function (exp) { return this.child("feFuncB").begin(exp); };
        svg.prototype.feFuncG = function (exp) { return this.child("feFuncG").begin(exp); };
        svg.prototype.feFuncR = function (exp) { return this.child("feFuncR").begin(exp); };
        svg.prototype.feGaussianBlur = function (exp) { return this.child("feGaussianBlur").begin(exp); };
        svg.prototype.feImage = function (exp) { return this.child("feImage").begin(exp); };
        svg.prototype.feMerge = function (exp) { return this.child("feMerge").begin(exp); };
        svg.prototype.feMergeNode = function (exp) { return this.child("feMergeNode").begin(exp); };
        svg.prototype.feMorphology = function (exp) { return this.child("feMorphology").begin(exp); };
        svg.prototype.feOffset = function (exp) { return this.child("feOffset").begin(exp); };
        svg.prototype.fePointLight = function (exp) { return this.child("fePointLight").begin(exp); };
        svg.prototype.feSpecularLighting = function (exp) { return this.child("feSpecularLighting").begin(exp); };
        svg.prototype.feSpotLight = function (exp) { return this.child("feSpotLight").begin(exp); };
        svg.prototype.feTile = function (exp) { return this.child("feTile").begin(exp); };
        svg.prototype.feTurbulence = function (exp) { return this.child("feTurbulence").begin(exp); };
        svg.prototype.filter = function (exp) { return this.child("filter").begin(exp); };
        svg.prototype.font = function (exp) { return this.child("font").begin(exp); };
        svg.prototype.foreignObject = function (exp) { return this.child("foreignObject").begin(exp); };
        svg.prototype.g = function (exp) { return this.child("g").begin(exp); };
        svg.prototype.glyph = function (exp) { return this.child("glyph").begin(exp); };
        svg.prototype.hkern = function (exp) { return this.child("hkern").begin(exp); };
        svg.prototype.image = function (exp) { return this.child("image").begin(exp); };
        svg.prototype.line = function (exp) { return this.child("line").begin(exp); };
        svg.prototype.linearGradient = function (exp) { return this.child("linearGradient").begin(exp); };
        svg.prototype.marker = function (exp) { return this.child("marker").begin(exp); };
        svg.prototype.mask = function (exp) { return this.child("mask").begin(exp); };
        svg.prototype.metadata = function (exp) { return this.child("metadata").begin(exp); };
        svg.prototype.mpath = function (exp) { return this.child("mpath").begin(exp); };
        svg.prototype.path = function (exp) { return this.child("path").begin(exp); };
        svg.prototype.pattern = function (exp) { return this.child("pattern").begin(exp); };
        svg.prototype.polygon = function (exp) { return this.child("polygon").begin(exp); };
        svg.prototype.polyline = function (exp) { return this.child("polyline").begin(exp); };
        svg.prototype.radialGradient = function (exp) { return this.child("radialGradient").begin(exp); };
        svg.prototype.rect = function (exp) { return this.child("rect").begin(exp); };
        svg.prototype.set = function (exp) { return this.child("set").begin(exp); };
        svg.prototype.stop = function (exp) { return this.child("stop").begin(exp); };
        svg.prototype.svg = function (exp) { return this.child("svg").begin(exp); };
        svg.prototype.switch = function (exp) { return this.child("switch").begin(exp); };
        svg.prototype.symbol = function (exp) { return this.child("symbol").begin(exp); };
        svg.prototype.textSVG = function (exp) { return this.child("text").begin(exp); };
        svg.prototype.textPath = function (exp) { return this.child("textPath").begin(exp); };
        svg.prototype.title = function (exp) { return this.child("title").begin(exp); };
        svg.prototype.tref = function (exp) { return this.child("tref").begin(exp); };
        svg.prototype.tspan = function (exp) { return this.child("tspan").begin(exp); };
        svg.prototype.useSVG = function (exp) { return this.child("use").begin(exp); };
        svg.prototype.viewSVG = function (exp) { return this.child("view").begin(exp); };
        return svg;
    }(tag));
    ns.svg = svg;
    var immuno = (function (_super) {
        __extends(immuno, _super);
        function immuno() {
            _super.apply(this, arguments);
        }
        immuno.prototype.module = function (conf, parent, position) {
            this.g(".immuno-module").rect(".immuno-module-edge").attr({
                width: "203px", height: "233px", style: "fill:#fff;stroke-width:0.6;stroke:#222;"
            }).host("edge", this).end().end();
            return this;
        };
        immuno.prototype.prepare = function (conf) {
            this.tag = "svg";
            this.begin(conf);
            return this;
        };
        immuno.prototype.ready = function (param) { return this.end().render(param); };
        return immuno;
    }(svg));
    ns.immuno = immuno;
    var pie = (function () {
        function pie() {
            this._r1 = 0;
            this._r2 = 0;
            this._strokeWidth = 4;
            this._cx = 0;
            this._cy = 0;
            this._mode = "circle";
            this._conf = {};
            this._ticks = [];
            this.title = ns.svg.g(".pie-title");
            this.canvas = ns.svg.g(".pie-canvas");
            this.legend = ns.svg.g(".pie-legend");
            this.graph = ns.svg.svg(".pie");
        }
        pie.svg = function (exp) { return new ns.tag("svg").begin(exp); };
        pie.prototype.mode = function () { if (arguments.length) {
            this._mode = arguments[0];
            return this;
        } return this._mode; };
        pie.prototype.r = function () { if (arguments.length) {
            this._r1 = arguments[0];
            return this;
        } return this._r1; };
        pie.prototype.r2 = function () { if (arguments.length) {
            this._r2 = arguments[0];
            return this;
        } return this._r2; };
        pie.prototype.strokeWidth = function () { if (arguments.length) {
            this._strokeWidth = arguments[0];
            return this;
        } return this._strokeWidth; };
        pie.prototype.cx = function () { if (arguments.length) {
            this._cx = arguments[0];
            return this;
        } return this._cx; };
        pie.prototype.cy = function () { if (arguments.length) {
            this._cy = arguments[0];
            return this;
        } return this._cy; };
        //mode(): any { if (arguments.length) { this._mode = arguments[0]; return this; } return this._mode; }
        pie.prototype.render = function () {
            this.graph._ns.empty();
            this.title.end().render(this.graph);
            var tbr = this.title._ns.getBoundingRect();
            this.legend.end().render(this.graph);
            var lbr = this.legend._ns.getBoundingRect();
            var total = 0;
            this._ticks.forEach(function (d) { if (d.disabled) {
                return;
            } total += parseFloat(d.value); });
            if (total == 0) {
                this._ticks.forEach(function (d) { if (d.disabled) {
                    d.disabled = false;
                } total += parseFloat(d.value); });
            }
            var g = this.canvas.g(".g");
            var starAngle = 0, showticks = [];
            for (var i = 0; i < this._ticks.length; i++) {
                if (this._ticks[i].disabled == null) {
                    this._ticks[i].disabled = false;
                }
                if (this._ticks[i].disabled) {
                    continue;
                }
                var color = this._ticks[i].color;
                if (!this._ticks[i].css) {
                    this._ticks[i].css = {};
                }
                if (!this._ticks[i].css.fill) {
                    this._ticks[i].css.fill = color;
                    this._ticks[i].color = color;
                }
                var per = this._ticks[i].value / total, deg = per * 360;
                this._ticks[i].startDeg = starAngle;
                this._ticks[i].endDeg = starAngle + deg;
                this._ticks[i].percent = per;
                starAngle = this._ticks[i].endDeg;
                showticks.push(this._ticks[i]);
                if (this._mode == "annular" || this._mode == "circle") {
                }
                else if (this._mode == "gauge") {
                    this._drawgauge(g.g().attr({ "ns-chart-pie": this._ticks[i].text }).addClass("ns-chart-pie-item"), this._ticks[i], this._ticks.length, i);
                }
                else if (this._mode == "pgauge") {
                }
            }
            this.canvas.end().render(this.graph);
            var cbr = this.canvas._ns.getBoundingRect();
        };
        pie.prototype._drawgauge = function (canvas, series, length, index) {
            var cx = this._cx, cy = this._cy, r2 = this._r2, r = this._r1, strokeWidth = this._strokeWidth;
            var sa = 0, ea = 360 * (series.percent || series.value), tr = r2 + index * ((r - r2) + strokeWidth), tr1 = r + index * ((r - r2) + strokeWidth), p0 = [cx - tr * Math.cos(sa * Math.PI / 180), cy - tr * Math.sin(sa * Math.PI / 180)], p1 = [cx - tr1 * Math.cos(sa * Math.PI / 180), cy - tr1 * Math.sin(sa * Math.PI / 180)], p2 = [cx - tr1 * Math.cos(ea * Math.PI / 180), cy - tr1 * Math.sin(ea * Math.PI / 180)], p3 = [cx - tr * Math.cos(ea * Math.PI / 180), cy - tr * Math.sin(ea * Math.PI / 180)], mp0 = [cx - tr * Math.cos(0 * Math.PI / 180), cy - tr * Math.sin(0 * Math.PI / 180)], mp1 = [cx - tr1 * Math.cos(0 * Math.PI / 180) - 1, cy - tr1 * Math.sin(0 * Math.PI / 180) - 1], mp2 = [cx - tr1 * Math.cos(359.5 * Math.PI / 180) - 1, cy - tr1 * Math.sin(359 * Math.PI / 180) - 1], mp3 = [cx - tr * Math.cos(359 * Math.PI / 180), cy - tr * Math.sin(359 * Math.PI / 180)];
            canvas.g(".pie-mask ").path().attr({
                d: "M" + mp0.join(',') + " L" + mp1.join(',') + "A" + tr1 + "," + tr1 + " 0,1,1 " + mp2.join(',')
                    + " L" + mp3.join(',') + "A" + tr + "," + tr + " 0,1,0 " + mp0.join(',') + " Z",
                fill: "#808080", "fill-opacity": "0.2"
            }).end().end();
            canvas.g(".pie-chart").path().if(ea - sa > 180, function () {
                this.attr({
                    d: "M" + p0.join(',') + " L" + p1.join(',') + "A" + tr1 + "," + tr1 + " 0,1,1 " + p2.join(',')
                        + " L" + p3.join(',') + "A" + tr + "," + tr + " 0,1,0 " + p0.join(',') + " Z"
                });
            }, function () {
                this.attr({
                    d: "M" + p0.join(',') + " L" + p1.join(',') + "A" + tr1 + "," + tr1 + " 0,0,1 " + p2.join(',')
                        + " L" + p3.join(',') + "A" + tr + "," + tr + " 0,0,0 " + p0.join(',') + " Z"
                });
            }).sync(function () {
                if (series.fill) {
                    this.attr("fill", series.fill);
                }
                if (series.color) {
                    this.attr("fill", series.color);
                }
                if (series.css) {
                    this.css(series.css);
                }
                if (series.attr) {
                    this.attr(series.attr);
                }
            }).attr({ "ns-chart": "pie", "ns-chart-pie-start": series.startDeg, "ns-chart-pie-end": series.endDeg, "ns-chart-data": series.data, "ns-chart-argument": series.value, "ns-chart-text": series.text }).end();
            //g.on("mouseover", function (e) {
            //    dispatch.hover.call(s, g, e);
            //}).on("mousemove", function (e) {
            //        dispatch.hovermove.call(s, g, e);
            //    }).on("mouseout", function (e) {
            //    });
            //ns.tooltip().cascading(g).offsetY(10).content(s.ticksFormat().call(s, series.text, series.value, series));
        };
        return pie;
    }());
    ns.pie = pie;
})(ns || (ns = {}));
//# sourceMappingURL=ns.js.map