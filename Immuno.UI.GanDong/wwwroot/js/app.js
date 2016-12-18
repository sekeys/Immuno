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
    }
    ns.querystring = function () {
        var qs = new ns.Map();
        var href = window.location.href;
        var indexofPos = href.lastIndexOf('?'), indexofj = href.indexOf("#");
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
    ns.parseHtml = function (tag) {
        if (typeof tag !== "string") {
            return tag;
        }
        var obj = null;
        tag = tag.trim();
        if (/^\S*<tr/.test(tag)) {
            obj = document.createElement("tbody");
            obj.innerHTML = tag;
        }
        else if (/^\S*<td/.test(tag)) {
            obj = document.createElement("tr");
            obj.innerHTML = tag;
        }
        else if (/^\S*<li/.test(tag)) {
            obj = document.createElement("ul");
            obj.innerHTML = tag;
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
        else if (exp.nodeType) {
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
            this.call(function (d) { this.node().value = val; }, pos);
            return this;
        }
        return this.calling(function (d) { return this.node().value; }, pos);
    };
    ns.prototype.text = function (txt, pos) {
        if (txt != null) {
            this.call(function (d) { this.node(0).innerText = txt; }, pos);
            return this;
        }
        return this.calling(function (d) { return this.node(0).innerText; }, pos);
    };
    ns.prototype.prop = function (prop, value) {
        return this.attr(prop, value);
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
        data.data = function (data) { var d = new data(); d.datum(data); return d; };
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
        }
        tag.body = function () { return new ns.tag().begin(); };
        tag.div = function () { return new ns.tag("div").begin(); };
        tag.table = function () { return new ns.tag("table").begin(); };
        tag.p = function () { return new ns.tag("p").begin(); };
        tag.ul = function () { return new ns.tag("ul").begin(); };
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
            var t = ns.tag.div()
                .style().text("@-webkit-keyframes landingline_animate { 0% { margin-left: 0;} 5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}} @keyframes landingline_animate { 0% { margin-left: 0;}5% { margin-left: 4%;} 50% { margin-left:" + (50 - config.width) + "%;}100% { margin-left: " + (100 - config.width) + "%;}}").end()
                .div().attr({}).css({ height: config.height + "px", width: config.width + "%", margin: "0px;", float: "left", "background-color": config.background, "animation": "landingline_animate " + config.time + "s infinite", "-webkit-animation": "landingline_animate " + config.time + "s infinite", "animation-delay": config.delay + "s", "-webkit-animation-delay": config.delay + "s", ";": config.csstext || ";" }).end()
                .end().render(parent, config.override);
            config.callback ? config.callback.call(t, parent) : null;
            t.hide = function () {
                t._ns.hide();
            };
            t.show = function () { t._ns.show(); };
            return t;
        };
        tag.datepicker = function (parent, conf) {
            function context_s() { }
            ;
            if (typeof conf === "function") {
                conf = { callback: conf };
            }
            if (!conf) {
                conf = {};
            }
            conf.format = conf.format || "yyyy-MM-dd hh:mm:ss";
            conf.override = conf.override || -1;
            conf.time = conf.time || 3;
            conf.width = conf.width || 5;
            conf.background = conf.backround || "#886ed7";
            conf.height = conf.height || 1;
            conf.delay = conf.delay || 0;
            conf.changed = conf.changed || function () { };
            conf.startSun = conf.startSun == null ? false : conf.startSun;
            conf.date = conf.date || Date.now();
            conf.prev = conf.prev || "<<";
            conf.next = conf.next || ">>";
            conf.mesh = conf.mesh || "day";
            conf.minDate = new Date();
            var context = new context_s();
            context.render = function (parent) {
                if (this.mesh === "day") {
                    context._dayRender(parent);
                }
                else if (this.mesh === "year") {
                    context._yearRender(parent);
                }
                else if (this.mesh === "month") {
                    context._monthRender(parent);
                }
                else if (this.mesh === "hour") {
                    context._monthRender(parent);
                }
                else if (this.mesh === "mins") {
                    context._monthRender(parent);
                }
            };
            var currentDate = new Date();
            conf.headformat = conf.headformat || "short";
            //
            context.wrapper = "";
            context._hourRender = function (parent, title) {
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [];
                for (var i = 0, k = -1; i < 24; i++) {
                    showDates.push({ text: i + ":00", ho: i, h: "hour" });
                }
                conf.headformat = conf.headformat || "weeklyshort";
                ns.tag.div().attr({})
                    .table().attr({ class: "ns_datepicker" }).css({}).thead()
                    .tr().th().attr({ class: "ns_datepicker_prev" }).css({ visibility: "visible" }).css({ cursor: "pointer" }).text(conf.prev).end().th().attr({ class: "ns_datepicker_switch", colspan: "5" }).css({ cursor: "pointer" }).text(title).end().th().attr({ class: "ns_datepicker_next" }).css({ visibility: "visible", cursor: "pointer" }).text(conf.next).end().end()
                    .end() //.tr().datum(conf.startSun ? headformats[conf.headformat].slice(0, 7) : headformats[conf.headformat].slice(1, 8)).list(function (d) { this.th().attr({ class: "ns_datepicker_dow" }).text(d).end(); }).end()
                    .tbody().tr().td().attr({ colspan: 7 }).datum(showDates).list(function (b) {
                    this.span().attr({ class: "ns_datepicker_day " + b.h + (b.ho == currentDate.getHours() ? " ns_datepicker_tohour" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                }).end().end()
                    .end()
                    .end()
                    .end().render(parent, false);
            };
            context._dayRender = function (parent) {
                var currentDate = new Date();
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [[]];
                var month = new Date().getMonth();
                var year = new Date().getFullYear();
                var week = (conf.startSun ? 0 : -1) + new Date().getDay();
                var day = month === 2 && (year % 400 === 0 || year % 4 === 0) ? 29 : month === 2 ? 28 : monthdays[month];
                var month_1 = month - 1;
                month_1 = month_1 < 1 ? 12 : month_1;
                var predays = month_1 === 2 && (year % 400 === 0 || year % 4 === 0) ? 29 : month_1 === 2 ? 28 : monthdays[month_1];
                if (week <= 0) {
                    week = 7;
                }
                var j = 0;
                for (var i = 1; i <= week; i++) {
                    showDates[0].push({ text: predays - week + i, m: month_1, h: "old", d: predays - week + i, y: year });
                }
                for (var i = week, k = 1; i < day + week; i++, k++) {
                    if (i % 7 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: k, h: "current", m: month, d: k, y: year });
                }
                for (var i = week + day, k = 1; i < 42; i++, k++) {
                    if (i % 7 == 0) {
                        j++;
                        showDates[j] = [];
                    }
                    showDates[j].push({ text: k, h: "current", m: month + 1, d: k, y: year });
                }
                var headformats = {
                    "short": ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
                    "hans": ["日", "一", "二", "三", "四", "五", "六", "日"],
                };
                var title = year + "-" + new Date().getDate();
                ns.tag.div().attr({})
                    .table().attr({ class: "ns_datepicker" }).css({}).thead()
                    .tr().th().attr({ class: "ns_datepicker_prev" }).css({ visibility: "visible" }).css({ cursor: "pointer" }).text(conf.prev).end().th().attr({ class: "ns_datepicker_switch", colspan: "5" }).css({ cursor: "pointer" }).text(title).end().th().attr({ class: "ns_datepicker_next" }).css({ visibility: "visible", cursor: "pointer" }).text(conf.next).end().end()
                    .tr().datum(conf.startSun ? headformats[conf.headformat].slice(0, 7) : headformats[conf.headformat].slice(1, 8)).list(function (d) { this.th().attr({ class: "ns_datepicker_dow" }).text(d).end(); }).end()
                    .tbody().host("list", context).datum(showDates).list(function (a) {
                    this.tr().datum(a).list(function (b) {
                        this.td().attr({ class: "ns_datepicker_day " + b.h + (b.y == currentDate.getFullYear() && currentDate.getMonth() == b.m && currentDate.getDate() === b.d ? " ns_datepicker_today" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                    }).end();
                }).end()
                    .end()
                    .end()
                    .end().render(parent, false);
            };
            context._monthRender = function () {
                var currentDate = new Date();
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [];
                var month = new Date().getMonth();
                var year = new Date().getFullYear();
                var headformats = {
                    "short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                    "hans": ["日", "一", "二", "三", "四", "五", "六", "日"],
                };
                var cl = headformats[conf.headformat];
                for (var i = 0, k = -1; i < cl.length; i++) {
                    showDates.push({ m: i + 1, text: cl[i], y: year, h: "month" });
                }
                var title = year + "-" + new Date().getDate();
                conf.headformat = conf.headformat || "weeklyshort";
                ns.tag.div().attr({})
                    .table().attr({ class: "ns_datepicker" }).css({}).thead()
                    .tr().th().attr({ class: "ns_datepicker_prev" }).css({ visibility: "visible" }).css({ cursor: "pointer" }).text(conf.prev).end().th().attr({ class: "ns_datepicker_switch", colspan: "5" }).css({ cursor: "pointer" }).text(title).end().th().attr({ class: "ns_datepicker_next" }).css({ visibility: "visible", cursor: "pointer" }).text(conf.next).end().end()
                    .end() //.tr().datum(conf.startSun ? headformats[conf.headformat].slice(0, 7) : headformats[conf.headformat].slice(1, 8)).list(function (d) { this.th().attr({ class: "ns_datepicker_dow" }).text(d).end(); }).end()
                    .tbody().tr().td().attr({ colspan: 7 }).datum(showDates).list(function (b) {
                    this.span().attr({ class: "ns_datepicker_day " + b.h + (b.y == currentDate.getFullYear() && currentDate.getMonth() == b.m ? " ns_datepicker_tomonth" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                }).end().end()
                    .end()
                    .end()
                    .end().render(parent, false);
            };
            context._yearRender = function (parent, min) {
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [];
                var min = min || currentDate.getFullYear() - 5;
                for (var i = 0, k = -1; i < 12; i++) {
                    showDates.push({ text: min + i, y: min + i, h: "year" });
                }
                var title = min + " - " + (min + 11);
                conf.headformat = conf.headformat || "weeklyshort";
                ns.tag.div().attr({})
                    .table().attr({ class: "ns_datepicker" }).css({}).thead()
                    .tr().th().attr({ class: "ns_datepicker_prev" }).css({ visibility: "visible" }).css({ cursor: "pointer" }).text(conf.prev).end().th().attr({ class: "ns_datepicker_switch", colspan: "5" }).css({ cursor: "pointer" }).text(title).end().th().attr({ class: "ns_datepicker_next" }).css({ visibility: "visible", cursor: "pointer" }).text(conf.next).end().end()
                    .end() //.tr().datum(conf.startSun ? headformats[conf.headformat].slice(0, 7) : headformats[conf.headformat].slice(1, 8)).list(function (d) { this.th().attr({ class: "ns_datepicker_dow" }).text(d).end(); }).end()
                    .tbody().tr().td().attr({ colspan: 7 }).datum(showDates).list(function (b) {
                    this.span().attr({ class: "ns_datepicker_day " + b.h + (b.y == currentDate.getFullYear() ? " ns_datepicker_toyear" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                }).end().end()
                    .end()
                    .end()
                    .end().render(parent, false);
            };
            context._minsRender = function (parent, hour, title) {
                var monthdays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                var showDates = [];
                for (var i = 0, k = -1; i < 12; i++) {
                    showDates.push({ text: hour + ":" + (i * 15), ho: hour, ms: i * 15, h: "mins" });
                }
                conf.headformat = conf.headformat || "weeklyshort";
                ns.tag.div().attr({})
                    .table().attr({ class: "ns_datepicker" }).css({}).thead()
                    .tr().th().attr({ class: "ns_datepicker_prev" }).css({ visibility: "visible" }).css({ cursor: "pointer" }).text(conf.prev).end().th().attr({ class: "ns_datepicker_switch", colspan: "5" }).css({ cursor: "pointer" }).text(title).end().th().attr({ class: "ns_datepicker_next" }).css({ visibility: "visible", cursor: "pointer" }).text(conf.next).end().end()
                    .end() //.tr().datum(conf.startSun ? headformats[conf.headformat].slice(0, 7) : headformats[conf.headformat].slice(1, 8)).list(function (d) { this.th().attr({ class: "ns_datepicker_dow" }).text(d).end(); }).end()
                    .tbody().tr().td().attr({ colspan: 7 }).datum(showDates).list(function (b) {
                    this.span().attr({ class: "ns_datepicker_day " + b.h + (b.ms == currentDate.getMinutes() ? " ns_datepicker_tomins" : ""), options: JSON.stringify(b) }).css({ cursor: "pointer" }).text(b.text).end();
                }).end().end()
                    .end()
                    .end()
                    .end().render(parent, false);
            };
            context.mesh = conf.mesh;
            context.render();
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
            context.object = ns.tag.div().attr({ class: "ns-dialog" }).css({ "border": "1px solid #e0e0e0;", "z-index": 99, "line-height": " 20px", "min-width": conf.width + "px", "min-height": conf.height + "px", "text-align": "left", "border-radius": "5px", "font-size": "14px", padding: "0px", position: "fixed", "font-family": "Verdana;", left: "160px;", right: "auto", top: "120px;", "background-color": "white" })
                .div().attr({ class: "ns-dialog-menubar" }).css({ height: "30px;", "background-color": "rgb(0, 122, 204);", color: "#000000", }).callback(conf.rendermeenu)
                .div().attr({ class: "ns-dialog-title" }).css({ float: "left" }).h3().text(conf.title).css({ color: "white", "line-height": "30px", margin: "0px", "padding-left": "5px;" }).end().end()
                .div().attr({ class: "ns-dialog-menu" }).css({ float: "right" }).div().css({ cursor: " pointer", width: "60px", height: "30px", "line-height": "30px" }).text("[ close ]").event("click", function () { context.hide(); }).end().end()
                .div().css({ clear: "both" })
                .end().end()
                .div().landingline({}, context).end()
                .div().attr({ class: "ns-dialog-content" }).css({ width: conf.width + "px", margin: "0px", "min-height": (conf.height - 35) + "px", "background-color": "white" }).host("content", context)
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
        tag.prototype.begin = function () {
            this.html += "<" + this.tag + " id='" + this.id + "' ";
            return this;
        };
        tag.prototype.attr = function (prop, val) {
            if (val) {
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
                if (new RegExp(prop + "='([^'])*'", "ig").test(this.html)) {
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
            return this._ns.attr(prop);
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
                this.parent.html += this.html;
                return this.parent;
            }
            return this;
        };
        tag.prototype.ns = function (select) {
            if (select) {
                this._ns = ns.select(select);
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
            return this._ns.css(prop);
        };
        tag.prototype.child = function (tag) {
            if (!/style=/i.test(this.html) && this.cssHtml) {
                this.html += " style='" + this.cssHtml + "' >" + this._text;
            }
            if (this.html.indexOf('>') <= 0) {
                this.html += ">" + this._text;
            }
            var t = new ns.tag(tag, this);
            return t;
        };
        tag.prototype.render = function (dom, override) {
            var rt = this, me = this;
            if (typeof dom === "string" || dom instanceof ns) {
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
        tag.prototype.proc = function (exp) { if (/^#/.test(exp)) {
            this.attr("id", exp.split(/\S+/)[0]);
        }
        else if (/^\./.test(exp)) {
            this.attr("class", exp.split(/\S+/)[0]);
        } };
        tag.prototype.table = function () { return this.child("table").begin(); };
        tag.prototype.div = function () { return this.child("div").begin(); };
        tag.prototype.h1 = function () { return this.child("h1").begin(); };
        tag.prototype.h2 = function () { return this.child("h2").begin(); };
        tag.prototype.h3 = function () { return this.child("h3").begin(); };
        tag.prototype.h4 = function () { return this.child("h4").begin(); };
        tag.prototype.span = function () { return this.child("span").begin(); };
        tag.prototype.p = function () { return this.child("p").begin(); };
        tag.prototype.ul = function () { return this.child("ul").begin(); };
        tag.prototype.li = function () { return this.child("li").begin(); };
        tag.prototype.ol = function () { return this.child("ol").begin(); };
        tag.prototype.em = function () { return this.child("em").begin(); };
        tag.prototype.tr = function () { return this.child("tr").begin(); };
        tag.prototype.td = function () { return this.child("td").begin(); };
        tag.prototype.option = function () { return this.child("option").begin(); };
        tag.prototype.label = function () { return this.child("label").begin(); };
        tag.prototype.script = function () { return this.child("script").begin(); };
        tag.prototype.link = function () { return this.child("link").begin(); };
        tag.prototype.style = function () { return this.child("style").begin(); };
        tag.prototype.video = function () { return this.child("video").begin(); };
        tag.prototype.title = function () { return this.child("title").begin(); };
        tag.prototype.meta = function () { return this.child("meta").begin(); };
        tag.prototype.tbody = function () { return this.child("tbody").begin(); };
        tag.prototype.theader = function () { return this.child("theader").begin(); };
        tag.prototype.input = function () { return this.child("input").begin(); };
        tag.prototype.textbox = function () { return this.child("input").begin().attr("type", "textbox"); };
        tag.prototype.pwd = function () { return this.child("input").begin().attr("type", "password"); };
        tag.prototype.img = function () { return this.child("img").begin(); };
        tag.prototype.check = function () { return this.child("input").begin().attr("type", "checkbox"); };
        tag.prototype.a = function () { return this.child("a").begin(); };
        tag.prototype.textarea = function () { return this.child("textarea").begin(); };
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
                if (this.parent.tag === "select") {
                    var fn = template;
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
                me.if(ifexp, me.ajax(url, method, {
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
        tag.prototype.ajax = function (url, method, callback, mimeType) {
            ns.ajax.load(url, method, data, callback, mimeType);
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
                pop.object.each(function () {
                    var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
                    nss.css("display", Ns.CSS.getDisplayType(nss.node()));
                    showtweens = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 1 }, speed).call(function () {
                        //delete nss.eq(0).tweenanimate;
                        showtweens = null;
                        ns.popup.popupitems[id] = { position: position, popup: this };
                        successback.call(nss, null);
                    });
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
            pop.startTick = function (delay) {
                timerid = window.setTimeout(function () {
                    hiding = true;
                    pop.hide(speed);
                }, delay || delay);
                return this;
            };
            pop.clearTick = function () {
                if (timerid) {
                    window.clearTimeout(timerid);
                }
                return this;
            };
            pop.css = function (prop, val) { pop.object.css(prop, val); return this; };
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
                return this.ajax(url, method, window[this.writeScript(function (d) { callback(); }).toString()], mimetype);
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
            var me = this, params = ns.slice(arguments).slice(2), tfn = function () {
                if (typeof locker === "string") {
                    var lock = me._ns.length ? me._ns.attr(locker) : "";
                    if (/true/.test(lock)) {
                        return;
                    }
                    ;
                }
                if (locker instanceof Function && locker.call(me, null)) {
                    return callback.apply(me, params);
                }
                setTimeout(tfn, time);
            };
            setTimeout(tfn, time);
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
    var commandParse = (function () {
        function commandParse(context) {
            this.cmd = new Map();
            this.context = context;
        }
        commandParse.prototype.parse = function (input) {
        };
        commandParse.prototype.parameter = function (params) {
        };
        commandParse.prototype.exec = function (input, param) { };
        commandParse.prototype.regiest = function () { };
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
                if (!/head|get/.test(method))
                    this.request.setRequestHeader('content-type', "application/x-www-form-urlencoded; charset=UTF-8;");
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
                else {
                    xhr.post(data);
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
                else {
                    xhr.post(data);
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
    var render = (function () {
        function render() {
            this._class = [];
            this._cmd = new commandParse(this);
            this._id = "id_" + ns.guid();
            this._events = new Map();
            this._css = new Map();
            this._attrs = new Map();
            this.dispatch = ns.dispatch("rendering,rendered,loading,loaded,constructingAttr,constructingChildren,showed,hided");
        }
        render.script = function (src) {
            document.writeln("<script src='" + src + "' type='text/script'/>");
        };
        render.css = function (href) {
            document.writeln('<link rel = "stylesheet" href = "' + href + '" type ="text/css" />');
        };
        render.html = function (html) {
            document.writeln(html instanceof Function ? html.apply(null, ns.slice(arguments)).slice(1) : html);
        };
        render.data = function (url, data) {
            ns.ajax.load(url, "get", data, function (html) {
                ns.render.html(html);
            }, "application/json");
        };
        render.write = function (html) {
            document.write(html);
        };
        render.writeDOM = function (dom) {
            document.write(ns.select(dom).outHtml());
        };
        render.prototype.data = function (value) { if (value != null) {
            this._data = value;
            return this;
        } return this._data; };
        render.prototype.model = function (value) { if (value != null) {
            this._model = value;
            return this;
        } return this._model; };
        render.prototype.html = function (value) { if (value != null) {
            this._html = value;
            return this;
        } return this._html; };
        render.prototype.tag = function (tag) { if (tag) {
            this._tag = tag;
            return this;
        } return this._tag; };
        render.prototype.attr = function (key, val) {
            if (val != null) {
                this._attrs.set(key, val);
                return this;
            }
            else {
                if (this._attrs.has(key)) {
                    return this._attrs.get(key);
                }
                return null;
            }
        };
        render.prototype.css = function (key, val) {
            if (val != null) {
                this._css.set(key, val);
                return this;
            }
            else {
                if (this._css.has(key)) {
                    return this._css.get(key);
                }
                return null;
            }
        };
        render.prototype.events = function (key, fn) {
            if (fn != null) {
                this._attrs.set(key, fn);
                return this;
            }
            else {
                if (this._attrs.has(key)) {
                    return this._attrs.get(key);
                }
                return null;
            }
        };
        render.prototype.addClass = function (cls) {
            if (this._class.indexOf(cls) > -1) {
                return this;
            }
            this._class.push(cls);
            return this;
        };
        render.prototype.hasClass = function (cls) {
            return this._class.indexOf(cls) > -1;
        };
        render.prototype.removeClass = function (cls) {
            var index = this._class.indexOf(cls);
            if (index > -1) {
                this._class = this._class.slice(0, index).concat(this._class.slice(index + 1, this._class.length));
            }
        };
        render.prototype.render = function (args) {
            this.dispatch.rendering.call(this, args);
            var d = ns.parseHtml(this._tag);
            var self = "<" + this._tag;
            this._attrs.forEach(function (d, v) {
                self += " " + d + "='" + (v instanceof Function ? v.call(this, null) : v instanceof Object ? JSON.stringify(v) : v) + "'  ";
            });
            if (this._css.size > 0) {
                self += " style='";
                this._css.forEach(function (d, v) {
                    self += " " + d + ":" + (v instanceof Function ? v.call(this, null) : v instanceof Object ? JSON.stringify(v) : v) + "  ";
                });
                self += "'";
            }
            self += " ns-options='" + JSON.stringify(this._options) + "' ns-render='true' id='" + this._id + "' class='ns-rendering ' ns-model='" + JSON.stringify(this._model) + "' ";
            this.dispatch.constructingAttr.call(this, self, args);
            self += ">" + this._html;
            this.dispatch.constructingChildren.call(this, self, args);
            self += "</" + this._tag + ">";
            if (args) {
                var parent = args instanceof ns ? args : ns.select(args);
                parent.append(self);
            }
            else {
                document.writeln(self);
            }
            this.dispatch.rendered.call(this, args);
            this.selector = ns.select("#" + this._id);
            return this;
        };
        render.prototype.show = function (speed, args) { this.selector.show(speed); this.dispatch.showed.call(this, args); return this; };
        render.prototype.hide = function (speed, args) { this.selector.hide(speed); this.dispatch.hided.call(this, args); return this; };
        render.prototype.select = function (exp) { if (!exp) {
            return this.selector;
        } return this.selector.select(exp); };
        render.prototype.on = function (evn, fn) { this.selector.on(evn, fn); return this; };
        render.prototype.off = function (evn, fn) { this.selector.off(evn, fn); return this; };
        render.prototype.exec = function (input, param) { this._cmd.exec(input, param); };
        render.prototype.drag = function (moveDom, bindDom, opacity) {
            var bindDom = typeof bindDom === "string" ? this.selector.select(bindDom) : bindDom || this.selector;
            var opacity = opacity ? opacity : 1;
            var moveDom = moveDom ? typeof moveDom === "string" ? this.selector.select(moveDom) : moveDom : bindDom;
            var resumPointer = "";
            function parseInt1(o) {
                var i = parseInt(o);
                return isNaN(i) ? 0 : i;
            }
            var me = this;
            var listen = function () {
                bindDom.mousedown(function (a) {
                    var o = moveDom;
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
                    var backData = { x: o.css("top"), y: o.css("left") };
                    resumPointer = o.css("cursor");
                    o.css({ "cursor": "pointer" });
                    d.onmousemove = function (a) {
                        if (!a)
                            a = window.event;
                        if (!a.pageX)
                            a.pageX = a.clientX;
                        if (!a.pageY)
                            a.pageY = a.clientY;
                        var tx = a.pageX - x + parseInt1(o.css("left")), ty = a.pageY - y + parseInt1(o.css("top"));
                        o.css({ left: tx + "px", top: ty + "px" });
                        x = a.pageX;
                        y = a.pageY;
                    };
                    d.onmouseup = function (a) {
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
                        if (a.pageX < 1 || a.pageY < 1 || a.pageX > document.body["pageWidth"] || a.pageY > document.body["pageHeight"]) {
                            o.css({ left: backData.y, top: backData.x });
                        }
                        o.css({ "cursor": resumPointer });
                    };
                });
            };
            if (bindDom) {
                listen();
            }
        };
        render.prototype.h1 = function () { return this.tag("h1"); };
        render.prototype.ul = function () { return this.tag("ul"); };
        render.prototype.li = function () { return this.tag("li"); };
        render.prototype.div = function () { return this.tag("div"); };
        render.prototype.p = function () { return this.tag("p"); };
        render.prototype.span = function () { return this.tag("span"); };
        render.prototype.h2 = function () { return this.tag("h2"); };
        render.prototype.h3 = function () { return this.tag("h3"); };
        render.prototype.img = function () { return this.tag("img"); };
        render.prototype.input = function () { return this.tag("input"); };
        return render;
    }());
    ns.render = render;
    var listboxitemRender = (function (_super) {
        __extends(listboxitemRender, _super);
        function listboxitemRender() {
            _super.apply(this, arguments);
        }
        listboxitemRender.prototype.render = function (dom) {
            if (this._html) {
                _super.prototype.render.call(this, this.parent.selector);
            }
            else {
                this._html = ns.data.bind(this._template, this._data, "json", this.index);
                this.parent.selector.append(ns.select(ns.parseHtml(this._html)).attr("id", this._id).attr("ns-render", "true"));
            }
            return this;
        };
        listboxitemRender.prototype.template = function (val) {
            if (val == null) {
                return this._template;
            }
            this._template = val;
            return this;
        };
        return listboxitemRender;
    }(render));
    ns.listboxitemRender = listboxitemRender;
    var listboxRender = (function (_super) {
        __extends(listboxRender, _super);
        function listboxRender() {
            _super.apply(this, arguments);
        }
        listboxRender.prototype.remove = function (at) {
            if (!at && at !== 0) {
                this.items.pop();
            }
            this.items.slice(0, at).concat(this.items.slice(at, this.items.length - 1));
            this.dispatch.changed.call(this, this.items, at);
            return this;
        };
        listboxRender.prototype.add = function (item) {
            this.items.push(item);
            this.dispatch.changed.call(this, this.items, item);
            return this;
        };
        listboxRender.prototype.template = function (val) {
            if (val == null) {
                return this._template;
            }
            this._template = val;
            return this;
        };
        listboxRender.prototype.render = function (dom) {
            this.dispatch.rendering.call(this, dom);
            var d = ns.parseHtml(this._tag);
            var self = "<" + this._tag;
            this._attrs.forEach(function (d, v) {
                self += " " + d + "='" + (v instanceof Function ? v.call(this, null) : v instanceof Object ? JSON.stringify(v) : v) + "'  ";
            });
            self += " ns-options='" + JSON.stringify(this._options) + "' ns-render='true' id='" + this._id + "' class='ns-rendering ' ns-model='" + JSON.stringify(this._model) + "' ";
            this.dispatch.constructingAttr.call(this, self, dom);
            self += ">" + this._html;
            this.dispatch.constructingChildren.call(this, self, dom);
            self += "</" + this._tag + ">";
            if (dom) {
                var parent = dom instanceof ns ? dom : ns.select(dom);
                parent.append(self);
            }
            else {
                document.writeln(self);
            }
            this.selector = ns.select("#" + this._id);
            this.items.forEach(function (v, index, ar) {
                v.render();
            });
            this._data.each(function (d, index) {
                var item = new listboxitemRender();
                item.template(this._tempate);
                item.data(d);
                item.attr("ns-view", "listboxitem");
                item.attr("ns-target", "#" + this._id);
                item.html("");
                item.parent = this;
                item.index = index;
                item.render();
                this.items.push(item);
            });
            this.selector.select(this._id);
            //this.items.forEach(function (v, index, ar) {
            //    v.template(this._template);
            //    v.data(this._data);
            //    v.render();
            //});
            this.dispatch.rendered.call(this, dom);
            return this;
        };
        return listboxRender;
    }(render));
    ns.listboxRender = listboxRender;
    var tooltip = (function (_super) {
        __extends(tooltip, _super);
        function tooltip() {
            _super.call(this);
            this._speed = 300;
            this._deplay = 300;
            this.showed = false;
            this.rendered = false;
            this._offsetwidth = 15;
            this._offsetheight = 15;
            this._offsetX = 0;
            this._offsetY = 15;
            this.position = "leftright";
            this.__html = "<div id='" + this._id + "' style=\"display:none;line-height: 20px;text-align: center;border-radius: 5px;box-shadow: 1px 1px 2px rgba(1,1,1,1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px; position: absolute; left: -638px; top: -229.098px; font-family:Verdana\" class='ns-tooltip'><div class='ns-tooltip-contentbox'  style=\"text-align:center; \">{content}</div></div>";
            this.__arrow = "<span class='ns-tooltip-arrow' style='display:none; content: \"\";position: absolute;width: 0;height: 0;border-width: 10px;border-style: solid;border-color: #FFFF0F transparent transparent transparent;'></span>";
            this._container = null;
            this.arrow = null;
            this._bottom = true;
            this._horizontal = false;
            this.isrunning = false;
            this.aleft = true;
            this._fill = "";
            this._enableMove = true;
            this._disabledArrow = false;
            this.isrendered = false;
            this._startingEventName = "mouseover";
            this._endingEventName = "mouseout";
            this["__hide"] = this.hide;
            this["__show"] = this.show;
            this["__on"] = this.on;
            return this;
        }
        tooltip.prototype.pointerEvents = function () {
            this.selector.css({ "pointer-events": "none" });
        };
        tooltip.prototype.setCascadingDomObject = function (dom) {
            return this.selector = dom;
        };
        tooltip.prototype.getCascadingDomObject = function () {
            return this.selector;
        };
        tooltip.prototype.cascading = function (dom) {
            if (dom) {
                this.selector = ns.select(dom);
            }
            this.selector.on(this._startingEventName, function (e) {
                this.timerid = setTimeout(function () { this.isrunning = true; this.dispatch.showing.call(this, e); this.show(e); }, this._deplay);
            }).on(this._endingEventName, function () {
                this.showed ? this.hide() : window.clearTimeout(this.timerid);
                this.isrunning = false;
            });
            if (this._enableMove) {
                this.selector.on("mousemove", function (e) {
                    if (this.isrunning) {
                        this.show(e);
                    }
                });
            }
            return this;
        };
        tooltip.prototype.startingEventName = function () {
            if (arguments.length) {
                this._startingEventName = arguments[0];
                return this;
            }
            return this._startingEventName;
        };
        tooltip.prototype.endingEventName = function () {
            if (arguments.length) {
                this._endingEventName = arguments[0];
                return this;
            }
            return this._endingEventName;
        };
        tooltip.prototype.deplay = function () {
            if (arguments.length) {
                this._deplay = arguments[0];
                return this;
            }
            return this._deplay;
        };
        tooltip.prototype.speed = function () {
            if (arguments.length) {
                this._speed = arguments[0];
                return this;
            }
            return this._speed;
        };
        tooltip.prototype.fill = function () {
            if (arguments.length) {
                this._fill = arguments[0];
                return this;
            }
            return this._fill;
        };
        tooltip.prototype.disableArrow = function () {
            if (arguments.length) {
                this._disabledArrow = arguments[0];
                return this;
            }
            return this._disabledArrow;
        };
        tooltip.prototype.enableMouseMove = function () {
            if (arguments.length) {
                this._enableMove = !!arguments[0];
                return this;
            }
            return this._enableMove;
        };
        tooltip.prototype.offsetWidth = function () {
            if (arguments.length) {
                this._offsetwidth = arguments[0];
                return this;
            }
            return this._offsetwidth;
        };
        tooltip.prototype.offsetHeight = function () {
            if (arguments.length) {
                this._offsetheight = arguments[0];
                return this;
            }
            return this._offsetheight;
        };
        tooltip.prototype.offsetX = function () {
            if (arguments.length) {
                this._offsetX = arguments[0];
                return this;
            }
            return this._offsetX;
        };
        tooltip.prototype.offsetY = function () {
            if (arguments.length) {
                this._offsetY = arguments[0];
                return this;
            }
            return this._offsetY;
        };
        tooltip.prototype.horizontal = function () {
            if (arguments.length) {
                this._horizontal = arguments[0];
                return this;
            }
            return this._horizontal;
        };
        tooltip.prototype.render = function (dom) {
            var x = 1, y = 2;
            var c = this.selector.getBoundingRect(), w = c.width, h = c.height, w2 = w / 2, h2 = h / 2, xw = x - w2, yh = y - h - 20;
            this._bottom = true;
            this.aleft = true;
            if (xw - this._offsetwidth < 0) {
                xw = this._offsetwidth;
                this.aleft = false;
            }
            if (yh - this._offsetheight < 0) {
                yh = y + this._offsetheight;
                this._bottom = false;
            }
            if (this._disabledArrow) {
                this.arrow.hide(0);
            }
            if (this.dispatch.rendering.call(this, { rect: c, x: x, y: y }) !== true) {
                if (!this._horizontal) {
                    if (this._bottom) {
                        this.arrow.css({ "left": (x - xw - 10) + "px", "top": h + "px", "border-color": this._fill + " transparent transparent transparent" });
                        this.selector.css({ "left": xw + "px", "top": (yh - this._offsetY) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                    else {
                        this.arrow.css({ "left": (x - xw - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + this._fill + " transparent" });
                        this.selector.css({ "left": xw + "px", "top": (yh + this._offsetY) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                }
                else {
                    if (this.aleft) {
                        this.arrow.css({ "left": w + "px", "top": (h / 2 - this.arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": this._fill + " transparent transparent transparent" });
                        this.selector.css({ "left": (x - this.selector.getBoundingWidth() - this.arrow.getBoundingWidth() - this._offsetX) + "px", "top": (yh + h / 2 + 20) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                    else {
                        this.arrow.css({ "left": (0 - this.arrow.getBoundingWidth()) + "px", "top": "-20px", "border-color": "transparent transparent " + this._fill + " transparent" });
                        this.selector.css({ "left": (x + w + this._offsetX) + "px", "top": (yh + h / 2 + 20) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                }
            }
            this.isrendered = true;
            this.dispatch.render.call(this, { position: { bottom: this._bottom, left: this.aleft }, arrow: this.arrow, container: this });
            return this;
        };
        tooltip.prototype.content = function (content) {
            if (content) {
                this.selector.select(".ns-tooltip-contentbox").html(content);
                return this;
            }
            else
                return this.selector.select(".ns-tooltip-contentbox").html();
        };
        tooltip.prototype.__hide = function () { };
        tooltip.prototype.__show = function () { };
        tooltip.prototype.hide = function () {
            this.showed = false;
            window.clearTimeout(this.timerid);
            this.__hide.apply(this, [this._speed]);
            this.dispatch.hide.call(this, null);
        };
        tooltip.prototype.show = function (e) {
            var x = e.pageX || (e.clientX ? e.clientX + document.documentElement.scrollLeft : 0), y = e.pageY || (e.clientY ? e.clientY + document.documentElement.scrollTop : 0);
            if (!this._disabledArrow) {
                this.arrow.show(0);
            }
            this.__show.apply(this, [this._speed]);
            if (this._enableMove || (!this._enableMove && !this.isrendered))
                this.render(); //x, y
            this.showed = true;
            this.dispatch.show.call(this, null);
        };
        return tooltip;
    }(render));
    ns.tooltip = tooltip;
    var hoverip = (function (_super) {
        __extends(hoverip, _super);
        function hoverip(exp) {
            _super.call(this);
            this.__html = "<div id='" + this._id + "' style=\"display:none;line-height: 20px;text-align: center;border-radius: 5px;font-size: 14px;padding: 0px; position: absolute;\" class='ns-hovertip'></div>";
            this.__arrow = "<span class='ns-hovertip-arrow' style='display:none;position: absolute;width: 0;height: 0;border-width: 10px;border-style: solid;'></span>";
            this.showed = false;
            this.eventName = function (starting, ending) {
                if (starting) {
                    this._startingEventName = starting;
                }
                if (ending) {
                    this._endingEventName = ending;
                }
                return this;
            };
            this.deplayHide = function () {
                if (arguments.length) {
                    this.deplayHide = arguments[0];
                    return this;
                }
                return this.deplayHide;
            };
            this.isShow = function () { return this.showed; };
            this.stopHideAnimation = function () {
                this.animateTweens.hide.setPaused(true);
            };
            this["__hide"] = this.hide;
            this["__show"] = this.show;
            this["__on"] = this.on;
            if (exp) {
                this.selector = ns.select(exp);
                if (!/^#/.test(exp)) {
                    this.attr("id", this._id);
                }
            }
            else {
                this._container = ns.parseHtml(this.__html);
                this.arrow = ns.parseHtml(this.__arrow);
                ns.select(this._container).append(this.arrow);
                ns.select("body").append(this._container);
                this.selector.select(this._container);
            }
            this.arrow = this.select(".ns-hovertip-arrow");
            return this;
        }
        hoverip.prototype.cascading = function (dom) {
            if (dom) {
                this.selector = ns.select(dom);
            }
            if (this._startingEventName) {
                this.selector.on(this._startingEventName, function (e) {
                    if (this.deplayHideTimerid) {
                        window.clearTimeout(this.deplayHideTimerid);
                    }
                    this.timerid = setTimeout(function () { this.isrunning = true; this.dispatch.showing.call(this, e); this.show(e); }, this._deplay);
                });
            }
            if (this.endingEventName) {
                this.selector.on(this._endingEventName, function () {
                    if (this.deplayHide && this.showed) {
                        this.deplayHideTimerid = setTimeout(function () { this.deplayHideTimerid = 0; this.hide(); }, this.deplayHide);
                    }
                    else {
                        this.showed ? this.hide() : window.clearTimeout(this.timerid);
                    }
                    this.isrunning = false;
                });
            }
            return this;
        };
        hoverip.prototype.render = function (args) {
            var c = this.selector.getBoundingRect(), y = c.top + (ns.scrollTop() || 0), x = c.left + (ns.scrollLeft() || 0), w = c.width, h = c.height;
            this._bottom = true;
            this.aleft = true;
            if (x - this.selector.getBoundingWidth() - this._offsetwidth - this._offsetX < 0) {
                this.aleft = false;
            }
            if (y - this._offsetheight - this.selector.getBoundingHeight() - this._offsetY < 0) {
                this._bottom = false;
            }
            if (this._disabledArrow) {
                this.select(".ns-hovertip-arrow").hide(0);
            }
            if (this.dispatch.rendering.call(this, { rect: c, x: x, y: y }) !== true) {
                if (/left|right/ig.test(this.position)) {
                    if (/^right$/i.test(this.position)) {
                        this.aleft = false;
                    }
                    if (this.aleft) {
                        this.arrow.css({ "left": (this.selector.getBoundingWidth()) + "px", "top": (h / 2 - this.arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": "transparent transparent transparent " + this._fill });
                        this.css({ "left": (x - this.selector.getBoundingWidth() - this.arrow.getBoundingWidth() - this._offsetX) + "px", "top": y + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                    else {
                        this.arrow.css({ "left": (0 - this.arrow.getBoundingWidth()) + "px", "top": (h / 2 - this.arrow.getBoundingHeight() / 2 - 2) + "px", "border-color": " transparent " + this._fill + " transparent transparent" });
                        this.css({ "left": (x + w + this._offsetX) + "px", "top": y + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                }
                else if (/^middle$/i) {
                    this.arrow.css({ display: "none" });
                    var items = this.select(".ns-item"), count = items.length + 1, itemHeight = items.getBoundingHeight();
                    y = y - Math.floor(count / 2) * itemHeight;
                    if (y < itemHeight) {
                        y = 0;
                    }
                    this.css({ "left": x + "px", "top": y + "px", "background-color": this._fill, "border-color": this._fill, opactiy: "1", width: this.selector.css("width") });
                    items.call(function () {
                        this.css({ height: c.height, width: c.width, margin: "0" });
                    });
                }
                else {
                    if (/^bottom$/i.test(this.position)) {
                        this._bottom = false;
                    }
                    if (this._bottom) {
                        this.arrow.css({ "left": (this.selector.getBoundingWidth() / 2 - 10) + "px", "top": this.selector.getBoundingHeight() + "px", "border-color": this._fill + " transparent transparent transparent" });
                        this.css({ "left": (x + this._offsetX) + "px", "top": (y - this._offsetY - this.selector.getBoundingHeight()) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                    else {
                        this.arrow.css({ "left": (this.selector.getBoundingWidth() / 2 - 10) + "px", "top": "-20px", "border-color": "transparent transparent " + this._fill + " transparent" });
                        this.css({ "left": (x + this._offsetX) + "px", "top": (y + h + this._offsetY) + "px", "background-color": this._fill, "border-color": this._fill });
                    }
                }
            }
            this.isrendered = true;
            this.dispatch.render.call(this, { arrow: { bottom: this._bottom, left: this.aleft }, arrowObject: this.arrow, container: this });
            return this;
        };
        hoverip.prototype.content = function (content) {
            if (content) {
                this.html(content);
                return this;
            }
            else
                return this.selector.html();
        };
        hoverip.prototype.show = function (e) {
            var x = e.pageX || (e.clientX ? e.clientX + document.documentElement.scrollLeft : 0), y = e.pageY || (e.clientY ? e.clientY + document.documentElement.scrollTop : 0);
            if (!this._disabledArrow) {
                this.arrow.show(0);
            }
            this["__show"].apply(this, [this.speed]);
            if (this._enableMove || (!this._enableMove && !this.isrendered))
                this.render({ x: x, y: y });
            this.showed = true;
            this.dispatch.show.call(this, null);
        };
        hoverip.prototype.hide = function () {
            this.showed = false;
            window.clearTimeout(this.timerid);
            this["__hide"].apply(this, [this.speed]);
            this.dispatch.hide.call(this, null);
        };
        hoverip.prototype.on = function (ename, fn) {
            if (ename in this.dispatch) {
                this.dispatch.on(ename, fn);
            }
            this["__on"].call(this, ename, fn);
            return this;
        };
        return hoverip;
    }(tooltip));
    ns.hoverip = hoverip;
    var popupdialog = (function (_super) {
        __extends(popupdialog, _super);
        function popupdialog() {
            _super.call(this);
            this._ = { position: ns.popup.position || "bottom", speed: 3000, delay: 2000, autoStartAnimation: true, disabledHover: false, offsetX: -1, mode: "popup", offsetY: -1, warningColor: "yellow", alertColor: "#60AC39", errorColor: "red" };
            this.v = {
                timerid: 0, __on: this.on, __show: this.show, __hide: this.hide, level: "alert", popdom: null,
                screenWidth: window.screen.width - 10, screenHeight: window.screen.height - 10, hiding: false, showtweens: null, hidetweens: null
            };
            this._html = "<div id='" + this._id + "' style=\"line-height: 20px;min-width:240px;min-height:30px;text-align: left;border-radius: 5px;box-shadow: 1px 1px 2px rgba(0,0,0,0.1);text-shadow: 1px 1px 1px rgba(0,0,0,0.1);font-size: 14px;padding: 10px; position: fixed; color:#000000; font-family:Verdana;\" class='ns-popup'><div class='ns-popup-contentbox'  style=\"\">{content}</div></div>";
            var me = this;
            this.v.popdom = ns.parseHtml(this._html);
            this.selector.select(this.v.popdom);
            this.selector.appendTo(ns.select("body"));
            this.dispatch.on("rendered", function () {
                this.on("mouseover", function () {
                    if (me._.disabledHover) {
                        return;
                    }
                    me.clearTick();
                    if (me.v.hiding) {
                        me.v.hidetweens.setPaused(true);
                        me.v.hidetweens = null;
                        me.show(300);
                    }
                    return me;
                }).on("mouseout", function () {
                    me.startTick();
                });
            });
        }
        popupdialog.prototype.render = function (args) {
            var x = args == null || args.x == null ? 0 : args.x, y = args == null || args.y == null ? 0 : args.y;
            if (x && x !== 0) {
                this._.offsetX = x;
            }
            if (y && y !== 0) {
                this._.offsetY = y;
            }
            if (this._.mode == "popup") {
                var ox = this._.offsetX === -1 || typeof this._.offsetX === "string" ? 10 : this._.offsetX, oy = this._.offsetY === -1 || typeof this._.offsetY === "string" ? 10 : this._.offsetY;
                if (this._.position == "top") {
                    this.css({ "top": ns.popup.top + (ns.popup.top <= 10 ? 0 : oy) + "px", right: ox + "px" });
                    ns.popup.top += this.selector.first().getBoundingHeight() + (ns.popup.top <= 10 ? 0 : oy);
                }
                else {
                    this.css({ bottom: ns.popup.bottom + (ns.popup.bottom <= 10 ? 0 : oy) + "px", right: ox + "px" });
                    ns.popup.bottom += this.selector.first().getBoundingHeight() + (ns.popup.bottom <= 10 ? 0 : oy);
                }
            }
            else {
                var ox = this._.offsetX === -1 || typeof this._.offsetX === "string" ? this.v.screenWidth / 2 - 30 : this._.offsetX + 10, oy = this._.offsetY === -1 || typeof this._.offsetY === "string" ? this.v.screenHeight / 2 - 40 : this._.offsetY + 10;
                this.css({ "top": (oy) + "px", left: (ox) + "px" });
            }
            this.show(this._.speed);
            return this._.autoStartAnimation ? this.startTick() : this;
        };
        popupdialog.prototype.show = function (speed, callback) {
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
            this.selector.each(function () {
                var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
                nss.css("display", Ns.CSS.getDisplayType(nss.node()));
                this.v.showtweens = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 1 }, speed).call(function () {
                    //delete nss.eq(0).tweenanimate;
                    this.v.showtweens = null;
                    ns.popup.popupitems[this.id] = { position: this._.position, popup: this };
                    successback.call(nss, null);
                });
            });
        };
        popupdialog.prototype.hide = function (speed, callback) {
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
            this.selector.each(function () {
                var nss = ns.select(this), start = parseFloat(nss.css("opacity"));
                this.v.hidetweens = ns.tween().initialize({ opacity: start }, callback, { dom: nss }).to({ opacity: 0 }, speed).call(function () {
                    nss.css("display", "none");
                    this.v.hiding = false;
                    this.v.hidetweens = null;
                    delete ns.popup.popupitems[this.id];
                    if (this._.position === "top") {
                        var ntop = parseFloat(nss.css("top"));
                        if (ns.popup.top > ntop) {
                            ns.popup.top = ntop - this._.offsetY;
                        }
                    }
                    else {
                        var nbottom = parseFloat(nss.css("bottom"));
                        if (ns.popup.bottom > nbottom) {
                            ns.popup.bottom = nbottom - this._.offsetY;
                        }
                    }
                    successback.call(nss, null);
                });
            });
            return this;
        };
        popupdialog.prototype.startTick = function (delay) {
            var me = this;
            this.v.timerid = window.setTimeout(function () {
                me.v.hiding = true;
                me.hide(me._.speed);
            }, delay || me._.delay);
            return this;
        };
        popupdialog.prototype.clearTick = function () {
            if (this.v.timerid) {
                window.clearTimeout(this.v.timerid);
            }
            return this;
        };
        popupdialog.prototype.content = function (content) {
            if (content) {
                this.select(".ns-popup-contentbox").html(content);
                return this;
            }
            else
                return this.select(".ns-popup-contentbox").html();
        };
        popupdialog.prototype.alert = function (msg, css) { this.content(msg).css({ "background-color": this._.alertColor }).render().css(css); return this; };
        popupdialog.prototype.warning = function (msg, css) { this.content(msg).css({ "background-color": this._.warningColor }).render().css(css); return this; };
        popupdialog.prototype.error = function (msg, css) { this.content(msg).css({ "background-color": this._.errorColor }).render().css(css); return this; };
        popupdialog.prototype.msg = function (msg, css) { this.content(msg).render().css(css); return this; };
        popupdialog.prototype.stopAnimate = function () {
            var v;
            if (v.hiding || v.hidetweens) {
                v.hidetweens.setPaused(true);
            }
            if (v.showtweens) {
                v.showtweens.setPaused(true);
            }
            return this;
        };
        popupdialog.popupitems = [];
        popupdialog.top = 0;
        popupdialog.bottom = 0;
        popupdialog.left = 0;
        popupdialog.right = 0;
        popupdialog.position = "bottom";
        return popupdialog;
    }(render));
    ns.popupdialog = popupdialog;
    var dialoga = (function (_super) {
        __extends(dialoga, _super);
        function dialoga() {
            _super.call(this);
            this._OUTTERHTML = '<div id="{id}" style="z-index:99;position:fixed;background-color:#ffffff;border:1px solid #c8c8c8;width:840px;left:400px;top:100px;display:none;max-height:860px;">< div class="menu-bar" style = "height: 30px; background-color: rgb(0, 122, 204); " >'
                + '<div style = "float:left;" ><h3 id="{id}-title" style = "color:white;line-height:30px;margin:0px;padding-left:5px;" > Popup dialog </h3 ></div><div style = "float:right" ><div class="" id="{id}-close" class="menu-close" style = "cursor:pointer;width:60px;height:30px;line-height:30px;"> [Close] </div></div><div style = "clear:both;" ></div></div >'
                + '<div class="content" id="{id}-content" style = "width:820px;margin:30px auto;" ></div></div>';
            this._HTML = "";
            this.isrendered = false;
            this._OUTTERHTML = this._OUTTERHTML.replace(/\{id\}/ig, this._id);
        }
        dialoga.prototype.render = function (args) {
            this.dispatch.rendering.call(this, args);
            this.selector = ns.select(ns.parseHtml(this._OUTTERHTML)).appendTo(ns.select("body"));
            this._attrs.forEach(function (d, v) {
                this.selector.attr(d, v);
            });
            if (this._css.size > 0) {
                this.selector.css(this._css.entity);
            }
            this.dispatch.constructingAttr.call(this, self, args);
            this.contentView.render(this.selector);
            this.dispatch.constructingChildren.call(this, args, this.contentView);
            this.dispatch.rendered.call(this, args);
            this.isrendered = true;
            this.drag(this.selector, this.selector.select(".menu-bar"));
            var me = this;
            this.select(".menu-close").on("click", function () {
                me.hide();
            });
            return this;
        };
        dialoga.prototype.title = function (title) {
            if (title) {
                this.selector.select("#" + this._id + "-title").html(title);
                return this;
            }
            return this.selector.select("#" + this._id + "-title").html();
        };
        dialoga.prototype.emptyContent = function () {
            this.selector.select("#" + this._id + "-content").html("");
            return this;
        };
        dialoga.prototype.view = function (view) {
            if (view) {
                this.contentView = view;
                if (this.isrendered) {
                    this.emptyContent();
                    this.contentView.render(this.selector);
                }
                return this;
            }
            return this.contentView;
        };
        return dialoga;
    }(render));
    ns.dialoga = dialoga;
})(ns || (ns = {}));
//# sourceMappingURL=app.js.map