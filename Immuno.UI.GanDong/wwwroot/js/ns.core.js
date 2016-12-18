if (window.document) {
    try {
        window.document.createElement("DIV").style.setProperty("opacity", "0", "");
    } catch (error) {
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
}
Array.prototype["each"] = function (fn, args) {
    var length = this.length;
    for (var i = 0; i < length; i++) {
        if (fn.call(this[i], i, args) === true) {
            break;
        }
    }
};
String.prototype["lTrim"] = function (r) {
    if (r) {
        this.replace();
    }
    return this.replace(/(^\s*)/g, "");
};

//祛除右空格
String.prototype["rTrim"] = function (r) {
    if (r) {
        this.replace();
    }
    return this.replace(/(\s*$)/g, "");
};

//祛除左右空格
String.prototype["Trim"] = function (r) {
    if (r) {
        this.replace();
    }
    return this.replace(/(\s*$)|(^\s*)/g, "");
};

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
        }
    }
};
Ns.CSS = {
    getUnitType: function (property) {
        if (/^(rotate|skew)/i.test(property)) {
            return "deg";
        } else if (/(^(scale|scaleX|scaleY|scaleZ|alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
            return "";
        } else {
            return "px";
        }
    },
    getUnitFormatType: function (property) {
        if (/^(rotate|skew)/i.test(property)) {
            return property + "({0}deg)";
        } else if (/(^(alpha|flexGrow|flexHeight|zIndex|fontWeight)$)|((opacity|red|green|blue|alpha)$)/i.test(property)) {
            return "{0}";
        } else if (/^(scale|scaleX|scaleY|scaleZ)/.test(property)) {
            return property + "({0})";
        } else {
            return "{0}px";
        }
    },
    getDisplayType: function (element) {
        var tagName = element && element.tagName.toString().toLowerCase();

        if (/^(b|big|i|small|tt|abbr|acronym|cite|code|dfn|em|kbd|strong|samp|var|a|bdo|br|img|map|object|q|script|span|sub|sup|button|input|label|select|textarea)$/i.test(tagName)) {
            return "inline";
        } else if (/^(li)$/i.test(tagName)) {
            return "list-item";
        } else if (/^(tr)$/i.test(tagName)) {
            return "table-row";
        } else if (/^(table)$/i.test(tagName)) {
            return "table";
        } else if (/^(tbody)$/i.test(tagName)) {
            return "table-row-group";
            /* Default to "block" when no match is found. */
        } else {
            return "block";
        }
    },
    parseProperty: function (property) {
        var s = property.split("-"), i = 0, l = s.length, p = "";
        for (; i < l; i++) {
            if (i == 0) {
                p = s[i].toLowerCase();
            } else {
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
        if ((v = dom.css(prop)) == "auto" && (v = dom.css("max-" + prop), v != "auto" ? dom.property("_animation_toggle_fix", (p = {} || dom.property("_animation_toggle_fix"))["max-" + prop] = v != "auto" ? v : "") : "") == "auto") {
            this.getHeightWidth(dom.parent(), prop);
        } else {
            return v;
        }
    }
};
var ns = (function () {
    function ns() {
        this.selected = [];
    }
    ns.logicAnd = function () {
        if (arguments.length) {
            var param = true;
            for (var i = 0; i < arguments.length; i++) {
                param &= !!(arguments[i] instanceof Function ? arguments[i]() : arguments[i]);
            }
            return param;
        }
        else {
            return false;
        }
    }
    ns.logicOr = function () {
        if (arguments.length) {
            var param = false;
            for (var i = 0; i < arguments.length; i++) {
                param |= !!(arguments[i] instanceof Function ? arguments[i]() : arguments[i]);
            }
            return param;
        }
        else {
            return false;
        }
    }
    ns.if = function (exp, fn, erfn) {
        var res = false;
        if (typeof exp === "function") { res = exp.call(this, null); }
        else res = exp;
        if (res === true) { fn.call(this, null); }
        else if (erfn) { erfn.call(this, null); }
        return this;
    }
    ns.landingline = function (config) {
        if (typeof config === "function") { config = { callback: config }; }
        if (!config) { config = {}; }
        if (config instanceof String) { config = { parent: config }; }
        config.time = config.time || 3;
        config.width = config.width || 5;
        config.background = config.backround || "#886ed7";
        config.height = config.height || 1;
        config.delay = config.delay || 0;
        var thtmlStyle = " <style>@-webkit-keyframes landingline_animate { 0% { margin-left: 0;} 5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}} @keyframes landingline_animate { 0% { margin-left: 0;}5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}}</style>";
        var thtml = "<div style='height: " + config.height + "px; width: " + config.width + "%; margin: 0px;, float: left; background-color: " + config.background + "; animation: landingline_animate " + config.time + "s infinite; -webkit-animation: landingline_animate " + config.time + "s infinite animation-delay:" + config.delay + "s; -webkit-animation-delay: " + config.delay + "s: " + (config.csstext || ";") + "\'></div>"
        var t = ns.select(ns.parseHtml("<div style='height:1px;'></div>"));
        t.append(ns.parseHtml(thtmlStyle)); t.append(ns.parseHtml(thtml));
        t.isappended = false;
        config.callback ? config.callback.call(t, config.parent) : null;
        if (config.parent && !t.isappended) {
            t.appendTo(config.parent);
        }
        return t;
    }
    Object.defineProperty(ns.prototype, "length", {
        get: function () {
            return this.selected.length;
        },
        enumerable: true,
        configurable: true
    });
    ns.sequence = function () {
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
    }
    ns.merge = function (obj) {
        var i = 1
            , target
            , key;

        for (; i < arguments.length; i++) {
            target = arguments[i];
            for (key in target) {
                if (Object.prototype.hasOwnProperty.call(target, key)) {
                    obj[key] = target[key];
                }
            }
        }

        return obj;
    }
    ns.loadJson = function (url, method, data, callback) {
        return ns.ajax.load(url, method, data, callback, "application/json");
    };
    ns.querystring = function () {
        var qs = new ns.Map();
        var href = window.location.href;
        var indexofPos = href.lastIndexOf('?'), indexofj = href.indexOf("#");
        if (indexofj < indexofPos) {
            href = href.substr(indexofPos);
        } else {
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
    ns.require = function (val, exp, call) {
        if (!exp) {
            return true;
        }
        var rt = true;
        if (exp == "notnull") {
            rt = !!val;
        } else if (exp instanceof RegExp) {
            rt = exp.test(val);
        } else if (typeof exp === "function") {
            rt = exp.call(this, val);
        } else if (exp instanceof Array) {
            exp.forEach(function (d) {
                rt = ns.require(val, d);
                return !rt;
            });
        } else if (typeof exp === "object") {
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
            } else {
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
        } else if (document.compatMode && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollPos = document.body.scrollTop;
        }
        return scrollPos;
    };
    ns.scrollLeft = function () {
        var scrollPos;
        if (window.pageXOffset) {
            scrollPos = window.pageXOffset;
        } else if (document.compatMode && document.compatMode != 'BackCompat') {
            scrollPos = document.documentElement.scrollLeft;
        } else if (document.body) {
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
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            ar[_i] = arguments[_i + 0];
        }
        var disp = new ns.Dispatch(), i = -1, n = arguments.length;
        while (++i < n) {
            var evn = arguments[i];
            if (evn.indexOf(',') > 0) {
                evn.split(',').forEach(function (d) {
                    disp[d] = ns["dispatch_event"](disp);
                });
            } else {
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
    ns.layer = function (conf) {
        if (!conf) {
            conf = { title: "Popup Layer 弹出框", iconClass: ".fa .fa-dialog", loading: false, left: "13.5%", top: "240px", height: "280px;", width: "60%", titleCss: "" };
        }
        var layer = {
            title: conf.title || "Popup Layer 弹出框",
            css: {
                left: conf.left || "13.5%",
                top: conf.top || "240px",
                height: conf.height || "280px;",
                width: conf.width || "60%",
            },
            icon: conf.icon || ".fa .fa-dialog",
            titleCss: conf.titleCss || {},
            loading: conf.loading == null || conf.loading == undefined ? false : conf.loading,
            drag: conf.drag == null || conf.drag == undefined ? true : conf.drag,
            enableLanding: conf.enableLanding == null || conf.enableLanding == undefined ? true : conf.enableLanding,
            dispatch:new ns.dispatch("modechanged","drag"),
        }
        if (conf.css) {
            layer.css = ns.merge(layer.css, conf.css);
        }
        var htmltemplate = '<div class="pop-lay" style="display:block; border-color:#e0e0e0; border-width:0.1px; position:fixed; min-height:280px; border-style:solid; background-color:white; box-shadow:gray 0 0 30px;"><div class="layer-landing" style=" margin-bottom:1px;"></div><div class="info-bar" style=" border-left-color:rgb(0,156,204); border-left-width:3px; border-left-style:solid; margin-left:0px; cursor:pointer; height:19px;"><div class="info-title" style=" text-overflow:ellipsis; line-height:18px; font-size:12px; cursor:auto; margin-left:10px; float:left; padding-left:3px; color:#808080;"><span class="info-title-icon" style=" width:15px; height:15px; line-height:15px;"></span><span class="info-title-content" style=" height:15px; line-height:15px;"></span></div><div class="hover-color fa-close fa screen-close" style=" float:right; margin-right:5px; cursor:pointer;"></div><div style=" clear:both;"></div></div><div class="layer-content"></div></div>';
        
        layer.render = function (fn) {
            
            var context = ns.select(ns.parseHtml(htmltemplate));
            if (layer.drag) {
                ns.drag(context, context.find(".info-bar"));
            }
            if (layer.enableLanding) {
                context.landing = ns.landingline({ parent: context.find(".layer-landing") });
                if (!layer.loading) {
                    context.landing.hide();
                }
            }
            context.css(layer.css);
            if (layer.title) {
                context.find(".info-title-content").html(layer.title);
            }
            if (fn instanceof Function) {
                fn.call(context, layer,context.find(".layer-content"));
            }
            else if (fn instanceof String) {
                context.find(".layer-content").html(fn);
            }
            context.appendTo("body")
            layer.context = context;
            return layer;
        }
        layer.min = function () {
            layer.mode = "min";
            layer.hide();
            layer.dispatch.modechanged.call(layer, layer.mode);
        }
        layer.restore = function () {
            layer.mode = "min";
            layer.hide();
            layer.dispatch.modechanged.call(layer, layer.mode);
        }
        layer.max = function () {
            layer.mode = "normal";
            layer.context.css({width:"100%",height:"100%",left:0,top:0,right:0,bottom:0});
            layer.dispatch.modechanged.call(layer, layer.mode);
        }
        layer.close = function () {
            layer.mode = "closed";
            layer.context.remove();
            layer.dispatch.modechanged.call(layer, layer.mode);
        }
        layer.show = function () {
            layer.mode = "showed";
            layer.dispatch.modechanged.call(layer, layer.mode);
        }
        layer.hide = function () {
            layer.mode = "hided";
            layer.context.hide();
            layer.dispatch.modechanged.call(layer, "hided");
        }
        return layer;
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
        } else if (/^\S*<td/i.test(tag)) {
            obj = document.createElement("tr");
            obj.innerHTML = tag;
        } else if (/^\S*<li/i.test(tag)) {
            obj = document.createElement("ul");
            obj.innerHTML = tag;
        } else if (/^(altGlyph|altGlyphDef|altGlyphItem|animate|animateColor|animateMotion|animateTransform|circle|clipPath|color\-profile|cursor|definition\-src|defs|desc|ellipse|feBlend|feColorMatrix|feComponentTransfer|feComposite|feConvolveMatrix|feDiffuseLighting|feDisplacementMap|feDistantLight|feFlood|feFuncA|feFuncB|feFuncG|feFuncR|feGaussianBlur|feImage|feMerge|feMergeNode|feMorphology|feOffset|fePointLight|feSpecularLighting|feSpotLight|feTile|feTurbulence|filter|font|font\-face|font\-face\-format|font\-face\-name|font\-face\-src|font\-face\-uri|foreignObject|g|glyph|glyphRef|hkern|image|line|linearGradient|marker|mask|metadata|missing\-glyph|mpath|path|pattern|polygon|polyline|radialGradient|rect|set|stop|svg|switch|symbol|text|textPath|title|tref|tspan|use|view|vkern)/i.test(tag)) {
            var xmlnames = {
                ns: 'http://www.w3.org/2000/svg',
                xmlns: 'http://www.w3.org/2000/xmlns/',
                xlink: 'http://www.w3.org/1999/xlink'
            };
            var element = document.createElementNS(xmlnames.ns, tag);
        } else if (/^\S*</.test(tag)) {
            obj = document.createElement("div");
            obj.innerHTML = tag;
        } else {
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
        while ((r = d.nextSibling) != null) {
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
        while ((r = d.previousSibling) != null) {
            rs.push(r);
        }
        return rs;
    };
    ns.camelCase = function (string) {
        return string.replace(/^-ms-/, "ms-").replace(/-([\da-z])/gi, fcamelCase);
    };
    ns._getStyle = function (elem) {
        // Support: IE<=11+, Firefox<=30+ (#15098, #14150)
        // IE throws on elements created in popups
        // FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
        if (elem.ownerDocument.defaultView.opener) {
            return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        }
        return window.getComputedStyle(elem, null);
    };
    ns.data = function (data) {
        var d = new ns.dataProccessing();
        d.datum(data);
        return d;
    };
    ns.databind = function (data) {
        var d = new ns.dataProccessing();
        d.selector = this;
        d.datum(data);
        d.extends(this);
        return d;
    };
    ns.drag = function (moveDom, bindDom, opacity) {
        var bindDom = typeof bindDom === "string" ? ns.select(bindDom) : bindDom || this._ns;
        var opacity = opacity ? opacity : 1;
        var moveDom = moveDom ? typeof moveDom === "string" ? ns.select(moveDom) : moveDom : bindDom;
        var resumPointer = "";
        function parseInt1(o) {
            var i = parseInt(o);
            return isNaN(i) ? 0 : i;
        }
        var me = this;
        var listen = function () {
            ns.select(bindDom).on("mousedown", function (a) {
                var o = moveDom.node ? moveDom.node() : moveDom;
                var d = document; if (!a) a = window.event;
                if (!a.pageX) a.pageX = a.clientX;
                if (!a.pageY) a.pageY = a.clientY;
                var x = a.pageX, y = a.pageY;
                if (o.setCapture)
                    o.setCapture();
                else if (window.captureEvents)
                    window.captureEvents.call(window, Event["MOUSEMOVE"] | Event["MOUSEUP"]);
                var backData = { x: moveDom.css("top"), y: moveDom.css("left") };
                resumPointer = moveDom.css("cursor");
                moveDom.css({ "cursor": "pointer" });
                function move(a) {
                    if (!a) a = window.event;
                    if (!a.pageX) a.pageX = a.clientX;
                    if (!a.pageY) a.pageY = a.clientY;
                    var tx = a.pageX - x + parseInt1(moveDom.css("left")), ty = a.pageY - y + parseInt1(moveDom.css("top"));
                    moveDom.css({ left: tx + "px", top: ty + "px" });
                    x = a.pageX;
                    y = a.pageY;
                }
                function up(a) {
                    if (!a) a = window.event;
                    if (o.releaseCapture)
                        o.releaseCapture();
                    else if (window.captureEvents)
                        window.captureEvents.call(window, Event["MOUSEMOVE"] | Event["MOUSEUP"]);
                    d.onmousemove = null;
                    d.onmouseup = null;
                    if (!a.pageX) a.pageX = a.clientX;
                    if (!a.pageY) a.pageY = a.clientY;
                    if (!document.body["pageWidth"]) document.body["pageWidth"] = document.body.clientWidth;
                    if (!document.body["pageHeight"]) document.body["pageHeight"] = document.body.clientHeight;
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
        }
        if (bindDom) {
            listen();
        }
    }
    ns.popup = function (conf) {
        if (!conf) { conf = {}; }
        function ns_popdialog() { }
        var pop = new ns_popdialog();

        var position = ns.popup.position || "bottom", speed = conf.speed || 3000
            , delay = conf.delay || 3000, autoStartAnimation = conf.autoAnimation == null ? true : conf.autoAnimation, disabledHover = conf.disabledHover == null ? false : conf.disabledHover
            , offsetX = conf.offsetX || -1, mode = conf.mode || "popup", offsetY = conf.offsetY || -1, warningColor = "yellow", alertColor = "#60AC39", errorColor = "red"
            , timerid = 0, level = conf.level || "alert", id = "nspopup" + ns.guid(), popdom = null
            , screenWidth = window.screen.width - 10, screenHeight = window.screen.height - 10, hiding = false, showtweens = null, hidetweens = null;
        var _html = "<div id='" + id + "' style=\"left:auto;line-height: 20px;min-width:240px;min-height:30px;text-align: left;border-radius: 5px;box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px; position: fixed; color:#000000; font-family:Verdana;right:10px;\" class='ns-popup'><div class='ns-popup-contentbox'  style=\"\">{content}</div></div>";

        pop.render = function (x, y) {
            if (x && x !== 0) { offsetX = x; } if (y && y !== 0) { offsetY = y; }
            if (mode == "popup") {
                var ox = offsetX === -1 || offsetX === "auto" ? 10 : offsetX, oy = offsetY === -1 || offsetY === "auto" ? 10 : offsetY;
                if (position == "top") {
                    this.object.css({ "top": ns.popup.top + (ns.popup.top <= 10 ? 0 : oy) + "px", right: ox + "px" });
                    ns.popup.top += this.object.getBoundingHeight() + (ns.popup.top <= 10 ? 0 : oy);
                } else {
                    this.object.css({ bottom: ns.popup.bottom + (ns.popup.bottom <= 10 ? 0 : oy) + "px", right: ox + "px" });
                    ns.popup.bottom += this.object.getBoundingHeight() + (ns.popup.bottom <= 10 ? 0 : oy);
                }
            } else {
                var ox = offsetX === -1 || offsetX === "auto" ? screenWidth / 2 - 30 : offsetX + 10, oy = offsetY === -1 || offsetY === "auto" ? screenHeight / 2 - 40 : offsetY + 10;
                this.css({ "top": (oy) + "px", left: (ox) + "px" });
            }
            this.show(300);
            return autoStartAnimation ? this.startTick() : this;
        }
        pop.show = function (speed, callback) {
            var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { }
            callback = callback || {};
            var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
            callback.onchanged = function (d, s) {
                var tween = this;
                setTimeout(function () {
                    if (!d) {
                        onchanged.apply(me, arguments); return;
                    }
                    if ("tweenjs_count" in d) delete d.tweenjs_count;

                    tween.pluginData.dom.css(d);
                    onchanged.apply(me, arguments);
                });
            }
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
        }
        pop.hide = function (speed, callback) {
            var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () { }
            callback = callback || {};
            var onchanged = callback.onchanged || function () { }, speed = speed ? speed : 300;
            callback.onchanged = function (d, s) {
                var tween = this;
                setTimeout(function () {
                    if (!d) {
                        onchanged.apply(me, arguments); return;
                    }
                    if ("tweenjs_count" in d) delete d.tweenjs_count;
                    tween.pluginData.dom.css(d);
                    onchanged.apply(me, arguments);
                });
            }
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
                    } else {
                        var nbottom = parseFloat(nss.css("bottom"));
                        if (ns.popup.bottom > nbottom) {
                            ns.popup.bottom = nbottom - offsetY;
                        }
                    }
                    successback.call(nss, null);
                });
            });
            return this;
        }
        pop.startTick = function (time) {
            timerid = window.setTimeout(function () {
                hiding = true;
                pop.hide(speed);
            }, delay || time);
            return this;
        }
        pop.clearTick = function () {
            if (timerid) { window.clearTimeout(timerid); }
            return this;
        }
        pop.css = function (prop, val) { if (val) { pop.object.css(prop, val); } else { pop.object.css(prop); } return this; }
        pop.content = function (content) {
            if (content) {
                pop.object.find(".ns-popup-contentbox").html(content);
                return this;
            }
            else return pop.object.find(".ns-popup-contentbox").html();
        }
        pop.alert = function (msg, css) { this.content(msg).css({ "background-color": alertColor }).render().css(css); return this; }
        pop.warning = function (msg, css) { this.content(msg).css({ "background-color": warningColor }).render().css(css); return this; }
        pop.error = function (msg, css) { this.content(msg).css({ "background-color": errorColor }).render().css(css); return this; }
        pop.msg = function (msg, css) { this.content(msg).render().css(css); return this; }

        pop.stopAnimate = function () {
            if (hiding || hidetweens) {
                hidetweens.setPaused(true);
            }
            if (showtweens) {
                showtweens.setPaused(true);
            }
        }
        popdom = ns.parseHtml(_html);
        ns.select("body").append(popdom);
        pop.object = ns.select(popdom);
        pop.object.on("mouseover", function () {
            if (disabledHover) { return; }
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
    }
    ns.nearip = function (conf) {
        function hoverip() { };
        if (!conf) { conf = {}; }
        var speed = conf.speed || 300, deplay = 300;
        var showed = false, selector = null, timerid, rendered = false
            , offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5, offsetY = conf.offsetY || 5
            , origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()),
            _html = conf.html || "<div id='" + id + "' style=\"display:none;width:" + (!conf.width ? "auto" : conf.width) + ";line-height: 20px;border-radius: 1px; box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding-top: 10px;padding-left: 5px;padding-bottom: 10px; position: absolute; \" class='ns-nearip'><div class='ns-nearip-contentbox'  style=\" font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>"
            , _arrow = conf.arrowHtml || "<span class='ns-nearip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: " + (conf.arrowWidth ? conf.arrowWidth : 10) + "px;border-style: solid;'></span>"
            , _container = null
            , arrow = null
            , abottom = conf.bottom == null ? true : conf.bottom
            , isrunning = false
            , aleft = conf.left == null ? true : conf.left, fill = conf.fill == null ? "" : conf.fill
            , enableMove = conf.enableMove != null ? conf.enableMove : true
            , disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false
            , isrendered = false
            , deplayHide = conf.delayHide || 0
            , deplayHideTimerid
            , startingEventName = conf.startingEventName == null ? "mouseover" : conf.startingEventName, endingEventName = conf.endingEventName || "mouseout";

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
            if (dom) { selector = ns.select(dom); }
            selector.on(startingEventName, function (e) {
                trigger(e);
                ns.select("body").once("click", function () {
                });
            })
            return this;
        }
        context.render = function () {
            var c = selector.getBoundingRect(), y = c.top + (ns.scrollTop() || 0), x = c.left + (ns.scrollLeft() || 0), w = c.width, h = c.height;
            abottom = false; aleft = true;
            if (x - selector.getBoundingWidth() - offsetwidth - offsetX < 0) { aleft = false; }
            if (y - offsetheight - selector.getBoundingHeight() - offsetY < 0) { abottom = false; }
            if (disabledArrow) { this.select(".ns-nearip-arrow").hide(0); }

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
            } else {
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
        }
        context.content = function (content) {
            if (content) {
                context.object.find(".ns-nearip-contentbox").html(content);
                return this;
            }
            else return context.object.find(".ns-nearip-contentbox").html();
        }
        context.show = function (e) {

            if (!disabledArrow) { arrow.show(0); }
            context.object.show(speed);
            if (!isrendered)
                this.render();
            showed = true;
            //dispatch["show"].call(this, null);
            conf.show ? conf.show.call(this, context.object, arrow) : null; return this;
        }
        context.hide = function () {
            showed = false;
            window.clearTimeout(timerid);

            context.object.hide(speed);
            //dispatch["hide"].call(this, null);
            conf.hide ? conf.hide.call(this, context.object, arrow) : null;
            return this;
        }
        context.stopHideAnimation = function () {
            this.animateTweens.hide.setPaused(true);
        }

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
    }
    ns.toolip = function (conf) {
        function tooltip() { };
        if (!conf) { conf = {}; }
        var speed = conf.speed || 300, deplay = 300;
        var showed = false, selector = null, timerid, rendered = false
            , offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5, offsetY = conf.offsetY || 5
            , origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()),
            _html = conf.html || "<div id='" + id + "' style=\"display:none;line-height: 20px;text-align: center;border-radius: 5px;box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px;pointer-events: none; position: absolute; left: 638px; top: 229.098px;\" class='ns-hovertip'><div class='ns-hovertip-contentbox'  style=\"text-align:center; max-width:220px; font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>"
            , _arrow = conf.arrowHtml || "<span class='ns-hovertip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: 10px;border-style: solid;'></span>"
            , _container = null
            , arrow = null
            , abottom = true
            , isrunning = false
            , aleft = true, fill = conf.fill == null ? "" : conf.fill
            , enableMove = conf.enableMove != null ? conf.enableMove : true
            , disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false
            , isrendered = false
            , deplayHide = conf.delayHide || 0
            , deplayHideTimerid
            , startingEventName = conf.startingEventName || "mouseover", endingEventName = conf.endingEventName || "mouseout";
        var context = new tooltip();
        context.cascading = function (dom) {
            if (dom) { selector = ns.select(dom); }
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
                    if (isrunning) { context.show(e); }
                })
            }
            return this;
        }

        context.render = function (x, y) {
            var c = selector.getBoundingRect(), w = c.width, h = c.height, w2 = w / 2, h2 = h / 2, xw = x - w2, yh = y - h - 20;
            abottom = true; aleft = true;
            if (xw - offsetwidth < 0) { xw = offsetwidth; }
            if (yh - offsetheight < 0) { yh = y + offsetheight; abottom = false; }
            if (disabledArrow) { arrow.hide(0); }
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
        }

        context.content = function (content) {
            if (content) {
                context.object.find(".ns-hovertip-contentbox").html(content);
                return this;
            }
            else return context.object.find(".ns-hovertip-contentbox").html();
        }
        context.show = function (e) {
            var x = e.pageX || (e.clientX ? e.clientX + document.documentElement.scrollLeft : 0)
                , y = e.pageY || (e.clientY ? e.clientY + document.documentElement.scrollTop : 0);
            if (!disabledArrow) { arrow.show(0); }
            context.object.show(speed);
            if (enableMove || (!enableMove && !isrendered))
                this.render(x, y);
            showed = true;
            //dispatch["show"].call(this, null);
            conf.show ? conf.show.call(this, null) : null; return this;
        }
        context.hide = function () {
            showed = false;
            window.clearTimeout(timerid);
            context.object.hide(speed);
            //dispatch["hide"].call(this, null);
            conf.hide ? conf.hide.call(this, null) : null;
        }
        context.stopHideAnimation = function () {
            context.object.animateTweens.hide.setPaused(true);
        }
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
    }
    ns.hoverip = function (conf) {
        function hoverip() { }
        ;
        if (!conf) {
            conf = {};
        }
        var speed = conf.speed || 300, deplay = 300;
        var showed = false, selector = null, timerid, rendered = false, offsetwidth = conf.offsetwidth || 15, offsetheight = conf.offsetheight || 15, offsetX = conf.offsetX || 5
            , offsetY = conf.offsetY || 5, origin = conf.origin || "leftright", id = conf.id || ("nshovertip" + ns.guid()),
            _html = conf.html || "<div id='" + id + "' style=\"padding:3px;display:none;width:" + (!conf.width ? "auto" : conf.width) + ";line-height: 20px;border-radius: 1px; box-shadow: 2px 2px 2px rgba(0,0,0,0.15);text-shadow: 0.5px 0.5px 0.5px rgba(0,0,0,0.05);font-size: 14px;padding-top: 3px;padding-left: 5px;padding-bottom: 3px;pointer-events: none; position: absolute; \" class='ns-hovertip'><div class='ns-hovertip-contentbox'  style=\" font-size:13px; color:#000000; font-family:Verdana\">{content}</div></div>", _arrow = conf.arrowHtml || "<span class='ns-hovertip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: " + (conf.arrowWidth ? conf.arrowWidth : 10) + "px;border-style: solid;'></span>", _container = null, arrow = null, abottom = conf.bottom == null ? true : conf.bottom, isrunning = false, aleft = conf.left == null ? true : conf.left, fill = conf.fill == null ? "" : conf.fill, enableMove = conf.enableMove != null ? conf.enableMove : true, disabledArrow = conf.disabledArrow != null ? conf.disabledArrow : false, isrendered = false, deplayHide = conf.delayHide || 0, deplayHideTimerid, startingEventName = conf.startingEventName == null ? "mouseover" : conf.startingEventName, endingEventName = conf.endingEventName || "mouseout";
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
            }
            return selector;
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
    ns.tween = function (target, props) {
        return new ns.Tween(target, props);
    };
    ns.popup = { top: 10, bottom: 10, popupitems: {}, position: "bottom" };

    ns.prototype.parseNodeList = function (nl) {
        for (var i = 0; i < nl.length; i++) {
            this.selected.push(nl[i]);
        }
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
            } else {
                return this.queriesSelection(exp, context);
            }
        } else if (exp instanceof ns) {
            this.selected = exp.selected;
            return this;
        } else if (exp.nodeType || exp == window) {
            this.selected.push(exp);
            return this;
        }
    };
    ns.prototype.find = function (exp) {
        if (typeof exp === "string") {
            if (/^</.test(exp)) {
                return ns.select(ns.parseHtml(exp));
            } else {
                return new ns().queriesSelection(exp, this);
            }
        } else if (exp instanceof ns) {
            return new ns().select(exp);
        } else if (exp.nodeType) {
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
        } else {
            return this.each(fn, args);
        }
    };
    ns.prototype.calling = function (fn, pos, args) {
        if (this.selected.length == 1) {
            pos = 0;
        }
        if (pos != null && pos > -1) {
            return fn.call(this.at(pos), args);
        } else {
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
            } catch (e) {
                try {
                    this.attachEvent('on' + evn, fn);
                } catch (e) {
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
            } catch (e) {
                try {
                    this.detachEvent('on' + evn, fn);
                } catch (e) {
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
            } else if (document.all) {
                this[evn]();
            }
        });
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
            var curElSty = this.currentStyle || ns._getStyle(this), elSty = this.style;
            p = Ns.CSS.parseProperty(p);
            try {
                if (p in curElSty) {
                    try {
                        curElSty[p] = value;
                    } catch (ex) {
                    }
                }
                curElSty.setProperty(p, value);
            } catch (ex) {
                try {
                    if (p in elSty) {
                        try {
                            elSty[p] = value;
                        } catch (ex) {
                        }
                    }
                    elSty.setProperty(p, value);
                } catch (ex) {
                    try {
                        elSty.cssText += ";" + prop + ":" + value + ";";
                    } catch (ex) {
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
                return elSty.opacity || curElSty.opacity || (elSty.filters && elSty.filters.alpha ? elSty.filters.alpha.opacity : 100) / 100;
            }
            return elSty[prop] || curElSty[prop];
        }, me = this;

        if (arguments.length === 1) {
            if (typeof prop === "string") {
                return cssgetProperty.call(this.node(), Ns.CSS.parseProperty(prop));
            } else {
                for (var p in prop)
                    this.each(function () {
                        cssProperty.call(this, p, prop[p]);
                    });
            }
        } else if (arguments.length === 2) {
            if (typeof prop === "string") {
                cssProperty.call(this.node(), prop, value);
            } else if (typeof value === "function") {
                for (var p in prop)
                    this.each(function () {
                        value.call(this, [(p, prop[p])]);
                    });
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
            this.call(function (d) {
                this.innerHTML = html;
            }, pos);
            return this;
        }
        return this.calling(function (d) {
            return this.node().innerHTML;
        }, pos);
    };
    ns.prototype.outHtml = function (pos) {
        return this.calling(function (d) {
            return this.node().outterHTML;
        }, pos);
    };
    ns.prototype.value = function (val, pos) {
        if (val != null) {
            this.call(function (d) {
                if (this.node instanceof Function) {
                    this.node().value = val;
                } else {
                    this.value = val;
                }
            }, pos);
            return this;
        }
        return this.calling(function (d) {
            return this.node().value;
        }, pos);
    };
    ns.prototype.text = function (txt, pos) {
        if (txt != null) {
            this.call(function (d) {
                if (this.node instanceof Function) {
                    this.node(0).innerText = txt;
                } else {
                    this.innerText = txt;
                }
            }, pos);
            return this;
        }
        return this.calling(function (d) {
            return this.node(0).innerText;
        }, pos);
    };
    ns.prototype.tag = function (pos) {
        return this.calling(function (d) {
            return this.node().tagName;
        }, pos);
    };
    ns.prototype.node = function (pos) {
        if (pos != null) {
            return this.selected[pos];
        } else {
            if (this.selected.length == 1) {
                return this.selected[0];
            }
            return this.selected;
        }
    };
    ns.prototype.is = function (exp, pos) {
        if (pos != null) {
            return ns.selectionMatchs(this.node(pos), exp);
        }
        var b = true;
        this.selected.forEach(function (d) {
            b = b && ns.selectionMatchs(d, exp);
        });
        return b;
    };
    ns.prototype.first = function () {
        return this.at(0);
    };
    ns.prototype.lt = function (pos) {
        this.selected = this.selected.slice(0, pos);
        return this;
    };
    ns.prototype.gt = function (pos) {
        this.selected = this.selected.slice(pos);
        return this;
    };
    ns.prototype.odd = function () {
        var r = [];
        this.selected.forEach(function (d, i) {
            if (i % 2 !== 0) {
                r.push(d);
            }
        });
        this.selected = r;
        return this;
    };
    ns.prototype.eve = function () {
        var r = [];
        this.selected.forEach(function (d, i) {
            if (i % 2 === 0) {
                r.push(d);
            }
        });
        this.selected = r;
        return this;
    };
    ns.prototype.last = function () {
        return this.at(this.length - 1);
    };
    ns.prototype.at = function (pos) {
        this.selected = [this.selected[pos]];
        return this;
    };
    ns.prototype.eq = function (eq) {
        if (typeof eq === "number") {
            return this.at(eq);
        } else if (typeof eq === "string") {
            return this.filter(eq);
        } else {
            return eq.call(this, null);
        }
    };
    ns.prototype.filter = function (exp) {
        if (exp instanceof Function) {
            return this.each(exp);
        }
        var b = [];
        this.selected.forEach(function (d) {
            if (ns.selectionMatchs(d, exp)) {
                b.push(d);
            }
        });
        this.selected = b;
        return this;
    };
    ns.prototype.next = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.next(d).forEach(function (d) {
                if (d)
                    rs.push(d);
            });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.prev = function (exp, pos) {
        var rs = [];
        this.call(function (d) {
            ns.prev(d).forEach(function (d) {
                if (d)
                    rs.push(d);
            });
        }, pos);
        this.selected = rs;
        return exp ? this.filter(exp) : this;
    };
    ns.prototype.children = function (exp, pos) {
        var rs = [];
        var rns = new ns();
        this.call(function (d) {
            ns.children(d).forEach(function (d) {
                if (d)
                    rs.push(d);
            });
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
            name.each(function () {
                var self = this;
                me.each(function () {
                    this.appendChild(self);
                });
            });
            return this;
        } else if (name.nodeType) {
            this.each(function () {
                this.appendChild(name);
            });
        } else if (name.length && name[0].length) {
            var me = this;
            name.each(function () {
                var self = this;
                me.each(function () {
                    this.appendChild(self);
                });
            });
            return this;
        } else {
            name = ns.parseHtml(name);
            return this.select(function () {
                return this.appendChild(name.apply(this, arguments));
            });
        }
    };
    ns.prototype.appendTo = function (name) {

        var me = this;
        if (name instanceof ns) {
            name.each(function () {
                var self = this;
                me.each(function () {
                    self.appendChild(this);
                });
            });
            return this;
        } else {
            name = ns.select(name);
            name.each(function () {
                var self = this;
                me.each(function () {
                    self.appendChild(this);
                });
            });
        }
    };
    ns.prototype.empty = function () {
        this.html("");
        return this;
    };
    ns.prototype.require = function (reg, mode, call) {
        var tag = this.tag(), val = "", rt = true, me = this;
        if (/input|textarea|select/ig.test(tag)) {
            val = this.value();
        } else {
            val = this.attr("ns-value");
        }
        if (!mode) { mode = "hoverip"; }
        if (!arguments.length) {
            reg = JSON.parse(this.attr("require"));
        }
        if (!(reg instanceof Array)) { reg = [reg]; }
        if (!reg.length) { return true; }
        reg.forEach(function (d) {
            if (!d) { return true; }

            var color = me.css("border-color");
            rt = ns.require(val, /notnull/.test(d.exp) ? d.exp : new RegExp(d.exp, d.flag), function () {
                if (me.requirePlugin) {
                    me.css({ "border-color": "red" });
                    me.requirePlugin.content(d.ero).show();
                    return !rt;
                }
                var conf = JSON.parse(me.attr("require-conf"));
                if (!conf) { conf = {}; }
                conf.cascading = me;
                conf.endingEventName = conf.endingEventName == null ? "focus" : conf.endingEventName;
                conf.startingEventName = conf.startingEventName == null ? "" : conf.startingEventName;
                conf.offsetY = conf.offsetY == null ? 5 : conf.offsetY;
                conf.offsetheight = conf.offsetheight == null ? 5 : conf.offsetheight;
                conf.content = d.ero;
                conf.fill = conf.fill || "";
                conf.origin = conf.origin || "top";
                conf.width = me.getBoundingWidth() + "px";
                conf.autoShow = true;
                conf.hide = function () {
                    me.css({ "border-color": color });
                    //me._ns["require"]._ns.hide(0);
                }
                if (/alert/.test(mode)) {
                    alert(conf.content);
                }
                if (/hoverip/.test(mode)) {
                    me.css({ "border-color": "red" });
                    me.requirePlugin = ns.hoverip(conf);

                }
            });
            return !rt;
        });
        return rt;
    };
    ns.prototype.databind = function (data, exp) {
        return ns.databind(data).bind(exp);
    };
    ns.prototype.animate = function (target, speed, callback, applyfn) {
        var successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () {
        };
        callback = callback || {};
        var onchanged = callback.onchanged || function () {
        }, unit = {}, speed = speed || 300, applyfn = applyfn || this.css;

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
        var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () {
        };
        callback = callback || {};
        var onchanged = callback.onchanged || function () {
        }, speed = speed ? speed : 300;
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
            me["animateTweens"].show = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 1 }, speed).call(function () {
                //delete nss.eq(0).tweenanimate;
                delete me["animateTweens"].show;
                successback.call(nss, null);
            });
        });
        return this;
    };
    ns.prototype.hide = function (speed, callback) {
        var me = this, successback = typeof callback === "function" ? callback : callback && callback.onsuccess || function () {
        };
        callback = callback || {};
        var onchanged = callback.onchanged || function () {
        }, speed = speed ? speed : 300;
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
            } else {
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
            } else {
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
    ns.prototype.class = function (cls) {
        return this.attr("class", cls);
    };
    ns.prototype.addClass = function (cls) {
        if (!cls) {
            return this;
        }
        var r = false, j = 0, value;
        this.each(function () {
            if ((value = this.classList) && value.add) {
                value.add(cls);
            } else {
                value = this.getAttribute("class");

                //if (new RegExp("(?:^|\\s+)" + ns.requote(cls) + "(?:\\s+|$)", "g").test(value)) r = true;
                this.setAttribute("class", value + " " + cls);
            }
            j++;
        });
        return this;
    };
    return ns;
})();
//data processing
(function (ns) {
    var Map = (function () {
        function Map() {
            this.me = {};
        }
        Map.prototype.set = function (key, value) {
            return this.me[key] = value;
        };
        Map.prototype.get = function (key) {
            return this.me[key];
        };
        Map.prototype.has = function (key) {
            return key in this.me;
        };
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
    })();
    ns.Map = Map;

    var dataProccessing = (function () {
        function dataProccessing(data) {
            this.container = null;
            this.extendObject = null;
            this.source = [];
            this.data = [];
            this._caches = new Map();
            data ? this.datum(data) : null;
        }
        dataProccessing.bind = function (selector, listener, template) {
            var d = new dataProccessing();
            function executeEmpty() {
            }
            ;
            var i = 0, listen = listener ? listener : {}, savedHtml;
            d["container"] = ns.select(selector);
            if (!template || template.toLowerCase() == "auto") {
                template = d["container"].select(".ns-binder-item-template").outHtml();
            }
            savedHtml = d["container"].selectAll(".ns-binder-item-header").outerHTML();
            (listen.start ? listen.start : executeEmpty).call(d, selector, template);
            d["container"].html(savedHtml + template);

            var h = "", html;
            d.each(function (d) {
                (listen.binding ? listen.binding : executeEmpty).call(d, d, i);
                var h2 = ns.dataProccessing.bindItem(template, d, "json", i++);
                h += h2;
                var html = ns.select(ns.parseHtml(h2));

                (listen.binded ? listen.binded : executeEmpty).call(d, d, html, i);
                d["container"].append(html);
            });
            d["container"].select(".ns-binder-item-template").style("display", "none");

            //me.container.html(me.container.select(".ns-binder-item-header").outHtml() + h);
            (listen.end ? listen.end : executeEmpty).call(d, d["container"], template);
            return d;
        };
        dataProccessing.bindItem = function (template, dataitem, datatype, index) {
            var temp = template, reg = /\{bind\(([^\{\}]+)\)\}/, rpath = /path\((\s*[\w\.]+\s*)\)/i, rexp = /exp[ression]{0,1}\[(\s*\S+\s*)\]/, rdef = /def[ault]{0,1}\((\s*\S+\s*)\)/, rcol = /col[lection]{0,1}\((\s*\S*\s*)\)/, rfunc = /func[tion]{0,1}\((\s*\S+\s*)\)/, v = temp;
            var curindex = index || 1;

            datatype = datatype ? datatype : "json";

            //如果没模板存在那么返回数据行
            if (!temp) {
                return dataitem;
            } else if (typeof temp !== "string") {
                temp = ns.select(temp).at(0).outHtml();
            }
            v = v.replace("{number}", curindex);

            //类型为json
            if (datatype.toLowerCase() === "json") {
                var curd = dataitem, rggs;

                while ((rggs = reg.exec(v)) != null) {
                    var i = 1, vpath = "", vexp = null, vdef = null, vcol = null, vfunc = null, func = function (v) {
                        return v;
                    };
                    while (!rggs[i]) {
                        i++;
                    }
                    vpath = rpath.exec(rggs[i])[1]; //路径
                    vcol = rcol.exec(rggs[i]); //集合
                    vpath = vpath ? vpath : "";
                    vpath = vpath.replace(/\)$/, "");
                    vcol = vcol ? vcol.replace(/\)$/, "") : null;
                    var vlu = ns.gotoNs(curd, vpath);

                    //如果不等于null，则按集合处理
                    if (vcol != null && vcol != undefined) {
                        vlu = JSON.stringify(ns.gotoNs(vlu, vcol[1]));
                    } else {
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
        dataProccessing.clone = function (d) {
            var rd = null;
            if (d instanceof Boolean || d instanceof Number || d instanceof String || d instanceof Function) {
                rd = d;
            } else if (d instanceof Array) {
                rd = [];
                for (var i = 0; i < d.length; i++) {
                    rd.push(d[i]);
                }
            } else {
                rd = {};
                for (var j in d) {
                    rd[j] = ns.dataProccessing.clone(d[j]);
                }
            }
            return rd;
        };

        dataProccessing.data = function (data) {
            var d = new data();
            d.datum(data);
            return d;
        };
        dataProccessing.prototype.bind = function (dom, config) {
            var i = 0, listen = config ? config : { template: "" }, me = this, savedHtml, template = config.template ? config.template : "", executeEmpty = function () {
            };
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
                var h2 = ns.dataProccessing.bindItem(template, d, "json", i++);
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
        dataProccessing.prototype.datum = function (data) {
            this.source = ns.dataProccessing.clone(data);
            this.data = data;
        };

        dataProccessing.contains = function (array, value, pk) {
            var r = false;
            if (pk && pk != "*") {
                var pks = Array.isArray(pk) ? pk : pk.split(',');
                array.forEach(function (o, d) {
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
            } else {
                array.forEach(function (o, d) {
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
        dataProccessing.distinct = function (ds, pk) {
            var ss = [], l = ds.length;
            for (var s = 0; s < l; s++) {
                if (!ss[0]) {
                    ss.push(ds[s]);
                } else if (dataProccessing.contains(ss, ds[s], pk)) {
                    continue;
                } else {
                    ss.push(ds[s]);
                }
            }
            return ss;
        };
        dataProccessing.union = function (fs, sec, where) {
            if (!where) {
                for (var i in fs) {
                    for (var j in sec) {
                        fs[i][j] = sec[j];
                    }
                }
                return fs;
            } else {
                for (var i in fs) {
                    //
                    var temp = dataProccessing.where(sec, where);
                    for (var j in temp) {
                        fs[i][j] = sec[j];
                    }
                }
            }
        };
        dataProccessing.propertyJoin = function (fs, sec, where, alias) {
            if (!where) {
                for (var i in fs) {
                    for (var j in sec) {
                        fs[i][alias + j] = sec[j];
                    }
                }
                return fs;
            } else {
                for (var i in fs) {
                    //
                    var temp = dataProccessing.where(sec, fs[where] + "=[" + where + "]");
                    for (var j in temp) {
                        fs[i][alias + j] = sec[j];
                    }
                }
            }
        };
        dataProccessing.select = function (ds, pks) {
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
        dataProccessing.sort = function (ds, st) {
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
                var indexes = dataProccessing.samePosition(ds, sameProp);
                if (asc && indexes[0] == -1) {
                    for (var j = 0; j < ds.length; j++) {
                        for (var k = j + 1; k < ds.length; k++) {
                            if (dataProccessing.compare(ds[j][key], ds[k][key]) == 1) {
                                var t = ds[k];
                                ds[k] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                } else if (asc && indexes[0] != -1) {
                    for (var j = 0; j < indexes.length; j++) {
                        for (var k = j + 1; k < indexes.length; k++) {
                            if (dataProccessing.compare(ds[indexes[j]][key], ds[indexes[k]][key]) == 1) {
                                var t = ds[indexes[k]];
                                ds[indexes[k]] = ds[indexes[j]];
                                ds[indexes[j]] = t;
                            }
                        }
                    }
                } else if (!asc && indexes[0] == -1) {
                    for (var j = 0; j < ds.length; j++) {
                        for (var k = j + 1; k < ds.length; k++) {
                            if (dataProccessing.compare(ds[j][key], ds[k][key]) == -1) {
                                var t = ds[k];
                                ds[k] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                } else {
                    for (var j = 0; j < indexes.length; j++) {
                        for (var k = j + 1; k < indexes.length; k++) {
                            if (dataProccessing.compare(ds[indexes[j]][key], ds[indexes[k]][key]) == -1) {
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
                            if (dataProccessing.compare(ds[i], ds[j]) == 1) {
                                var t = ds[i];
                                ds[i] = ds[j];
                                ds[j] = t;
                            }
                        }
                    }
                } else {
                    for (var i = 0; i < l; i++) {
                        for (var j = i + 1; j < l; j++) {
                            if (dataProccessing.compare(ds[i], ds[j]) == 1) {
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
        dataProccessing.same = function (ds, sameProp) {
            var indexes = dataProccessing.samePosition(ds, sameProp), res = [];
            if (indexes[0] == -1) {
                return [];
            }
            for (var i = 0; i < indexes.length; i++) {
                res.push(ds[indexes[i]]);
            }
            return res;
        };

        //取出相同属性值的索引位置
        dataProccessing.samePosition = function (ds, sameProp) {
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
                        } else {
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
        dataProccessing.compare = function (first, second) {
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
                    } else if (ascii1 < ascii2) {
                        return -1;
                    } else {
                        continue;
                    }
                }
                return 0;
            } else if (typeof first == "date" || typeof second === "date") {
                first = new Date(first);
                second = new Date(second);
                return first < second ? -1 : (first == second ? 0 : 1);
            } else {
                if (first < second) {
                    return -1;
                } else if (first > second) {
                    return 1;
                } else {
                    return 0;
                }
            }
        };
        dataProccessing.where = function (ds, where) {
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
                        } else if (this[key] != value && !equal) {
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
                } else {
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
                } else {
                    compValue.left = compObj.left;
                }
                if (compObj.right[0] == '[') {
                    compValue.right = undefined;
                    compValue._right = compObj.right.substring(1, compObj.right.length - 1);
                } else {
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
        dataProccessing.prototype.reset = function () {
            this.data = this.source;
        };
        dataProccessing.prototype.max = function (property) {
            return this.property(property);
        };
        dataProccessing.prototype.property = function (property) {
            var p = [];
            this.each(function (d) {
                p.push(d[property]);
            });
            return p;
        };
        dataProccessing.prototype.each = function (fn) {
            var l = this.data.length;
            for (var i = 0; i < l; i++) {
                if (!!fn.call(this, this.data[i], i)) {
                    break;
                }
            }
            return this;
        };
        dataProccessing.prototype.first = function (fn) {
            if (arguments.length) {
                return this.eq(0, fn);
            }
            return this.eq(0);
        };
        dataProccessing.prototype.last = function (fn) {
            var l = this.data.length - 1;
            if (arguments.length) {
                return this.eq(l, fn);
            }
            return this.eq(l);
        };
        dataProccessing.prototype.eq = function (index, fn) {
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
        dataProccessing.prototype.forEach = function (fn) {
            var l = this.data.length;
            for (var i = 0; i < l; i++) {
                this.data[i] = fn.call(this, this.data[i], i);
            }
            return this;
        };
        dataProccessing.prototype.temp = function () {
            this._caches["__temp__"] = this.data;
            return this;
        };
        dataProccessing.prototype.revert = function (key) {
            if (!key)
                key = "__temp__";
            this.data = this._caches.get(key);
            return this;
        };
        dataProccessing.prototype.extract = function (cachekey) {
            return this._caches ? this._caches.get(cachekey) : [];
        };

        dataProccessing.prototype.sort = function (se) {
            this.data = dataProccessing.sort(this.data, se);
            return this;
        };
        dataProccessing.prototype.where = function (where) {
            if (typeof where === "function") {
                var l = this.data.length, d, ds = [];
                for (var i = 0; i < l; i++) {
                    if (!!where.call(this, this.data[i], i)) {
                        ds.push(this.data[i]);
                    }
                }
                this.datum(ds);
            } else
                this.data = dataProccessing.where(this.data, where);
            return this;
        };
        dataProccessing.prototype.cache = function (key) {
            if (!key)
                key = "__temp__";
            if (!this._caches)
                this._caches = new Map();
            this._caches.set(key, this.data);
            return this;
        };
        dataProccessing.prototype.empty = function () {
            this.source = this.data = [], delete this._caches;
            return this;
        };
        dataProccessing.prototype.deleteCache = function (cacheKey) {
            if (cacheKey && this._caches[cacheKey]) {
                delete this._caches[cacheKey];
            }
            return this;
        };
        dataProccessing.prototype.count = function () {
            if (typeof arguments[0] === "function")
                return arguments[0].call(this, null);
            return this.data.length;
        };
        dataProccessing.prototype.equal = function (property, value, fn) {
            var ds = [];
            if (typeof value === "function") {
                this.each(function (d) {
                    if (value.call(null, d[property], d)) {
                        ds.push(d);
                    }
                });
            } else if (typeof value === "object") {
                this.each(function (d) {
                    if (d[property] == value[property]) {
                        ds.push(d);
                    }
                });
            } else {
                this.each(function (d) {
                    if (d[property] == value) {
                        ds.push(d);
                    }
                });
            }
            if (arguments.length < 3) {
                this.data = ds;
            } else {
                typeof fn === "function" ? fn.call(this, ds) : "";
            }
            return this;
        };

        dataProccessing.prototype.call = function (fn) {
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
        dataProccessing.prototype.selfback = function (fn) {
            if (typeof fn === "function") {
                if (arguments.length === 1)
                    return this.call(fn);
                var args = [];
                for (var i = 1, l = arguments.length; i < l; i++) {
                    if (typeof this[arguments[i]] === "function") {
                        args.push(arguments[i].call(this, null));
                    } else {
                        args.push(arguments[i].fn.apply(this, arguments[i].args || []));
                    }
                }
                fn.apply(this, args);
            }
            return this;
        };
        dataProccessing.prototype.index = function (property, value) {
            var index = -1;
            if (property && value) {
                this.each(function (d, i) {
                    if (d[property] === value) {
                        index = i;
                        return true;
                    }
                });
            } else if (property) {
                if (typeof property === "function") {
                    this.each(function (d, i) {
                        if (property.call(this, d, i)) {
                            index = i;
                            return true;
                        }
                    });
                } else {
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

        dataProccessing.prototype.distinct = function (pks, fn) {
            if (!fn) {
                this.data = dataProccessing.distinct(this.data, pks);
            } else {
                this.data = fn.call(this, dataProccessing.distinct(this.data, pks), pks);
            }
            return this;
        };
        dataProccessing.prototype.selfLinkage = function (prop, tag) {
            var me = this, parsedData = [], tags, tagfn = tag ? typeof tag === "function" ? tag : (tags = tag.split(/,|;/g), function (d, ad) {
                for (var i = 0; i < tags.length && tags[i] in ad; i++) {
                    d[tags[i]] = ad[tags[i]];
                }
            }) : function (d, ad) {
                for (var i in ad) {
                    d[i] = ad[i];
                }
            };
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
        dataProccessing.prototype.join = function () {
            //static propertyJoin
        };
        dataProccessing.prototype.groupby = function (fields, fn) {
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
                    datas.datas.forEach(function (d) {
                        if (d[f] == value) {
                            ds.push(d);
                        }
                    });

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
        dataProccessing.prototype.xpose = function (xposes, isdelete) {
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
        dataProccessing.prototype.append = function (data) {
            if (typeof data === "function") {
                data.call(this, null);
            } else if (data instanceof Array) {
                var me = this;
                data.forEach(function (d) {
                    me.data.push(d);
                });
            } else {
                this.data.push(data);
            }
        };
        dataProccessing.prototype.add = function (data) {
            if (typeof data === "function") {
                data.call(this, null);
            } else {
                this.data.push(data);
            }
        };
        dataProccessing.prototype.select = function (pks) {
            return new dataProccessing(ns.dataProccessing.select(this.data, pks));
        };

        //重新组建数据
        dataProccessing.prototype.reorganize = function (fn) {
            var l = this.data.length, p, temp = [];
            for (var i = 0; i < l; i++) {
                if ((p = fn.call(this, this.data[i], i))) {
                    temp.push(p);
                }
            }
            this.data = temp;
            return this;
        };

        Object.defineProperty(dataProccessing.prototype, "selector", {
            get: function () {
                return this.container;
            },
            set: function (val) {
                this.container = val;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(dataProccessing.prototype, "extends", {
            get: function () {
                return this.extendObject;
            },
            set: function (val) {
                this.extendObject = val;
            },
            enumerable: true,
            configurable: true
        });
        return dataProccessing;
    })();
    ns.dataProccessing = dataProccessing;

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
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                name[_i] = arguments[_i + 0];
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
    })();
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
        Ticker.getNowTime = function () {
            return ((ns.Ticker.now && ns.Ticker.now.call(performance)) || (new Date().getTime())) - ns.Ticker.startTime;
        };
        Ticker.reset = function () {
            if (ns.Ticker.raf) {
                var f = window.cancelAnimationFrame || window["webkitCancelAnimationFrame"] || window["mozCancelAnimationFrame"] || window["oCancelAnimationFrame"] || window["msCancelAnimationFrame"];
                f && f(ns.Ticker.timerId);
            } else {
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
        Ticker.getTime = function (runTime) {
            return ns.Ticker.startTime ? ns.Ticker.getNowTime() - (runTime ? ns.Ticker.pausedTime : 0) : -1;
        };

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
            }

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
    })();
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
        Tween.get = function (target, props, pluginData) {
            return new Tween(target, props, pluginData);
        };

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
                } else {
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
                } else if (this._steps.length > 0) {
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
                } else if (actionsMode == 1 && t < prevPos) {
                    if (prevPos != this.duration) {
                        this._runActions(prevPos, this.duration);
                    }
                    this._runActions(0, t, true);
                } else {
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
            } else {
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
                } else {
                    v = v0 + (v1 - v0) * ratio;
                }
                var ignore = false;
                if (arr = Tween.plugins[n]) {
                    for (var i = 0, l = arr.length; i < l; i++) {
                        var v2 = arr[i].tween(this, n, v, p0, p1, ratio, position, !step);
                        if (v2 == Tween.IGNORE) {
                            ignore = true;
                        } else {
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
                } else {
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
            } else {
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
    })();
    ns.Tween = Tween;
    if (ns.Ticker) {
        ns.Ticker["on"]("tick", function (e) {
            ns.Tween.tick(e.delta, e.paused);
        });
    }
    var watcher = (function () {
        function watcher() {
            this._ = {};
            this.dispatch = new Dispatch();
        }
        watcher.prototype.define = function (target, field, conf) {
            Object.defineProperty(target, field, conf);
            return this;
        };
        watcher.define = function (target, field, conf) {
            Object.defineProperty(target, field, conf);
            return this;
        };

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
    })();
    ns.watcher = watcher;
    var Promise = (function () {
        function Promise() {
            this.callbacks = { success: [], faild: [], callback: [] };
            this._status = "";
        }
        Promise.prototype.sucess = function () {
            var fn = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                fn[_i] = arguments[_i + 0];
            }
            if (fn instanceof Function) {
                this.callbacks.success.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () {
                    me.callbacks.success.push(fn);
                });
            }
            return this;
        };
        Promise.prototype.faild = function () {
            var fn = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                fn[_i] = arguments[_i + 0];
            }
            if (fn instanceof Function) {
                this.callbacks.faild.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () {
                    me.callbacks.faild.push(fn);
                });
            }
            return this;
        };
        Promise.prototype.callback = function () {
            var fn = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                fn[_i] = arguments[_i + 0];
            }
            if (fn instanceof Function) {
                this.callbacks.callback.push(fn);
            }
            if (fn instanceof Array) {
                var me = this;
                fn.forEach(function () {
                    me.callbacks.callback.push(fn);
                });
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

        Promise.prototype.reset = function () {
            this._status = "";
            this.callbacks = { success: [], faild: [], callback: [] };
            return this;
        };
        Promise.prototype.resetStatus = function () {
            this._status = "";
            return this;
        };
        Promise.prototype.execute = function (status) {
            this._status = status;
            var args = ns.slice(arguments).slice(1);
            if (this._status == "success") {
                for (var i = 0; i < this.callbacks.success.length; i++) {
                    this.callbacks.success[i].call(this, args);
                }
            } else {
                for (var i = 0; i < this.callbacks.faild.length; i++) {
                    this.callbacks.faild[i].call(this, args);
                }
            }
            for (var i = 0; i < this.callbacks.callback.length; i++) {
                this.callbacks.callback[i].call(this, args);
            }
        };
        return Promise;
    })();
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
        commandParse.prototype.exec = function (input, param) {
        };

        commandParse.prototype.regiest = function (cmd, func) {
            if (cmd in this.dispatch) {
                this.dispatch.on(cmd, func);
            }
        };
        commandParse.prototype.unregiest = function () {
        };
        return commandParse;
    })();
    ns.commandParse = commandParse;

})(ns);
//ajax
(function (ns) {
    var ajax = (function () {
        function ajax(url, mimeType, response, callback) {
            this.url = "";
            this.contentType = "application/json";
            this.type = "";
            this.data = "";
            this.headers = {};
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
                        /xml/.test(me._mimeType) ? me._dispatch.success.call(me, me.request.responseXML, me.request) : /json/.test(me._mimeType) ? me._dispatch.success.call(me, JSON.parse(me.request.responseText), me.request) : me._dispatch.success.call(me, me.request.responseText, me.request);
                    } catch (e) {
                        me._dispatch.error.call(me, e);
                        return;
                    }
                    me._dispatch.load.call(me, result);
                } else {
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
            } finally {
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
            } else {
                s = d;
            }
            return this.send.apply(this, ["get", s, callback]);
        };
        ajax.prototype.post = function (d, callback) {
            return this.send.apply(this, ["post", d, callback]);
        };
        ajax.prototype.on = function (evn, fn) {
            this._dispatch.on(evn, fn);
        };
        ajax.loadJson = function (url, method, data, callback) {
            return ns.ajax.load(url, method, data, callback, "application/json");
        };
        ajax.load = function (url, method, data, callback, mimeType) {
            if (typeof mimeType === "undefined") { mimeType = "text/html"; }
            if (typeof callback === "function") {
                var xhr = new ajax(url, mimeType, function (json) {
                    callback.call(this, json, xhr);
                });
                if (method && "get" == method.toLowerCase()) {
                    xhr.get(data);
                } else if (method && "post" == method.toLowerCase()) {
                    xhr.post(data);
                } else {
                    return xhr.send.apply(xhr, [method, data, callback]);
                }
            } else {
                var xhr = new ajax(url, mimeType);
                callback.beforesend ? xhr.on("beforesend", callback.beforesend) : null;
                callback.progress ? xhr.on("progress", callback.progress) : null;
                callback.load ? xhr.on("load", callback.load) : null;
                callback.error ? xhr.on("error", callback.error) : null;
                callback.completed ? xhr.on("completed", callback.completed) : null;
                callback.success ? xhr.on("success", callback.success) : null;
                if (method && "get" == method.toLowerCase()) {
                    xhr.get(data);
                } else if (method && "post" == method.toLowerCase()) {
                    xhr.post(data);
                } else {
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
    })();
    ns.ajax = ajax;
})(ns);
//markdown lex
(function (ns) {
    var block = {
        newline: /^\n+/,
        code: /^( {4}[^\n]+\n*)+/,
        fences: noop,
        hr: /^( *[-*_]){3,} *(?:\n+|$)/,
        heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
        nptable: noop,
        lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
        blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
        list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
        html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
        table: noop,
        paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
        text: /^[^\n]+/
    };

    block.bullet = /(?:[*+-]|\d+\.)/;
    block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
    block.item = replace(block.item, 'gm')(/bull/g, block.bullet)();
    block.list = replace(block.list)
        (/bull/g, block.bullet)
        ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
        ('def', '\\n+(?=' + block.def.source + ')')
        ();

    block.blockquote = replace(block.blockquote)
        ('def', block.def)
        ();
    block._tag = '(?!(?:'
        + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
        + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
        + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

    block.html = replace(block.html)
        ('comment', /<!--[\s\S]*?-->/)
        ('closed', /<(tag)[\s\S]+?<\/\1>/)
        ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
        (/tag/g, block._tag)
        ();

    block.paragraph = replace(block.paragraph)
        ('hr', block.hr)
        ('heading', block.heading)
        ('lheading', block.lheading)
        ('blockquote', block.blockquote)
        ('tag', '<' + block._tag)
        ('def', block.def)
        ();
    block.script = /^@{1}#{2}([\s\S]+?)#{2}@/;
    block.normal = ns.merge({}, block);
    block.gfm = ns.merge({}, block.normal, {
        fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
        paragraph: /^/,
        heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
    });

    block.gfm.paragraph = replace(block.paragraph)
        ('(?!', '(?!'
        + block.gfm.fences.source.replace('\\1', '\\2') + '|'
        + block.list.source.replace('\\1', '\\3') + '|')
        ();
    block.tables = ns.merge({}, block.gfm, {
        nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
        table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
    });
    function replace(regex, opt) {
        regex = regex.source;
        opt = opt || '';
        return function self(name, val) {
            if (!name) return new RegExp(regex, opt);
            val = val.source || val;
            val = val.replace(/(^|[^\[])\^/g, '$1');
            regex = regex.replace(name, val);
            return self;
        };
    }
    function noop() { }
    noop.exec = noop;
    function Lexer(options) {
        this.tokens = [];
        this.tokens.links = {};
        this.options = options || marked.defaults;
        this.rules = block.normal;
        if (this.options.gfm) {
            if (this.options.tables) {
                this.rules = block.tables;
            } else {
                this.rules = block.gfm;
            }
        }
        if (ns.marked.Lexer.extends) {
            this.rules.extends = ns.merge({}, ns.marked.Lexer.extends);
        }
    }
    Lexer.rules = block;
    Lexer.lex = function (src, options) {
        var lexer = new Lexer(options);
        return lexer.lex(src);
    };

    Lexer.prototype.lex = function (src) {
        src = src
            .replace(/\r\n|\r/g, '\n')
            .replace(/\t/g, '    ')
            .replace(/\u00a0/g, ' ')
            .replace(/\u2424/g, '\n');

        return this.token(src, true);
    };

    Lexer.prototype.token = function (src, top, bq) {
        var src = src.replace(/^ +$/gm, '')
            , next
            , loose
            , cap
            , bull
            , b
            , item
            , space
            , i
            , l;

        while (src) {
            // newline
            if (cap = this.rules.newline.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[0].length > 1) {
                    this.tokens.push({
                        type: 'space'
                    });
                }
            }
            // script
            if (cap = this.rules.script.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[0].length > 1) {
                    this.tokens.push({
                        type: 'script',
                        text: cap[1]
                    });
                }
            }
            // code
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                cap = cap[0].replace(/^ {4}/gm, '');
                this.tokens.push({
                    type: 'code',
                    text: !this.options.pedantic
                        ? cap.replace(/\n+$/, '')
                        : cap
                });
                continue;
            }

            // fences (gfm)
            if (cap = this.rules.fences.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'code',
                    lang: cap[2],
                    text: cap[3] || ''
                });
                continue;
            }

            // heading
            if (cap = this.rules.heading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[1].length,
                    text: cap[2]
                });
                continue;
            }

            // table no leading pipe (gfm)
            if (top && (cap = this.rules.nptable.exec(src))) {
                src = src.substring(cap[0].length);

                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/\n$/, '').split('\n')
                };

                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }

                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i].split(/ *\| */);
                }
                this.tokens.push(item);
                continue;
            }

            // lheading
            if (cap = this.rules.lheading.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'heading',
                    depth: cap[2] === '=' ? 1 : 2,
                    text: cap[1]
                });
                continue;
            }

            // hr
            if (cap = this.rules.hr.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'hr'
                });
                continue;
            }

            // blockquote
            if (cap = this.rules.blockquote.exec(src)) {
                src = src.substring(cap[0].length);

                this.tokens.push({
                    type: 'blockquote_start'
                });

                cap = cap[0].replace(/^ *> ?/gm, '');

                // Pass `top` to keep the current
                // "toplevel" state. This is exactly
                // how markdown.pl works.
                this.token(cap, top, true);

                this.tokens.push({
                    type: 'blockquote_end'
                });

                continue;
            }

            // list
            if (cap = this.rules.list.exec(src)) {
                src = src.substring(cap[0].length);
                bull = cap[2];

                this.tokens.push({
                    type: 'list_start',
                    ordered: bull.length > 1
                });

                // Get each top-level item.
                cap = cap[0].match(this.rules.item);

                next = false;
                l = cap.length;
                i = 0;

                for (; i < l; i++) {
                    item = cap[i];

                    // Remove the list item's bullet
                    // so it is seen as the next token.
                    space = item.length;
                    item = item.replace(/^ *([*+-]|\d+\.) +/, '');

                    // Outdent whatever the
                    // list item contains. Hacky.
                    if (~item.indexOf('\n ')) {
                        space -= item.length;
                        item = !this.options.pedantic
                            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
                            : item.replace(/^ {1,4}/gm, '');
                    }

                    // Determine whether the next list item belongs here.
                    // Backpedal if it does not belong in this list.
                    if (this.options.smartLists && i !== l - 1) {
                        b = block.bullet.exec(cap[i + 1])[0];
                        if (bull !== b && !(bull.length > 1 && b.length > 1)) {
                            src = cap.slice(i + 1).join('\n') + src;
                            i = l - 1;
                        }
                    }

                    // Determine whether item is loose or not.
                    // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
                    // for discount behavior.
                    loose = next || /\n\n(?!\s*$)/.test(item);
                    if (i !== l - 1) {
                        next = item.charAt(item.length - 1) === '\n';
                        if (!loose) loose = next;
                    }

                    this.tokens.push({
                        type: loose
                            ? 'loose_item_start'
                            : 'list_item_start'
                    });

                    // Recurse.
                    this.token(item, false, bq);

                    this.tokens.push({
                        type: 'list_item_end'
                    });
                }

                this.tokens.push({
                    type: 'list_end'
                });

                continue;
            }

            // html
            if (cap = this.rules.html.exec(src)) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: this.options.sanitize
                        ? 'paragraph'
                        : 'html',
                    pre: !this.options.sanitizer
                    && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
                    text: cap[0]
                });
                continue;
            }

            // def
            if ((!bq && top) && (cap = this.rules.def.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.links[cap[1].toLowerCase()] = {
                    href: cap[2],
                    title: cap[3]
                };
                continue;
            }

            // table (gfm)
            if (top && (cap = this.rules.table.exec(src))) {
                src = src.substring(cap[0].length);

                item = {
                    type: 'table',
                    header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
                    align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
                    cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
                };

                for (i = 0; i < item.align.length; i++) {
                    if (/^ *-+: *$/.test(item.align[i])) {
                        item.align[i] = 'right';
                    } else if (/^ *:-+: *$/.test(item.align[i])) {
                        item.align[i] = 'center';
                    } else if (/^ *:-+ *$/.test(item.align[i])) {
                        item.align[i] = 'left';
                    } else {
                        item.align[i] = null;
                    }
                }

                for (i = 0; i < item.cells.length; i++) {
                    item.cells[i] = item.cells[i]
                        .replace(/^ *\| *| *\| *$/g, '')
                        .split(/ *\| */);
                }

                this.tokens.push(item);

                continue;
            }

            // top-level paragraph
            if (top && (cap = this.rules.paragraph.exec(src))) {
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'paragraph',
                    text: cap[1].charAt(cap[1].length - 1) === '\n'
                        ? cap[1].slice(0, -1)
                        : cap[1]
                });
                continue;
            }

            // text
            if (cap = this.rules.text.exec(src)) {
                // Top-level should never reach here.
                src = src.substring(cap[0].length);
                this.tokens.push({
                    type: 'text',
                    text: cap[0]
                });
                continue;
            }
            if (this.rules.extends) {
                for (var i in this.rules.extends) {
                    if (this.rules.extends[i].exec && (cap = this.rules.extends[i].exec(src))) {
                        this.tokens.push({
                            type: "extends",
                            name: i,
                            text: cap[0],
                            result: cap
                        });
                    }
                }
            }
            if (src) {
                throw new
                    Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }
        return this.tokens;
    };

    var inline = {
        escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
        autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
        url: noop,
        tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
        link: /^!?\[(inside)\]\(href\)/,
        reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
        nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
        strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
        em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
        code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
        br: /^ {2,}\n(?!\s*$)/,
        del: noop,
        text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/,
        tex: /^\$\$([\s\S]+?)\$\$$/,
        check: /^\[(-)\]|^\[(\/)\]|^\[(\/)\]/,
        processing: /\(\*([\s\S]+?)\*\)/
    };

    inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
    inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

    inline.link = replace(inline.link)
        ('inside', inline._inside)
        ('href', inline._href)
        ();

    inline.reflink = replace(inline.reflink)
        ('inside', inline._inside)
        ();

    /**
     * Normal Inline Grammar
     */
    inline.normal = ns.merge({}, inline);

    /**
     * Pedantic Inline Grammar
     */
    inline.pedantic = ns.merge({}, inline.normal, {
        strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
    });

    /**
     * GFM Inline Grammar
     */
    inline.gfm = ns.merge({}, inline.normal, {
        escape: replace(inline.escape)('])', '~|])')(),
        url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
        del: /^~~(?=\S)([\s\S]*?\S)~~/,
        text: replace(inline.text)
            (']|', '~]|')
            ('|', '|https?://|')
            ()
    });

    /**
     * GFM + Line Breaks Inline Grammar
     */
    inline.breaks = ns.merge({}, inline.gfm, {
        br: replace(inline.br)('{2,}', '*')(),
        text: replace(inline.gfm.text)('{2,}', '*')()
    });

    /**
     * Inline Lexer & Compiler
     */
    function InlineLexer(links, options) {
        this.options = options || marked.defaults;
        this.links = links;
        this.rules = inline.normal;
        this.renderer = this.options.renderer || new Renderer;
        this.renderer.options = this.options;

        if (!this.links) {
            throw new
                Error('Tokens array requires a `links` property.');
        }

        if (this.options.gfm) {
            if (this.options.breaks) {
                this.rules = inline.breaks;
            } else {
                this.rules = inline.gfm;
            }

        } else if (this.options.pedantic) {
            this.rules = inline.pedantic;
        }

        if (ns.marked.InlineLexer.extends) {
            this.rules.extends = ns.merge({}, ns.marked.InlineLexer.extends);
        }
    }

    /**
     * Expose Inline Rules
     */
    InlineLexer.rules = inline;

    /**
     * Static Lexing/Compiling Method
     */
    InlineLexer.output = function (src, links, options) {
        var inline = new InlineLexer(links, options);
        return inline.output(src);
    };

    /**
     * Lexing/Compiling
     */
    InlineLexer.prototype.output = function (src) {
        var out = ''
            , link
            , text
            , href
            , cap;

        while (src) {
            // escape
            if (cap = this.rules.escape.exec(src)) {
                src = src.substring(cap[0].length);
                out += cap[1];
                continue;
            }

            // autolink
            if (cap = this.rules.autolink.exec(src)) {
                src = src.substring(cap[0].length);
                if (cap[2] === '@') {
                    text = cap[1].charAt(6) === ':'
                        ? this.mangle(cap[1].substring(7))
                        : this.mangle(cap[1]);
                    href = this.mangle('mailto:') + text;
                } else {
                    text = ns.marked.escape(cap[1]);
                    href = text;
                }
                out += this.renderer.link(href, null, text);
                continue;
            }

            // url (gfm)
            if (!this.inLink && (cap = this.rules.url.exec(src))) {
                src = src.substring(cap[0].length);
                text = ns.marked.escape(cap[1]);
                href = text;
                out += this.renderer.link(href, null, text);
                continue;
            }

            // tag
            if (cap = this.rules.tag.exec(src)) {
                if (!this.inLink && /^<a /i.test(cap[0])) {
                    this.inLink = true;
                } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
                    this.inLink = false;
                }
                src = src.substring(cap[0].length);
                out += this.options.sanitize
                    ? this.options.sanitizer
                        ? this.options.sanitizer(cap[0])
                        : ns.marked.escape(cap[0])
                    : cap[0]
                continue;
            }

            // link
            if (cap = this.rules.link.exec(src)) {
                src = src.substring(cap[0].length);
                this.inLink = true;
                out += this.outputLink(cap, {
                    href: cap[2],
                    title: cap[3]
                });
                this.inLink = false;
                continue;
            }
            if (cap = this.rules.check.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.check(cap[1]);
                continue;
            }
            // reflink, nolink
            if ((cap = this.rules.reflink.exec(src))
                || (cap = this.rules.nolink.exec(src))) {
                src = src.substring(cap[0].length);
                link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
                link = this.links[link.toLowerCase()];
                if (!link || !link.href) {
                    out += cap[0].charAt(0);
                    src = cap[0].substring(1) + src;
                    continue;
                }
                this.inLink = true;
                out += this.outputLink(cap, link);
                this.inLink = false;
                continue;
            }

            // strong
            if (cap = this.rules.strong.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.strong(this.output(cap[2] || cap[1]));
                continue;
            }

            // em
            if (cap = this.rules.em.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.em(this.output(cap[2] || cap[1]));
                continue;
            }

            // code
            if (cap = this.rules.code.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.codespan(ns.marked.escape(cap[2], true));
                continue;
            }

            // br
            if (cap = this.rules.br.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.br();
                continue;
            }
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.text(ns.marked.escape(this.smartypants(cap[0])));
                continue;
            }
            // text
            if (cap = this.rules.text.exec(src)) {
                src = src.substring(cap[0].length);
                out += this.renderer.text(ns.marked.escape(this.smartypants(cap[0])));
                continue;
            }
            if (cap = this.rules.tex.exec(src)) {
                out += this.renderer.tex(cap[0]);
            }
            if (this.rules.extends) {
                for (var i in this.rules.extends) {
                    if (this.rules.extends[i].exec && (cap = this.rules.extends[i].exec(src))) {
                        out += ns.marked.Renderer.extends.inline[i]();
                    }
                }
            }
            if (src) {
                throw new
                    Error('Infinite loop on byte: ' + src.charCodeAt(0));
            }
        }

        return out;
    };

    /**
     * Compile Link
     */
    InlineLexer.prototype.outputLink = function (cap, link) {
        var href = ns.marked.escape(link.href)
            , title = link.title ? ns.marked.escape(link.title) : null;

        return cap[0].charAt(0) !== '!'
            ? this.renderer.link(href, title, this.output(cap[1]))
            : this.renderer.image(href, title, ns.marked.escape(cap[1]));
    };

    /**
     * Smartypants Transformations
     */
    InlineLexer.prototype.smartypants = function (text) {
        if (!this.options.smartypants) return text;
        return text
            // em-dashes
            .replace(/---/g, '\u2014')
            // en-dashes
            .replace(/--/g, '\u2013')
            // opening singles
            .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
            // closing singles & apostrophes
            .replace(/'/g, '\u2019')
            // opening doubles
            .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
            // closing doubles
            .replace(/"/g, '\u201d')
            // ellipses
            .replace(/\.{3}/g, '\u2026');
    };

    /**
     * Mangle Links
     */
    InlineLexer.prototype.mangle = function (text) {
        if (!this.options.mangle) return text;
        var out = ''
            , l = text.length
            , i = 0
            , ch;

        for (; i < l; i++) {
            ch = text.charCodeAt(i);
            if (Math.random() > 0.5) {
                ch = 'x' + ch.toString(16);
            }
            out += '&#' + ch + ';';
        }

        return out;
    };
    /**
     * Parsing & Compiling
     */
    function Parser(options) {
        this.tokens = [];
        this.token = null;
        this.options = options || marked.defaults;
        this.options.renderer = this.options.renderer || new Renderer;
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
    }
    /**
     * Static Parse Method
     */
    Parser.parse = function (src, options, renderer) {
        var parser = new Parser(options, renderer);
        return parser.parse(src);
    };

    /**
     * Parse Loop
     */
    Parser.prototype.parse = function (src) {
        this.inline = new InlineLexer(src.links, this.options, this.renderer);
        this.tokens = src.reverse();
        var out = '';
        while (this.next()) {
            out += this.tok();
        }
        return out;
    };

    /**
     * Next Token
     */
    Parser.prototype.next = function () {
        return this.token = this.tokens.pop();
    };

    /**
     * Preview Next Token
     */
    Parser.prototype.peek = function () {
        return this.tokens[this.tokens.length - 1] || 0;
    };

    /**
     * Parse Text Tokens
     */
    Parser.prototype.parseText = function () {
        var body = this.token.text;

        while (this.peek().type === 'text') {
            body += '\n' + this.next().text;
        }
        return this.inline.output(body);
    };

    /**
     * Parse Current Token
     */
    Parser.prototype.tok = function () {
        switch (this.token.type) {
            case 'space': {
                return '';
            }
            case 'hr': {
                return this.renderer.hr();
            }
            case 'heading': {
                return this.renderer.heading(
                    this.inline.output(this.token.text),
                    this.token.depth,
                    this.token.text);
            }
            case 'code': {
                return this.renderer.code(this.token.text,
                    this.token.lang,
                    this.token.escaped);
            }
            case 'table': {
                var header = ''
                    , body = ''
                    , i
                    , row
                    , cell
                    , flags
                    , j;

                // header
                cell = '';
                for (i = 0; i < this.token.header.length; i++) {
                    flags = { header: true, align: this.token.align[i] };
                    cell += this.renderer.tablecell(
                        this.inline.output(this.token.header[i]),
                        { header: true, align: this.token.align[i] }
                    );
                }
                header += this.renderer.tablerow(cell);

                for (i = 0; i < this.token.cells.length; i++) {
                    row = this.token.cells[i];

                    cell = '';
                    for (j = 0; j < row.length; j++) {
                        cell += this.renderer.tablecell(
                            this.inline.output(row[j]),
                            { header: false, align: this.token.align[j] }
                        );
                    }

                    body += this.renderer.tablerow(cell);
                }
                return this.renderer.table(header, body);
            }
            case 'blockquote_start': {
                var body = '';

                while (this.next().type !== 'blockquote_end') {
                    body += this.tok();
                }

                return this.renderer.blockquote(body);
            }
            case 'list_start': {
                var body = ''
                    , ordered = this.token.ordered;

                while (this.next().type !== 'list_end') {
                    body += this.tok();
                }

                return this.renderer.list(body, ordered);
            }
            case 'list_item_start': {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                    body += this.token.type === 'text'
                        ? this.parseText()
                        : this.tok();
                }

                return this.renderer.listitem(body);
            }
            case 'loose_item_start': {
                var body = '';

                while (this.next().type !== 'list_item_end') {
                    body += this.tok();
                }

                return this.renderer.listitem(body);
            }
            case 'html': {
                var html = !this.token.pre && !this.options.pedantic
                    ? this.inline.output(this.token.text)
                    : this.token.text;
                return this.renderer.html(html);
            }
            case 'paragraph': {
                return this.renderer.paragraph(this.inline.output(this.token.text));
            }
            case 'text': {
                return this.renderer.paragraph(this.parseText());
            }
            case "extends":
                return ns.marked.Renderer.extends.block(this.token);
        }
    };


    function Renderer(options) {
        this.options = options || {};
    }
    Renderer.prototype.code = function (code, lang, escaped) {
        if (Renderer.extends[lang]) {
            return Renderer.extends[lang](code, escaped);
        }
        if (this.options.highlight) {
            var out = this.options.highlight(code, lang);
            if (out != null && out !== code) {
                escaped = true;
                code = out;
            }
        }
        if (!lang) {
            return '<pre><code>'
                + (escaped ? code : ns.marked.escape(code, true))
                + '\n</code></pre>';
        }

        return '<pre><code class="'
            + (this.options.langPrefix || "")
            + ns.marked.escape(lang, true)
            + '">'
            + (escaped ? code : ns.marked.escape(code, true))
            + '\n</code></pre>\n';
    };
    Renderer.prototype.blockquote = function (quote) {
        return '<blockquote>\n' + quote + '</blockquote>\n';
    };
    Renderer.prototype.html = function (html) {
        return html;
    };
    Renderer.prototype.heading = function (text, level, raw) {
        return '<h'
            + level
            + ' id="'
            + this.options.headerPrefix
            + raw.toLowerCase().replace(/[^\w]+/g, '-')
            + '">'
            + text
            + '</h'
            + level
            + '>\n';
    };
    Renderer.prototype.hr = function () {
        return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
    };
    Renderer.prototype.list = function (body, ordered) {
        var type = ordered ? 'ol' : 'ul';
        return '<' + type + '>\n' + body + '</' + type + '>\n';
    };
    Renderer.prototype.listitem = function (text) {
        return '<li>' + text + '</li>\n';
    };
    Renderer.prototype.paragraph = function (text) {
        return '<p>' + text + '</p>\n';
    };
    Renderer.prototype.table = function (header, body) {
        return '<table>\n'
            + '<thead>\n'
            + header
            + '</thead>\n'
            + '<tbody>\n'
            + body
            + '</tbody>\n'
            + '</table>\n';
    };
    Renderer.prototype.tablerow = function (content) {
        return '<tr>\n' + content + '</tr>\n';
    };
    Renderer.prototype.tablecell = function (content, flags) {
        var type = flags.header ? 'th' : 'td';
        var tag = flags.align
            ? '<' + type + ' style="text-align:' + flags.align + '">'
            : '<' + type + '>';
        return tag + content + '</' + type + '>\n';
    };
    // span level renderer
    Renderer.prototype.strong = function (text) {
        return '<strong>' + text + '</strong>';
    };
    Renderer.prototype.check = function (text) {
        return '<input type="checkbox" ' + (/\//ig.test(text) ? "checked='checked'" : "") + ' />';
    };
    Renderer.prototype.em = function (text) {
        return '<em>' + text + '</em>';
    };
    Renderer.prototype.codespan = function (text) {
        return '<code>' + text + '</code>';
    };
    Renderer.prototype.br = function () {
        return this.options.xhtml ? '<br/>' : '<br>';
    };
    Renderer.prototype.del = function (text) {
        return '<del>' + text + '</del>';
    };
    Renderer.prototype.link = function (href, title, text) {
        if (this.options.sanitize) {
            try {
                var prot = decodeURIComponent(ns.marked.unescape(href))
                    .replace(/[^\w:]/g, '')
                    .toLowerCase();
            } catch (e) {
                return '';
            }
            if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
                return '';
            }
        }
        var out = '<a href="' + href + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += '>' + text + '</a>';
        return out;
    };
    Renderer.prototype.image = function (href, title, text) {
        var out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
            out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? '/>' : '>';
        return out;
    };
    Renderer.prototype.text = function (text) {
        return text;
    };
    Renderer.extends = { block: {}, inline: {} };

    //function (token) {
    //    if (token.name) {
    //        this["extends_"+token.name]
    //    }
    //}
    function marked(src, opt, callback) {

        if (callback || typeof opt === 'function') {
            if (!callback) {
                callback = opt;
                opt = null;
            }

            opt = ns.merge({}, marked.defaults, opt || {});
            //if (opt.extends) {
            //    ns.marked.extends(opt);
            //}
            var highlight = opt.highlight
                , tokens
                , pending
                , i = 0;

            try {
                tokens = Lexer.lex(src, opt)
            } catch (e) {
                return callback(e);
            }

            pending = tokens.length;

            var done = function (err) {
                if (err) {
                    opt.highlight = highlight;
                    return callback(err);
                }

                var out;

                try {
                    out = Parser.parse(tokens, opt);
                } catch (e) {
                    err = e;
                }

                opt.highlight = highlight;

                return err
                    ? callback(err)
                    : callback(null, out);
            };

            if (!highlight || highlight.length < 3) {
                return done();
            }

            delete opt.highlight;

            if (!pending) return done();

            for (; i < tokens.length; i++) {
                (function (token) {
                    if (token.type !== 'code') {
                        return --pending || done();
                    }
                    return highlight(token.text, token.lang, function (err, code) {
                        if (err) return done(err);
                        if (code == null || code === token.text) {
                            return --pending || done();
                        }
                        token.text = code;
                        token.escaped = true;
                        --pending || done();
                    });
                })(tokens[i]);
            }

            return;
        }
        try {
            if (opt) opt = ns.merge({}, marked.defaults, opt);
            return Parser.parse(Lexer.lex(src, opt), opt);
        } catch (e) {
            e.message += '\nPlease report this to https://github.com/chjj/marked.';
            if ((opt || marked.defaults).silent) {
                return '<p>An error occured:</p><pre>'
                    + ns.marked.escape(e.message + '', true)
                    + '</pre>';
            }
            throw e;
        }
    }

    /**
     * Options
     */

    marked.options = function (opt) {
        ns.merge(marked.defaults, opt);
        return marked;
    };

    marked.defaults = {
        gfm: true,
        tables: true,
        breaks: false,
        pedantic: false,
        sanitize: false,
        sanitizer: null,
        mangle: true,
        smartLists: false,
        silent: false,
        highlight: null,
        langPrefix: 'lang-',
        smartypants: false,
        headerPrefix: '',
        renderer: new Renderer,
        xhtml: false
    };

    /**
     * Expose
     */
    marked.Parser = Parser;
    marked.parser = Parser.parse;
    marked.Renderer = Renderer;
    marked.Lexer = Lexer;
    marked.lex = Lexer.lex;
    marked.InlineLexer = InlineLexer;
    marked.inlineLex = InlineLexer.output;
    marked.parse = marked;
    ns.marked = marked;
    ns.marked.escape = function escape(html, encode) {
        return html
            .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&')
            .replace(/</g, '<')
            .replace(/>/g, '>')
            .replace(/"/g, '"')
            .replace(/'/g, '\'');
    }
    ns.marked.unescape = function unescape(html) {
        // explicitly match decimal, hex, and named HTML entities 
        return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function (_, n) {
            n = n.toLowerCase();
            if (n === 'colon') return ':';
            if (n.charAt(0) === '#') {
                return n.charAt(1) === 'x'
                    ? String.fromCharCode(parseInt(n.substring(2), 16))
                    : String.fromCharCode(+n.substring(1));
            }
            return '';
        });
    }
    if (window.katex && window.katex.renderToString) {
        ns.marked.Renderer.extends.math = ns.marked.Renderer.extends.tex = function (code, esced) {
            return katex.renderToString(esced ? code : ns.marked.escape(code));
        }
    }
    ns.marked.extends = function () {
        if (arguments.length) {
            var arg = null;
            for (var i = 0; i < arguments.length; i++) {
                if ((arg = arguments[i]) && arg.key && (arg.block || arg.inline) && (arg.proc || arg.blockProc || arg.inlineProc)) {
                    if (arg.block) {
                        ns.marked.Renderer.extends.block = arg.proc;
                        if (!ns.marked.Lexer.extends) { ns.marked.Lexer.extends = {}; }
                        ns.marked.Lexer.extends[arg.block] = arg.block;
                    } else if (arg.inline) {
                        ns.marked.Renderer.extends.inline = arg.proc;
                        if (!ns.marked.InlineLexer.extends) { ns.marked.Lexer.extends = {}; }
                        ns.marked.InlineLexer.extends[arg.block] = arg.block;
                    }
                }
            }
        }
    }

})(ns);

//json view
(function (view) {
    var json = (function () {
        function json() {
            this.editable = false;
            this.json = {};
        }
        var formart = "";
        function renderJsonObject(json) {
            var k = json instanceof Array ? "[" : "{", ke = "}";
            if (k == "[") {
                ke = "]";
            }
            var t = this;
            t = this.div(".jsonview_collapser").end()
                .span().text(k).end().span(".jsonview_ellipsis").end().ul(".jsonview_obj .json_collapsible *list-style:none;padding-left:20px;");
            if (json instanceof Array) {
                for (var i = 0; i < json.length; i++) {
                    if (json[i] instanceof Object) {
                        t = t.li().div(".jsonview_hoverable").span(".jsonview_property").text(i).end().span().text(":").end();
                        renderJsonObject.call(t, json[i]);
                        t = t.end().end();
                    }
                    else {
                        t.li().div(".jsonview_hoverable").span(".jsonview_property").text(i).end().span().text(":").end().span(json[i] === true ? ".jsonview_type-boolean" : "").text(i).end().end().end();
                    }
                }
            }
            else {
                for (var j in json) {
                    if (json[j] instanceof Object) {
                        t = t.li().div(".jsonview_hoverable").span(".jsonview_property").text(j).end().span().text(":").end();
                        renderJsonObject.call(t, json[i]);
                        t = t.end().end();
                    }
                    else {
                        t.li("").div(".jsonview_hoverable").span(".jsonview_property").text(j).end().span().text(":").end().span(json[j] === true ? ".jsonview_type-boolean" : "").text(i).end().end().end();
                    }
                }
            }
            t = t.end().span().text(ke).end();
        }
        var root = parent;
        var style = ns.parseHtml("style").html(".jsonview_body {  white-space: pre;  font-family: monospace;}.jsonview_property {  font-weight: bold;}.jsonview_type-null {  color: gray;}.jsonview_type-boolean {  color: firebrick;}.jsonview_type-number {  color: blue;}.jsonview_type-string {  color: green;}.jsonview_callback-function {  color: gray;}.jsonview_collapser:after{content:\"-\";}.jsonview_collapsed > .jsonview_collapser:after {content:\"+\";}.jsonview_ellipsis:after{content:\"…\";}.jsonview_collapsible {  margin-left: 2em;}.jsonview_hoverable {  padding-top: 1px;  padding-bottom: 1px;  padding-left: 2px;  padding-right: 2px;  border-radius: 2px;}.jsonview_hovered {  background-color: rgba(235, 238, 249, 1);  }.jsonview_collapser {  padding-right: 6px;  padding-left: 6px;}");
        return json;
    } ());
    view.table = table;
})(view = ns.view || (ns.view = {}));

(function (editor) {
    var content = "";
    function editor() {

    }
    editor.modes = {
        mini: 1,
        small: 2,
        normal: 3,
        normalAndSlide: 4,
        fullscreen: 5
    },
        editor.toolbarModes = {
            full: [
                "undo", "redo", "|",
                "bold", "del", "italic", "quote", "ucwords", "uppercase", "lowercase", "|",
                "h1", "h2", "h3", "h4", "h5", "h6", "|",
                "list-ul", "list-ol", "hr", "|",
                "link", "reference-link", "image", "code", "preformatted-text", "code-block", "table", "datetime", "emoji", "html-entities", "pagebreak", "|",
                "goto-line", "watch", "preview", "fullscreen", "clear", "search", "|",
                "help", "info"
            ],
            simple: [
                "undo", "redo", "|",
                "bold", "del", "italic", "quote", "uppercase", "lowercase", "|",
                "h1", "h2", "h3", "h4", "h5", "h6", "|",
                "list-ul", "list-ol", "hr", "|",
                "watch", "preview", "fullscreen", "|",
                "help", "info"
            ],
            small: [
                "undo", "redo", "|",
                "watch", "preview", "|",
                "help", "info"
            ],
            mini: ["preview", "|", "fullscreen", "|", "help"]
        };
    editor.mode = "mini";
    editor.defaults = {
        mode: "gfm",          //gfm or markdown
        name: "",             // Form element name
        value: "",             // value for CodeMirror, if mode not gfm/markdown
        theme: "",             // Editor.md self themes, before v1.5.0 is CodeMirror theme, default empty
        editorTheme: "default",      // Editor area, this is CodeMirror theme at v1.5.0
        previewTheme: "",             // Preview area theme, default empty
        markdown: "",             // Markdown source code
        appendMarkdown: "",             // if in init textarea value not empty, append markdown to textarea
        width: "100%",
        height: "100%",
        path: "./lib/",       // Dependents module file directory
        pluginPath: "",             // If this empty, default use settings.path + "../plugins/"
        delay: 300,            // Delay parse markdown to html, Uint : ms
        autoLoadModules: true,           // Automatic load dependent module files
        watch: true,
        placeholder: "Enjoy Markdown! coding now...",
        gotoLine: true,
        codeFold: false,
        autoHeight: false,
        autoFocus: true,
        autoCloseTags: true,
        searchReplace: true,
        syncScrolling: true,           // true | false | "single", default true
        readOnly: false,
        tabSize: 4,
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: true,
        autoCloseBrackets: true,
        showTrailingSpace: true,
        matchBrackets: true,
        indentWithTabs: true,
        styleSelectedText: true,
        matchWordHighlight: true,           // options: true, false, "onselected"
        styleActiveLine: true,           // Highlight the current line
        dialogLockScreen: true,
        dialogShowMask: true,
        dialogDraggable: true,
        dialogMaskBgColor: "#fff",
        dialogMaskOpacity: 0.1,
        fontSize: "13px",
        saveHTMLToTextarea: false,
        disabledKeyMaps: [],
        onload: function () { },
        onresize: function () { },
        onchange: function () { },
        onwatch: null,
        onunwatch: null,
        onpreviewing: function () { },
        onpreviewed: function () { },
        onfullscreen: function () { },
        onfullscreenExit: function () { },
        onscroll: function () { },
        onpreviewscroll: function () { },

        imageUpload: false,
        imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
        imageUploadURL: "",
        crossDomainUpload: false,
        uploadCallbackURL: "",

        toc: true,           // Table of contents
        tocm: false,           // Using [TOCM], auto create ToC dropdown menu
        tocTitle: "",             // for ToC dropdown menu btn
        tocDropdown: false,
        tocContainer: "",
        tocStartLevel: 1,              // Said from H1 to create ToC
        htmlDecode: false,          // Open the HTML tag identification 
        pageBreak: true,           // Enable parse page break [========]
        atLink: true,           // for @link
        emailLink: true,           // for email address auto link
        taskList: false,          // Enable Github Flavored Markdown task lists
        emoji: false,          // :emoji: , Support Github emoji, Twitter Emoji (Twemoji);
        // Support FontAwesome icon emoji :fa-xxx: > Using fontAwesome icon web fonts;
        // Support Editor.md logo icon emoji :editormd-logo: :editormd-logo-1x: > 1~8x;
        tex: false,          // TeX(LaTeX), based on KaTeX
        flowChart: false,          // flowChart.js only support IE9+
        sequenceDiagram: false,          // sequenceDiagram.js only support IE9+
        previewCodeHighlight: true,

        toolbar: true,           // show/hide toolbar
        toolbarAutoFixed: true,           // on window scroll auto fixed position
        toolbarIcons: "full",
        toolbarTitles: {},
        toolbarHandlers: {
            ucwords: function () {
                return editormd.toolbarHandlers.ucwords;
            },
            lowercase: function () {
                return editormd.toolbarHandlers.lowercase;
            }
        },
        toolbarCustomIcons: {               // using html tag create toolbar icon, unused default <a> tag.
            lowercase: "<a href=\"javascript:;\" title=\"Lowercase\" unselectable=\"on\"><i class=\"fa\" name=\"lowercase\" style=\"font-size:24px;margin-top: -10px;\">a</i></a>",
            "ucwords": "<a href=\"javascript:;\" title=\"ucwords\" unselectable=\"on\"><i class=\"fa\" name=\"ucwords\" style=\"font-size:20px;margin-top: -3px;\">Aa</i></a>"
        },
        toolbarIconsClass: {
            undo: "fa-undo",
            redo: "fa-repeat",
            bold: "fa-bold",
            del: "fa-strikethrough",
            italic: "fa-italic",
            quote: "fa-quote-left",
            uppercase: "fa-font",
            h1: editormd.classPrefix + "bold",
            h2: editormd.classPrefix + "bold",
            h3: editormd.classPrefix + "bold",
            h4: editormd.classPrefix + "bold",
            h5: editormd.classPrefix + "bold",
            h6: editormd.classPrefix + "bold",
            "list-ul": "fa-list-ul",
            "list-ol": "fa-list-ol",
            hr: "fa-minus",
            link: "fa-link",
            "reference-link": "fa-anchor",
            image: "fa-picture-o",
            code: "fa-code",
            "preformatted-text": "fa-file-code-o",
            "code-block": "fa-file-code-o",
            table: "fa-table",
            datetime: "fa-clock-o",
            emoji: "fa-smile-o",
            "html-entities": "fa-copyright",
            pagebreak: "fa-newspaper-o",
            "goto-line": "fa-terminal", // fa-crosshairs
            watch: "fa-eye-slash",
            unwatch: "fa-eye",
            preview: "fa-desktop",
            search: "fa-search",
            fullscreen: "fa-arrows-alt",
            clear: "fa-eraser",
            help: "fa-question-circle",
            info: "fa-info-circle"
        },
        toolbarIconTexts: {},

        lang: {
            name: "zh-cn",
            description: "开源在线Markdown编辑器<br/>Open source online Markdown editor.",
            tocTitle: "目录",
            toolbar: {
                undo: "撤销（Ctrl+Z）",
                redo: "重做（Ctrl+Y）",
                bold: "粗体",
                del: "删除线",
                italic: "斜体",
                quote: "引用",
                ucwords: "将每个单词首字母转成大写",
                uppercase: "将所选转换成大写",
                lowercase: "将所选转换成小写",
                h1: "标题1",
                h2: "标题2",
                h3: "标题3",
                h4: "标题4",
                h5: "标题5",
                h6: "标题6",
                "list-ul": "无序列表",
                "list-ol": "有序列表",
                hr: "横线",
                link: "链接",
                "reference-link": "引用链接",
                image: "添加图片",
                code: "行内代码",
                "preformatted-text": "预格式文本 / 代码块（缩进风格）",
                "code-block": "代码块（多语言风格）",
                table: "添加表格",
                datetime: "日期时间",
                emoji: "Emoji表情",
                "html-entities": "HTML实体字符",
                pagebreak: "插入分页符",
                "goto-line": "跳转到行",
                watch: "关闭实时预览",
                unwatch: "开启实时预览",
                preview: "全窗口预览HTML（按 Shift + ESC还原）",
                fullscreen: "全屏（按ESC还原）",
                clear: "清空",
                search: "搜索",
                help: "使用帮助",
                info: "关于" + editormd.title
            },
            buttons: {
                enter: "确定",
                cancel: "取消",
                close: "关闭"
            },
            dialog: {
                link: {
                    title: "添加链接",
                    url: "链接地址",
                    urlTitle: "链接标题",
                    urlEmpty: "错误：请填写链接地址。"
                },
                referenceLink: {
                    title: "添加引用链接",
                    name: "引用名称",
                    url: "链接地址",
                    urlId: "链接ID",
                    urlTitle: "链接标题",
                    nameEmpty: "错误：引用链接的名称不能为空。",
                    idEmpty: "错误：请填写引用链接的ID。",
                    urlEmpty: "错误：请填写引用链接的URL地址。"
                },
                image: {
                    title: "添加图片",
                    url: "图片地址",
                    link: "图片链接",
                    alt: "图片描述",
                    uploadButton: "本地上传",
                    imageURLEmpty: "错误：图片地址不能为空。",
                    uploadFileEmpty: "错误：上传的图片不能为空。",
                    formatNotAllowed: "错误：只允许上传图片文件，允许上传的图片文件格式有："
                },
                preformattedText: {
                    title: "添加预格式文本或代码块",
                    emptyAlert: "错误：请填写预格式文本或代码的内容。"
                },
                codeBlock: {
                    title: "添加代码块",
                    selectLabel: "代码语言：",
                    selectDefaultText: "请选择代码语言",
                    otherLanguage: "其他语言",
                    unselectedLanguageAlert: "错误：请选择代码所属的语言类型。",
                    codeEmptyAlert: "错误：请填写代码内容。"
                },
                htmlEntities: {
                    title: "HTML 实体字符"
                },
                help: {
                    title: "使用帮助"
                }
            }
        }
    };
    var html = "<div class='edit-container' style='width:99%; height:140px; color:rgb(34,34,34); font-size:12px; padding-bottom:2px; border-width:0px; border-style:solid; border-color:#e0e0e0; margin:5px;'><div id='idtag_4bcfac29-fb09-4ace-86cf-49d1ad0087cb' class='edit-core' style=' font-size:12px; height:100%; width:100%; left:0px; width:100%; border-width:0px; border-style:solid; border-color:#e0e0e0; border-top-width:0px; margin-bottom:15px; box-shadow:gray 1px 1px #888888;; padding-top:5px;; padding-bottom:20px;; padding-left:3px;;'><div id='idtag_f294b55b-0f74-4807-9290-4a53e0df8b6a' class='edit-header' style='font-size: 12px; left: 0px; width: 99%; border-width: 0.3px; border-style: solid; border-color: rgb(224, 224, 224); height: 24px; opacity: 0; display: none;'><ul id='idtag_09e8398c-3f0a-4fdf-87d7-1561f95bd755' class='icon-menu-left edit-icon-menu' style=' float:left; font-size:12px; margin:0px; padding:0px; margin-right:2px; list-style:none;'></ul><ul id='idtag_075fdd64-6afc-4a98-8f63-baa6a2cf1381' class='icon-menu-right edit-icon-menu' style=' float:right; font-size:12px; margin:0px; padding:0px; margin-right:0.2px; list-style:none;'><li id='idtag_ca870abc-3bd0-4c78-b88f-cc45bcae33bb' class='icon-menu-item' title='preview' ns-command='preview' style=' height:16px; width:16px; padding:4px; float:left; cursor:pointer;'><span id='idtag_6866213f-f716-4db1-8493-0d95b7b1c49f' class='fa-eye-slash fa' style=' height:16px; line-height:16px; width:16px; text-align:center; font-size:14px;'></span></li><li id='idtag_d6115cc6-9200-4195-966f-064cc0afccf0' class='icon-menu-item' title='full screen' ns-command='fullscreen' style=' height:16px; width:16px; padding:4px; float:left; cursor:pointer;'><span id='idtag_6735a94b-459c-421f-82ac-e2302689af3d' class='fa-laptop fa' style=' height:16px; line-height:16px; width:16px; text-align:center; font-size:14px;'></span></li></ul></div><div id='idtag_d863c191-fe45-4103-b159-9babe6ae57f0' class='edit-document-preview' style=' display:none; height:100%; width:100%;'><iframe id='idtag_a22ff57c-42df-41dd-a5b0-da9e8cc5c5d1' style=' width:98%; height:100%;'></iframe></div><div id='idtag_5195aa07-4485-45c0-8792-77d23f88b267' class='edit-domain' style=' display:block; height:100%;'><textarea id='idtag_001d288b-6633-4b80-868f-b7a79ed351fd' class='text-domain' style=' width:98%; height:84%; overflow:auto; font-size:14px; padding:5px; border-width:1px; background-color:#fafafa;'>"
})(ns.editor);