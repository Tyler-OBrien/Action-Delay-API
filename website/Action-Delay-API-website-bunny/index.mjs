var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/.pnpm/preact@10.29.2/node_modules/preact/dist/preact.mjs
function m(n3, l4) {
  for (var u5 in l4) n3[u5] = l4[u5];
  return n3;
}
function b(n3) {
  n3 && n3.parentNode && n3.parentNode.removeChild(n3);
}
function k(l4, u5, t4) {
  var i5, r4, o4, e4 = {};
  for (o4 in u5) "key" == o4 ? i5 = u5[o4] : "ref" == o4 ? r4 = u5[o4] : e4[o4] = u5[o4];
  if (arguments.length > 2 && (e4.children = arguments.length > 3 ? n.call(arguments, 2) : t4), "function" == typeof l4 && null != l4.defaultProps) for (o4 in l4.defaultProps) void 0 === e4[o4] && (e4[o4] = l4.defaultProps[o4]);
  return x(l4, e4, i5, r4, null);
}
function x(n3, t4, i5, r4, o4) {
  var e4 = { type: n3, props: t4, key: i5, ref: r4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o4 ? ++u : o4, __i: -1, __u: 0 };
  return null == o4 && null != l.vnode && l.vnode(e4), e4;
}
function S(n3) {
  return n3.children;
}
function C(n3, l4) {
  this.props = n3, this.context = l4;
}
function $(n3, l4) {
  if (null == l4) return n3.__ ? $(n3.__, n3.__i + 1) : null;
  for (var u5; l4 < n3.__k.length; l4++) if (null != (u5 = n3.__k[l4]) && null != u5.__e) return u5.__e;
  return "function" == typeof n3.type ? $(n3) : null;
}
function I(n3) {
  if (n3.__P && n3.__d) {
    var u5 = n3.__v, t4 = u5.__e, i5 = [], r4 = [], o4 = m({}, u5);
    o4.__v = u5.__v + 1, l.vnode && l.vnode(o4), q(n3.__P, o4, u5, n3.__n, n3.__P.namespaceURI, 32 & u5.__u ? [t4] : null, i5, null == t4 ? $(u5) : t4, !!(32 & u5.__u), r4), o4.__v = u5.__v, o4.__.__k[o4.__i] = o4, D(i5, o4, r4), u5.__e = u5.__ = null, o4.__e != t4 && P(o4);
  }
}
function P(n3) {
  if (null != (n3 = n3.__) && null != n3.__c) return n3.__e = n3.__c.base = null, n3.__k.some(function(l4) {
    if (null != l4 && null != l4.__e) return n3.__e = n3.__c.base = l4.__e;
  }), P(n3);
}
function A(n3) {
  (!n3.__d && (n3.__d = true) && i.push(n3) && !H.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)(H);
}
function H() {
  try {
    for (var n3, l4 = 1; i.length; ) i.length > l4 && i.sort(e), n3 = i.shift(), l4 = i.length, I(n3);
  } finally {
    i.length = H.__r = 0;
  }
}
function L(n3, l4, u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s4, h4, p4, v4, y4, _4, g5, m4 = t4 && t4.__k || w, b3 = l4.length;
  for (f5 = T(u5, l4, m4, f5, b3), s4 = 0; s4 < b3; s4++) null != (p4 = u5.__k[s4]) && (h4 = -1 != p4.__i && m4[p4.__i] || d, p4.__i = s4, _4 = q(n3, p4, h4, i5, r4, o4, e4, f5, c4, a4), v4 = p4.__e, p4.ref && h4.ref != p4.ref && (h4.ref && J(h4.ref, null, p4), a4.push(p4.ref, p4.__c || v4, p4)), null == y4 && null != v4 && (y4 = v4), (g5 = !!(4 & p4.__u)) || h4.__k === p4.__k ? (f5 = j(p4, f5, n3, g5), g5 && h4.__e && (h4.__e = null)) : "function" == typeof p4.type && void 0 !== _4 ? f5 = _4 : v4 && (f5 = v4.nextSibling), p4.__u &= -7);
  return u5.__e = y4, f5;
}
function T(n3, l4, u5, t4, i5) {
  var r4, o4, e4, f5, c4, a4 = u5.length, s4 = a4, h4 = 0;
  for (n3.__k = new Array(i5), r4 = 0; r4 < i5; r4++) null != (o4 = l4[r4]) && "boolean" != typeof o4 && "function" != typeof o4 ? ("string" == typeof o4 || "number" == typeof o4 || "bigint" == typeof o4 || o4.constructor == String ? o4 = n3.__k[r4] = x(null, o4, null, null, null) : g(o4) ? o4 = n3.__k[r4] = x(S, { children: o4 }, null, null, null) : void 0 === o4.constructor && o4.__b > 0 ? o4 = n3.__k[r4] = x(o4.type, o4.props, o4.key, o4.ref ? o4.ref : null, o4.__v) : n3.__k[r4] = o4, f5 = r4 + h4, o4.__ = n3, o4.__b = n3.__b + 1, e4 = null, -1 != (c4 = o4.__i = O(o4, u5, f5, s4)) && (s4--, (e4 = u5[c4]) && (e4.__u |= 2)), null == e4 || null == e4.__v ? (-1 == c4 && (i5 > a4 ? h4-- : i5 < a4 && h4++), "function" != typeof o4.type && (o4.__u |= 4)) : c4 != f5 && (c4 == f5 - 1 ? h4-- : c4 == f5 + 1 ? h4++ : (c4 > f5 ? h4-- : h4++, o4.__u |= 4))) : n3.__k[r4] = null;
  if (s4) for (r4 = 0; r4 < a4; r4++) null != (e4 = u5[r4]) && 0 == (2 & e4.__u) && (e4.__e == t4 && (t4 = $(e4)), K(e4, e4));
  return t4;
}
function j(n3, l4, u5, t4) {
  var i5, r4;
  if ("function" == typeof n3.type) {
    for (i5 = n3.__k, r4 = 0; i5 && r4 < i5.length; r4++) i5[r4] && (i5[r4].__ = n3, l4 = j(i5[r4], l4, u5, t4));
    return l4;
  }
  n3.__e != l4 && (t4 && (l4 && n3.type && !l4.parentNode && (l4 = $(n3)), u5.insertBefore(n3.__e, l4 || null)), l4 = n3.__e);
  do {
    l4 = l4 && l4.nextSibling;
  } while (null != l4 && 8 == l4.nodeType);
  return l4;
}
function F(n3, l4) {
  return l4 = l4 || [], null == n3 || "boolean" == typeof n3 || (g(n3) ? n3.some(function(n4) {
    F(n4, l4);
  }) : l4.push(n3)), l4;
}
function O(n3, l4, u5, t4) {
  var i5, r4, o4, e4 = n3.key, f5 = n3.type, c4 = l4[u5], a4 = null != c4 && 0 == (2 & c4.__u);
  if (null === c4 && null == e4 || a4 && e4 == c4.key && f5 == c4.type) return u5;
  if (t4 > (a4 ? 1 : 0)) {
    for (i5 = u5 - 1, r4 = u5 + 1; i5 >= 0 || r4 < l4.length; ) if (null != (c4 = l4[o4 = i5 >= 0 ? i5-- : r4++]) && 0 == (2 & c4.__u) && e4 == c4.key && f5 == c4.type) return o4;
  }
  return -1;
}
function z(n3, l4, u5) {
  "-" == l4[0] ? n3.setProperty(l4, null == u5 ? "" : u5) : n3[l4] = null == u5 ? "" : "number" != typeof u5 || _.test(l4) ? u5 : u5 + "px";
}
function N(n3, l4, u5, t4, i5) {
  var r4, o4;
  n: if ("style" == l4) if ("string" == typeof u5) n3.style.cssText = u5;
  else {
    if ("string" == typeof t4 && (n3.style.cssText = t4 = ""), t4) for (l4 in t4) u5 && l4 in u5 || z(n3.style, l4, "");
    if (u5) for (l4 in u5) t4 && u5[l4] == t4[l4] || z(n3.style, l4, u5[l4]);
  }
  else if ("o" == l4[0] && "n" == l4[1]) r4 = l4 != (l4 = l4.replace(s, "$1")), o4 = l4.toLowerCase(), l4 = o4 in n3 || "onFocusOut" == l4 || "onFocusIn" == l4 ? o4.slice(2) : l4.slice(2), n3.l || (n3.l = {}), n3.l[l4 + r4] = u5, u5 ? t4 ? u5[a] = t4[a] : (u5[a] = h, n3.addEventListener(l4, r4 ? v : p, r4)) : n3.removeEventListener(l4, r4 ? v : p, r4);
  else {
    if ("http://www.w3.org/2000/svg" == i5) l4 = l4.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l4 && "height" != l4 && "href" != l4 && "list" != l4 && "form" != l4 && "tabIndex" != l4 && "download" != l4 && "rowSpan" != l4 && "colSpan" != l4 && "role" != l4 && "popover" != l4 && l4 in n3) try {
      n3[l4] = null == u5 ? "" : u5;
      break n;
    } catch (n4) {
    }
    "function" == typeof u5 || (null == u5 || false === u5 && "-" != l4[4] ? n3.removeAttribute(l4) : n3.setAttribute(l4, "popover" == l4 && 1 == u5 ? "" : u5));
  }
}
function V(n3) {
  return function(u5) {
    if (this.l) {
      var t4 = this.l[u5.type + n3];
      if (null == u5[c]) u5[c] = h++;
      else if (u5[c] < t4[a]) return;
      return t4(l.event ? l.event(u5) : u5);
    }
  };
}
function q(n3, u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s4, h4, p4, v4, y4, d4, _4, k4, x4, M4, $3, I2, P5, A5, H5, T5 = u5.type;
  if (void 0 !== u5.constructor) return null;
  128 & t4.__u && (c4 = !!(32 & t4.__u), o4 = [f5 = u5.__e = t4.__e]), (s4 = l.__b) && s4(u5);
  n: if ("function" == typeof T5) try {
    if (k4 = u5.props, x4 = T5.prototype && T5.prototype.render, M4 = (s4 = T5.contextType) && i5[s4.__c], $3 = s4 ? M4 ? M4.props.value : s4.__ : i5, t4.__c ? _4 = (h4 = u5.__c = t4.__c).__ = h4.__E : (x4 ? u5.__c = h4 = new T5(k4, $3) : (u5.__c = h4 = new C(k4, $3), h4.constructor = T5, h4.render = Q), M4 && M4.sub(h4), h4.state || (h4.state = {}), h4.__n = i5, p4 = h4.__d = true, h4.__h = [], h4._sb = []), x4 && null == h4.__s && (h4.__s = h4.state), x4 && null != T5.getDerivedStateFromProps && (h4.__s == h4.state && (h4.__s = m({}, h4.__s)), m(h4.__s, T5.getDerivedStateFromProps(k4, h4.__s))), v4 = h4.props, y4 = h4.state, h4.__v = u5, p4) x4 && null == T5.getDerivedStateFromProps && null != h4.componentWillMount && h4.componentWillMount(), x4 && null != h4.componentDidMount && h4.__h.push(h4.componentDidMount);
    else {
      if (x4 && null == T5.getDerivedStateFromProps && k4 !== v4 && null != h4.componentWillReceiveProps && h4.componentWillReceiveProps(k4, $3), u5.__v == t4.__v || !h4.__e && null != h4.shouldComponentUpdate && false === h4.shouldComponentUpdate(k4, h4.__s, $3)) {
        u5.__v != t4.__v && (h4.props = k4, h4.state = h4.__s, h4.__d = false), u5.__e = t4.__e, u5.__k = t4.__k, u5.__k.some(function(n4) {
          n4 && (n4.__ = u5);
        }), w.push.apply(h4.__h, h4._sb), h4._sb = [], h4.__h.length && e4.push(h4);
        break n;
      }
      null != h4.componentWillUpdate && h4.componentWillUpdate(k4, h4.__s, $3), x4 && null != h4.componentDidUpdate && h4.__h.push(function() {
        h4.componentDidUpdate(v4, y4, d4);
      });
    }
    if (h4.context = $3, h4.props = k4, h4.__P = n3, h4.__e = false, I2 = l.__r, P5 = 0, x4) h4.state = h4.__s, h4.__d = false, I2 && I2(u5), s4 = h4.render(h4.props, h4.state, h4.context), w.push.apply(h4.__h, h4._sb), h4._sb = [];
    else do {
      h4.__d = false, I2 && I2(u5), s4 = h4.render(h4.props, h4.state, h4.context), h4.state = h4.__s;
    } while (h4.__d && ++P5 < 25);
    h4.state = h4.__s, null != h4.getChildContext && (i5 = m(m({}, i5), h4.getChildContext())), x4 && !p4 && null != h4.getSnapshotBeforeUpdate && (d4 = h4.getSnapshotBeforeUpdate(v4, y4)), A5 = null != s4 && s4.type === S && null == s4.key ? E(s4.props.children) : s4, f5 = L(n3, g(A5) ? A5 : [A5], u5, t4, i5, r4, o4, e4, f5, c4, a4), h4.base = u5.__e, u5.__u &= -161, h4.__h.length && e4.push(h4), _4 && (h4.__E = h4.__ = null);
  } catch (n4) {
    if (u5.__v = null, c4 || null != o4) if (n4.then) {
      for (u5.__u |= c4 ? 160 : 128; f5 && 8 == f5.nodeType && f5.nextSibling; ) f5 = f5.nextSibling;
      o4[o4.indexOf(f5)] = null, u5.__e = f5;
    } else {
      for (H5 = o4.length; H5--; ) b(o4[H5]);
      B(u5);
    }
    else u5.__e = t4.__e, u5.__k = t4.__k, n4.then || B(u5);
    l.__e(n4, u5, t4);
  }
  else null == o4 && u5.__v == t4.__v ? (u5.__k = t4.__k, u5.__e = t4.__e) : f5 = u5.__e = G(t4.__e, u5, t4, i5, r4, o4, e4, c4, a4);
  return (s4 = l.diffed) && s4(u5), 128 & u5.__u ? void 0 : f5;
}
function B(n3) {
  n3 && (n3.__c && (n3.__c.__e = true), n3.__k && n3.__k.some(B));
}
function D(n3, u5, t4) {
  for (var i5 = 0; i5 < t4.length; i5++) J(t4[i5], t4[++i5], t4[++i5]);
  l.__c && l.__c(u5, n3), n3.some(function(u6) {
    try {
      n3 = u6.__h, u6.__h = [], n3.some(function(n4) {
        n4.call(u6);
      });
    } catch (n4) {
      l.__e(n4, u6.__v);
    }
  });
}
function E(n3) {
  return "object" != typeof n3 || null == n3 || n3.__b > 0 ? n3 : g(n3) ? n3.map(E) : void 0 !== n3.constructor ? null : m({}, n3);
}
function G(u5, t4, i5, r4, o4, e4, f5, c4, a4) {
  var s4, h4, p4, v4, y4, w4, _4, m4 = i5.props || d, k4 = t4.props, x4 = t4.type;
  if ("svg" == x4 ? o4 = "http://www.w3.org/2000/svg" : "math" == x4 ? o4 = "http://www.w3.org/1998/Math/MathML" : o4 || (o4 = "http://www.w3.org/1999/xhtml"), null != e4) {
    for (s4 = 0; s4 < e4.length; s4++) if ((y4 = e4[s4]) && "setAttribute" in y4 == !!x4 && (x4 ? y4.localName == x4 : 3 == y4.nodeType)) {
      u5 = y4, e4[s4] = null;
      break;
    }
  }
  if (null == u5) {
    if (null == x4) return document.createTextNode(k4);
    u5 = document.createElementNS(o4, x4, k4.is && k4), c4 && (l.__m && l.__m(t4, e4), c4 = false), e4 = null;
  }
  if (null == x4) m4 === k4 || c4 && u5.data == k4 || (u5.data = k4);
  else {
    if (e4 = "textarea" == x4 && null != k4.defaultValue ? null : e4 && n.call(u5.childNodes), !c4 && null != e4) for (m4 = {}, s4 = 0; s4 < u5.attributes.length; s4++) m4[(y4 = u5.attributes[s4]).name] = y4.value;
    for (s4 in m4) y4 = m4[s4], "dangerouslySetInnerHTML" == s4 ? p4 = y4 : "children" == s4 || s4 in k4 || "value" == s4 && "defaultValue" in k4 || "checked" == s4 && "defaultChecked" in k4 || N(u5, s4, null, y4, o4);
    for (s4 in k4) y4 = k4[s4], "children" == s4 ? v4 = y4 : "dangerouslySetInnerHTML" == s4 ? h4 = y4 : "value" == s4 ? w4 = y4 : "checked" == s4 ? _4 = y4 : c4 && "function" != typeof y4 || m4[s4] === y4 || N(u5, s4, y4, m4[s4], o4);
    if (h4) c4 || p4 && (h4.__html == p4.__html || h4.__html == u5.innerHTML) || (u5.innerHTML = h4.__html), t4.__k = [];
    else if (p4 && (u5.innerHTML = ""), L("template" == t4.type ? u5.content : u5, g(v4) ? v4 : [v4], t4, i5, r4, "foreignObject" == x4 ? "http://www.w3.org/1999/xhtml" : o4, e4, f5, e4 ? e4[0] : i5.__k && $(i5, 0), c4, a4), null != e4) for (s4 = e4.length; s4--; ) b(e4[s4]);
    c4 && "textarea" != x4 || (s4 = "value", "progress" == x4 && null == w4 ? u5.removeAttribute("value") : null != w4 && (w4 !== u5[s4] || "progress" == x4 && !w4 || "option" == x4 && w4 != m4[s4]) && N(u5, s4, w4, m4[s4], o4), s4 = "checked", null != _4 && _4 != u5[s4] && N(u5, s4, _4, m4[s4], o4));
  }
  return u5;
}
function J(n3, u5, t4) {
  try {
    if ("function" == typeof n3) {
      var i5 = "function" == typeof n3.__u;
      i5 && n3.__u(), i5 && null == u5 || (n3.__u = n3(u5));
    } else n3.current = u5;
  } catch (n4) {
    l.__e(n4, t4);
  }
}
function K(n3, u5, t4) {
  var i5, r4;
  if (l.unmount && l.unmount(n3), (i5 = n3.ref) && (i5.current && i5.current != n3.__e || J(i5, null, u5)), null != (i5 = n3.__c)) {
    if (i5.componentWillUnmount) try {
      i5.componentWillUnmount();
    } catch (n4) {
      l.__e(n4, u5);
    }
    i5.base = i5.__P = null;
  }
  if (i5 = n3.__k) for (r4 = 0; r4 < i5.length; r4++) i5[r4] && K(i5[r4], u5, t4 || "function" != typeof n3.type);
  t4 || b(n3.__e), n3.__c = n3.__ = n3.__e = void 0;
}
function Q(n3, l4, u5) {
  return this.constructor(n3, u5);
}
var n, l, u, t, i, r, o, e, f, c, a, s, h, p, v, y, d, w, _, g;
var init_preact = __esm({
  "node_modules/.pnpm/preact@10.29.2/node_modules/preact/dist/preact.mjs"() {
    d = {};
    w = [];
    _ = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
    g = Array.isArray;
    n = w.slice, l = { __e: function(n3, l4, u5, t4) {
      for (var i5, r4, o4; l4 = l4.__; ) if ((i5 = l4.__c) && !i5.__) try {
        if ((r4 = i5.constructor) && null != r4.getDerivedStateFromError && (i5.setState(r4.getDerivedStateFromError(n3)), o4 = i5.__d), null != i5.componentDidCatch && (i5.componentDidCatch(n3, t4 || {}), o4 = i5.__d), o4) return i5.__E = i5;
      } catch (l5) {
        n3 = l5;
      }
      throw n3;
    } }, u = 0, t = function(n3) {
      return null != n3 && void 0 === n3.constructor;
    }, C.prototype.setState = function(n3, l4) {
      var u5;
      u5 = null != this.__s && this.__s != this.state ? this.__s : this.__s = m({}, this.state), "function" == typeof n3 && (n3 = n3(m({}, u5), this.props)), n3 && m(u5, n3), null != n3 && this.__v && (l4 && this._sb.push(l4), A(this));
    }, C.prototype.forceUpdate = function(n3) {
      this.__v && (this.__e = true, n3 && this.__h.push(n3), A(this));
    }, C.prototype.render = S, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n3, l4) {
      return n3.__v.__b - l4.__v.__b;
    }, H.__r = 0, f = Math.random().toString(8), c = "__d" + f, a = "__a" + f, s = /(PointerCapture)$|Capture$/i, h = 0, p = V(false), v = V(true), y = 0;
  }
});

// dist/server/chunks/astro-component_CvVWUJoH.mjs
function validateArgs(args) {
  if (args.length !== 3) return false;
  if (!args[0] || typeof args[0] !== "object") return false;
  return true;
}
function baseCreateComponent(cb, moduleId, propagation) {
  const name = moduleId?.split("/").pop()?.replace(".astro", "") ?? "";
  const fn = (...args) => {
    if (!validateArgs(args)) {
      throw new AstroError({
        ...InvalidComponentArgs,
        message: InvalidComponentArgs.message(name)
      });
    }
    return cb(...args);
  };
  Object.defineProperty(fn, "name", { value: name, writable: false });
  fn.isAstroComponentFactory = true;
  fn.moduleId = moduleId;
  fn.propagation = propagation;
  return fn;
}
function createComponentWithOptions(opts) {
  const cb = baseCreateComponent(opts.factory, opts.moduleId, opts.propagation);
  return cb;
}
function createComponent(arg1, moduleId, propagation) {
  if (typeof arg1 === "function") {
    return baseCreateComponent(arg1, moduleId, propagation);
  } else {
    return createComponentWithOptions(arg1);
  }
}
var init_astro_component_CvVWUJoH = __esm({
  "dist/server/chunks/astro-component_CvVWUJoH.mjs"() {
    "use strict";
    init_server_b5nfSfcf();
  }
});

// dist/server/chunks/noop_Cxbj09y6.mjs
var noop_Cxbj09y6_exports = {};
__export(noop_Cxbj09y6_exports, {
  default: () => noop_default
});
var noopService, noop_default;
var init_noop_Cxbj09y6 = __esm({
  "dist/server/chunks/noop_Cxbj09y6.mjs"() {
    "use strict";
    init_generic_CcUPKaZ4();
    noopService = {
      ...baseService,
      propertiesToHash: ["src"],
      async validateOptions(options) {
        if (isESMImportedImage(options.src) && options.src.format === "svg") {
          options.format = "svg";
        } else {
          delete options.format;
        }
        verifyOptions(options);
        return options;
      },
      async transform(inputBuffer, transformOptions) {
        return {
          data: inputBuffer,
          format: transformOptions.format
        };
      }
    };
    noop_default = noopService;
  }
});

// dist/server/chunks/generic_CcUPKaZ4.mjs
var generic_CcUPKaZ4_exports = {};
__export(generic_CcUPKaZ4_exports, {
  b: () => baseService,
  g: () => generic___js,
  i: () => isESMImportedImage,
  v: () => verifyOptions
});
function isESMImportedImage(src) {
  return typeof src === "object" || typeof src === "function" && "src" in src;
}
function isRemoteImage(src) {
  return typeof src === "string";
}
async function resolveSrc(src) {
  if (typeof src === "object" && "then" in src) {
    const resource = await src;
    return resource.default ?? resource;
  }
  return src;
}
function inferSourceFormat(src) {
  if (src.startsWith(DATA_PREFIX)) {
    const sepIndex = src.indexOf(";");
    const commaIndex = src.indexOf(",");
    const mimeEnd = sepIndex === -1 ? commaIndex : commaIndex === -1 ? sepIndex : Math.min(sepIndex, commaIndex);
    if (mimeEnd === -1) return void 0;
    const mime = src.slice(DATA_PREFIX.length, mimeEnd);
    if (mime === "image/svg+xml") return "svg";
    const sub = mime.split("/")[1];
    return sub || void 0;
  }
  try {
    const cleanSrc = removeQueryString(src).split("#")[0];
    const lastSlash = cleanSrc.lastIndexOf("/");
    const basename = lastSlash === -1 ? cleanSrc : cleanSrc.slice(lastSlash + 1);
    const lastDot = basename.lastIndexOf(".");
    if (lastDot === -1) return void 0;
    return basename.slice(lastDot + 1).toLowerCase();
  } catch {
    return void 0;
  }
}
function resolveDefaultOutputFormat(sourceFormat) {
  return sourceFormat === "svg" ? "svg" : DEFAULT_OUTPUT_FORMAT;
}
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < 4) return;
  const boxSize = readUInt32BE(input, offset);
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, currentOffset) {
  while (currentOffset < input.length) {
    const box = readBox(input, currentOffset);
    if (!box) break;
    if (box.name === boxName) return box;
    currentOffset += box.size > 0 ? box.size : 8;
  }
}
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
function detectType(input, start2, end) {
  let hasAvif = false;
  let hasHeic = false;
  let hasHeif = false;
  for (let i5 = start2; i5 <= end; i5 += 4) {
    const brand = toUTF8String(input, i5, i5 + 4);
    if (brand === "avif" || brand === "avis") hasAvif = true;
    else if (brand === "heic" || brand === "heix" || brand === "hevc" || brand === "hevx") hasHeic = true;
    else if (brand === "mif1" || brand === "msf1") hasHeif = true;
  }
  if (hasAvif) return "avif";
  if (hasHeic) return "heic";
  if (hasHeif) return "heif";
}
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start2 = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start2 + IDF_ENTRY_BYTES;
    if (start2 > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start2, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    partialStreams.push(
      input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size)
    );
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial of partialCodestreams) {
    codestream.set(partial, position);
    position += partial.length;
  }
  return codestream;
}
function parseLength(len) {
  const m4 = unitsReg.exec(len);
  if (!m4) {
    return void 0;
  }
  return Math.round(Number(m4[1]) * (units[m4[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = extractorRegExps.width.exec(root);
  const height = extractorRegExps.height.exec(root);
  const viewbox = extractorRegExps.viewbox.exec(root);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
function readIFD(input, { isBigEndian, isBigTiff }) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(readUInt64(input, offset, isBigEndian));
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Value too large");
      }
      return value;
    }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) {
    return input.slice(entrySize);
  }
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      const valueOffset = isBigTiff ? 12 : 8;
      tags[code] = readTagValue(temp, type, valueOffset, isBigEndian);
    }
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version2 = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version2 === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((imageType) => typeHandlers.get(imageType).validate(input));
}
function lookup$1(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}
async function imageMetadata(data, src) {
  let result;
  try {
    result = lookup$1(data);
  } catch {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  if (result.height == null || result.width == null || !result.type) {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
  const { width, height, type, orientation } = result;
  const isPortrait = (orientation || 0) >= 5;
  return {
    width: isPortrait ? height : width,
    height: isPortrait ? width : height,
    format: type,
    orientation
  };
}
async function fetchWithRedirects(options) {
  const {
    url,
    headers,
    imageConfig: imageConfig2,
    fetchFn = globalThis.fetch,
    redirectLimit = 10,
    onMaxRedirectsExceeded = (_u) => new Error("Maximum redirect depth exceeded"),
    onMissingLocationHeader = (_s, _u) => new Error(`Redirect response ${_s} missing Location header`),
    onDisallowedRedirect = (_current, _target) => new Error(
      `The image at ${_current} redirected to ${_target}, which is not an allowed remote location.`
    )
  } = options;
  if (redirectLimit <= 0) {
    throw onMaxRedirectsExceeded(typeof url === "string" ? url : url.toString());
  }
  const urlString = typeof url === "string" ? url : url.toString();
  const req = new Request(url, { headers });
  const res = await fetchFn(req, { redirect: "manual" });
  if ([301, 302, 303, 307, 308].includes(res.status)) {
    const location = res.headers.get("Location");
    if (!location) {
      throw onMissingLocationHeader(res.status, urlString);
    }
    const redirectUrl = new URL(location, urlString).toString();
    if (!isRemoteAllowed(redirectUrl, {
      domains: imageConfig2.domains ?? [],
      remotePatterns: imageConfig2.remotePatterns ?? []
    })) {
      throw onDisallowedRedirect(urlString, redirectUrl);
    }
    return fetchWithRedirects({
      url: redirectUrl,
      headers,
      imageConfig: imageConfig2,
      fetchFn,
      redirectLimit: redirectLimit - 1,
      onMaxRedirectsExceeded,
      onMissingLocationHeader,
      onDisallowedRedirect
    });
  }
  return res;
}
async function inferRemoteSize(url, imageConfig2) {
  if (!URL.canParse(url)) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  const allowlistConfig = imageConfig2 ? {
    domains: imageConfig2.domains ?? [],
    remotePatterns: imageConfig2.remotePatterns ?? []
  } : void 0;
  if (!allowlistConfig) {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      throw new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(url)
      });
    }
  }
  if (allowlistConfig && !isRemoteAllowed(url, allowlistConfig)) {
    throw new AstroError({
      ...RemoteImageNotAllowed,
      message: RemoteImageNotAllowed.message(url)
    });
  }
  let response;
  try {
    response = await fetchWithRedirects({
      url,
      onMaxRedirectsExceeded: (u5) => new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(u5)
      }),
      onMissingLocationHeader: (_status, u5) => new AstroError({
        ...FailedToFetchRemoteImageDimensions,
        message: FailedToFetchRemoteImageDimensions.message(u5)
      }),
      imageConfig: imageConfig2 ?? {
        remotePatterns: [],
        domains: []
      }
    });
  } catch (_err) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  if (allowlistConfig && !isRemoteAllowed(response.url, allowlistConfig)) {
    throw new AstroError({
      ...RemoteImageNotAllowed,
      message: RemoteImageNotAllowed.message(url)
    });
  }
  if (!response.body || !response.ok) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = await imageMetadata(accumulatedChunks, url);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch {
      }
    }
  }
  throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(url)
  });
}
function isLocalService(service) {
  if (!service) {
    return false;
  }
  return "transform" in service;
}
function verifyOptions(options) {
  if (!options.src || !isRemoteImage(options.src) && !isESMImportedImage(options.src)) {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        JSON.stringify(options.src),
        typeof options.src,
        JSON.stringify(options, (_4, v4) => v4 === void 0 ? null : v4)
      )
    });
  }
  if (!isESMImportedImage(options.src)) {
    if (options.src.startsWith("/@fs/") || !isRemotePath(options.src) && !options.src.startsWith("/")) {
      throw new AstroError({
        ...LocalImageUsedWrongly,
        message: LocalImageUsedWrongly.message(options.src)
      });
    }
    let missingDimension;
    if (!options.width && !options.height) {
      missingDimension = "both";
    } else if (!options.width && options.height) {
      missingDimension = "width";
    } else if (options.width && !options.height) {
      missingDimension = "height";
    }
    if (missingDimension) {
      throw new AstroError({
        ...MissingImageDimension,
        message: MissingImageDimension.message(missingDimension, options.src)
      });
    }
  } else {
    if (!VALID_SUPPORTED_FORMATS.includes(options.src.format)) {
      throw new AstroError({
        ...UnsupportedImageFormat,
        message: UnsupportedImageFormat.message(
          options.src.format,
          options.src.src,
          VALID_SUPPORTED_FORMATS
        )
      });
    }
    if (options.widths && options.densities) {
      throw new AstroError(IncompatibleDescriptorOptions);
    }
    if (options.src.format !== "svg" && options.format === "svg") {
      throw new AstroError(UnsupportedImageConversion);
    }
  }
}
function getTargetDimensions(options) {
  let targetWidth = options.width;
  let targetHeight = options.height;
  if (isESMImportedImage(options.src)) {
    const aspectRatio = options.src.width / options.src.height;
    if (targetHeight && !targetWidth) {
      targetWidth = Math.round(targetHeight * aspectRatio);
    } else if (targetWidth && !targetHeight) {
      targetHeight = Math.round(targetWidth / aspectRatio);
    } else if (!targetWidth && !targetHeight) {
      targetWidth = options.src.width;
      targetHeight = options.src.height;
    }
  }
  return {
    targetWidth,
    targetHeight
  };
}
function isImageMetadata(src) {
  return src.fsPath && !("fsPath" in src);
}
function createPlaceholderURL(pathOrUrl) {
  return new URL(pathOrUrl, PLACEHOLDER_BASE);
}
function stringifyPlaceholderURL(url) {
  return url.href.replace(PLACEHOLDER_BASE, "");
}
async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await Promise.resolve().then(() => (init_noop_Cxbj09y6(), noop_Cxbj09y6_exports)).catch((e4) => {
      const error2 = new AstroError(InvalidImageService);
      error2.cause = e4;
      throw error2;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig2) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  if (isImageMetadata(options)) {
    throw new AstroError(ExpectedNotESMImage);
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  let originalWidth;
  let originalHeight;
  if (resolvedOptions.inferSize) {
    delete resolvedOptions.inferSize;
    if (isRemoteImage(resolvedOptions.src) && isRemotePath(resolvedOptions.src)) {
      if (!isRemoteAllowed(resolvedOptions.src, imageConfig2)) {
        throw new AstroError({
          ...RemoteImageNotAllowed,
          message: RemoteImageNotAllowed.message(resolvedOptions.src)
        });
      }
      const getRemoteSize = (url) => service.getRemoteSize?.(url, imageConfig2) ?? inferRemoteSize(url, imageConfig2);
      const result = await getRemoteSize(resolvedOptions.src);
      resolvedOptions.width ??= result.width;
      resolvedOptions.height ??= result.height;
      if (result.format) {
        resolvedOptions.format ??= resolveDefaultOutputFormat(result.format);
      }
      originalWidth = result.width;
      originalHeight = result.height;
    }
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  if (isESMImportedImage(clonedSrc)) {
    originalWidth = clonedSrc.width;
    originalHeight = clonedSrc.height;
  }
  if (originalWidth && originalHeight) {
    const aspectRatio = originalWidth / originalHeight;
    if (resolvedOptions.height && !resolvedOptions.width) {
      resolvedOptions.width = Math.round(resolvedOptions.height * aspectRatio);
    } else if (resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.height = Math.round(resolvedOptions.width / aspectRatio);
    } else if (!resolvedOptions.width && !resolvedOptions.height) {
      resolvedOptions.width = originalWidth;
      resolvedOptions.height = originalHeight;
    }
  }
  resolvedOptions.src = clonedSrc;
  const layout = options.layout ?? imageConfig2.layout ?? "none";
  if (resolvedOptions.priority) {
    resolvedOptions.loading ??= "eager";
    resolvedOptions.decoding ??= "sync";
    resolvedOptions.fetchpriority ??= "high";
    delete resolvedOptions.priority;
  } else {
    resolvedOptions.loading ??= "lazy";
    resolvedOptions.decoding ??= "async";
    resolvedOptions.fetchpriority ??= void 0;
  }
  if (layout !== "none") {
    resolvedOptions.widths ||= getWidths({
      width: resolvedOptions.width,
      layout,
      originalWidth,
      breakpoints: imageConfig2.breakpoints?.length ? imageConfig2.breakpoints : isLocalService(service) ? LIMITED_RESOLUTIONS : DEFAULT_RESOLUTIONS
    });
    resolvedOptions.sizes ||= getSizesAttribute({ width: resolvedOptions.width, layout });
    delete resolvedOptions.densities;
    resolvedOptions["data-astro-image"] = layout;
    if (resolvedOptions.fit && cssFitValues.includes(resolvedOptions.fit)) {
      resolvedOptions["data-astro-image-fit"] = resolvedOptions.fit;
    }
    const currentPosition = resolvedOptions.position || "center";
    resolvedOptions["data-astro-image-pos"] = currentPosition.replace(/\s+/g, "-");
  }
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig2) : resolvedOptions;
  validatedOptions.format ??= await peekRemoteFormatForStaticEmit(
    validatedOptions,
    imageConfig2,
    service
  );
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig2) : [];
  const lazyImageURLFactory = (getValue) => {
    let cached = null;
    return () => cached ??= getValue();
  };
  const initialImageURL = await service.getURL(validatedOptions, imageConfig2);
  let lazyImageURL = lazyImageURLFactory(() => initialImageURL);
  const matchesValidatedTransform = (transform2) => transform2.width === validatedOptions.width && transform2.height === validatedOptions.height && transform2.format === validatedOptions.format;
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesValidatedTransform(srcSet.transform) ? initialImageURL : await service.getURL(srcSet.transform, imageConfig2),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    })
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && initialImageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    lazyImageURL = lazyImageURLFactory(
      () => globalThis.astroAsset.addStaticImage(validatedOptions, propsToHash, originalFilePath)
    );
    srcSets = srcSetTransforms.map((srcSet) => {
      return {
        transform: srcSet.transform,
        url: matchesValidatedTransform(srcSet.transform) ? lazyImageURL() : globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
        descriptor: srcSet.descriptor,
        attributes: srcSet.attributes
      };
    });
  } else if (imageConfig2.assetQueryParams) {
    const imageURLObj = createPlaceholderURL(initialImageURL);
    imageConfig2.assetQueryParams.forEach((value, key) => {
      imageURLObj.searchParams.set(key, value);
    });
    lazyImageURL = lazyImageURLFactory(() => stringifyPlaceholderURL(imageURLObj));
    srcSets = srcSets.map((srcSet) => {
      const urlObj = createPlaceholderURL(srcSet.url);
      imageConfig2.assetQueryParams.forEach((value, key) => {
        urlObj.searchParams.set(key, value);
      });
      return {
        ...srcSet,
        url: stringifyPlaceholderURL(urlObj)
      };
    });
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    get src() {
      return lazyImageURL();
    },
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig2) : {}
  };
}
async function peekRemoteFormatForStaticEmit(options, imageConfig2, service) {
  if (!isRemoteImage(options.src) || !isRemoteAllowed(options.src, imageConfig2) || !globalThis.astroAsset?.addStaticImage || !isLocalService(service) || !service.getRemoteSize) {
    return void 0;
  }
  try {
    const probed = await service.getRemoteSize(options.src, imageConfig2);
    return resolveDefaultOutputFormat(probed.format);
  } catch {
    return void 0;
  }
}
function lookup(extn) {
  let tmp = ("" + extn).trim().toLowerCase();
  let idx = tmp.lastIndexOf(".");
  return mimes[!~idx ? tmp : tmp.substring(++idx)];
}
function filterPreloads(data, preload) {
  if (!preload) {
    return null;
  }
  if (preload === true) {
    return data;
  }
  return data.filter(
    ({ weight, style, subset }) => preload.some((p4) => {
      if (p4.weight !== void 0 && weight !== void 0 && !checkWeight(p4.weight.toString(), weight)) {
        return false;
      }
      if (p4.style !== void 0 && p4.style !== style) {
        return false;
      }
      if (p4.subset !== void 0 && p4.subset !== subset) {
        return false;
      }
      return true;
    })
  );
}
function checkWeight(input, target) {
  const trimmedInput = input.trim();
  if (trimmedInput.includes(" ")) {
    return trimmedInput === target;
  }
  if (target.includes(" ")) {
    const [a4, b3] = target.split(" ");
    const parsedInput = Number.parseInt(input);
    return parsedInput >= Number.parseInt(a4) && parsedInput <= Number.parseInt(b3);
  }
  return input === target;
}
async function loadImage(src, headers, imageConfig2, isRemote, fetchFn) {
  try {
    const res = await fetchWithRedirects({ url: src, headers, imageConfig: imageConfig2, fetchFn });
    if (isRemote && !isRemoteAllowed(res.url, imageConfig2)) {
      return void 0;
    }
    if (!res.ok) {
      return void 0;
    }
    return await res.arrayBuffer();
  } catch {
    return void 0;
  }
}
var VALID_SUPPORTED_FORMATS, DEFAULT_OUTPUT_FORMAT, DEFAULT_HASH_PROPS, DEFAULT_RESOLUTIONS, LIMITED_RESOLUTIONS, getWidths, getSizesAttribute, DATA_PREFIX, decoder, toUTF8String, toHexString, getView, readInt16LE, readUInt16BE, readUInt16LE, readUInt24LE, readInt32LE, readUInt32BE, readUInt32LE, readUInt64, methods, BMP, TYPE_ICON, SIZE_HEADER$1, SIZE_IMAGE_ENTRY, ICO, TYPE_CURSOR, CUR, DDS, gifRegexp, GIF, brandMap, HEIF, SIZE_HEADER, FILE_LENGTH_OFFSET, ENTRY_LENGTH_OFFSET, ICON_TYPE_SIZE, ICNS, J2C, JP2, EXIF_MARKER, APP1_DATA_SIZE_BYTES, EXIF_HEADER_BYTES, TIFF_BYTE_ALIGN_BYTES, BIG_ENDIAN_BYTE_ALIGN, LITTLE_ENDIAN_BYTE_ALIGN, IDF_ENTRY_BYTES, NUM_DIRECTORY_ENTRIES_BYTES, JPG, BitReader, JXLStream, JXL, KTX, pngSignature, pngImageHeaderChunkName, pngFriedChunkName, PNG, PNMTypes, handlers, PNM, PSD, svgReg, extractorRegExps, INCH_CM, units, unitsReg, SVG, TGA, CONSTANTS, signatures, TIFF, WEBP, typeHandlers, types, firstBytes, sortNumeric, baseService, PLACEHOLDER_BASE, cssFitValues, $$Image, mimes, $$Picture, componentDataByCssVariable, $$Font, SsrRuntimeFontFileUrlResolver, assetQueryParams, imageConfig, getImage, fnv1a52, etag, GET, _page, page, generic___js;
var init_generic_CcUPKaZ4 = __esm({
  "dist/server/chunks/generic_CcUPKaZ4.mjs"() {
    "use strict";
    init_server_b5nfSfcf();
    init_astro_component_CvVWUJoH();
    VALID_SUPPORTED_FORMATS = [
      "jpeg",
      "jpg",
      "png",
      "tiff",
      "webp",
      "gif",
      "svg",
      "avif"
    ];
    DEFAULT_OUTPUT_FORMAT = "webp";
    DEFAULT_HASH_PROPS = [
      "src",
      "width",
      "height",
      "format",
      "quality",
      "fit",
      "position",
      "background"
    ];
    DEFAULT_RESOLUTIONS = [
      640,
      // older and lower-end phones
      750,
      // iPhone 6-8
      828,
      // iPhone XR/11
      960,
      // older horizontal phones
      1080,
      // iPhone 6-8 Plus
      1280,
      // 720p
      1668,
      // Various iPads
      1920,
      // 1080p
      2048,
      // QXGA
      2560,
      // WQXGA
      3200,
      // QHD+
      3840,
      // 4K
      4480,
      // 4.5K
      5120,
      // 5K
      6016
      // 6K
    ];
    LIMITED_RESOLUTIONS = [
      640,
      // older and lower-end phones
      750,
      // iPhone 6-8
      828,
      // iPhone XR/11
      1080,
      // iPhone 6-8 Plus
      1280,
      // 720p
      1668,
      // Various iPads
      2048,
      // QXGA
      2560
      // WQXGA
    ];
    getWidths = ({
      width,
      layout,
      breakpoints = DEFAULT_RESOLUTIONS,
      originalWidth
    }) => {
      const smallerThanOriginal = (w4) => !originalWidth || w4 <= originalWidth;
      if (layout === "full-width") {
        return breakpoints.filter(smallerThanOriginal);
      }
      if (!width) {
        return [];
      }
      const doubleWidth = width * 2;
      const maxSize = originalWidth ? Math.min(doubleWidth, originalWidth) : doubleWidth;
      if (layout === "fixed") {
        return originalWidth && width > originalWidth ? [originalWidth] : [width, maxSize];
      }
      if (layout === "constrained") {
        return [
          // Always include the image at 1x and 2x the specified width
          width,
          doubleWidth,
          ...breakpoints
        ].filter((w4) => w4 <= maxSize).sort((a4, b3) => a4 - b3);
      }
      return [];
    };
    getSizesAttribute = ({
      width,
      layout
    }) => {
      if (!width || !layout) {
        return void 0;
      }
      switch (layout) {
        // If screen is wider than the max size then image width is the max size,
        // otherwise it's the width of the screen
        case "constrained":
          return `(min-width: ${width}px) ${width}px, 100vw`;
        // Image is always the same width, whatever the size of the screen
        case "fixed":
          return `${width}px`;
        // Image is always the width of the screen
        case "full-width":
          return `100vw`;
        case "none":
        default:
          return void 0;
      }
    };
    DATA_PREFIX = "data:";
    decoder = new TextDecoder();
    toUTF8String = (input, start2 = 0, end = input.length) => decoder.decode(input.slice(start2, end));
    toHexString = (input, start2 = 0, end = input.length) => input.slice(start2, end).reduce((memo, i5) => memo + `0${i5.toString(16)}`.slice(-2), "");
    getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
    readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
    readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
    readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
    readUInt24LE = (input, offset = 0) => {
      const view = getView(input, offset);
      return view.getUint16(0, true) + (view.getUint8(2) << 16);
    };
    readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
    readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
    readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
    readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
    methods = {
      readUInt16BE,
      readUInt16LE,
      readUInt32BE,
      readUInt32LE
    };
    BMP = {
      validate: (input) => toUTF8String(input, 0, 2) === "BM",
      calculate: (input) => ({
        height: Math.abs(readInt32LE(input, 22)),
        width: readUInt32LE(input, 18)
      })
    };
    TYPE_ICON = 1;
    SIZE_HEADER$1 = 2 + 2 + 2;
    SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
    ICO = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        const imageType = readUInt16LE(input, 2);
        return imageType === TYPE_ICON;
      },
      calculate(input) {
        const nbImages = readUInt16LE(input, 4);
        const imageSize = getImageSize$1(input, 0);
        if (nbImages === 1) return imageSize;
        const images = [];
        for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
          images.push(getImageSize$1(input, imageIndex));
        }
        return {
          width: imageSize.width,
          height: imageSize.height,
          images
        };
      }
    };
    TYPE_CURSOR = 2;
    CUR = {
      validate(input) {
        const reserved = readUInt16LE(input, 0);
        const imageCount = readUInt16LE(input, 4);
        if (reserved !== 0 || imageCount === 0) return false;
        const imageType = readUInt16LE(input, 2);
        return imageType === TYPE_CURSOR;
      },
      calculate: (input) => ICO.calculate(input)
    };
    DDS = {
      validate: (input) => readUInt32LE(input, 0) === 542327876,
      calculate: (input) => ({
        height: readUInt32LE(input, 12),
        width: readUInt32LE(input, 16)
      })
    };
    gifRegexp = /^GIF8[79]a/;
    GIF = {
      validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
      calculate: (input) => ({
        height: readUInt16LE(input, 8),
        width: readUInt16LE(input, 6)
      })
    };
    brandMap = {
      avif: "avif",
      avis: "avif",
      // avif-sequence
      mif1: "heif",
      msf1: "heif",
      // heif-sequence
      heic: "heic",
      heix: "heic",
      hevc: "heic",
      // heic-sequence
      hevx: "heic"
      // heic-sequence
    };
    HEIF = {
      validate(input) {
        const boxType = toUTF8String(input, 4, 8);
        if (boxType !== "ftyp") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
        return brand in brandMap;
      },
      calculate(input) {
        const metaBox = findBox(input, "meta", 0);
        const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
        const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
        if (!ipcoBox) {
          throw new TypeError("Invalid HEIF, no ipco box found");
        }
        const type = detectType(input, 8, metaBox.offset);
        const images = [];
        let currentOffset = ipcoBox.offset + 8;
        while (currentOffset < ipcoBox.offset + ipcoBox.size) {
          const ispeBox = findBox(input, "ispe", currentOffset);
          if (!ispeBox) break;
          const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
          const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
          const clapBox = findBox(input, "clap", currentOffset);
          let width = rawWidth;
          let height = rawHeight;
          if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
            const cropRight = readUInt32BE(input, clapBox.offset + 12);
            width = rawWidth - cropRight;
          }
          images.push({ height, width });
          currentOffset = ispeBox.offset + ispeBox.size;
        }
        if (images.length === 0) {
          throw new TypeError("Invalid HEIF, no sizes found");
        }
        return {
          width: images[0].width,
          height: images[0].height,
          type,
          ...images.length > 1 ? { images } : {}
        };
      }
    };
    SIZE_HEADER = 4 + 4;
    FILE_LENGTH_OFFSET = 4;
    ENTRY_LENGTH_OFFSET = 4;
    ICON_TYPE_SIZE = {
      ICON: 32,
      "ICN#": 32,
      // m => 16 x 16
      "icm#": 16,
      icm4: 16,
      icm8: 16,
      // s => 16 x 16
      "ics#": 16,
      ics4: 16,
      ics8: 16,
      is32: 16,
      s8mk: 16,
      icp4: 16,
      // l => 32 x 32
      icl4: 32,
      icl8: 32,
      il32: 32,
      l8mk: 32,
      icp5: 32,
      ic11: 32,
      // h => 48 x 48
      ich4: 48,
      ich8: 48,
      ih32: 48,
      h8mk: 48,
      // . => 64 x 64
      icp6: 64,
      ic12: 32,
      // t => 128 x 128
      it32: 128,
      t8mk: 128,
      ic07: 128,
      // . => 256 x 256
      ic08: 256,
      ic13: 256,
      // . => 512 x 512
      ic09: 512,
      ic14: 512,
      // . => 1024 x 1024
      ic10: 1024
    };
    ICNS = {
      validate: (input) => toUTF8String(input, 0, 4) === "icns",
      calculate(input) {
        const inputLength = input.length;
        const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
        let imageOffset = SIZE_HEADER;
        const images = [];
        while (imageOffset < fileLength && imageOffset < inputLength) {
          const imageHeader = readImageHeader(input, imageOffset);
          const imageSize = getImageSize(imageHeader[0]);
          images.push(imageSize);
          imageOffset += imageHeader[1];
        }
        if (images.length === 0) {
          throw new TypeError("Invalid ICNS, no sizes found");
        }
        return {
          width: images[0].width,
          height: images[0].height,
          ...images.length > 1 ? { images } : {}
        };
      }
    };
    J2C = {
      // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
      validate: (input) => readUInt32BE(input, 0) === 4283432785,
      calculate: (input) => ({
        height: readUInt32BE(input, 12),
        width: readUInt32BE(input, 8)
      })
    };
    JP2 = {
      validate(input) {
        const boxType = toUTF8String(input, 4, 8);
        if (boxType !== "jP  ") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
        return brand === "jp2 ";
      },
      calculate(input) {
        const jp2hBox = findBox(input, "jp2h", 0);
        const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
        if (ihdrBox) {
          return {
            height: readUInt32BE(input, ihdrBox.offset + 8),
            width: readUInt32BE(input, ihdrBox.offset + 12)
          };
        }
        throw new TypeError("Unsupported JPEG 2000 format");
      }
    };
    EXIF_MARKER = "45786966";
    APP1_DATA_SIZE_BYTES = 2;
    EXIF_HEADER_BYTES = 6;
    TIFF_BYTE_ALIGN_BYTES = 2;
    BIG_ENDIAN_BYTE_ALIGN = "4d4d";
    LITTLE_ENDIAN_BYTE_ALIGN = "4949";
    IDF_ENTRY_BYTES = 12;
    NUM_DIRECTORY_ENTRIES_BYTES = 2;
    JPG = {
      validate: (input) => toHexString(input, 0, 2) === "ffd8",
      calculate(_input) {
        let input = _input.slice(4);
        let orientation;
        let next;
        while (input.length) {
          const i5 = readUInt16BE(input, 0);
          validateInput(input, i5);
          if (input[i5] !== 255) {
            input = input.slice(1);
            continue;
          }
          if (isEXIF(input)) {
            orientation = validateExifBlock(input, i5);
          }
          next = input[i5 + 1];
          if (next === 192 || next === 193 || next === 194) {
            const size = extractSize(input, i5 + 5);
            if (!orientation) {
              return size;
            }
            return {
              height: size.height,
              orientation,
              width: size.width
            };
          }
          input = input.slice(i5 + 2);
        }
        throw new TypeError("Invalid JPG, no size found");
      }
    };
    BitReader = class {
      // Skip the first 16 bits (2 bytes) of signature
      byteOffset = 2;
      bitOffset = 0;
      input;
      endianness;
      constructor(input, endianness) {
        this.input = input;
        this.endianness = endianness;
      }
      /** Reads a specified number of bits, and move the offset */
      getBits(length = 1) {
        let result = 0;
        let bitsRead = 0;
        while (bitsRead < length) {
          if (this.byteOffset >= this.input.length) {
            throw new Error("Reached end of input");
          }
          const currentByte = this.input[this.byteOffset];
          const bitsLeft = 8 - this.bitOffset;
          const bitsToRead = Math.min(length - bitsRead, bitsLeft);
          if (this.endianness === "little-endian") {
            const mask = (1 << bitsToRead) - 1;
            const bits = currentByte >> this.bitOffset & mask;
            result |= bits << bitsRead;
          } else {
            const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
            const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
            result = result << bitsToRead | bits;
          }
          bitsRead += bitsToRead;
          this.bitOffset += bitsToRead;
          if (this.bitOffset === 8) {
            this.byteOffset++;
            this.bitOffset = 0;
          }
        }
        return result;
      }
    };
    JXLStream = {
      validate: (input) => {
        return toHexString(input, 0, 2) === "ff0a";
      },
      calculate(input) {
        const reader = new BitReader(input, "little-endian");
        const isSmallImage = reader.getBits(1) === 1;
        const height = calculateImageDimension(reader, isSmallImage);
        const widthMode = reader.getBits(3);
        const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
        return { width, height };
      }
    };
    JXL = {
      validate: (input) => {
        const boxType = toUTF8String(input, 4, 8);
        if (boxType !== "JXL ") return false;
        const ftypBox = findBox(input, "ftyp", 0);
        if (!ftypBox) return false;
        const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
        return brand === "jxl ";
      },
      calculate(input) {
        const codestream = extractCodestream(input);
        if (codestream) return JXLStream.calculate(codestream);
        throw new Error("No codestream found in JXL container");
      }
    };
    KTX = {
      validate: (input) => {
        const signature = toUTF8String(input, 1, 7);
        return ["KTX 11", "KTX 20"].includes(signature);
      },
      calculate: (input) => {
        const type = input[5] === 49 ? "ktx" : "ktx2";
        const offset = type === "ktx" ? 36 : 20;
        return {
          height: readUInt32LE(input, offset + 4),
          width: readUInt32LE(input, offset),
          type
        };
      }
    };
    pngSignature = "PNG\r\n\n";
    pngImageHeaderChunkName = "IHDR";
    pngFriedChunkName = "CgBI";
    PNG = {
      validate(input) {
        if (pngSignature === toUTF8String(input, 1, 8)) {
          let chunkName = toUTF8String(input, 12, 16);
          if (chunkName === pngFriedChunkName) {
            chunkName = toUTF8String(input, 28, 32);
          }
          if (chunkName !== pngImageHeaderChunkName) {
            throw new TypeError("Invalid PNG");
          }
          return true;
        }
        return false;
      },
      calculate(input) {
        if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
          return {
            height: readUInt32BE(input, 36),
            width: readUInt32BE(input, 32)
          };
        }
        return {
          height: readUInt32BE(input, 20),
          width: readUInt32BE(input, 16)
        };
      }
    };
    PNMTypes = {
      P1: "pbm/ascii",
      P2: "pgm/ascii",
      P3: "ppm/ascii",
      P4: "pbm",
      P5: "pgm",
      P6: "ppm",
      P7: "pam",
      PF: "pfm"
    };
    handlers = {
      default: (lines) => {
        let dimensions = [];
        while (lines.length > 0) {
          const line = lines.shift();
          if (line[0] === "#") {
            continue;
          }
          dimensions = line.split(" ");
          break;
        }
        if (dimensions.length === 2) {
          return {
            height: Number.parseInt(dimensions[1], 10),
            width: Number.parseInt(dimensions[0], 10)
          };
        }
        throw new TypeError("Invalid PNM");
      },
      pam: (lines) => {
        const size = {};
        while (lines.length > 0) {
          const line = lines.shift();
          if (line.length > 16 || line.charCodeAt(0) > 128) {
            continue;
          }
          const [key, value] = line.split(" ");
          if (key && value) {
            size[key.toLowerCase()] = Number.parseInt(value, 10);
          }
          if (size.height && size.width) {
            break;
          }
        }
        if (size.height && size.width) {
          return {
            height: size.height,
            width: size.width
          };
        }
        throw new TypeError("Invalid PAM");
      }
    };
    PNM = {
      validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
      calculate(input) {
        const signature = toUTF8String(input, 0, 2);
        const type = PNMTypes[signature];
        const lines = toUTF8String(input, 3).split(/[\r\n]+/);
        const handler = handlers[type] || handlers.default;
        return handler(lines);
      }
    };
    PSD = {
      validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
      calculate: (input) => ({
        height: readUInt32BE(input, 14),
        width: readUInt32BE(input, 18)
      })
    };
    svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
    extractorRegExps = {
      height: /\sheight=(['"])([^%]+?)\1/,
      root: svgReg,
      viewbox: /\sviewBox=(['"])(.+?)\1/i,
      width: /\swidth=(['"])([^%]+?)\1/
    };
    INCH_CM = 2.54;
    units = {
      in: 96,
      cm: 96 / INCH_CM,
      em: 16,
      ex: 8,
      m: 96 / INCH_CM * 100,
      mm: 96 / INCH_CM / 10,
      pc: 96 / 72 / 12,
      pt: 96 / 72,
      px: 1
    };
    unitsReg = new RegExp(
      `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
    );
    SVG = {
      // Scan only the first kilo-byte to speed up the check on larger files
      validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
      calculate(input) {
        const root = extractorRegExps.root.exec(toUTF8String(input));
        if (root) {
          const attrs = parseAttributes(root[0]);
          if (attrs.width != null && attrs.height != null) {
            return calculateByDimensions(attrs);
          }
          if (attrs.viewbox) {
            return calculateByViewbox(attrs, attrs.viewbox);
          }
        }
        throw new TypeError("Invalid SVG");
      }
    };
    TGA = {
      validate(input) {
        return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
      },
      calculate(input) {
        return {
          height: readUInt16LE(input, 14),
          width: readUInt16LE(input, 12)
        };
      }
    };
    CONSTANTS = {
      TAG: {
        WIDTH: 256,
        HEIGHT: 257,
        COMPRESSION: 259
      },
      TYPE: {
        SHORT: 3,
        LONG: 4,
        LONG8: 16
      },
      ENTRY_SIZE: {
        STANDARD: 12,
        BIG: 20
      },
      COUNT_SIZE: {
        STANDARD: 2,
        BIG: 8
      }
    };
    signatures = /* @__PURE__ */ new Set([
      "49492a00",
      // Little Endian
      "4d4d002a",
      // Big Endian
      "49492b00",
      // BigTIFF Little Endian
      "4d4d002b"
      // BigTIFF Big Endian
    ]);
    TIFF = {
      validate: (input) => {
        const signature = toHexString(input, 0, 4);
        return signatures.has(signature);
      },
      calculate(input) {
        const format = determineFormat(input);
        if (format.isBigTiff) {
          validateBigTIFFHeader(input, format.isBigEndian);
        }
        const ifdBuffer = readIFD(input, format);
        const tags = extractTags(ifdBuffer, format);
        const info2 = {
          height: tags[CONSTANTS.TAG.HEIGHT],
          width: tags[CONSTANTS.TAG.WIDTH],
          type: format.isBigTiff ? "bigtiff" : "tiff"
        };
        if (tags[CONSTANTS.TAG.COMPRESSION]) {
          info2.compression = tags[CONSTANTS.TAG.COMPRESSION];
        }
        if (!info2.width || !info2.height) {
          throw new TypeError("Invalid Tiff. Missing tags");
        }
        return info2;
      }
    };
    WEBP = {
      validate(input) {
        const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
        const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
        const vp8Header = "VP8" === toUTF8String(input, 12, 15);
        return riffHeader && webpHeader && vp8Header;
      },
      calculate(_input) {
        const chunkHeader = toUTF8String(_input, 12, 16);
        const input = _input.slice(20, 30);
        if (chunkHeader === "VP8X") {
          const extendedHeader = input[0];
          const validStart = (extendedHeader & 192) === 0;
          const validEnd = (extendedHeader & 1) === 0;
          if (validStart && validEnd) {
            return calculateExtended(input);
          }
          throw new TypeError("Invalid WebP");
        }
        if (chunkHeader === "VP8 " && input[0] !== 47) {
          return calculateLossy(input);
        }
        const signature = toHexString(input, 3, 6);
        if (chunkHeader === "VP8L" && signature !== "9d012a") {
          return calculateLossless(input);
        }
        throw new TypeError("Invalid WebP");
      }
    };
    typeHandlers = /* @__PURE__ */ new Map([
      ["bmp", BMP],
      ["cur", CUR],
      ["dds", DDS],
      ["gif", GIF],
      ["heif", HEIF],
      ["icns", ICNS],
      ["ico", ICO],
      ["j2c", J2C],
      ["jp2", JP2],
      ["jpg", JPG],
      ["jxl", JXL],
      ["jxl-stream", JXLStream],
      ["ktx", KTX],
      ["png", PNG],
      ["pnm", PNM],
      ["psd", PSD],
      ["svg", SVG],
      ["tga", TGA],
      ["tiff", TIFF],
      ["webp", WEBP]
    ]);
    types = Array.from(typeHandlers.keys());
    firstBytes = /* @__PURE__ */ new Map([
      [0, "heif"],
      [56, "psd"],
      [66, "bmp"],
      [68, "dds"],
      [71, "gif"],
      [73, "tiff"],
      [77, "tiff"],
      [82, "webp"],
      [105, "icns"],
      [137, "png"],
      [255, "jpg"]
    ]);
    sortNumeric = (a4, b3) => a4 - b3;
    baseService = {
      propertiesToHash: DEFAULT_HASH_PROPS,
      validateOptions(options) {
        verifyOptions(options);
        if (!options.format) {
          if (isESMImportedImage(options.src)) {
            options.format = resolveDefaultOutputFormat(options.src.format);
          } else {
            const inferred = inferSourceFormat(options.src);
            if (inferred) options.format = resolveDefaultOutputFormat(inferred);
          }
        }
        if (options.width) options.width = Math.round(options.width);
        if (options.height) options.height = Math.round(options.height);
        if (options.layout) {
          delete options.layout;
        }
        if (options.fit === "none") {
          delete options.fit;
        }
        return options;
      },
      getHTMLAttributes(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const {
          src,
          width,
          height,
          format,
          quality,
          densities,
          widths,
          formats,
          layout,
          priority,
          fit,
          position,
          background,
          ...attributes
        } = options;
        return {
          ...attributes,
          width: targetWidth,
          height: targetHeight,
          loading: attributes.loading ?? "lazy",
          decoding: attributes.decoding ?? "async"
        };
      },
      getSrcSet(options) {
        const { targetWidth, targetHeight } = getTargetDimensions(options);
        const aspectRatio = targetWidth / targetHeight;
        const { widths, densities } = options;
        const targetFormat = options.format;
        let transformedWidths = (widths ?? []).sort(sortNumeric);
        let imageWidth = options.width;
        let maxWidth = Number.POSITIVE_INFINITY;
        if (isESMImportedImage(options.src)) {
          imageWidth = options.src.width;
          maxWidth = imageWidth;
          if (transformedWidths.length > 0 && transformedWidths.at(-1) > maxWidth) {
            transformedWidths = transformedWidths.filter((width) => width <= maxWidth);
            transformedWidths.push(maxWidth);
          }
        }
        transformedWidths = Array.from(new Set(transformedWidths));
        const {
          width: transformWidth,
          height: transformHeight,
          ...transformWithoutDimensions
        } = options;
        let allWidths = [];
        if (densities) {
          const densityValues = densities.map((density) => {
            if (typeof density === "number") {
              return density;
            } else {
              return Number.parseFloat(density);
            }
          });
          const densityWidths = densityValues.sort(sortNumeric).map((density) => Math.round(targetWidth * density));
          allWidths = densityWidths.map((width, index) => ({
            width,
            descriptor: `${densityValues[index]}x`
          }));
        } else if (transformedWidths.length > 0) {
          allWidths = transformedWidths.map((width) => ({
            width,
            descriptor: `${width}w`
          }));
        }
        return allWidths.map(({ width, descriptor }) => {
          const height = Math.round(width / aspectRatio);
          const transform2 = { ...transformWithoutDimensions, width, height };
          return {
            transform: transform2,
            descriptor,
            attributes: targetFormat ? { type: `image/${targetFormat}` } : {}
          };
        });
      },
      getURL(options, imageConfig2) {
        const searchParams = new URLSearchParams();
        if (isESMImportedImage(options.src)) {
          searchParams.append("href", options.src.src);
        } else if (isRemoteAllowed(options.src, imageConfig2)) {
          searchParams.append("href", options.src);
        } else {
          return options.src;
        }
        const params = {
          w: "width",
          h: "height",
          q: "quality",
          f: "format",
          fit: "fit",
          position: "position",
          background: "background"
        };
        Object.entries(params).forEach(([param, key]) => {
          options[key] && searchParams.append(param, options[key].toString());
        });
        const imageEndpoint = joinPaths("/", imageConfig2.endpoint.route);
        let url = `${imageEndpoint}?${searchParams}`;
        if (imageConfig2.assetQueryParams) {
          const assetQueryString = imageConfig2.assetQueryParams.toString();
          if (assetQueryString) {
            url += "&" + assetQueryString;
          }
        }
        return url;
      },
      parseURL(url) {
        const params = url.searchParams;
        if (!params.has("href")) {
          return void 0;
        }
        const transform2 = {
          src: params.get("href"),
          width: params.has("w") ? Number.parseInt(params.get("w")) : void 0,
          height: params.has("h") ? Number.parseInt(params.get("h")) : void 0,
          format: params.has("f") ? params.get("f") : void 0,
          quality: params.get("q"),
          fit: params.get("fit"),
          position: params.get("position") ?? void 0,
          background: params.get("background") ?? void 0
        };
        return transform2;
      },
      getRemoteSize(url, imageConfig2) {
        return inferRemoteSize(url, imageConfig2);
      }
    };
    PLACEHOLDER_BASE = "astro://placeholder";
    cssFitValues = ["fill", "contain", "cover", "scale-down"];
    Function.prototype.toString.call(Object);
    $$Image = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Image;
      const props = Astro2.props;
      if (props.alt === void 0 || props.alt === null) {
        throw new AstroError(ImageMissingAlt);
      }
      if (typeof props.width === "string") {
        props.width = Number.parseInt(props.width);
      }
      if (typeof props.height === "string") {
        props.height = Number.parseInt(props.height);
      }
      const layout = props.layout ?? imageConfig.layout ?? "none";
      if (layout !== "none") {
        props.layout ??= imageConfig.layout;
        props.fit ??= imageConfig.objectFit ?? "cover";
        props.position ??= imageConfig.objectPosition ?? "center";
      } else if (imageConfig.objectFit || imageConfig.objectPosition) {
        props.fit ??= imageConfig.objectFit;
        props.position ??= imageConfig.objectPosition;
      }
      const image = await getImage(props);
      const additionalAttributes = {};
      if (image.srcSet.values.length > 0) {
        additionalAttributes.srcset = image.srcSet.attribute;
      }
      const { class: className, ...attributes } = { ...additionalAttributes, ...image.attributes };
      return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/components/Image.astro", void 0);
    mimes = {
      "3g2": "video/3gpp2",
      "3gp": "video/3gpp",
      "3gpp": "video/3gpp",
      "3mf": "model/3mf",
      "aac": "audio/aac",
      "ac": "application/pkix-attr-cert",
      "adp": "audio/adpcm",
      "adts": "audio/aac",
      "ai": "application/postscript",
      "aml": "application/automationml-aml+xml",
      "amlx": "application/automationml-amlx+zip",
      "amr": "audio/amr",
      "apng": "image/apng",
      "appcache": "text/cache-manifest",
      "appinstaller": "application/appinstaller",
      "appx": "application/appx",
      "appxbundle": "application/appxbundle",
      "asc": "application/pgp-keys",
      "atom": "application/atom+xml",
      "atomcat": "application/atomcat+xml",
      "atomdeleted": "application/atomdeleted+xml",
      "atomsvc": "application/atomsvc+xml",
      "au": "audio/basic",
      "avci": "image/avci",
      "avcs": "image/avcs",
      "avif": "image/avif",
      "aw": "application/applixware",
      "bdoc": "application/bdoc",
      "bin": "application/octet-stream",
      "bmp": "image/bmp",
      "bpk": "application/octet-stream",
      "btf": "image/prs.btif",
      "btif": "image/prs.btif",
      "buffer": "application/octet-stream",
      "ccxml": "application/ccxml+xml",
      "cdfx": "application/cdfx+xml",
      "cdmia": "application/cdmi-capability",
      "cdmic": "application/cdmi-container",
      "cdmid": "application/cdmi-domain",
      "cdmio": "application/cdmi-object",
      "cdmiq": "application/cdmi-queue",
      "cer": "application/pkix-cert",
      "cgm": "image/cgm",
      "cjs": "application/node",
      "class": "application/java-vm",
      "coffee": "text/coffeescript",
      "conf": "text/plain",
      "cpl": "application/cpl+xml",
      "cpt": "application/mac-compactpro",
      "crl": "application/pkix-crl",
      "css": "text/css",
      "csv": "text/csv",
      "cu": "application/cu-seeme",
      "cwl": "application/cwl",
      "cww": "application/prs.cww",
      "davmount": "application/davmount+xml",
      "dbk": "application/docbook+xml",
      "deb": "application/octet-stream",
      "def": "text/plain",
      "deploy": "application/octet-stream",
      "dib": "image/bmp",
      "disposition-notification": "message/disposition-notification",
      "dist": "application/octet-stream",
      "distz": "application/octet-stream",
      "dll": "application/octet-stream",
      "dmg": "application/octet-stream",
      "dms": "application/octet-stream",
      "doc": "application/msword",
      "dot": "application/msword",
      "dpx": "image/dpx",
      "drle": "image/dicom-rle",
      "dsc": "text/prs.lines.tag",
      "dssc": "application/dssc+der",
      "dtd": "application/xml-dtd",
      "dump": "application/octet-stream",
      "dwd": "application/atsc-dwd+xml",
      "ear": "application/java-archive",
      "ecma": "application/ecmascript",
      "elc": "application/octet-stream",
      "emf": "image/emf",
      "eml": "message/rfc822",
      "emma": "application/emma+xml",
      "emotionml": "application/emotionml+xml",
      "eps": "application/postscript",
      "epub": "application/epub+zip",
      "exe": "application/octet-stream",
      "exi": "application/exi",
      "exp": "application/express",
      "exr": "image/aces",
      "ez": "application/andrew-inset",
      "fdf": "application/fdf",
      "fdt": "application/fdt+xml",
      "fits": "image/fits",
      "g3": "image/g3fax",
      "gbr": "application/rpki-ghostbusters",
      "geojson": "application/geo+json",
      "gif": "image/gif",
      "glb": "model/gltf-binary",
      "gltf": "model/gltf+json",
      "gml": "application/gml+xml",
      "gpx": "application/gpx+xml",
      "gram": "application/srgs",
      "grxml": "application/srgs+xml",
      "gxf": "application/gxf",
      "gz": "application/gzip",
      "h261": "video/h261",
      "h263": "video/h263",
      "h264": "video/h264",
      "heic": "image/heic",
      "heics": "image/heic-sequence",
      "heif": "image/heif",
      "heifs": "image/heif-sequence",
      "hej2": "image/hej2k",
      "held": "application/atsc-held+xml",
      "hjson": "application/hjson",
      "hlp": "application/winhlp",
      "hqx": "application/mac-binhex40",
      "hsj2": "image/hsj2",
      "htm": "text/html",
      "html": "text/html",
      "ics": "text/calendar",
      "ief": "image/ief",
      "ifb": "text/calendar",
      "iges": "model/iges",
      "igs": "model/iges",
      "img": "application/octet-stream",
      "in": "text/plain",
      "ini": "text/plain",
      "ink": "application/inkml+xml",
      "inkml": "application/inkml+xml",
      "ipfix": "application/ipfix",
      "iso": "application/octet-stream",
      "its": "application/its+xml",
      "jade": "text/jade",
      "jar": "application/java-archive",
      "jhc": "image/jphc",
      "jls": "image/jls",
      "jp2": "image/jp2",
      "jpe": "image/jpeg",
      "jpeg": "image/jpeg",
      "jpf": "image/jpx",
      "jpg": "image/jpeg",
      "jpg2": "image/jp2",
      "jpgm": "image/jpm",
      "jpgv": "video/jpeg",
      "jph": "image/jph",
      "jpm": "image/jpm",
      "jpx": "image/jpx",
      "js": "text/javascript",
      "json": "application/json",
      "json5": "application/json5",
      "jsonld": "application/ld+json",
      "jsonml": "application/jsonml+json",
      "jsx": "text/jsx",
      "jt": "model/jt",
      "jxl": "image/jxl",
      "jxr": "image/jxr",
      "jxra": "image/jxra",
      "jxrs": "image/jxrs",
      "jxs": "image/jxs",
      "jxsc": "image/jxsc",
      "jxsi": "image/jxsi",
      "jxss": "image/jxss",
      "kar": "audio/midi",
      "ktx": "image/ktx",
      "ktx2": "image/ktx2",
      "less": "text/less",
      "lgr": "application/lgr+xml",
      "list": "text/plain",
      "litcoffee": "text/coffeescript",
      "log": "text/plain",
      "lostxml": "application/lost+xml",
      "lrf": "application/octet-stream",
      "m1v": "video/mpeg",
      "m21": "application/mp21",
      "m2a": "audio/mpeg",
      "m2t": "video/mp2t",
      "m2ts": "video/mp2t",
      "m2v": "video/mpeg",
      "m3a": "audio/mpeg",
      "m4a": "audio/mp4",
      "m4p": "application/mp4",
      "m4s": "video/iso.segment",
      "ma": "application/mathematica",
      "mads": "application/mads+xml",
      "maei": "application/mmt-aei+xml",
      "man": "text/troff",
      "manifest": "text/cache-manifest",
      "map": "application/json",
      "mar": "application/octet-stream",
      "markdown": "text/markdown",
      "mathml": "application/mathml+xml",
      "mb": "application/mathematica",
      "mbox": "application/mbox",
      "md": "text/markdown",
      "mdx": "text/mdx",
      "me": "text/troff",
      "mesh": "model/mesh",
      "meta4": "application/metalink4+xml",
      "metalink": "application/metalink+xml",
      "mets": "application/mets+xml",
      "mft": "application/rpki-manifest",
      "mid": "audio/midi",
      "midi": "audio/midi",
      "mime": "message/rfc822",
      "mj2": "video/mj2",
      "mjp2": "video/mj2",
      "mjs": "text/javascript",
      "mml": "text/mathml",
      "mods": "application/mods+xml",
      "mov": "video/quicktime",
      "mp2": "audio/mpeg",
      "mp21": "application/mp21",
      "mp2a": "audio/mpeg",
      "mp3": "audio/mpeg",
      "mp4": "video/mp4",
      "mp4a": "audio/mp4",
      "mp4s": "application/mp4",
      "mp4v": "video/mp4",
      "mpd": "application/dash+xml",
      "mpe": "video/mpeg",
      "mpeg": "video/mpeg",
      "mpf": "application/media-policy-dataset+xml",
      "mpg": "video/mpeg",
      "mpg4": "video/mp4",
      "mpga": "audio/mpeg",
      "mpp": "application/dash-patch+xml",
      "mrc": "application/marc",
      "mrcx": "application/marcxml+xml",
      "ms": "text/troff",
      "mscml": "application/mediaservercontrol+xml",
      "msh": "model/mesh",
      "msi": "application/octet-stream",
      "msix": "application/msix",
      "msixbundle": "application/msixbundle",
      "msm": "application/octet-stream",
      "msp": "application/octet-stream",
      "mtl": "model/mtl",
      "mts": "video/mp2t",
      "musd": "application/mmt-usd+xml",
      "mxf": "application/mxf",
      "mxmf": "audio/mobile-xmf",
      "mxml": "application/xv+xml",
      "n3": "text/n3",
      "nb": "application/mathematica",
      "nq": "application/n-quads",
      "nt": "application/n-triples",
      "obj": "model/obj",
      "oda": "application/oda",
      "oga": "audio/ogg",
      "ogg": "audio/ogg",
      "ogv": "video/ogg",
      "ogx": "application/ogg",
      "omdoc": "application/omdoc+xml",
      "onepkg": "application/onenote",
      "onetmp": "application/onenote",
      "onetoc": "application/onenote",
      "onetoc2": "application/onenote",
      "opf": "application/oebps-package+xml",
      "opus": "audio/ogg",
      "otf": "font/otf",
      "owl": "application/rdf+xml",
      "oxps": "application/oxps",
      "p10": "application/pkcs10",
      "p7c": "application/pkcs7-mime",
      "p7m": "application/pkcs7-mime",
      "p7s": "application/pkcs7-signature",
      "p8": "application/pkcs8",
      "pdf": "application/pdf",
      "pfr": "application/font-tdpfr",
      "pgp": "application/pgp-encrypted",
      "pkg": "application/octet-stream",
      "pki": "application/pkixcmp",
      "pkipath": "application/pkix-pkipath",
      "pls": "application/pls+xml",
      "png": "image/png",
      "prc": "model/prc",
      "prf": "application/pics-rules",
      "provx": "application/provenance+xml",
      "ps": "application/postscript",
      "pskcxml": "application/pskc+xml",
      "pti": "image/prs.pti",
      "qt": "video/quicktime",
      "raml": "application/raml+yaml",
      "rapd": "application/route-apd+xml",
      "rdf": "application/rdf+xml",
      "relo": "application/p2p-overlay+xml",
      "rif": "application/reginfo+xml",
      "rl": "application/resource-lists+xml",
      "rld": "application/resource-lists-diff+xml",
      "rmi": "audio/midi",
      "rnc": "application/relax-ng-compact-syntax",
      "rng": "application/xml",
      "roa": "application/rpki-roa",
      "roff": "text/troff",
      "rq": "application/sparql-query",
      "rs": "application/rls-services+xml",
      "rsat": "application/atsc-rsat+xml",
      "rsd": "application/rsd+xml",
      "rsheet": "application/urc-ressheet+xml",
      "rss": "application/rss+xml",
      "rtf": "text/rtf",
      "rtx": "text/richtext",
      "rusd": "application/route-usd+xml",
      "s3m": "audio/s3m",
      "sbml": "application/sbml+xml",
      "scq": "application/scvp-cv-request",
      "scs": "application/scvp-cv-response",
      "sdp": "application/sdp",
      "senmlx": "application/senml+xml",
      "sensmlx": "application/sensml+xml",
      "ser": "application/java-serialized-object",
      "setpay": "application/set-payment-initiation",
      "setreg": "application/set-registration-initiation",
      "sgi": "image/sgi",
      "sgm": "text/sgml",
      "sgml": "text/sgml",
      "shex": "text/shex",
      "shf": "application/shf+xml",
      "shtml": "text/html",
      "sieve": "application/sieve",
      "sig": "application/pgp-signature",
      "sil": "audio/silk",
      "silo": "model/mesh",
      "siv": "application/sieve",
      "slim": "text/slim",
      "slm": "text/slim",
      "sls": "application/route-s-tsid+xml",
      "smi": "application/smil+xml",
      "smil": "application/smil+xml",
      "snd": "audio/basic",
      "so": "application/octet-stream",
      "spdx": "text/spdx",
      "spp": "application/scvp-vp-response",
      "spq": "application/scvp-vp-request",
      "spx": "audio/ogg",
      "sql": "application/sql",
      "sru": "application/sru+xml",
      "srx": "application/sparql-results+xml",
      "ssdl": "application/ssdl+xml",
      "ssml": "application/ssml+xml",
      "stk": "application/hyperstudio",
      "stl": "model/stl",
      "stpx": "model/step+xml",
      "stpxz": "model/step-xml+zip",
      "stpz": "model/step+zip",
      "styl": "text/stylus",
      "stylus": "text/stylus",
      "svg": "image/svg+xml",
      "svgz": "image/svg+xml",
      "swidtag": "application/swid+xml",
      "t": "text/troff",
      "t38": "image/t38",
      "td": "application/urc-targetdesc+xml",
      "tei": "application/tei+xml",
      "teicorpus": "application/tei+xml",
      "text": "text/plain",
      "tfi": "application/thraud+xml",
      "tfx": "image/tiff-fx",
      "tif": "image/tiff",
      "tiff": "image/tiff",
      "toml": "application/toml",
      "tr": "text/troff",
      "trig": "application/trig",
      "ts": "video/mp2t",
      "tsd": "application/timestamped-data",
      "tsv": "text/tab-separated-values",
      "ttc": "font/collection",
      "ttf": "font/ttf",
      "ttl": "text/turtle",
      "ttml": "application/ttml+xml",
      "txt": "text/plain",
      "u3d": "model/u3d",
      "u8dsn": "message/global-delivery-status",
      "u8hdr": "message/global-headers",
      "u8mdn": "message/global-disposition-notification",
      "u8msg": "message/global",
      "ubj": "application/ubjson",
      "uri": "text/uri-list",
      "uris": "text/uri-list",
      "urls": "text/uri-list",
      "vcard": "text/vcard",
      "vrml": "model/vrml",
      "vtt": "text/vtt",
      "vxml": "application/voicexml+xml",
      "war": "application/java-archive",
      "wasm": "application/wasm",
      "wav": "audio/wav",
      "weba": "audio/webm",
      "webm": "video/webm",
      "webmanifest": "application/manifest+json",
      "webp": "image/webp",
      "wgsl": "text/wgsl",
      "wgt": "application/widget",
      "wif": "application/watcherinfo+xml",
      "wmf": "image/wmf",
      "woff": "font/woff",
      "woff2": "font/woff2",
      "wrl": "model/vrml",
      "wsdl": "application/wsdl+xml",
      "wspolicy": "application/wspolicy+xml",
      "x3d": "model/x3d+xml",
      "x3db": "model/x3d+fastinfoset",
      "x3dbz": "model/x3d+binary",
      "x3dv": "model/x3d-vrml",
      "x3dvz": "model/x3d+vrml",
      "x3dz": "model/x3d+xml",
      "xaml": "application/xaml+xml",
      "xav": "application/xcap-att+xml",
      "xca": "application/xcap-caps+xml",
      "xcs": "application/calendar+xml",
      "xdf": "application/xcap-diff+xml",
      "xdssc": "application/dssc+xml",
      "xel": "application/xcap-el+xml",
      "xenc": "application/xenc+xml",
      "xer": "application/patch-ops-error+xml",
      "xfdf": "application/xfdf",
      "xht": "application/xhtml+xml",
      "xhtml": "application/xhtml+xml",
      "xhvml": "application/xv+xml",
      "xlf": "application/xliff+xml",
      "xm": "audio/xm",
      "xml": "text/xml",
      "xns": "application/xcap-ns+xml",
      "xop": "application/xop+xml",
      "xpl": "application/xproc+xml",
      "xsd": "application/xml",
      "xsf": "application/prs.xsf+xml",
      "xsl": "application/xml",
      "xslt": "application/xml",
      "xspf": "application/xspf+xml",
      "xvm": "application/xv+xml",
      "xvml": "application/xv+xml",
      "yaml": "text/yaml",
      "yang": "application/yang",
      "yin": "application/yin+xml",
      "yml": "text/yaml",
      "zip": "application/zip"
    };
    $$Picture = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Picture;
      const defaultFormats = ["webp"];
      const defaultFallbackFormat = "png";
      const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
      const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
      if (props.alt === void 0 || props.alt === null) {
        throw new AstroError(ImageMissingAlt);
      }
      const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
      if (scopedStyleClass) {
        if (pictureAttributes.class) {
          pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
        } else {
          pictureAttributes.class = scopedStyleClass;
        }
      }
      const layout = props.layout ?? imageConfig.layout ?? "none";
      const useResponsive = layout !== "none";
      if (useResponsive) {
        props.layout ??= imageConfig.layout;
        props.fit ??= imageConfig.objectFit ?? "cover";
        props.position ??= imageConfig.objectPosition ?? "center";
      } else if (imageConfig.objectFit || imageConfig.objectPosition) {
        props.fit ??= imageConfig.objectFit;
        props.position ??= imageConfig.objectPosition;
      }
      for (const key in props) {
        if (key.startsWith("data-astro-cid")) {
          pictureAttributes[key] = props[key];
        }
      }
      const originalSrc = await resolveSrc(props.src);
      const optimizedImages = await Promise.all(
        formats.map(
          async (format) => await getImage({
            ...props,
            src: originalSrc,
            format,
            widths: props.widths,
            densities: props.densities
          })
        )
      );
      const clonedSrc = isESMImportedImage(originalSrc) ? (
        // @ts-expect-error - clone is a private, hidden prop
        originalSrc.clone ?? originalSrc
      ) : originalSrc;
      let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
      if (!fallbackFormat && isESMImportedImage(clonedSrc) && specialFormatsFallback.includes(clonedSrc.format)) {
        resultFallbackFormat = clonedSrc.format;
      }
      const fallbackImage = await getImage({
        ...props,
        format: resultFallbackFormat,
        widths: props.widths,
        densities: props.densities
      });
      const imgAdditionalAttributes = {};
      const sourceAdditionalAttributes = {};
      if (props.sizes) {
        sourceAdditionalAttributes.sizes = props.sizes;
      }
      if (fallbackImage.srcSet.values.length > 0) {
        imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
      }
      const { class: className, ...attributes } = {
        ...imgAdditionalAttributes,
        ...fallbackImage.attributes
      };
      return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_4, image]) => {
        const srcsetAttribute = props.densities || !props.densities && !props.widths && !useResponsive ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
        return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
      })}  <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(attributes)}${addAttribute(className, "class")}> </picture>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/components/Picture.astro", void 0);
    componentDataByCssVariable = /* @__PURE__ */ new Map([]);
    $$Font = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Font;
      const { cssVariable, preload = false } = Astro2.props;
      const data = componentDataByCssVariable.get(cssVariable);
      if (!data) {
        throw new AstroError({
          ...FontFamilyNotFound,
          message: FontFamilyNotFound.message(cssVariable)
        });
      }
      const filteredPreloadData = filterPreloads(data.preloads, preload);
      return renderTemplate`<style>${unescapeHTML(data.css)}</style>${filteredPreloadData?.map(({ url, type }) => renderTemplate`<link rel="preload"${addAttribute(url, "href")} as="font"${addAttribute(`font/${type}`, "type")} crossorigin>`)}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/components/Font.astro", void 0);
    SsrRuntimeFontFileUrlResolver = class {
      #urls;
      constructor({
        urls
      }) {
        this.#urls = urls;
      }
      resolve(url, requestUrl) {
        if (!this.#urls.has(url)) {
          return null;
        }
        if (!url.startsWith("/")) {
          return url;
        }
        if (!requestUrl) {
          throw new AstroError(MissingGetFontFileRequestUrl);
        }
        return `${requestUrl.origin}${url}`;
      }
    };
    new SsrRuntimeFontFileUrlResolver({
      urls: /* @__PURE__ */ new Set([])
    });
    assetQueryParams = void 0;
    imageConfig = { "endpoint": { "route": "/_image" }, "service": { "entrypoint": "astro/assets/services/noop", "config": {} }, "dangerouslyProcessSVG": false, "domains": [], "remotePatterns": [], "responsiveStyles": false };
    Object.defineProperty(imageConfig, "assetQueryParams", {
      value: assetQueryParams,
      enumerable: false,
      configurable: true
    });
    getImage = async (options) => await getImage$1(options, imageConfig);
    fnv1a52 = (str) => {
      const len = str.length;
      let i5 = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t22 = 0, v22 = 40164, t32 = 0, v32 = 52210;
      while (i5 < len) {
        v0 ^= str.charCodeAt(i5++);
        t0 = v0 * 435;
        t1 = v1 * 435;
        t22 = v22 * 435;
        t32 = v32 * 435;
        t22 += v0 << 8;
        t32 += v1 << 8;
        t1 += t0 >>> 16;
        v0 = t0 & 65535;
        t22 += t1 >>> 16;
        v1 = t1 & 65535;
        v32 = t32 + (t22 >>> 16) & 65535;
        v22 = t22 & 65535;
      }
      return (v32 & 15) * 281474976710656 + v22 * 4294967296 + v1 * 65536 + (v0 ^ v32 >> 4);
    };
    etag = (payload, weak = false) => {
      const prefix = weak ? 'W/"' : '"';
      return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
    };
    GET = async ({ request }) => {
      try {
        const imageService = await getConfiguredImageService();
        if (!("transform" in imageService)) {
          throw new Error("Configured image service is not a local service");
        }
        const url = new URL(request.url);
        const transform2 = await imageService.parseURL(url, imageConfig);
        if (!transform2?.src) {
          throw new Error("Incorrect transform returned by `parseURL`");
        }
        let inputBuffer = void 0;
        const isRemoteImage2 = isRemotePath(transform2.src);
        if (isRemoteImage2 && isRemoteAllowed(transform2.src, imageConfig) === false) {
          return new Response("Forbidden", { status: 403 });
        }
        const sourceUrl = new URL(transform2.src, url.origin);
        if (!isRemoteImage2 && sourceUrl.origin !== url.origin) {
          return new Response("Forbidden", { status: 403 });
        }
        inputBuffer = await loadImage(
          sourceUrl,
          isRemoteImage2 ? new Headers() : request.headers,
          imageConfig,
          isRemoteImage2
        );
        if (!inputBuffer) {
          return new Response("Not Found", { status: 404 });
        }
        const { data, format } = await imageService.transform(
          new Uint8Array(inputBuffer),
          transform2,
          imageConfig
        );
        return new Response(data, {
          status: 200,
          headers: {
            "Content-Type": lookup(format) ?? `image/${format}`,
            "Cache-Control": "public, max-age=31536000",
            ETag: etag(data.toString()),
            Date: (/* @__PURE__ */ new Date()).toUTCString()
          }
        });
      } catch (err) {
        console.error("Could not process image request:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    };
    _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      GET
    }, Symbol.toStringTag, { value: "Module" }));
    page = () => _page;
    generic___js = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      page
    }, Symbol.toStringTag, { value: "Module" }));
  }
});

// dist/server/chunks/Hero_BVVSX7E2.mjs
var $$Hero;
var init_Hero_BVVSX7E2 = __esm({
  "dist/server/chunks/Hero_BVVSX7E2.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    $$Hero = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Hero;
      const { align = "center", tagline, title } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<div${addAttribute(["hero stack gap-4", align], "class:list")} data-astro-cid-bbe6dxrz> <div class="stack gap-2" data-astro-cid-bbe6dxrz> <h1 class="title" data-astro-cid-bbe6dxrz>${title}</h1> ${tagline && renderTemplate`<p class="tagline" data-astro-cid-bbe6dxrz>${tagline}</p>`} </div> ${renderSlot($$result, $$slots["default"])} </div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Hero.astro", void 0);
  }
});

// dist/server/chunks/BaseLayout_1cxBJD0D.mjs
async function renderScript(result, id) {
  const inlined = result.inlinedScripts.get(id);
  let content = "";
  if (inlined != null) {
    if (inlined) {
      content = `<script type="module">${inlined}</script>`;
    }
  } else {
    const resolved = await result.resolve(id);
    content = `<script type="module" src="${result.userAssetsBase ? (result.base === "/" ? "" : result.base) + result.userAssetsBase : ""}${resolved}"></script>`;
  }
  return createRenderInstruction({ type: "script", id, content });
}
function templateEnter(_result) {
  return createRenderInstruction({ type: "template-enter" });
}
function templateExit(_result) {
  return createRenderInstruction({ type: "template-exit" });
}
var __freeze, __defProp2, __template, _a, $$MainHead, iconPaths, $$Icon, $$ThemeToggle, $$Nav, $$Footer, $$BaseLayout;
var init_BaseLayout_1cxBJD0D = __esm({
  "dist/server/chunks/BaseLayout_1cxBJD0D.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    __freeze = Object.freeze;
    __defProp2 = Object.defineProperty;
    __template = (cooked, raw) => __freeze(__defProp2(cooked, "raw", { value: __freeze(cooked.slice()) }));
    $$MainHead = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$MainHead;
      const {
        title = "Action Delay API",
        description = "Action Delay API"
      } = Astro2.props;
      return renderTemplate(_a || (_a = __template(['<meta charset="UTF-8"><meta name="description" property="og:description"', '><meta name="viewport" content="width=device-width"><meta name="generator"', "><title>", `</title><link rel="icon" type="image/svg+xml" href="/favicon.svg"><!--  
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
	href="https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,400;0,700;1,400&family=Rubik:wght@500;600&display=swap"
	rel="stylesheet"
/>
--><script>
	// This code is inlined in the head to make dark mode instant & blocking.
	const getThemePreference = () => {
		if (typeof localStorage !== 'undefined' && localStorage.getItem('theme')) {
			return localStorage.getItem('theme');
		}
		return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	};
	const isDark = getThemePreference() === 'dark';
	document.documentElement.classList[isDark ? 'add' : 'remove']('theme-dark');

	if (typeof localStorage !== 'undefined') {
		// Watch the document element and persist user preference when it changes.
		const observer = new MutationObserver(() => {
			const isDark = document.documentElement.classList.contains('theme-dark');
			localStorage.setItem('theme', isDark ? 'dark' : 'light');
		});
		observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
	}
</script>`])), addAttribute(description, "content"), addAttribute(Astro2.generator, "content"), title);
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/MainHead.astro", void 0);
    iconPaths = {
      "terminal-window": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m80 96 40 32-40 32m56 0h40"/><rect width="192" height="160" x="32" y="48" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16.97" rx="8.5"/>`,
      trophy: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M56 56v55.1c0 39.7 31.8 72.6 71.5 72.9a72 72 0 0 0 72.5-72V56a8 8 0 0 0-8-8H64a8 8 0 0 0-8 8Zm40 168h64m-32-40v40"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M198.2 128h9.8a32 32 0 0 0 32-32V80a8 8 0 0 0-8-8h-32M58 128H47.9a32 32 0 0 1-32-32V80a8 8 0 0 1 8-8h32"/>`,
      strategy: `<circle cx="68" cy="188" r="28" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m40 72 40 40m0-40-40 40m136 56 40 40m0-40-40 40M136 80V40h40"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m136 40 16 16c40 40 8 88-24 96"/>`,
      "paper-plane-tilt": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M210.3 35.9 23.9 88.4a8 8 0 0 0-1.2 15l85.6 40.5a7.8 7.8 0 0 1 3.8 3.8l40.5 85.6a8 8 0 0 0 15-1.2l52.5-186.4a7.9 7.9 0 0 0-9.8-9.8Zm-99.4 109.2 45.2-45.2"/>`,
      "arrow-right": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176m-72-72 72 72-72 72"/>`,
      "arrow-left": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 128H40m72-72-72 72 72 72"/>`,
      code: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m64 88-48 40 48 40m128-80 48 40-48 40M160 40 96 216"/>`,
      "microphone-stage": `<circle cx="168" cy="88" r="64" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m213.3 133.3-90.6-90.6M100 156l-12 12m16.8-70.1L28.1 202.5a7.9 7.9 0 0 0 .8 10.4l14.2 14.2a7.9 7.9 0 0 0 10.4.8l104.6-76.7"/>`,
      "pencil-line": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M96 216H48a8 8 0 0 1-8-8v-44.7a7.9 7.9 0 0 1 2.3-5.6l120-120a8 8 0 0 1 11.4 0l44.6 44.6a8 8 0 0 1 0 11.4Zm40-152 56 56"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 216H96l-55.5-55.5M164 92l-96 96"/>`,
      "rocket-launch": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M94.1 184.6c-11.4 33.9-56.6 33.9-56.6 33.9s0-45.2 33.9-56.6m124.5-56.5L128 173.3 82.7 128l67.9-67.9C176.3 34.4 202 34.7 213 36.3a7.8 7.8 0 0 1 6.7 6.7c1.6 11 1.9 36.7-23.8 62.4Z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M184.6 116.7v64.6a8 8 0 0 1-2.4 5.6l-32.3 32.4a8 8 0 0 1-13.5-4.1l-8.4-41.9m11.3-101.9H74.7a8 8 0 0 0-5.6 2.4l-32.4 32.3a8 8 0 0 0 4.1 13.5l41.9 8.4"/>`,
      list: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M40 128h176M40 64h176M40 192h176"/>`,
      heart: `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 216S28 160 28 92a52 52 0 0 1 100-20h0a52 52 0 0 1 100 20c0 68-100 124-100 124Z"/>`,
      "moon-stars": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M216 112V64m24 24h-48m-24-64v32m16-16h-32m65 113A92 92 0 0 1 103 39h0a92 92 0 1 0 114 114Z"/>`,
      sun: `<circle cx="128" cy="128" r="60" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 36V16M63 63 49 49m-13 79H16m47 65-14 14m79 13v20m65-47 14 14m13-79h20m-47-65 14-14"/>`,
      "twitter-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M128 88c0-22 18.5-40.3 40.5-40a40 40 0 0 1 36.2 24H240l-32.3 32.3A127.9 127.9 0 0 1 80 224c-32 0-40-12-40-12s32-12 48-36c0 0-64-32-48-120 0 0 40 40 88 48Z"/>`,
      "codepen-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m232 101-104 59-104-59 100.1-56.8a8.3 8.3 0 0 1 7.8 0Z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m232 165-100.1 56.8a8.3 8.3 0 0 1-7.8 0L24 165l104-59Zm0-64v64M24 101v64m104-5v62.8m0-179.6V106"/>`,
      "github-logo": `<g stroke-linecap="round" stroke-linejoin="round"><path fill="none" stroke-width="14.7" d="M55.7 167.2c13.9 1 21.3 13.1 22.2 14.6 4.2 7.2 10.4 9.6 18.3 7.1l1.1-3.4a60.3 60.3 0 0 1-25.8-11.9c-12-10.1-18-25.6-18-46.3"/><path fill="none" stroke-width="16" d="M61.4 205.1a24.5 24.5 0 0 1-3-6.1c-3.2-7.9-7.1-10.6-7.8-11.1l-1-.6c-2.4-1.6-9.5-6.5-7.2-13.9 1.4-4.5 6-7.2 12.3-7.2h.8c4 .3 7.6 1.5 10.7 3.2-9.1-10.1-13.6-24.3-13.6-42.3 0-11.3 3.5-21.7 10.1-30.4A46.7 46.7 0 0 1 65 67.3a8.3 8.3 0 0 1 5-4.7c2.8-.9 13.3-2.7 33.2 9.9a105 105 0 0 1 50.5 0c19.9-12.6 30.4-10.8 33.2-9.9 2.3.7 4.1 2.4 5 4.7 5 12.7 4 23.2 2.6 29.4 6.7 8.7 10 18.9 10 30.4 0 42.6-25.8 54.7-43.6 58.7 1.4 4.1 2.2 8.8 2.2 13.7l-.1 23.4v2.3"/><path fill="none" stroke-width="16" d="M160.9 185.7c1.4 4.1 2.2 8.8 2.2 13.7l-.1 23.4v2.3A98.6 98.6 0 1 0 61.4 205c-1.4-2.1-11.3-17.5-11.8-17.8-2.4-1.6-9.5-6.5-7.2-13.9 1.4-4.5 6-7.2 12.3-7.2h.8c4 .3 7.6 1.5 10.7 3.2-9.1-10.1-13.6-24.3-13.6-42.3 0-11.3 3.5-21.7 10.1-30.4A46.4 46.4 0 0 1 65 67.3a8.3 8.3 0 0 1 5-4.7c2.8-.9 13.3-2.7 33.2 9.9a105 105 0 0 1 50.5 0c19.9-12.6 30.4-10.8 33.2-9.9 2.3.7 4.1 2.4 5 4.7 5 12.7 4 23.2 2.6 29.4 6.7 8.7 10 18.9 10 30.4.1 42.6-25.8 54.7-43.6 58.6z"/><path fill="none" stroke-width="18.7" d="m170.1 203.3 17.3-12 17.2-18.7 9.5-26.6v-27.9l-9.5-27.5" /><path fill="none" stroke-width="22.7" d="m92.1 57.3 23.3-4.6 18.7-1.4 29.3 5.4m-110 32.6-8 16-4 21.4.6 20.3 3.4 13" /><path fill="none" stroke-width="13.3" d="M28.8 133a100 100 0 0 0 66.9 94.4v-8.7c-22.4 1.8-33-11.5-35.6-19.8-3.4-8.6-7.8-11.4-8.5-11.8"/></g>`,
      "twitch-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M165 200h-42a8 8 0 0 0-5 2l-46 38v-40H48a8 8 0 0 1-8-8V48a8 8 0 0 1 8-8h160a8 8 0 0 1 8 8v108a8 8 0 0 1-3 6l-43 36a8 8 0 0 1-5 2Zm3-112v48m-48-48v48"/>`,
      "youtube-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m160 128-48-32v64l48-32z"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M24 128c0 30 3 47 5 56a16 16 0 0 0 10 11c34 13 89 13 89 13s56 0 89-13a16 16 0 0 0 10-11c2-9 5-26 5-56s-3-47-5-56a16 16 0 0 0-10-11c-33-13-89-13-89-13s-55 0-89 13a16 16 0 0 0-10 11c-2 9-5 26-5 56Z"/>`,
      "dribbble-logo": `<circle cx="128" cy="128" r="96" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M71 205a160 160 0 0 1 137-77l16 1m-36-76a160 160 0 0 1-124 59 165 165 0 0 1-30-3"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M86 42a161 161 0 0 1 74 177"/>`,
      "discord-logo": `<circle stroke="none" cx="96" cy="144" r="12"/><circle stroke="none" cx="160" cy="144" r="12"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M74 80a175 175 0 0 1 54-8 175 175 0 0 1 54 8m0 96a175 175 0 0 1-54 8 175 175 0 0 1-54-8"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="m155 182 12 24a8 8 0 0 0 9 4c25-6 46-16 61-30a8 8 0 0 0 3-8L206 59a8 8 0 0 0-5-5 176 176 0 0 0-30-9 8 8 0 0 0-9 5l-8 24m-53 108-12 24a8 8 0 0 1-9 4c-25-6-46-16-61-30a8 8 0 0 1-3-8L50 59a8 8 0 0 1 5-5 176 176 0 0 1 30-9 8 8 0 0 1 9 5l8 24"/>`,
      "linkedin-logo": `<rect width="184" height="184" x="36" y="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="8"/><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M120 112v64m-32-64v64m32-36a28 28 0 0 1 56 0v36"/><circle stroke="none" cx="88" cy="80" r="12"/>`,
      "instagram-logo": `<circle cx="128" cy="128" r="40" fill="none" stroke-miterlimit="10" stroke-width="16"/><rect width="184" height="184" x="36" y="36" fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" rx="48"/><circle cx="180" cy="76" r="12" stroke="none" />`,
      "tiktok-logo": `<path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="16" d="M168 106a96 96 0 0 0 56 18V84a56 56 0 0 1-56-56h-40v128a28 28 0 1 1-40-25V89a68 68 0 1 0 80 67Z"/>`
    };
    $$Icon = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Icon;
      const { color = "currentcolor", gradient, icon, size } = Astro2.props;
      const iconPath = iconPaths[icon];
      const attrs = {};
      if (size) attrs.style = { "--size": size, "display": "unset" };
      else attrs.style = { "display": "unset" };
      const gradientId = "icon-gradient-" + Math.round(Math.random() * 1e13).toString(36);
      return renderTemplate`${maybeRenderHead()}<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256" aria-hidden="true"${addAttribute(gradient ? `url(#${gradientId})` : color, "stroke")}${addAttribute(gradient ? `url(#${gradientId})` : color, "fill")}${spreadAttributes(attrs, void 0, { "class": "astro-patnjmll" })} data-astro-cid-patnjmll> <g data-astro-cid-patnjmll>${unescapeHTML(iconPath)}</g> ${gradient && renderTemplate`<linearGradient${addAttribute(gradientId, "id")} x1="23" x2="235" y1="43" y2="202" gradientUnits="userSpaceOnUse" data-astro-cid-patnjmll> <stop stop-color="var(--gradient-stop-1)" data-astro-cid-patnjmll></stop> <stop offset=".5" stop-color="var(--gradient-stop-2)" data-astro-cid-patnjmll></stop> <stop offset="1" stop-color="var(--gradient-stop-3)" data-astro-cid-patnjmll></stop> </linearGradient>`} </svg>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Icon.astro", void 0);
    $$ThemeToggle = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "theme-toggle", "theme-toggle", { "data-astro-cid-x3pjskd3": true }, { "default": () => renderTemplate` ${maybeRenderHead()}<button data-astro-cid-x3pjskd3> <span class="sr-only" data-astro-cid-x3pjskd3>Dark theme</span> <span class="icon light" data-astro-cid-x3pjskd3>${renderComponent($$result, "Icon", $$Icon, { "icon": "sun", "data-astro-cid-x3pjskd3": true })}</span> <span class="icon dark" data-astro-cid-x3pjskd3>${renderComponent($$result, "Icon", $$Icon, { "icon": "moon-stars", "data-astro-cid-x3pjskd3": true })}</span> </button> ` })}  ${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro", void 0);
    $$Nav = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Nav;
      const textLinks = [
        { label: "Bunny Status", href: "/" },
        { label: "Bunny Delay", href: "/delay/" },
        { label: "Bunny Performance", href: "/perf/" },
        { label: "Locations", href: "/locations/" },
        { label: "About", href: "/about/" }
      ];
      const iconLinks = [
        { label: "GitHub", href: "https://github.com/Tyler-OBrien/Action-Delay-API", icon: "github-logo" }
      ];
      return renderTemplate`${maybeRenderHead()}<nav data-astro-cid-dmqpwcec> <div class="menu-header" data-astro-cid-dmqpwcec> <a href="/" class="site-title" data-astro-cid-dmqpwcec> <img src="/favicon-animated.svg" style="width: 4.0em" data-astro-cid-dmqpwcec>
Action-Delay-API
</a> ${renderComponent($$result, "menu-button", "menu-button", { "data-astro-cid-dmqpwcec": true }, { "default": () => renderTemplate` <template data-astro-cid-dmqpwcec>${templateEnter()} <button class="menu-button" aria-expanded="false" data-astro-cid-dmqpwcec> <span class="sr-only" data-astro-cid-dmqpwcec>Menu</span> ${renderComponent($$result, "Icon", $$Icon, { "icon": "list", "data-astro-cid-dmqpwcec": true })} </button> ${templateExit()}</template> ` })} </div> <noscript> <ul class="nav-items" data-astro-cid-dmqpwcec> ${textLinks.map(({ label, href }) => renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(Astro2.url.pathname === href, "aria-current")}${addAttribute([
        "link",
        {
          active: Astro2.url.pathname === href || href !== "/" && Astro2.url.pathname.startsWith(href)
        }
      ], "class:list")}${addAttribute(href, "href")} data-astro-cid-dmqpwcec> ${label} </a> </li>`)} </ul> </noscript> <noscript> <div class="menu-footer" data-astro-cid-dmqpwcec> <div class="socials" data-astro-cid-dmqpwcec> ${iconLinks.map(({ href, icon, label }) => renderTemplate`<a${addAttribute(href, "href")} class="social" data-astro-cid-dmqpwcec> <span class="sr-only" data-astro-cid-dmqpwcec>${label}</span> ${renderComponent($$result, "Icon", $$Icon, { "icon": icon, "data-astro-cid-dmqpwcec": true })} </a>`)} </div> </div> </noscript> <div id="menu-content" hidden data-astro-cid-dmqpwcec> <ul class="nav-items" data-astro-cid-dmqpwcec> ${textLinks.map(({ label, href }) => renderTemplate`<li data-astro-cid-dmqpwcec> <a${addAttribute(Astro2.url.pathname === href, "aria-current")}${addAttribute([
        "link",
        {
          active: Astro2.url.pathname === href || href !== "/" && Astro2.url.pathname.startsWith(href)
        }
      ], "class:list")}${addAttribute(href, "href")} data-astro-cid-dmqpwcec> ${label} </a> </li>`)} </ul> <div class="menu-footer" data-astro-cid-dmqpwcec> <div class="socials" data-astro-cid-dmqpwcec> ${iconLinks.map(({ href, icon, label }) => renderTemplate`<a${addAttribute(href, "href")} class="social" data-astro-cid-dmqpwcec> <span class="sr-only" data-astro-cid-dmqpwcec>${label}</span> ${renderComponent($$result, "Icon", $$Icon, { "icon": icon, "data-astro-cid-dmqpwcec": true })} </a>`)} </div> <div class="theme-toggle" data-astro-cid-dmqpwcec> ${renderComponent($$result, "ThemeToggle", $$ThemeToggle, { "data-astro-cid-dmqpwcec": true })} </div> </div> </div> </nav> ${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro", void 0);
    $$Footer = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Footer;
      (/* @__PURE__ */ new Date()).getFullYear();
      return renderTemplate`${maybeRenderHead()}<footer data-astro-cid-sz7xmlte> <div class="group" data-astro-cid-sz7xmlte> <p data-astro-cid-sz7xmlte>
Made With <a href="https://astro.build/" data-astro-cid-sz7xmlte>Astro</a> ${renderComponent($$result, "Icon", $$Icon, { "icon": "rocket-launch", "size": "1.2em", "data-astro-cid-sz7xmlte": true })} </p> </div> <p class="socials" data-astro-cid-sz7xmlte> <a href="https://github.com/Tyler-OBrien/Action-Delay-API" data-astro-cid-sz7xmlte> GitHub</a> </p> </footer>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Footer.astro", void 0);
    $$BaseLayout = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$BaseLayout;
      const { title, description } = Astro2.props;
      return renderTemplate`<html lang="en" data-astro-cid-37fxchfa> <head>${renderComponent($$result, "MainHead", $$MainHead, { "title": title, "description": description, "data-astro-cid-37fxchfa": true })}${renderHead()}</head> <body data-astro-cid-37fxchfa> <div class="stack backgrounds" data-astro-cid-37fxchfa> ${renderComponent($$result, "Nav", $$Nav, { "data-astro-cid-37fxchfa": true })} ${renderSlot($$result, $$slots["default"])} ${renderComponent($$result, "Footer", $$Footer, { "data-astro-cid-37fxchfa": true })} </div> ${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts")} </body> </html>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro", void 0);
  }
});

// dist/server/chunks/404_BSA-6hY1.mjs
var BSA_6hY1_exports = {};
__export(BSA_6hY1_exports, {
  page: () => page2
});
var $$404, $$file, $$url, _page2, page2;
var init_BSA_6hY1 = __esm({
  "dist/server/chunks/404_BSA-6hY1.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_Hero_BVVSX7E2();
    init_BaseLayout_1cxBJD0D();
    $$404 = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Not Found", "description": "404 Error \u2014 this page was not found" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "Hero", $$Hero, { "title": "Page Not Found", "tagline": "Not found" })} ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro", void 0);
    $$file = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro";
    $$url = "/404";
    _page2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$404,
      file: $$file,
      url: $$url
    }, Symbol.toStringTag, { value: "Module" }));
    page2 = () => _page2;
  }
});

// dist/server/chunks/about_DDsdg5QE.mjs
var about_DDsdg5QE_exports = {};
__export(about_DDsdg5QE_exports, {
  page: () => page3
});
var $$About, $$file2, $$url2, _page3, page3;
var init_about_DDsdg5QE = __esm({
  "dist/server/chunks/about_DDsdg5QE.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Hero_BVVSX7E2();
    $$About = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "About | Action Delay API", "description": "About Action Delay API", "data-astro-cid-kh7btl4r": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-20" data-astro-cid-kh7btl4r> <main class="wrapper about" data-astro-cid-kh7btl4r> ${renderComponent($$result2, "Hero", $$Hero, { "title": "About", "tagline": "More about Action-Delay-API.", "data-astro-cid-kh7btl4r": true })} <section data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Overview</h2> <div class="content" data-astro-cid-kh7btl4r> <p data-astro-cid-kh7btl4r>
This project monitors delay of various Bunny updates/operations, and has also expanded into generic performance monitoring, using 40+ remote <a href="https://api.bunny.chaika.me/v2/locations" data-astro-cid-kh7btl4r>locations</a>.
</p> </div> </section> <section data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Job Types</h2> <div class="content" data-astro-cid-kh7btl4r> <p data-astro-cid-kh7btl4r>
For various delay jobs, such as updating a DNS Record, or updating an Edge Rule, we perform the update via the Bunny API and then rapidly check via 40 locations when the change is visible on edge. When at least half see the change, we mark the job complete.
<br data-astro-cid-kh7btl4r><br data-astro-cid-kh7btl4r>
Additionally, There is various performance jobs comparing different cloud platforms and services.
<br data-astro-cid-kh7btl4r><br data-astro-cid-kh7btl4r>
Please note that none of these are designed to be perfect benchmarks. Delay Jobs focus on showing issues with update propagation and relative delay if you had done the same action at the same time, how long it'd take for you to see the update on edge.
<br data-astro-cid-kh7btl4r><br data-astro-cid-kh7btl4r>
For performance jobs, a greater care is taken in accuracy but is still hard to guarantee perfect routing in all cases. Most of these locations were handpicked for low latency to global services (only a few ms max) and all are in data centers.
<br data-astro-cid-kh7btl4r><br data-astro-cid-kh7btl4r> </p> </div> </section> <section data-astro-cid-kh7btl4r> <h2 class="section-title" data-astro-cid-kh7btl4r>Stats</h2> <div class="content" data-astro-cid-kh7btl4r> <p data-astro-cid-kh7btl4r>
9 Million+ DNS and HTTP Requests from all nodes per day to perform jobs, with over 400k unique per location delay job results daily.
<br data-astro-cid-kh7btl4r><br data-astro-cid-kh7btl4r>
All results stored in ClickHouse with no sampling, and status live updated, leveraging Postgres as well.
</p> </div> </section> <!-- 
			<section>
				<h2 class="section-title">Education</h2>
				<div class="content">
					<p>Corporis voluptates tenetur laudantium.</p>
				</div>
			</section>
			<section>
				<h2 class="section-title">Skills</h2>
				<div class="content">
					<p>officia unde omnis</p>
				</div>
			</section>
			--> </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro", void 0);
    $$file2 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro";
    $$url2 = "/about";
    _page3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$About,
      file: $$file2,
      url: $$url2
    }, Symbol.toStringTag, { value: "Module" }));
    page3 = () => _page3;
  }
});

// dist/server/chunks/overview_Dny-qPAB.mjs
var overview_Dny_qPAB_exports = {};
__export(overview_Dny_qPAB_exports, {
  page: () => page4
});
var $$Overview, $$file3, $$url3, _page4, page4;
var init_overview_Dny_qPAB = __esm({
  "dist/server/chunks/overview_Dny-qPAB.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_Hero_BVVSX7E2();
    init_BaseLayout_1cxBJD0D();
    $$Overview = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Bunny Delay Monitoring", "description": "See Bunny Delay Monitoring Jobs" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-20"> <main class="wrapper stack gap-8"> ${renderComponent($$result2, "Hero", $$Hero, { "title": "Bunny Delay Jobs", "tagline": "See Bunny Delay Monitoring Jobs", "align": "start" }, { "default": ($$result3) => renderTemplate` <a href="/delay">Delay Jobs</a> ` })} ${renderComponent($$result2, "SmartGraph", null, { "endpoint": "/v2/jobs/analytics/type/BunnyDelay", "label": "Overall Bunny Propagation Delay", "options": ["MedianRunLength", "AvgRunLength", "MinRunLength", "MaxRunLength"], "defaultOption": "MedianRunLength", "client:only": "preact", "client:component-hydration": "only", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph", "client:component-export": "default" })} ${renderComponent($$result2, "SmartGraph", null, { "endpoint": `/v2/jobs/analytics/type/BunnyDelay`, "label": `Overall Bunny Delay API Response Time`, "options": ["AvgApiResponseLatency", "MedianApiResponseLatency", "MinApiResponseLatency", "MaxApiResponseLatency"], "client:only": "preact", "client:component-hydration": "only", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph", "client:component-export": "default" })} ${renderComponent($$result2, "ErrorGraph", null, { "endpoint": `/v2/jobs/erroranalytics/type/BunnyDelay`, "label": `Overall Bunny Delay API Errors`, "client:only": "preact", "client:component-hydration": "only", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph", "client:component-export": "default" })} </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro", void 0);
    $$file3 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro";
    $$url3 = "/delay/overview";
    _page4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Overview,
      file: $$file3,
      url: $$url3
    }, Symbol.toStringTag, { value: "Module" }));
    page4 = () => _page4;
  }
});

// node_modules/.pnpm/preact@10.29.2/node_modules/preact/hooks/dist/hooks.mjs
function p2(n3, t4) {
  c2.__h && c2.__h(r2, n3, o2 || t4), o2 = 0;
  var u5 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n3 >= u5.__.length && u5.__.push({}), u5.__[n3];
}
function d2(n3) {
  return o2 = 1, h2(D2, n3);
}
function h2(n3, u5, i5) {
  var o4 = p2(t2++, 2);
  if (o4.t = n3, !o4.__c && (o4.__ = [i5 ? i5(u5) : D2(void 0, u5), function(n4) {
    var t4 = o4.__N ? o4.__N[0] : o4.__[0], r4 = o4.t(t4, n4);
    t4 !== r4 && (o4.__N = [r4, o4.__[1]], o4.__c.setState({}));
  }], o4.__c = r2, !r2.__f)) {
    var f5 = function(n4, t4, r4) {
      if (!o4.__c.__H) return true;
      var u6 = o4.__c.__H.__.filter(function(n5) {
        return n5.__c;
      });
      if (u6.every(function(n5) {
        return !n5.__N;
      })) return !c4 || c4.call(this, n4, t4, r4);
      var i6 = o4.__c.props !== n4;
      return u6.some(function(n5) {
        if (n5.__N) {
          var t5 = n5.__[0];
          n5.__ = n5.__N, n5.__N = void 0, t5 !== n5.__[0] && (i6 = true);
        }
      }), c4 && c4.call(this, n4, t4, r4) || i6;
    };
    r2.__f = true;
    var c4 = r2.shouldComponentUpdate, e4 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n4, t4, r4) {
      if (this.__e) {
        var u6 = c4;
        c4 = void 0, f5(n4, t4, r4), c4 = u6;
      }
      e4 && e4.call(this, n4, t4, r4);
    }, r2.shouldComponentUpdate = f5;
  }
  return o4.__N || o4.__;
}
function y2(n3, u5) {
  var i5 = p2(t2++, 3);
  !c2.__s && C2(i5.__H, u5) && (i5.__ = n3, i5.u = u5, r2.__H.__h.push(i5));
}
function A2(n3) {
  return o2 = 5, T2(function() {
    return { current: n3 };
  }, []);
}
function T2(n3, r4) {
  var u5 = p2(t2++, 7);
  return C2(u5.__H, r4) && (u5.__ = n3(), u5.__H = r4, u5.__h = n3), u5.__;
}
function j2() {
  for (var n3; n3 = f2.shift(); ) {
    var t4 = n3.__H;
    if (n3.__P && t4) try {
      t4.__h.some(z2), t4.__h.some(B2), t4.__h = [];
    } catch (r4) {
      t4.__h = [], c2.__e(r4, n3.__v);
    }
  }
}
function w2(n3) {
  var t4, r4 = function() {
    clearTimeout(u5), k2 && cancelAnimationFrame(t4), setTimeout(n3);
  }, u5 = setTimeout(r4, 35);
  k2 && (t4 = requestAnimationFrame(r4));
}
function z2(n3) {
  var t4 = r2, u5 = n3.__c;
  "function" == typeof u5 && (n3.__c = void 0, u5()), r2 = t4;
}
function B2(n3) {
  var t4 = r2;
  n3.__c = n3.__(), r2 = t4;
}
function C2(n3, t4) {
  return !n3 || n3.length !== t4.length || t4.some(function(t5, r4) {
    return t5 !== n3[r4];
  });
}
function D2(n3, t4) {
  return "function" == typeof t4 ? t4(n3) : t4;
}
var t2, r2, u2, i2, o2, f2, c2, e2, a2, v2, l2, m2, s2, k2;
var init_hooks = __esm({
  "node_modules/.pnpm/preact@10.29.2/node_modules/preact/hooks/dist/hooks.mjs"() {
    init_preact();
    o2 = 0;
    f2 = [];
    c2 = l;
    e2 = c2.__b;
    a2 = c2.__r;
    v2 = c2.diffed;
    l2 = c2.__c;
    m2 = c2.unmount;
    s2 = c2.__;
    c2.__b = function(n3) {
      r2 = null, e2 && e2(n3);
    }, c2.__ = function(n3, t4) {
      n3 && t4.__k && t4.__k.__m && (n3.__m = t4.__k.__m), s2 && s2(n3, t4);
    }, c2.__r = function(n3) {
      a2 && a2(n3), t2 = 0;
      var i5 = (r2 = n3.__c).__H;
      i5 && (u2 === r2 ? (i5.__h = [], r2.__h = [], i5.__.some(function(n4) {
        n4.__N && (n4.__ = n4.__N), n4.u = n4.__N = void 0;
      })) : (i5.__h.some(z2), i5.__h.some(B2), i5.__h = [], t2 = 0)), u2 = r2;
    }, c2.diffed = function(n3) {
      v2 && v2(n3);
      var t4 = n3.__c;
      t4 && t4.__H && (t4.__H.__h.length && (1 !== f2.push(t4) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t4.__H.__.some(function(n4) {
        n4.u && (n4.__H = n4.u), n4.u = void 0;
      })), u2 = r2 = null;
    }, c2.__c = function(n3, t4) {
      t4.some(function(n4) {
        try {
          n4.__h.some(z2), n4.__h = n4.__h.filter(function(n5) {
            return !n5.__ || B2(n5);
          });
        } catch (r4) {
          t4.some(function(n5) {
            n5.__h && (n5.__h = []);
          }), t4 = [], c2.__e(r4, n4.__v);
        }
      }), l2 && l2(n3, t4);
    }, c2.unmount = function(n3) {
      m2 && m2(n3);
      var t4, r4 = n3.__c;
      r4 && r4.__H && (r4.__H.__.some(function(n4) {
        try {
          z2(n4);
        } catch (n5) {
          t4 = n5;
        }
      }), r4.__H = void 0, t4 && c2.__e(t4, r4.__v));
    };
    k2 = "function" == typeof requestAnimationFrame;
  }
});

// node_modules/.pnpm/preact@10.29.2/node_modules/preact/compat/dist/compat.mjs
function g3(n3, t4) {
  for (var e4 in t4) n3[e4] = t4[e4];
  return n3;
}
function E2(n3, t4) {
  for (var e4 in n3) if ("__source" !== e4 && !(e4 in t4)) return true;
  for (var r4 in t4) if ("__source" !== r4 && n3[r4] !== t4[r4]) return true;
  return false;
}
function M2(n3, t4) {
  this.props = n3, this.context = t4;
}
function V2(n3, t4, e4) {
  return n3 && (n3.__c && n3.__c.__H && (n3.__c.__H.__.forEach(function(n4) {
    "function" == typeof n4.__c && n4.__c();
  }), n3.__c.__H = null), null != (n3 = g3({}, n3)).__c && (n3.__c.__P === e4 && (n3.__c.__P = t4), n3.__c.__e = true, n3.__c = null), n3.__k = n3.__k && n3.__k.map(function(n4) {
    return V2(n4, t4, e4);
  })), n3;
}
function W2(n3, t4, e4) {
  return n3 && e4 && (n3.__v = null, n3.__k = n3.__k && n3.__k.map(function(n4) {
    return W2(n4, t4, e4);
  }), n3.__c && n3.__c.__P === t4 && (n3.__e && e4.appendChild(n3.__e), n3.__c.__e = true, n3.__c.__P = e4)), n3;
}
function P3() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j3(n3) {
  var t4 = n3.__ && n3.__.__c;
  return t4 && t4.__a && t4.__a(n3);
}
function B3() {
  this.i = null, this.l = null;
}
var T3, A3, O2, U2, H2, q3, G2, J2, K2, Q2, X2, en, rn, un, on, ln, cn;
var init_compat = __esm({
  "node_modules/.pnpm/preact@10.29.2/node_modules/preact/compat/dist/compat.mjs"() {
    init_preact();
    init_preact();
    init_hooks();
    init_hooks();
    (M2.prototype = new C()).isPureReactComponent = true, M2.prototype.shouldComponentUpdate = function(n3, t4) {
      return E2(this.props, n3) || E2(this.state, t4);
    };
    T3 = l.__b;
    l.__b = function(n3) {
      n3.type && n3.type.__f && n3.ref && (n3.props.ref = n3.ref, n3.ref = null), T3 && T3(n3);
    };
    A3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.forward_ref") || 3911;
    O2 = l.__e;
    l.__e = function(n3, t4, e4, r4) {
      if (n3.then) {
        for (var u5, o4 = t4; o4 = o4.__; ) if ((u5 = o4.__c) && u5.__c) return null == t4.__e && (t4.__e = e4.__e, t4.__k = e4.__k), u5.__c(n3, t4);
      }
      O2(n3, t4, e4, r4);
    };
    U2 = l.unmount;
    l.unmount = function(n3) {
      var t4 = n3.__c;
      t4 && (t4.__z = true), t4 && t4.__R && t4.__R(), t4 && 32 & n3.__u && (n3.type = null), U2 && U2(n3);
    }, (P3.prototype = new C()).__c = function(n3, t4) {
      var e4 = t4.__c, r4 = this;
      null == r4.o && (r4.o = []), r4.o.push(e4);
      var u5 = j3(r4.__v), o4 = false, i5 = function() {
        o4 || r4.__z || (o4 = true, e4.__R = null, u5 ? u5(c4) : c4());
      };
      e4.__R = i5;
      var l4 = e4.__P;
      e4.__P = null;
      var c4 = function() {
        if (!--r4.__u) {
          if (r4.state.__a) {
            var n4 = r4.state.__a;
            r4.__v.__k[0] = W2(n4, n4.__c.__P, n4.__c.__O);
          }
          var t5;
          for (r4.setState({ __a: r4.__b = null }); t5 = r4.o.pop(); ) t5.__P = l4, t5.forceUpdate();
        }
      };
      r4.__u++ || 32 & t4.__u || r4.setState({ __a: r4.__b = r4.__v.__k[0] }), n3.then(i5, i5);
    }, P3.prototype.componentWillUnmount = function() {
      this.o = [];
    }, P3.prototype.render = function(n3, e4) {
      if (this.__b) {
        if (this.__v.__k) {
          var r4 = document.createElement("div"), o4 = this.__v.__k[0].__c;
          this.__v.__k[0] = V2(this.__b, r4, o4.__O = o4.__P);
        }
        this.__b = null;
      }
      var i5 = e4.__a && k(S, null, n3.fallback);
      return i5 && (i5.__u &= -33), [k(S, null, e4.__a ? null : n3.children), i5];
    };
    H2 = function(n3, t4, e4) {
      if (++e4[1] === e4[0] && n3.l.delete(t4), n3.props.revealOrder && ("t" !== n3.props.revealOrder[0] || !n3.l.size)) for (e4 = n3.i; e4; ) {
        for (; e4.length > 3; ) e4.pop()();
        if (e4[1] < e4[0]) break;
        n3.i = e4 = e4[2];
      }
    };
    (B3.prototype = new C()).__a = function(n3) {
      var t4 = this, e4 = j3(t4.__v), r4 = t4.l.get(n3);
      return r4[0]++, function(u5) {
        var o4 = function() {
          t4.props.revealOrder ? (r4.push(u5), H2(t4, n3, r4)) : u5();
        };
        e4 ? e4(o4) : o4();
      };
    }, B3.prototype.render = function(n3) {
      this.i = null, this.l = /* @__PURE__ */ new Map();
      var t4 = F(n3.children);
      n3.revealOrder && "b" === n3.revealOrder[0] && t4.reverse();
      for (var e4 = t4.length; e4--; ) this.l.set(t4[e4], this.i = [1, 0, this.i]);
      return n3.children;
    }, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
      var n3 = this;
      this.l.forEach(function(t4, e4) {
        H2(n3, e4, t4);
      });
    };
    q3 = "undefined" != typeof Symbol && Symbol.for && Symbol.for("react.element") || 60103;
    G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
    J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
    K2 = /[A-Z0-9]/g;
    Q2 = "undefined" != typeof document;
    X2 = function(n3) {
      return ("undefined" != typeof Symbol && "symbol" == typeof Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n3);
    };
    C.prototype.isReactComponent = true, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t4) {
      Object.defineProperty(C.prototype, t4, { configurable: true, get: function() {
        return this["UNSAFE_" + t4];
      }, set: function(n3) {
        Object.defineProperty(this, t4, { configurable: true, writable: true, value: n3 });
      } });
    });
    en = l.event;
    l.event = function(n3) {
      return en && (n3 = en(n3)), n3.persist = function() {
      }, n3.isPropagationStopped = function() {
        return this.cancelBubble;
      }, n3.isDefaultPrevented = function() {
        return this.defaultPrevented;
      }, n3.nativeEvent = n3;
    };
    un = { configurable: true, get: function() {
      return this.class;
    } };
    on = l.vnode;
    l.vnode = function(n3) {
      "string" == typeof n3.type && function(n4) {
        var t4 = n4.props, e4 = n4.type, u5 = {}, o4 = -1 == e4.indexOf("-");
        for (var i5 in t4) {
          var l4 = t4[i5];
          if (!("value" === i5 && "defaultValue" in t4 && null == l4 || Q2 && "children" === i5 && "noscript" === e4 || "class" === i5 || "className" === i5)) {
            var c4 = i5.toLowerCase();
            "defaultValue" === i5 && "value" in t4 && null == t4.value ? i5 = "value" : "download" === i5 && true === l4 ? l4 = "" : "translate" === c4 && "no" === l4 ? l4 = false : "o" === c4[0] && "n" === c4[1] ? "ondoubleclick" === c4 ? i5 = "ondblclick" : "onchange" !== c4 || "input" !== e4 && "textarea" !== e4 || X2(t4.type) ? "onfocus" === c4 ? i5 = "onfocusin" : "onblur" === c4 ? i5 = "onfocusout" : J2.test(i5) && (i5 = c4) : c4 = i5 = "oninput" : o4 && G2.test(i5) ? i5 = i5.replace(K2, "-$&").toLowerCase() : null === l4 && (l4 = void 0), "oninput" === c4 && u5[i5 = c4] && (i5 = "oninputCapture"), u5[i5] = l4;
          }
        }
        "select" == e4 && (u5.multiple && Array.isArray(u5.value) && (u5.value = F(t4.children).forEach(function(n5) {
          n5.props.selected = -1 != u5.value.indexOf(n5.props.value);
        })), null != u5.defaultValue && (u5.value = F(t4.children).forEach(function(n5) {
          n5.props.selected = u5.multiple ? -1 != u5.defaultValue.indexOf(n5.props.value) : u5.defaultValue == n5.props.value;
        }))), t4.class && !t4.className ? (u5.class = t4.class, Object.defineProperty(u5, "className", un)) : t4.className && (u5.class = u5.className = t4.className), n4.props = u5;
      }(n3), n3.$$typeof = q3, on && on(n3);
    };
    ln = l.__r;
    l.__r = function(n3) {
      ln && ln(n3), rn = n3.__c;
    };
    cn = l.diffed;
    l.diffed = function(n3) {
      cn && cn(n3);
      var t4 = n3.props, e4 = n3.__e;
      null != e4 && "textarea" === n3.type && "value" in t4 && t4.value !== e4.value && (e4.value = null == t4.value ? "" : t4.value), rn = null;
    };
  }
});

// node_modules/.pnpm/preact@10.29.2/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs
function u3(e4, t4, n3, o4, i5, u5) {
  t4 || (t4 = {});
  var a4, c4, p4 = t4;
  if ("ref" in p4) for (c4 in p4 = {}, t4) "ref" == c4 ? a4 = t4[c4] : p4[c4] = t4[c4];
  var l4 = { type: e4, props: p4, key: n3, ref: a4, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i5, __self: u5 };
  if ("function" == typeof e4 && (a4 = e4.defaultProps)) for (c4 in a4) void 0 === p4[c4] && (p4[c4] = a4[c4]);
  return l.vnode && l.vnode(l4), l4;
}
var f3, i3;
var init_jsxRuntime = __esm({
  "node_modules/.pnpm/preact@10.29.2/node_modules/preact/jsx-runtime/dist/jsxRuntime.mjs"() {
    init_preact();
    init_preact();
    f3 = 0;
    i3 = Array.isArray;
  }
});

// dist/server/chunks/Sparkline_mFdyPfsh.mjs
function jobHealth(job, hasIncident = false) {
  if (job.currentRunStatus === "API_Error" && job.lastRunStatus === "API_Error" || job.predictedRunStatus === "API_Error") {
    return "bad";
  }
  if (hasIncident || job.type === "delayed" || job.predictedRunStatus === "Delayed" || job.currentRunStatus === "Undeployed" && (job.currentRunLengthMs ?? 0) > 3e4) {
    return "elevated";
  }
  return "good";
}
function dotClass(health) {
  return health === "good" ? "bg-green-500" : health === "elevated" ? "bg-amber-500" : "bg-red-500";
}
function cssStatusColor(health) {
  if (typeof document === "undefined") return "#10b981";
  const v4 = getComputedStyle(document.documentElement).getPropertyValue("--status-" + health).trim();
  return v4 || "#10b981";
}
function buildPaths(points, xMin, xSpan) {
  const ys = points.map((p4) => p4.y);
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = max - min || 1;
  const n3 = points.length;
  const pts = points.map((p4, i5) => {
    const px = xSpan > 0 ? (p4.x - xMin) / xSpan * W3 : n3 === 1 ? W3 / 2 : i5 / (n3 - 1) * W3;
    const py = H3 - PAD - (p4.y - min) / span * (H3 - PAD * 2);
    return [px, py];
  });
  const line = pts.map(([x4, y4], i5) => `${i5 === 0 ? "M" : "L"}${x4.toFixed(2)},${y4.toFixed(2)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0].toFixed(2)},${H3} L${pts[0][0].toFixed(2)},${H3} Z`;
  return {
    line,
    area
  };
}
async function fetchSeries(endpoint, metric, days) {
  const end = Date.now();
  const start2 = end - days * 24 * 60 * 60 * 1e3;
  const url = `https://api.bunny.chaika.me/${endpoint}?StartDateTime=${new Date(start2).toISOString()}&EndDateTime=${new Date(end).toISOString()}&Metrics=${metric}`;
  const res = await fetch(url);
  const json = await res.json();
  const points = json?.data?.points ?? [];
  return points.map((p4) => {
    const x4 = p4.timePeriod ? new Date(p4.timePeriod).getTime() : null;
    let y4 = null;
    for (const k4 in p4) {
      if (k4 !== "timePeriod") {
        y4 = Number(p4[k4]);
        break;
      }
    }
    return {
      x: x4,
      y: y4
    };
  }).filter((p4) => p4.x != null && p4.y != null && isFinite(p4.y));
}
async function fetchErrors(errorEndpoint, days) {
  const end = Date.now();
  const start2 = end - days * 24 * 60 * 60 * 1e3;
  const url = `https://api.bunny.chaika.me/${errorEndpoint}?StartDateTime=${new Date(start2).toISOString()}&EndDateTime=${new Date(end).toISOString()}&Metrics=AvgRunLength`;
  const res = await fetch(url);
  const json = await res.json();
  const points = json?.data?.points ?? [];
  const byTime = /* @__PURE__ */ new Map();
  for (const p4 of points) {
    if (!p4.timePeriod) continue;
    const x4 = new Date(p4.timePeriod).getTime();
    byTime.set(x4, (byTime.get(x4) || 0) + (Number(p4.count) || 0));
  }
  return [...byTime.entries()].map(([x4, total]) => ({
    x: x4,
    total
  })).filter((p4) => p4.total > 0).sort((a4, b3) => a4.x - b3.x);
}
var W3, H3, PAD, Sparkline;
var init_Sparkline_mFdyPfsh = __esm({
  "dist/server/chunks/Sparkline_mFdyPfsh.mjs"() {
    "use strict";
    init_compat();
    init_jsxRuntime();
    W3 = 100;
    H3 = 32;
    PAD = 3;
    Sparkline = (props) => {
      const {
        endpoint,
        metric = "MedianRunLength",
        health = "good",
        days = 7,
        errorEndpoint = null
      } = props;
      const [ys, setYs] = d2(null);
      const [errors, setErrors] = d2([]);
      const [color, setColor] = d2(() => cssStatusColor(health));
      const [errColor, setErrColor] = d2(() => cssStatusColor("bad"));
      const id = A2("spark-" + Math.random().toString(36).slice(2, 9)).current;
      y2(() => {
        let alive = true;
        fetchSeries(endpoint, metric, days).then((vals) => alive && setYs(vals)).catch(() => alive && setYs([]));
        if (errorEndpoint) {
          fetchErrors(errorEndpoint, days).then((vals) => alive && setErrors(vals)).catch(() => alive && setErrors([]));
        }
        return () => {
          alive = false;
        };
      }, [endpoint, metric, days, errorEndpoint]);
      y2(() => {
        const onTheme = () => {
          setColor(cssStatusColor(health));
          setErrColor(cssStatusColor("bad"));
        };
        window.addEventListener("themeChange", onTheme);
        return () => window.removeEventListener("themeChange", onTheme);
      }, [health]);
      if (ys === null) {
        return u3("div", {
          className: "w-full animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
          style: {
            height: H3 + "px"
          }
        });
      }
      const hasLine = ys.length >= 2;
      const hasErrors = errors.length > 0;
      if (!hasLine && !hasErrors) return null;
      const allX = [...ys.map((p4) => p4.x), ...errors.map((p4) => p4.x)];
      const xMin = Math.min(...allX);
      const xMax = Math.max(...allX);
      const xSpan = xMax - xMin;
      const paths = hasLine ? buildPaths(ys, xMin, xSpan) : null;
      let bars = null;
      if (hasErrors) {
        const maxTotal = Math.max(...errors.map((p4) => p4.total));
        const bw = 2;
        bars = errors.map((p4, i5) => {
          const px = xSpan > 0 ? (p4.x - xMin) / xSpan * W3 : W3 / 2;
          const h4 = Math.max(1.5, p4.total / maxTotal * (H3 - PAD));
          return u3("rect", {
            x: (px - bw / 2).toFixed(2),
            y: (H3 - h4).toFixed(2),
            width: bw,
            height: h4.toFixed(2),
            fill: errColor,
            opacity: "0.35"
          }, i5);
        });
      }
      return u3("div", {
        className: "flex items-center gap-2 w-full",
        children: [u3("svg", {
          viewBox: `0 0 ${W3} ${H3}`,
          preserveAspectRatio: "none",
          className: "w-full",
          style: {
            height: H3 + "px"
          },
          role: "img",
          "aria-label": hasErrors ? "recent history with errors" : "recent history",
          children: [u3("defs", {
            children: u3("linearGradient", {
              id,
              x1: "0",
              y1: "0",
              x2: "0",
              y2: "1",
              children: [u3("stop", {
                offset: "0%",
                stopColor: color,
                stopOpacity: "0.22"
              }), u3("stop", {
                offset: "100%",
                stopColor: color,
                stopOpacity: "0"
              })]
            })
          }), paths && u3("path", {
            d: paths.area,
            fill: `url(#${id})`,
            stroke: "none"
          }), bars, paths && u3("path", {
            d: paths.line,
            fill: "none",
            stroke: color,
            strokeWidth: "1.75",
            strokeLinejoin: "round",
            strokeLinecap: "round",
            vectorEffect: "non-scaling-stroke"
          })]
        }), u3("span", {
          className: "text-gray text-xs whitespace-nowrap",
          children: ["\xB7", days, "d"]
        })]
      });
    };
  }
});

// dist/server/chunks/CategorySection_Du0Q6eY8.mjs
var $$CategorySection;
var init_CategorySection_Du0Q6eY8 = __esm({
  "dist/server/chunks/CategorySection_Du0Q6eY8.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    $$CategorySection = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$CategorySection;
      const { name, count, statusColor, open = false, bodyClass = "pt-5 pb-2" } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<details class="category-section" data-category${addAttribute(open, "open")} data-astro-cid-dnzhvhlx> <summary class="surface surface-hover flex items-center justify-between gap-3 cursor-pointer select-none px-4 py-3" data-astro-cid-dnzhvhlx> <span class="flex items-center gap-2.5 min-w-0" data-astro-cid-dnzhvhlx> ${statusColor && renderTemplate`<span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${statusColor}`, "class")} data-astro-cid-dnzhvhlx></span>`} <span class="font-semibold text-lg truncate" data-astro-cid-dnzhvhlx>${name}</span> <span class="shrink-0 text-sm text-gray-500 dark:text-gray-400 tabular-nums" data-count data-astro-cid-dnzhvhlx>${count}</span> </span> <svg class="chevron shrink-0 w-5 h-5 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-dnzhvhlx> <polyline points="6 9 12 15 18 9" data-astro-cid-dnzhvhlx></polyline> </svg> </summary> <div${addAttribute(bodyClass, "class")} data-astro-cid-dnzhvhlx> ${renderSlot($$result, $$slots["default"])} </div> </details>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/CategorySection.astro", void 0);
  }
});

// dist/server/chunks/jobCategories_v-ve9c3Y.mjs
function titleCase(s4) {
  return s4.split(/[-_]/).filter(Boolean).map((w4) => w4.charAt(0).toUpperCase() + w4.slice(1)).join(" ");
}
function perfProvider(job) {
  const seg = (job.internalJobName || job.jobName).toLowerCase().split("-")[0];
  if (!seg) return {
    key: OTHER_KEY,
    name: OTHER_NAME
  };
  return {
    key: seg,
    name: PERF_PROVIDER_NAMES[seg] ?? titleCase(seg)
  };
}
function perfWorkload(job) {
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const provider = perfProvider(job).name;
  for (const [rx, service, category] of PERF_WORKLOAD_RULES) {
    if (rx.test(name)) return {
      category,
      service,
      provider
    };
  }
  const seg = name.split("-")[1] ?? "";
  return {
    category: OTHER_NAME,
    service: seg ? titleCase(seg) : OTHER_NAME,
    provider
  };
}
function perfOperation(name) {
  if (name.includes("uploadanddownload")) return "Up+Down";
  const up = name.includes("upload");
  const down = name.includes("download");
  if (up && down) return "Up+Down";
  if (up) return "Upload";
  if (down) return "Download";
  return "";
}
function perfVariant(job) {
  const {
    category,
    service,
    provider
  } = perfWorkload(job);
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const operation = perfOperation(name);
  const parentLabel = operation ? `${service} ${operation}` : service;
  const parentKey = `${provider}|${service}|${operation}`;
  const strip = new Set(PERF_SERVICE_LEAD[service] ?? []);
  const toks = name.split("-").slice(1).filter((t4) => !PERF_OP_TOKENS.has(t4) && !strip.has(t4));
  const variantLabel = toks.length ? toks.map(titleCase).join(" \xB7 ") : "default";
  return {
    category,
    service,
    provider,
    operation,
    parentKey,
    parentLabel,
    variantLabel
  };
}
function aiAuthor(job) {
  const name = (job.internalJobName || job.jobName).toLowerCase();
  const parts = name.replace(/^@/, "").split("/");
  const author = parts.length >= 3 ? parts[1] : parts[0];
  if (!author) return {
    key: OTHER_KEY,
    name: OTHER_NAME
  };
  return {
    key: author,
    name: AI_AUTHOR_NAMES[author] ?? titleCase(author)
  };
}
function isPopularAiModel(job) {
  const model = (job.internalJobName || job.jobName).toLowerCase().split("/").pop() ?? "";
  return AI_POPULAR_MODEL_PREFIXES.some((p4) => model.startsWith(p4));
}
function groupJobs(jobs, type) {
  const visible = jobs.filter((j5) => !HIDDEN_JOBS.has(j5.internalJobName));
  if (type === "delay") {
    const buckets2 = /* @__PURE__ */ new Map();
    for (const job of visible) {
      const cat = DELAY_CATEGORY_BY_JOB.get(job.internalJobName);
      const key = cat ? cat.key : OTHER_KEY;
      (buckets2.get(key) ?? buckets2.set(key, []).get(key)).push(job);
    }
    const groups2 = [];
    for (const cat of DELAY_CATEGORIES) {
      const list = buckets2.get(cat.key);
      if (list && list.length) {
        groups2.push({
          key: cat.key,
          name: cat.name,
          jobs: sortJobs(list)
        });
      }
    }
    const other = buckets2.get(OTHER_KEY);
    if (other && other.length) {
      groups2.push({
        key: OTHER_KEY,
        name: OTHER_NAME,
        jobs: sortJobs(other)
      });
    }
    return groups2;
  }
  if (type === "perf") {
    const buckets2 = /* @__PURE__ */ new Map();
    for (const job of visible) {
      const {
        category
      } = perfWorkload(job);
      (buckets2.get(category) ?? buckets2.set(category, []).get(category)).push(job);
    }
    const groups2 = [];
    for (const category of PERF_WORKLOAD_ORDER) {
      const list = buckets2.get(category);
      if (list && list.length) {
        groups2.push({
          key: category,
          name: category,
          jobs: sortJobs(list)
        });
      }
    }
    return groups2;
  }
  const popular = visible.filter(isPopularAiModel);
  const rest = visible.filter((j5) => !isPopularAiModel(j5));
  const names = /* @__PURE__ */ new Map();
  const buckets = /* @__PURE__ */ new Map();
  for (const job of rest) {
    const {
      key,
      name
    } = aiAuthor(job);
    names.set(key, name);
    (buckets.get(key) ?? buckets.set(key, []).get(key)).push(job);
  }
  const keys = [...buckets.keys()].sort((a4, b3) => {
    if (a4 === OTHER_KEY) return 1;
    if (b3 === OTHER_KEY) return -1;
    return (names.get(a4) ?? a4).localeCompare(names.get(b3) ?? b3);
  });
  const groups = [];
  if (popular.length) {
    groups.push({
      key: AI_POPULAR_KEY,
      name: AI_POPULAR_NAME,
      jobs: sortJobs(popular)
    });
  }
  for (const key of keys) {
    groups.push({
      key,
      name: names.get(key) ?? key,
      jobs: sortJobs(buckets.get(key))
    });
  }
  return groups;
}
function sortJobs(jobs) {
  return [...jobs].sort((a4, b3) => a4.internalJobName.localeCompare(b3.internalJobName));
}
var DELAY_CATEGORIES, HIDDEN_JOBS, statusConfig, DELAY_CATEGORY_BY_JOB, OTHER_KEY, OTHER_NAME, PERF_PROVIDER_NAMES, AI_AUTHOR_NAMES, PERF_WORKLOAD_ORDER, PERF_WORKLOAD_RULES, PERF_SERVICE_LEAD, PERF_OP_TOKENS, AI_POPULAR_MODEL_PREFIXES, AI_POPULAR_KEY, AI_POPULAR_NAME;
var init_jobCategories_v_ve9c3Y = __esm({
  "dist/server/chunks/jobCategories_v-ve9c3Y.mjs"() {
    "use strict";
    DELAY_CATEGORIES = [{
      key: "dns",
      name: "DNS",
      items: [{
        jobName: "bunnydns",
        name: "DNS Update Delay"
      }]
    }, {
      key: "edge",
      name: "Edge",
      items: [{
        jobName: "bunnyedgerule",
        name: "Edge Rule Update Delay"
      }, {
        jobName: "bunnyedgescript",
        name: "Edge Script Delay"
      }]
    }, {
      key: "storage",
      name: "Storage",
      items: [{
        jobName: "bunnystoragereplication",
        name: "Storage Replication Delay"
      }]
    }, {
      key: "logging",
      name: "Logging",
      items: [{
        jobName: "bunnylogforwarder",
        name: "Log Forwarder Delay"
      }]
    }];
    HIDDEN_JOBS = /* @__PURE__ */ new Set(["workertesting"]);
    statusConfig = {
      groups: DELAY_CATEGORIES.map((c4) => ({
        name: c4.name,
        items: c4.items.map((i5) => ({
          name: i5.name,
          jobName: i5.jobName
        }))
      }))
    };
    DELAY_CATEGORY_BY_JOB = /* @__PURE__ */ new Map();
    for (const cat of DELAY_CATEGORIES) {
      for (const item of cat.items) DELAY_CATEGORY_BY_JOB.set(item.jobName, cat);
    }
    OTHER_KEY = "other";
    OTHER_NAME = "Other";
    PERF_PROVIDER_NAMES = {
      cloudflare: "Cloudflare",
      bunny: "Bunny",
      aws: "AWS",
      azure: "Azure",
      googlecloud: "Google Cloud",
      fastly: "Fastly",
      fly: "Fly.io",
      backblaze: "Backblaze",
      turso: "Turso",
      xenyth: "Xenyth"
    };
    AI_AUTHOR_NAMES = {
      meta: "Meta",
      "meta-llama": "Meta",
      mistral: "Mistral",
      mistralai: "Mistral",
      qwen: "Qwen",
      google: "Google",
      openai: "OpenAI",
      deepseek: "DeepSeek",
      "deepseek-ai": "DeepSeek",
      moonshotai: "Moonshot AI",
      baai: "BAAI",
      thebloke: "TheBloke",
      microsoft: "Microsoft",
      nvidia: "NVIDIA",
      "ai4bharat": "AI4Bharat",
      deepgram: "Deepgram",
      tiiuae: "TII",
      tinyllama: "TinyLlama",
      nexusflow: "Nexusflow",
      openchat: "OpenChat",
      fblgit: "FBL",
      nousresearch: "Nous Research",
      "zai-org": "Z.ai",
      "myshell-ai": "MyShell",
      pfnet: "PFN",
      "huggingface": "Hugging Face"
    };
    PERF_WORKLOAD_ORDER = ["Compute & Functions", "Object Storage", "Key-Value", "SQL & Databases", OTHER_NAME];
    PERF_WORKLOAD_RULES = [[/durableobjects/, "Durable Objects", "Key-Value"], [/(^|-)kv(-|$)/, "KV", "Key-Value"], [/(^|-)r2(-|$)/, "R2", "Object Storage"], [/(^|-)d1(-|$)/, "D1", "SQL & Databases"], [/edgedb/, "EdgeDB", "SQL & Databases"], [/turso/, "Turso", "SQL & Databases"], [/googlecloud-sql/, "Cloud SQL", "SQL & Databases"], [/aws-storage/, "S3", "Object Storage"], [/googlecloud-storage/, "Cloud Storage", "Object Storage"], [/ssdstorage/, "SSD Storage", "Object Storage"], [/(^|-)b2(-|$)/, "B2", "Object Storage"], [/tigris/, "Tigris", "Object Storage"], [/xenyth-os/, "Object Storage", "Object Storage"], [/lambda/, "Lambda", "Compute & Functions"], [/cloudfront-functions/, "CloudFront Functions", "Compute & Functions"], [/googlecloud-run/, "Cloud Run", "Compute & Functions"], [/containerapp/, "Container Apps", "Compute & Functions"], [/magiccontainers/, "Magic Containers", "Compute & Functions"], [/(^|-)containers(-|$)/, "Containers", "Compute & Functions"], [/(^|-)scripts(-|$)/, "Edge Scripting", "Compute & Functions"], [/(^|-)compute(-|$)/, "Compute", "Compute & Functions"], [/(^|-)pages(-|$)/, "Pages", "Compute & Functions"], [/workerassets/, "Worker Assets", "Compute & Functions"], [/python-worker/, "Python Workers", "Compute & Functions"], [/(^|-)worker(-|$)/, "Workers", "Compute & Functions"]];
    PERF_SERVICE_LEAD = {
      "Durable Objects": ["durableobjects"],
      KV: ["kv"],
      R2: ["r2"],
      D1: ["d1"],
      EdgeDB: ["edgedb"],
      Turso: ["db"],
      "Cloud SQL": ["sql"],
      S3: ["storage"],
      "Cloud Storage": ["storage"],
      "SSD Storage": ["ssdstorage"],
      B2: ["b2"],
      Tigris: ["tigris"],
      "Object Storage": ["os"],
      Lambda: ["lambda"],
      "CloudFront Functions": ["cloudfront", "functions"],
      "Cloud Run": ["run"],
      "Container Apps": ["containerapp"],
      "Magic Containers": ["magiccontainers"],
      Containers: ["containers"],
      "Edge Scripting": ["scripts"],
      Compute: ["compute"],
      Pages: ["pages"],
      "Worker Assets": ["workerassets"],
      "Python Workers": ["python", "worker"],
      Workers: ["worker"]
    };
    PERF_OP_TOKENS = /* @__PURE__ */ new Set(["upload", "download", "uploadanddownload"]);
    AI_POPULAR_MODEL_PREFIXES = ["kimi-", "glm-"];
    AI_POPULAR_KEY = "popular";
    AI_POPULAR_NAME = "Popular Models";
  }
});

// dist/server/chunks/delay_DvsC18Cy.mjs
var delay_DvsC18Cy_exports = {};
__export(delay_DvsC18Cy_exports, {
  page: () => page5
});
var $$JobDisplay, $$Grid, __freeze2, __defProp3, __template2, _a2, _b, $$Delay, $$file4, $$url4, _page5, page5;
var init_delay_DvsC18Cy = __esm({
  "dist/server/chunks/delay_DvsC18Cy.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Sparkline_mFdyPfsh();
    init_Hero_BVVSX7E2();
    init_CategorySection_Du0Q6eY8();
    init_jobCategories_v_ve9c3Y();
    $$JobDisplay = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$JobDisplay;
      let lastUpdatedTxt = "";
      let delayTxt = "";
      let delayTxtUnit = "";
      let pending = { className: "", textContent: "" };
      const job = Astro2.props.job;
      const type = Astro2.props.type;
      function formatTime(ms) {
        if (ms == void 0 || isNaN(ms)) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) {
          return seconds.toFixed(2) + " second(s)";
        }
        let minutes = seconds / 60;
        if (minutes < 60) {
          return minutes.toFixed(2) + " minute(s)";
        }
        let hours = minutes / 60;
        return hours.toFixed(2) + " hour(s)";
      }
      function formatTimeReturnUnit(ms) {
        if (ms == void 0) return ["", ""];
        let seconds = ms / 1e3;
        if (seconds < 60) {
          return [seconds.toFixed(2), `second(s)`];
        }
        let minutes = seconds / 60;
        if (minutes < 60) {
          return [minutes.toFixed(2), `minute(s)`];
        }
        let hours = minutes / 60;
        return [hours.toFixed(2), `hour(s)`];
      }
      let quickAnalyticsData = Astro2.props.stats;
      let peakPeriod, dailyMedian, getJobMedian, monthlyMedian, peakPeriodTxt, quarterlyMedian;
      quickAnalyticsData?.forEach((item) => {
        switch (item.period) {
          case "Last 1 Day":
            dailyMedian = formatTime(parseInt(item.median_run_length));
            if (item.median_run_length && parseInt(item.median_run_length) > 0)
              getJobMedian = parseInt(item.median_run_length);
            break;
          case "Last 30 Days":
            monthlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          case "Last 90 Days":
            quarterlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          default:
            peakPeriod = formatTime(parseInt(item.median_run_length));
            peakPeriodTxt = `From ${(/* @__PURE__ */ new Date(item.period + "Z")).toLocaleTimeString()} - ${new Date((/* @__PURE__ */ new Date(item.period + "Z")).getTime() + parseInt(item.median_run_length)).toLocaleTimeString()}`;
        }
      });
      var runTimeToUse = job.currentRunTime;
      job.currentRunLengthMs;
      if (job.currentRunStatus === "Deployed" || job.currentRunStatus === "Success") {
        if (job.internalJobName === "cron") {
          delayTxtUnit = "Last Event: " + formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(job.currentRunTime).getTime()) + " ago";
        } else {
          [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        }
        pending.className = "";
        pending.textContent = "";
      } else if (job.currentRunStatus === "Undeployed" && ((!getJobMedian || (job.currentRunLengthMs ?? 0) > getJobMedian * 1.2) && (job.currentRunLengthMs ?? 0) > 5e3)) {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        if ((!getJobMedian || (job.currentRunLengthMs ?? 0) * 3 > getJobMedian) && (job.currentRunLengthMs ?? 0) > 3e4) {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightRed";
        } else {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightYellow";
        }
      } else if (job.currentRunStatus == "API_Error" && job.lastRunStatus == "API_Error") {
        delayTxt = "CF API Error";
        delayTxtUnit = "";
        pending.textContent = "CF API Error";
        pending.className = "highlightRed";
      } else if (job.currentRunStatus === "Failure") {
        delayTxt = "Error";
        delayTxtUnit = "";
        pending.textContent = "Error";
        pending.className = "highlightRed";
      } else {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.lastRunLengthMs);
        pending.className = "";
        pending.textContent = "";
        runTimeToUse = job.lastRunTime;
        job.lastRunLengthMs;
      }
      let noLastUpdate = false;
      lastUpdatedTxt = formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(runTimeToUse ?? "").getTime()) + " ago";
      if (job.internalJobName === "cron") {
        noLastUpdate = true;
      }
      const hasIncident = Astro2.props.hasIncident ?? false;
      const health = jobHealth(job, hasIncident);
      const dot = dotClass(health);
      const sparkEnc = job.internalJobName.replaceAll("/", "%2F");
      const sparkEndpoint = `v2/jobs/${sparkEnc}/analytics`;
      const sparkMetric = type === "perf" || type === "ai" ? "MedianApiResponseLatency" : "MedianRunLength";
      const sparkErrorEndpoint = type === "ai" ? `v2/jobs/${sparkEnc}/erroranalytics` : void 0;
      return renderTemplate`${maybeRenderHead()}<div class="relative w-full min-w-0 min-h-80 surface surface-hover p-6 flex flex-col"${addAttribute(`${job.internalJobName}grid`, "id")} data-astro-cid-snl3mfmd> ${hasIncident && renderTemplate`<div class="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full" data-astro-cid-snl3mfmd>Incident</div>`} <div class="flex items-center justify-between gap-2 mb-4" data-astro-cid-snl3mfmd> <span class="flex items-center gap-1.5 min-w-0" data-astro-cid-snl3mfmd> <a${addAttribute(`/${type}/${job.internalJobName}`, "href")} class="text-lg font-semibold text-[var(--accent-regular)] hover:underline break-words leading-tight" data-astro-cid-snl3mfmd>${job.jobName.replaceAll("Job", "").trimEnd()}</a> ${job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(job.jobDescription, "title")} data-astro-cid-snl3mfmd>?</span>`} </span> <span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dot}`, "class")}${addAttribute(health, "title")} data-astro-cid-snl3mfmd></span> </div> <div class="text-5xl font-bold text-center mb-1"${addAttribute(`delayNumberOuter${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd><span class="text-5xl font-bold text-center"${addAttribute(`delayNumber${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${delayTxt}</span> <span class="text-lg"${addAttribute(`delayUnit${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${delayTxtUnit}</span>${type === "ai" && renderTemplate`<span class="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] align-middle cursor-help" title="For 100 output tokens" data-astro-cid-snl3mfmd>?</span>`}</div> <div${addAttribute(`${pending.className} text-center mb-1 h-4`, "class")}${addAttribute(`pending${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${pending.textContent}</div> ${noLastUpdate ? null : renderTemplate`<div class="text-gray text-xs text-center mb-3"${addAttribute(`lastUpdate${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>Last Update: ${lastUpdatedTxt}</div>`} <div class="mt-1 mb-3" data-astro-cid-snl3mfmd> ${renderComponent($$result, "Sparkline", Sparkline, { "endpoint": sparkEndpoint, "metric": sparkMetric, "errorEndpoint": sparkErrorEndpoint, "health": health, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx", "client:component-export": "default", "data-astro-cid-snl3mfmd": true })} </div> <div class="mt-auto flex justify-center gap-6 border-t pt-3" data-astro-cid-snl3mfmd> ${dailyMedian && renderTemplate`<div class="text-center" data-astro-cid-snl3mfmd> <div class="text-gray text-xs" data-astro-cid-snl3mfmd>1 Day</div> <div class="font-semibold"${addAttribute(`median1d${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${dailyMedian}</div> </div>`} ${monthlyMedian && renderTemplate`<div class="text-center" data-astro-cid-snl3mfmd> <div class="text-gray text-xs" data-astro-cid-snl3mfmd>30 Days</div> <div class="font-semibold"${addAttribute(`median30d${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${monthlyMedian}</div> </div>`} ${quarterlyMedian && renderTemplate`<div class="text-center" data-astro-cid-snl3mfmd> <div class="text-gray text-xs" data-astro-cid-snl3mfmd>90 Days</div> <div class="font-semibold"${addAttribute(`median${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${quarterlyMedian}</div> </div>`} </div> ${!peakPeriod ? null : renderTemplate`<div class="text-center mt-3" data-astro-cid-snl3mfmd> <span class="text-gray text-xs" data-astro-cid-snl3mfmd>24H Peak: </span> <span class="text-gray text-xs font-semibold"${addAttribute(`peak${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${peakPeriod}</span> <div class="text-gray text-xs"${addAttribute(`peak-period${job.internalJobName}`, "id")} data-astro-cid-snl3mfmd>${peakPeriodTxt}</div> </div>`} ${type === "delay" && job.predictedDelayLengthMs && job.predictedDelayLengthMs > 0 && renderTemplate`<div class="text-gray text-xs text-center mt-2 italic" data-astro-cid-snl3mfmd>
Predicted: ~${formatTimeReturnUnit(job.predictedDelayLengthMs).join(" ")} </div>`} </div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobDisplay.astro", void 0);
    $$Grid = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$Grid;
      const { variant } = Astro2.props;
      return renderTemplate`${maybeRenderHead()}<ul${addAttribute(["grid", { offset: variant === "offset", small: variant === "small" }], "class:list")} data-astro-cid-vc5tsdmu> ${renderSlot($$result, $$slots["default"])} </ul>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Grid.astro", void 0);
    __freeze2 = Object.freeze;
    __defProp3 = Object.defineProperty;
    __template2 = (cooked, raw) => __freeze2(__defProp3(cooked, "raw", { value: __freeze2(cooked.slice()) }));
    $$Delay = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch(
          "https://delay.cloudflare.chaika.me/v2/jobs/type/BunnyDelay"
        )).json()).data;
      };
      const getAnalytics = async () => {
        return await (await fetch(
          "https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/type/BunnyDelay"
        )).json();
      };
      const getOverallAnalytics = async () => {
        try {
          const r4 = await fetch("https://delay.cloudflare.chaika.me/v2/jobs/OverallAnalytics");
          if (!r4.ok) return null;
          const json = await r4.json();
          return json.data ?? json;
        } catch {
          return null;
        }
      };
      const getIncidents = async () => {
        try {
          const r4 = await fetch("https://delay.cloudflare.chaika.me/v2/incidents/type/BunnyDelay");
          return r4.ok ? (await r4.json()).data ?? [] : [];
        } catch {
          return [];
        }
      };
      const [jobs, stats, overall, incidents] = await Promise.all([
        getJobs(),
        getAnalytics(),
        getOverallAnalytics(),
        getIncidents()
      ]);
      const groups = groupJobs(jobs, "delay");
      const visibleJobs = groups.flatMap((g5) => g5.jobs);
      const hasIncident = (job) => incidents.some((i5) => i5.target === job.internalJobName && i5.active);
      const groupIssue = (groupJobsList) => groupJobsList.some(
        (j5) => hasIncident(j5) || j5.predictedRunStatus === "API_Error" || j5.type === "delayed"
      );
      return renderTemplate(_b || (_b = __template2(["<script>(function(){", "\nglobalThis.jobData = visibleJobs;\nglobalThis.jobStats = stats;\n})();</script> ", ""])), defineScriptVars({ visibleJobs, stats }), renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Bunny Delay Monitoring", "description": "See Bunny Delay Monitoring Jobs" }, { "default": async ($$result2) => renderTemplate(_a2 || (_a2 = __template2([" ", '<div class="stack gap-20"> <main class="wrapper stack gap-8"> ', ' <a id="websocket-conn-status">Disconnected</a> ', ' <input id="job-filter" type="text" placeholder="Filter jobs..." class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"> <div class="stack gap-4"> ', " </div> ", ' <script src="/assets/js/8.0.7/signalr.min.js"> </script> <script src="/assets/js/8.0.7/signalr-protocol-msgpack.min.js"> </script> ', " </main> </div> "])), maybeRenderHead(), renderComponent($$result2, "Hero", $$Hero, { "title": "Bunny Delay Jobs", "tagline": "See the delay between an action being performed (DNS Update, Worker Update, etc) and it being visible on edge from 50+ locations worldwide.", "align": "start" }, { "default": async ($$result3) => renderTemplate` <a href="/delay/overview">Overview</a> ` }), overall && renderTemplate`<div class="flex flex-wrap gap-6 justify-center text-sm py-2 border-t border-b border-gray-200 dark:border-gray-700"> <span><strong class="text-gray-900 dark:text-white">${overall.uniqueJobs}</strong> delay jobs</span> <span><strong class="text-gray-900 dark:text-white">${overall.uniqueLocations}</strong> locations</span> <span><strong class="text-gray-900 dark:text-white">${(overall.normalJobPerLocationRunsLast24H ?? 0).toLocaleString()}</strong> location-runs in last 24h</span> </div>`, groups.map((group) => renderTemplate`${renderComponent($$result2, "CategorySection", $$CategorySection, { "name": group.name, "count": group.jobs.length, "statusColor": groupIssue(group.jobs) ? "bg-yellow-500" : "bg-green-500", "open": true }, { "default": async ($$result3) => renderTemplate` ${renderComponent($$result3, "Grid", $$Grid, {}, { "default": async ($$result4) => renderTemplate`${group.jobs.map((job) => renderTemplate`<li> ${renderComponent($$result4, "JobDisplay", $$JobDisplay, { "type": "job", "job": job, "stats": stats.filter(
        (stat) => stat.job_name.toLowerCase() == job.internalJobName
      ), "hasIncident": hasIncident(job) })} </li>`)}` })} ` })}`), renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts"), renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=1&lang.ts")) }));
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro", void 0);
    $$file4 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro";
    $$url4 = "/delay";
    _page5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Delay,
      file: $$file4,
      url: $$url4
    }, Symbol.toStringTag, { value: "Module" }));
    page5 = () => _page5;
  }
});

// dist/server/chunks/_.._Bhkw4d1d.mjs
var Bhkw4d1d_exports = {};
__export(Bhkw4d1d_exports, {
  page: () => page6
});
var $$, $$file5, $$url5, _page6, page6;
var init_Bhkw4d1d = __esm({
  "dist/server/chunks/_.._Bhkw4d1d.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    $$ = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$;
      console.log(Astro2.params);
      return renderTemplate`${maybeRenderHead()}<div> <!-- @ts-ignore --> ${renderComponent($$result, "SmartGraph", null, { "endpoint": Astro2.url.searchParams.get("endpoint"), "label": Astro2.url.searchParams.get("label"), "options": Astro2.url.searchParams.get("options"), "fullscreen": "true", "client:only": "preact", "client:component-hydration": "only", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" })} </div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/graph/[...type].astro", void 0);
    $$file5 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/graph/[...type].astro";
    $$url5 = "/graph/[...type]";
    _page6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$,
      file: $$file5,
      url: $$url5
    }, Symbol.toStringTag, { value: "Module" }));
    page6 = () => _page6;
  }
});

// dist/server/chunks/JobDetailHeader_B2bcKEVm.mjs
var $$JobDetailHeader;
var init_JobDetailHeader_B2bcKEVm = __esm({
  "dist/server/chunks/JobDetailHeader_B2bcKEVm.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_Sparkline_mFdyPfsh();
    $$JobDetailHeader = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$JobDetailHeader;
      const { job, stats, type, successRate = null } = Astro2.props;
      function formatTime(ms) {
        if (ms == void 0 || isNaN(ms)) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) return seconds.toFixed(2) + " second(s)";
        let minutes = seconds / 60;
        if (minutes < 60) return minutes.toFixed(2) + " minute(s)";
        let hours = minutes / 60;
        return hours.toFixed(2) + " hour(s)";
      }
      function formatTimeReturnUnit(ms) {
        if (ms == void 0) return ["", ""];
        let seconds = ms / 1e3;
        if (seconds < 60) return [seconds.toFixed(2), `second(s)`];
        let minutes = seconds / 60;
        if (minutes < 60) return [minutes.toFixed(2), `minute(s)`];
        let hours = minutes / 60;
        return [hours.toFixed(2), `hour(s)`];
      }
      let delayTxt = "";
      let delayTxtUnit = "";
      let pending = { className: "", textContent: "" };
      let peakPeriod, dailyMedian, getJobMedian, monthlyMedian, peakPeriodTxt, quarterlyMedian;
      stats?.forEach((item) => {
        switch (item.period) {
          case "Last 1 Day":
            dailyMedian = formatTime(parseInt(item.median_run_length));
            if (item.median_run_length && parseInt(item.median_run_length) > 0)
              getJobMedian = parseInt(item.median_run_length);
            break;
          case "Last 30 Days":
            monthlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          case "Last 90 Days":
            quarterlyMedian = formatTime(parseInt(item.median_run_length));
            break;
          default:
            peakPeriod = formatTime(parseInt(item.median_run_length));
            peakPeriodTxt = `From ${(/* @__PURE__ */ new Date(item.period + "Z")).toLocaleTimeString()} - ${new Date((/* @__PURE__ */ new Date(item.period + "Z")).getTime() + parseInt(item.median_run_length)).toLocaleTimeString()}`;
        }
      });
      let runTimeToUse = job.currentRunTime;
      if (job.currentRunStatus === "Deployed" || job.currentRunStatus === "Success") {
        if (job.internalJobName === "cron") {
          delayTxtUnit = "Last Event: " + formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(job.currentRunTime).getTime()) + " ago";
        } else {
          [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        }
        pending.className = "";
        pending.textContent = "";
      } else if (job.currentRunStatus === "Undeployed" && ((!getJobMedian || (job.currentRunLengthMs ?? 0) > getJobMedian * 1.2) && (job.currentRunLengthMs ?? 0) > 5e3)) {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.currentRunLengthMs);
        if ((!getJobMedian || (job.currentRunLengthMs ?? 0) * 3 > getJobMedian) && (job.currentRunLengthMs ?? 0) > 3e4) {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightRed";
        } else {
          pending.textContent = "IN PROGRESS";
          pending.className = "highlightYellow";
        }
      } else if (job.currentRunStatus == "API_Error" && job.lastRunStatus == "API_Error") {
        delayTxt = "CF API Error";
        delayTxtUnit = "";
        pending.textContent = "CF API Error";
        pending.className = "highlightRed";
      } else if (job.currentRunStatus === "Failure") {
        delayTxt = "Error";
        delayTxtUnit = "";
        pending.textContent = "Error";
        pending.className = "highlightRed";
      } else {
        [delayTxt, delayTxtUnit] = formatTimeReturnUnit(job.lastRunLengthMs);
        pending.className = "";
        pending.textContent = "";
        runTimeToUse = job.lastRunTime;
      }
      const noLastUpdate = job.internalJobName === "cron";
      const lastUpdatedTxt = formatTime((/* @__PURE__ */ new Date()).getTime() - new Date(runTimeToUse ?? "").getTime()) + " ago";
      const health = jobHealth(job);
      const dot = dotClass(health);
      const sparkEndpoint = `v2/jobs/${job.internalJobName.replaceAll("/", "%2F")}/analytics`;
      const sparkMetric = type === "perf" || type === "ai" ? "MedianApiResponseLatency" : "MedianRunLength";
      const predicted = job.predictedDelayLengthMs && job.predictedDelayLengthMs > 0 ? formatTimeReturnUnit(job.predictedDelayLengthMs).join(" ") : "";
      return renderTemplate`${maybeRenderHead()}<div class="surface px-5 py-4 flex flex-col md:flex-row md:items-center gap-4 md:gap-6"> <!-- Value + sparkline --> <div class="flex items-center gap-4 md:border-r md:border-gray-200 md:dark:border-gray-700 md:pr-6"> <span${addAttribute(`shrink-0 w-3 h-3 rounded-full ${dot}`, "class")}${addAttribute(health, "title")}></span> <div class="min-w-0"> <div${addAttribute(`delayNumberOuter${job.internalJobName}`, "id")} class="leading-none"> <span class="text-3xl md:text-4xl font-bold"${addAttribute(`delayNumber${job.internalJobName}`, "id")}>${delayTxt}</span> <span class="text-base text-gray"${addAttribute(`delayUnit${job.internalJobName}`, "id")}>${delayTxtUnit}</span> ${type === "ai" && renderTemplate`<span class="inline-flex items-center justify-center w-4 h-4 ml-1 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] align-middle cursor-help" title="For 100 output tokens">?</span>`} </div> <div${addAttribute(`${pending.className} text-xs mt-1 h-4`, "class")}${addAttribute(`pending${job.internalJobName}`, "id")}>${pending.textContent}</div> </div> <div class="hidden sm:flex flex-col items-center w-32 shrink-0"> ${renderComponent($$result, "Sparkline", Sparkline, { "endpoint": sparkEndpoint, "metric": sparkMetric, "health": health, "days": 7, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx", "client:component-export": "default" })} </div> </div> <!-- Stat chips --> <div class="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"> ${noLastUpdate ? null : renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">Last Update</span> <span class="font-semibold"${addAttribute(`lastUpdate${job.internalJobName}`, "id")}>${lastUpdatedTxt}</span> </div>`} ${successRate != null && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">Success (24h)</span> <span class="font-semibold">${successRate.toFixed(1)}%</span> </div>`} ${dailyMedian && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">1 Day</span> <span class="font-semibold"${addAttribute(`median1d${job.internalJobName}`, "id")}>${dailyMedian}</span> </div>`} ${monthlyMedian && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">30 Days</span> <span class="font-semibold"${addAttribute(`median30d${job.internalJobName}`, "id")}>${monthlyMedian}</span> </div>`} ${quarterlyMedian && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">90 Days</span> <span class="font-semibold"${addAttribute(`median90d${job.internalJobName}`, "id")}>${quarterlyMedian}</span> </div>`} ${peakPeriod && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">24H Peak</span> <span class="font-semibold"${addAttribute(`peak${job.internalJobName}`, "id")}>${peakPeriod}</span> <span class="text-gray text-[10px]"${addAttribute(`peak-period${job.internalJobName}`, "id")}>${peakPeriodTxt}</span> </div>`} ${predicted && renderTemplate`<div class="flex flex-col"> <span class="text-gray text-xs">Predicted</span> <span class="font-semibold italic">~${predicted}</span> </div>`} </div> </div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobDetailHeader.astro", void 0);
  }
});

// dist/server/chunks/_.._Dbp6o_J6.mjs
var Dbp6o_J6_exports = {};
__export(Dbp6o_J6_exports, {
  page: () => page7
});
var __freeze3, __defProp4, __template3, _a3, $$2, $$file6, $$url6, _page7, page7;
var init_Dbp6o_J6 = __esm({
  "dist/server/chunks/_.._Dbp6o_J6.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Hero_BVVSX7E2();
    init_JobDetailHeader_B2bcKEVm();
    __freeze3 = Object.freeze;
    __defProp4 = Object.defineProperty;
    __template3 = (cooked, raw) => __freeze3(__defProp4(cooked, "raw", { value: __freeze3(cooked.slice()) }));
    $$2 = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$2;
      const { internalJobName } = Astro2.params;
      const jobResp = await fetch("https://delay.cloudflare.chaika.me/v2/jobs/" + internalJobName);
      let job = (await jobResp.json()).data;
      if (!job) {
        job = { internalJobName: internalJobName ?? "" };
        console.log(`job was null`);
      }
      const quickAnalyticsResponse = await fetch("https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/" + (job?.internalJobName ?? job?.jobName));
      let quickAnalyticsData = [];
      if (quickAnalyticsResponse.ok) {
        quickAnalyticsData = await quickAnalyticsResponse.json();
      }
      const enc = job.internalJobName;
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": job?.jobName ?? "", "description": job?.jobDescription ?? "", "data-astro-cid-7pcdk3iz": true }, { "default": async ($$result2) => renderTemplate(_a3 || (_a3 = __template3([" ", '<div class="stack gap-8" data-astro-cid-7pcdk3iz> <header class="wrapper stack gap-3" data-astro-cid-7pcdk3iz> <a class="back-link" href="/delay/" data-astro-cid-7pcdk3iz>', "All Jobs</a> ", " ", ' </header> <main class="wrapper stack gap-6" data-astro-cid-7pcdk3iz> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-astro-cid-7pcdk3iz> <div class="surface p-4" data-astro-cid-7pcdk3iz> ', ' </div> <div class="surface p-4" data-astro-cid-7pcdk3iz> ', ' </div> <div class="surface p-4 lg:col-span-2" data-astro-cid-7pcdk3iz> ', ' </div> </div> <div class="surface p-2" data-astro-cid-7pcdk3iz> ', ' </div> <details id="region-breakdown" class="surface p-4" open data-astro-cid-7pcdk3iz> <summary class="cursor-pointer font-semibold text-lg" data-astro-cid-7pcdk3iz>Regional Breakdown</summary> ', ' </details> <details class="surface p-4" open data-astro-cid-7pcdk3iz> <summary class="cursor-pointer font-semibold text-lg" data-astro-cid-7pcdk3iz>Geographic Map</summary> <iframe id="jobmapiframe" src="https://jobmap.cloudflare.chaika.me/" width="100%" style="height: 70vh !important;" class="mt-3 rounded-lg" data-astro-cid-7pcdk3iz></iframe> </details> </main> </div> <script>(function(){', '\n		globalThis.jobStats = quickAnalyticsData;\n		globalThis.jobData = job;\n		globalThis.jobName = job.internalJobName;\n	})();</script> <script src="../assets/js/8.0.7/signalr.min.js"> </script> <script src="../assets/js/8.0.7/signalr-protocol-msgpack.min.js"> </script> ', " "])), maybeRenderHead(), renderComponent($$result2, "Icon", $$Icon, { "icon": "arrow-left", "data-astro-cid-7pcdk3iz": true }), renderComponent($$result2, "Hero", $$Hero, { "title": job?.jobName, "align": "start", "data-astro-cid-7pcdk3iz": true }, { "default": async ($$result3) => renderTemplate` <p data-astro-cid-7pcdk3iz>${job?.jobDescription}</p> <a id="websocket-conn-status" data-astro-cid-7pcdk3iz>Disconnected</a> ` }), renderComponent($$result2, "JobDetailHeader", $$JobDetailHeader, { "job": job, "stats": quickAnalyticsData, "type": "job", "data-astro-cid-7pcdk3iz": true }), renderComponent($$result2, "SmartGraph", null, { "endpoint": `v2/jobs/${enc}/analytics`, "label": job.jobName, "options": ["MedianRunLength", "MinRunLength", "MaxRunLength", "AvgRunLength"], "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-7pcdk3iz": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" }), renderComponent($$result2, "SmartGraph", null, { "endpoint": `v2/jobs/${enc}/analytics`, "label": job.jobName, "options": ["AvgApiResponseLatency", "MedianApiResponseLatency", "MinApiResponseLatency", "MaxApiResponseLatency"], "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-7pcdk3iz": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" }), renderComponent($$result2, "SmartGraph", null, { "endpoint": `v2/jobs/${enc}/analytics`, "label": job.jobName, "options": ["MedianEdgeResponseLatency", "AvgEdgeResponseLatency", "MinEdgeResponseLatency", "MaxEdgeResponseLatency"], "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-7pcdk3iz": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" }), renderComponent($$result2, "ErrorGraph", null, { "endpoint": `v2/jobs/${enc}/erroranalytics`, "label": job.jobName, "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-7pcdk3iz": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph", "client:component-export": "default" }), renderComponent($$result2, "RegionGraphLazy", null, { "detailsId": "region-breakdown", "jobName": job.internalJobName, "label": job.jobName, "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-7pcdk3iz": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js", "client:component-export": "default" }), defineScriptVars({ quickAnalyticsData, job }), renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro?astro&type=script&index=0&lang.ts")) })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro", void 0);
    $$file6 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro";
    $$url6 = "/job/[...internalJobName]";
    _page7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$2,
      file: $$file6,
      url: $$url6
    }, Symbol.toStringTag, { value: "Module" }));
    page7 = () => _page7;
  }
});

// dist/server/chunks/locations_hNNaoz-T.mjs
var locations_hNNaoz_T_exports = {};
__export(locations_hNNaoz_T_exports, {
  page: () => page8
});
var $$Locations, $$file7, $$url7, _page8, page8;
var init_locations_hNNaoz_T = __esm({
  "dist/server/chunks/locations_hNNaoz-T.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    $$Locations = createComponent(async ($$result, $$props, $$slots) => {
      const locResp = await fetch("https://delay.cloudflare.chaika.me/v2/locations");
      let locations = [];
      if (locResp.ok) {
        const json = await locResp.json();
        locations = json.data ?? [];
      }
      const REGION_ORDER = ["NA", "EU", "AS", "OC", "SA", "AF", "ME"];
      const REGION_NAMES = {
        NA: "North America",
        EU: "Europe",
        AS: "Asia-Pacific",
        OC: "Oceania",
        SA: "South America",
        AF: "Africa",
        ME: "Middle East"
      };
      locations.sort((a4, b3) => {
        const ra = a4.friendlyRegionName ?? "";
        const rb = b3.friendlyRegionName ?? "";
        const ri = REGION_ORDER.indexOf(ra) === -1 ? 99 : REGION_ORDER.indexOf(ra);
        const rj = REGION_ORDER.indexOf(rb) === -1 ? 99 : REGION_ORDER.indexOf(rb);
        if (ri !== rj) return ri - rj;
        const pa = (a4.provider ?? "").toLowerCase();
        const pb = (b3.provider ?? "").toLowerCase();
        if (pa < pb) return -1;
        if (pa > pb) return 1;
        if (a4.locationName < b3.locationName) return -1;
        if (a4.locationName > b3.locationName) return 1;
        return 0;
      });
      const regionCount = new Set(locations.map((l4) => l4.friendlyRegionName)).size;
      const grouped = /* @__PURE__ */ new Map();
      for (const loc of locations) {
        const key = loc.friendlyRegionName ?? "Other";
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key).push(loc);
      }
      const orderedGroups = [...grouped.entries()].sort(([a4], [b3]) => {
        const ai = REGION_ORDER.indexOf(a4) === -1 ? 99 : REGION_ORDER.indexOf(a4);
        const bi = REGION_ORDER.indexOf(b3) === -1 ? 99 : REGION_ORDER.indexOf(b3);
        return ai - bi;
      });
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Locations", "description": "Edge agent locations used for Bunny propagation delay and performance monitoring" }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="wrapper stack gap-8"> <header> <h1 class="text-3xl font-bold">Locations</h1> <p class="text-gray-500 mt-1">${locations.length} monitoring agents across ${regionCount} regions</p> <p class="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-2xl">
These are the distributed monitoring agents used for Bunny propagation-delay and performance
				monitoring. Each agent polls from its location to detect when a change — such as an Edge Script
				deployment or DNS update — becomes visible at that edge.
</p> </header> <div class="mb-2"> <input id="location-filter" type="text" placeholder="Filter locations..." class="w-full max-w-sm px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-900 text-sm"> </div> <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"> <table class="w-full text-sm border-collapse"> <thead> <tr class="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400"> <th class="py-2.5 px-3">IATA</th> <th class="py-2.5 px-3">Location</th> <th class="py-2.5 px-3">Provider</th> <th class="py-2.5 px-3">Active</th> </tr> </thead> <tbody> ${orderedGroups.flatMap(([region, locs]) => [
        renderTemplate`<tr class="region-header bg-gray-100 dark:bg-gray-800"> <td colspan="4" class="py-1.5 px-3 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400"> ${REGION_NAMES[region] ?? region} <span class="font-normal normal-case opacity-60">(${region})</span> &mdash; ${locs.length} location${locs.length !== 1 ? "s" : ""} </td> </tr>`,
        ...locs.map((loc) => renderTemplate`<tr${addAttribute(`${loc.iata}-row`, "id")}${addAttribute(`border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors${!loc.enabled ? " opacity-40" : ""}`, "class")}> <td class="py-2 px-3"> <span class="font-mono font-bold text-sm">${loc.iata}</span> </td> <td class="py-2 px-3"> ${loc.friendlyLocationName ?? loc.locationName} </td> <td class="py-2 px-3 text-gray-500 dark:text-gray-400"> ${loc.provider} </td> <td class="py-2 px-3"> ${loc.enabled ? renderTemplate`<span class="text-green-600 dark:text-green-400 font-semibold">✓</span>` : renderTemplate`<span class="text-gray-400">✗</span>`} </td> </tr>`)
      ])} </tbody> </table> </div> </div> ` })} ${renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts")}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro", void 0);
    $$file7 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro";
    $$url7 = "/locations";
    _page8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Locations,
      file: $$file7,
      url: $$url7
    }, Symbol.toStringTag, { value: "Module" }));
    page8 = () => _page8;
  }
});

// dist/server/chunks/new-test_CtmJuNtA.mjs
var new_test_CtmJuNtA_exports = {};
__export(new_test_CtmJuNtA_exports, {
  page: () => page9
});
var prerender, $$NewTest, $$file8, $$url8, _page9, page9;
var init_new_test_CtmJuNtA = __esm({
  "dist/server/chunks/new-test_CtmJuNtA.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    prerender = false;
    $$NewTest = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$NewTest;
      return renderTemplate`${maybeRenderHead()}<div>Your IP address is: <span class="address">${Astro2.clientAddress}</span></div>`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/new-test.astro", void 0);
    $$file8 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/new-test.astro";
    $$url8 = "/new-test";
    _page9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$NewTest,
      file: $$file8,
      prerender,
      url: $$url8
    }, Symbol.toStringTag, { value: "Module" }));
    page9 = () => _page9;
  }
});

// dist/server/chunks/perf_BPP5ar1Q.mjs
var perf_BPP5ar1Q_exports = {};
__export(perf_BPP5ar1Q_exports, {
  page: () => page10
});
var $$PerfTable, $$Perf, $$file9, $$url9, _page10, page10;
var init_perf_BPP5ar1Q = __esm({
  "dist/server/chunks/perf_BPP5ar1Q.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_jobCategories_v_ve9c3Y();
    init_Sparkline_mFdyPfsh();
    init_CategorySection_Du0Q6eY8();
    init_Hero_BVVSX7E2();
    $$PerfTable = createComponent(($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$PerfTable;
      const { groups, stats } = Astro2.props;
      function fmtLatency(ms) {
        if (ms == null || isNaN(ms)) return "\u2014";
        if (ms < 1e3) return `${ms < 10 ? ms.toFixed(1) : Math.round(ms)} ms`;
        if (ms < 6e4) return `${(ms / 1e3).toFixed(2)} s`;
        return `${(ms / 6e4).toFixed(2)} min`;
      }
      function p50(jobName, period) {
        const s4 = stats?.find(
          (x4) => x4.job_name?.toLowerCase() === jobName.toLowerCase() && x4.period === period
        );
        const v4 = s4 ? parseInt(s4.median_run_length) : NaN;
        return isNaN(v4) ? null : v4;
      }
      function nowLatency(job) {
        if (job.currentRunStatus === "API_Error" && job.lastRunStatus === "API_Error") {
          return { ms: null, apiError: true };
        }
        if (job.currentRunStatus === "Deployed") {
          return { ms: job.currentRunLengthMs ?? null, apiError: false };
        }
        return { ms: job.lastRunLengthMs ?? job.currentRunLengthMs ?? null, apiError: false };
      }
      const SORT_LAST = Number.MAX_SAFE_INTEGER;
      function buildParents(jobs) {
        const map = /* @__PURE__ */ new Map();
        for (const job of jobs) {
          const wl = perfVariant(job);
          const v4 = {
            job,
            variantLabel: wl.variantLabel,
            now: nowLatency(job),
            p1: p50(job.internalJobName, "Last 1 Day"),
            p30: p50(job.internalJobName, "Last 30 Days"),
            health: jobHealth(job, false),
            enc: job.internalJobName.replaceAll("/", "%2F")
          };
          let p4 = map.get(wl.parentKey);
          if (!p4) {
            p4 = { key: wl.parentKey, label: wl.parentLabel, provider: wl.provider, variants: [], rep: v4, count: 0, health: "good" };
            map.set(wl.parentKey, p4);
          }
          p4.variants.push(v4);
        }
        const parents = [...map.values()];
        for (const p4 of parents) {
          p4.variants.sort((a4, b3) => (a4.p1 ?? SORT_LAST) - (b3.p1 ?? SORT_LAST));
          p4.count = p4.variants.length;
          p4.rep = p4.variants[Math.floor((p4.count - 1) / 2)];
          p4.health = p4.variants.some((x4) => x4.health === "bad") ? "bad" : p4.variants.some((x4) => x4.health === "elevated") ? "elevated" : "good";
        }
        parents.sort((a4, b3) => {
          const ga = a4.count > 1 ? 0 : 1;
          const gb = b3.count > 1 ? 0 : 1;
          if (ga !== gb) return ga - gb;
          return (a4.rep.p1 ?? SORT_LAST) - (b3.rep.p1 ?? SORT_LAST);
        });
        return parents;
      }
      function groupDot(jobs) {
        let worst = "good";
        for (const j5 of jobs) {
          const h4 = jobHealth(j5, false);
          if (h4 === "bad") return dotClass("bad");
          if (h4 === "elevated") worst = "elevated";
        }
        return dotClass(worst);
      }
      const built = groups.map((group) => ({ group, parents: buildParents(group.jobs) }));
      return renderTemplate`${built.map(({ group, parents }) => renderTemplate`${renderComponent($$result, "CategorySection", $$CategorySection, { "name": group.name, "count": parents.length, "statusColor": groupDot(group.jobs), "bodyClass": "pt-2 pb-1", "open": true, "data-astro-cid-po2kug26": true }, { "default": ($$result2) => renderTemplate`${maybeRenderHead()}<div class="surface overflow-x-auto" data-astro-cid-po2kug26><table class="perf-table w-full text-sm" data-astro-cid-po2kug26><thead data-astro-cid-po2kug26><tr class="text-left text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700" data-astro-cid-po2kug26><th class="px-4 py-2.5 font-medium cursor-pointer select-none" data-sort="name" data-astro-cid-po2kug26>Service<span class="sort-ind" data-astro-cid-po2kug26></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none" data-sort="provider" data-astro-cid-po2kug26>Provider<span class="sort-ind" data-astro-cid-po2kug26></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right" data-sort="now" data-astro-cid-po2kug26>Now<span class="sort-ind" data-astro-cid-po2kug26></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right" data-sort="p50" data-astro-cid-po2kug26>p50 · 1d<span class="sort-ind" data-astro-cid-po2kug26></span></th><th class="px-4 py-2.5 font-medium cursor-pointer select-none text-right hidden sm:table-cell" data-sort="p50-30d" data-astro-cid-po2kug26>p50 · 30d<span class="sort-ind" data-astro-cid-po2kug26></span></th><th class="px-4 py-2.5 font-medium hidden md:table-cell" data-astro-cid-po2kug26>7-day trend</th></tr></thead><tbody data-astro-cid-po2kug26>${parents.map((p4) => {
        const expandable = p4.count > 1;
        const childNames = p4.variants.map((v4) => `${v4.job.internalJobName} ${v4.variantLabel}`).join(" ");
        const filterName = `${p4.label} ${p4.provider} ${childNames}`.toLowerCase();
        const rep = p4.rep;
        return renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": ($$result3) => renderTemplate`<tr${addAttribute(`perf-parent border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 ${expandable ? "cursor-pointer" : ""}`, "class")}${addAttribute(p4.key, "data-key")}${addAttribute(filterName, "data-name")}${addAttribute(p4.provider.toLowerCase(), "data-provider")}${addAttribute(rep.now.ms ?? SORT_LAST, "data-now")}${addAttribute(rep.p1 ?? SORT_LAST, "data-p50")}${addAttribute(rep.p30 ?? SORT_LAST, "data-p50-30d")}${addAttribute(p4.count, "data-count")}${addAttribute(expandable ? "true" : "false", "data-expandable")}${addAttribute(expandable ? "false" : void 0, "aria-expanded")} data-astro-cid-po2kug26><td class="px-4 py-2.5" data-astro-cid-po2kug26>${expandable ? renderTemplate`<span class="flex items-center gap-2.5" data-astro-cid-po2kug26><svg class="chev shrink-0 w-4 h-4 text-gray-400 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" data-astro-cid-po2kug26><polyline points="9 18 15 12 9 6" data-astro-cid-po2kug26></polyline></svg><span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dotClass(p4.health)}`, "class")}${addAttribute(p4.health, "title")} data-astro-cid-po2kug26></span><span class="font-semibold" data-astro-cid-po2kug26>${p4.label}</span><span class="shrink-0 text-xs text-gray-500 dark:text-gray-400 tabular-nums" data-astro-cid-po2kug26>· ${p4.count}</span></span>` : renderTemplate`<a${addAttribute(`/perf/${rep.job.internalJobName}`, "href")} class="flex items-center gap-2.5 group" data-astro-cid-po2kug26><span class="w-4 h-4 shrink-0" data-astro-cid-po2kug26></span><span${addAttribute(`shrink-0 w-2.5 h-2.5 rounded-full ${dotClass(p4.health)}`, "class")}${addAttribute(p4.health, "title")} data-astro-cid-po2kug26></span><span class="min-w-0" data-astro-cid-po2kug26><span class="font-semibold text-[var(--accent-regular)] group-hover:underline" data-astro-cid-po2kug26>${p4.label}</span><span class="block text-xs text-gray-500 dark:text-gray-400 truncate" data-astro-cid-po2kug26>${rep.variantLabel}</span></span>${rep.job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(rep.job.jobDescription, "title")} data-astro-cid-po2kug26>?</span>`}</a>`}</td><td class="px-4 py-2.5" data-astro-cid-po2kug26><span class="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 whitespace-nowrap" data-astro-cid-po2kug26>${p4.provider}</span></td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap" data-astro-cid-po2kug26>${rep.now.apiError ? renderTemplate`<span class="text-red-600 dark:text-red-400 font-medium" data-astro-cid-po2kug26>API Error</span>` : fmtLatency(rep.now.ms)}</td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap font-medium" data-astro-cid-po2kug26>${fmtLatency(rep.p1)}${expandable ? renderTemplate`<span class="text-gray-400 dark:text-gray-500 font-normal" data-astro-cid-po2kug26> med</span>` : null}</td><td class="px-4 py-2.5 text-right tabular-nums whitespace-nowrap hidden sm:table-cell" data-astro-cid-po2kug26>${fmtLatency(rep.p30)}</td><td class="px-4 py-2.5 hidden md:table-cell w-32" data-astro-cid-po2kug26>${renderComponent($$result3, "Sparkline", Sparkline, { "endpoint": `v2/jobs/${rep.enc}/analytics`, "metric": "MedianApiResponseLatency", "health": p4.health, "days": 7, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx", "client:component-export": "default", "data-astro-cid-po2kug26": true })}</td></tr>${expandable && p4.variants.map((v4) => renderTemplate`<tr class="perf-child border-b border-gray-100 dark:border-gray-700 bg-black/[0.015] dark:bg-white/[0.02]"${addAttribute(p4.key, "data-key")}${addAttribute(`${v4.job.internalJobName} ${v4.variantLabel} ${p4.label} ${p4.provider}`.toLowerCase(), "data-name")}${addAttribute(v4.now.ms ?? SORT_LAST, "data-now")}${addAttribute(v4.p1 ?? SORT_LAST, "data-p50")}${addAttribute(v4.p30 ?? SORT_LAST, "data-p50-30d")} hidden data-astro-cid-po2kug26><td class="px-4 py-2" data-astro-cid-po2kug26><a${addAttribute(`/perf/${v4.job.internalJobName}`, "href")} class="flex items-center gap-2.5 group pl-6" data-astro-cid-po2kug26><span${addAttribute(`shrink-0 w-2 h-2 rounded-full ${dotClass(v4.health)}`, "class")}${addAttribute(v4.health, "title")} data-astro-cid-po2kug26></span><span class="text-gray-700 dark:text-gray-200 group-hover:underline" data-astro-cid-po2kug26>${v4.variantLabel}</span>${v4.job.jobDescription && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(v4.job.jobDescription, "title")} data-astro-cid-po2kug26>?</span>`}</a></td><td class="px-4 py-2" data-astro-cid-po2kug26></td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap" data-astro-cid-po2kug26>${v4.now.apiError ? renderTemplate`<span class="text-red-600 dark:text-red-400 font-medium" data-astro-cid-po2kug26>API Error</span>` : fmtLatency(v4.now.ms)}</td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap" data-astro-cid-po2kug26>${fmtLatency(v4.p1)}</td><td class="px-4 py-2 text-right tabular-nums whitespace-nowrap hidden sm:table-cell" data-astro-cid-po2kug26>${fmtLatency(v4.p30)}</td><td class="px-4 py-2 hidden md:table-cell w-32" data-astro-cid-po2kug26>${renderComponent($$result3, "Sparkline", Sparkline, { "endpoint": `v2/jobs/${v4.enc}/analytics`, "metric": "MedianApiResponseLatency", "health": v4.health, "days": 7, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx", "client:component-export": "default", "data-astro-cid-po2kug26": true })}</td></tr>`)}` })}`;
      })}</tbody></table></div>` })}`)}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/PerfTable.astro", void 0);
    $$Perf = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch("https://delay.cloudflare.chaika.me/v2/jobs/type/Perf")).json()).data;
      };
      var getJobsTask = getJobs();
      const getAnalytics = async () => {
        return await (await fetch("https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/type/Perf")).json();
      };
      var getAnalyticsTask = getAnalytics();
      const jobs = await getJobsTask;
      const stats = await getAnalyticsTask;
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1e3);
      const activeJobs = jobs.filter((job) => new Date(job.predictedRunTime) >= oneWeekAgo);
      const bunnyJobs = activeJobs.filter((job) => (job.internalJobName || "").toLowerCase().startsWith("bunny-"));
      const groups = groupJobs(bunnyJobs, "perf");
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Bunny Performance Monitoring", "description": "See Bunny performance monitoring jobs." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-20"> <main class="wrapper stack gap-8"> ${renderComponent($$result2, "Hero", $$Hero, { "title": "Bunny Performance Jobs", "tagline": "Compare the performance of Bunny services, measured from 50+ locations worldwide. Jobs are grouped by workload \u2014 Compute, Object Storage and SQL. Each service shows its median; expand it to see per-region and per-size variants. Sort any column, or click a job for its description and a per-location latency map.", "align": "start" })} <input id="job-filter" type="text" placeholder="Filter jobs..." class="w-full max-w-sm px-4 py-2 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"> <div class="stack gap-4"> ${renderComponent($$result2, "PerfTable", $$PerfTable, { "groups": groups, "stats": stats })} </div> ${renderScript($$result2, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts")} </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro", void 0);
    $$file9 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro";
    $$url9 = "/perf";
    _page10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Perf,
      file: $$file9,
      url: $$url9
    }, Symbol.toStringTag, { value: "Module" }));
    page10 = () => _page10;
  }
});

// dist/server/chunks/_.._C30mJEdj.mjs
var C30mJEdj_exports = {};
__export(C30mJEdj_exports, {
  page: () => page11
});
var __freeze4, __defProp5, __template4, _a4, $$JobLocationsTable, $$3, $$file10, $$url10, _page11, page11;
var init_C30mJEdj = __esm({
  "dist/server/chunks/_.._C30mJEdj.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Hero_BVVSX7E2();
    init_JobDetailHeader_B2bcKEVm();
    __freeze4 = Object.freeze;
    __defProp5 = Object.defineProperty;
    __template4 = (cooked, raw) => __freeze4(__defProp5(cooked, "raw", { value: __freeze4(cooked.slice()) }));
    $$JobLocationsTable = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$JobLocationsTable;
      const { jobName } = Astro2.props;
      const encoded = jobName.replaceAll("/", "%2F");
      let locations = [];
      try {
        const res = await fetch(`https://delay.cloudflare.chaika.me/v2/jobs/${encoded}/locations`);
        if (res.ok) locations = (await res.json()).data ?? [];
      } catch (e4) {
        console.log(`failed to fetch locations for ${jobName}`);
      }
      const rank = (s4) => s4 === "Errored" ? 0 : s4 === "Deployed" ? 2 : 1;
      locations.sort((a4, b3) => rank(a4.currentRunStatus) - rank(b3.currentRunStatus) || a4.locationName.localeCompare(b3.locationName));
      const statusClass = (s4) => s4 === "Deployed" || s4 === "Success" ? "text-green-600" : s4 === "Errored" || s4 === "Failure" ? "text-red-500" : "text-yellow-500";
      const delayTxt = (loc) => {
        const cur = loc.currentRunStatus === "Deployed" || loc.currentRunStatus === "Success";
        const ms = cur ? loc.currentRunLengthMs : loc.lastRunLengthMs;
        if (ms == null || isNaN(ms)) return "\u2014";
        if (ms < 1e3) return Math.round(ms) + " ms";
        if (ms < 6e4) return (ms / 1e3).toFixed(2) + " s";
        return (ms / 6e4).toFixed(2) + " min";
      };
      const updatedTxt = (loc) => {
        const t4 = loc.responseTimeUtc || loc.currentRunTime || loc.lastRunTime;
        const d4 = t4 ? new Date(t4) : null;
        return d4 && !isNaN(d4.getTime()) ? d4.toLocaleTimeString() : "\u2014";
      };
      const tableId = `loc-table-${jobName.replaceAll(/[^a-zA-Z0-9]/g, "")}`;
      const filterId = `${tableId}-filter`;
      return renderTemplate(_a4 || (_a4 = __template4(["", '<div class="surface p-4"> <div class="flex items-center justify-between gap-3 mb-3 flex-wrap"> <h3 class="font-semibold text-lg">Locations <span class="text-gray text-sm">(', ")</span></h3> <input", ' type="text" placeholder="Filter locations..." class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"> </div> ', " </div> <script>(function(){", '\n	const input = document.getElementById(filterId);\n	const table = document.getElementById(tableId);\n	if (input && table) {\n		input.addEventListener("input", () => {\n			const q = input.value.toLowerCase();\n			table.querySelectorAll(".loc-row").forEach((row) => {\n				row.style.display = row.getAttribute("data-loc").includes(q) ? "" : "none";\n			});\n		});\n	}\n})();</script>'])), maybeRenderHead(), locations.length, addAttribute(filterId, "id"), locations.length === 0 ? renderTemplate`<div class="text-gray text-sm py-6 text-center">No location data available.</div>` : renderTemplate`<div class="overflow-x-auto"> <table${addAttribute(tableId, "id")} class="w-full text-sm"> <thead> <tr class="text-gray text-xs uppercase border-b border-gray-200 dark:border-gray-700"> <th class="text-left font-medium py-2 pr-4">Location</th> <th class="text-left font-medium py-2 pr-4">Status</th> <th class="text-left font-medium py-2 pr-4">Delay</th> <th class="text-left font-medium py-2">Last Updated</th> </tr> </thead> <tbody> ${locations.map((loc) => renderTemplate`<tr class="border-b border-gray-100 dark:border-gray-800 loc-row"${addAttribute(loc.locationName.toLowerCase(), "data-loc")}> <td class="py-2 pr-4 font-medium break-all">${loc.locationName}</td> <td${addAttribute(`py-2 pr-4 ${statusClass(loc.currentRunStatus)}`, "class")}${addAttribute(`loc-status-${loc.locationName}`, "id")}>${loc.currentRunStatus}</td> <td class="py-2 pr-4 tabular-nums"${addAttribute(`loc-delay-${loc.locationName}`, "id")}>${delayTxt(loc)}</td> <td class="py-2 pr-4 text-gray"${addAttribute(`loc-updated-${loc.locationName}`, "id")}>${updatedTxt(loc)}</td> </tr>`)} </tbody> </table> </div>`, defineScriptVars({ filterId, tableId }));
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/JobLocationsTable.astro", void 0);
    $$3 = createComponent(async ($$result, $$props, $$slots) => {
      const Astro2 = $$result.createAstro($$props, $$slots);
      Astro2.self = $$3;
      const { internalJobName } = Astro2.params;
      const jobResp = await fetch("https://delay.cloudflare.chaika.me/v2/jobs/" + internalJobName);
      const job = (await jobResp.json()).data;
      const quickAnalyticsResponse = await fetch("https://delay.cloudflare.chaika.me/v1/quick/QuickAnalytics/" + (job.internalJobName ?? job.jobName));
      let quickAnalyticsData = [];
      if (quickAnalyticsResponse.ok) {
        quickAnalyticsData = await quickAnalyticsResponse.json();
      }
      const enc = job.internalJobName;
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": job?.jobName ?? "", "description": job?.jobDescription ?? "", "data-astro-cid-4ltwneta": true }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-8" data-astro-cid-4ltwneta> <header class="wrapper stack gap-3" data-astro-cid-4ltwneta> <a class="back-link" href="/perf/" data-astro-cid-4ltwneta>${renderComponent($$result2, "Icon", $$Icon, { "icon": "arrow-left", "data-astro-cid-4ltwneta": true })}All Jobs</a> ${renderComponent($$result2, "Hero", $$Hero, { "title": job?.jobName, "align": "start", "data-astro-cid-4ltwneta": true }, { "default": async ($$result3) => renderTemplate` <p data-astro-cid-4ltwneta>${job?.jobDescription}</p> ` })} ${renderComponent($$result2, "JobDetailHeader", $$JobDetailHeader, { "job": job, "stats": quickAnalyticsData, "type": "perf", "data-astro-cid-4ltwneta": true })} </header> <main class="wrapper stack gap-6" data-astro-cid-4ltwneta> <div class="grid grid-cols-1 lg:grid-cols-2 gap-6" data-astro-cid-4ltwneta> <div class="surface p-4" data-astro-cid-4ltwneta> ${renderComponent($$result2, "SmartGraph", null, { "endpoint": `v2/jobs/${enc}/analytics`, "label": job.jobName, "options": ["MedianRunLength", "MinRunLength", "MaxRunLength", "AvgRunLength"], "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-4ltwneta": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" })} </div> <div class="surface p-4" data-astro-cid-4ltwneta> ${renderComponent($$result2, "SmartGraph", null, { "endpoint": `v2/jobs/${enc}/analytics`, "label": job.jobName, "options": ["AvgApiResponseLatency", "MedianApiResponseLatency", "MinApiResponseLatency", "MaxApiResponseLatency"], "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-4ltwneta": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js", "client:component-export": "default" })} </div> </div> <div class="surface p-2" data-astro-cid-4ltwneta> ${renderComponent($$result2, "ErrorGraph", null, { "endpoint": `v2/jobs/${enc}/erroranalytics`, "label": job.jobName, "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-4ltwneta": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph", "client:component-export": "default" })} </div> ${renderComponent($$result2, "JobLocationsTable", $$JobLocationsTable, { "jobName": job.internalJobName, "data-astro-cid-4ltwneta": true })} <details id="region-breakdown" class="surface p-4" open data-astro-cid-4ltwneta> <summary class="cursor-pointer font-semibold text-lg" data-astro-cid-4ltwneta>Regional Breakdown</summary> ${renderComponent($$result2, "RegionGraphLazy", null, { "detailsId": "region-breakdown", "jobName": job.internalJobName, "label": job.jobName, "defaultMetric": "MedianApiResponseLatency", "client:only": "preact", "client:component-hydration": "only", "data-astro-cid-4ltwneta": true, "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js", "client:component-export": "default" })} </details> <details class="surface p-4" open data-astro-cid-4ltwneta> <summary class="cursor-pointer font-semibold text-lg" data-astro-cid-4ltwneta>Geographic Map</summary> <iframe id="jobmapiframe"${addAttribute(`https://perfmap.cloudflare.chaika.me/?${job.internalJobName}`, "src")} width="100%" style="height: 70vh !important;" class="mt-3 rounded-lg" data-astro-cid-4ltwneta></iframe> </details> </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro", void 0);
    $$file10 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro";
    $$url10 = "/perf/[...internalJobName]";
    _page11 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$3,
      file: $$file10,
      url: $$url10
    }, Symbol.toStringTag, { value: "Module" }));
    page11 = () => _page11;
  }
});

// dist/server/chunks/StatusDashboard_D7ZpJWch.mjs
var __freeze5, __defProp6, __template5, _a5, $$StatusDashboard;
var init_StatusDashboard_D7ZpJWch = __esm({
  "dist/server/chunks/StatusDashboard_D7ZpJWch.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Sparkline_mFdyPfsh();
    init_jobCategories_v_ve9c3Y();
    __freeze5 = Object.freeze;
    __defProp6 = Object.defineProperty;
    __template5 = (cooked, raw) => __freeze5(__defProp6(cooked, "raw", { value: __freeze5(cooked.slice()) }));
    $$StatusDashboard = createComponent(async ($$result, $$props, $$slots) => {
      const getJobs = async () => {
        return (await (await fetch("https://delay.cloudflare.chaika.me/v2/jobs/type/BunnyDelay")).json()).data;
      };
      const getIncidentsData = async () => {
        return (await (await fetch("https://delay.cloudflare.chaika.me/v2/incidents/type/BunnyDelay")).json()).data;
      };
      const [jobs, incidents] = await Promise.all([
        getJobs(),
        getIncidentsData()
      ]);
      function getItemStatus(jobName) {
        const job = jobs.find((j5) => j5.internalJobName === jobName);
        if (!job) return { status: "Unknown", color: "bg-gray-500", time: null };
        const incident = incidents.find((inc) => inc.target === jobName && inc.active);
        if (incident) {
          return {
            status: "Degraded",
            color: "bg-yellow-500",
            time: job.predictedRunTime,
            length: job.predictedDelayLengthMs,
            runStatus: job.predictedRunStatus
          };
        }
        if (job.predictedRunStatus === "API_Error") {
          return {
            status: "API Down",
            color: "bg-red-500",
            time: null,
            length: job.predictedDelayLengthMs,
            runStatus: job.predictedRunStatus
          };
        }
        if (job.type === "delayed") {
          return {
            status: "Delayed",
            color: "bg-orange-500",
            time: job.predictedRunTime,
            length: job.predictedDelayLengthMs,
            runStatus: job.predictedRunStatus
          };
        }
        return {
          status: "Normal",
          color: "bg-green-500",
          time: job.predictedRunTime,
          length: job.predictedDelayLengthMs,
          runStatus: job.predictedRunStatus
        };
      }
      function getGroupStatus(groupItems) {
        const hasIssues = groupItems.some((item) => {
          const job = jobs.find((j5) => j5.internalJobName === item.jobName);
          if (!job) return false;
          const incident = incidents.find((inc) => inc.target === item.jobName && inc.active);
          if (incident) return true;
          if (job.predictedRunStatus === "API_Error" || job.type === "delayed") {
            return true;
          }
          return false;
        });
        return hasIssues ? { status: "Partially Degraded", color: "bg-yellow-500" } : { status: "Normal", color: "bg-green-500" };
      }
      function runLengthDisplayFormat(jobName, ms) {
        if (jobName == "cron") {
          if (ms) ms -= 6e4;
        }
        if (ms == void 0) return "";
        let seconds = ms / 1e3;
        if (seconds < 60) {
          return seconds.toFixed(2) + " second(s)";
        }
        let minutes = seconds / 60;
        if (minutes < 60) {
          return minutes.toFixed(2) + " minute(s)";
        }
        let hours = minutes / 60;
        return hours.toFixed(2) + " hour(s)";
      }
      function formatTime(date) {
        if (!date) return "";
        return new Date(date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          timeZoneName: "short"
        });
      }
      function rowHealth(jobName) {
        const job = jobs.find((j5) => j5.internalJobName === jobName);
        if (!job) return "good";
        const hasIncident = incidents.some((inc) => inc.target === jobName && inc.active);
        return jobHealth(job, hasIncident);
      }
      function itemDescription(jobName) {
        return jobs.find((j5) => j5.internalJobName === jobName)?.jobDescription ?? "";
      }
      function buildSummary() {
        const counts = { operational: 0, delayed: 0, degraded: 0, apiDown: 0 };
        for (const group of statusConfig.groups) {
          for (const item of group.items) {
            const s4 = getItemStatus(item.jobName).status;
            if (s4 === "API Down") counts.apiDown++;
            else if (s4 === "Degraded") counts.degraded++;
            else if (s4 === "Delayed") counts.delayed++;
            else if (s4 === "Normal") counts.operational++;
          }
        }
        let health = "good";
        let headline = "All Bunny Systems Normal";
        if (counts.apiDown > 0) {
          health = "bad";
          headline = `${counts.apiDown} Service${counts.apiDown > 1 ? "s" : ""} Reporting API Errors`;
        } else if (counts.degraded > 0) {
          health = "elevated";
          headline = `${counts.degraded} Service${counts.degraded > 1 ? "s" : ""} Degraded`;
        } else if (counts.delayed > 0) {
          health = "elevated";
          headline = `${counts.delayed} Service${counts.delayed > 1 ? "s" : ""} Delayed`;
        }
        return { counts, health, headline };
      }
      const summary = buildSummary();
      return renderTemplate(_a5 || (_a5 = __template5(["<script>(function(){", "\n  globalThis.jobData = jobs;\n  globalThis.config = config;\n  globalThis.incidents = incidents;\n})();</script> ", '<div class="surface px-5 py-4 sm:px-6 sm:py-5 mb-6"> <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"> <div class="flex items-center gap-3"> <span', ' id="overall-status-dot"></span> <div> <h2 class="text-xl font-semibold leading-tight" id="overall-status-headline"> ', ' </h2> <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">\nLive propagation-delay monitoring \xB7 auto-updating\n</p> </div> </div> <a id="websocket-conn-status" class="websocket-conn-pill self-start sm:self-auto">\nConnecting to Live Updates\u2026\n</a> </div> <div class="flex flex-wrap gap-2 mt-4"> <span', ' id="summary-count-operational"> <span class="chip-dot"></span>', " Operational\n</span> <span", ' id="summary-count-delayed"> <span class="chip-dot"></span>', " Delayed\n</span> <span", ' id="summary-count-degraded"> <span class="chip-dot"></span>', " Degraded\n</span> <span", ' id="summary-count-apidown"> <span class="chip-dot"></span>', ' API Down\n</span> </div> </div> <div class="space-y-4"> ', ' </div> <script src="/assets/js/8.0.7/signalr.min.js"></script> <script src="/assets/js/8.0.7/signalr-protocol-msgpack.min.js"></script> ', ""])), defineScriptVars({ jobs, config: statusConfig, incidents }), maybeRenderHead(), addAttribute(`w-3.5 h-3.5 rounded-full flex-none ${dotClass(summary.health)}`, "class"), summary.headline, addAttribute(`status-chip status-chip-good ${summary.counts.operational === 0 ? "is-zero" : ""}`, "class"), summary.counts.operational, addAttribute(`status-chip status-chip-elevated ${summary.counts.delayed === 0 ? "is-zero" : ""}`, "class"), summary.counts.delayed, addAttribute(`status-chip status-chip-elevated ${summary.counts.degraded === 0 ? "is-zero" : ""}`, "class"), summary.counts.degraded, addAttribute(`status-chip status-chip-bad ${summary.counts.apiDown === 0 ? "is-zero" : ""}`, "class"), summary.counts.apiDown, statusConfig.groups.map((group) => {
        const groupStatus = getGroupStatus(group.items);
        return renderTemplate`<div class="surface overflow-hidden"> <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700"> <h2 class="text-lg font-semibold">${group.name}</h2> <div class="flex items-center"> <span${addAttribute(`w-2.5 h-2.5 rounded-full mr-2 ${groupStatus.color}`, "class")}${addAttribute(`grp-${group.name}-color`, "id")}></span> <span class="text-sm font-medium"${addAttribute(`grp-${group.name}-status`, "id")}> ${groupStatus.status} </span> </div> </div> <div> ${group.items.map((item) => {
          const status = getItemStatus(item.jobName);
          return renderTemplate`<a${addAttribute(`/job/${item.jobName}`, "href")} class="flex items-center justify-between gap-3 px-6 py-3 hover:bg-gray-50 dark:hover:bg-white/5 border-b border-gray-100 dark:border-gray-700 last:border-b-0"> <span class="flex items-center gap-1.5 min-w-0"> <span class="font-medium">${item.name}</span> ${itemDescription(item.jobName) && renderTemplate`<span class="flex-none inline-flex items-center justify-center w-4 h-4 rounded-full border border-gray-400 text-gray-500 dark:text-gray-400 text-[10px] cursor-help"${addAttribute(itemDescription(item.jobName), "title")}>?</span>`} </span> <div class="flex items-center gap-3"> <div class="hidden sm:block w-24 md:w-28 flex-none"> ${renderComponent($$result, "Sparkline", Sparkline, { "endpoint": `v2/jobs/${item.jobName}/analytics`, "metric": "MedianRunLength", "health": rowHealth(item.jobName), "days": 7, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx", "client:component-export": "default" })} </div> <span class="text-sm text-gray-500 dark:text-gray-300 text-right"${addAttribute(`item-${item.jobName}-runLength`, "id")}> ${runLengthDisplayFormat(item.jobName, status.length)} </span> ${status.time && renderTemplate`<span class="text-sm text-gray-500 dark:text-gray-300 hidden sm:inline"${addAttribute(`item-${item.jobName}-time`, "id")}> ${formatTime(status.time)} </span>`} <div class="flex items-center"> <span${addAttribute(`w-2.5 h-2.5 rounded-full mr-2 ${status.color}`, "class")}${addAttribute(`item-${item.jobName}-color`, "id")}></span> <span class="text-sm font-medium"${addAttribute(`item-${item.jobName}-status`, "id")}> ${status.status} </span> </div> </div> </a>`;
        })} </div> </div>`;
      }), renderScript($$result, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro?astro&type=script&index=0&lang.ts"));
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro", void 0);
  }
});

// dist/server/chunks/status_DGCOV0Yo.mjs
var status_DGCOV0Yo_exports = {};
__export(status_DGCOV0Yo_exports, {
  page: () => page12
});
var $$Status, $$file11, $$url11, _page12, page12;
var init_status_DGCOV0Yo = __esm({
  "dist/server/chunks/status_DGCOV0Yo.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Hero_BVVSX7E2();
    init_StatusDashboard_D7ZpJWch();
    $$Status = createComponent(($$result, $$props, $$slots) => {
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Bunny Delay Monitoring", "description": "See Bunny Delay Monitoring Status" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-20"> <main class="wrapper stack gap-8"> ${renderComponent($$result2, "Hero", $$Hero, { "title": "Bunny Status", "tagline": "We monitor the delay of various updates/operations, and evaluate for potential incidents when they are delayed or have API errors. Click on any item to see more details, including a graph of recent delay times.", "align": "start" })} ${renderComponent($$result2, "StatusDashboard", $$StatusDashboard, {})} </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro", void 0);
    $$file11 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro";
    $$url11 = "/status";
    _page12 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Status,
      file: $$file11,
      url: $$url11
    }, Symbol.toStringTag, { value: "Module" }));
    page12 = () => _page12;
  }
});

// dist/server/chunks/index_DKfZ64j5.mjs
var index_DKfZ64j5_exports = {};
__export(index_DKfZ64j5_exports, {
  page: () => page13
});
var $$Index, $$file12, $$url12, _page13, page13;
var init_index_DKfZ64j5 = __esm({
  "dist/server/chunks/index_DKfZ64j5.mjs"() {
    "use strict";
    init_astro_component_CvVWUJoH();
    init_server_b5nfSfcf();
    init_BaseLayout_1cxBJD0D();
    init_Hero_BVVSX7E2();
    init_StatusDashboard_D7ZpJWch();
    $$Index = createComponent(($$result, $$props, $$slots) => {
      const sections = [
        { label: "Delay Jobs", href: "/delay/" },
        { label: "Performance", href: "/perf/" },
        { label: "Locations", href: "/locations/" }
      ];
      return renderTemplate`${renderComponent($$result, "BaseLayout", $$BaseLayout, { "title": "Action-Delay-API \u2014 Bunny Status", "description": "Live propagation-delay status for Bunny configuration changes, measured from 50+ edge locations worldwide.", "data-astro-cid-j7pv25f6": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="stack gap-20" data-astro-cid-j7pv25f6> <main class="wrapper stack gap-8" data-astro-cid-j7pv25f6> ${renderComponent($$result2, "Hero", $$Hero, { "title": "Bunny Status", "tagline": "Live propagation delay of Bunny configuration changes \u2014 DNS, Edge Rules, Edge Scripts and more \u2014 measured from 50+ edge locations worldwide. Click any item for a recent-delay graph.", "align": "start", "data-astro-cid-j7pv25f6": true })} <nav aria-label="Sections" class="overview-strip" data-astro-cid-j7pv25f6> ${sections.map((s4) => renderTemplate`<a${addAttribute(s4.href, "href")} class="overview-link" data-astro-cid-j7pv25f6> ${s4.label} </a>`)} </nav> ${renderComponent($$result2, "StatusDashboard", $$StatusDashboard, { "data-astro-cid-j7pv25f6": true })} </main> </div> ` })}`;
    }, "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro", void 0);
    $$file12 = "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro";
    $$url12 = "";
    _page13 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
      __proto__: null,
      default: $$Index,
      file: $$file12,
      url: $$url12
    }, Symbol.toStringTag, { value: "Module" }));
    page13 = () => _page13;
  }
});

// dist/server/chunks/noop-entrypoint_BOlrdqWF.mjs
var noop_entrypoint_BOlrdqWF_exports = {};
__export(noop_entrypoint_BOlrdqWF_exports, {
  server: () => server
});
var server;
var init_noop_entrypoint_BOlrdqWF = __esm({
  "dist/server/chunks/noop-entrypoint_BOlrdqWF.mjs"() {
    "use strict";
    server = {};
  }
});

// dist/server/virtual_astro_middleware.mjs
var virtual_astro_middleware_exports = {};
__export(virtual_astro_middleware_exports, {
  onRequest: () => onRequest
});
var onRequest;
var init_virtual_astro_middleware = __esm({
  "dist/server/virtual_astro_middleware.mjs"() {
    "use strict";
    onRequest = (_4, next) => next();
  }
});

// dist/server/chunks/_virtual_astro_session-driver_DYx9Bb3p.mjs
var virtual_astro_session_driver_DYx9Bb3p_exports = {};
__export(virtual_astro_session_driver_DYx9Bb3p_exports, {
  default: () => _virtual_astro_sessionDriver
});
var _virtual_astro_sessionDriver;
var init_virtual_astro_session_driver_DYx9Bb3p = __esm({
  "dist/server/chunks/_virtual_astro_session-driver_DYx9Bb3p.mjs"() {
    "use strict";
    _virtual_astro_sessionDriver = null;
  }
});

// dist/server/chunks/_virtual_astro_server-island-manifest_CQQ1F5PF.mjs
var virtual_astro_server_island_manifest_CQQ1F5PF_exports = {};
__export(virtual_astro_server_island_manifest_CQQ1F5PF_exports, {
  serverIslandMap: () => serverIslandMap,
  serverIslandNameMap: () => serverIslandNameMap
});
var serverIslandMap, serverIslandNameMap;
var init_virtual_astro_server_island_manifest_CQQ1F5PF = __esm({
  "dist/server/chunks/_virtual_astro_server-island-manifest_CQQ1F5PF.mjs"() {
    "use strict";
    serverIslandMap = /* @__PURE__ */ new Map([]);
    serverIslandNameMap = /* @__PURE__ */ new Map([]);
  }
});

// dist/server/chunks/astro-adapter_false_CaqwA2Hq.mjs
var astro_adapter_false_CaqwA2Hq_exports = {};
__export(astro_adapter_false_CaqwA2Hq_exports, {
  default: () => astroAdapter_false
});
var astroAdapter_false;
var init_astro_adapter_false_CaqwA2Hq = __esm({
  "dist/server/chunks/astro-adapter_false_CaqwA2Hq.mjs"() {
    "use strict";
    astroAdapter_false = {};
    throw new Error(`Could not resolve "@opentelemetry/api" imported by "@deno/astro-adapter".`);
  }
});

// dist/server/chunks/server_b5nfSfcf.mjs
function appendForwardSlash(path) {
  return path.endsWith("/") ? path : path + "/";
}
function prependForwardSlash(path) {
  return path[0] === "/" ? path : "/" + path;
}
function collapseDuplicateLeadingSlashes(path) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_LEADING_SLASHES, "/");
}
function collapseDuplicateSlashes(path) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_SLASHES, "/");
}
function collapseDuplicateTrailingSlashes(path, trailingSlash) {
  if (!path) {
    return path;
  }
  return path.replace(MANY_TRAILING_SLASHES, trailingSlash ? "/" : "") || "/";
}
function removeTrailingForwardSlash(path) {
  return path.endsWith("/") ? path.slice(0, path.length - 1) : path;
}
function removeLeadingForwardSlash(path) {
  return path.startsWith("/") ? path.substring(1) : path;
}
function trimSlashes(path) {
  return path.replace(/^\/|\/$/g, "");
}
function isString(path) {
  return typeof path === "string" || path instanceof String;
}
function isInternalPath(path) {
  return INTERNAL_PREFIXES.has(path.slice(0, 2)) && !JUST_SLASHES.test(path);
}
function joinPaths(...paths) {
  return paths.filter(isString).map((path, i5) => {
    if (i5 === 0) {
      return removeTrailingForwardSlash(path);
    } else if (i5 === paths.length - 1) {
      return removeLeadingForwardSlash(path);
    } else {
      return trimSlashes(path);
    }
  }).join("/");
}
function removeQueryString(path) {
  const index = path.lastIndexOf("?");
  return index > 0 ? path.substring(0, index) : path;
}
function isRemotePath(src) {
  if (!src) return false;
  const trimmed = src.trim();
  if (!trimmed) return false;
  let decoded = trimmed;
  let previousDecoded = "";
  let maxIterations = 10;
  while (decoded !== previousDecoded && maxIterations > 0) {
    previousDecoded = decoded;
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      break;
    }
    maxIterations--;
  }
  if (/^[a-zA-Z]:/.test(decoded)) {
    return false;
  }
  if (decoded[0] === "/" && /^\/[\w.@-]/.test(decoded)) {
    return false;
  }
  if (decoded[0] === "\\") {
    return true;
  }
  if (decoded.startsWith("//")) {
    return true;
  }
  try {
    const url = new URL(decoded, "http://n");
    if (url.username || url.password) {
      return true;
    }
    if (decoded.includes("@") && !url.pathname.includes("@") && !url.search.includes("@")) {
      return true;
    }
    if (url.origin !== "http://n") {
      const protocol = url.protocol.toLowerCase();
      if (protocol === "file:") {
        return false;
      }
      return true;
    }
    if (URL.canParse(decoded)) {
      return true;
    }
    return false;
  } catch {
    return true;
  }
}
function slash(path) {
  return path.replace(/\\/g, "/");
}
function fileExtension(path) {
  const ext = path.split(".").pop();
  return ext !== path ? `.${ext}` : "";
}
function hasFileExtension(path) {
  return WITH_FILE_EXT.test(path);
}
function is_primitive(thing) {
  return thing === null || typeof thing !== "object" && typeof thing !== "function";
}
function is_plain_object(thing) {
  const proto = Object.getPrototypeOf(thing);
  return proto === Object.prototype || proto === null || Object.getPrototypeOf(proto) === null || Object.getOwnPropertyNames(proto).sort().join("\0") === object_proto_names;
}
function get_type(thing) {
  return Object.prototype.toString.call(thing).slice(8, -1);
}
function get_escaped_char(char) {
  switch (char) {
    case '"':
      return '\\"';
    case "<":
      return "\\u003C";
    case "\\":
      return "\\\\";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "	":
      return "\\t";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\u2028":
      return "\\u2028";
    case "\u2029":
      return "\\u2029";
    default:
      return char < " " ? `\\u${char.charCodeAt(0).toString(16).padStart(4, "0")}` : "";
  }
}
function stringify_string(str) {
  let result = "";
  let last_pos = 0;
  const len = str.length;
  for (let i5 = 0; i5 < len; i5 += 1) {
    const char = str[i5];
    const replacement = get_escaped_char(char);
    if (replacement) {
      result += str.slice(last_pos, i5) + replacement;
      last_pos = i5 + 1;
    }
  }
  return `"${last_pos === 0 ? str : result + str.slice(last_pos)}"`;
}
function enumerable_symbols(object) {
  return Object.getOwnPropertySymbols(object).filter(
    (symbol) => Object.getOwnPropertyDescriptor(object, symbol).enumerable
  );
}
function stringify_key(key) {
  return is_identifier.test(key) ? "." + key : "[" + JSON.stringify(key) + "]";
}
function is_valid_array_index(n3) {
  if (!Number.isInteger(n3)) return false;
  if (n3 < 0) return false;
  if (n3 > MAX_ARRAY_INDEX) return false;
  return true;
}
function is_valid_array_len(n3) {
  if (!Number.isInteger(n3)) return false;
  if (n3 < 0) return false;
  if (n3 > MAX_ARRAY_LEN) return false;
  return true;
}
function is_valid_array_index_string(s4) {
  if (s4.length === 0) return false;
  if (s4.length > 1 && s4.charCodeAt(0) === 48) return false;
  for (let i5 = 0; i5 < s4.length; i5++) {
    const c4 = s4.charCodeAt(i5);
    if (c4 < 48 || c4 > 57) return false;
  }
  return is_valid_array_index(+s4);
}
function valid_array_indices(array2) {
  const keys = Object.keys(array2);
  for (var i5 = keys.length - 1; i5 >= 0; i5--) {
    if (is_valid_array_index_string(keys[i5])) {
      break;
    }
  }
  keys.length = i5 + 1;
  return keys;
}
function encode_native(array_buffer) {
  return new Uint8Array(array_buffer).toBase64();
}
function decode_native(base64) {
  return Uint8Array.fromBase64(base64).buffer;
}
function encode_buffer(array_buffer) {
  return Buffer.from(array_buffer).toString("base64");
}
function decode_buffer(base64) {
  return Uint8Array.from(Buffer.from(base64, "base64")).buffer;
}
function encode_legacy(array_buffer) {
  const array2 = new Uint8Array(array_buffer);
  let binary2 = "";
  const chunk_size = 32768;
  for (let i5 = 0; i5 < array2.length; i5 += chunk_size) {
    const chunk = array2.subarray(i5, i5 + chunk_size);
    binary2 += String.fromCharCode.apply(null, chunk);
  }
  return btoa(binary2);
}
function decode_legacy(base64) {
  const binary_string = atob(base64);
  const len = binary_string.length;
  const array2 = new Uint8Array(len);
  for (let i5 = 0; i5 < len; i5++) {
    array2[i5] = binary_string.charCodeAt(i5);
  }
  return array2.buffer;
}
function parse$1(serialized, revivers) {
  return unflatten$1(JSON.parse(serialized), revivers);
}
function unflatten$1(parsed, revivers) {
  if (typeof parsed === "number") return hydrate(parsed, true);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("Invalid input");
  }
  const values = (
    /** @type {any[]} */
    parsed
  );
  const hydrated = Array(values.length);
  let hydrating = null;
  function hydrate(index, standalone = false) {
    if (index === UNDEFINED) return void 0;
    if (index === NAN) return NaN;
    if (index === POSITIVE_INFINITY) return Infinity;
    if (index === NEGATIVE_INFINITY) return -Infinity;
    if (index === NEGATIVE_ZERO) return -0;
    if (standalone || typeof index !== "number") {
      throw new Error(`Invalid input`);
    }
    if (index in hydrated) return hydrated[index];
    const value = values[index];
    if (!value || typeof value !== "object") {
      hydrated[index] = value;
    } else if (Array.isArray(value)) {
      if (typeof value[0] === "string") {
        const type = value[0];
        const reviver = revivers && Object.hasOwn(revivers, type) ? revivers[type] : void 0;
        if (reviver) {
          let i5 = value[1];
          if (typeof i5 !== "number") {
            i5 = values.push(value[1]) - 1;
          }
          hydrating ??= /* @__PURE__ */ new Set();
          if (hydrating.has(i5)) {
            throw new Error("Invalid circular reference");
          }
          hydrating.add(i5);
          hydrated[index] = reviver(hydrate(i5));
          hydrating.delete(i5);
          return hydrated[index];
        }
        switch (type) {
          case "Date":
            hydrated[index] = new Date(value[1]);
            break;
          case "Set":
            const set = /* @__PURE__ */ new Set();
            hydrated[index] = set;
            for (let i5 = 1; i5 < value.length; i5 += 1) {
              set.add(hydrate(value[i5]));
            }
            break;
          case "Map":
            const map = /* @__PURE__ */ new Map();
            hydrated[index] = map;
            for (let i5 = 1; i5 < value.length; i5 += 2) {
              map.set(hydrate(value[i5]), hydrate(value[i5 + 1]));
            }
            break;
          case "RegExp":
            hydrated[index] = new RegExp(value[1], value[2]);
            break;
          case "Object": {
            const wrapped_index = value[1];
            if (typeof values[wrapped_index] === "object" && values[wrapped_index][0] !== "BigInt") {
              throw new Error("Invalid input");
            }
            hydrated[index] = Object(hydrate(wrapped_index));
            break;
          }
          case "BigInt":
            hydrated[index] = BigInt(value[1]);
            break;
          case "null":
            const obj = /* @__PURE__ */ Object.create(null);
            hydrated[index] = obj;
            for (let i5 = 1; i5 < value.length; i5 += 2) {
              if (value[i5] === "__proto__") {
                throw new Error("Cannot parse an object with a `__proto__` property");
              }
              obj[value[i5]] = hydrate(value[i5 + 1]);
            }
            break;
          case "Int8Array":
          case "Uint8Array":
          case "Uint8ClampedArray":
          case "Int16Array":
          case "Uint16Array":
          case "Float16Array":
          case "Int32Array":
          case "Uint32Array":
          case "Float32Array":
          case "Float64Array":
          case "BigInt64Array":
          case "BigUint64Array":
          case "DataView": {
            if (values[value[1]][0] !== "ArrayBuffer") {
              throw new Error("Invalid data");
            }
            const TypedArrayConstructor = globalThis[type];
            const buffer2 = hydrate(value[1]);
            hydrated[index] = value[2] !== void 0 ? new TypedArrayConstructor(buffer2, value[2], value[3]) : new TypedArrayConstructor(buffer2);
            break;
          }
          case "ArrayBuffer": {
            const base64 = value[1];
            if (typeof base64 !== "string") {
              throw new Error("Invalid ArrayBuffer encoding");
            }
            const arraybuffer = decode64(base64);
            hydrated[index] = arraybuffer;
            break;
          }
          case "Temporal.Duration":
          case "Temporal.Instant":
          case "Temporal.PlainDate":
          case "Temporal.PlainTime":
          case "Temporal.PlainDateTime":
          case "Temporal.PlainMonthDay":
          case "Temporal.PlainYearMonth":
          case "Temporal.ZonedDateTime": {
            const temporalName = type.slice(9);
            hydrated[index] = Temporal[temporalName].from(value[1]);
            break;
          }
          case "URL": {
            const url = new URL(value[1]);
            hydrated[index] = url;
            break;
          }
          case "URLSearchParams": {
            const url = new URLSearchParams(value[1]);
            hydrated[index] = url;
            break;
          }
          default:
            throw new Error(`Unknown type ${type}`);
        }
      } else if (value[0] === SPARSE) {
        const len = value[1];
        if (!is_valid_array_len(len)) {
          throw new Error("Invalid input");
        }
        const array2 = [];
        hydrated[index] = array2;
        array2[MAX_ARRAY_INDEX] = void 0;
        delete array2[MAX_ARRAY_INDEX];
        for (let i5 = 2; i5 < value.length; i5 += 2) {
          const idx = value[i5];
          if (!is_valid_array_index(idx) || idx >= len) {
            throw new Error("Invalid input");
          }
          array2[idx] = hydrate(value[i5 + 1]);
        }
        array2.length = len;
      } else {
        const array2 = new Array(value.length);
        hydrated[index] = array2;
        for (let i5 = 0; i5 < value.length; i5 += 1) {
          const n3 = value[i5];
          if (n3 === HOLE) continue;
          array2[i5] = hydrate(n3);
        }
      }
    } else {
      const object = {};
      hydrated[index] = object;
      for (const key of Object.keys(value)) {
        if (key === "__proto__") {
          throw new Error("Cannot parse an object with a `__proto__` property");
        }
        const n3 = value[key];
        object[key] = hydrate(n3);
      }
    }
    return hydrated[index];
  }
  return hydrate(0);
}
function stringify$2(value, reducers) {
  const stringified = run(false, value, reducers);
  return typeof stringified === "string" ? stringified : `[${stringified.join(",")}]`;
}
function run(async, value, reducers) {
  const stringified = [];
  const indexes = /* @__PURE__ */ new Map();
  const custom2 = [];
  if (reducers) {
    for (const key of Object.getOwnPropertyNames(reducers)) {
      custom2.push({ key, fn: reducers[key] });
    }
  }
  const keys = [];
  let p4 = 0;
  function flatten(thing, index2) {
    if (thing === void 0) return UNDEFINED;
    if (Number.isNaN(thing)) return NAN;
    if (thing === Infinity) return POSITIVE_INFINITY;
    if (thing === -Infinity) return NEGATIVE_INFINITY;
    if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO;
    if (indexes.has(thing)) return (
      /** @type {number} */
      indexes.get(thing)
    );
    index2 ??= p4++;
    indexes.set(thing, index2);
    for (const { key, fn } of custom2) {
      const value2 = fn(thing);
      if (value2) {
        stringified[index2] = `["${key}",${flatten(value2)}]`;
        return index2;
      }
    }
    if (typeof thing === "function") {
      throw new DevalueError(`Cannot stringify a function`, keys, thing, value);
    } else if (typeof thing === "symbol") {
      throw new DevalueError(`Cannot stringify a Symbol primitive`, keys, thing, value);
    }
    let str = "";
    if (is_primitive(thing)) {
      str = stringify_primitive(thing);
    } else if (typeof thing.then === "function") {
      {
        throw new DevalueError(
          `Cannot stringify a Promise or thenable \u2014 use stringifyAsync instead`,
          keys,
          thing,
          value
        );
      }
    } else {
      const type = get_type(thing);
      switch (type) {
        case "Number":
        case "String":
        case "Boolean":
        case "BigInt":
          str = `["Object",${flatten(thing.valueOf())}]`;
          break;
        case "Date":
          const valid = !isNaN(thing.getDate());
          str = `["Date","${valid ? thing.toISOString() : ""}"]`;
          break;
        case "URL":
          str = `["URL",${stringify_string(thing.toString())}]`;
          break;
        case "URLSearchParams":
          str = `["URLSearchParams",${stringify_string(thing.toString())}]`;
          break;
        case "RegExp":
          const { source, flags } = thing;
          str = flags ? `["RegExp",${stringify_string(source)},"${flags}"]` : `["RegExp",${stringify_string(source)}]`;
          break;
        case "Array": {
          let mostly_dense = false;
          str = "[";
          for (let i5 = 0; i5 < thing.length; i5 += 1) {
            if (i5 > 0) str += ",";
            if (Object.hasOwn(thing, i5)) {
              keys.push(`[${i5}]`);
              str += flatten(thing[i5]);
              keys.pop();
            } else if (mostly_dense) {
              str += HOLE;
            } else {
              const populated_keys = valid_array_indices(
                /** @type {any[]} */
                thing
              );
              const population = populated_keys.length;
              const d4 = String(thing.length).length;
              const hole_cost = (thing.length - population) * 3;
              const sparse_cost = 4 + d4 + population * (d4 + 1);
              if (hole_cost > sparse_cost) {
                str = "[" + SPARSE + "," + thing.length;
                for (let j5 = 0; j5 < populated_keys.length; j5++) {
                  const key = populated_keys[j5];
                  keys.push(`[${key}]`);
                  str += "," + key + "," + flatten(thing[key]);
                  keys.pop();
                }
                break;
              } else {
                mostly_dense = true;
                str += HOLE;
              }
            }
          }
          str += "]";
          break;
        }
        case "Set":
          str = '["Set"';
          for (const value2 of thing) {
            str += `,${flatten(value2)}`;
          }
          str += "]";
          break;
        case "Map":
          str = '["Map"';
          for (const [key, value2] of thing) {
            keys.push(`.get(${is_primitive(key) ? stringify_primitive(key) : "..."})`);
            str += `,${flatten(key)},${flatten(value2)}`;
            keys.pop();
          }
          str += "]";
          break;
        case "Int8Array":
        case "Uint8Array":
        case "Uint8ClampedArray":
        case "Int16Array":
        case "Uint16Array":
        case "Float16Array":
        case "Int32Array":
        case "Uint32Array":
        case "Float32Array":
        case "Float64Array":
        case "BigInt64Array":
        case "BigUint64Array":
        case "DataView": {
          const typedArray = thing;
          str = '["' + type + '",' + flatten(typedArray.buffer);
          if (typedArray.byteLength !== typedArray.buffer.byteLength) {
            str += `,${typedArray.byteOffset},${typedArray.length}`;
          }
          str += "]";
          break;
        }
        case "ArrayBuffer": {
          const arraybuffer = thing;
          const base64 = encode64(arraybuffer);
          str = `["ArrayBuffer","${base64}"]`;
          break;
        }
        case "Temporal.Duration":
        case "Temporal.Instant":
        case "Temporal.PlainDate":
        case "Temporal.PlainTime":
        case "Temporal.PlainDateTime":
        case "Temporal.PlainMonthDay":
        case "Temporal.PlainYearMonth":
        case "Temporal.ZonedDateTime":
          str = `["${type}",${stringify_string(thing.toString())}]`;
          break;
        default:
          if (!is_plain_object(thing)) {
            throw new DevalueError(`Cannot stringify arbitrary non-POJOs`, keys, thing, value);
          }
          if (enumerable_symbols(thing).length > 0) {
            throw new DevalueError(`Cannot stringify POJOs with symbolic keys`, keys, thing, value);
          }
          if (Object.getPrototypeOf(thing) === null) {
            str = '["null"';
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              keys.push(stringify_key(key));
              str += `,${stringify_string(key)},${flatten(thing[key])}`;
              keys.pop();
            }
            str += "]";
          } else {
            str = "{";
            let started = false;
            for (const key of Object.keys(thing)) {
              if (key === "__proto__") {
                throw new DevalueError(
                  `Cannot stringify objects with __proto__ keys`,
                  keys,
                  thing,
                  value
                );
              }
              if (started) str += ",";
              started = true;
              keys.push(stringify_key(key));
              str += `${stringify_string(key)}:${flatten(thing[key])}`;
              keys.pop();
            }
            str += "}";
          }
      }
    }
    stringified[index2] = str;
    return index2;
  }
  const index = flatten(value);
  if (index < 0) return `${index}`;
  return stringified;
}
function stringify_primitive(thing) {
  const type = typeof thing;
  if (type === "string") return stringify_string(thing);
  if (thing === void 0) return UNDEFINED.toString();
  if (thing === 0 && 1 / thing < 0) return NEGATIVE_ZERO.toString();
  if (type === "bigint") return `["BigInt","${thing}"]`;
  return String(thing);
}
function isActionError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionError";
}
function isInputError(error2) {
  return typeof error2 === "object" && error2 != null && "type" in error2 && error2.type === "AstroActionInputError" && "issues" in error2 && Array.isArray(error2.issues);
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, {})?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error2 = ActionError.fromJson(json);
      error2.stack = actionResultErrorStack.get();
      return {
        error: error2,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse$1(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}
function $constructor(name, initializer2, params) {
  function init(inst, def) {
    if (!inst._zod) {
      Object.defineProperty(inst, "_zod", {
        value: {
          def,
          constr: _4,
          traits: /* @__PURE__ */ new Set()
        },
        enumerable: false
      });
    }
    if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer2(inst, def);
    const proto = _4.prototype;
    const keys = Object.keys(proto);
    for (let i5 = 0; i5 < keys.length; i5++) {
      const k4 = keys[i5];
      if (!(k4 in inst)) {
        inst[k4] = proto[k4].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _4(def) {
    var _a7;
    const inst = params?.Parent ? new Definition() : this;
    init(inst, def);
    (_a7 = inst._zod).deferred ?? (_a7.deferred = []);
    for (const fn of inst._zod.deferred) {
      fn();
    }
    return inst;
  }
  Object.defineProperty(_4, "init", { value: init });
  Object.defineProperty(_4, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_4, "name", { value: name });
  return _4;
}
function config(newConfig) {
  return globalConfig;
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v4) => typeof v4 === "number");
  const values = Object.entries(entries).filter(([k4, _4]) => numericValues.indexOf(+k4) === -1).map(([_4, v4]) => v4);
  return values;
}
function jsonStringifyReplacer(_4, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start2 = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start2, end);
}
function defineLazy(object, key, getter) {
  let value = void 0;
  Object.defineProperty(object, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v4) {
      Object.defineProperty(object, key, {
        value: v4
        // configurable: true,
      });
    },
    configurable: true
  });
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
function isPlainObject(o4) {
  if (isObject(o4) === false)
    return false;
  const ctor = o4.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o4) {
  if (isPlainObject(o4))
    return { ...o4 };
  if (Array.isArray(o4))
    return [...o4];
  if (o4 instanceof Map)
    return new Map(o4);
  if (o4 instanceof Set)
    return new Set(o4);
  return o4;
}
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function aborted(x4, startIndex = 0) {
  if (x4.aborted === true)
    return true;
  for (let i5 = startIndex; i5 < x4.issues.length; i5++) {
    if (x4.issues[i5]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x4, startIndex = 0) {
  if (x4.aborted === true)
    return true;
  for (let i5 = startIndex; i5 < x4.issues.length; i5++) {
    if (x4.issues[i5]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a7;
    (_a7 = iss).path ?? (_a7.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function finalizeIssue(iss, ctx, config2) {
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const { inst: _inst, continue: _continue, input: _input, ...rest } = iss;
  rest.path ?? (rest.path = []);
  rest.message = message;
  if (ctx?.reportInput) {
    rest.input = _input;
  }
  return rest;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function flattenError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error2.issues) {
    if (sub.path.length > 0) {
      fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
      fieldErrors[sub.path[0]].push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error3, path = []) => {
    for (const issue2 of error3.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i5 = 0;
          while (i5 < fullpath.length) {
            const el = fullpath[i5];
            const terminal = i5 === fullpath.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue2));
            }
            curr = curr[el];
            i5++;
          }
        }
      }
    }
  };
  processError(error2);
  return fieldErrors;
}
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r4) => !aborted(r4));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
function mergeValues(a4, b3) {
  if (a4 === b3) {
    return { valid: true, data: a4 };
  }
  if (a4 instanceof Date && b3 instanceof Date && +a4 === +b3) {
    return { valid: true, data: a4 };
  }
  if (isPlainObject(a4) && isPlainObject(b3)) {
    const bKeys = Object.keys(b3);
    const sharedKeys = Object.keys(a4).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a4, ...b3 };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a4[key], b3[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a4) && Array.isArray(b3)) {
    if (a4.length !== b3.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a4.length; index++) {
      const itemA = a4[index];
      const itemB = b3[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  for (const iss of left.issues) {
    if (iss.code === "unrecognized_keys") {
      unrecIssue ?? (unrecIssue = iss);
      for (const k4 of iss.keys) {
        if (!unrecKeys.has(k4))
          unrecKeys.set(k4, {});
        unrecKeys.get(k4).l = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  for (const iss of right.issues) {
    if (iss.code === "unrecognized_keys") {
      for (const k4 of iss.keys) {
        if (!unrecKeys.has(k4))
          unrecKeys.set(k4, {});
        unrecKeys.get(k4).r = true;
      }
    } else {
      result.issues.push(iss);
    }
  }
  const bothKeys = [...unrecKeys].filter(([, f5]) => f5.l && f5.r).map(([k4]) => k4);
  if (bothKeys.length && unrecIssue) {
    result.issues.push({ ...unrecIssue, keys: bothKeys });
  }
  if (aborted(result))
    return result;
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
function handleOptionalResult(result, input) {
  if (input === void 0 && (result.issues.length || result.fallback)) {
    return { issues: [], value: void 0 };
  }
  return result;
}
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handlePipeResult(left, next, ctx) {
  if (left.issues.length) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues, fallback: left.fallback }, ctx);
}
function handleReadonlyResult(payload) {
  payload.value = Object.freeze(payload.value);
  return payload;
}
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}
function registry() {
  return new $ZodRegistry();
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _array(Class, element, params) {
  return new Class({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _refine(Class, fn, _params) {
  const schema = new Class({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue$1) => {
      if (typeof issue$1 === "string") {
        payload.issues.push(issue(issue$1, payload.value, ch._zod.def));
      } else {
        const _issue = issue$1;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        _issue.input ?? (_issue.input = payload.value);
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    external: params?.external ?? void 0
  };
}
function process$1(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a7;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      process$1(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta = ctx.metadataRegistry.get(schema);
  if (meta)
    Object.assign(result.schema, meta);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a7 = result.schema).default ?? (_a7.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${id}` };
    }
    if (entry[1] === root) {
      return { ref: "#" };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + defId };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
        continue;
      }
    }
  }
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        Object.assign(schema2, refSchema);
      }
      Object.assign(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  for (const entry of [...ctx.seen.entries()].reverse()) {
    flattenRef(entry[0]);
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") ;
  else ;
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  Object.assign(result, root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (seen.def && seen.defId) {
      if (seen.def.id === seen.defId)
        delete seen.def.id;
      defs[seen.defId] = seen.def;
    }
  }
  if (ctx.external) ;
  else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
function shouldAppendForwardSlash(trailingSlash, buildFormat) {
  switch (trailingSlash) {
    case "always":
      return true;
    case "never":
      return false;
    case "ignore": {
      switch (buildFormat) {
        case "directory":
          return true;
        case "preserve":
        case "file":
          return false;
      }
    }
  }
}
function normalizeLF(code) {
  return code.replace(/\r\n|\r(?!\n)|\n/g, "\n");
}
function codeFrame(src, loc) {
  if (!loc || loc.line === void 0 || loc.column === void 0) {
    return "";
  }
  const lines = normalizeLF(src).split("\n").map((ln2) => ln2.replace(/\t/g, "  "));
  const visibleLines = [];
  for (let n3 = -2; n3 <= 2; n3++) {
    if (lines[loc.line + n3]) visibleLines.push(loc.line + n3);
  }
  let gutterWidth = 0;
  for (const lineNo of visibleLines) {
    let w4 = `> ${lineNo}`;
    if (w4.length > gutterWidth) gutterWidth = w4.length;
  }
  let output = "";
  for (const lineNo of visibleLines) {
    const isFocusedLine = lineNo === loc.line - 1;
    output += isFocusedLine ? "> " : "  ";
    output += `${lineNo + 1} | ${lines[lineNo]}
`;
    if (isFocusedLine)
      output += `${Array.from({ length: gutterWidth }).join(" ")}  | ${Array.from({
        length: loc.column
      }).join(" ")}^
`;
  }
  return output;
}
async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer2 = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer2.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer2;
}
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error2) {
          if (error2 instanceof Error && "name" in error2 && typeof error2.name === "string" && error2.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error2;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e4) {
          if (e4 instanceof ActionError) {
            return { data: void 0, error: e4 };
          }
          if (e4 instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e4;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e4) {
    if (e4 instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e4;
  }
  throw new TypeError("Unsupported content type");
}
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t4) => type === t4);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, {})?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$2(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e4) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e4)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer2) {
  const copy = new Uint8Array(buffer2.byteLength);
  copy.set(buffer2);
  return copy.buffer;
}
function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}
function requireDist() {
  if (hasRequiredDist) return dist;
  hasRequiredDist = 1;
  Object.defineProperty(dist, "__esModule", { value: true });
  dist.parseCookie = parseCookie;
  dist.parse = parseCookie;
  dist.stringifyCookie = stringifyCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  dist.parseSetCookie = parseSetCookie;
  dist.stringifySetCookie = stringifySetCookie;
  dist.serialize = stringifySetCookie;
  const cookieNameRegExp = /^[\u0021-\u003A\u003C\u003E-\u007E]+$/;
  const cookieValueRegExp = /^[\u0021-\u003A\u003C-\u007E]*$/;
  const domainValueRegExp = /^([.]?[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)([.][a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)*$/i;
  const pathValueRegExp = /^[\u0020-\u003A\u003D-\u007E]*$/;
  const maxAgeRegExp = /^-?\d+$/;
  const __toString = Object.prototype.toString;
  const NullObject = /* @__PURE__ */ (() => {
    const C4 = function() {
    };
    C4.prototype = /* @__PURE__ */ Object.create(null);
    return C4;
  })();
  function parseCookie(str, options) {
    const obj = new NullObject();
    const len = str.length;
    if (len < 2)
      return obj;
    const dec = options?.decode || decode2;
    let index = 0;
    do {
      const eqIdx = eqIndex(str, index, len);
      if (eqIdx === -1)
        break;
      const endIdx = endIndex(str, index, len);
      if (eqIdx > endIdx) {
        index = str.lastIndexOf(";", eqIdx - 1) + 1;
        continue;
      }
      const key = valueSlice(str, index, eqIdx);
      if (obj[key] === void 0) {
        obj[key] = dec(valueSlice(str, eqIdx + 1, endIdx));
      }
      index = endIdx + 1;
    } while (index < len);
    return obj;
  }
  function stringifyCookie(cookie, options) {
    const enc = options?.encode || encodeURIComponent;
    const cookieStrings = [];
    for (const name of Object.keys(cookie)) {
      const val = cookie[name];
      if (val === void 0)
        continue;
      if (!cookieNameRegExp.test(name)) {
        throw new TypeError(`cookie name is invalid: ${name}`);
      }
      const value = enc(val);
      if (!cookieValueRegExp.test(value)) {
        throw new TypeError(`cookie val is invalid: ${val}`);
      }
      cookieStrings.push(`${name}=${value}`);
    }
    return cookieStrings.join("; ");
  }
  function stringifySetCookie(_name, _val, _opts) {
    const cookie = typeof _name === "object" ? _name : { ..._opts, name: _name, value: String(_val) };
    const options = typeof _val === "object" ? _val : _opts;
    const enc = options?.encode || encodeURIComponent;
    if (!cookieNameRegExp.test(cookie.name)) {
      throw new TypeError(`argument name is invalid: ${cookie.name}`);
    }
    const value = cookie.value ? enc(cookie.value) : "";
    if (!cookieValueRegExp.test(value)) {
      throw new TypeError(`argument val is invalid: ${cookie.value}`);
    }
    let str = cookie.name + "=" + value;
    if (cookie.maxAge !== void 0) {
      if (!Number.isInteger(cookie.maxAge)) {
        throw new TypeError(`option maxAge is invalid: ${cookie.maxAge}`);
      }
      str += "; Max-Age=" + cookie.maxAge;
    }
    if (cookie.domain) {
      if (!domainValueRegExp.test(cookie.domain)) {
        throw new TypeError(`option domain is invalid: ${cookie.domain}`);
      }
      str += "; Domain=" + cookie.domain;
    }
    if (cookie.path) {
      if (!pathValueRegExp.test(cookie.path)) {
        throw new TypeError(`option path is invalid: ${cookie.path}`);
      }
      str += "; Path=" + cookie.path;
    }
    if (cookie.expires) {
      if (!isDate(cookie.expires) || !Number.isFinite(cookie.expires.valueOf())) {
        throw new TypeError(`option expires is invalid: ${cookie.expires}`);
      }
      str += "; Expires=" + cookie.expires.toUTCString();
    }
    if (cookie.httpOnly) {
      str += "; HttpOnly";
    }
    if (cookie.secure) {
      str += "; Secure";
    }
    if (cookie.partitioned) {
      str += "; Partitioned";
    }
    if (cookie.priority) {
      const priority = typeof cookie.priority === "string" ? cookie.priority.toLowerCase() : void 0;
      switch (priority) {
        case "low":
          str += "; Priority=Low";
          break;
        case "medium":
          str += "; Priority=Medium";
          break;
        case "high":
          str += "; Priority=High";
          break;
        default:
          throw new TypeError(`option priority is invalid: ${cookie.priority}`);
      }
    }
    if (cookie.sameSite) {
      const sameSite = typeof cookie.sameSite === "string" ? cookie.sameSite.toLowerCase() : cookie.sameSite;
      switch (sameSite) {
        case true:
        case "strict":
          str += "; SameSite=Strict";
          break;
        case "lax":
          str += "; SameSite=Lax";
          break;
        case "none":
          str += "; SameSite=None";
          break;
        default:
          throw new TypeError(`option sameSite is invalid: ${cookie.sameSite}`);
      }
    }
    return str;
  }
  function parseSetCookie(str, options) {
    const dec = options?.decode || decode2;
    const len = str.length;
    const endIdx = endIndex(str, 0, len);
    const eqIdx = eqIndex(str, 0, endIdx);
    const setCookie = eqIdx === -1 ? { name: "", value: dec(valueSlice(str, 0, endIdx)) } : {
      name: valueSlice(str, 0, eqIdx),
      value: dec(valueSlice(str, eqIdx + 1, endIdx))
    };
    let index = endIdx + 1;
    while (index < len) {
      const endIdx2 = endIndex(str, index, len);
      const eqIdx2 = eqIndex(str, index, endIdx2);
      const attr = eqIdx2 === -1 ? valueSlice(str, index, endIdx2) : valueSlice(str, index, eqIdx2);
      const val = eqIdx2 === -1 ? void 0 : valueSlice(str, eqIdx2 + 1, endIdx2);
      switch (attr.toLowerCase()) {
        case "httponly":
          setCookie.httpOnly = true;
          break;
        case "secure":
          setCookie.secure = true;
          break;
        case "partitioned":
          setCookie.partitioned = true;
          break;
        case "domain":
          setCookie.domain = val;
          break;
        case "path":
          setCookie.path = val;
          break;
        case "max-age":
          if (val && maxAgeRegExp.test(val))
            setCookie.maxAge = Number(val);
          break;
        case "expires":
          if (!val)
            break;
          const date = new Date(val);
          if (Number.isFinite(date.valueOf()))
            setCookie.expires = date;
          break;
        case "priority":
          if (!val)
            break;
          const priority = val.toLowerCase();
          if (priority === "low" || priority === "medium" || priority === "high") {
            setCookie.priority = priority;
          }
          break;
        case "samesite":
          if (!val)
            break;
          const sameSite = val.toLowerCase();
          if (sameSite === "lax" || sameSite === "strict" || sameSite === "none") {
            setCookie.sameSite = sameSite;
          }
          break;
      }
      index = endIdx2 + 1;
    }
    return setCookie;
  }
  function endIndex(str, min, len) {
    const index = str.indexOf(";", min);
    return index === -1 ? len : index;
  }
  function eqIndex(str, min, max) {
    const index = str.indexOf("=", min);
    return index < max ? index : -1;
  }
  function valueSlice(str, min, max) {
    let start2 = min;
    let end = max;
    do {
      const code = str.charCodeAt(start2);
      if (code !== 32 && code !== 9)
        break;
    } while (++start2 < end);
    while (end > start2) {
      const code = str.charCodeAt(end - 1);
      if (code !== 32 && code !== 9)
        break;
      end--;
    }
    return str.slice(start2, end);
  }
  function decode2(str) {
    if (str.indexOf("%") === -1)
      return str;
    try {
      return decodeURIComponent(str);
    } catch (e4) {
      return str;
    }
  }
  function isDate(val) {
    return __toString.call(val) === "[object Date]";
  }
  return dist;
}
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of cookies.consume()) {
    yield headerValue;
  }
  return [];
}
function defineMiddleware(fn) {
  return fn;
}
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType2 = request.headers.has("content-type");
    if (hasContentType2) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}
function createRequest({
  url,
  headers,
  method = "GET",
  body = void 0,
  logger,
  isPrerendered = false,
  routePattern,
  init
}) {
  const headersObj = isPrerendered ? void 0 : headers instanceof Headers ? headers : new Headers(
    // Filter out HTTP/2 pseudo-headers. These are internally-generated headers added to all HTTP/2 requests with trusted metadata about the request.
    // Examples include `:method`, `:scheme`, `:authority`, and `:path`.
    // They are always prefixed with a colon to distinguish them from other headers, and it is an error to add the to a Headers object manually.
    // See https://httpwg.org/specs/rfc7540.html#HttpRequest
    Object.entries(headers).filter(([name]) => !name.startsWith(":"))
  );
  if (typeof url === "string") url = new URL(url);
  if (isPrerendered) {
    url.search = "";
  }
  const request = new Request(url, {
    method,
    headers: headersObj,
    // body is made available only if the request is for a page that will be on-demand rendered
    body: isPrerendered ? null : body,
    ...init
  });
  if (isPrerendered) {
    let _headers = request.headers;
    const { value, writable, ...headersDesc } = Object.getOwnPropertyDescriptor(request, "headers") || {};
    Object.defineProperty(request, "headers", {
      ...headersDesc,
      get() {
        logger.warn(
          null,
          `\`Astro.request.headers\` was used when rendering the route \`${routePattern}'\`. \`Astro.request.headers\` is not available on prerendered pages. If you need access to request headers, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default.`
        );
        return _headers;
      },
      set(newHeaders) {
        _headers = newHeaders;
      }
    });
  }
  return request;
}
function template({
  title,
  pathname,
  statusCode = 404,
  tabTitle,
  body
}) {
  return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>${tabTitle}</title>
		<style>
			:root {
				--gray-10: hsl(258, 7%, 10%);
				--gray-20: hsl(258, 7%, 20%);
				--gray-30: hsl(258, 7%, 30%);
				--gray-40: hsl(258, 7%, 40%);
				--gray-50: hsl(258, 7%, 50%);
				--gray-60: hsl(258, 7%, 60%);
				--gray-70: hsl(258, 7%, 70%);
				--gray-80: hsl(258, 7%, 80%);
				--gray-90: hsl(258, 7%, 90%);
				--black: #13151A;
				--accent-light: #E0CCFA;
			}

			* {
				box-sizing: border-box;
			}

			html {
				background: var(--black);
				color-scheme: dark;
				accent-color: var(--accent-light);
			}

			body {
				background-color: var(--gray-10);
				color: var(--gray-80);
				font-family: ui-monospace, Menlo, Monaco, "Cascadia Mono", "Segoe UI Mono", "Roboto Mono", "Oxygen Mono", "Ubuntu Monospace", "Source Code Pro", "Fira Mono", "Droid Sans Mono", "Courier New", monospace;
				line-height: 1.5;
				margin: 0;
			}

			a {
				color: var(--accent-light);
			}

			.center {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				height: 100vh;
				width: 100vw;
			}

			h1 {
				margin-bottom: 8px;
				color: white;
				font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				font-weight: 700;
				margin-top: 1rem;
				margin-bottom: 0;
			}

			.statusCode {
				color: var(--accent-light);
			}

			.astro-icon {
				height: 124px;
				width: 124px;
			}

			pre, code {
				padding: 2px 8px;
				background: rgba(0,0,0, 0.25);
				border: 1px solid rgba(255,255,255, 0.25);
				border-radius: 4px;
				font-size: 1.2em;
				margin-top: 0;
				max-width: 60em;
			}
		</style>
	</head>
	<body>
		<main class="center">
			<svg class="astro-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="80" viewBox="0 0 64 80" fill="none"> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="white"/> <path d="M20.5253 67.6322C16.9291 64.3531 15.8793 57.4632 17.3776 52.4717C19.9755 55.6188 23.575 56.6157 27.3035 57.1784C33.0594 58.0468 38.7122 57.722 44.0592 55.0977C44.6709 54.7972 45.2362 54.3978 45.9045 53.9931C46.4062 55.4451 46.5368 56.9109 46.3616 58.4028C45.9355 62.0362 44.1228 64.8429 41.2397 66.9705C40.0868 67.8215 38.8669 68.5822 37.6762 69.3846C34.0181 71.8508 33.0285 74.7426 34.403 78.9491C34.4357 79.0516 34.4649 79.1541 34.5388 79.4042C32.6711 78.5705 31.3069 77.3565 30.2674 75.7604C29.1694 74.0757 28.6471 72.2121 28.6196 70.1957C28.6059 69.2144 28.6059 68.2244 28.4736 67.257C28.1506 64.8985 27.0406 63.8425 24.9496 63.7817C22.8036 63.7192 21.106 65.0426 20.6559 67.1268C20.6215 67.2865 20.5717 67.4446 20.5218 67.6304L20.5253 67.6322Z" fill="url(#paint0_linear_738_686)"/> <path d="M0 51.6401C0 51.6401 10.6488 46.4654 21.3274 46.4654L29.3786 21.6102C29.6801 20.4082 30.5602 19.5913 31.5538 19.5913C32.5474 19.5913 33.4275 20.4082 33.7289 21.6102L41.7802 46.4654C54.4274 46.4654 63.1076 51.6401 63.1076 51.6401C63.1076 51.6401 45.0197 2.48776 44.9843 2.38914C44.4652 0.935933 43.5888 0 42.4073 0H20.7022C19.5206 0 18.6796 0.935933 18.1251 2.38914C18.086 2.4859 0 51.6401 0 51.6401Z" fill="white"/> <defs> <linearGradient id="paint0_linear_738_686" x1="31.554" y1="75.4423" x2="39.7462" y2="48.376" gradientUnits="userSpaceOnUse"> <stop stop-color="#D83333"/> <stop offset="1" stop-color="#F041FF"/> </linearGradient> </defs> </svg>
			<h1>${statusCode ? `<span class="statusCode">${statusCode}: </span> ` : ""}<span class="statusMessage">${title}</span></h1>
			${body || `
				<pre>Path: ${escape(pathname)}</pre>
			`}
			</main>
	</body>
</html>`;
}
async function default404Page({ pathname }) {
  return new Response(
    template({
      statusCode: 404,
      title: "Not found",
      tabTitle: "404: Not Found",
      pathname
    }),
    { status: 404, headers: { "Content-Type": "text/html" } }
  );
}
function isRoute404(route) {
  return ROUTE404_RE.test(route);
}
function isRoute500(route) {
  return ROUTE500_RE.test(route);
}
function findRouteToRewrite({
  payload,
  routes,
  request,
  trailingSlash,
  buildFormat,
  base,
  outDir
}) {
  let newUrl = void 0;
  if (payload instanceof URL) {
    newUrl = payload;
  } else if (payload instanceof Request) {
    newUrl = new URL(payload.url);
  } else {
    newUrl = new URL(collapseDuplicateSlashes(payload), new URL(request.url).origin);
  }
  const { pathname, resolvedUrlPathname } = normalizeRewritePathname(
    newUrl.pathname,
    base,
    trailingSlash,
    buildFormat
  );
  newUrl.pathname = resolvedUrlPathname;
  const decodedPathname = decodeURI(pathname);
  if (isRoute404(decodedPathname)) {
    const errorRoute = routes.find((route) => route.route === "/404");
    if (errorRoute) {
      return { routeData: errorRoute, newUrl, pathname: decodedPathname };
    }
  }
  if (isRoute500(decodedPathname)) {
    const errorRoute = routes.find((route) => route.route === "/500");
    if (errorRoute) {
      return { routeData: errorRoute, newUrl, pathname: decodedPathname };
    }
  }
  let foundRoute;
  for (const route of routes) {
    if (route.pattern.test(decodedPathname)) {
      if (route.params && route.params.length !== 0 && route.distURL && route.distURL.length !== 0) {
        if (!route.distURL.find(
          (url) => url.href.replace(outDir.toString(), "").replace(/(?:\/index\.html|\.html)$/, "") === trimSlashes(pathname)
        )) {
          continue;
        }
      }
      foundRoute = route;
      break;
    }
  }
  if (foundRoute) {
    return {
      routeData: foundRoute,
      newUrl,
      pathname: decodedPathname
    };
  } else {
    const custom404 = routes.find((route) => route.route === "/404");
    if (custom404) {
      return { routeData: custom404, newUrl, pathname };
    } else {
      return { routeData: DEFAULT_404_ROUTE, newUrl, pathname };
    }
  }
}
function copyRequest(newUrl, oldRequest, isPrerendered, logger, routePattern) {
  if (oldRequest.bodyUsed) {
    throw new AstroError(RewriteWithBodyUsed);
  }
  return createRequest({
    url: newUrl,
    method: oldRequest.method,
    body: oldRequest.body,
    isPrerendered,
    logger,
    headers: isPrerendered ? {} : oldRequest.headers,
    routePattern,
    init: {
      referrer: oldRequest.referrer,
      referrerPolicy: oldRequest.referrerPolicy,
      mode: oldRequest.mode,
      credentials: oldRequest.credentials,
      cache: oldRequest.cache,
      redirect: oldRequest.redirect,
      integrity: oldRequest.integrity,
      signal: oldRequest.signal,
      keepalive: oldRequest.keepalive,
      // https://fetch.spec.whatwg.org/#dom-request-duplex
      // @ts-expect-error It isn't part of the types, but undici accepts it and it allows carrying over the body to a new request
      duplex: "half"
    }
  });
}
function setOriginPathname(request, pathname, trailingSlash, buildFormat) {
  if (!pathname) {
    pathname = "/";
  }
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  let finalPathname;
  if (pathname === "/") {
    finalPathname = "/";
  } else if (shouldAppendSlash) {
    finalPathname = appendForwardSlash(pathname);
  } else {
    finalPathname = removeTrailingForwardSlash(pathname);
  }
  Reflect.set(request, originPathnameSymbol, encodeURIComponent(finalPathname));
}
function getOriginPathname(request) {
  const origin = Reflect.get(request, originPathnameSymbol);
  if (origin) {
    return decodeURIComponent(origin);
  }
  return new URL(request.url).pathname;
}
function normalizeRewritePathname(urlPathname, base, trailingSlash, buildFormat) {
  let pathname = collapseDuplicateSlashes(urlPathname);
  const shouldAppendSlash = shouldAppendForwardSlash(trailingSlash, buildFormat);
  if (base !== "/") {
    const isBasePathRequest = urlPathname === base || urlPathname === removeTrailingForwardSlash(base);
    if (isBasePathRequest) {
      pathname = "/";
    } else if (urlPathname.startsWith(base)) {
      pathname = shouldAppendSlash ? appendForwardSlash(urlPathname) : removeTrailingForwardSlash(urlPathname);
      pathname = pathname.slice(base.length);
    }
  }
  if (!pathname.startsWith("/") && shouldAppendSlash && urlPathname.endsWith("/")) {
    pathname = prependForwardSlash(pathname);
  }
  if (buildFormat === "file") {
    pathname = pathname.replace(/\.html$/, "");
  }
  let resolvedUrlPathname;
  if (base !== "/" && (pathname === "" || pathname === "/") && !shouldAppendSlash) {
    resolvedUrlPathname = removeTrailingForwardSlash(base);
  } else {
    resolvedUrlPathname = joinPaths(...[base, pathname].filter(Boolean));
  }
  return { pathname, resolvedUrlPathname };
}
function sequence(...handlers2) {
  const filtered = handlers2.filter((h4) => !!h4);
  const length = filtered.length;
  if (!length) {
    return defineMiddleware((_context, next) => {
      return next();
    });
  }
  return defineMiddleware((context, next) => {
    let carriedPayload = void 0;
    return applyHandle(0, context);
    function applyHandle(i5, handleContext) {
      const handle2 = filtered[i5];
      const result = handle2(handleContext, async (payload) => {
        if (i5 < length - 1) {
          if (payload) {
            let newRequest;
            if (payload instanceof Request) {
              newRequest = payload;
            } else if (payload instanceof URL) {
              newRequest = new Request(payload, handleContext.request.clone());
            } else {
              newRequest = new Request(
                new URL(payload, handleContext.url.origin),
                handleContext.request.clone()
              );
            }
            const oldPathname = handleContext.url.pathname;
            const pipeline = Reflect.get(handleContext, pipelineSymbol);
            const { routeData, pathname } = await pipeline.tryRewrite(
              payload,
              handleContext.request
            );
            if (pipeline.manifest.serverLike === true && handleContext.isPrerendered === false && routeData.prerender === true) {
              throw new AstroError({
                ...ForbiddenRewrite,
                message: ForbiddenRewrite.message(
                  handleContext.url.pathname,
                  pathname,
                  routeData.component
                ),
                hint: ForbiddenRewrite.hint(routeData.component)
              });
            }
            carriedPayload = payload;
            handleContext.request = newRequest;
            handleContext.url = new URL(newRequest.url);
            handleContext.params = getParams(routeData, pathname);
            handleContext.routePattern = routeData.route;
            setOriginPathname(
              handleContext.request,
              oldPathname,
              pipeline.manifest.trailingSlash,
              pipeline.manifest.buildFormat
            );
          }
          return applyHandle(i5 + 1, handleContext);
        } else {
          return next(payload ?? carriedPayload);
        }
      });
      return result;
    }
  });
}
function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? collapseDuplicateLeadingSlashes("/" + segmentPath) : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}
function validateGetStaticPathsParameter([key, value], route) {
  if (!VALID_PARAM_TYPES.includes(typeof value)) {
    throw new AstroError({
      ...GetStaticPathsInvalidRouteParam,
      message: GetStaticPathsInvalidRouteParam.message(key, value, typeof value),
      location: {
        file: route
      }
    });
  }
}
function stringifyParams(params, route, trailingSlash) {
  const validatedParams = {};
  for (const [key, value] of Object.entries(params)) {
    validateGetStaticPathsParameter([key, value], route.component);
    if (value !== void 0) {
      validatedParams[key] = trimSlashes(value);
    }
  }
  return getRouteGenerator(route.segments, trailingSlash)(validatedParams);
}
function validateDynamicRouteModule(mod, {
  ssr,
  route
}) {
  if ((!ssr || route.prerender) && route.origin !== "internal" && !mod.getStaticPaths) {
    throw new AstroError({
      ...GetStaticPathsRequired,
      location: { file: route.component }
    });
  }
}
function validateGetStaticPathsResult(result, route) {
  if (!Array.isArray(result)) {
    throw new AstroError({
      ...InvalidGetStaticPathsReturn,
      message: InvalidGetStaticPathsReturn.message(typeof result),
      location: {
        file: route.component
      }
    });
  }
  result.forEach((pathObject) => {
    if (typeof pathObject === "object" && Array.isArray(pathObject) || pathObject === null) {
      throw new AstroError({
        ...InvalidGetStaticPathsEntry,
        message: InvalidGetStaticPathsEntry.message(
          Array.isArray(pathObject) ? "array" : typeof pathObject
        )
      });
    }
    if (pathObject.params === void 0 || pathObject.params === null || pathObject.params && Object.keys(pathObject.params).length === 0) {
      throw new AstroError({
        ...GetStaticPathsExpectedParams,
        location: {
          file: route.component
        }
      });
    }
  });
}
function generatePaginateFunction(routeMatch, base, trailingSlash) {
  return function paginateUtility(data, args = {}) {
    const generate = getRouteGenerator(routeMatch.segments, trailingSlash);
    let { pageSize: _pageSize, params: _params, props: _props } = args;
    const pageSize = _pageSize || 10;
    const paramName = "page";
    const additionalParams = _params || {};
    const additionalProps = _props || {};
    let includesFirstPageNumber;
    if (routeMatch.params.includes(`...${paramName}`)) {
      includesFirstPageNumber = false;
    } else if (routeMatch.params.includes(`${paramName}`)) {
      includesFirstPageNumber = true;
    } else {
      throw new AstroError({
        ...PageNumberParamNotFound,
        message: PageNumberParamNotFound.message(paramName)
      });
    }
    const lastPage = Math.max(1, Math.ceil(data.length / pageSize));
    const result = [...Array(lastPage).keys()].map((num) => {
      const pageNum = num + 1;
      const start2 = pageSize === Number.POSITIVE_INFINITY ? 0 : (pageNum - 1) * pageSize;
      const end = Math.min(start2 + pageSize, data.length);
      const params = {
        ...additionalParams,
        [paramName]: includesFirstPageNumber || pageNum > 1 ? String(pageNum) : void 0
      };
      const current = addRouteBase(generate({ ...params }), base);
      const next = pageNum === lastPage ? void 0 : addRouteBase(generate({ ...params, page: String(pageNum + 1) }), base);
      const prev = pageNum === 1 ? void 0 : addRouteBase(
        generate({
          ...params,
          page: !includesFirstPageNumber && pageNum - 1 === 1 ? void 0 : String(pageNum - 1)
        }),
        base
      );
      const first = pageNum === 1 ? void 0 : addRouteBase(
        generate({
          ...params,
          page: includesFirstPageNumber ? "1" : void 0
        }),
        base
      );
      const last = pageNum === lastPage ? void 0 : addRouteBase(generate({ ...params, page: String(lastPage) }), base);
      return {
        params,
        props: {
          ...additionalProps,
          page: {
            data: data.slice(start2, end),
            start: start2,
            end: end - 1,
            size: pageSize,
            total: data.length,
            currentPage: pageNum,
            lastPage,
            url: { current, next, prev, first, last }
          }
        }
      };
    });
    return result;
  };
}
function addRouteBase(route, base) {
  let routeWithBase = joinPaths(base, route);
  if (routeWithBase === "") routeWithBase = "/";
  return routeWithBase;
}
async function callGetStaticPaths({
  mod,
  route,
  routeCache,
  ssr,
  base,
  trailingSlash
}) {
  const cached = routeCache.get(route);
  if (!mod) {
    throw new Error("This is an error caused by Astro and not your code. Please file an issue.");
  }
  if (cached?.staticPaths && cached.mod === mod) {
    return cached.staticPaths;
  }
  validateDynamicRouteModule(mod, { ssr, route });
  if (ssr && !route.prerender || route.origin === "internal") {
    const entry = Object.assign([], { keyed: /* @__PURE__ */ new Map() });
    routeCache.set(route, { ...cached, mod, staticPaths: entry });
    return entry;
  }
  let staticPaths = [];
  if (!mod.getStaticPaths) {
    throw new Error("Unexpected Error.");
  }
  staticPaths = await mod.getStaticPaths({
    // Q: Why the cast?
    // A: So users downstream can have nicer typings, we have to make some sacrifice in our internal typings, which necessitate a cast here
    paginate: generatePaginateFunction(route, base, trailingSlash),
    routePattern: route.route
  });
  validateGetStaticPathsResult(staticPaths, route);
  const keyedStaticPaths = staticPaths;
  keyedStaticPaths.keyed = /* @__PURE__ */ new Map();
  for (const sp of keyedStaticPaths) {
    const paramsKey = stringifyParams(sp.params, route, trailingSlash);
    keyedStaticPaths.keyed.set(paramsKey, sp);
  }
  routeCache.set(route, { ...cached, mod, staticPaths: keyedStaticPaths });
  return keyedStaticPaths;
}
function findPathItemByKey(staticPaths, params, route, logger, trailingSlash) {
  const paramsKey = stringifyParams(params, route, trailingSlash);
  const matchedStaticPath = staticPaths.keyed.get(paramsKey);
  if (matchedStaticPath) {
    return matchedStaticPath;
  }
  logger.debug("router", `findPathItemByKey() - Unexpected cache miss looking for ${paramsKey}`);
}
async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${s$1.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}
function isPromise(value) {
  return !!value && typeof value === "object" && "then" in value && typeof value.then === "function";
}
async function* streamAsyncIterator(stream) {
  const reader = stream.getReader();
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) return;
      yield value;
    }
  } finally {
    reader.releaseLock();
  }
}
function stringifyForScript(value) {
  return JSON.stringify(value)?.replace(/</g, "\\u003c");
}
function isHTMLString(value) {
  return !!value?.[htmlStringSymbol];
}
function markHTMLBytes(bytes) {
  return new HTMLBytes(bytes);
}
function hasGetReader(obj) {
  return typeof obj.getReader === "function";
}
async function* unescapeChunksAsync(iterable) {
  if (hasGetReader(iterable)) {
    for await (const chunk of streamAsyncIterator(iterable)) {
      yield unescapeHTML(chunk);
    }
  } else {
    for await (const chunk of iterable) {
      yield unescapeHTML(chunk);
    }
  }
}
function* unescapeChunks(iterable) {
  for (const chunk of iterable) {
    yield unescapeHTML(chunk);
  }
}
function unescapeHTML(str) {
  if (!!str && typeof str === "object") {
    if (str instanceof Uint8Array) {
      return markHTMLBytes(str);
    } else if (str instanceof Response && str.body) {
      const body = str.body;
      return unescapeChunksAsync(body);
    } else if (typeof str.then === "function") {
      return Promise.resolve(str).then((value) => {
        return unescapeHTML(value);
      });
    } else if (str[/* @__PURE__ */ Symbol.for("astro:slot-string")]) {
      return str;
    } else if (Symbol.iterator in str) {
      return unescapeChunks(str);
    } else if (Symbol.asyncIterator in str || hasGetReader(str)) {
      return unescapeChunksAsync(str);
    }
  }
  return markHTMLString(str);
}
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}
function resolvePropagationHint(input) {
  const explicitHint = input.factoryHint ?? "none";
  if (explicitHint !== "none") {
    return explicitHint;
  }
  if (!input.moduleId) {
    return "none";
  }
  return input.metadataLookup(input.moduleId) ?? "none";
}
function isPropagatingHint(hint) {
  return hint === "self" || hint === "in-tree";
}
function getPropagationHint$1(result, factory) {
  return resolvePropagationHint({
    factoryHint: factory.propagation,
    moduleId: factory.moduleId,
    metadataLookup: (moduleId) => result.componentMetadata.get(moduleId)?.propagation
  });
}
function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}
function r$1(e4) {
  var t4, f5, n3 = "";
  if ("string" == typeof e4 || "number" == typeof e4) n3 += e4;
  else if ("object" == typeof e4) if (Array.isArray(e4)) {
    var o4 = e4.length;
    for (t4 = 0; t4 < o4; t4++) e4[t4] && (f5 = r$1(e4[t4])) && (n3 && (n3 += " "), n3 += f5);
  } else for (f5 in e4) e4[f5] && (n3 && (n3 += " "), n3 += f5);
  return n3;
}
function clsx() {
  for (var e4, t4, f5 = 0, n3 = "", o4 = arguments.length; f5 < o4; f5++) (e4 = arguments[f5]) && (t4 = r$1(e4)) && (n3 && (n3 += " "), n3 += t4);
  return n3;
}
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v4) => {
    return convertToSerializedForm(v4, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k4, v4]) => {
      return [k4, convertToSerializedForm(v4, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d4) => `client:${d4}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer: renderer2, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer2.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer2.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i5 = 0; i5 < str.length; i5++) {
    const ch = str.charCodeAt(i5);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}
function isHeadAndContent(obj) {
  return typeof obj === "object" && obj !== null && !!obj[headAndContentSym];
}
function createThinHead() {
  return {
    [headAndContentSym]: true
  };
}
function determineIfNeedsHydrationScript(result) {
  if (result._metadata.templateDepth > 0) {
    return !result._metadata.hasHydrationScript;
  }
  if (result._metadata.hasHydrationScript) {
    return false;
  }
  return result._metadata.hasHydrationScript = true;
}
function determinesIfNeedsDirectiveScript(result, directive) {
  if (result._metadata.templateDepth > 0) {
    return !result._metadata.hasDirectives.has(directive);
  }
  if (result._metadata.hasDirectives.has(directive)) {
    return false;
  }
  result._metadata.hasDirectives.add(directive);
  return true;
}
function getDirectiveScriptText(result, directive) {
  const clientDirectives = result.clientDirectives;
  const clientDirective = clientDirectives.get(directive);
  if (!clientDirective) {
    throw new Error(`Unknown directive: ${directive}`);
  }
  return clientDirective;
}
function getPrescripts(result, type, directive) {
  switch (type) {
    case "both":
      return `<style>${ISLAND_STYLES}</style><script>${getDirectiveScriptText(result, directive)}</script><script>${process.env.NODE_ENV === "development" ? astro_island_prebuilt_dev_default : astro_island_prebuilt_default}</script>`;
    case "directive":
      return `<script>${getDirectiveScriptText(result, directive)}</script>`;
  }
}
async function collectPropagatedHeadParts(input) {
  const collectedHeadParts = [];
  const iterator = input.propagators.values();
  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }
    const returnValue = await value.init(input.result);
    if (input.isHeadAndContent(returnValue) && returnValue.head) {
      collectedHeadParts.push(returnValue.head);
    }
  }
  return collectedHeadParts;
}
function shouldRenderHeadInstruction(state) {
  return !state.hasRenderedHead && !state.partial;
}
function shouldRenderMaybeHeadInstruction(state) {
  return !state.hasRenderedHead && !state.headInTree && !state.partial;
}
function shouldRenderInstruction$1(type, state) {
  return type === "head" ? shouldRenderHeadInstruction(state) : shouldRenderMaybeHeadInstruction(state);
}
function registerIfPropagating(result, factory, instance) {
  if (factory.propagation === "self" || factory.propagation === "in-tree") {
    result._metadata.propagators.add(
      instance
    );
    return;
  }
  if (factory.moduleId) {
    const hint = result.componentMetadata.get(factory.moduleId)?.propagation;
    if (isPropagatingHint(hint ?? "none")) {
      result._metadata.propagators.add(
        instance
      );
    }
  }
}
async function bufferPropagatedHead(result) {
  const collected = await collectPropagatedHeadParts({
    propagators: result._metadata.propagators,
    result,
    isHeadAndContent
  });
  result._metadata.extraHead.push(...collected);
}
function shouldRenderInstruction(type, state) {
  return shouldRenderInstruction$1(type, state);
}
function getInstructionRenderState(result) {
  return {
    hasRenderedHead: result._metadata.hasRenderedHead,
    headInTree: result._metadata.headInTree,
    partial: result.partial
  };
}
function renderCspContent(result) {
  const finalScriptHashes = /* @__PURE__ */ new Set();
  const finalStyleHashes = /* @__PURE__ */ new Set();
  for (const scriptHash of result.scriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  for (const styleHash of result.styleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const styleHash of result._metadata.extraStyleHashes) {
    finalStyleHashes.add(`'${styleHash}'`);
  }
  for (const scriptHash of result._metadata.extraScriptHashes) {
    finalScriptHashes.add(`'${scriptHash}'`);
  }
  let directives;
  if (result.directives.length > 0) {
    directives = result.directives.join(";") + ";";
  }
  let scriptResources = "'self'";
  if (result.scriptResources.length > 0) {
    scriptResources = result.scriptResources.map((r4) => `${r4}`).join(" ");
  }
  let styleResources = "'self'";
  if (result.styleResources.length > 0) {
    styleResources = result.styleResources.map((r4) => `${r4}`).join(" ");
  }
  const strictDynamic = result.isStrictDynamic ? ` 'strict-dynamic'` : "";
  const scriptSrc = `script-src ${scriptResources} ${Array.from(finalScriptHashes).join(" ")}${strictDynamic};`;
  const styleSrc = `style-src ${styleResources} ${Array.from(finalStyleHashes).join(" ")};`;
  return [directives, scriptSrc, styleSrc].filter(Boolean).join(" ");
}
function createRenderInstruction(instruction) {
  return Object.defineProperty(instruction, RenderInstructionSymbol, {
    value: true
  });
}
function isRenderInstruction(chunk) {
  return chunk && typeof chunk === "object" && chunk[RenderInstructionSymbol];
}
function defineScriptVars(vars) {
  let output = "";
  for (const [key, value] of Object.entries(vars)) {
    output += `const ${toIdent(key)} = ${stringifyForScript(value)};
`;
  }
  return markHTMLString(output);
}
function formatList(values) {
  if (values.length === 1) {
    return values[0];
  }
  return `${values.slice(0, -1).join(", ")} or ${values[values.length - 1]}`;
}
function isCustomElement(tagName) {
  return tagName.includes("-");
}
function handleBooleanAttribute(key, value, shouldEscape, tagName) {
  if (tagName && isCustomElement(tagName)) {
    return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
  }
  return markHTMLString(value ? ` ${key}` : "");
}
function addAttribute(value, key, shouldEscape = true, tagName = "") {
  if (value == null) {
    return "";
  }
  if (INVALID_ATTR_NAME_CHAR.test(key)) {
    return "";
  }
  if (STATIC_DIRECTIVES.has(key)) {
    console.warn(`[astro] The "${key}" directive cannot be applied dynamically at runtime. It will not be rendered as an attribute.

Make sure to use the static attribute syntax (\`${key}={value}\`) instead of the dynamic spread syntax (\`{...{ "${key}": value }}\`).`);
    return "";
  }
  if (key === "class:list") {
    const listValue = toAttributeString(clsx(value), shouldEscape);
    if (listValue === "") {
      return "";
    }
    return markHTMLString(` ${key.slice(0, -5)}="${listValue}"`);
  }
  if (key === "style" && !(value instanceof HTMLString)) {
    if (Array.isArray(value) && value.length === 2) {
      return markHTMLString(
        ` ${key}="${toAttributeString(`${toStyleString(value[0])};${value[1]}`, shouldEscape)}"`
      );
    }
    if (typeof value === "object") {
      return markHTMLString(` ${key}="${toAttributeString(toStyleString(value), shouldEscape)}"`);
    }
  }
  if (key === "className") {
    return markHTMLString(` class="${toAttributeString(value, shouldEscape)}"`);
  }
  if (htmlBooleanAttributes.test(key)) {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (value === "") {
    return markHTMLString(` ${key}`);
  }
  if (key === "popover" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (key === "download" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  if (key === "hidden" && typeof value === "boolean") {
    return handleBooleanAttribute(key, value, shouldEscape, tagName);
  }
  return markHTMLString(` ${key}="${toAttributeString(value, shouldEscape)}"`);
}
function internalSpreadAttributes(values, shouldEscape = true, tagName) {
  let output = "";
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, shouldEscape, tagName);
  }
  return markHTMLString(output);
}
function renderElement$1(name, { props: _props, children = "" }, shouldEscape = true) {
  const { lang: _4, "data-astro-id": astroId, "define:vars": defineVars, ...props } = _props;
  if (defineVars) {
    if (name === "style") {
      delete props["is:global"];
      delete props["is:scoped"];
    }
    if (name === "script") {
      delete props.hoist;
      children = defineScriptVars(defineVars) + "\n" + children;
    }
  }
  if ((children == null || children === "") && voidElementNames.test(name)) {
    return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>`;
  }
  return `<${name}${internalSpreadAttributes(props, shouldEscape, name)}>${children}</${name}>`;
}
function createBufferedRenderer(destination, renderFunction) {
  return new BufferedRenderer(destination, renderFunction);
}
function promiseWithResolvers() {
  let resolve, reject;
  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });
  return {
    promise,
    resolve,
    reject
  };
}
function stablePropsKey(props) {
  const keys = Object.keys(props).sort();
  let result = "{";
  for (let i5 = 0; i5 < keys.length; i5++) {
    if (i5 > 0) result += ",";
    result += JSON.stringify(keys[i5]) + ":" + JSON.stringify(props[keys[i5]]);
  }
  result += "}";
  return result;
}
function deduplicateElements(elements) {
  if (elements.length <= 1) return elements;
  const seen = /* @__PURE__ */ new Set();
  return elements.filter((item) => {
    const key = stablePropsKey(item.props) + item.children;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
function renderAllHeadContent(result) {
  result._metadata.hasRenderedHead = true;
  let content = "";
  if (result.shouldInjectCspMetaTags && result.cspDestination === "meta") {
    content += renderElement$1(
      "meta",
      {
        props: {
          "http-equiv": "content-security-policy",
          content: renderCspContent(result)
        },
        children: ""
      },
      false
    );
  }
  const styles = deduplicateElements(Array.from(result.styles)).map(
    (style) => style.props.rel === "stylesheet" ? renderElement$1("link", style) : renderElement$1("style", style)
  );
  result.styles.clear();
  const scripts = deduplicateElements(Array.from(result.scripts)).map((script) => {
    if (result.userAssetsBase) {
      script.props.src = (result.base === "/" ? "" : result.base) + result.userAssetsBase + script.props.src;
    }
    return renderElement$1("script", script, false);
  });
  const links = deduplicateElements(Array.from(result.links)).map(
    (link) => renderElement$1("link", link, false)
  );
  const sep = result.compressHTML === true || result.compressHTML === "jsx" ? "" : "\n";
  content += styles.join(sep) + links.join(sep) + scripts.join(sep);
  content += result._metadata.extraHead.join("");
  return markHTMLString(content);
}
function renderHead() {
  return createRenderInstruction({ type: "head" });
}
function maybeRenderHead() {
  return createRenderInstruction({ type: "maybe-head" });
}
function encodeHexUpperCase(data) {
  let result = "";
  for (let i5 = 0; i5 < data.length; i5++) {
    result += alphabetUpperCase[data[i5] >> 4];
    result += alphabetUpperCase[data[i5] & 15];
  }
  return result;
}
function decodeHex(data) {
  if (data.length % 2 !== 0) {
    throw new Error("Invalid hex string");
  }
  const result = new Uint8Array(data.length / 2);
  for (let i5 = 0; i5 < data.length; i5 += 2) {
    if (!(data[i5] in decodeMap)) {
      throw new Error("Invalid character");
    }
    if (!(data[i5 + 1] in decodeMap)) {
      throw new Error("Invalid character");
    }
    result[i5 / 2] |= decodeMap[data[i5]] << 4;
    result[i5 / 2] |= decodeMap[data[i5 + 1]];
  }
  return result;
}
function encodeBase64(bytes) {
  return encodeBase64_internal(bytes, base64Alphabet, EncodingPadding.Include);
}
function encodeBase64_internal(bytes, alphabet, padding) {
  let result = "";
  for (let i5 = 0; i5 < bytes.byteLength; i5 += 3) {
    let buffer2 = 0;
    let bufferBitSize = 0;
    for (let j5 = 0; j5 < 3 && i5 + j5 < bytes.byteLength; j5++) {
      buffer2 = buffer2 << 8 | bytes[i5 + j5];
      bufferBitSize += 8;
    }
    for (let j5 = 0; j5 < 4; j5++) {
      if (bufferBitSize >= 6) {
        result += alphabet[buffer2 >> bufferBitSize - 6 & 63];
        bufferBitSize -= 6;
      } else if (bufferBitSize > 0) {
        result += alphabet[buffer2 << 6 - bufferBitSize & 63];
        bufferBitSize = 0;
      } else if (padding === EncodingPadding.Include) {
        result += "=";
      }
    }
  }
  return result;
}
function decodeBase64(encoded) {
  return decodeBase64_internal(encoded, base64DecodeMap, DecodingPadding.Required);
}
function decodeBase64_internal(encoded, decodeMap2, padding) {
  const result = new Uint8Array(Math.ceil(encoded.length / 4) * 3);
  let totalBytes = 0;
  for (let i5 = 0; i5 < encoded.length; i5 += 4) {
    let chunk = 0;
    let bitsRead = 0;
    for (let j5 = 0; j5 < 4; j5++) {
      if (padding === DecodingPadding.Required && encoded[i5 + j5] === "=") {
        continue;
      }
      if (padding === DecodingPadding.Ignore && (i5 + j5 >= encoded.length || encoded[i5 + j5] === "=")) {
        continue;
      }
      if (j5 > 0 && encoded[i5 + j5 - 1] === "=") {
        throw new Error("Invalid padding");
      }
      if (!(encoded[i5 + j5] in decodeMap2)) {
        throw new Error("Invalid character");
      }
      chunk |= decodeMap2[encoded[i5 + j5]] << (3 - j5) * 6;
      bitsRead += 6;
    }
    if (bitsRead < 24) {
      let unused;
      if (bitsRead === 12) {
        unused = chunk & 65535;
      } else if (bitsRead === 18) {
        unused = chunk & 255;
      } else {
        throw new Error("Invalid padding");
      }
      if (unused !== 0) {
        throw new Error("Invalid padding");
      }
    }
    const byteLength = Math.floor(bitsRead / 8);
    for (let i6 = 0; i6 < byteLength; i6++) {
      result[totalBytes] = chunk >> 16 - i6 * 8 & 255;
      totalBytes++;
    }
  }
  return result.slice(0, totalBytes);
}
function _installLazyMethods(inst, group, methods2) {
  const proto = Object.getPrototypeOf(inst);
  let installed = _installedGroups.get(proto);
  if (!installed) {
    installed = /* @__PURE__ */ new Set();
    _installedGroups.set(proto, installed);
  }
  if (installed.has(group))
    return;
  installed.add(group);
  for (const key in methods2) {
    const fn = methods2[key];
    Object.defineProperty(proto, key, {
      configurable: true,
      enumerable: false,
      get() {
        const bound = fn.bind(this);
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: bound
        });
        return bound;
      },
      set(v4) {
        Object.defineProperty(this, key, {
          configurable: true,
          writable: true,
          enumerable: true,
          value: v4
        });
      }
    });
  }
}
function array(element, params) {
  return /* @__PURE__ */ _array(ZodArray, element, params);
}
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...normalizeParams(params)
  });
}
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v4) => [v4, v4])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...normalizeParams(params)
  });
}
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : shallowClone(defaultValue);
    }
  });
}
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...normalizeParams(params)
  });
}
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : () => catchValue
  });
}
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
function custom(fn, _params) {
  return /* @__PURE__ */ _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return /* @__PURE__ */ _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return /* @__PURE__ */ _superRefine(fn, params);
}
async function decodeKey(encoded) {
  const bytes = decodeBase64(encoded);
  return crypto.subtle.importKey("raw", bytes.buffer, ALGORITHM, true, [
    "encrypt",
    "decrypt"
  ]);
}
async function encryptString(key, raw, additionalData) {
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH / 2));
  const data = encoder$1.encode(raw);
  const params = { name: ALGORITHM, iv };
  if (additionalData) {
    params.additionalData = encoder$1.encode(additionalData);
  }
  const buffer2 = await crypto.subtle.encrypt(params, key, data);
  return encodeHexUpperCase(iv) + encodeBase64(new Uint8Array(buffer2));
}
async function decryptString(key, encoded, additionalData) {
  const iv = decodeHex(encoded.slice(0, IV_LENGTH));
  const dataArray = decodeBase64(encoded.slice(IV_LENGTH));
  const params = { name: ALGORITHM, iv };
  if (additionalData) {
    params.additionalData = encoder$1.encode(additionalData);
  }
  const decryptedBuffer = await crypto.subtle.decrypt(params, key, dataArray);
  const decryptedString = decoder$1.decode(decryptedBuffer);
  return decryptedString;
}
async function generateCspDigest(data, algorithm) {
  const hashBuffer = await crypto.subtle.digest(algorithm, encoder$1.encode(data));
  const hash = encodeBase64(new Uint8Array(hashBuffer));
  return `${ALGORITHMS[algorithm]}${hash}`;
}
function isRenderTemplateResult(obj) {
  return typeof obj === "object" && obj !== null && !!obj[renderTemplateResultSym];
}
function renderTemplate(htmlParts, ...expressions) {
  return new RenderTemplateResult(htmlParts, expressions);
}
function isSlotString(str) {
  return !!str[slotString];
}
function mergeSlotInstructions(target, source) {
  if (source.instructions?.length) {
    target ??= [];
    target.push(...source.instructions);
  }
  return target;
}
function renderSlot(result, slotted, fallback) {
  if (!slotted && fallback) {
    return renderSlot(result, fallback);
  }
  return {
    async render(destination) {
      await renderChild(destination, typeof slotted === "function" ? slotted(result) : slotted);
    }
  };
}
async function renderSlotToString(result, slotted, fallback) {
  let content = "";
  let instructions = null;
  const temporaryDestination = {
    write(chunk) {
      if (chunk instanceof SlotString) {
        content += chunk;
        instructions = mergeSlotInstructions(instructions, chunk);
      } else if (chunk instanceof Response) return;
      else if (typeof chunk === "object" && "type" in chunk && typeof chunk.type === "string") {
        if (instructions === null) {
          instructions = [];
        }
        instructions.push(chunk);
      } else {
        content += chunkToString(result, chunk);
      }
    }
  };
  const renderInstance = renderSlot(result, slotted, fallback);
  await renderInstance.render(temporaryDestination);
  return markHTMLString(new SlotString(content, instructions));
}
async function renderSlots(result, slots = {}) {
  let slotInstructions = null;
  let children = {};
  if (slots) {
    await Promise.all(
      Object.entries(slots).map(
        ([key, value]) => renderSlotToString(result, value).then((output) => {
          if (output.instructions) {
            if (slotInstructions === null) {
              slotInstructions = [];
            }
            slotInstructions.push(...output.instructions);
          }
          children[key] = output;
        })
      )
    );
  }
  return { slotInstructions, children };
}
function createSlotValueFromString(content) {
  return function() {
    return renderTemplate`${unescapeHTML(content)}`;
  };
}
function containsServerDirective(props) {
  return "server:component-directive" in props;
}
function createSearchParams(encryptedComponentExport, encryptedProps, slots) {
  const params = new URLSearchParams();
  params.set("e", encryptedComponentExport);
  params.set("p", encryptedProps);
  params.set("s", slots);
  return params;
}
function isWithinURLLimit(pathname, params) {
  const url = pathname + "?" + params.toString();
  const chars = url.length;
  return chars < 2048;
}
function stringifyChunk(result, chunk) {
  if (isRenderInstruction(chunk)) {
    const instruction = chunk;
    switch (instruction.type) {
      case "directive": {
        const { hydration } = instruction;
        const needsHydrationScript = hydration && determineIfNeedsHydrationScript(result);
        const needsDirectiveScript = hydration && determinesIfNeedsDirectiveScript(result, hydration.directive);
        if (needsHydrationScript) {
          const prescripts = getPrescripts(result, "both", hydration.directive);
          return markHTMLString(prescripts);
        } else if (needsDirectiveScript) {
          const prescripts = getPrescripts(result, "directive", hydration.directive);
          return markHTMLString(prescripts);
        } else {
          return "";
        }
      }
      case "head": {
        if (!shouldRenderInstruction("head", getInstructionRenderState(result))) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "maybe-head": {
        if (!shouldRenderInstruction("maybe-head", getInstructionRenderState(result))) {
          return "";
        }
        return renderAllHeadContent(result);
      }
      case "renderer-hydration-script": {
        const { rendererSpecificHydrationScripts } = result._metadata;
        const { rendererName } = instruction;
        if (result._metadata.templateDepth > 0) {
          return instruction.render();
        }
        if (!rendererSpecificHydrationScripts.has(rendererName)) {
          rendererSpecificHydrationScripts.add(rendererName);
          return instruction.render();
        }
        return "";
      }
      case "server-island-runtime": {
        if (result._metadata.templateDepth > 0) {
          return renderServerIslandRuntime();
        }
        if (result._metadata.hasRenderedServerIslandRuntime) {
          return "";
        }
        result._metadata.hasRenderedServerIslandRuntime = true;
        return renderServerIslandRuntime();
      }
      case "script": {
        const { id, content } = instruction;
        if (result._metadata.templateDepth > 0) {
          return content;
        }
        if (result._metadata.renderedScripts.has(id)) {
          return "";
        }
        result._metadata.renderedScripts.add(id);
        return content;
      }
      case "template-enter": {
        result._metadata.templateDepth++;
        return "";
      }
      case "template-exit": {
        if (result._metadata.templateDepth <= 0) {
          throw new Error(
            "Unexpected template-exit instruction without a matching template-enter. This may indicate that the compiler emitted unbalanced template boundaries, or that a component manually injected a template-exit render instruction."
          );
        }
        result._metadata.templateDepth--;
        return "";
      }
      default: {
        throw new Error(`Unknown chunk type: ${chunk.type}`);
      }
    }
  } else if (chunk instanceof Response) {
    return "";
  } else if (isSlotString(chunk)) {
    let out = "";
    const c4 = chunk;
    if (c4.instructions) {
      for (const instr of c4.instructions) {
        out += stringifyChunk(result, instr);
      }
    }
    out += chunk.toString();
    return out;
  }
  return chunk.toString();
}
function chunkToString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return decoder2.decode(chunk);
  } else {
    return stringifyChunk(result, chunk);
  }
}
function chunkToByteArray(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    const stringified = stringifyChunk(result, chunk);
    return encoder.encode(stringified.toString());
  }
}
function chunkToByteArrayOrString(result, chunk) {
  if (ArrayBuffer.isView(chunk)) {
    return chunk;
  } else {
    return stringifyChunk(result, chunk).toString();
  }
}
function isRenderInstance(obj) {
  return !!obj && typeof obj === "object" && "render" in obj && typeof obj.render === "function";
}
function renderChild(destination, child) {
  if (typeof child === "string") {
    destination.write(markHTMLString(escapeHTML(child)));
    return;
  }
  if (isPromise(child)) {
    return child.then((x4) => renderChild(destination, x4));
  }
  if (child instanceof SlotString) {
    destination.write(child);
    return;
  }
  if (isHTMLString(child)) {
    destination.write(child);
    return;
  }
  if (!child && child !== 0) {
    return;
  }
  if (Array.isArray(child)) {
    return renderArray(destination, child);
  }
  if (typeof child === "function") {
    return renderChild(destination, child());
  }
  if (isRenderInstance(child)) {
    return child.render(destination);
  }
  if (isRenderTemplateResult(child)) {
    return child.render(destination);
  }
  if (isAstroComponentInstance(child)) {
    return child.render(destination);
  }
  if (ArrayBuffer.isView(child)) {
    destination.write(child);
    return;
  }
  if (typeof child === "object" && (Symbol.asyncIterator in child || Symbol.iterator in child)) {
    if (Symbol.asyncIterator in child) {
      return renderAsyncIterable(destination, child);
    }
    return renderIterable(destination, child);
  }
  destination.write(child);
}
function renderArray(destination, children) {
  for (let i5 = 0; i5 < children.length; i5++) {
    const result = renderChild(destination, children[i5]);
    if (isPromise(result)) {
      if (i5 + 1 >= children.length) {
        return result;
      }
      const remaining = children.length - i5 - 1;
      const flushers = new Array(remaining);
      for (let j5 = 0; j5 < remaining; j5++) {
        flushers[j5] = createBufferedRenderer(destination, (bufferDestination) => {
          return renderChild(bufferDestination, children[i5 + 1 + j5]);
        });
      }
      return result.then(() => {
        let k4 = 0;
        const iterate = () => {
          while (k4 < flushers.length) {
            const flushResult = flushers[k4++].flush();
            if (isPromise(flushResult)) {
              return flushResult.then(iterate);
            }
          }
        };
        return iterate();
      });
    }
  }
}
function renderIterable(destination, children) {
  const iterator = children[Symbol.iterator]();
  const iterate = () => {
    for (; ; ) {
      const { value, done } = iterator.next();
      if (done) {
        break;
      }
      const result = renderChild(destination, value);
      if (isPromise(result)) {
        return result.then(iterate);
      }
    }
  };
  return iterate();
}
async function renderAsyncIterable(destination, children) {
  for await (const value of children) {
    await renderChild(destination, value);
  }
}
function validateComponentProps(props, clientDirectives, displayName) {
  if (props != null) {
    const directives = [...clientDirectives.keys()].map((directive) => `client:${directive}`);
    for (const prop of Object.keys(props)) {
      if (directives.includes(prop)) {
        console.warn(
          `You are attempting to render <${displayName} ${prop} />, but ${displayName} is an Astro component. Astro components do not render in the client and should not have a hydration directive. Please use a framework component for client rendering.`
        );
      }
    }
  }
}
function createAstroComponentInstance(result, displayName, factory, props, slots = {}) {
  validateComponentProps(props, result.clientDirectives, displayName);
  const instance = new AstroComponentInstance(result, props, slots, factory);
  registerIfPropagating(result, factory, instance);
  return instance;
}
function isAstroComponentInstance(obj) {
  return typeof obj === "object" && obj !== null && !!obj[astroComponentInstanceSym];
}
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e4) {
          if (AstroError.is(e4) && !e4.loc) {
            e4.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e4), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error2 = null;
  let next = null;
  const buffer2 = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer2.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error2) {
        throw error2;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i5 = 0, len = buffer2.length; i5 < len; i5++) {
        const bufferEntry = buffer2[i5];
        if (typeof bufferEntry === "string") {
          const nextIsString = i5 + 1 < len && typeof buffer2[i5 + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer2[i5] = encoded;
          } else {
            buffer2[i5] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i5 = 0, len = buffer2.length; i5 < len; i5++) {
        const item = buffer2[i5];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer2.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer2.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer2.push(bytes);
        next?.resolve();
      } else if (buffer2.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error2 = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}
function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers: renderers2, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers2.filter((r4) => r4.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer2;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer2 = renderers2.find(({ name }) => name === rendererName);
    }
    if (!renderer2) {
      let error2;
      for (const r4 of renderers2) {
        try {
          if (await r4.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer2 = r4;
            break;
          }
        } catch (e4) {
          error2 ??= e4;
        }
      }
      if (!renderer2 && error2) {
        throw error2;
      }
    }
    if (!renderer2 && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer2 = renderers2.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer2 && validRenderers.length === 1) {
      renderer2 = validRenderers[0];
    }
    if (!renderer2) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer2 = renderers2.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer2 && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer2 = renderers2.find(({ name }) => name === rendererName);
      }
    }
  }
  let componentServerRenderEndTime;
  if (!renderer2) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r4) => "`" + r4 + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r4) => r4.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r4) => probableRendererNames.includes(r4.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r4) => "`" + r4 + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer2 = matchingRenderers[0];
        ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      const componentRenderStartTime = performance.now();
      ({ html, attrs } = await renderer2.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
      if (process.env.NODE_ENV === "development")
        componentServerRenderEndTime = performance.now() - componentRenderStartTime;
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer2?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer2?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer: renderer2, result, astroId, props, attrs },
    metadata
  );
  if (componentServerRenderEndTime && process.env.NODE_ENV === "development")
    island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer2?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${escapeHTML(key)}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template2 = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${escapeHTML(key)}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template2}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer2?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer2.name,
            render: renderer2.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
function renderFragmentComponent(result, slots = {}) {
  const slot = slots?.default;
  const preRendered = slot?.(result);
  return {
    render(destination) {
      if (preRendered == null) return;
      return renderChild(destination, preRendered);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x4) => {
      return renderComponent(result, displayName, x4, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e4) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e4;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e4) {
    if (AstroError.is(e4) && !e4.loc) {
      e4.setLocation({
        file: route?.component
      });
    }
    throw e4;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v4) => renderJSX(result, v4)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1 && !vnode.type.includes("-")):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c4) => extractSlots2(c4));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props && !isCustomElement2) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      const isCustomElement2 = typeof vnode.type === "string" && vnode.type.includes("-");
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i5 = vnode.length - 1; i5 >= 0; i5 = i5 - 1) {
      stack.push({ node: vnode[i5], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}
async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n3 of node) {
        stack.push({ node: n3, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i5 = 0; i5 < expressions.length; i5 = i5 + 1) {
        stack.push({ node: expressions[i5], parent, metadata: item.metadata });
        if (htmlParts[i5 + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i5 + 1]) : markHTMLString(htmlParts[i5 + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error2) {
          throw error2;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error2) {
        throw error2;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}
async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i5 = 0;
  while (i5 < queue.nodes.length) {
    const node = queue.nodes[i5];
    try {
      if (canBatch(node)) {
        const batchStart = i5;
        while (i5 < queue.nodes.length && canBatch(queue.nodes[i5])) {
          batchBuffer += renderNodeToString(queue.nodes[i5]);
          i5 = i5 + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j5 = batchStart; j5 < i5; j5++) {
            pool.release(queue.nodes[j5]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i5 = i5 + 1;
      }
    } catch (error2) {
      throw error2;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}
async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}
function spreadAttributes(values = {}, _name, { class: scopedClassName } = {}) {
  let output = "";
  if (scopedClassName) {
    if (typeof values.class !== "undefined") {
      values.class += ` ${scopedClassName}`;
    } else if (typeof values["class:list"] !== "undefined") {
      values["class:list"] = [values["class:list"], scopedClassName];
    } else {
      values.class = scopedClassName;
    }
  }
  for (const [key, value] of Object.entries(values)) {
    output += addAttribute(value, key, true, _name);
  }
  return markHTMLString(output);
}
function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/" && pathname !== "") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e4) {
        if (e4 instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e4.message
          });
        }
        if (e4 instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e4;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest2) {
  const page14 = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest2.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest2.serverIslandMappings?.();
    const serverIslandMap2 = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap2?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest2.key;
    let componentExport;
    try {
      componentExport = await decryptString(
        key,
        data.encryptedComponentExport,
        `export:${componentId}`
      );
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps, `props:${componentId}`);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots, `slots:${componentId}`);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page14.isAstroComponentFactory = true;
  const instance = {
    default: page14,
    partial: true
  };
  return instance;
}
function createDefaultRoutes(manifest2) {
  const root = new URL(manifest2.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest2),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}
function ensure404Route(manifest2) {
  if (!manifest2.routes.some((route) => route.route === "/404")) {
    manifest2.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest2;
}
function routeIsRedirect(route) {
  return route?.type === "redirect";
}
function routeIsFallback(route) {
  return route?.type === "fallback";
}
function getFallbackRoute(route, routeList) {
  const fallbackRoute = routeList.find((r4) => {
    if (route.route === "/" && r4.routeData.route === "/") {
      return true;
    }
    return r4.routeData.fallbackRoutes.find((f5) => {
      return f5.route === route.route;
    });
  });
  if (!fallbackRoute) {
    throw new Error(`No fallback route found for route ${route.route}`);
  }
  return fallbackRoute.routeData;
}
function getCustom404Route(manifestData) {
  return manifestData.routes.find((r4) => isRoute404(r4.route));
}
function routeHasHtmlExtension(route) {
  return route.segments.some(
    (segment) => segment.some((part) => !part.dynamic && part.content.includes(".html"))
  );
}
async function getProps(opts) {
  const {
    logger,
    mod,
    routeData: route,
    routeCache,
    pathname,
    serverLike,
    base,
    trailingSlash
  } = opts;
  if (!route || route.pathname) {
    return {};
  }
  if (routeIsRedirect(route) || routeIsFallback(route) || route.component === DEFAULT_404_COMPONENT) {
    return {};
  }
  const staticPaths = await callGetStaticPaths({
    mod,
    route,
    routeCache,
    ssr: serverLike,
    base,
    trailingSlash
  });
  const params = getParams(route, pathname);
  const matchedStaticPath = findPathItemByKey(staticPaths, params, route, logger, trailingSlash);
  if (!matchedStaticPath && route.origin !== "internal" && (serverLike ? route.prerender : true)) {
    throw new AstroError({
      ...NoMatchingStaticPathFound,
      message: NoMatchingStaticPathFound.message(pathname),
      hint: NoMatchingStaticPathFound.hint([route.component])
    });
  }
  if (mod) {
    validatePrerenderEndpointCollision(route, mod, params);
  }
  const props = matchedStaticPath?.props ? { ...matchedStaticPath.props } : {};
  return props;
}
function getParams(route, pathname) {
  if (!route.params.length) return {};
  const path = pathname.endsWith(".html") && route.type === "page" && !routeHasHtmlExtension(route) ? pathname.slice(0, -5) : pathname;
  const allPatterns = [route, ...route.fallbackRoutes].map((r4) => r4.pattern);
  const paramsMatch = allPatterns.map((pattern) => pattern.exec(path)).find((x4) => x4);
  if (!paramsMatch) return {};
  const params = {};
  route.params.forEach((key, i5) => {
    if (key.startsWith("...")) {
      params[key.slice(3)] = paramsMatch[i5 + 1] ? paramsMatch[i5 + 1] : void 0;
    } else {
      params[key] = paramsMatch[i5 + 1];
    }
  });
  return params;
}
function validatePrerenderEndpointCollision(route, mod, params) {
  if (route.type === "endpoint" && mod.getStaticPaths) {
    const lastSegment = route.segments[route.segments.length - 1];
    const paramValues = Object.values(params);
    const lastParam = paramValues[paramValues.length - 1];
    if (lastSegment.length === 1 && lastSegment[0].dynamic && lastParam === void 0) {
      throw new AstroError({
        ...PrerenderDynamicEndpointPathCollide,
        message: PrerenderDynamicEndpointPathCollide.message(route.route),
        hint: PrerenderDynamicEndpointPathCollide.hint(route.component),
        location: {
          file: route.component
        }
      });
    }
  }
}
function routeComparator(a4, b3) {
  const commonLength = Math.min(a4.segments.length, b3.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a4.segments[index];
    const bSegment = b3.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a4.segments.length;
  const bLength = b3.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a4.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b3.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a4.type === "endpoint" !== (b3.type === "endpoint")) {
    return a4.type === "endpoint" ? -1 : 1;
  }
  return a4.route.localeCompare(b3.route);
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}
function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    // nosemgrep: javascript.lang.security.audit.detect-non-literal-regexp.detect-non-literal-regexp
    // This pattern is serialized from Astro's own route manifest.
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.destination;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(s$1.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return s$1.red(prefix.join(" "));
  }
  if (level === "warn") {
    return s$1.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return s$1.dim(prefix[0]);
  }
  return s$1.dim(prefix[0]) + " " + s$1.blue(prefix.splice(1).join(" "));
}
function matchesLevel(messageLevel, configuredLevel) {
  return levels[messageLevel] >= levels[configuredLevel];
}
function nodeLogDestination(config2 = {}) {
  const { level = "info" } = config2;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      if (event.label === "SKIP_FORMAT") {
        dest.write(event.message + trailingLine);
      } else {
        dest.write(getEventPrefix(event) + " " + event.message + trailingLine);
      }
    }
  };
}
function node_default(options) {
  return nodeLogDestination(options);
}
function consoleLogDestination(config2 = {}) {
  const { level = "info" } = config2;
  return {
    write(event) {
      let dest = console.error;
      if (levels[event.level] < levels["error"]) {
        dest = console.info;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      if (event.label === "SKIP_FORMAT") {
        dest(event.message);
      } else {
        dest(getEventPrefix(event) + " " + event.message);
      }
    }
  };
}
function createConsoleLogger({ level }) {
  return new AstroLogger({
    level,
    destination: consoleLogDestination()
  });
}
function console_default(options) {
  return consoleLogDestination(options);
}
function jsonLoggerDestination(config2 = {}) {
  const { pretty = false, level = "info" } = config2;
  return {
    write(event) {
      let dest = process.stderr;
      if (levels[event.level] < levels["error"]) {
        dest = process.stdout;
      }
      if (!matchesLevel(event.level, level)) {
        return;
      }
      let trailingLine = event.newLine ? "\n" : "";
      const message = event.message.replace(SGR_REGEX, "");
      if (pretty) {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }, null, 2) + trailingLine
        );
      } else {
        dest.write(
          JSON.stringify({ message, label: event.label, level: event.level }) + trailingLine
        );
      }
    }
  };
}
function compose(destinations) {
  return {
    write(chunk) {
      for (const logger of destinations) {
        logger.write(chunk);
      }
    },
    flush() {
      for (const logger of destinations) {
        if (logger.flush) {
          logger.flush();
        }
      }
    },
    close() {
      for (const logger of destinations) {
        if (logger.close) {
          logger.close();
        }
      }
    }
  };
}
async function loadLogger(config2, level = "info") {
  let cause = void 0;
  try {
    switch (config2.entrypoint) {
      case "astro/logger/node": {
        return new AstroLogger({
          destination: node_default(config2.config),
          level
        });
      }
      case "astro/logger/console": {
        return new AstroLogger({
          destination: console_default(config2.config),
          level
        });
      }
      case "astro/logger/json": {
        return new AstroLogger({
          destination: jsonLoggerDestination(config2.config),
          level
        });
      }
      case "astro/logger/compose": {
        let destinations = [];
        if (config2.config?.loggers) {
          const loggers = config2.config?.loggers;
          destinations = await Promise.all(
            loggers.map(async (loggerConfig) => {
              const logger = await import(
                /* @vite-ignore */
                loggerConfig.entrypoint
              );
              return logger.default(loggerConfig.config);
            })
          );
        }
        return new AstroLogger({
          destination: compose(destinations),
          level
        });
      }
      default: {
        const nodeLogger = await import(
          /* @vite-ignore */
          config2.entrypoint
        );
        return new AstroLogger({
          destination: nodeLogger.default(config2.config),
          level
        });
      }
    }
  } catch (e4) {
    if (e4 instanceof Error) {
      cause = e4;
    }
  }
  const error2 = new AstroError({
    ...UnableToLoadLogger,
    message: UnableToLoadLogger.message(config2.entrypoint)
  });
  if (cause) {
    error2.cause = cause;
  }
  throw error2;
}
function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter(
    (e4) => isRenderInstruction(e4) === false || isRenderTemplateResult(e4)
  );
  if (expressions?.length !== 1) return;
  const expression = expressions[0];
  if (isRenderTemplateResult(expression)) {
    return getFunctionExpression(expression);
  }
  return expression;
}
function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  let matched = false;
  for (const directive of directives) {
    if (matched) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      matched = true;
    } else {
      finalDirectives.push(directive);
    }
  }
  if (!matched) {
    finalDirectives.push(newDirective);
  }
  return finalDirectives;
}
function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}
function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}
function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a4, b3) => {
    if (a4.qualityValue && b3.qualityValue) {
      return Math.sign(b3.qualityValue - a4.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      outer: for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break outer;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}
async function callMiddleware(onRequest2, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest2(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}
function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  let iterations = 0;
  while (decoded !== pathname && iterations < 10) {
    pathname = decoded;
    try {
      decoded = decodeURI(pathname);
    } catch {
      break;
    }
    iterations++;
  }
  return decoded;
}
function createNormalizedUrl(requestUrl) {
  return normalizeUrl(new URL(requestUrl));
}
function normalizeUrl(url) {
  try {
    url.pathname = validateAndDecodePathname(url.pathname);
  } catch {
    try {
      url.pathname = decodeURI(url.pathname);
    } catch {
    }
  }
  url.pathname = collapseDuplicateSlashes(url.pathname);
  return url;
}
function applyRewriteToState(state, payload, { routeData, componentInstance, newUrl, pathname }, { mergeCookies = false } = {}) {
  const pipeline = state.pipeline;
  const oldPathname = state.pathname;
  const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
  if (pipeline.manifest.serverLike && !state.routeData.prerender && routeData.prerender && !isI18nFallback) {
    throw new AstroError({
      ...ForbiddenRewrite,
      message: ForbiddenRewrite.message(state.pathname, pathname, routeData.component),
      hint: ForbiddenRewrite.hint(routeData.component)
    });
  }
  state.routeData = routeData;
  state.componentInstance = componentInstance;
  if (payload instanceof Request) {
    state.request = payload;
  } else {
    state.request = copyRequest(
      newUrl,
      state.request,
      routeData.prerender,
      pipeline.logger,
      state.routeData.route
    );
  }
  state.url = createNormalizedUrl(state.request.url);
  if (mergeCookies) {
    const newCookies = new AstroCookies(state.request);
    if (state.cookies) {
      newCookies.merge(state.cookies);
    }
    state.cookies = newCookies;
  }
  state.params = getParams(routeData, pathname);
  state.pathname = pathname;
  state.isRewriting = true;
  state.status = 200;
  setOriginPathname(
    state.request,
    oldPathname,
    pipeline.manifest.trailingSlash,
    pipeline.manifest.buildFormat
  );
  state.invalidateContexts();
}
function matchRoute(pathname, manifest2) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest2.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest2.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function computePathnameFromDomain(request, url, i18n, base, trailingSlash, logger) {
  let pathname = void 0;
  if (i18n && (i18n.strategy === "domains-prefix-always" || i18n.strategy === "domains-prefix-other-locales" || i18n.strategy === "domains-prefix-always-no-redirect")) {
    let host = request.headers.get("X-Forwarded-Host");
    let protocol = request.headers.get("X-Forwarded-Proto");
    if (protocol) {
      protocol = protocol + ":";
    } else {
      protocol = url.protocol;
    }
    if (!host) {
      host = request.headers.get("Host");
    }
    if (host && protocol) {
      host = host.split(":")[0];
      try {
        let locale;
        const hostAsUrl = new URL(`${protocol}//${host}`);
        for (const [domainKey, localeValue] of Object.entries(i18n.domainLookupTable)) {
          const domainKeyAsUrl = new URL(domainKey);
          if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
            locale = localeValue;
            break;
          }
        }
        if (locale) {
          pathname = prependForwardSlash(
            joinPaths(normalizeTheLocale(locale), removeBase(url.pathname, base))
          );
          if (trailingSlash === "always") {
            pathname = appendForwardSlash(pathname);
          } else if (trailingSlash === "never") {
            pathname = removeTrailingForwardSlash(pathname);
          } else if (url.pathname.endsWith("/")) {
            pathname = appendForwardSlash(pathname);
          }
        }
      } catch (e4) {
        logger.error(
          "router",
          `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
        );
        logger.error("router", `Error: ${e4}`);
      }
    }
  }
  return pathname;
}
function removeBase(pathname, base) {
  pathname = collapseDuplicateLeadingSlashes(pathname);
  if (pathname.startsWith(base)) {
    return pathname.slice(removeTrailingForwardSlash(base).length + 1);
  }
  return pathname;
}
function getRenderOptions(request) {
  return Reflect.get(request, renderOptionsSymbol);
}
function setRenderOptions(request, options) {
  Reflect.set(request, renderOptionsSymbol, options);
}
function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  if (!["http:", "https:", "data:"].includes(url.protocol)) {
    return false;
  }
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}
function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString().split(",").map((e4) => e4.trim())[0];
}
function sanitizeHost(hostname) {
  if (!hostname) return void 0;
  if (/[/\\]/.test(hostname)) return void 0;
  return hostname;
}
function parseHost(host) {
  const parts = host.split(":");
  return {
    hostname: parts[0],
    port: parts[1]
  };
}
function matchesAllowedDomains(hostname, protocol, port, allowedDomains) {
  const hostWithPort = port ? `${hostname}:${port}` : hostname;
  const urlString = `${protocol}://${hostWithPort}`;
  if (!URL.canParse(urlString)) {
    return false;
  }
  const testUrl = new URL(urlString);
  return allowedDomains.some((pattern) => matchPattern(testUrl, pattern));
}
function validateHost(host, protocol, allowedDomains) {
  if (!host || host.length === 0) return void 0;
  if (!allowedDomains || allowedDomains.length === 0) return void 0;
  const sanitized = sanitizeHost(host);
  if (!sanitized) return void 0;
  const { hostname, port } = parseHost(sanitized);
  if (matchesAllowedDomains(hostname, protocol, port, allowedDomains)) {
    return sanitized;
  }
  return void 0;
}
function validateForwardedHeaders(forwardedProtocol, forwardedHost, forwardedPort, allowedDomains) {
  const result = {};
  if (forwardedProtocol) {
    if (allowedDomains && allowedDomains.length > 0) {
      const hasProtocolPatterns = allowedDomains.some((pattern) => pattern.protocol !== void 0);
      if (hasProtocolPatterns) {
        try {
          const testUrl = new URL(`${forwardedProtocol}://example.com`);
          const isAllowed = allowedDomains.some(
            (pattern) => matchPattern(testUrl, { protocol: pattern.protocol })
          );
          if (isAllowed) {
            result.protocol = forwardedProtocol;
          }
        } catch {
        }
      } else if (/^https?$/.test(forwardedProtocol)) {
        result.protocol = forwardedProtocol;
      }
    }
  }
  if (forwardedPort && allowedDomains && allowedDomains.length > 0) {
    const hasPortPatterns = allowedDomains.some((pattern) => pattern.port !== void 0);
    if (hasPortPatterns) {
      const isAllowed = allowedDomains.some((pattern) => pattern.port === forwardedPort);
      if (isAllowed) {
        result.port = forwardedPort;
      }
    }
  }
  if (forwardedHost && forwardedHost.length > 0 && allowedDomains && allowedDomains.length > 0) {
    const protoForValidation = result.protocol || "https";
    const sanitized = sanitizeHost(forwardedHost);
    if (sanitized) {
      const { hostname, port: portFromHost } = parseHost(sanitized);
      const portForValidation = result.port || portFromHost;
      if (matchesAllowedDomains(hostname, protoForValidation, portForValidation, allowedDomains)) {
        result.host = sanitized;
      }
    }
  }
  return result;
}
function prepareResponse(response, { addCookieHeader }) {
  for (const headerName of INTERNAL_RESPONSE_HEADERS) {
    if (response.headers.has(headerName)) {
      response.headers.delete(headerName);
    }
  }
  if (addCookieHeader) {
    for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
      response.headers.append("set-cookie", setCookieHeaderValue);
    }
  }
  Reflect.set(response, responseSentSymbol$1, true);
}
function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  const rel = escape(String(relativeLocation));
  const abs = escape(String(absoluteLocation));
  const fromHtml = from ? `from <code>${escape(from)}</code> ` : "";
  return `<!doctype html>
<title>Redirecting to: ${rel}</title>
<meta http-equiv="refresh" content="${delay};url=${rel}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${abs}">
<body>
	<a href="${rel}">Redirecting ${fromHtml}to <code>${rel}</code></a>
</body>`;
}
function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i5) => {
    if (!str) return;
    const dynamic = i5 % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}
function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s4) => getParts(s4, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a4, b3) => routeComparator(
      { segments: a4.segments, route: a4.route, type: "page" },
      { segments: b3.segments, route: b3.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}
function provideCache(state) {
  const pipeline = state.pipeline;
  if (!pipeline.cacheConfig) {
    state.provide(CACHE_KEY, {
      create: () => new DisabledAstroCache(pipeline.logger)
    });
    return;
  }
  if (pipeline.runtimeMode === "development") {
    state.provide(CACHE_KEY, {
      create: () => new NoopAstroCache()
    });
    return;
  }
  return provideCacheAsync(state, pipeline);
}
async function provideCacheAsync(state, pipeline) {
  const cacheProvider = await pipeline.getCacheProvider();
  state.provide(CACHE_KEY, {
    create() {
      const cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(state.pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
      return cache;
    }
  });
}
function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.redirects;
  const routeData = state.routeData;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(state.request.method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        state.params,
        redirect,
        redirectRoute,
        state.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}
function jsonParseTransform(key, value) {
  if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
    warnKeyDropped(key);
    return;
  }
  return value;
}
function warnKeyDropped(key) {
  console.warn(`[destr] Dropping "${key}" key to prevent prototype pollution.`);
}
function destr(value, options = {}) {
  if (typeof value !== "string") {
    return value;
  }
  if (value[0] === '"' && value[value.length - 1] === '"' && value.indexOf("\\") === -1) {
    return value.slice(1, -1);
  }
  const _value = value.trim();
  if (_value.length <= 9) {
    switch (_value.toLowerCase()) {
      case "true": {
        return true;
      }
      case "false": {
        return false;
      }
      case "undefined": {
        return void 0;
      }
      case "null": {
        return null;
      }
      case "nan": {
        return Number.NaN;
      }
      case "infinity": {
        return Number.POSITIVE_INFINITY;
      }
      case "-infinity": {
        return Number.NEGATIVE_INFINITY;
      }
    }
  }
  if (!JsonSigRx.test(value)) {
    if (options.strict) {
      throw new SyntaxError("[destr] Invalid JSON");
    }
    return value;
  }
  try {
    if (suspectProtoRx.test(value) || suspectConstructorRx.test(value)) {
      if (options.strict) {
        throw new Error("[destr] Possible prototype pollution");
      }
      return JSON.parse(value, jsonParseTransform);
    }
    return JSON.parse(value);
  } catch (error2) {
    if (options.strict) {
      throw error2;
    }
    return value;
  }
}
function wrapToPromise(value) {
  if (!value || typeof value.then !== "function") {
    return Promise.resolve(value);
  }
  return value;
}
function asyncCall(function_, ...arguments_) {
  try {
    return wrapToPromise(function_(...arguments_));
  } catch (error2) {
    return Promise.reject(error2);
  }
}
function isPrimitive(value) {
  const type = typeof value;
  return value === null || type !== "object" && type !== "function";
}
function isPureObject(value) {
  const proto = Object.getPrototypeOf(value);
  return !proto || proto.isPrototypeOf(Object);
}
function stringify$1(value) {
  if (isPrimitive(value)) {
    return String(value);
  }
  if (isPureObject(value) || Array.isArray(value)) {
    return JSON.stringify(value);
  }
  if (typeof value.toJSON === "function") {
    return stringify$1(value.toJSON());
  }
  throw new Error("[unstorage] Cannot stringify value!");
}
function serializeRaw(value) {
  if (typeof value === "string") {
    return value;
  }
  return BASE64_PREFIX + base64Encode(value);
}
function deserializeRaw(value) {
  if (typeof value !== "string") {
    return value;
  }
  if (!value.startsWith(BASE64_PREFIX)) {
    return value;
  }
  return base64Decode(value.slice(BASE64_PREFIX.length));
}
function base64Decode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input, "base64");
  }
  return Uint8Array.from(
    globalThis.atob(input),
    (c4) => c4.codePointAt(0)
  );
}
function base64Encode(input) {
  if (globalThis.Buffer) {
    return Buffer.from(input).toString("base64");
  }
  return globalThis.btoa(String.fromCodePoint(...input));
}
function normalizeKey(key) {
  if (!key) {
    return "";
  }
  return key.split("?")[0]?.replace(/[/\\]/g, ":").replace(/:+/g, ":").replace(/^:|:$/g, "") || "";
}
function joinKeys(...keys) {
  return normalizeKey(keys.join(":"));
}
function normalizeBaseKey(base) {
  base = normalizeKey(base);
  return base ? base + ":" : "";
}
function filterKeyByDepth(key, depth) {
  if (depth === void 0) {
    return true;
  }
  let substrCount = 0;
  let index = key.indexOf(":");
  while (index > -1) {
    substrCount++;
    index = key.indexOf(":", index + 1);
  }
  return substrCount <= depth;
}
function filterKeyByBase(key, base) {
  if (base) {
    return key.startsWith(base) && key[key.length - 1] !== "$";
  }
  return key[key.length - 1] !== "$";
}
function defineDriver(factory) {
  return factory;
}
function createStorage(options = {}) {
  const context = {
    mounts: { "": options.driver || memory() },
    mountpoints: [""],
    watching: false,
    watchListeners: [],
    unwatch: {}
  };
  const getMount = (key) => {
    for (const base of context.mountpoints) {
      if (key.startsWith(base)) {
        return {
          base,
          relativeKey: key.slice(base.length),
          driver: context.mounts[base]
        };
      }
    }
    return {
      base: "",
      relativeKey: key,
      driver: context.mounts[""]
    };
  };
  const getMounts = (base, includeParent) => {
    return context.mountpoints.filter(
      (mountpoint) => mountpoint.startsWith(base) || includeParent && base.startsWith(mountpoint)
    ).map((mountpoint) => ({
      relativeBase: base.length > mountpoint.length ? base.slice(mountpoint.length) : void 0,
      mountpoint,
      driver: context.mounts[mountpoint]
    }));
  };
  const onChange = (event, key) => {
    if (!context.watching) {
      return;
    }
    key = normalizeKey(key);
    for (const listener of context.watchListeners) {
      listener(event, key);
    }
  };
  const startWatch = async () => {
    if (context.watching) {
      return;
    }
    context.watching = true;
    for (const mountpoint in context.mounts) {
      context.unwatch[mountpoint] = await watch(
        context.mounts[mountpoint],
        onChange,
        mountpoint
      );
    }
  };
  const stopWatch = async () => {
    if (!context.watching) {
      return;
    }
    for (const mountpoint in context.unwatch) {
      await context.unwatch[mountpoint]();
    }
    context.unwatch = {};
    context.watching = false;
  };
  const runBatch = (items, commonOptions, cb) => {
    const batches = /* @__PURE__ */ new Map();
    const getBatch = (mount) => {
      let batch = batches.get(mount.base);
      if (!batch) {
        batch = {
          driver: mount.driver,
          base: mount.base,
          items: []
        };
        batches.set(mount.base, batch);
      }
      return batch;
    };
    for (const item of items) {
      const isStringItem = typeof item === "string";
      const key = normalizeKey(isStringItem ? item : item.key);
      const value = isStringItem ? void 0 : item.value;
      const options2 = isStringItem || !item.options ? commonOptions : { ...commonOptions, ...item.options };
      const mount = getMount(key);
      getBatch(mount).items.push({
        key,
        value,
        relativeKey: mount.relativeKey,
        options: options2
      });
    }
    return Promise.all([...batches.values()].map((batch) => cb(batch))).then(
      (r4) => r4.flat()
    );
  };
  const storage = {
    // Item
    hasItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.hasItem, relativeKey, opts);
    },
    getItem(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => destr(value)
      );
    },
    getItems(items, commonOptions = {}) {
      return runBatch(items, commonOptions, (batch) => {
        if (batch.driver.getItems) {
          return asyncCall(
            batch.driver.getItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              options: item.options
            })),
            commonOptions
          ).then(
            (r4) => r4.map((item) => ({
              key: joinKeys(batch.base, item.key),
              value: destr(item.value)
            }))
          );
        }
        return Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.getItem,
              item.relativeKey,
              item.options
            ).then((value) => ({
              key: item.key,
              value: destr(value)
            }));
          })
        );
      });
    },
    getItemRaw(key, opts = {}) {
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.getItemRaw) {
        return asyncCall(driver.getItemRaw, relativeKey, opts);
      }
      return asyncCall(driver.getItem, relativeKey, opts).then(
        (value) => deserializeRaw(value)
      );
    },
    async setItem(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.setItem) {
        return;
      }
      await asyncCall(driver.setItem, relativeKey, stringify$1(value), opts);
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async setItems(items, commonOptions) {
      await runBatch(items, commonOptions, async (batch) => {
        if (batch.driver.setItems) {
          return asyncCall(
            batch.driver.setItems,
            batch.items.map((item) => ({
              key: item.relativeKey,
              value: stringify$1(item.value),
              options: item.options
            })),
            commonOptions
          );
        }
        if (!batch.driver.setItem) {
          return;
        }
        await Promise.all(
          batch.items.map((item) => {
            return asyncCall(
              batch.driver.setItem,
              item.relativeKey,
              stringify$1(item.value),
              item.options
            );
          })
        );
      });
    },
    async setItemRaw(key, value, opts = {}) {
      if (value === void 0) {
        return storage.removeItem(key, opts);
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (driver.setItemRaw) {
        await asyncCall(driver.setItemRaw, relativeKey, value, opts);
      } else if (driver.setItem) {
        await asyncCall(driver.setItem, relativeKey, serializeRaw(value), opts);
      } else {
        return;
      }
      if (!driver.watch) {
        onChange("update", key);
      }
    },
    async removeItem(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { removeMeta: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      if (!driver.removeItem) {
        return;
      }
      await asyncCall(driver.removeItem, relativeKey, opts);
      if (opts.removeMeta || opts.removeMata) {
        await asyncCall(driver.removeItem, relativeKey + "$", opts);
      }
      if (!driver.watch) {
        onChange("remove", key);
      }
    },
    // Meta
    async getMeta(key, opts = {}) {
      if (typeof opts === "boolean") {
        opts = { nativeOnly: opts };
      }
      key = normalizeKey(key);
      const { relativeKey, driver } = getMount(key);
      const meta = /* @__PURE__ */ Object.create(null);
      if (driver.getMeta) {
        Object.assign(meta, await asyncCall(driver.getMeta, relativeKey, opts));
      }
      if (!opts.nativeOnly) {
        const value = await asyncCall(
          driver.getItem,
          relativeKey + "$",
          opts
        ).then((value_) => destr(value_));
        if (value && typeof value === "object") {
          if (typeof value.atime === "string") {
            value.atime = new Date(value.atime);
          }
          if (typeof value.mtime === "string") {
            value.mtime = new Date(value.mtime);
          }
          Object.assign(meta, value);
        }
      }
      return meta;
    },
    setMeta(key, value, opts = {}) {
      return this.setItem(key + "$", value, opts);
    },
    removeMeta(key, opts = {}) {
      return this.removeItem(key + "$", opts);
    },
    // Keys
    async getKeys(base, opts = {}) {
      base = normalizeBaseKey(base);
      const mounts = getMounts(base, true);
      let maskedMounts = [];
      const allKeys = [];
      let allMountsSupportMaxDepth = true;
      for (const mount of mounts) {
        if (!mount.driver.flags?.maxDepth) {
          allMountsSupportMaxDepth = false;
        }
        const rawKeys = await asyncCall(
          mount.driver.getKeys,
          mount.relativeBase,
          opts
        );
        for (const key of rawKeys) {
          const fullKey = mount.mountpoint + normalizeKey(key);
          if (!maskedMounts.some((p4) => fullKey.startsWith(p4))) {
            allKeys.push(fullKey);
          }
        }
        maskedMounts = [
          mount.mountpoint,
          ...maskedMounts.filter((p4) => !p4.startsWith(mount.mountpoint))
        ];
      }
      const shouldFilterByDepth = opts.maxDepth !== void 0 && !allMountsSupportMaxDepth;
      return allKeys.filter(
        (key) => (!shouldFilterByDepth || filterKeyByDepth(key, opts.maxDepth)) && filterKeyByBase(key, base)
      );
    },
    // Utils
    async clear(base, opts = {}) {
      base = normalizeBaseKey(base);
      await Promise.all(
        getMounts(base, false).map(async (m4) => {
          if (m4.driver.clear) {
            return asyncCall(m4.driver.clear, m4.relativeBase, opts);
          }
          if (m4.driver.removeItem) {
            const keys = await m4.driver.getKeys(m4.relativeBase || "", opts);
            return Promise.all(
              keys.map((key) => m4.driver.removeItem(key, opts))
            );
          }
        })
      );
    },
    async dispose() {
      await Promise.all(
        Object.values(context.mounts).map((driver) => dispose(driver))
      );
    },
    async watch(callback) {
      await startWatch();
      context.watchListeners.push(callback);
      return async () => {
        context.watchListeners = context.watchListeners.filter(
          (listener) => listener !== callback
        );
        if (context.watchListeners.length === 0) {
          await stopWatch();
        }
      };
    },
    async unwatch() {
      context.watchListeners = [];
      await stopWatch();
    },
    // Mount
    mount(base, driver) {
      base = normalizeBaseKey(base);
      if (base && context.mounts[base]) {
        throw new Error(`already mounted at ${base}`);
      }
      if (base) {
        context.mountpoints.push(base);
        context.mountpoints.sort((a4, b3) => b3.length - a4.length);
      }
      context.mounts[base] = driver;
      if (context.watching) {
        Promise.resolve(watch(driver, onChange, base)).then((unwatcher) => {
          context.unwatch[base] = unwatcher;
        }).catch(console.error);
      }
      return storage;
    },
    async unmount(base, _dispose = true) {
      base = normalizeBaseKey(base);
      if (!base || !context.mounts[base]) {
        return;
      }
      if (context.watching && base in context.unwatch) {
        context.unwatch[base]?.();
        delete context.unwatch[base];
      }
      if (_dispose) {
        await dispose(context.mounts[base]);
      }
      context.mountpoints = context.mountpoints.filter((key) => key !== base);
      delete context.mounts[base];
    },
    getMount(key = "") {
      key = normalizeKey(key) + ":";
      const m4 = getMount(key);
      return {
        driver: m4.driver,
        base: m4.base
      };
    },
    getMounts(base = "", opts = {}) {
      base = normalizeKey(base);
      const mounts = getMounts(base, opts.parents);
      return mounts.map((m4) => ({
        driver: m4.driver,
        base: m4.mountpoint
      }));
    },
    // Aliases
    keys: (base, opts = {}) => storage.getKeys(base, opts),
    get: (key, opts = {}) => storage.getItem(key, opts),
    set: (key, value, opts = {}) => storage.setItem(key, value, opts),
    has: (key, opts = {}) => storage.hasItem(key, opts),
    del: (key, opts = {}) => storage.removeItem(key, opts),
    remove: (key, opts = {}) => storage.removeItem(key, opts)
  };
  return storage;
}
function watch(driver, onChange, base) {
  return driver.watch ? driver.watch((event, key) => onChange(event, base + key)) : () => {
  };
}
async function dispose(driver) {
  if (typeof driver.dispose === "function") {
    await asyncCall(driver.dispose);
  }
}
function provideSession(state) {
  state.pipeline.usedFeatures |= PipelineFeatures.sessions;
  const pipeline = state.pipeline;
  const config2 = pipeline.manifest.sessionConfig;
  if (!config2) return;
  return provideSessionAsync(state, config2);
}
async function provideSessionAsync(state, config2) {
  const pipeline = state.pipeline;
  const driverFactory = await pipeline.getSessionDriver();
  if (!driverFactory) return;
  state.provide(SESSION_KEY, {
    create() {
      const cookies = state.cookies;
      return new AstroSession({
        cookies,
        config: config2,
        runtimeMode: pipeline.runtimeMode,
        driverFactory,
        mockStorage: null
      });
    },
    finalize(session) {
      return session[PERSIST_SYMBOL]();
    }
  });
}
function mergeResponses(newResponse, originalResponse, override) {
  let newResponseHeaders = newResponse.headers;
  if (override?.removeContentEncodingHeaders) {
    newResponseHeaders = new Headers(newResponseHeaders);
    newResponseHeaders.delete("Content-Encoding");
    newResponseHeaders.delete("Content-Length");
  }
  if (!originalResponse) {
    if (override !== void 0) {
      return new Response(newResponse.body, {
        status: override.status,
        statusText: newResponse.statusText,
        headers: newResponseHeaders
      });
    }
    return newResponse;
  }
  const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
  try {
    originalResponse.headers.delete("Content-type");
    originalResponse.headers.delete("Content-Length");
    originalResponse.headers.delete("Transfer-Encoding");
  } catch {
  }
  const newHeaders = new Headers();
  const seen = /* @__PURE__ */ new Set();
  for (const [name, value] of originalResponse.headers) {
    newHeaders.append(name, value);
    seen.add(name.toLowerCase());
  }
  for (const [name, value] of newResponseHeaders) {
    if (!seen.has(name.toLowerCase())) {
      newHeaders.append(name, value);
    }
  }
  const mergedResponse = new Response(newResponse.body, {
    status,
    statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
    // If you're looking at here for possible bugs, it means that it's not a bug.
    // With the middleware, users can meddle with headers, and we should pass to the 404/500.
    // If users see something weird, it's because they are setting some headers they should not.
    //
    // Although, we don't want it to replace the content-type, because the error page must return `text/html`
    headers: newHeaders
  });
  const originalCookies = getCookiesFromResponse(originalResponse);
  const newCookies = getCookiesFromResponse(newResponse);
  if (originalCookies) {
    if (newCookies) {
      for (const cookieValue of newCookies.consume()) {
        originalResponse.headers.append("set-cookie", cookieValue);
      }
    }
    attachCookiesToResponse(mergedResponse, originalCookies);
  } else if (newCookies) {
    attachCookiesToResponse(mergedResponse, newCookies);
  }
  return mergedResponse;
}
function getAssetsPrefix(fileExtension2, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension2.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s4) => createStylesheetElement(s4, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}
function v3(e4) {
  void 0 !== e4.__g ? e4.__g |= 8 : e4[u4] = true;
}
function m3(e4) {
  void 0 !== e4.__g ? e4.__g &= -9 : e4[u4] = false;
}
function y3(e4) {
  return void 0 !== e4.__g ? !!(8 & e4.__g) : true === e4[u4];
}
function g4(e4) {
  if (0 === e4.length || false === _3.test(e4)) return e4;
  for (var t4 = 0, n3 = 0, r4 = "", o4 = ""; n3 < e4.length; n3++) {
    switch (e4.charCodeAt(n3)) {
      case 34:
        o4 = "&quot;";
        break;
      case 38:
        o4 = "&amp;";
        break;
      case 60:
        o4 = "&lt;";
        break;
      default:
        continue;
    }
    n3 !== t4 && (r4 += e4.slice(t4, n3)), r4 += o4, t4 = n3 + 1;
  }
  return n3 !== t4 && (r4 += e4.slice(t4, n3)), r4;
}
function w3(e4) {
  var t4 = "";
  for (var n3 in e4) {
    var r4 = e4[n3];
    if (null != r4 && "" !== r4) {
      var o4 = "-" == n3[0] ? n3 : b2[n3] || (b2[n3] = n3.replace(k3, "-$&").toLowerCase()), i5 = ";";
      "number" != typeof r4 || o4.startsWith("--") || x3.has(o4) || (i5 = "px;"), t4 = t4 + o4 + ":" + r4 + i5;
    }
  }
  return t4 || void 0;
}
function C3() {
  this.__d = true;
}
function A4(e4, t4) {
  return { __v: e4, context: t4, props: e4.props, setState: C3, forceUpdate: C3, __d: true, __h: new Array(0) };
}
function S2(e4, t4, n3) {
  if (!e4.s) {
    if (n3 instanceof L2) {
      if (!n3.s) return void (n3.o = S2.bind(null, e4, t4));
      1 & t4 && (t4 = n3.s), n3 = n3.v;
    }
    if (n3 && n3.then) return void n3.then(S2.bind(null, e4, t4), S2.bind(null, e4, 2));
    e4.s = t4, e4.v = n3;
    const r4 = e4.o;
    r4 && r4(e4);
  }
}
function E3(e4) {
  return e4 instanceof L2 && 1 & e4.s;
}
function j4(e4, t4, n3) {
  for (var r4; ; ) {
    var o4 = e4();
    if (E3(o4) && (o4 = o4.v), !o4) return i5;
    if (o4.then) {
      r4 = 0;
      break;
    }
    var i5 = n3();
    if (i5 && i5.then) {
      if (!E3(i5)) {
        r4 = 1;
        break;
      }
      i5 = i5.s;
    }
    var a4;
  }
  var c4 = new L2(), u5 = S2.bind(null, c4, 2);
  return (0 === r4 ? o4.then(l4) : 1 === r4 ? i5.then(s4) : a4.then(f5)).then(void 0, u5), c4;
  function s4(r5) {
    i5 = r5;
    do {
      if (!(o4 = e4()) || E3(o4) && !o4.v) return void S2(c4, 1, i5);
      if (o4.then) return void o4.then(l4).then(void 0, u5);
      E3(i5 = n3()) && (i5 = i5.v);
    } while (!i5 || !i5.then);
    i5.then(s4).then(void 0, u5);
  }
  function l4(e5) {
    e5 ? (i5 = n3()) && i5.then ? i5.then(s4).then(void 0, u5) : s4(i5) : S2(c4, 1, i5);
  }
  function f5() {
    (o4 = e4()) ? o4.then ? o4.then(l4).then(void 0, u5) : l4(o4) : S2(c4, 1, i5);
  }
}
function T4(e4, t4) {
  try {
    var n3 = e4();
  } catch (e5) {
    return t4(true, e5);
  }
  return n3 && n3.then ? n3.then(t4.bind(null, false), t4.bind(null, true)) : t4(false, n3);
}
function B4(e4) {
  return "string" == typeof e4 ? N2 + e4 + q4 : W4(e4) ? (e4.unshift(N2), e4.push(q4), e4) : e4 && "function" == typeof e4.then ? e4.then(B4) : N2 + e4 + q4;
}
function O3(e4, t4) {
  var n3, r4 = e4.type, o4 = true;
  return e4[a3] ? (o4 = false, (n3 = e4[a3]).state = n3[s3]) : n3 = new r4(e4.props, t4), e4[a3] = n3, n3.__v = e4, n3.props = e4.props, n3.context = t4, v3(n3), null == n3.state && (n3.state = F3), null == n3[s3] && (n3[s3] = n3.state), r4.getDerivedStateFromProps ? n3.state = z3({}, n3.state, r4.getDerivedStateFromProps(n3.props, n3.state)) : o4 && n3.componentWillMount ? (n3.componentWillMount(), n3.state = n3[s3] !== n3.state ? n3[s3] : n3.state) : !o4 && n3.componentWillUpdate && n3.componentWillUpdate(), $2 && $2(e4), n3.render(n3.props, n3.state, t4);
}
function R2(t4, r4, o4, i5, u5, _4, b3) {
  if (null == t4 || true === t4 || false === t4 || t4 === H4) return H4;
  var x4 = typeof t4;
  if ("object" != x4) return "function" == x4 ? H4 : "string" == x4 ? g4(t4) : t4 + H4;
  if (W4(t4)) {
    var k4, C4 = H4;
    u5[c3] = t4;
    for (var S3 = t4.length, L3 = 0; L3 < S3; L3++) {
      var E4 = t4[L3];
      if (null != E4 && "boolean" != typeof E4) {
        var j5, T5 = R2(E4, r4, o4, i5, u5, _4, b3);
        "string" == typeof T5 ? C4 += T5 : (k4 || (k4 = new Array(S3)), C4 && k4.push(C4), C4 = H4, W4(T5) ? (j5 = k4).push.apply(j5, T5) : k4.push(T5));
      }
    }
    return k4 ? (C4 && k4.push(C4), k4) : C4;
  }
  if (void 0 !== t4.constructor) return H4;
  t4.__ = u5, D3 && D3(t4);
  var Z2 = t4.type, M4 = t4.props;
  if ("function" == typeof Z2) {
    var N3, q5, I2, K3 = r4;
    if (Z2 === S) {
      if ("tpl" in M4) {
        for (var G3 = H4, Q3 = 0; Q3 < M4.tpl.length; Q3++) if (G3 += M4.tpl[Q3], M4.exprs && Q3 < M4.exprs.length) {
          var X3 = M4.exprs[Q3];
          if (null == X3) continue;
          "object" != typeof X3 || void 0 !== X3.constructor && !W4(X3) ? G3 += X3 : G3 += R2(X3, r4, o4, i5, t4, _4, b3);
        }
        return G3;
      }
      if ("UNSTABLE_comment" in M4) return "<!--" + g4(M4.UNSTABLE_comment) + "-->";
      q5 = M4.children;
    } else {
      if (null != (N3 = Z2.contextType)) {
        var Y = r4[N3.__c];
        K3 = Y ? Y.props.value : N3.__;
      }
      var ee = Z2.prototype && "function" == typeof Z2.prototype.render;
      if (ee) q5 = /**#__NOINLINE__**/
      O3(t4, K3), I2 = t4[a3];
      else {
        t4[a3] = I2 = /**#__NOINLINE__**/
        A4(t4, K3);
        for (var te = 0; y3(I2) && te++ < 25; ) {
          m3(I2), $2 && $2(t4);
          try {
            q5 = Z2.call(I2, M4, K3);
          } catch (e4) {
            throw e4 && "function" == typeof e4.then && (t4._suspended = true), e4;
          }
        }
        v3(I2);
      }
      if (null != I2.getChildContext && (r4 = z3({}, r4, I2.getChildContext())), ee && l.errorBoundaries && (Z2.getDerivedStateFromError || I2.componentDidCatch)) {
        q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5;
        try {
          return R2(q5, r4, o4, i5, t4, _4, false);
        } catch (e4) {
          return Z2.getDerivedStateFromError && (I2[s3] = Z2.getDerivedStateFromError(e4)), I2.componentDidCatch && I2.componentDidCatch(e4, F3), y3(I2) ? (q5 = O3(t4, r4), null != (I2 = t4[a3]).getChildContext && (r4 = z3({}, r4, I2.getChildContext())), R2(q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5, r4, o4, i5, t4, _4, b3)) : H4;
        } finally {
          P4 && P4(t4), U3 && U3(t4);
        }
      }
    }
    q5 = null != q5 && q5.type === S && null == q5.key && null == q5.props.tpl ? q5.props.children : q5;
    try {
      var ne = R2(q5, r4, o4, i5, t4, _4, b3);
      return P4 && P4(t4), l.unmount && l.unmount(t4), t4._suspended ? B4(ne) : ne;
    } catch (n3) {
      if (!n3 || "function" != typeof n3.then) throw n3;
      return n3.then(function e4() {
        try {
          var n4 = R2(q5, r4, o4, i5, t4, _4, b3);
          return t4._suspended ? B4(n4) : n4;
        } catch (t5) {
          if (!t5 || "function" != typeof t5.then) throw t5;
          return t5.then(e4);
        }
      });
    }
  }
  var ie, ae = "<" + Z2, ce = H4;
  for (var ue in M4) {
    var se = M4[ue];
    if ("function" != typeof (se = J3(se) ? se.value : se) || "class" === ue || "className" === ue) {
      switch (ue) {
        case "children":
          ie = se;
          continue;
        case "key":
        case "ref":
        case "__self":
        case "__source":
          continue;
        case "htmlFor":
          if ("for" in M4) continue;
          ue = "for";
          break;
        case "className":
          if ("class" in M4) continue;
          ue = "class";
          break;
        case "defaultChecked":
          ue = "checked";
          break;
        case "defaultSelected":
          ue = "selected";
          break;
        case "defaultValue":
        case "value":
          switch (ue = "value", Z2) {
            case "textarea":
              ie = se;
              continue;
            case "select":
              i5 = se;
              continue;
            case "option":
              i5 != se || "selected" in M4 || (ae += " selected");
          }
          break;
        case "dangerouslySetInnerHTML":
          ce = se && se.__html;
          continue;
        case "style":
          "object" == typeof se && (se = w3(se));
          break;
        case "acceptCharset":
          ue = "accept-charset";
          break;
        case "httpEquiv":
          ue = "http-equiv";
          break;
        default:
          if (l3.test(ue)) continue;
          f4.test(ue) ? ue = ue.replace(f4, "$1:$2").toLowerCase() : "-" !== ue[4] && !d3.has(ue) || null == se ? o4 ? h3.test(ue) && (ue = "panose1" === ue ? "panose-1" : ue.replace(/([A-Z])/g, "-$1").toLowerCase()) : p3.test(ue) && (ue = ue.toLowerCase()) : se += H4;
      }
      null != se && false !== se && (ae = true === se || se === H4 ? ae + " " + ue : ae + " " + ue + '="' + ("string" == typeof se ? g4(se) : se + H4) + '"');
    }
  }
  if (l3.test(Z2)) throw new Error(Z2 + " is not a valid HTML tag name in " + ae + ">");
  if (ce || ("string" == typeof ie ? ce = g4(ie) : null != ie && false !== ie && true !== ie && (ce = R2(ie, r4, "svg" === Z2 || "foreignObject" !== Z2 && o4, i5, t4, _4, b3))), P4 && P4(t4), U3 && U3(t4), !ce && V3.has(Z2)) return ae + "/>";
  var le = "</" + Z2 + ">", fe = ae + ">";
  return W4(ce) ? [fe].concat(ce, [le]) : "string" != typeof ce ? [fe, ce, le] : fe + ce + le;
}
function J3(e4) {
  return null !== e4 && "object" == typeof e4 && "function" == typeof e4.peek && "value" in e4;
}
function getContext(result) {
  if (contexts.has(result)) {
    return contexts.get(result);
  }
  let ctx = {
    c: 0,
    islandCount: 0,
    get id() {
      return "p" + this.c.toString();
    },
    signals: /* @__PURE__ */ new Map(),
    propsToSignals: /* @__PURE__ */ new Map()
  };
  contexts.set(result, ctx);
  return ctx;
}
function incrementId(ctx) {
  let id = ctx.id;
  ctx.c++;
  return id;
}
function incrementIslandId(ctx) {
  const islandId = ctx.islandCount;
  ctx.islandCount++;
  return islandId;
}
function isSignal(x4) {
  return x4 != null && typeof x4 === "object" && typeof x4.peek === "function" && "value" in x4;
}
function restoreSignalsOnProps(ctx, props) {
  let propMap;
  if (ctx.propsToSignals.has(props)) {
    propMap = ctx.propsToSignals.get(props);
  } else {
    propMap = /* @__PURE__ */ new Map();
    ctx.propsToSignals.set(props, propMap);
  }
  for (const [key, signal] of propMap) {
    props[key] = signal;
  }
  return propMap;
}
function serializeSignals(ctx, props, attrs, map) {
  const signals = {};
  for (const [key, value] of Object.entries(props)) {
    const isPropArray = Array.isArray(value);
    const isPropObject = !isSignal(value) && typeof props[key] === "object" && props[key] !== null && !isPropArray;
    if (isPropObject || isPropArray) {
      const values = isPropObject ? Object.keys(props[key]) : value;
      values.forEach((valueKey, valueIndex) => {
        const signal = isPropObject ? props[key][valueKey] : valueKey;
        if (isSignal(signal)) {
          const keyOrIndex = isPropObject ? valueKey.toString() : valueIndex;
          props[key] = isPropObject ? Object.assign({}, props[key], { [keyOrIndex]: signal.peek() }) : props[key].map(
            (v4, i5) => i5 === valueIndex ? [signal.peek(), i5] : v4
          );
          const currentMap = map.get(key) || [];
          map.set(key, [...currentMap, [signal, keyOrIndex]]);
          const currentSignals = signals[key] || [];
          signals[key] = [...currentSignals, [getSignalId(ctx, signal), keyOrIndex]];
        }
      });
    } else if (isSignal(value)) {
      props[key] = value.peek();
      map.set(key, value);
      signals[key] = getSignalId(ctx, value);
    }
  }
  if (Object.keys(signals).length) {
    attrs["data-preact-signals"] = JSON.stringify(signals);
  }
}
function getSignalId(ctx, item) {
  let id = ctx.signals.get(item);
  if (!id) {
    id = incrementId(ctx);
    ctx.signals.set(item, id);
  }
  return id;
}
function setVNodeMask(vNode, mask) {
  vNode._mask = mask;
  vNode.__m = mask;
}
async function check(Component$1, props, children, metadata) {
  if (typeof Component$1 !== "function") return false;
  if (Component$1.name === "QwikComponent") return false;
  metadata?.componentUrl;
  if (Component$1.prototype != null && typeof Component$1.prototype.render === "function") {
    return C.isPrototypeOf(Component$1);
  }
  useConsoleFilter();
  try {
    const { html } = await renderToStaticMarkup.call(this, Component$1, props, children, void 0);
    if (typeof html !== "string") {
      return false;
    }
    return html === "" ? false : !html.includes("<undefined>");
  } catch {
    return false;
  } finally {
    finishUsingConsoleFilter();
  }
}
function shouldHydrate(metadata) {
  return metadata?.astroStaticSlot ? !!metadata.hydrate : true;
}
async function renderToStaticMarkup(Component, props, { default: children, ...slotted }, metadata) {
  const ctx = getContext(this.result);
  const slots = {};
  for (const [key, value] of Object.entries(slotted)) {
    const name = slotName(key);
    slots[name] = k(static_html_default, {
      hydrate: shouldHydrate(metadata),
      value,
      name
    });
  }
  let propsMap = restoreSignalsOnProps(ctx, props);
  const newProps = { ...props, ...slots };
  const attrs = {};
  serializeSignals(ctx, props, attrs, propsMap);
  const islandId = incrementIslandId(ctx);
  attrs["data-preact-island-id"] = islandId.toString();
  const vNode = k(
    Component,
    newProps,
    children != null ? k(static_html_default, {
      hydrate: shouldHydrate(metadata),
      value: children
    }) : children
  );
  setVNodeMask(vNode, [islandId, 0]);
  const html = await Z(vNode);
  return { attrs, html };
}
function useConsoleFilter() {
  consoleFilterRefs++;
  if (!originalConsoleError) {
    originalConsoleError = console.error;
    try {
      console.error = filteredConsoleError;
    } catch {
    }
  }
}
function finishUsingConsoleFilter() {
  consoleFilterRefs--;
}
function filteredConsoleError(msg, ...rest) {
  if (consoleFilterRefs > 0 && !process.env.ASTRO_INTERNAL_TEST_DISABLE_CONSOLE_FILTER && typeof msg === "string") {
    const isKnownReactHookError = msg.includes("Invalid hook call.") && // for React v18 and earlier
    (msg.includes("https://reactjs.org/link/invalid-hook-call") || // for React v19 and later
    msg.includes("https://react.dev/link/invalid-hook-call"));
    if (isKnownReactHookError) return;
  }
  originalConsoleError(msg, ...rest);
}
async function start() {
  let trace;
  const handler = async (request) => {
    if (trace === void 0) {
      try {
        trace = (await Promise.resolve().then(() => (init_astro_adapter_false_CaqwA2Hq(), astro_adapter_false_CaqwA2Hq_exports))).trace;
      } catch {
        trace = null;
      }
    }
    const routeData = app.match(request);
    if (routeData) {
      const span = trace?.getActiveSpan();
      span?.updateName(`${request.method} ${routeData.route}`);
      span?.setAttribute("http.route", routeData.route);
      span?.setAttribute("astro.prerendered", routeData.prerender);
      span?.setAttribute("astro.type", routeData.type);
      const hostname2 = request.headers.get("x-real-ip") || "0.0.0.0";
      Reflect.set(request, /* @__PURE__ */ Symbol.for("astro.clientAddress"), hostname2);
      const response2 = await app.render(request, { routeData });
      if (app.setCookieHeaders) {
        for (const setCookieHeader of app.setCookieHeaders(response2)) {
          response2.headers.append("Set-Cookie", setCookieHeader);
        }
      }
      return response2;
    }
    const response = await app.render(request);
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  };
  Bunny.v1.serve(handler);
  console.error(`Bunny Serve Hooked!`);
}
async function stop() {
  if (_server) {
    _server.shutdown();
    _server = void 0;
  }
  await Promise.resolve(_startPromise);
}
function running() {
  return _server !== void 0;
}
function handle(request) {
  return app.render(request);
}
var e3, t3, n2, r$2, i$1, a$1, o$1, s$1, MANY_LEADING_SLASHES, MANY_SLASHES, MANY_TRAILING_SLASHES, INTERNAL_PREFIXES, JUST_SLASHES, WITH_FILE_EXT, UNDEFINED, HOLE, NAN, POSITIVE_INFINITY, NEGATIVE_INFINITY, NEGATIVE_ZERO, SPARSE, MAX_ARRAY_LEN, MAX_ARRAY_INDEX, DevalueError, object_proto_names, is_identifier, native, buffer, encode64, decode64, ACTION_QUERY_PARAMS, ACTION_RPC_ROUTE_PATTERN, __vite_import_meta_env__$1, codeToStatusMap, statusToCodeMap, ActionError, ActionInputError, actionResultErrorStack, ImportType, E$1, _a$1, $ZodAsyncError, $ZodEncodeError, globalConfig, EVALUATING, captureStackTrace, propertyKeyTypes, initializer$1, $ZodError, $ZodRealError, _parse, _parseAsync, _safeParse, safeParse$1, _safeParseAsync, safeParseAsync$1, _encode, _decode, _encodeAsync, _decodeAsync, _safeEncode, _safeDecode, _safeEncodeAsync, _safeDecodeAsync, $ZodCheck, $ZodCheckMaxLength, $ZodCheckMinLength, $ZodCheckLengthEquals, $ZodCheckOverwrite, version, $ZodType, $ZodArray, $ZodUnion, $ZodIntersection, $ZodEnum, $ZodTransform, $ZodOptional, $ZodExactOptional, $ZodNullable, $ZodDefault, $ZodPrefault, $ZodNonOptional, $ZodCatch, $ZodPipe, $ZodReadonly, $ZodCustom, _a6, $ZodRegistry, globalRegistry, createToJSONSchemaMethod, createStandardJSONSchemaMethod, enumProcessor, customProcessor, transformProcessor, arrayProcessor, unionProcessor, intersectionProcessor, nullableProcessor, nonoptionalProcessor, defaultProcessor, prefaultProcessor, catchProcessor, pipeProcessor, readonlyProcessor, optionalProcessor, ASTRO_VERSION, ASTRO_GENERATOR, REROUTE_DIRECTIVE_HEADER, REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE, NOOP_MIDDLEWARE_HEADER, ROUTE_TYPE_HEADER, INTERNAL_RESPONSE_HEADERS, ASTRO_ERROR_HEADER, DEFAULT_404_COMPONENT, REDIRECT_STATUS_CODES, REROUTABLE_STATUS_CODES, clientAddressSymbol, originPathnameSymbol, pipelineSymbol, fetchStateSymbol, appSymbol, responseSentSymbol$1, ClientAddressNotAvailable, PrerenderClientAddressNotAvailable, StaticClientAddressNotAvailable, NoMatchingStaticPathFound, OnlyResponseCanBeReturned, MissingMediaQueryDirective, NoMatchingRenderer, NoClientOnlyHint, InvalidGetStaticPathsEntry, InvalidGetStaticPathsReturn, GetStaticPathsExpectedParams, GetStaticPathsInvalidRouteParam, GetStaticPathsRequired, ReservedSlotName, NoMatchingImport, InvalidComponentArgs, PageNumberParamNotFound, ImageMissingAlt, InvalidImageService, MissingImageDimension, FailedToFetchRemoteImageDimensions, RemoteImageNotAllowed, UnsupportedImageFormat, UnsupportedImageConversion, PrerenderDynamicEndpointPathCollide, ExpectedImage, ExpectedImageOptions, ExpectedNotESMImage, IncompatibleDescriptorOptions, NoImageMetadata, ResponseSentError, MiddlewareNoDataOrNextCalled, MiddlewareNotAResponse, EndpointDidNotReturnAResponse, LocalsNotAnObject, LocalsReassigned, AstroResponseHeadersReassigned, LocalImageUsedWrongly, i18nNoLocaleFoundInPath, RewriteWithBodyUsed, ForbiddenRewrite, FontFamilyNotFound, MissingGetFontFileRequestUrl, UnableToLoadLogger, ActionsReturnedInvalidDataError, ActionNotFoundError, SessionStorageInitError, SessionStorageSaveError, CacheNotEnabled, AstroError, BodySizeLimitError, __vite_import_meta_env__, ACTION_API_CONTEXT_SYMBOL, formContentTypes, dist, hasRequiredDist, distExports, DELETED_EXPIRATION, DELETED_VALUE, responseSentSymbol, identity, AstroCookie, AstroCookies, astroCookiesSymbol, NOOP_ACTIONS_MOD, FORM_CONTENT_TYPES, SAFE_METHODS, NOOP_MIDDLEWARE_FN, replace, ca, esca, pe, escape, DEFAULT_404_ROUTE, default404Instance, ROUTE404_RE, ROUTE500_RE, RedirectComponentInstance, RedirectSinglePageBuiltModule, VALID_PARAM_TYPES, RouteCache, escapeHTML, HTMLBytes, htmlStringSymbol, HTMLString, markHTMLString, AstroJSX, PROP_TYPE, transitionDirectivesToCopyOnIsland, dictionary, binary, headAndContentSym, astro_island_prebuilt_default, astro_island_prebuilt_dev_default, ISLAND_STYLES, RenderInstructionSymbol, voidElementNames, htmlBooleanAttributes, AMPERSAND_REGEX, DOUBLE_QUOTE_REGEX, STATIC_DIRECTIVES, INVALID_ATTR_NAME_CHAR, toIdent, toAttributeString, kebab, toStyleString, noop, BufferedRenderer, isNode, isDeno, alphabetUpperCase, decodeMap, EncodingPadding$1, DecodingPadding$1, base64Alphabet, EncodingPadding, DecodingPadding, base64DecodeMap, initializer, ZodRealError, parse, parseAsync, safeParse, safeParseAsync, encode, decode, encodeAsync, decodeAsync, safeEncode, safeDecode, safeEncodeAsync, safeDecodeAsync, _installedGroups, ZodType, ZodArray, ZodUnion, ZodIntersection, ZodEnum, ZodTransform, ZodOptional, ZodExactOptional, ZodNullable, ZodDefault, ZodPrefault, ZodNonOptional, ZodCatch, ZodPipe, ZodReadonly, ZodCustom, ZodIssueCode, ALGORITHMS, ALLOWED_DIRECTIVES, ALGORITHM, encoder$1, decoder$1, IV_LENGTH, renderTemplateResultSym, RenderTemplateResult, slotString, SlotString, internalProps, ServerIslandComponent, renderServerIslandRuntime, SERVER_ISLAND_REPLACER, Fragment, Renderer, encoder, decoder2, astroComponentInstanceSym, AstroComponentInstance, DOCTYPE_EXP, needsHeadRenderingSymbol, rendererAliases, clientOnlyValues, ASTRO_SLOT_EXP, ASTRO_STATIC_SLOT_EXP, ClientOnlyPlaceholder$1, hasTriedRenderComponentSymbol, ClientOnlyPlaceholder, SERVER_ISLAND_ROUTE, SERVER_ISLAND_COMPONENT, DEFAULT_BODY_SIZE_LIMIT, Router, NodePool, HTMLStringCache, COMMON_HTML_PATTERNS, FORBIDDEN_PATH_KEYS, dateTimeFormat, levels, AstroLogger, AstroIntegrationLogger, SGR_REGEX, PipelineFeatures, ALL_PIPELINE_FEATURES, Pipeline, Slots, I18nRouter, I18n, EMPTY_OPTIONS, NoopAstroCache, hasWarned, DisabledAstroCache, AstroMiddleware, EMPTY_SLOTS, PagesHandler, Rewrites, renderOptionsSymbol, FetchState, ActionHandler, TrailingSlashHandler, APPLY_HEADERS, IS_ACTIVE, AstroCache, ROUTE_DYNAMIC_SPLIT, ROUTE_SPREAD, CACHE_KEY, CacheHandler, suspectProtoRx, suspectConstructorRx, JsonSigRx, BASE64_PREFIX, DRIVER_NAME, memory, PERSIST_SYMBOL, DEFAULT_COOKIE_NAME, VALID_COOKIE_REGEX, unflatten, stringify, AstroSession, SESSION_KEY, AstroHandler, DefaultFetchHandler, fetchable, DefaultErrorHandler, BaseApp, URL_PARSE_BASE, AppPipeline, App, r3, o3, i4, a3, c3, u4, s3, l3, f4, p3, h3, d3, _3, b2, x3, k3, L2, D3, P4, $2, U3, Z, F3, M3, W4, z3, H4, N2, q4, V3, contexts, StaticHtml, static_html_default, slotName, originalConsoleError, consoleFilterRefs, renderer, server_default, renderers, serializedData, _page0, _page1, _page22, _page32, _page42, _page52, _page62, _page72, _page82, _page92, _page102, _page112, _page122, pageMap, _manifest, manifestRoutes, manifest, createApp$1, createApp, app, _server, _startPromise;
var init_server_b5nfSfcf = __esm({
  "dist/server/chunks/server_b5nfSfcf.mjs"() {
    "use strict";
    init_preact();
    e3 = globalThis.process || {};
    t3 = e3.argv || [];
    n2 = e3.env || {};
    r$2 = !(n2.NO_COLOR || t3.includes(`--no-color`)) && (!!n2.FORCE_COLOR || t3.includes(`--color`) || e3.platform === `win32` || (e3.stdout || {}).isTTY && n2.TERM !== `dumb` || !!n2.CI);
    i$1 = (e4, t4, n3 = e4) => (r4) => {
      let i5 = `` + r4, o4 = i5.indexOf(t4, e4.length);
      return ~o4 ? e4 + a$1(i5, t4, n3, o4) + t4 : e4 + i5 + t4;
    };
    a$1 = (e4, t4, n3, r4) => {
      let i5 = ``, a4 = 0;
      do
        i5 += e4.substring(a4, r4) + n3, a4 = r4 + t4.length, r4 = e4.indexOf(t4, a4);
      while (~r4);
      return i5 + e4.substring(a4);
    };
    o$1 = (e4 = r$2) => {
      let t4 = e4 ? i$1 : () => String;
      return { isColorSupported: e4, reset: t4(`\x1B[0m`, `\x1B[0m`), bold: t4(`\x1B[1m`, `\x1B[22m`, `\x1B[22m\x1B[1m`), dim: t4(`\x1B[2m`, `\x1B[22m`, `\x1B[22m\x1B[2m`), italic: t4(`\x1B[3m`, `\x1B[23m`), underline: t4(`\x1B[4m`, `\x1B[24m`), inverse: t4(`\x1B[7m`, `\x1B[27m`), hidden: t4(`\x1B[8m`, `\x1B[28m`), strikethrough: t4(`\x1B[9m`, `\x1B[29m`), black: t4(`\x1B[30m`, `\x1B[39m`), red: t4(`\x1B[31m`, `\x1B[39m`), green: t4(`\x1B[32m`, `\x1B[39m`), yellow: t4(`\x1B[33m`, `\x1B[39m`), blue: t4(`\x1B[34m`, `\x1B[39m`), magenta: t4(`\x1B[35m`, `\x1B[39m`), cyan: t4(`\x1B[36m`, `\x1B[39m`), white: t4(`\x1B[37m`, `\x1B[39m`), gray: t4(`\x1B[90m`, `\x1B[39m`), bgBlack: t4(`\x1B[40m`, `\x1B[49m`), bgRed: t4(`\x1B[41m`, `\x1B[49m`), bgGreen: t4(`\x1B[42m`, `\x1B[49m`), bgYellow: t4(`\x1B[43m`, `\x1B[49m`), bgBlue: t4(`\x1B[44m`, `\x1B[49m`), bgMagenta: t4(`\x1B[45m`, `\x1B[49m`), bgCyan: t4(`\x1B[46m`, `\x1B[49m`), bgWhite: t4(`\x1B[47m`, `\x1B[49m`), blackBright: t4(`\x1B[90m`, `\x1B[39m`), redBright: t4(`\x1B[91m`, `\x1B[39m`), greenBright: t4(`\x1B[92m`, `\x1B[39m`), yellowBright: t4(`\x1B[93m`, `\x1B[39m`), blueBright: t4(`\x1B[94m`, `\x1B[39m`), magentaBright: t4(`\x1B[95m`, `\x1B[39m`), cyanBright: t4(`\x1B[96m`, `\x1B[39m`), whiteBright: t4(`\x1B[97m`, `\x1B[39m`), bgBlackBright: t4(`\x1B[100m`, `\x1B[49m`), bgRedBright: t4(`\x1B[101m`, `\x1B[49m`), bgGreenBright: t4(`\x1B[102m`, `\x1B[49m`), bgYellowBright: t4(`\x1B[103m`, `\x1B[49m`), bgBlueBright: t4(`\x1B[104m`, `\x1B[49m`), bgMagentaBright: t4(`\x1B[105m`, `\x1B[49m`), bgCyanBright: t4(`\x1B[106m`, `\x1B[49m`), bgWhiteBright: t4(`\x1B[107m`, `\x1B[49m`) };
    };
    s$1 = o$1();
    MANY_LEADING_SLASHES = /^\/{2,}/;
    MANY_SLASHES = /\/{2,}/g;
    MANY_TRAILING_SLASHES = /\/{2,}$/g;
    INTERNAL_PREFIXES = /* @__PURE__ */ new Set(["/_", "/@", "/.", "//"]);
    JUST_SLASHES = /^\/{2,}$/;
    WITH_FILE_EXT = /\/[^/]+\.\w+$/;
    UNDEFINED = -1;
    HOLE = -2;
    NAN = -3;
    POSITIVE_INFINITY = -4;
    NEGATIVE_INFINITY = -5;
    NEGATIVE_ZERO = -6;
    SPARSE = -7;
    MAX_ARRAY_LEN = 2 ** 32 - 1;
    MAX_ARRAY_INDEX = MAX_ARRAY_LEN - 1;
    DevalueError = class extends Error {
      /**
       * @param {string} message
       * @param {string[]} keys
       * @param {any} [value] - The value that failed to be serialized
       * @param {any} [root] - The root value being serialized
       */
      constructor(message, keys, value, root) {
        super(message);
        this.name = "DevalueError";
        this.path = keys.join("");
        this.value = value;
        this.root = root;
      }
    };
    object_proto_names = /* @__PURE__ */ Object.getOwnPropertyNames(Object.prototype).sort().join("\0");
    is_identifier = /^[a-zA-Z_$][a-zA-Z_$0-9]*$/;
    native = typeof Uint8Array.fromBase64 === "function";
    buffer = typeof process === "object" && process.versions?.node !== void 0;
    encode64 = native ? encode_native : buffer ? encode_buffer : encode_legacy;
    decode64 = native ? decode_native : buffer ? decode_buffer : decode_legacy;
    ACTION_QUERY_PARAMS = {
      actionName: "_action"
    };
    ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";
    __vite_import_meta_env__$1 = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
    codeToStatusMap = {
      // Implemented from IANA HTTP Status Code Registry
      // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      PAYMENT_REQUIRED: 402,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      METHOD_NOT_ALLOWED: 405,
      NOT_ACCEPTABLE: 406,
      PROXY_AUTHENTICATION_REQUIRED: 407,
      REQUEST_TIMEOUT: 408,
      CONFLICT: 409,
      GONE: 410,
      LENGTH_REQUIRED: 411,
      PRECONDITION_FAILED: 412,
      CONTENT_TOO_LARGE: 413,
      URI_TOO_LONG: 414,
      UNSUPPORTED_MEDIA_TYPE: 415,
      RANGE_NOT_SATISFIABLE: 416,
      EXPECTATION_FAILED: 417,
      MISDIRECTED_REQUEST: 421,
      UNPROCESSABLE_CONTENT: 422,
      LOCKED: 423,
      FAILED_DEPENDENCY: 424,
      TOO_EARLY: 425,
      UPGRADE_REQUIRED: 426,
      PRECONDITION_REQUIRED: 428,
      TOO_MANY_REQUESTS: 429,
      REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
      UNAVAILABLE_FOR_LEGAL_REASONS: 451,
      INTERNAL_SERVER_ERROR: 500,
      NOT_IMPLEMENTED: 501,
      BAD_GATEWAY: 502,
      SERVICE_UNAVAILABLE: 503,
      GATEWAY_TIMEOUT: 504,
      HTTP_VERSION_NOT_SUPPORTED: 505,
      VARIANT_ALSO_NEGOTIATES: 506,
      INSUFFICIENT_STORAGE: 507,
      LOOP_DETECTED: 508,
      NETWORK_AUTHENTICATION_REQUIRED: 511
    };
    statusToCodeMap = Object.fromEntries(
      Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
    );
    ActionError = class _ActionError extends Error {
      type = "AstroActionError";
      code = "INTERNAL_SERVER_ERROR";
      status = 500;
      constructor(params) {
        super(params.message);
        this.code = params.code;
        this.status = _ActionError.codeToStatus(params.code);
        if (params.stack) {
          this.stack = params.stack;
        }
      }
      static codeToStatus(code) {
        return codeToStatusMap[code];
      }
      static statusToCode(status) {
        return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
      }
      static fromJson(body) {
        if (isInputError(body)) {
          return new ActionInputError(body.issues);
        }
        if (isActionError(body)) {
          return new _ActionError(body);
        }
        return new _ActionError({
          code: "INTERNAL_SERVER_ERROR"
        });
      }
    };
    ActionInputError = class extends ActionError {
      type = "AstroActionInputError";
      // We don't expose all ZodError properties.
      // Not all properties will serialize from server to client,
      // and we don't want to import the full ZodError object into the client.
      issues;
      fields;
      constructor(issues) {
        super({
          message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
          code: "BAD_REQUEST"
        });
        this.issues = issues;
        this.fields = {};
        for (const issue2 of issues) {
          if (issue2.path.length > 0) {
            const key = issue2.path[0].toString();
            this.fields[key] ??= [];
            this.fields[key]?.push(issue2.message);
          }
        }
      }
    };
    actionResultErrorStack = /* @__PURE__ */ function actionResultErrorStackFn() {
      let errorStack;
      return {
        set(stack) {
          errorStack = stack;
        },
        get() {
          return errorStack;
        }
      };
    }();
    !function(A5) {
      A5[A5.Static = 1] = "Static", A5[A5.Dynamic = 2] = "Dynamic", A5[A5.ImportMeta = 3] = "ImportMeta", A5[A5.StaticSourcePhase = 4] = "StaticSourcePhase", A5[A5.DynamicSourcePhase = 5] = "DynamicSourcePhase", A5[A5.StaticDeferPhase = 6] = "StaticDeferPhase", A5[A5.DynamicDeferPhase = 7] = "DynamicDeferPhase";
    }(ImportType || (ImportType = {}));
    1 === new Uint8Array(new Uint16Array([1]).buffer)[0];
    E$1 = () => {
      return A5 = "AGFzbQEAAAABKwhgAX8Bf2AEf39/fwBgAAF/YAAAYAF/AGADf39/AX9gAn9/AX9gA39/fwADODcAAQECAgICAgICAgICAgICAgICAgICAgICAwIAAwMDBAAEAAAABQAAAAAAAwMDAAAGAAcABgIFBAUBcAEBAQUDAQABBg8CfwFBsPIAC38AQbDyAAsHnQEbBm1lbW9yeQIAAnNhAAABZQADAmlzAAQCaWUABQJzcwAGAnNlAAcCaXQACAJhaQAJAmlkAAoCaXAACwJlcwAMAmVlAA0DZWxzAA4DZWxlAA8CcmkAEAJyZQARAWYAEgJtcwATAnJhABQDYWtzABUDYWtlABYDYXZzABcDYXZlABgDcnNhABkFcGFyc2UAGgtfX2hlYXBfYmFzZQMBCrxJN2gBAX9BACAANgL0CUEAKALQCSIBIABBAXRqIgBBADsBAEEAIABBAmoiADYC+AlBACAANgL8CUEAQQA2AtQJQQBBADYC5AlBAEEANgLcCUEAQQA2AtgJQQBBADYC7AlBAEEANgLgCSABC9MBAQN/QQAoAuQJIQRBAEEAKAL8CSIFNgLkCUEAIAQ2AugJQQAgBUEoajYC/AkgBEEkakHUCSAEGyAFNgIAQQAoAsgJIQRBACgCxAkhBiAFIAE2AgAgBSAANgIIIAUgAiACQQJqQQAgBiADRiIAGyAEIANGIgQbNgIMIAUgAzYCFCAFQQA2AhAgBSACNgIEIAVCADcCICAFQQNBAUECIAAbIAQbNgIcIAVBACgCxAkgA0YiAjoAGAJAAkAgAg0AQQAoAsgJIANHDQELQQBBAToAgAoLC14BAX9BACgC7AkiBEEQakHYCSAEG0EAKAL8CSIENgIAQQAgBDYC7AlBACAEQRRqNgL8CUEAQQE6AIAKIARBADYCECAEIAM2AgwgBCACNgIIIAQgATYCBCAEIAA2AgALCABBACgChAoLFQBBACgC3AkoAgBBACgC0AlrQQF1Cx4BAX9BACgC3AkoAgQiAEEAKALQCWtBAXVBfyAAGwsVAEEAKALcCSgCCEEAKALQCWtBAXULHgEBf0EAKALcCSgCDCIAQQAoAtAJa0EBdUF/IAAbCwsAQQAoAtwJKAIcCx4BAX9BACgC3AkoAhAiAEEAKALQCWtBAXVBfyAAGws7AQF/AkBBACgC3AkoAhQiAEEAKALECUcNAEF/DwsCQCAAQQAoAsgJRw0AQX4PCyAAQQAoAtAJa0EBdQsLAEEAKALcCS0AGAsVAEEAKALgCSgCAEEAKALQCWtBAXULFQBBACgC4AkoAgRBACgC0AlrQQF1Cx4BAX9BACgC4AkoAggiAEEAKALQCWtBAXVBfyAAGwseAQF/QQAoAuAJKAIMIgBBACgC0AlrQQF1QX8gABsLJQEBf0EAQQAoAtwJIgBBJGpB1AkgABsoAgAiADYC3AkgAEEARwslAQF/QQBBACgC4AkiAEEQakHYCSAAGygCACIANgLgCSAAQQBHCwgAQQAtAIgKCwgAQQAtAIAKCysBAX9BAEEAKAKMCiIAQRBqQQAoAtwJQSBqIAAbKAIAIgA2AowKIABBAEcLFQBBACgCjAooAgBBACgC0AlrQQF1CxUAQQAoAowKKAIEQQAoAtAJa0EBdQsVAEEAKAKMCigCCEEAKALQCWtBAXULFQBBACgCjAooAgxBACgC0AlrQQF1CwoAQQBBADYCjAoLuw8BBX8jAEGA0ABrIgAkAEEAQQE6AIgKQQBBACgCzAk2ApQKQQBBACgC0AlBfmoiATYCqApBACABQQAoAvQJQQF0aiICNgKsCkEAQQA6AIAKQQBBADsBkApBAEEAOwGSCkEAQQA6AJgKQQBBADYChApBAEEAOgDwCUEAIABBgBBqNgKcCkEAIAA2AqAKQQBBADoApAoCQAJAAkACQANAQQAgAUECaiIDNgKoCiABIAJPDQECQCADLwEAIgJBd2pBBUkNAAJAAkACQAJAAkAgAkGbf2oOBQEICAgCAAsgAkEgRg0EIAJBL0YNAyACQTtGDQIMBwtBAC8BkgoNASADEBtFDQEgAUEEakGCCEEKEDYNARAcQQAtAIgKDQFBAEEAKAKoCiIBNgKUCgwHCyADEBtFDQAgAUEEakGMCEEKEDYNABAdC0EAQQAoAqgKNgKUCgwBCwJAIAEvAQQiA0EqRg0AIANBL0cNBBAeDAELQQEQHwtBACgCrAohAkEAKAKoCiEBDAALC0EAIQIgAyEBQQAtAPAJDQIMAQtBACABNgKoCkEAQQA6AIgKCwNAQQAgAUECaiIDNgKoCgJAAkACQAJAAkACQAJAIAFBACgCrApPDQACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQCADLwEAIgJBYGoOEBMSCRISEhIIAQUSEgQSEgoACwJAAkACQAJAIAJBpX9qDg8FFQYVFQ4VFQMVARUVFQIACyACQXdqQQVJDRUgAkGFf2oOAwgUCRQLQQAvAZIKDRMgAxAbRQ0TIAFBBGpBgghBChA2DRMQHAwTCyADEBtFDRIgAUEEakGMCEEKEDYNEhAdDBILIAMQG0UNESABKQAEQuyAhIOwjsA5Ug0RIAEvAQwiA0F3aiIBQRdLDQ9BASABdEGfgIAEcUUNDwwQC0EAQQAvAZIKIgFBAWo7AZIKQQAoApwKIAFBA3RqIgFBATYCACABQQAoApQKNgIEDBALQQBBAC8BkgoiAUEBajsBkgpBACgCnAogAUEDdGoiAUEINgIAIAFBACgClAo2AgQMDwtBAC8BkgoiAUUNC0EAIAFBf2o7AZIKDA4LQQAvAZAKIgNFDQ1BAC8BkgoiAkUNDSACQQN0QQAoApwKakF4aigCAEEFRw0NIANBAnRBACgCoApqQXxqKAIAIgMoAgQNDUEAIAFBBGo2AqgKIANBACgClApBAmo2AgRBARAgGiADQQAoAqgKIgE2AhBBACABQX5qNgKoCgwNC0EALwGSCiIDRQ0JQQAgA0F/aiIDOwGSCkEALwGQCiICRQ0MQQAoApwKIANB//8DcUEDdGooAgBBBUcNDAJAIAJBAnRBACgCoApqQXxqKAIAIgMoAgQNACADQQAoApQKQQJqNgIEC0EAIAJBf2o7AZAKIAMgAUEEajYCDAwMCwJAQQAoApQKIgEvAQBBKUcNAEEAKALkCSIDRQ0AIAMoAgQgAUcNAEEAQQAoAugJIgM2AuQJAkAgA0UNACADQQA2AiQMAQtBAEEANgLUCQtBAEEALwGSCiIDQQFqOwGSCkEAKAKcCiADQQN0aiIDQQZBAkEALQCkChs2AgAgAyABNgIEQQBBADoApAoMCwtBAC8BkgoiAUUNB0EAIAFBf2oiATsBkgpBACgCnAogAUH//wNxQQN0aigCAEEERg0EDAoLQScQIQwJC0EiECEMCAsCQAJAIAEvAQQiAUEqRg0AIAFBL0cNARAeDAoLQQEQHwwJCwJAAkACQAJAQQAoApQKIgEvAQAiAxAiRQ0AAkACQCADQVVqDgQACQEDCQsgAUF+ai8BAEErRg0DDAgLIAFBfmovAQBBLUYNAgwHCyADQSlHDQFBACgCnApBAC8BkgoiAkEDdGooAgQQI0UNAgwGCyABQX5qLwEAQVBqQf//A3FBCk8NBQtBAC8BkgohAgsCQAJAIAJB//8DcSICRQ0AIANB5gBHDQBBACgCnAogAkF/akEDdGoiBCgCAEEBRw0AIAFBfmovAQBB7wBHDQEgAUF8ahAkRQ0BIAQoAgRBlghBAxAlRQ0BDAULIANB/QBHDQBBACgCnAogAkEDdGoiAigCBBAmDQQgAigCAEEGRg0ECyABECcNAyADRQ0DIANBL0ZBAC0AmApBAEdxDQMCQEEAKALsCSICRQ0AIAEgAigCAEkNACABIAIoAgRNDQQLIAFBfmohAUEAKALQCSECAkADQCABQQJqIgQgAk0NAUEAIAE2ApQKIAEvAQAhAyABQX5qIgQhASADEChFDQALIARBAmohBAsCQCADQf//A3EQKUUNACAEQX5qIQECQANAIAFBAmoiAyACTQ0BQQAgATYClAogAS8BACEDIAFBfmoiBCEBIAMQKQ0ACyAEQQJqIQMLIAMQKg0EC0EAQQE6AJgKDAcLQQAoApwKQQAvAZIKIgFBA3QiA2pBACgClAo2AgRBACABQQFqOwGSCkEAKAKcCiADakEDNgIACxArDAULQQAtAPAJQQAvAZAKQQAvAZIKcnJFIQIMBwsQLEEAQQA6AJgKDAMLEC1BACECDAULIANBoAFHDQELQQBBAToApAoLQQBBACgCqAo2ApQKC0EAKAKoCiEBDAALCyAAQYDQAGokACACCxoAAkBBACgC0AkgAEcNAEEBDwsgAEF+ahAuC/4KAQZ/QQBBACgCqAoiAEEMaiIBNgKoCkEAKALsCSECQQEQICEDAkACQAJAAkACQAJAAkACQAJAQQAoAqgKIgQgAUcNACADEC9FDQELAkACQAJAAkACQAJAAkAgA0EqRg0AIANB+wBHDQFBACAEQQJqNgKoCkEBECAhA0EAKAKoCiEEA0ACQAJAIANB//8DcSIDQSJGDQAgA0EnRg0AIAMQMxpBACgCqAohAwwBCyADECFBAEEAKAKoCkECaiIDNgKoCgtBARAgGgJAIAQgAxA0IgNBLEcNAEEAQQAoAqgKQQJqNgKoCkEBECAhAwsgA0H9AEYNA0EAKAKoCiIFIARGDQ8gBSEEIAVBACgCrApNDQAMDwsLQQAgBEECajYCqApBARAgGkEAKAKoCiIDIAMQNBoMAgtBAEEAOgCICgJAAkACQAJAAkACQCADQZ9/ag4MAgsEAQsDCwsLCwsFAAsgA0H2AEYNBAwKC0EAIARBDmoiAzYCqAoCQAJAAkBBARAgQZ9/ag4GABICEhIBEgtBACgCqAoiBSkAAkLzgOSD4I3AMVINESAFLwEKEClFDRFBACAFQQpqNgKoCkEAECAaC0EAKAKoCiIFQQJqQbIIQQ4QNg0QIAUvARAiAkF3aiIBQRdLDQ1BASABdEGfgIAEcUUNDQwOC0EAKAKoCiIFKQACQuyAhIOwjsA5Ug0PIAUvAQoiAkF3aiIBQRdNDQYMCgtBACAEQQpqNgKoCkEAECAaQQAoAqgKIQQLQQAgBEEQajYCqAoCQEEBECAiBEEqRw0AQQBBACgCqApBAmo2AqgKQQEQICEEC0EAKAKoCiEDIAQQMxogA0EAKAKoCiIEIAMgBBACQQBBACgCqApBfmo2AqgKDwsCQCAEKQACQuyAhIOwjsA5Ug0AIAQvAQoQKEUNAEEAIARBCmo2AqgKQQEQICEEQQAoAqgKIQMgBBAzGiADQQAoAqgKIgQgAyAEEAJBAEEAKAKoCkF+ajYCqAoPC0EAIARBBGoiBDYCqAoLQQAgBEEGajYCqApBAEEAOgCICkEBECAhBEEAKAKoCiEDIAQQMyEEQQAoAqgKIQIgBEHf/wNxIgFB2wBHDQNBACACQQJqNgKoCkEBECAhBUEAKAKoCiEDQQAhBAwEC0EAQQE6AIAKQQBBACgCqApBAmo2AqgKC0EBECAhBEEAKAKoCiEDAkAgBEHmAEcNACADQQJqQawIQQYQNg0AQQAgA0EIajYCqAogAEEBECBBABAyIAJBEGpB2AkgAhshAwNAIAMoAgAiA0UNBSADQgA3AgggA0EQaiEDDAALC0EAIANBfmo2AqgKDAMLQQEgAXRBn4CABHFFDQMMBAtBASEECwNAAkACQCAEDgIAAQELIAVB//8DcRAzGkEBIQQMAQsCQAJAQQAoAqgKIgQgA0YNACADIAQgAyAEEAJBARAgIQQCQCABQdsARw0AIARBIHJB/QBGDQQLQQAoAqgKIQMCQCAEQSxHDQBBACADQQJqNgKoCkEBECAhBUEAKAKoCiEDIAVBIHJB+wBHDQILQQAgA0F+ajYCqAoLIAFB2wBHDQJBACACQX5qNgKoCg8LQQAhBAwACwsPCyACQaABRg0AIAJB+wBHDQQLQQAgBUEKajYCqApBARAgIgVB+wBGDQMMAgsCQCACQVhqDgMBAwEACyACQaABRw0CC0EAIAVBEGo2AqgKAkBBARAgIgVBKkcNAEEAQQAoAqgKQQJqNgKoCkEBECAhBQsgBUEoRg0BC0EAKAKoCiEBIAUQMxpBACgCqAoiBSABTQ0AIAQgAyABIAUQAkEAQQAoAqgKQX5qNgKoCg8LIAQgA0EAQQAQAkEAIARBDGo2AqgKDwsQLQuFDAEKf0EAQQAoAqgKIgBBDGoiATYCqApBARAgIQJBACgCqAohAwJAAkACQAJAAkACQAJAAkAgAkEuRw0AQQAgA0ECajYCqAoCQEEBECAiAkHkAEYNAAJAIAJB8wBGDQAgAkHtAEcNB0EAKAKoCiICQQJqQZwIQQYQNg0HAkBBACgClAoiAxAxDQAgAy8BAEEuRg0ICyAAIAAgAkEIakEAKALICRABDwtBACgCqAoiAkECakGiCEEKEDYNBgJAQQAoApQKIgMQMQ0AIAMvAQBBLkYNBwtBACEEQQAgAkEMajYCqApBASEFQQUhBkEBECAhAkEAIQdBASEIDAILQQAoAqgKIgIpAAJC5YCYg9CMgDlSDQUCQEEAKAKUCiIDEDENACADLwEAQS5GDQYLQQAhBEEAIAJBCmo2AqgKQQIhCEEHIQZBASEHQQEQICECQQEhBQwBCwJAAkACQAJAIAJB8wBHDQAgAyABTQ0AIANBAmpBoghBChA2DQACQCADLwEMIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAgsgBEGgAUYNAQtBACEHQQchBkEBIQQgAkHkAEYNAQwCC0EAIQRBACADQQxqIgI2AqgKQQEhBUEBECAhCQJAQQAoAqgKIgYgAkYNAEHmACECAkAgCUHmAEYNAEEFIQZBACEHQQEhCCAJIQIMBAtBACEHQQEhCCAGQQJqQawIQQYQNg0EIAYvAQgQKEUNBAtBACEHQQAgAzYCqApBByEGQQEhBEEAIQVBACEIIAkhAgwCCyADIABBCmpNDQBBACEIQeQAIQICQCADKQACQuWAmIPQjIA5Ug0AAkACQCADLwEKIgRBd2oiB0EXSw0AQQEgB3RBn4CABHENAQtBACEIIARBoAFHDQELQQAhBUEAIANBCmo2AqgKQSohAkEBIQdBAiEIQQEQICIJQSpGDQRBACADNgKoCkEBIQRBACEHQQAhCCAJIQIMAgsgAyEGQQAhBwwCC0EAIQVBACEICwJAIAJBKEcNAEEAKAKcCkEALwGSCiICQQN0aiIDQQAoAqgKNgIEQQAgAkEBajsBkgogA0EFNgIAQQAoApQKLwEAQS5GDQRBAEEAKAKoCiIDQQJqNgKoCkEBECAhAiAAQQAoAqgKQQAgAxABAkACQCAFDQBBACgC5AkhAQwBC0EAKALkCSIBIAY2AhwLQQBBAC8BkAoiA0EBajsBkApBACgCoAogA0ECdGogATYCAAJAIAJBIkYNACACQSdGDQBBAEEAKAKoCkF+ajYCqAoPCyACECFBAEEAKAKoCkECaiICNgKoCgJAAkACQEEBECBBV2oOBAECAgACC0EAQQAoAqgKQQJqNgKoCkEBECAaQQAoAuQJIgMgAjYCBCADQQE6ABggA0EAKAKoCiICNgIQQQAgAkF+ajYCqAoPC0EAKALkCSIDIAI2AgQgA0EBOgAYQQBBAC8BkgpBf2o7AZIKIANBACgCqApBAmo2AgxBAEEALwGQCkF/ajsBkAoPC0EAQQAoAqgKQX5qNgKoCg8LAkAgBEEBcyACQfsAR3INAEEAKAKoCiECQQAvAZIKDQUDQAJAAkACQCACQQAoAqwKTw0AQQEQICICQSJGDQEgAkEnRg0BIAJB/QBHDQJBAEEAKAKoCkECajYCqAoLQQEQICEDQQAoAqgKIQICQCADQeYARw0AIAJBAmpBrAhBBhA2DQcLQQAgAkEIajYCqAoCQEEBECAiAkEiRg0AIAJBJ0cNBwsgACACQQAQMg8LIAIQIQtBAEEAKAKoCkECaiICNgKoCgwACwsCQAJAIAJBWWoOBAMBAQMACyACQSJGDQILQQAoAqgKIQYLIAYgAUcNAEEAIABBCmo2AqgKDwsgAkEqRyAHcQ0DQQAvAZIKQf//A3ENA0EAKAKoCiECQQAoAqwKIQEDQCACIAFPDQECQAJAIAIvAQAiA0EnRg0AIANBIkcNAQsgACADIAgQMg8LQQAgAkECaiICNgKoCgwACwsQLQsPC0EAIAJBfmo2AqgKDwtBAEEAKAKoCkF+ajYCqAoLRwEDf0EAKAKoCkECaiEAQQAoAqwKIQECQANAIAAiAkF+aiABTw0BIAJBAmohACACLwEAQXZqDgQBAAABAAsLQQAgAjYCqAoLmAEBA39BAEEAKAKoCiIBQQJqNgKoCiABQQZqIQFBACgCrAohAgNAAkACQAJAIAFBfGogAk8NACABQX5qLwEAIQMCQAJAIAANACADQSpGDQEgA0F2ag4EAgQEAgQLIANBKkcNAwsgAS8BAEEvRw0CQQAgAUF+ajYCqAoMAQsgAUF+aiEBC0EAIAE2AqgKDwsgAUECaiEBDAALC5wBAQN/QQAoAqgKIQECQANAAkACQCABLwEAIgJBL0cNAAJAIAEvAQIiAUEqRg0AIAFBL0cNBBAeDAILIAAQHwwBCwJAAkAgAEUNACACQXdqIgFBF0sNAUEBIAF0QZ+AgARxRQ0BDAILIAIQKUUNAwwBCyACQaABRw0CC0EAQQAoAqgKIgNBAmoiATYCqAogA0EAKAKsCkkNAAsLIAILiAEBBH9BACgCqAohAUEAKAKsCiECAkACQANAIAEiA0ECaiEBIAMgAk8NASABLwEAIgQgAEYNAgJAIARB3ABGDQAgBEF2ag4EAgEBAgELIANBBGohASADLwEEQQ1HDQAgA0EGaiABIAMvAQZBCkYbIQEMAAsLQQAgATYCqAoQLQ8LQQAgATYCqAoLbAEBfwJAAkAgAEFfaiIBQQVLDQBBASABdEExcQ0BCyAAQUZqQf//A3FBBkkNACAAQSlHIABBWGpB//8DcUEHSXENAAJAIABBpX9qDgQBAAABAAsgAEH9AEcgAEGFf2pB//8DcUEESXEPC0EBCy4BAX9BASEBAkAgAEGcCUEFECUNACAAQZYIQQMQJQ0AIABBpglBAhAlIQELIAELygEBAn8CQAJAIAAvAQAiAUF3akEFSQ0AIAFBIEYNACABQSlGDQAgAUHdAEYNACABQaABRg0AQQAhAiABQf0ARw0BC0EAKALQCSECAkACQANAIAAvAQAhASAAIAJNDQECQCABQXdqQQVJDQAgAUEgRg0AIAFBoAFGDQACQCABQSlGDQAgAUHdAEYNACABQf0ARw0EC0EBDwsgAEF+aiEADAALC0EBIQIgAUEpRg0BIAFB3QBGDQEgAUH9AEYNAQsgARAvQQFzIQILIAILRgEDf0EAIQMCQCAAIAJBAXQiAmsiBEECaiIAQQAoAtAJIgVJDQAgACABIAIQNg0AAkAgACAFRw0AQQEPCyAEEC4hAwsgAwuDAQECf0EBIQECQAJAAkACQAJAAkAgAC8BACICQUVqDgQFBAQBAAsCQCACQZt/ag4EAwQEAgALIAJBKUYNBCACQfkARw0DIABBfmpBsglBBhAlDwsgAEF+ai8BAEE9Rg8LIABBfmpBqglBBBAlDwsgAEF+akG+CUEDECUPC0EAIQELIAELtAMBAn9BACEBAkACQAJAAkACQAJAAkACQAJAAkAgAC8BAEGcf2oOFAABAgkJCQkDCQkEBQkJBgkHCQkICQsCQAJAIABBfmovAQBBl39qDgQACgoBCgsgAEF8akHACEECECUPCyAAQXxqQcQIQQMQJQ8LAkACQAJAIABBfmovAQBBjX9qDgMAAQIKCwJAIABBfGovAQAiAkHhAEYNACACQewARw0KIABBempB5QAQMA8LIABBempB4wAQMA8LIABBfGpByghBBBAlDwsgAEF8akHSCEEGECUPCyAAQX5qLwEAQe8ARw0GIABBfGovAQBB5QBHDQYCQCAAQXpqLwEAIgJB8ABGDQAgAkHjAEcNByAAQXhqQd4IQQYQJQ8LIABBeGpB6ghBAhAlDwsgAEF+akHuCEEEECUPC0EBIQEgAEF+aiIAQekAEDANBCAAQfYIQQUQJQ8LIABBfmpB5AAQMA8LIABBfmpBgAlBBxAlDwsgAEF+akGOCUEEECUPCwJAIABBfmovAQAiAkHvAEYNACACQeUARw0BIABBfGpB7gAQMA8LIABBfGpBlglBAxAlIQELIAELNAEBf0EBIQECQCAAQXdqQf//A3FBBUkNACAAQYABckGgAUYNACAAQS5HIAAQL3EhAQsgAQswAQF/AkACQCAAQXdqIgFBF0sNAEEBIAF0QY2AgARxDQELIABBoAFGDQBBAA8LQQELTgECf0EAIQECQAJAIAAvAQAiAkHlAEYNACACQesARw0BIABBfmpB7ghBBBAlDwsgAEF+ai8BAEH1AEcNACAAQXxqQdIIQQYQJSEBCyABC94BAQR/QQAoAqgKIQBBACgCrAohAQJAAkACQANAIAAiAkECaiEAIAIgAU8NAQJAAkACQCAALwEAIgNBpH9qDgUCAwMDAQALIANBJEcNAiACLwEEQfsARw0CQQAgAkEEaiIANgKoCkEAQQAvAZIKIgJBAWo7AZIKQQAoApwKIAJBA3RqIgJBBDYCACACIAA2AgQPC0EAIAA2AqgKQQBBAC8BkgpBf2oiADsBkgpBACgCnAogAEH//wNxQQN0aigCAEEDRw0DDAQLIAJBBGohAAwACwtBACAANgKoCgsQLQsLcAECfwJAAkADQEEAQQAoAqgKIgBBAmoiATYCqAogAEEAKAKsCk8NAQJAAkACQCABLwEAIgFBpX9qDgIBAgALAkAgAUF2ag4EBAMDBAALIAFBL0cNAgwECxA1GgwBC0EAIABBBGo2AqgKDAALCxAtCws1AQF/QQBBAToA8AlBACgCqAohAEEAQQAoAqwKQQJqNgKoCkEAIABBACgC0AlrQQF1NgKECgtDAQJ/QQEhAQJAIAAvAQAiAkF3akH//wNxQQVJDQAgAkGAAXJBoAFGDQBBACEBIAIQL0UNACACQS5HIAAQMXIPCyABC2gBAn9BASEBAkACQCAAQV9qIgJBBUsNAEEBIAJ0QTFxDQELIABB+P8DcUEoRg0AIABBRmpB//8DcUEGSQ0AAkAgAEGlf2oiAkEDSw0AIAJBAUcNAQsgAEGFf2pB//8DcUEESSEBCyABCz0BAn9BACECAkBBACgC0AkiAyAASw0AIAAvAQAgAUcNAAJAIAMgAEcNAEEBDwsgAEF+ai8BABAoIQILIAILMQEBf0EAIQECQCAALwEAQS5HDQAgAEF+ai8BAEEuRw0AIABBfGovAQBBLkYhAQsgAQvbBAEFfwJAIAFBIkYNACABQSdGDQAQLQ8LQQAoAqgKIQMgARAhIAAgA0ECakEAKAKoCkEAKALECRABAkAgAkEBSA0AQQAoAuQJQQRBBiACQQFGGzYCHAtBAEEAKAKoCkECajYCqApBABAgIQJBACgCqAohAQJAAkAgAkH3AEcNACABLwECQekARw0AIAEvAQRB9ABHDQAgAS8BBkHoAEYNAQtBACABQX5qNgKoCg8LQQAgAUEIajYCqAoCQEEBECBB+wBGDQBBACABNgKoCg8LQQAoAqgKIgQhA0EAIQADQEEAIANBAmo2AqgKAkACQAJAAkBBARAgIgJBJ0cNAEEAKAKoCiEFQScQIUEAKAKoCkECaiEDDAELQQAoAqgKIQUgAkEiRw0BQSIQIUEAKAKoCkECaiEDC0EAIAM2AqgKQQEQICECDAELIAIQMyECQQAoAqgKIQMLAkAgAkE6Rg0AQQAgATYCqAoPC0EAQQAoAqgKQQJqNgKoCgJAQQEQICICQSJGDQAgAkEnRg0AQQAgATYCqAoPC0EAKAKoCiEGIAIQIUEAQQAoAvwJIgJBFGo2AvwJQQAoAqgKIQcgAiAFNgIAIAJBADYCECACIAY2AgggAiADNgIEIAIgB0ECajYCDEEAQQAoAqgKQQJqNgKoCiAAQRBqQQAoAuQJQSBqIAAbIAI2AgACQAJAQQEQICIAQSxGDQAgAEH9AEYNAUEAIAE2AqgKDwtBAEEAKAKoCkECaiIDNgKoCiACIQAMAQsLQQAoAuQJIgEgBDYCECABQQAoAqgKQQJqNgIMC20BAn8CQAJAA0ACQCAAQf//A3EiAUF3aiICQRdLDQBBASACdEGfgIAEcQ0CCyABQaABRg0BIAAhAiABEC8NAkEAIQJBAEEAKAKoCiIAQQJqNgKoCiAALwECIgANAAwCCwsgACECCyACQf//A3ELqwEBBH8CQAJAQQAoAqgKIgIvAQAiA0HhAEYNACABIQQgACEFDAELQQAgAkEEajYCqApBARAgIQJBACgCqAohBQJAAkAgAkEiRg0AIAJBJ0YNACACEDMaQQAoAqgKIQQMAQsgAhAhQQBBACgCqApBAmoiBDYCqAoLQQEQICEDQQAoAqgKIQILAkAgAiAFRg0AIAUgBEEAIAAgACABRiICG0EAIAEgAhsQAgsgAwtyAQR/QQAoAqgKIQBBACgCrAohAQJAAkADQCAAQQJqIQIgACABTw0BAkACQCACLwEAIgNBpH9qDgIBBAALIAIhACADQXZqDgQCAQECAQsgAEEEaiEADAALC0EAIAI2AqgKEC1BAA8LQQAgAjYCqApB3QALSQEDf0EAIQMCQCACRQ0AAkADQCAALQAAIgQgAS0AACIFRw0BIAFBAWohASAAQQFqIQAgAkF/aiICDQAMAgsLIAQgBWshAwsgAwsL4gECAEGACAvEAQAAeABwAG8AcgB0AG0AcABvAHIAdABmAG8AcgBlAHQAYQBvAHUAcgBjAGUAcgBvAG0AdQBuAGMAdABpAG8AbgB2AG8AeQBpAGUAZABlAGwAZQBjAG8AbgB0AGkAbgBpAG4AcwB0AGEAbgB0AHkAYgByAGUAYQByAGUAdAB1AHIAZABlAGIAdQBnAGcAZQBhAHcAYQBpAHQAaAByAHcAaABpAGwAZQBpAGYAYwBhAHQAYwBmAGkAbgBhAGwAbABlAGwAcwAAQcQJCxABAAAAAgAAAAAEAAAwOQAA", "undefined" != typeof Buffer ? Buffer.from(A5, "base64") : Uint8Array.from(atob(A5), (A6) => A6.charCodeAt(0));
      var A5;
    };
    WebAssembly.compile(E$1()).then(WebAssembly.instantiate).then(({ exports: A5 }) => {
    });
    $ZodAsyncError = class extends Error {
      constructor() {
        super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
      }
    };
    $ZodEncodeError = class extends Error {
      constructor(name) {
        super(`Encountered unidirectional transform during encode: ${name}`);
        this.name = "ZodEncodeError";
      }
    };
    (_a$1 = globalThis).__zod_globalConfig ?? (_a$1.__zod_globalConfig = {});
    globalConfig = globalThis.__zod_globalConfig;
    EVALUATING = /* @__PURE__ */ Symbol("evaluating");
    captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
    };
    propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
    initializer$1 = (inst, def) => {
      inst.name = "$ZodError";
      Object.defineProperty(inst, "_zod", {
        value: inst._zod,
        enumerable: false
      });
      Object.defineProperty(inst, "issues", {
        value: def,
        enumerable: false
      });
      inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
      Object.defineProperty(inst, "toString", {
        value: () => inst.message,
        enumerable: false
      });
    };
    $ZodError = $constructor("$ZodError", initializer$1);
    $ZodRealError = $constructor("$ZodError", initializer$1, { Parent: Error });
    _parse = (_Err) => (schema, value, _ctx, _params) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
        throw new $ZodAsyncError();
      }
      if (result.issues.length) {
        const e4 = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e4, _params?.callee);
        throw e4;
      }
      return result.value;
    };
    _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
      const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
        result = await result;
      if (result.issues.length) {
        const e4 = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
        captureStackTrace(e4, params?.callee);
        throw e4;
      }
      return result.value;
    };
    _safeParse = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
      const result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise) {
        throw new $ZodAsyncError();
      }
      return result.issues.length ? {
        success: false,
        error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
      } : { success: true, data: result.value };
    };
    safeParse$1 = /* @__PURE__ */ _safeParse($ZodRealError);
    _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
      let result = schema._zod.run({ value, issues: [] }, ctx);
      if (result instanceof Promise)
        result = await result;
      return result.issues.length ? {
        success: false,
        error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
      } : { success: true, data: result.value };
    };
    safeParseAsync$1 = /* @__PURE__ */ _safeParseAsync($ZodRealError);
    _encode = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return _parse(_Err)(schema, value, ctx);
    };
    _decode = (_Err) => (schema, value, _ctx) => {
      return _parse(_Err)(schema, value, _ctx);
    };
    _encodeAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return _parseAsync(_Err)(schema, value, ctx);
    };
    _decodeAsync = (_Err) => async (schema, value, _ctx) => {
      return _parseAsync(_Err)(schema, value, _ctx);
    };
    _safeEncode = (_Err) => (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return _safeParse(_Err)(schema, value, ctx);
    };
    _safeDecode = (_Err) => (schema, value, _ctx) => {
      return _safeParse(_Err)(schema, value, _ctx);
    };
    _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
      const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
      return _safeParseAsync(_Err)(schema, value, ctx);
    };
    _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
      return _safeParseAsync(_Err)(schema, value, _ctx);
    };
    $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
      var _a7;
      inst._zod ?? (inst._zod = {});
      inst._zod.def = def;
      (_a7 = inst._zod).onattach ?? (_a7.onattach = []);
    });
    $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
      var _a7;
      $ZodCheck.init(inst, def);
      (_a7 = inst._zod.def).when ?? (_a7.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
        if (def.maximum < curr)
          inst2._zod.bag.maximum = def.maximum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length <= def.maximum)
          return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_big",
          maximum: def.maximum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
      var _a7;
      $ZodCheck.init(inst, def);
      (_a7 = inst._zod.def).when ?? (_a7.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
        if (def.minimum > curr)
          inst2._zod.bag.minimum = def.minimum;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length >= def.minimum)
          return;
        const origin = getLengthableOrigin(input);
        payload.issues.push({
          origin,
          code: "too_small",
          minimum: def.minimum,
          inclusive: true,
          input,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
      var _a7;
      $ZodCheck.init(inst, def);
      (_a7 = inst._zod.def).when ?? (_a7.when = (payload) => {
        const val = payload.value;
        return !nullish(val) && val.length !== void 0;
      });
      inst._zod.onattach.push((inst2) => {
        const bag = inst2._zod.bag;
        bag.minimum = def.length;
        bag.maximum = def.length;
        bag.length = def.length;
      });
      inst._zod.check = (payload) => {
        const input = payload.value;
        const length = input.length;
        if (length === def.length)
          return;
        const origin = getLengthableOrigin(input);
        const tooBig = length > def.length;
        payload.issues.push({
          origin,
          ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
          inclusive: true,
          exact: true,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      };
    });
    $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
      $ZodCheck.init(inst, def);
      inst._zod.check = (payload) => {
        payload.value = def.tx(payload.value);
      };
    });
    version = {
      major: 4,
      minor: 4,
      patch: 3
    };
    $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
      var _a7;
      inst ?? (inst = {});
      inst._zod.def = def;
      inst._zod.bag = inst._zod.bag || {};
      inst._zod.version = version;
      const checks = [...inst._zod.def.checks ?? []];
      if (inst._zod.traits.has("$ZodCheck")) {
        checks.unshift(inst);
      }
      for (const ch of checks) {
        for (const fn of ch._zod.onattach) {
          fn(inst);
        }
      }
      if (checks.length === 0) {
        (_a7 = inst._zod).deferred ?? (_a7.deferred = []);
        inst._zod.deferred?.push(() => {
          inst._zod.run = inst._zod.parse;
        });
      } else {
        const runChecks = (payload, checks2, ctx) => {
          let isAborted = aborted(payload);
          let asyncResult;
          for (const ch of checks2) {
            if (ch._zod.def.when) {
              if (explicitlyAborted(payload))
                continue;
              const shouldRun = ch._zod.def.when(payload);
              if (!shouldRun)
                continue;
            } else if (isAborted) {
              continue;
            }
            const currLen = payload.issues.length;
            const _4 = ch._zod.check(payload);
            if (_4 instanceof Promise && ctx?.async === false) {
              throw new $ZodAsyncError();
            }
            if (asyncResult || _4 instanceof Promise) {
              asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
                await _4;
                const nextLen = payload.issues.length;
                if (nextLen === currLen)
                  return;
                if (!isAborted)
                  isAborted = aborted(payload, currLen);
              });
            } else {
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                continue;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            }
          }
          if (asyncResult) {
            return asyncResult.then(() => {
              return payload;
            });
          }
          return payload;
        };
        const handleCanaryResult = (canary, payload, ctx) => {
          if (aborted(canary)) {
            canary.aborted = true;
            return canary;
          }
          const checkResult = runChecks(payload, checks, ctx);
          if (checkResult instanceof Promise) {
            if (ctx.async === false)
              throw new $ZodAsyncError();
            return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
          }
          return inst._zod.parse(checkResult, ctx);
        };
        inst._zod.run = (payload, ctx) => {
          if (ctx.skipChecks) {
            return inst._zod.parse(payload, ctx);
          }
          if (ctx.direction === "backward") {
            const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
            if (canary instanceof Promise) {
              return canary.then((canary2) => {
                return handleCanaryResult(canary2, payload, ctx);
              });
            }
            return handleCanaryResult(canary, payload, ctx);
          }
          const result = inst._zod.parse(payload, ctx);
          if (result instanceof Promise) {
            if (ctx.async === false)
              throw new $ZodAsyncError();
            return result.then((result2) => runChecks(result2, checks, ctx));
          }
          return runChecks(result, checks, ctx);
        };
      }
      defineLazy(inst, "~standard", () => ({
        validate: (value) => {
          try {
            const r4 = safeParse$1(inst, value);
            return r4.success ? { value: r4.data } : { issues: r4.error?.issues };
          } catch (_4) {
            return safeParseAsync$1(inst, value).then((r4) => r4.success ? { value: r4.data } : { issues: r4.error?.issues });
          }
        },
        vendor: "zod",
        version: 1
      }));
    });
    $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        if (!Array.isArray(input)) {
          payload.issues.push({
            expected: "array",
            code: "invalid_type",
            input,
            inst
          });
          return payload;
        }
        payload.value = Array(input.length);
        const proms = [];
        for (let i5 = 0; i5 < input.length; i5++) {
          const item = input[i5];
          const result = def.element._zod.run({
            value: item,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => handleArrayResult(result2, payload, i5)));
          } else {
            handleArrayResult(result, payload, i5);
          }
        }
        if (proms.length) {
          return Promise.all(proms).then(() => payload);
        }
        return payload;
      };
    });
    $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "optin", () => def.options.some((o4) => o4._zod.optin === "optional") ? "optional" : void 0);
      defineLazy(inst._zod, "optout", () => def.options.some((o4) => o4._zod.optout === "optional") ? "optional" : void 0);
      defineLazy(inst._zod, "values", () => {
        if (def.options.every((o4) => o4._zod.values)) {
          return new Set(def.options.flatMap((option) => Array.from(option._zod.values)));
        }
        return void 0;
      });
      defineLazy(inst._zod, "pattern", () => {
        if (def.options.every((o4) => o4._zod.pattern)) {
          const patterns = def.options.map((o4) => o4._zod.pattern);
          return new RegExp(`^(${patterns.map((p4) => cleanRegex(p4.source)).join("|")})$`);
        }
        return void 0;
      });
      const first = def.options.length === 1 ? def.options[0]._zod.run : null;
      inst._zod.parse = (payload, ctx) => {
        if (first) {
          return first(payload, ctx);
        }
        let async = false;
        const results = [];
        for (const option of def.options) {
          const result = option._zod.run({
            value: payload.value,
            issues: []
          }, ctx);
          if (result instanceof Promise) {
            results.push(result);
            async = true;
          } else {
            if (result.issues.length === 0)
              return result;
            results.push(result);
          }
        }
        if (!async)
          return handleUnionResults(results, payload, inst, ctx);
        return Promise.all(results).then((results2) => {
          return handleUnionResults(results2, payload, inst, ctx);
        });
      };
    });
    $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, ctx) => {
        const input = payload.value;
        const left = def.left._zod.run({ value: input, issues: [] }, ctx);
        const right = def.right._zod.run({ value: input, issues: [] }, ctx);
        const async = left instanceof Promise || right instanceof Promise;
        if (async) {
          return Promise.all([left, right]).then(([left2, right2]) => {
            return handleIntersectionResults(payload, left2, right2);
          });
        }
        return handleIntersectionResults(payload, left, right);
      };
    });
    $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
      $ZodType.init(inst, def);
      const values = getEnumValues(def.entries);
      const valuesSet = new Set(values);
      inst._zod.values = valuesSet;
      inst._zod.pattern = new RegExp(`^(${values.filter((k4) => propertyKeyTypes.has(typeof k4)).map((o4) => typeof o4 === "string" ? escapeRegex(o4) : o4.toString()).join("|")})$`);
      inst._zod.parse = (payload, _ctx) => {
        const input = payload.value;
        if (valuesSet.has(input)) {
          return payload;
        }
        payload.issues.push({
          code: "invalid_value",
          values,
          input,
          inst
        });
        return payload;
      };
    });
    $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          throw new $ZodEncodeError(inst.constructor.name);
        }
        const _out = def.transform(payload.value, payload);
        if (ctx.async) {
          const output = _out instanceof Promise ? _out : Promise.resolve(_out);
          return output.then((output2) => {
            payload.value = output2;
            payload.fallback = true;
            return payload;
          });
        }
        if (_out instanceof Promise) {
          throw new $ZodAsyncError();
        }
        payload.value = _out;
        payload.fallback = true;
        return payload;
      };
    });
    $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      inst._zod.optout = "optional";
      defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, void 0]) : void 0;
      });
      defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)})?$`) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (def.innerType._zod.optin === "optional") {
          const input = payload.value;
          const result = def.innerType._zod.run(payload, ctx);
          if (result instanceof Promise)
            return result.then((r4) => handleOptionalResult(r4, input));
          return handleOptionalResult(result, input);
        }
        if (payload.value === void 0) {
          return payload;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
      $ZodOptional.init(inst, def);
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      defineLazy(inst._zod, "pattern", () => def.innerType._zod.pattern);
      inst._zod.parse = (payload, ctx) => {
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "optin", () => def.innerType._zod.optin);
      defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      defineLazy(inst._zod, "pattern", () => {
        const pattern = def.innerType._zod.pattern;
        return pattern ? new RegExp(`^(${cleanRegex(pattern.source)}|null)$`) : void 0;
      });
      defineLazy(inst._zod, "values", () => {
        return def.innerType._zod.values ? /* @__PURE__ */ new Set([...def.innerType._zod.values, null]) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        if (payload.value === null)
          return payload;
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
          return payload;
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => handleDefaultResult(result2, def));
        }
        return handleDefaultResult(result, def);
      };
    });
    $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        if (payload.value === void 0) {
          payload.value = def.defaultValue;
        }
        return def.innerType._zod.run(payload, ctx);
      };
    });
    $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "values", () => {
        const v4 = def.innerType._zod.values;
        return v4 ? new Set([...v4].filter((x4) => x4 !== void 0)) : void 0;
      });
      inst._zod.parse = (payload, ctx) => {
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => handleNonOptionalResult(result2, inst));
        }
        return handleNonOptionalResult(result, inst);
      };
    });
    $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
      $ZodType.init(inst, def);
      inst._zod.optin = "optional";
      defineLazy(inst._zod, "optout", () => def.innerType._zod.optout);
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then((result2) => {
            payload.value = result2.value;
            if (result2.issues.length) {
              payload.value = def.catchValue({
                ...payload,
                error: {
                  issues: result2.issues.map((iss) => finalizeIssue(iss, ctx, config()))
                },
                input: payload.value
              });
              payload.issues = [];
              payload.fallback = true;
            }
            return payload;
          });
        }
        payload.value = result.value;
        if (result.issues.length) {
          payload.value = def.catchValue({
            ...payload,
            error: {
              issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
            },
            input: payload.value
          });
          payload.issues = [];
          payload.fallback = true;
        }
        return payload;
      };
    });
    $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "values", () => def.in._zod.values);
      defineLazy(inst._zod, "optin", () => def.in._zod.optin);
      defineLazy(inst._zod, "optout", () => def.out._zod.optout);
      defineLazy(inst._zod, "propValues", () => def.in._zod.propValues);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          const right = def.out._zod.run(payload, ctx);
          if (right instanceof Promise) {
            return right.then((right2) => handlePipeResult(right2, def.in, ctx));
          }
          return handlePipeResult(right, def.in, ctx);
        }
        const left = def.in._zod.run(payload, ctx);
        if (left instanceof Promise) {
          return left.then((left2) => handlePipeResult(left2, def.out, ctx));
        }
        return handlePipeResult(left, def.out, ctx);
      };
    });
    $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
      $ZodType.init(inst, def);
      defineLazy(inst._zod, "propValues", () => def.innerType._zod.propValues);
      defineLazy(inst._zod, "values", () => def.innerType._zod.values);
      defineLazy(inst._zod, "optin", () => def.innerType?._zod?.optin);
      defineLazy(inst._zod, "optout", () => def.innerType?._zod?.optout);
      inst._zod.parse = (payload, ctx) => {
        if (ctx.direction === "backward") {
          return def.innerType._zod.run(payload, ctx);
        }
        const result = def.innerType._zod.run(payload, ctx);
        if (result instanceof Promise) {
          return result.then(handleReadonlyResult);
        }
        return handleReadonlyResult(result);
      };
    });
    $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
      $ZodCheck.init(inst, def);
      $ZodType.init(inst, def);
      inst._zod.parse = (payload, _4) => {
        return payload;
      };
      inst._zod.check = (payload) => {
        const input = payload.value;
        const r4 = def.fn(input);
        if (r4 instanceof Promise) {
          return r4.then((r5) => handleRefineResult(r5, payload, input, inst));
        }
        handleRefineResult(r4, payload, input, inst);
        return;
      };
    });
    $ZodRegistry = class {
      constructor() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
      }
      add(schema, ..._meta) {
        const meta = _meta[0];
        this._map.set(schema, meta);
        if (meta && typeof meta === "object" && "id" in meta) {
          this._idmap.set(meta.id, schema);
        }
        return this;
      }
      clear() {
        this._map = /* @__PURE__ */ new WeakMap();
        this._idmap = /* @__PURE__ */ new Map();
        return this;
      }
      remove(schema) {
        const meta = this._map.get(schema);
        if (meta && typeof meta === "object" && "id" in meta) {
          this._idmap.delete(meta.id);
        }
        this._map.delete(schema);
        return this;
      }
      get(schema) {
        const p4 = schema._zod.parent;
        if (p4) {
          const pm = { ...this.get(p4) ?? {} };
          delete pm.id;
          const f5 = { ...pm, ...this._map.get(schema) };
          return Object.keys(f5).length ? f5 : void 0;
        }
        return this._map.get(schema);
      }
      has(schema) {
        return this._map.has(schema);
      }
    };
    (_a6 = globalThis).__zod_globalRegistry ?? (_a6.__zod_globalRegistry = registry());
    globalRegistry = globalThis.__zod_globalRegistry;
    createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
      const ctx = initializeContext({ ...params, processors });
      process$1(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
      const { libraryOptions, target } = params ?? {};
      const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
      process$1(schema, ctx);
      extractDefs(ctx, schema);
      return finalize(ctx, schema);
    };
    enumProcessor = (schema, _ctx, json, _params) => {
      const def = schema._zod.def;
      const values = getEnumValues(def.entries);
      if (values.every((v4) => typeof v4 === "number"))
        json.type = "number";
      if (values.every((v4) => typeof v4 === "string"))
        json.type = "string";
      json.enum = values;
    };
    customProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Custom types cannot be represented in JSON Schema");
      }
    };
    transformProcessor = (_schema, ctx, _json, _params) => {
      if (ctx.unrepresentable === "throw") {
        throw new Error("Transforms cannot be represented in JSON Schema");
      }
    };
    arrayProcessor = (schema, ctx, _json, params) => {
      const json = _json;
      const def = schema._zod.def;
      const { minimum, maximum } = schema._zod.bag;
      if (typeof minimum === "number")
        json.minItems = minimum;
      if (typeof maximum === "number")
        json.maxItems = maximum;
      json.type = "array";
      json.items = process$1(def.element, ctx, {
        ...params,
        path: [...params.path, "items"]
      });
    };
    unionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const isExclusive = def.inclusive === false;
      const options = def.options.map((x4, i5) => process$1(x4, ctx, {
        ...params,
        path: [...params.path, isExclusive ? "oneOf" : "anyOf", i5]
      }));
      if (isExclusive) {
        json.oneOf = options;
      } else {
        json.anyOf = options;
      }
    };
    intersectionProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const a4 = process$1(def.left, ctx, {
        ...params,
        path: [...params.path, "allOf", 0]
      });
      const b3 = process$1(def.right, ctx, {
        ...params,
        path: [...params.path, "allOf", 1]
      });
      const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
      const allOf = [
        ...isSimpleIntersection(a4) ? a4.allOf : [a4],
        ...isSimpleIntersection(b3) ? b3.allOf : [b3]
      ];
      json.allOf = allOf;
    };
    nullableProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      const inner = process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      if (ctx.target === "openapi-3.0") {
        seen.ref = def.innerType;
        json.nullable = true;
      } else {
        json.anyOf = [inner, { type: "null" }];
      }
    };
    nonoptionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    defaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      json.default = JSON.parse(JSON.stringify(def.defaultValue));
    };
    prefaultProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      if (ctx.io === "input")
        json._prefault = JSON.parse(JSON.stringify(def.defaultValue));
    };
    catchProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      let catchValue;
      try {
        catchValue = def.catchValue(void 0);
      } catch {
        throw new Error("Dynamic catch values are not supported in JSON Schema");
      }
      json.default = catchValue;
    };
    pipeProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      const inIsTransform = def.in._zod.traits.has("$ZodTransform");
      const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
      process$1(innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = innerType;
    };
    readonlyProcessor = (schema, ctx, json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
      json.readOnly = true;
    };
    optionalProcessor = (schema, ctx, _json, params) => {
      const def = schema._zod.def;
      process$1(def.innerType, ctx, params);
      const seen = ctx.seen.get(schema);
      seen.ref = def.innerType;
    };
    ASTRO_VERSION = "6.4.7";
    ASTRO_GENERATOR = `Astro v${ASTRO_VERSION}`;
    REROUTE_DIRECTIVE_HEADER = "X-Astro-Reroute";
    REWRITE_DIRECTIVE_HEADER_KEY = "X-Astro-Rewrite";
    REWRITE_DIRECTIVE_HEADER_VALUE = "yes";
    NOOP_MIDDLEWARE_HEADER = "X-Astro-Noop";
    ROUTE_TYPE_HEADER = "X-Astro-Route-Type";
    INTERNAL_RESPONSE_HEADERS = [
      REROUTE_DIRECTIVE_HEADER,
      REWRITE_DIRECTIVE_HEADER_KEY,
      NOOP_MIDDLEWARE_HEADER,
      ROUTE_TYPE_HEADER
    ];
    ASTRO_ERROR_HEADER = "X-Astro-Error";
    DEFAULT_404_COMPONENT = "astro-default-404.astro";
    REDIRECT_STATUS_CODES = [301, 302, 303, 307, 308, 300, 304];
    REROUTABLE_STATUS_CODES = [404, 500];
    clientAddressSymbol = /* @__PURE__ */ Symbol.for("astro.clientAddress");
    originPathnameSymbol = /* @__PURE__ */ Symbol.for("astro.originPathname");
    pipelineSymbol = /* @__PURE__ */ Symbol.for("astro.pipeline");
    fetchStateSymbol = /* @__PURE__ */ Symbol.for("astro.fetchState");
    appSymbol = /* @__PURE__ */ Symbol.for("astro.app");
    responseSentSymbol$1 = /* @__PURE__ */ Symbol.for("astro.responseSent");
    ClientAddressNotAvailable = {
      name: "ClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in current adapter.",
      message: (adapterName) => `\`Astro.clientAddress\` is not available in the \`${adapterName}\` adapter. File an issue with the adapter to add support.`
    };
    PrerenderClientAddressNotAvailable = {
      name: "PrerenderClientAddressNotAvailable",
      title: "`Astro.clientAddress` cannot be used inside prerendered routes.",
      message: (name) => `\`Astro.clientAddress\` cannot be used inside prerendered route ${name}.`
    };
    StaticClientAddressNotAvailable = {
      name: "StaticClientAddressNotAvailable",
      title: "`Astro.clientAddress` is not available in prerendered pages.",
      message: "`Astro.clientAddress` is only available on pages that are server-rendered.",
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/ for more information on how to enable SSR."
    };
    NoMatchingStaticPathFound = {
      name: "NoMatchingStaticPathFound",
      title: "No static path found for requested path.",
      message: (pathName) => `A \`getStaticPaths()\` route pattern was matched, but no matching static path was found for requested path \`${pathName}\`.`,
      hint: (possibleRoutes) => `Possible dynamic routes being matched: ${possibleRoutes.join(", ")}.`
    };
    OnlyResponseCanBeReturned = {
      name: "OnlyResponseCanBeReturned",
      title: "Invalid type returned by Astro page.",
      message: (route, returnedValue) => `Route \`${route ? route : ""}\` returned a \`${returnedValue}\`. Only a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) can be returned from Astro files.`,
      hint: "See https://docs.astro.build/en/guides/on-demand-rendering/#response for more information."
    };
    MissingMediaQueryDirective = {
      name: "MissingMediaQueryDirective",
      title: "Missing value for `client:media` directive.",
      message: 'Media query not provided for `client:media` directive. A media query similar to `client:media="(max-width: 600px)"` must be provided.'
    };
    NoMatchingRenderer = {
      name: "NoMatchingRenderer",
      title: "No matching renderer found.",
      message: (componentName, componentExtension, plural, validRenderersCount) => `Unable to render \`${componentName}\`.

${validRenderersCount > 0 ? `There ${plural ? "are" : "is"} ${validRenderersCount} renderer${plural ? "s" : ""} configured in your \`astro.config.mjs\` file,
but ${plural ? "none were" : "it was not"} able to server-side render \`${componentName}\`.` : `No valid renderer was found ${componentExtension ? `for the \`.${componentExtension}\` file extension.` : `for this file extension.`}`}`,
      hint: (probableRenderers) => `Did you mean to enable the ${probableRenderers} integration?

See https://docs.astro.build/en/guides/framework-components/ for more information on how to install and configure integrations.`
    };
    NoClientOnlyHint = {
      name: "NoClientOnlyHint",
      title: "Missing hint on client:only directive.",
      message: (componentName) => `Unable to render \`${componentName}\`. When using the \`client:only\` hydration strategy, Astro needs a hint to use the correct renderer.`,
      hint: (probableRenderers) => `Did you mean to pass \`client:only="${probableRenderers}"\`? See https://docs.astro.build/en/reference/directives-reference/#clientonly for more information on \`client:only\`.`
    };
    InvalidGetStaticPathsEntry = {
      name: "InvalidGetStaticPathsEntry",
      title: "Invalid entry inside `getStaticPaths()`'s return value.",
      message: (entryType) => `Invalid entry returned by \`getStaticPaths()\`. Expected an object, got \`${entryType}\`.`,
      hint: "If you're using a `.map` call, you might be looking for `.flatMap()` instead. See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    InvalidGetStaticPathsReturn = {
      name: "InvalidGetStaticPathsReturn",
      title: "Invalid value returned by `getStaticPaths()`.",
      message: (returnType) => `Invalid type returned by \`getStaticPaths()\`. Expected an \`array\`, got \`${returnType}\`.`,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsExpectedParams = {
      name: "GetStaticPathsExpectedParams",
      title: "Missing params property on `getStaticPaths()` route.",
      message: "Missing or empty required `params` property on `getStaticPaths()` route.",
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsInvalidRouteParam = {
      name: "GetStaticPathsInvalidRouteParam",
      title: "Invalid route parameter returned by `getStaticPaths()`.",
      message: (key, value, valueType) => `Invalid \`getStaticPaths()\` route parameter for \`${key}\`. Expected a string or undefined, received \`${valueType}\` (\`${value}\`).`,
      hint: "See https://docs.astro.build/en/reference/routing-reference/#getstaticpaths for more information on `getStaticPaths()`."
    };
    GetStaticPathsRequired = {
      name: "GetStaticPathsRequired",
      title: "`getStaticPaths()` function required for dynamic routes.",
      message: "`getStaticPaths()` function is required for dynamic routes. Make sure that you `export` a `getStaticPaths()` function from your dynamic route.",
      hint: `See https://docs.astro.build/en/guides/routing/#dynamic-routes for more information on dynamic routes.

	If you meant for this route to be server-rendered, set \`export const prerender = false;\` in the page.`
    };
    ReservedSlotName = {
      name: "ReservedSlotName",
      title: "Invalid slot name.",
      message: (slotName2) => `Unable to create a slot named \`${slotName2}\`. \`${slotName2}\` is a reserved slot name. Please update the name of this slot.`
    };
    NoMatchingImport = {
      name: "NoMatchingImport",
      title: "No import found for component.",
      message: (componentName) => `Could not render \`${componentName}\`. No matching import has been found for \`${componentName}\`.`,
      hint: "Please make sure the component is properly imported."
    };
    InvalidComponentArgs = {
      name: "InvalidComponentArgs",
      title: "Invalid component arguments.",
      message: (name) => `Invalid arguments passed to${name ? ` <${name}>` : ""} component.`,
      hint: "Astro components cannot be rendered directly via function call, such as `Component()` or `{items.map(Component)}`."
    };
    PageNumberParamNotFound = {
      name: "PageNumberParamNotFound",
      title: "Page number param not found.",
      message: (paramName) => `[paginate()] page number param \`${paramName}\` not found in your filepath.`,
      hint: "Rename your file to `[page].astro` or `[...page].astro`."
    };
    ImageMissingAlt = {
      name: "ImageMissingAlt",
      title: 'Image missing required "alt" property.',
      message: 'Image missing "alt" property. "alt" text is required to describe important images on the page.',
      hint: 'Use an empty string ("") for decorative images.'
    };
    InvalidImageService = {
      name: "InvalidImageService",
      title: "Error while loading image service.",
      message: "There was an error loading the configured image service. Please see the stack trace for more information."
    };
    MissingImageDimension = {
      name: "MissingImageDimension",
      title: "Missing image dimensions.",
      message: (missingDimension, imageURL) => `Missing ${missingDimension === "both" ? "width and height attributes" : `${missingDimension} attribute`} for ${imageURL}. When using remote images, both dimensions are required in order to avoid CLS.`,
      hint: "If your image is inside your `src` folder, you probably meant to import it instead. See [the Imports guide for more information](https://docs.astro.build/en/guides/imports/#other-assets). You can also use `inferSize={true}` for remote images to get the original dimensions."
    };
    FailedToFetchRemoteImageDimensions = {
      name: "FailedToFetchRemoteImageDimensions",
      title: "Failed to retrieve remote image dimensions.",
      message: (imageURL) => `Failed to get the dimensions for ${imageURL}.`,
      hint: "Verify your remote image URL is accurate, and that you are not using `inferSize` with a file located in your `public/` folder."
    };
    RemoteImageNotAllowed = {
      name: "RemoteImageNotAllowed",
      title: "Remote image is not allowed.",
      message: (imageURL) => `Remote image ${imageURL} is not allowed by your image configuration.`,
      hint: "Update `image.domains` or `image.remotePatterns`, or remove `inferSize` for this image."
    };
    UnsupportedImageFormat = {
      name: "UnsupportedImageFormat",
      title: "Unsupported image format.",
      message: (format, imagePath, supportedFormats) => `Received unsupported format \`${format}\` from \`${imagePath}\`. Currently only ${supportedFormats.join(
        ", "
      )} are supported by our image services.`,
      hint: "Using an `img` tag directly instead of the `Image` component might be what you're looking for."
    };
    UnsupportedImageConversion = {
      name: "UnsupportedImageConversion",
      title: "Unsupported image conversion.",
      message: "Converting between vector (such as SVGs) and raster (such as PNGs and JPEGs) images is not currently supported."
    };
    PrerenderDynamicEndpointPathCollide = {
      name: "PrerenderDynamicEndpointPathCollide",
      title: "Prerendered dynamic endpoint has path collision.",
      message: (pathname) => `Could not render \`${pathname}\` with an \`undefined\` param as the generated path will collide during prerendering. Prevent passing \`undefined\` as \`params\` for the endpoint's \`getStaticPaths()\` function, or add an additional extension to the endpoint's filename.`,
      hint: (filename) => `Rename \`${filename}\` to \`${filename.replace(/\.(?:js|ts)/, (m4) => `.json` + m4)}\``
    };
    ExpectedImage = {
      name: "ExpectedImage",
      title: "Expected src to be an image.",
      message: (src, typeofOptions, fullOptions) => `Expected \`src\` property for \`getImage\` or \`<Image />\` to be either an ESM imported image or a string with the path of a remote image. Received \`${src}\` (type: \`${typeofOptions}\`).

Full serialized options received: \`${fullOptions}\`.`,
      hint: "This error can often happen because of a wrong path. Make sure the path to your image is correct. If you're passing an async function, make sure to call and await it."
    };
    ExpectedImageOptions = {
      name: "ExpectedImageOptions",
      title: "Expected image options.",
      message: (options) => `Expected \`getImage()\` parameter to be an object. Received \`${options}\`.`
    };
    ExpectedNotESMImage = {
      name: "ExpectedNotESMImage",
      title: "Expected image options, not an ESM-imported image.",
      message: "An ESM-imported image cannot be passed directly to `getImage()`. Instead, pass an object with the image in the `src` property.",
      hint: "Try changing `getImage(myImage)` to `getImage({ src: myImage })`"
    };
    IncompatibleDescriptorOptions = {
      name: "IncompatibleDescriptorOptions",
      title: "Cannot set both `densities` and `widths`.",
      message: "Only one of `densities` or `widths` can be specified. In most cases, you'll probably want to use only `widths` if you require specific widths.",
      hint: "Those attributes are used to construct a `srcset` attribute, which cannot have both `x` and `w` descriptors."
    };
    NoImageMetadata = {
      name: "NoImageMetadata",
      title: "Could not process image metadata.",
      message: (imagePath) => `Could not process image metadata${imagePath ? ` for \`${imagePath}\`` : ""}.`,
      hint: "This is often caused by a corrupted or malformed image. Re-exporting the image from your image editor may fix this issue."
    };
    ResponseSentError = {
      name: "ResponseSentError",
      title: "Unable to set response.",
      message: "The response has already been sent to the browser and cannot be altered."
    };
    MiddlewareNoDataOrNextCalled = {
      name: "MiddlewareNoDataOrNextCalled",
      title: "The middleware didn't return a `Response`.",
      message: "Make sure your middleware returns a `Response` object, either directly or by returning the `Response` from calling the `next` function."
    };
    MiddlewareNotAResponse = {
      name: "MiddlewareNotAResponse",
      title: "The middleware returned something that is not a `Response` object.",
      message: "Any data returned from middleware must be a valid `Response` object."
    };
    EndpointDidNotReturnAResponse = {
      name: "EndpointDidNotReturnAResponse",
      title: "The endpoint did not return a `Response`.",
      message: "An endpoint must return either a `Response`, or a `Promise` that resolves with a `Response`."
    };
    LocalsNotAnObject = {
      name: "LocalsNotAnObject",
      title: "Value assigned to `locals` is not accepted.",
      message: "`locals` can only be assigned to an object. Other values like numbers, strings, etc. are not accepted.",
      hint: "If you tried to remove some information from the `locals` object, try to use `delete` or set the property to `undefined`."
    };
    LocalsReassigned = {
      name: "LocalsReassigned",
      title: "`locals` must not be reassigned.",
      message: "`locals` cannot be assigned directly.",
      hint: "Set a `locals` property instead."
    };
    AstroResponseHeadersReassigned = {
      name: "AstroResponseHeadersReassigned",
      title: "`Astro.response.headers` must not be reassigned.",
      message: "Individual headers can be added to and removed from `Astro.response.headers`, but it must not be replaced with another instance of `Headers` altogether.",
      hint: "Consider using `Astro.response.headers.add()`, and `Astro.response.headers.delete()`."
    };
    LocalImageUsedWrongly = {
      name: "LocalImageUsedWrongly",
      title: "Local images must be imported.",
      message: (imageFilePath) => `\`Image\`'s and \`getImage\`'s \`src\` parameter must be an imported image or a URL, it cannot be a string filepath. Received \`${imageFilePath}\`.`,
      hint: "If you want to use an image from your `src` folder, you need to either import it or if the image is coming from a content collection, use the [image() schema helper](https://docs.astro.build/en/guides/images/#images-in-content-collections). See https://docs.astro.build/en/reference/modules/astro-assets/#src-required for more information on the `src` property."
    };
    i18nNoLocaleFoundInPath = {
      name: "i18nNoLocaleFoundInPath",
      title: "The path doesn't contain any locale.",
      message: "You tried to use an i18n utility on a path that doesn't contain any locale. You can use `pathHasLocale` first to determine if the path has a locale."
    };
    RewriteWithBodyUsed = {
      name: "RewriteWithBodyUsed",
      title: "Cannot use `Astro.rewrite()` after the request body has been read.",
      message: "`Astro.rewrite()` cannot be used if the request body has already been read. If you need to read the body, first clone the request."
    };
    ForbiddenRewrite = {
      name: "ForbiddenRewrite",
      title: "Forbidden rewrite to a static route.",
      message: (from, to, component) => `You tried to rewrite the on-demand route '${from}' with the static route '${to}', when using the 'server' output. 

The static route '${to}' is rendered by the component
'${component}', which is marked as prerendered. This is a forbidden operation because during the build, the component '${component}' is compiled to an
HTML file, which can't be retrieved at runtime by Astro.`,
      hint: (component) => `Add \`export const prerender = false\` to the component '${component}', or use \`Astro.redirect()\`.`
    };
    FontFamilyNotFound = {
      name: "FontFamilyNotFound",
      title: "Font family not found.",
      message: (family) => `No data was found for the \`"${family}"\` family passed to the \`<Font>\` component.`,
      hint: "This is often caused by a typo. Check that the `<Font />` component is using a `cssVariable` specified in your config."
    };
    MissingGetFontFileRequestUrl = {
      name: "MissingGetFontFileRequestUrl",
      title: "`experimental_getFontFileURL()` requires the request URL with on-demand rendering.",
      hint: "Pass the request URL as the 2nd argument, for example `Astro.url`."
    };
    UnableToLoadLogger = {
      name: "UnableToLoadLogger",
      title: "Unable to load the logger.",
      message: (path) => `Couldn't load the logger at given path "${path}".`
    };
    ActionsReturnedInvalidDataError = {
      name: "ActionsReturnedInvalidDataError",
      title: "Action handler returned invalid data.",
      message: (error2) => `Action handler returned invalid data. Handlers should return serializable data types like objects, arrays, strings, and numbers. Parse error: ${error2}`,
      hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
    };
    ActionNotFoundError = {
      name: "ActionNotFoundError",
      title: "Action not found.",
      message: (actionName) => `The server received a request for an action named \`${actionName}\` but could not find a match. If you renamed an action, check that you've updated your \`actions/index\` file and your calling code to match.`,
      hint: "You can run `astro check` to detect type errors caused by mismatched action names."
    };
    SessionStorageInitError = {
      name: "SessionStorageInitError",
      title: "Session storage could not be initialized.",
      message: (error2, driver) => `Error when initializing session storage${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``,
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    SessionStorageSaveError = {
      name: "SessionStorageSaveError",
      title: "Session data could not be saved.",
      message: (error2, driver) => `Error when saving session data${driver ? ` with driver \`${driver}\`` : ""}. \`${error2 ?? ""}\``,
      hint: "For more information, see https://docs.astro.build/en/guides/sessions/"
    };
    CacheNotEnabled = {
      name: "CacheNotEnabled",
      title: "Cache is not enabled.",
      message: "`Astro.cache` is not available because the cache feature is not enabled. To use caching, configure a cache provider in your Astro config under `experimental.cache`.",
      hint: 'Use an adapter that provides a default cache provider, or set one explicitly: `experimental: { cache: { provider: "..." } }`. See https://docs.astro.build/en/reference/experimental-flags/route-caching/.'
    };
    AstroError = class extends Error {
      loc;
      title;
      hint;
      frame;
      type = "AstroError";
      constructor(props, options) {
        const { name, title, message, stack, location, hint, frame } = props;
        super(message, options);
        this.title = title;
        this.name = name;
        if (message) this.message = message;
        this.stack = stack ? stack : this.stack;
        this.loc = location;
        this.hint = hint;
        this.frame = frame;
      }
      setLocation(location) {
        this.loc = location;
      }
      setName(name) {
        this.name = name;
      }
      setMessage(message) {
        this.message = message;
      }
      setHint(hint) {
        this.hint = hint;
      }
      setFrame(source, location) {
        this.frame = codeFrame(source, location);
      }
      static is(err) {
        return err?.type === "AstroError";
      }
    };
    BodySizeLimitError = class extends Error {
      limit;
      constructor(limit) {
        super(`Request body exceeds the configured limit of ${limit} bytes`);
        this.name = "BodySizeLimitError";
        this.limit = limit;
      }
    };
    __vite_import_meta_env__ = { "ASSETS_PREFIX": void 0, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": void 0, "SSR": true };
    ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
    formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
    dist = {};
    distExports = /* @__PURE__ */ requireDist();
    DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
    DELETED_VALUE = "deleted";
    responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
    identity = (value) => value;
    AstroCookie = class {
      value;
      constructor(value) {
        this.value = value;
      }
      json() {
        if (this.value === void 0) {
          throw new Error(`Cannot convert undefined to an object.`);
        }
        return JSON.parse(this.value);
      }
      number() {
        return Number(this.value);
      }
      boolean() {
        if (this.value === "false") return false;
        if (this.value === "0") return false;
        return Boolean(this.value);
      }
    };
    AstroCookies = class {
      #request;
      #requestValues;
      #outgoing;
      #consumed;
      constructor(request) {
        this.#request = request;
        this.#requestValues = null;
        this.#outgoing = null;
        this.#consumed = false;
      }
      /**
       * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
       * in a Set-Cookie header added to the response.
       * @param key The cookie to delete
       * @param options Options related to this deletion, such as the path of the cookie.
       */
      delete(key, options) {
        const {
          // @ts-expect-error
          maxAge: _ignoredMaxAge,
          // @ts-expect-error
          expires: _ignoredExpires,
          ...sanitizedOptions
        } = options || {};
        const serializeOptions = {
          expires: DELETED_EXPIRATION,
          ...sanitizedOptions
        };
        this.#ensureOutgoingMap().set(key, [
          DELETED_VALUE,
          distExports.serialize(key, DELETED_VALUE, serializeOptions),
          false
        ]);
      }
      /**
       * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
       * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
       * from that set call, overriding any values already part of the request.
       * @param key The cookie to get.
       * @returns An object containing the cookie value as well as convenience methods for converting its value.
       */
      get(key, options = void 0) {
        if (this.#outgoing?.has(key)) {
          let [serializedValue, , isSetValue] = this.#outgoing.get(key);
          if (isSetValue) {
            return new AstroCookie(serializedValue);
          } else {
            return void 0;
          }
        }
        const decode2 = options?.decode ?? decodeURIComponent;
        const values = this.#ensureParsed();
        if (key in values) {
          const value = values[key];
          if (value) {
            let decodedValue;
            try {
              decodedValue = decode2(value);
            } catch (_error) {
              decodedValue = value;
            }
            return new AstroCookie(decodedValue);
          }
        }
      }
      /**
       * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
       * part of the initial request or set via Astro.cookies.set(key)
       * @param key The cookie to check for.
       * @param _options This parameter is no longer used.
       * @returns
       */
      has(key, _options) {
        if (this.#outgoing?.has(key)) {
          let [, , isSetValue] = this.#outgoing.get(key);
          return isSetValue;
        }
        const values = this.#ensureParsed();
        return values[key] !== void 0;
      }
      /**
       * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
       * an object it will be stringified via JSON.stringify(value). Additionally you
       * can provide options customizing how this cookie will be set, such as setting httpOnly
       * in order to prevent the cookie from being read in client-side JavaScript.
       * @param key The name of the cookie to set.
       * @param value A value, either a string or other primitive or an object.
       * @param options Options for the cookie, such as the path and security settings.
       */
      set(key, value, options) {
        if (this.#consumed) {
          const warning = new Error(
            "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
          );
          warning.name = "Warning";
          console.warn(warning);
        }
        let serializedValue;
        if (typeof value === "string") {
          serializedValue = value;
        } else {
          let toStringValue = value.toString();
          if (toStringValue === Object.prototype.toString.call(value)) {
            serializedValue = JSON.stringify(value);
          } else {
            serializedValue = toStringValue;
          }
        }
        const serializeOptions = {};
        if (options) {
          Object.assign(serializeOptions, options);
        }
        this.#ensureOutgoingMap().set(key, [
          serializedValue,
          distExports.serialize(key, serializedValue, serializeOptions),
          true
        ]);
        if (this.#request[responseSentSymbol]) {
          throw new AstroError({
            ...ResponseSentError
          });
        }
      }
      /**
       * Merges a new AstroCookies instance into the current instance. Any new cookies
       * will be added to the current instance, overwriting any existing cookies with the same name.
       */
      merge(cookies) {
        const outgoing = cookies.#outgoing;
        if (outgoing) {
          for (const [key, value] of outgoing) {
            this.#ensureOutgoingMap().set(key, value);
          }
        }
      }
      /**
       * Astro.cookies.header() returns an iterator for the cookies that have previously
       * been set by either Astro.cookies.set() or Astro.cookies.delete().
       * This method is primarily used by adapters to set the header on outgoing responses.
       * @returns
       */
      *headers() {
        if (this.#outgoing == null) return;
        for (const [, value] of this.#outgoing) {
          yield value[1];
        }
      }
      /**
       * Marks the cookies as consumed and returns the header values.
       * After consumption, any subsequent `set()` calls will warn.
       */
      consume() {
        this.#consumed = true;
        return this.headers();
      }
      /**
       * @deprecated Use the instance method `cookies.consume()` instead.
       * Kept for backward compatibility with adapters.
       */
      static consume(cookies) {
        return cookies.consume();
      }
      #ensureParsed() {
        if (!this.#requestValues) {
          this.#parse();
        }
        if (!this.#requestValues) {
          this.#requestValues = /* @__PURE__ */ Object.create(null);
        }
        return this.#requestValues;
      }
      #ensureOutgoingMap() {
        if (!this.#outgoing) {
          this.#outgoing = /* @__PURE__ */ new Map();
        }
        return this.#outgoing;
      }
      #parse() {
        const raw = this.#request.headers.get("cookie");
        if (!raw) {
          return;
        }
        this.#requestValues = distExports.parse(raw, { decode: identity });
      }
    };
    astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
    NOOP_ACTIONS_MOD = {
      server: {}
    };
    FORM_CONTENT_TYPES = [
      "application/x-www-form-urlencoded",
      "multipart/form-data",
      "text/plain"
    ];
    SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
    NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
      const response = await next();
      response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
      return response;
    };
    ({ replace } = "");
    ca = /[&<>'"]/g;
    esca = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    };
    pe = (m4) => esca[m4];
    escape = (es) => replace.call(es, ca, pe);
    DEFAULT_404_ROUTE = {
      component: DEFAULT_404_COMPONENT,
      params: [],
      pattern: /^\/404\/?$/,
      prerender: false,
      pathname: "/404",
      segments: [[{ content: "404", dynamic: false, spread: false }]],
      type: "page",
      route: "/404",
      fallbackRoutes: [],
      isIndex: false,
      origin: "internal",
      distURL: []
    };
    default404Page.isAstroComponentFactory = true;
    default404Instance = {
      default: default404Page
    };
    ROUTE404_RE = /^\/404\/?$/;
    ROUTE500_RE = /^\/500\/?$/;
    RedirectComponentInstance = {
      default() {
        return new Response(null, {
          status: 301
        });
      }
    };
    RedirectSinglePageBuiltModule = {
      page: () => Promise.resolve(RedirectComponentInstance),
      onRequest: (_4, next) => next()
    };
    VALID_PARAM_TYPES = ["string", "undefined"];
    RouteCache = class {
      logger;
      cache = {};
      runtimeMode;
      constructor(logger, runtimeMode = "production") {
        this.logger = logger;
        this.runtimeMode = runtimeMode;
      }
      /** Clear the cache. */
      clearAll() {
        this.cache = {};
      }
      set(route, entry) {
        const key = this.key(route);
        if (this.runtimeMode === "production" && this.cache[key]?.staticPaths) {
          this.logger.warn(null, `Internal Warning: route cache overwritten. (${key})`);
        }
        this.cache[key] = entry;
      }
      get(route) {
        return this.cache[this.key(route)];
      }
      key(route) {
        return `${route.route}_${route.component}`;
      }
    };
    escapeHTML = escape;
    HTMLBytes = class extends Uint8Array {
    };
    Object.defineProperty(HTMLBytes.prototype, Symbol.toStringTag, {
      get() {
        return "HTMLBytes";
      }
    });
    htmlStringSymbol = /* @__PURE__ */ Symbol.for("astro:html-string");
    HTMLString = class extends String {
      [htmlStringSymbol] = true;
    };
    markHTMLString = (value) => {
      if (isHTMLString(value)) {
        return value;
      }
      if (typeof value === "string") {
        return new HTMLString(value);
      }
      return value;
    };
    AstroJSX = "astro:jsx";
    PROP_TYPE = {
      Value: 0,
      JSON: 1,
      // Actually means Array
      RegExp: 2,
      Date: 3,
      Map: 4,
      Set: 5,
      BigInt: 6,
      URL: 7,
      Uint8Array: 8,
      Uint16Array: 9,
      Uint32Array: 10,
      Infinity: 11
    };
    transitionDirectivesToCopyOnIsland = Object.freeze([
      "data-astro-transition-scope",
      "data-astro-transition-persist",
      "data-astro-transition-persist-props"
    ]);
    dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
    binary = dictionary.length;
    headAndContentSym = /* @__PURE__ */ Symbol.for("astro.headAndContent");
    astro_island_prebuilt_default = `(()=>{var g=Object.defineProperty;var w=(c,s,d)=>s in c?g(c,s,{enumerable:!0,configurable:!0,writable:!0,value:d}):c[s]=d;var l=(c,s,d)=>w(c,typeof s!="symbol"?s+"":s,d);var E=new Set(["__proto__","constructor","prototype"]);{let c={0:t=>y(t),1:t=>d(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(d(t)),5:t=>new Set(d(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in c?c[p](e):void 0},d=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},i=this.querySelectorAll("template[data-astro-template]");for(let o of i){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let a=o.closest(this.tagName);a!=null&&a.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let u;try{u=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let a=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(a+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${a}\`,this.getAttribute("props"),o),o}let h;await this.hydrator(this)(this.Component,u,r,{client:this.getAttribute("client")}),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let n=new URL(e,document.baseURI),r=\`astro-retry=\${Date.now()}\`,i=n.hash.replace(/^#/,"");return n.hash=i?\`\${i}&\${r}\`:r,n.toString()}async importWithRetry(e){try{return await import(e)}catch(n){return await new Promise(r=>setTimeout(r,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let n=this.getAttribute("component-url"),r=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:n}});this.dispatchEvent(r)&&console.error(\`[astro-island] Error hydrating \${n}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(\`astro:\${n}\`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url");try{let[i,{default:u}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),r?this.importWithRetry(r):Promise.resolve({default:()=>()=>{}})]),h=this.getAttribute("component-export")||"default";if(h.includes(".")){this.Component=i;for(let m of h.split(".")){if(E.has(m)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,m))throw new Error(\`Invalid component export path: \${h}\`);this.Component=this.Component[m]}}else{if(E.has(h))throw new Error(\`Invalid component export path: \${h}\`);this.Component=i[h]}return this.hydrator=u,this.hydrate}catch(i){return this.handleHydrationError(i),()=>{}}},e,this)}catch(r){this.handleHydrationError(r)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;
    astro_island_prebuilt_dev_default = `(()=>{var g=Object.defineProperty;var w=(d,s,h)=>s in d?g(d,s,{enumerable:!0,configurable:!0,writable:!0,value:h}):d[s]=h;var l=(d,s,h)=>w(d,typeof s!="symbol"?s+"":s,h);var E=new Set(["__proto__","constructor","prototype"]);{let d={0:t=>y(t),1:t=>h(t),2:t=>new RegExp(t),3:t=>new Date(t),4:t=>new Map(h(t)),5:t=>new Set(h(t)),6:t=>BigInt(t),7:t=>new URL(t),8:t=>new Uint8Array(t),9:t=>new Uint16Array(t),10:t=>new Uint32Array(t),11:t=>Number.POSITIVE_INFINITY*t},s=t=>{let[p,e]=t;return p in d?d[p](e):void 0},h=t=>t.map(s),y=t=>typeof t!="object"||t===null?t:Object.fromEntries(Object.entries(t).map(([p,e])=>[p,s(e)]));class f extends HTMLElement{constructor(){super(...arguments);l(this,"Component");l(this,"hydrator");l(this,"hydrate",async()=>{var b;if(!this.hydrator||!this.isConnected)return;let e=(b=this.parentElement)==null?void 0:b.closest("astro-island[ssr]");if(e){e.addEventListener("astro:hydrate",this.hydrate,{once:!0});return}let n=this.querySelectorAll("astro-slot"),r={},i=this.querySelectorAll("template[data-astro-template]");for(let o of i){let c=o.closest(this.tagName);c!=null&&c.isSameNode(this)&&(r[o.getAttribute("data-astro-template")||"default"]=o.innerHTML,o.remove())}for(let o of n){let c=o.closest(this.tagName);c!=null&&c.isSameNode(this)&&(r[o.getAttribute("name")||"default"]=o.innerHTML)}let m;try{m=this.hasAttribute("props")?y(JSON.parse(this.getAttribute("props"))):{}}catch(o){let c=this.getAttribute("component-url")||"<unknown>",v=this.getAttribute("component-export");throw v&&(c+=\` (export \${v})\`),console.error(\`[hydrate] Error parsing props for component \${c}\`,this.getAttribute("props"),o),o}let a,u=this.hydrator(this);a=performance.now(),await u(this.Component,m,r,{client:this.getAttribute("client")}),a&&this.setAttribute("client-render-time",(performance.now()-a).toString()),this.removeAttribute("ssr"),this.dispatchEvent(new CustomEvent("astro:hydrate"))});l(this,"unmount",()=>{this.isConnected||this.dispatchEvent(new CustomEvent("astro:unmount"))})}disconnectedCallback(){document.removeEventListener("astro:after-swap",this.unmount),document.addEventListener("astro:after-swap",this.unmount,{once:!0})}connectedCallback(){if(!this.hasAttribute("await-children")||document.readyState==="interactive"||document.readyState==="complete")this.childrenConnectedCallback();else{let e=()=>{document.removeEventListener("DOMContentLoaded",e),n.disconnect(),this.childrenConnectedCallback()},n=new MutationObserver(()=>{var r;((r=this.lastChild)==null?void 0:r.nodeType)===Node.COMMENT_NODE&&this.lastChild.nodeValue==="astro:end"&&(this.lastChild.remove(),e())});n.observe(this,{childList:!0}),document.addEventListener("DOMContentLoaded",e)}}async childrenConnectedCallback(){let e=this.getAttribute("before-hydration-url");e&&await import(e),this.start()}getRetryImportUrl(e){let n=new URL(e,document.baseURI),r=\`astro-retry=\${Date.now()}\`,i=n.hash.replace(/^#/,"");return n.hash=i?\`\${i}&\${r}\`:r,n.toString()}async importWithRetry(e){try{return await import(e)}catch(n){return await new Promise(r=>setTimeout(r,1e3)),import(this.getRetryImportUrl(e))}}handleHydrationError(e){let n=this.getAttribute("component-url"),r=new CustomEvent("astro:hydration-error",{cancelable:!0,bubbles:!0,composed:!0,detail:{error:e,componentUrl:n}});this.dispatchEvent(r)&&console.error(\`[astro-island] Error hydrating \${n}\`,e)}async start(){let e=JSON.parse(this.getAttribute("opts")),n=this.getAttribute("client");if(Astro[n]===void 0){window.addEventListener(\`astro:\${n}\`,()=>this.start(),{once:!0});return}try{await Astro[n](async()=>{let r=this.getAttribute("renderer-url");try{let[i,{default:m}]=await Promise.all([this.importWithRetry(this.getAttribute("component-url")),r?this.importWithRetry(r):Promise.resolve({default:()=>()=>{}})]),a=this.getAttribute("component-export")||"default";if(a.includes(".")){this.Component=i;for(let u of a.split(".")){if(E.has(u)||!this.Component||typeof this.Component!="object"&&typeof this.Component!="function"||!Object.hasOwn(this.Component,u))throw new Error(\`Invalid component export path: \${a}\`);this.Component=this.Component[u]}}else{if(E.has(a))throw new Error(\`Invalid component export path: \${a}\`);this.Component=i[a]}return this.hydrator=m,this.hydrate}catch(i){return this.handleHydrationError(i),()=>{}}},e,this)}catch(r){this.handleHydrationError(r)}}attributeChangedCallback(){this.hydrate()}}l(f,"observedAttributes",["props"]),customElements.get("astro-island")||customElements.define("astro-island",f)}})();`;
    ISLAND_STYLES = "astro-island,astro-slot,astro-static-slot{display:contents}";
    RenderInstructionSymbol = /* @__PURE__ */ Symbol.for("astro:render");
    voidElementNames = /^(area|base|br|col|command|embed|hr|img|input|keygen|link|meta|param|source|track|wbr)$/i;
    htmlBooleanAttributes = /^(?:allowfullscreen|async|autofocus|autoplay|checked|controls|default|defer|disabled|disablepictureinpicture|disableremoteplayback|formnovalidate|inert|loop|muted|nomodule|novalidate|open|playsinline|readonly|required|reversed|scoped|seamless|selected|itemscope)$/i;
    AMPERSAND_REGEX = /&/g;
    DOUBLE_QUOTE_REGEX = /"/g;
    STATIC_DIRECTIVES = /* @__PURE__ */ new Set(["set:html", "set:text"]);
    INVALID_ATTR_NAME_CHAR = /[\s"'>/=]/;
    toIdent = (k4) => k4.trim().replace(/(?!^)\b\w|\s+|\W+/g, (match, index) => {
      if (/\W/.test(match)) return "";
      return index === 0 ? match : match.toUpperCase();
    });
    toAttributeString = (value, shouldEscape = true) => shouldEscape ? String(value).replace(AMPERSAND_REGEX, "&amp;").replace(DOUBLE_QUOTE_REGEX, "&quot;") : value;
    kebab = (k4) => k4.toLowerCase() === k4 ? k4 : k4.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
    toStyleString = (obj) => Object.entries(obj).filter(([_4, v4]) => typeof v4 === "string" && v4.trim() || typeof v4 === "number").map(([k4, v4]) => {
      if (k4[0] !== "-" && k4[1] !== "-") return `${kebab(k4)}:${v4}`;
      return `${k4}:${v4}`;
    }).join(";");
    noop = () => {
    };
    BufferedRenderer = class {
      chunks = [];
      renderPromise;
      destination;
      /**
       * Determines whether buffer has been flushed
       * to the final destination.
       */
      flushed = false;
      constructor(destination, renderFunction) {
        this.destination = destination;
        this.renderPromise = renderFunction(this);
        if (isPromise(this.renderPromise)) {
          Promise.resolve(this.renderPromise).catch(noop);
        }
      }
      write(chunk) {
        if (this.flushed) {
          this.destination.write(chunk);
        } else {
          this.chunks.push(chunk);
        }
      }
      flush() {
        if (this.flushed) {
          throw new Error("The render buffer has already been flushed.");
        }
        this.flushed = true;
        for (const chunk of this.chunks) {
          this.destination.write(chunk);
        }
        return this.renderPromise;
      }
    };
    isNode = typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]";
    isDeno = typeof Deno !== "undefined";
    alphabetUpperCase = "0123456789ABCDEF";
    decodeMap = {
      "0": 0,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "5": 5,
      "6": 6,
      "7": 7,
      "8": 8,
      "9": 9,
      a: 10,
      A: 10,
      b: 11,
      B: 11,
      c: 12,
      C: 12,
      d: 13,
      D: 13,
      e: 14,
      E: 14,
      f: 15,
      F: 15
    };
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding$1 || (EncodingPadding$1 = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding$1 || (DecodingPadding$1 = {}));
    base64Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    (function(EncodingPadding2) {
      EncodingPadding2[EncodingPadding2["Include"] = 0] = "Include";
      EncodingPadding2[EncodingPadding2["None"] = 1] = "None";
    })(EncodingPadding || (EncodingPadding = {}));
    (function(DecodingPadding2) {
      DecodingPadding2[DecodingPadding2["Required"] = 0] = "Required";
      DecodingPadding2[DecodingPadding2["Ignore"] = 1] = "Ignore";
    })(DecodingPadding || (DecodingPadding = {}));
    base64DecodeMap = {
      "0": 52,
      "1": 53,
      "2": 54,
      "3": 55,
      "4": 56,
      "5": 57,
      "6": 58,
      "7": 59,
      "8": 60,
      "9": 61,
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7,
      I: 8,
      J: 9,
      K: 10,
      L: 11,
      M: 12,
      N: 13,
      O: 14,
      P: 15,
      Q: 16,
      R: 17,
      S: 18,
      T: 19,
      U: 20,
      V: 21,
      W: 22,
      X: 23,
      Y: 24,
      Z: 25,
      a: 26,
      b: 27,
      c: 28,
      d: 29,
      e: 30,
      f: 31,
      g: 32,
      h: 33,
      i: 34,
      j: 35,
      k: 36,
      l: 37,
      m: 38,
      n: 39,
      o: 40,
      p: 41,
      q: 42,
      r: 43,
      s: 44,
      t: 45,
      u: 46,
      v: 47,
      w: 48,
      x: 49,
      y: 50,
      z: 51,
      "+": 62,
      "/": 63
    };
    initializer = (inst, issues) => {
      $ZodError.init(inst, issues);
      inst.name = "ZodError";
      Object.defineProperties(inst, {
        format: {
          value: (mapper) => formatError(inst, mapper)
          // enumerable: false,
        },
        flatten: {
          value: (mapper) => flattenError(inst, mapper)
          // enumerable: false,
        },
        addIssue: {
          value: (issue2) => {
            inst.issues.push(issue2);
            inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
          }
          // enumerable: false,
        },
        addIssues: {
          value: (issues2) => {
            inst.issues.push(...issues2);
            inst.message = JSON.stringify(inst.issues, jsonStringifyReplacer, 2);
          }
          // enumerable: false,
        },
        isEmpty: {
          get() {
            return inst.issues.length === 0;
          }
          // enumerable: false,
        }
      });
    };
    ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer, {
      Parent: Error
    });
    parse = /* @__PURE__ */ _parse(ZodRealError);
    parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
    safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
    safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
    encode = /* @__PURE__ */ _encode(ZodRealError);
    decode = /* @__PURE__ */ _decode(ZodRealError);
    encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
    decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
    safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
    safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
    safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
    safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);
    _installedGroups = /* @__PURE__ */ new WeakMap();
    ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
      $ZodType.init(inst, def);
      Object.assign(inst["~standard"], {
        jsonSchema: {
          input: createStandardJSONSchemaMethod(inst, "input"),
          output: createStandardJSONSchemaMethod(inst, "output")
        }
      });
      inst.toJSONSchema = createToJSONSchemaMethod(inst, {});
      inst.def = def;
      inst.type = def.type;
      Object.defineProperty(inst, "_def", { value: def });
      inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
      inst.safeParse = (data, params) => safeParse(inst, data, params);
      inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
      inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
      inst.spa = inst.safeParseAsync;
      inst.encode = (data, params) => encode(inst, data, params);
      inst.decode = (data, params) => decode(inst, data, params);
      inst.encodeAsync = async (data, params) => encodeAsync(inst, data, params);
      inst.decodeAsync = async (data, params) => decodeAsync(inst, data, params);
      inst.safeEncode = (data, params) => safeEncode(inst, data, params);
      inst.safeDecode = (data, params) => safeDecode(inst, data, params);
      inst.safeEncodeAsync = async (data, params) => safeEncodeAsync(inst, data, params);
      inst.safeDecodeAsync = async (data, params) => safeDecodeAsync(inst, data, params);
      _installLazyMethods(inst, "ZodType", {
        check(...chks) {
          const def2 = this.def;
          return this.clone(mergeDefs(def2, {
            checks: [
              ...def2.checks ?? [],
              ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
            ]
          }), { parent: true });
        },
        with(...chks) {
          return this.check(...chks);
        },
        clone(def2, params) {
          return clone(this, def2, params);
        },
        brand() {
          return this;
        },
        register(reg, meta) {
          reg.add(this, meta);
          return this;
        },
        refine(check2, params) {
          return this.check(refine(check2, params));
        },
        superRefine(refinement, params) {
          return this.check(superRefine(refinement, params));
        },
        overwrite(fn) {
          return this.check(/* @__PURE__ */ _overwrite(fn));
        },
        optional() {
          return optional(this);
        },
        exactOptional() {
          return exactOptional(this);
        },
        nullable() {
          return nullable(this);
        },
        nullish() {
          return optional(nullable(this));
        },
        nonoptional(params) {
          return nonoptional(this, params);
        },
        array() {
          return array(this);
        },
        or(arg) {
          return union([this, arg]);
        },
        and(arg) {
          return intersection(this, arg);
        },
        transform(tx) {
          return pipe(this, transform(tx));
        },
        default(d4) {
          return _default(this, d4);
        },
        prefault(d4) {
          return prefault(this, d4);
        },
        catch(params) {
          return _catch(this, params);
        },
        pipe(target) {
          return pipe(this, target);
        },
        readonly() {
          return readonly(this);
        },
        describe(description) {
          const cl = this.clone();
          globalRegistry.add(cl, { description });
          return cl;
        },
        meta(...args) {
          if (args.length === 0)
            return globalRegistry.get(this);
          const cl = this.clone();
          globalRegistry.add(cl, args[0]);
          return cl;
        },
        isOptional() {
          return this.safeParse(void 0).success;
        },
        isNullable() {
          return this.safeParse(null).success;
        },
        apply(fn) {
          return fn(this);
        }
      });
      Object.defineProperty(inst, "description", {
        get() {
          return globalRegistry.get(inst)?.description;
        },
        configurable: true
      });
      return inst;
    });
    ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
      $ZodArray.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
      inst.element = def.element;
      _installLazyMethods(inst, "ZodArray", {
        min(n3, params) {
          return this.check(/* @__PURE__ */ _minLength(n3, params));
        },
        nonempty(params) {
          return this.check(/* @__PURE__ */ _minLength(1, params));
        },
        max(n3, params) {
          return this.check(/* @__PURE__ */ _maxLength(n3, params));
        },
        length(n3, params) {
          return this.check(/* @__PURE__ */ _length(n3, params));
        },
        unwrap() {
          return this.element;
        }
      });
    });
    ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
      $ZodUnion.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
      inst.options = def.options;
    });
    ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
      $ZodIntersection.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
    });
    ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
      $ZodEnum.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json);
      inst.enum = def.entries;
      inst.options = Object.values(def.entries);
      const keys = new Set(Object.keys(def.entries));
      inst.extract = (values, params) => {
        const newEntries = {};
        for (const value of values) {
          if (keys.has(value)) {
            newEntries[value] = def.entries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
          ...def,
          checks: [],
          ...normalizeParams(params),
          entries: newEntries
        });
      };
      inst.exclude = (values, params) => {
        const newEntries = { ...def.entries };
        for (const value of values) {
          if (keys.has(value)) {
            delete newEntries[value];
          } else
            throw new Error(`Key ${value} not found in enum`);
        }
        return new ZodEnum({
          ...def,
          checks: [],
          ...normalizeParams(params),
          entries: newEntries
        });
      };
    });
    ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
      $ZodTransform.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx);
      inst._zod.parse = (payload, _ctx) => {
        if (_ctx.direction === "backward") {
          throw new $ZodEncodeError(inst.constructor.name);
        }
        payload.addIssue = (issue$1) => {
          if (typeof issue$1 === "string") {
            payload.issues.push(issue(issue$1, payload.value, def));
          } else {
            const _issue = issue$1;
            if (_issue.fatal)
              _issue.continue = false;
            _issue.code ?? (_issue.code = "custom");
            _issue.input ?? (_issue.input = payload.value);
            _issue.inst ?? (_issue.inst = inst);
            payload.issues.push(issue(_issue));
          }
        };
        const output = def.transform(payload.value, payload);
        if (output instanceof Promise) {
          return output.then((output2) => {
            payload.value = output2;
            payload.fallback = true;
            return payload;
          });
        }
        payload.value = output;
        payload.fallback = true;
        return payload;
      };
    });
    ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
      $ZodOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
      $ZodExactOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
      $ZodNullable.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
      $ZodDefault.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeDefault = inst.unwrap;
    });
    ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
      $ZodPrefault.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
      $ZodNonOptional.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
      $ZodCatch.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
      inst.removeCatch = inst.unwrap;
    });
    ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
      $ZodPipe.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
      inst.in = def.in;
      inst.out = def.out;
    });
    ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
      $ZodReadonly.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
      inst.unwrap = () => inst._zod.def.innerType;
    });
    ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
      $ZodCustom.init(inst, def);
      ZodType.init(inst, def);
      inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx);
    });
    ZodIssueCode = {
      custom: "custom"
    };
    ALGORITHMS = {
      "SHA-256": "sha256-",
      "SHA-384": "sha384-",
      "SHA-512": "sha512-"
    };
    _enum(Object.keys(ALGORITHMS)).optional().default("SHA-256");
    ALLOWED_DIRECTIVES = [
      "base-uri",
      "child-src",
      "connect-src",
      "default-src",
      "fenced-frame-src",
      "font-src",
      "form-action",
      "frame-ancestors",
      "frame-src",
      "img-src",
      "manifest-src",
      "media-src",
      "object-src",
      "referrer",
      "report-to",
      "report-uri",
      "require-trusted-types-for",
      "sandbox",
      "trusted-types",
      "upgrade-insecure-requests",
      "worker-src"
    ];
    custom((v4) => typeof v4 === "string").superRefine((value, ctx) => {
      const isAllowed = ALLOWED_DIRECTIVES.some((allowedValue) => {
        return value.startsWith(allowedValue);
      });
      if (!isAllowed) {
        if (value.startsWith("script-src") || value.startsWith("style-src")) {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `Directives \`script-src\` and \`style-src\` are not allowed in \`security.csp.directives\`. Please use \`security.csp.scriptDirective\` and \`security.csp.styleDirective\` instead.`,
            fatal: true
          });
        } else {
          ctx.addIssue({
            code: ZodIssueCode.custom,
            message: `Invalid directive: "${value}". Allowed directives are: ${ALLOWED_DIRECTIVES.join(", ")}`,
            fatal: true
          });
        }
      }
    });
    ALGORITHM = "AES-GCM";
    encoder$1 = new TextEncoder();
    decoder$1 = new TextDecoder();
    IV_LENGTH = 24;
    renderTemplateResultSym = /* @__PURE__ */ Symbol.for("astro.renderTemplateResult");
    RenderTemplateResult = class {
      [renderTemplateResultSym] = true;
      htmlParts;
      expressions;
      error;
      constructor(htmlParts, expressions) {
        this.htmlParts = htmlParts;
        this.error = void 0;
        this.expressions = expressions.map((expression) => {
          if (isPromise(expression)) {
            return Promise.resolve(expression).catch((err) => {
              if (!this.error) {
                this.error = err;
                throw err;
              }
            });
          }
          return expression;
        });
      }
      render(destination) {
        const { htmlParts, expressions } = this;
        for (let i5 = 0; i5 < htmlParts.length; i5++) {
          const html = htmlParts[i5];
          if (html) {
            destination.write(markHTMLString(html));
          }
          if (i5 >= expressions.length) break;
          const exp = expressions[i5];
          if (!(exp || exp === 0)) continue;
          const result = renderChild(destination, exp);
          if (isPromise(result)) {
            const startIdx = i5 + 1;
            const remaining = expressions.length - startIdx;
            const flushers = new Array(remaining);
            for (let j5 = 0; j5 < remaining; j5++) {
              const rExp = expressions[startIdx + j5];
              flushers[j5] = createBufferedRenderer(destination, (bufferDestination) => {
                if (rExp || rExp === 0) {
                  return renderChild(bufferDestination, rExp);
                }
              });
            }
            return result.then(() => {
              let k4 = 0;
              const iterate = () => {
                while (k4 < flushers.length) {
                  const rHtml = htmlParts[startIdx + k4];
                  if (rHtml) {
                    destination.write(markHTMLString(rHtml));
                  }
                  const flushResult = flushers[k4++].flush();
                  if (isPromise(flushResult)) {
                    return flushResult.then(iterate);
                  }
                }
                const lastHtml = htmlParts[htmlParts.length - 1];
                if (lastHtml) {
                  destination.write(markHTMLString(lastHtml));
                }
              };
              return iterate();
            });
          }
        }
      }
    };
    slotString = /* @__PURE__ */ Symbol.for("astro:slot-string");
    SlotString = class extends HTMLString {
      instructions;
      [slotString];
      constructor(content, instructions) {
        super(content);
        this.instructions = instructions;
        this[slotString] = true;
      }
    };
    internalProps = /* @__PURE__ */ new Set([
      "server:component-path",
      "server:component-export",
      "server:component-directive",
      "server:defer"
    ]);
    ServerIslandComponent = class {
      result;
      props;
      slots;
      displayName;
      hostId;
      islandContent;
      componentPath;
      componentExport;
      componentId;
      constructor(result, props, slots, displayName) {
        this.result = result;
        this.props = props;
        this.slots = slots;
        this.displayName = displayName;
      }
      async init() {
        const content = await this.getIslandContent();
        if (this.result.cspDestination) {
          this.result._metadata.extraScriptHashes.push(
            await generateCspDigest(SERVER_ISLAND_REPLACER, this.result.cspAlgorithm)
          );
          const contentDigest = await generateCspDigest(content, this.result.cspAlgorithm);
          this.result._metadata.extraScriptHashes.push(contentDigest);
        }
        return createThinHead();
      }
      async render(destination) {
        const hostId = await this.getHostId();
        const islandContent = await this.getIslandContent();
        destination.write(createRenderInstruction({ type: "server-island-runtime" }));
        destination.write("<!--[if astro]>server-island-start<![endif]-->");
        for (const name in this.slots) {
          if (name === "fallback") {
            await renderChild(destination, this.slots.fallback(this.result));
          }
        }
        destination.write(
          `<script type="module" data-astro-rerun data-island-id="${hostId}">${islandContent}</script>`
        );
      }
      getComponentPath() {
        if (this.componentPath) {
          return this.componentPath;
        }
        const componentPath = this.props["server:component-path"];
        if (!componentPath) {
          throw new Error(`Could not find server component path`);
        }
        this.componentPath = componentPath;
        return componentPath;
      }
      getComponentExport() {
        if (this.componentExport) {
          return this.componentExport;
        }
        const componentExport = this.props["server:component-export"];
        if (!componentExport) {
          throw new Error(`Could not find server component export`);
        }
        this.componentExport = componentExport;
        return componentExport;
      }
      async getHostId() {
        if (!this.hostId) {
          this.hostId = await crypto.randomUUID();
        }
        return this.hostId;
      }
      async getIslandContent() {
        if (this.islandContent) {
          return this.islandContent;
        }
        const componentPath = this.getComponentPath();
        const componentExport = this.getComponentExport();
        const serverIslandNameMap2 = await this.result.getServerIslandNameMap();
        let componentId = serverIslandNameMap2.get(componentPath);
        if (!componentId) {
          throw new Error(`Could not find server component name ${componentPath}`);
        }
        for (const key2 of Object.keys(this.props)) {
          if (internalProps.has(key2)) {
            delete this.props[key2];
          }
        }
        const renderedSlots = {};
        for (const name in this.slots) {
          if (name !== "fallback") {
            const content = await renderSlotToString(this.result, this.slots[name]);
            let slotHtml = content.toString();
            const slotContent = content;
            if (Array.isArray(slotContent.instructions)) {
              for (const instruction of slotContent.instructions) {
                if (instruction.type === "script") {
                  slotHtml += instruction.content;
                }
              }
            }
            renderedSlots[name] = slotHtml;
          }
        }
        const key = await this.result.key;
        const componentExportEncrypted = await encryptString(
          key,
          componentExport,
          `export:${componentId}`
        );
        const propsEncrypted = Object.keys(this.props).length === 0 ? "" : await encryptString(key, JSON.stringify(this.props), `props:${componentId}`);
        const slotsEncrypted = Object.keys(renderedSlots).length === 0 ? "" : await encryptString(key, JSON.stringify(renderedSlots), `slots:${componentId}`);
        const hostId = await this.getHostId();
        const slash2 = this.result.base.endsWith("/") ? "" : "/";
        let serverIslandUrl = `${this.result.base}${slash2}_server-islands/${componentId}${this.result.trailingSlash === "always" ? "/" : ""}`;
        const potentialSearchParams = createSearchParams(
          componentExportEncrypted,
          propsEncrypted,
          slotsEncrypted
        );
        const useGETRequest = isWithinURLLimit(serverIslandUrl, potentialSearchParams);
        if (useGETRequest) {
          serverIslandUrl += "?" + potentialSearchParams.toString();
          this.result._metadata.extraHead.push(
            markHTMLString(
              `<link rel="preload" as="fetch" href="${serverIslandUrl}" crossorigin="anonymous">`
            )
          );
        }
        const adapterHeaders = this.result.internalFetchHeaders || {};
        const headersJson = stringifyForScript(adapterHeaders);
        const method = useGETRequest ? (
          // GET request
          `const headers = new Headers(${headersJson});
let response = await fetch('${serverIslandUrl}', { headers });`
        ) : (
          // POST request
          `let data = {
	encryptedComponentExport: ${stringifyForScript(componentExportEncrypted)},
	encryptedProps: ${stringifyForScript(propsEncrypted)},
	encryptedSlots: ${stringifyForScript(slotsEncrypted)},
};
const headers = new Headers({ 'Content-Type': 'application/json', ...${headersJson} });
let response = await fetch('${serverIslandUrl}', {
	method: 'POST',
	body: JSON.stringify(data),
	headers,
});`
        );
        this.islandContent = `${method}replaceServerIsland('${hostId}', response);`;
        return this.islandContent;
      }
    };
    renderServerIslandRuntime = () => {
      return `<script>${SERVER_ISLAND_REPLACER}</script>`;
    };
    SERVER_ISLAND_REPLACER = markHTMLString(
      `async function replaceServerIsland(id, r) {
	let s = document.querySelector(\`script[data-island-id="\${id}"]\`);
	// If there's no matching script, or the request fails then return
	if (!s || r.status !== 200 || r.headers.get('content-type')?.split(';')[0].trim() !== 'text/html') return;
	// Load the HTML before modifying the DOM in case of errors
	let html = await r.text();
	// Remove any placeholder content before the island script
	while (s.previousSibling && s.previousSibling.nodeType !== 8 && s.previousSibling.data !== '[if astro]>server-island-start<![endif]')
		s.previousSibling.remove();
	s.previousSibling?.remove();
	// Insert the new HTML
	s.before(document.createRange().createContextualFragment(html));
	// Remove the script. Prior to v5.4.2, this was the trick to force rerun of scripts.  Keeping it to minimize change to the existing behavior.
	s.remove();
}`.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("//")).join(" ")
    );
    Fragment = /* @__PURE__ */ Symbol.for("astro:fragment");
    Renderer = /* @__PURE__ */ Symbol.for("astro:renderer");
    encoder = new TextEncoder();
    decoder2 = new TextDecoder();
    astroComponentInstanceSym = /* @__PURE__ */ Symbol.for("astro.componentInstance");
    AstroComponentInstance = class {
      [astroComponentInstanceSym] = true;
      result;
      props;
      slotValues;
      factory;
      returnValue;
      constructor(result, props, slots, factory) {
        this.result = result;
        this.props = props;
        this.factory = factory;
        this.slotValues = {};
        for (const name in slots) {
          let didRender = false;
          let value = slots[name](result);
          this.slotValues[name] = () => {
            if (!didRender) {
              didRender = true;
              return value;
            }
            return slots[name](result);
          };
        }
      }
      init(result) {
        if (this.returnValue !== void 0) {
          return this.returnValue;
        }
        this.returnValue = this.factory(result, this.props, this.slotValues);
        if (isPromise(this.returnValue)) {
          this.returnValue.then((resolved) => {
            this.returnValue = resolved;
          }).catch(() => {
          });
        }
        return this.returnValue;
      }
      render(destination) {
        const returnValue = this.init(this.result);
        if (isPromise(returnValue)) {
          return returnValue.then((x4) => this.renderImpl(destination, x4));
        }
        return this.renderImpl(destination, returnValue);
      }
      renderImpl(destination, returnValue) {
        if (isHeadAndContent(returnValue)) {
          return returnValue.content.render(destination);
        } else {
          return renderChild(destination, returnValue);
        }
      }
    };
    DOCTYPE_EXP = /<!doctype html/i;
    needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
    rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
    clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
    ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
    ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
    ClientOnlyPlaceholder$1 = "astro-client-only";
    hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
    ClientOnlyPlaceholder = "astro-client-only";
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_".split("").reduce((v4, c4) => (v4[c4.charCodeAt(0)] = c4, v4), []);
    "-0123456789_".split("").reduce((v4, c4) => (v4[c4.charCodeAt(0)] = c4, v4), []);
    SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
    SERVER_ISLAND_COMPONENT = "_server-islands.astro";
    DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
    Router = class {
      #routes;
      #base;
      #baseWithoutTrailingSlash;
      #buildFormat;
      #trailingSlash;
      constructor(routes, options) {
        this.#routes = [...routes].sort(routeComparator);
        this.#base = normalizeBase(options.base);
        this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
        this.#buildFormat = options.buildFormat;
        this.#trailingSlash = options.trailingSlash;
      }
      /**
       * Match an input pathname against the route list.
       * If allowWithoutBase is true, a non-base-prefixed path is still considered.
       */
      match(inputPathname, { allowWithoutBase = false } = {}) {
        const normalized = getRedirectForPathname(inputPathname);
        if (normalized.redirect) {
          return { type: "redirect", location: normalized.redirect, status: 301 };
        }
        if (this.#base !== "/") {
          const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
          if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
            return { type: "redirect", location: baseWithSlash, status: 301 };
          }
          if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
            return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
          }
        }
        const baseResult = stripBase(
          normalized.pathname,
          this.#base,
          this.#baseWithoutTrailingSlash,
          this.#trailingSlash
        );
        if (!baseResult) {
          if (!allowWithoutBase) {
            return { type: "none", reason: "outside-base" };
          }
        }
        let pathname = baseResult ?? normalized.pathname;
        if (this.#buildFormat === "file") {
          pathname = normalizeFileFormatPathname(pathname);
        }
        const route = this.#routes.find((candidate) => {
          if (candidate.pattern.test(pathname)) return true;
          return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
        });
        if (!route) {
          return { type: "none", reason: "no-match" };
        }
        const params = getParams(route, pathname);
        return { type: "match", route, params, pathname };
      }
      /**
       * Returns all routes that match the given pathname, in priority order.
       * Used when the first match (e.g. a prerendered route) cannot serve
       * the request and subsequent matches need to be tried.
       */
      matchAll(inputPathname, { allowWithoutBase = false } = {}) {
        const normalized = getRedirectForPathname(inputPathname);
        if (normalized.redirect) {
          return [];
        }
        const baseResult = stripBase(
          normalized.pathname,
          this.#base,
          this.#baseWithoutTrailingSlash,
          this.#trailingSlash
        );
        if (!baseResult && !allowWithoutBase) {
          return [];
        }
        let pathname = baseResult ?? normalized.pathname;
        if (this.#buildFormat === "file") {
          pathname = normalizeFileFormatPathname(pathname);
        }
        return this.#routes.filter((candidate) => {
          if (candidate.pattern.test(pathname)) return true;
          return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
        });
      }
    };
    NodePool = class {
      textPool = [];
      htmlStringPool = [];
      componentPool = [];
      instructionPool = [];
      maxSize;
      enableStats;
      stats = {
        acquireFromPool: 0,
        acquireNew: 0,
        released: 0,
        releasedDropped: 0
      };
      /**
       * Creates a new object pool for queue nodes.
       *
       * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
       *   The cap is shared across all typed sub-pools.
       * @param enableStats - Enable statistics tracking (default: false for performance)
       */
      constructor(maxSize = 1e3, enableStats = false) {
        this.maxSize = maxSize;
        this.enableStats = enableStats;
      }
      /**
       * Acquires a queue node from the pool or creates a new one if the pool is empty.
       * Pops from the type-specific sub-pool to reuse an existing object when available.
       *
       * @param type - The type of queue node to acquire
       * @param content - Optional content to set on the node (for text or html-string types)
       * @returns A queue node ready to be populated with data
       */
      acquire(type, content) {
        const pooledNode = this.popFromTypedPool(type);
        if (pooledNode) {
          if (this.enableStats) {
            this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
          }
          this.resetNodeContent(pooledNode, type, content);
          return pooledNode;
        }
        if (this.enableStats) {
          this.stats.acquireNew = this.stats.acquireNew + 1;
        }
        return this.createNode(type, content);
      }
      /**
       * Creates a new node of the specified type with the given content.
       * Helper method to reduce branching in acquire().
       */
      createNode(type, content = "") {
        switch (type) {
          case "text":
            return { type: "text", content };
          case "html-string":
            return { type: "html-string", html: content };
          case "component":
            return { type: "component", instance: void 0 };
          case "instruction":
            return { type: "instruction", instruction: void 0 };
        }
      }
      /**
       * Pops a node from the type-specific sub-pool.
       * Returns undefined if the sub-pool for the requested type is empty.
       */
      popFromTypedPool(type) {
        switch (type) {
          case "text":
            return this.textPool.pop();
          case "html-string":
            return this.htmlStringPool.pop();
          case "component":
            return this.componentPool.pop();
          case "instruction":
            return this.instructionPool.pop();
        }
      }
      /**
       * Resets the content/value field on a reused pooled node.
       * The type discriminant is already correct since we pop from the matching sub-pool.
       */
      resetNodeContent(node, type, content) {
        switch (type) {
          case "text":
            node.content = content ?? "";
            break;
          case "html-string":
            node.html = content ?? "";
            break;
          case "component":
            node.instance = void 0;
            break;
          case "instruction":
            node.instruction = void 0;
            break;
        }
      }
      /**
       * Returns the total number of nodes across all typed sub-pools.
       */
      totalPoolSize() {
        return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
      }
      /**
       * Releases a queue node back to the pool for reuse.
       * If the pool is at max capacity, the node is discarded (will be GC'd).
       *
       * @param node - The node to release back to the pool
       */
      release(node) {
        if (this.totalPoolSize() >= this.maxSize) {
          if (this.enableStats) {
            this.stats.releasedDropped = this.stats.releasedDropped + 1;
          }
          return;
        }
        switch (node.type) {
          case "text":
            node.content = "";
            this.textPool.push(node);
            break;
          case "html-string":
            node.html = "";
            this.htmlStringPool.push(node);
            break;
          case "component":
            node.instance = void 0;
            this.componentPool.push(node);
            break;
          case "instruction":
            node.instruction = void 0;
            this.instructionPool.push(node);
            break;
        }
        if (this.enableStats) {
          this.stats.released = this.stats.released + 1;
        }
      }
      /**
       * Releases all nodes in an array back to the pool.
       * This is a convenience method for releasing multiple nodes at once.
       *
       * @param nodes - Array of nodes to release
       */
      releaseAll(nodes) {
        for (const node of nodes) {
          this.release(node);
        }
      }
      /**
       * Clears all typed sub-pools, discarding all cached nodes.
       * This can be useful if you want to free memory after a large render.
       */
      clear() {
        this.textPool.length = 0;
        this.htmlStringPool.length = 0;
        this.componentPool.length = 0;
        this.instructionPool.length = 0;
      }
      /**
       * Gets the current total number of nodes across all typed sub-pools.
       * Useful for monitoring pool usage and tuning maxSize.
       *
       * @returns Number of nodes currently available in the pool
       */
      size() {
        return this.totalPoolSize();
      }
      /**
       * Gets pool statistics for debugging.
       *
       * @returns Pool usage statistics including computed metrics
       */
      getStats() {
        return {
          ...this.stats,
          poolSize: this.totalPoolSize(),
          maxSize: this.maxSize,
          hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
        };
      }
      /**
       * Resets pool statistics.
       */
      resetStats() {
        this.stats = {
          acquireFromPool: 0,
          acquireNew: 0,
          released: 0,
          releasedDropped: 0
        };
      }
    };
    HTMLStringCache = class {
      cache = /* @__PURE__ */ new Map();
      maxSize;
      constructor(maxSize = 1e3) {
        this.maxSize = maxSize;
        this.warm(COMMON_HTML_PATTERNS);
      }
      /**
       * Get or create an HTMLString for the given content.
       * If cached, the existing object is returned and moved to end (most recently used).
       * If not cached, a new HTMLString is created, cached, and returned.
       *
       * @param content - The HTML string content
       * @returns HTMLString object (cached or newly created)
       */
      getOrCreate(content) {
        const cached = this.cache.get(content);
        if (cached) {
          this.cache.delete(content);
          this.cache.set(content, cached);
          return cached;
        }
        const htmlString = new HTMLString(content);
        this.cache.set(content, htmlString);
        if (this.cache.size > this.maxSize) {
          const firstKey = this.cache.keys().next().value;
          if (firstKey !== void 0) {
            this.cache.delete(firstKey);
          }
        }
        return htmlString;
      }
      /**
       * Get current cache size
       */
      size() {
        return this.cache.size;
      }
      /**
       * Pre-warms the cache with common HTML patterns.
       * This ensures first-render cache hits for frequently used tags.
       *
       * @param patterns - Array of HTML strings to pre-cache
       */
      warm(patterns) {
        for (const pattern of patterns) {
          if (!this.cache.has(pattern)) {
            this.cache.set(pattern, new HTMLString(pattern));
          }
        }
      }
      /**
       * Clear the entire cache
       */
      clear() {
        this.cache.clear();
      }
    };
    COMMON_HTML_PATTERNS = [
      // Structural elements
      "<div>",
      "</div>",
      "<span>",
      "</span>",
      "<p>",
      "</p>",
      "<section>",
      "</section>",
      "<article>",
      "</article>",
      "<header>",
      "</header>",
      "<footer>",
      "</footer>",
      "<nav>",
      "</nav>",
      "<main>",
      "</main>",
      "<aside>",
      "</aside>",
      // List elements
      "<ul>",
      "</ul>",
      "<ol>",
      "</ol>",
      "<li>",
      "</li>",
      // Void/self-closing elements
      "<br>",
      "<hr>",
      "<br/>",
      "<hr/>",
      // Heading elements
      "<h1>",
      "</h1>",
      "<h2>",
      "</h2>",
      "<h3>",
      "</h3>",
      "<h4>",
      "</h4>",
      // Inline elements
      "<a>",
      "</a>",
      "<strong>",
      "</strong>",
      "<em>",
      "</em>",
      "<code>",
      "</code>",
      // Common whitespace
      " ",
      "\n"
    ];
    FORBIDDEN_PATH_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
    dateTimeFormat = new Intl.DateTimeFormat([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    });
    levels = {
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      silent: 90
    };
    AstroLogger = class {
      options;
      constructor(options) {
        this.options = options;
      }
      info(label, message, newLine = true) {
        info(this.options, label, message, newLine);
      }
      warn(label, message, newLine = true) {
        warn(this.options, label, message, newLine);
      }
      error(label, message, newLine = true) {
        error(this.options, label, message, newLine);
      }
      debug(label, ...messages) {
        debug(label, ...messages);
      }
      level() {
        return this.options.level;
      }
      forkIntegrationLogger(label) {
        return new AstroIntegrationLogger(this.options, label);
      }
      setDestination(destination) {
        this.options.destination = destination;
      }
      /**
       * It calls the `close` function of the provided destination, if it exists.
       */
      close() {
        if (this.options.destination.close) {
          this.options.destination.close();
        }
      }
      /**
       * It calls the `flush` function of the provided destination, if it exists.
       */
      flush() {
        if (this.options.destination.flush) {
          this.options.destination.flush();
        }
      }
    };
    AstroIntegrationLogger = class _AstroIntegrationLogger {
      options;
      label;
      constructor(logging, label) {
        this.options = logging;
        this.label = label;
      }
      /**
       * Creates a new logger instance with a new label, but the same log options.
       */
      fork(label) {
        return new _AstroIntegrationLogger(this.options, label);
      }
      info(message) {
        info(this.options, this.label, message);
      }
      warn(message) {
        warn(this.options, this.label, message);
      }
      error(message) {
        error(this.options, this.label, message);
      }
      debug(message) {
        debug(this.label, message);
      }
      /**
       * It calls the `flush` function of the provided destination, if it exists.
       */
      flush() {
        if (this.options.destination.flush) {
          this.options.destination.flush();
        }
      }
      /**
       * It calls the `close` function of the provided destination, if it exists.
       */
      close() {
        if (this.options.destination.close) {
          this.options.destination.close();
        }
      }
    };
    SGR_REGEX = new RegExp(`${String.fromCharCode(27)}\\[[0-9;]*m`, "g");
    PipelineFeatures = {
      redirects: 1 << 0,
      sessions: 1 << 1,
      actions: 1 << 2,
      middleware: 1 << 3,
      i18n: 1 << 4,
      cache: 1 << 5
    };
    ALL_PIPELINE_FEATURES = PipelineFeatures.redirects | PipelineFeatures.sessions | PipelineFeatures.actions | PipelineFeatures.middleware | PipelineFeatures.i18n | PipelineFeatures.cache;
    Pipeline = class {
      internalMiddleware;
      resolvedMiddleware = void 0;
      resolvedLogger = false;
      resolvedActions = void 0;
      resolvedSessionDriver = void 0;
      resolvedCacheProvider = void 0;
      compiledCacheRoutes = void 0;
      nodePool;
      htmlStringCache;
      /**
       * Bit mask of pipeline features activated by handler classes.
       * Each handler sets its bit via `|=`. Only meaningful when a
       * custom `src/app.ts` fetch handler is in use.
       */
      usedFeatures = 0;
      logger;
      manifest;
      /**
       * "development" or "production" only
       */
      runtimeMode;
      renderers;
      resolve;
      streaming;
      /**
       * Used to provide better error messages for `Astro.clientAddress`
       */
      adapterName;
      clientDirectives;
      inlinedScripts;
      compressHTML;
      i18n;
      middleware;
      routeCache;
      /**
       * Used for `Astro.site`.
       */
      site;
      /**
       * Array of built-in, internal, routes.
       * Used to find the route module
       */
      defaultRoutes;
      actions;
      sessionDriver;
      cacheProvider;
      cacheConfig;
      serverIslands;
      /** Route data derived from the manifest, used for route matching. */
      manifestData;
      /** Pattern-matching router built from manifestData. */
      #router;
      constructor(logger, manifest2, runtimeMode, renderers2, resolve, streaming, adapterName = manifest2.adapterName, clientDirectives = manifest2.clientDirectives, inlinedScripts = manifest2.inlinedScripts, compressHTML = manifest2.compressHTML, i18n = manifest2.i18n, middleware = manifest2.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest2.site ? new URL(manifest2.site) : void 0, defaultRoutes = createDefaultRoutes(manifest2), actions = manifest2.actions, sessionDriver = manifest2.sessionDriver, cacheProvider = manifest2.cacheProvider, cacheConfig = manifest2.cacheConfig, serverIslands = manifest2.serverIslandMappings) {
        this.logger = logger;
        this.manifest = manifest2;
        this.runtimeMode = runtimeMode;
        this.renderers = renderers2;
        this.resolve = resolve;
        this.streaming = streaming;
        this.adapterName = adapterName;
        this.clientDirectives = clientDirectives;
        this.inlinedScripts = inlinedScripts;
        this.compressHTML = compressHTML;
        this.i18n = i18n;
        this.middleware = middleware;
        this.routeCache = routeCache;
        this.site = site;
        this.defaultRoutes = defaultRoutes;
        this.actions = actions;
        this.sessionDriver = sessionDriver;
        this.cacheProvider = cacheProvider;
        this.cacheConfig = cacheConfig;
        this.serverIslands = serverIslands;
        this.manifestData = { routes: (manifest2.routes ?? []).map((route) => route.routeData) };
        ensure404Route(this.manifestData);
        this.#router = new Router(this.manifestData.routes, {
          base: manifest2.base,
          trailingSlash: manifest2.trailingSlash,
          buildFormat: manifest2.buildFormat
        });
        this.internalMiddleware = [];
        if (manifest2.experimentalQueuedRendering.enabled) {
          this.nodePool = this.createNodePool(
            manifest2.experimentalQueuedRendering.poolSize ?? 1e3,
            false
          );
          if (manifest2.experimentalQueuedRendering.contentCache) {
            this.htmlStringCache = this.createStringCache();
          }
        }
      }
      /**
       * Low-level route matching against the manifest routes. Returns the
       * matched `RouteData` or `undefined`. Does not filter prerendered
       * routes or check public assets — use `BaseApp.match()` for that.
       */
      matchRoute(pathname) {
        const match = this.#router.match(pathname, { allowWithoutBase: true });
        if (match.type !== "match") return void 0;
        return match.route;
      }
      /**
       * Returns all routes matching the given pathname, in priority order.
       * Used when the first match cannot serve the request (e.g. a
       * prerendered dynamic route that doesn't cover this specific path)
       * and the caller needs to try subsequent matches.
       */
      matchAllRoutes(pathname) {
        return this.#router.matchAll(pathname, { allowWithoutBase: true });
      }
      /**
       * Rebuilds the internal router after routes have been added or
       * removed (e.g. by the dev server on HMR).
       */
      rebuildRouter() {
        this.#router = new Router(this.manifestData.routes, {
          base: this.manifest.base,
          trailingSlash: this.manifest.trailingSlash,
          buildFormat: this.manifest.buildFormat
        });
      }
      /**
       * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
       * it returns a no-op function
       */
      async getMiddleware() {
        if (this.resolvedMiddleware) {
          return this.resolvedMiddleware;
        }
        if (this.middleware) {
          const middlewareInstance = await this.middleware();
          const onRequest2 = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
          const internalMiddlewares = [onRequest2];
          if (this.manifest.checkOrigin) {
            internalMiddlewares.unshift(createOriginCheckMiddleware());
          }
          this.resolvedMiddleware = sequence(...internalMiddlewares);
          return this.resolvedMiddleware;
        } else {
          this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
          return this.resolvedMiddleware;
        }
      }
      /**
       * Clears the cached middleware so it is re-resolved on the next request.
       * Called via HMR when middleware files change during development.
       */
      clearMiddleware() {
        this.resolvedMiddleware = void 0;
      }
      /**
       * Resolves the logger destination from the manifest and updates the pipeline logger.
       * If the user configured `experimental.logger`, the bundled logger factory is loaded
       * and replaces the default console destination. This is lazy and only resolves once.
       */
      async getLogger() {
        if (this.resolvedLogger) {
          return this.logger;
        }
        this.resolvedLogger = true;
        if (this.manifest.experimentalLogger) {
          this.logger = await loadLogger(this.manifest.experimentalLogger);
        }
        return this.logger;
      }
      async getActions() {
        if (this.resolvedActions) {
          return this.resolvedActions;
        } else if (this.actions) {
          this.resolvedActions = await this.actions();
          return this.resolvedActions;
        }
        return NOOP_ACTIONS_MOD;
      }
      async getSessionDriver() {
        if (this.resolvedSessionDriver !== void 0) {
          return this.resolvedSessionDriver;
        }
        if (this.sessionDriver) {
          const driverModule = await this.sessionDriver();
          this.resolvedSessionDriver = driverModule?.default || null;
          return this.resolvedSessionDriver;
        }
        this.resolvedSessionDriver = null;
        return null;
      }
      async getCacheProvider() {
        if (this.resolvedCacheProvider !== void 0) {
          return this.resolvedCacheProvider;
        }
        if (this.cacheProvider) {
          const mod = await this.cacheProvider();
          const factory = mod?.default || null;
          this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
          return this.resolvedCacheProvider;
        }
        this.resolvedCacheProvider = null;
        return null;
      }
      async getServerIslands() {
        if (this.serverIslands) {
          return this.serverIslands();
        }
        return {
          serverIslandMap: /* @__PURE__ */ new Map(),
          serverIslandNameMap: /* @__PURE__ */ new Map()
        };
      }
      async getAction(path) {
        const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
        let { server: server2 } = await this.getActions();
        if (!server2 || !(typeof server2 === "object")) {
          throw new TypeError(
            `Expected \`server\` export in actions file to be an object. Received ${typeof server2}.`
          );
        }
        for (const key of pathKeys) {
          if (FORBIDDEN_PATH_KEYS.has(key)) {
            throw new AstroError({
              ...ActionNotFoundError,
              message: ActionNotFoundError.message(pathKeys.join("."))
            });
          }
          if (!Object.hasOwn(server2, key)) {
            throw new AstroError({
              ...ActionNotFoundError,
              message: ActionNotFoundError.message(pathKeys.join("."))
            });
          }
          server2 = server2[key];
        }
        if (typeof server2 !== "function") {
          throw new TypeError(
            `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server2}.`
          );
        }
        return server2;
      }
      async getModuleForRoute(route) {
        for (const defaultRoute of this.defaultRoutes) {
          if (route.component === defaultRoute.component) {
            return {
              page: () => Promise.resolve(defaultRoute.instance)
            };
          }
        }
        if (route.type === "redirect") {
          return RedirectSinglePageBuiltModule;
        } else {
          if (this.manifest.pageMap) {
            const importComponentInstance = this.manifest.pageMap.get(route.component);
            if (!importComponentInstance) {
              throw new Error(
                `Unexpectedly unable to find a component instance for route ${route.route}`
              );
            }
            return await importComponentInstance();
          } else if (this.manifest.pageModule) {
            return this.manifest.pageModule;
          }
          throw new Error(
            "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
          );
        }
      }
      createNodePool(poolSize, stats) {
        return new NodePool(poolSize, stats);
      }
      createStringCache() {
        return new HTMLStringCache(1e3);
      }
    };
    Slots = class {
      #result;
      #slots;
      #logger;
      constructor(result, slots, logger) {
        this.#result = result;
        this.#slots = slots;
        this.#logger = logger;
        if (slots) {
          for (const key of Object.keys(slots)) {
            if (this[key] !== void 0) {
              throw new AstroError({
                ...ReservedSlotName,
                message: ReservedSlotName.message(key)
              });
            }
            Object.defineProperty(this, key, {
              get() {
                return true;
              },
              enumerable: true
            });
          }
        }
      }
      has(name) {
        if (!this.#slots) return false;
        return Boolean(this.#slots[name]);
      }
      async render(name, args = []) {
        if (!this.#slots || !this.has(name)) return;
        const result = this.#result;
        if (!Array.isArray(args)) {
          this.#logger.warn(
            null,
            `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
          );
        } else if (args.length > 0) {
          const slotValue = this.#slots[name];
          const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
          const expression = getFunctionExpression(component);
          if (expression) {
            const slot = async () => typeof expression === "function" ? expression(...args) : expression;
            return await renderSlotToString(result, slot).then((res) => {
              return res;
            });
          }
          if (typeof component === "function") {
            return await renderJSX(result, component(...args)).then(
              (res) => res != null ? String(res) : res
            );
          }
        }
        const content = await renderSlotToString(result, this.#slots[name]);
        const outHTML = chunkToString(result, content);
        return outHTML;
      }
    };
    I18nRouter = class {
      #strategy;
      #defaultLocale;
      #locales;
      #base;
      #domains;
      constructor(options) {
        this.#strategy = options.strategy;
        this.#defaultLocale = options.defaultLocale;
        this.#locales = options.locales;
        this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
        this.#domains = options.domains;
      }
      /**
       * Evaluate routing strategy for a pathname.
       * Returns decision object (not HTTP Response).
       */
      match(pathname, context) {
        if (this.shouldSkipProcessing(pathname, context)) {
          return { type: "continue" };
        }
        switch (this.#strategy) {
          case "manual":
            return { type: "continue" };
          case "pathname-prefix-always":
            return this.matchPrefixAlways(pathname, context);
          case "domains-prefix-always":
            if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
              return { type: "continue" };
            }
            return this.matchPrefixAlways(pathname, context);
          case "pathname-prefix-other-locales":
            return this.matchPrefixOtherLocales(pathname, context);
          case "domains-prefix-other-locales":
            if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
              return { type: "continue" };
            }
            return this.matchPrefixOtherLocales(pathname, context);
          case "pathname-prefix-always-no-redirect":
            return this.matchPrefixAlwaysNoRedirect(pathname, context);
          case "domains-prefix-always-no-redirect":
            if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
              return { type: "continue" };
            }
            return this.matchPrefixAlwaysNoRedirect(pathname, context);
          default:
            return { type: "continue" };
        }
      }
      /**
       * Check if i18n processing should be skipped for this request
       */
      shouldSkipProcessing(pathname, context) {
        if (pathname.includes("/404") || pathname.includes("/500")) {
          return true;
        }
        if (pathname.includes("/_server-islands/")) {
          return true;
        }
        if (context.isReroute) {
          return true;
        }
        if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
          return true;
        }
        return false;
      }
      /**
       * Strategy: pathname-prefix-always
       * All locales must have a prefix, including the default locale.
       */
      matchPrefixAlways(pathname, _context) {
        const isRoot = pathname === this.#base + "/" || pathname === this.#base;
        if (isRoot) {
          const basePrefix = this.#base === "/" ? "" : this.#base;
          return {
            type: "redirect",
            location: `${basePrefix}/${this.#defaultLocale}`
          };
        }
        if (!pathHasLocale(pathname, this.#locales)) {
          return { type: "notFound" };
        }
        return { type: "continue" };
      }
      /**
       * Strategy: pathname-prefix-other-locales
       * Default locale has no prefix, other locales must have a prefix.
       */
      matchPrefixOtherLocales(pathname, _context) {
        let pathnameContainsDefaultLocale = false;
        for (const segment of pathname.split("/")) {
          if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
            pathnameContainsDefaultLocale = true;
            break;
          }
        }
        if (pathnameContainsDefaultLocale) {
          const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
          return {
            type: "notFound",
            location: newLocation
          };
        }
        return { type: "continue" };
      }
      /**
       * Strategy: pathname-prefix-always-no-redirect
       * Like prefix-always but allows root to serve instead of redirecting
       */
      matchPrefixAlwaysNoRedirect(pathname, _context) {
        const isRoot = pathname === this.#base + "/" || pathname === this.#base;
        if (isRoot) {
          return { type: "continue" };
        }
        if (!pathHasLocale(pathname, this.#locales)) {
          return { type: "notFound" };
        }
        return { type: "continue" };
      }
      /**
       * Check if the current locale doesn't belong to the configured domain.
       * Used for domain-based routing strategies.
       */
      localeHasntDomain(currentLocale, currentDomain) {
        if (!this.#domains || !currentDomain) {
          return false;
        }
        if (!currentLocale) {
          return false;
        }
        const localesForDomain = this.#domains[currentDomain];
        if (!localesForDomain) {
          return true;
        }
        return !localesForDomain.includes(currentLocale);
      }
    };
    I18n = class {
      #i18n;
      #base;
      #trailingSlash;
      #format;
      #router;
      constructor(i18n, base, trailingSlash, format) {
        this.#i18n = i18n;
        this.#base = base;
        this.#trailingSlash = trailingSlash;
        this.#format = format;
        this.#router = new I18nRouter({
          strategy: i18n.strategy,
          defaultLocale: i18n.defaultLocale,
          locales: i18n.locales,
          base,
          domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
            (acc, domain) => {
              const locale = i18n.domainLookupTable[domain];
              if (!acc[domain]) {
                acc[domain] = [];
              }
              acc[domain].push(locale);
              return acc;
            },
            {}
          ) : void 0
        });
      }
      async finalize(state, response) {
        state.pipeline.usedFeatures |= PipelineFeatures.i18n;
        const i18n = this.#i18n;
        const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
        if (typeHeader) {
          response.headers.delete(ROUTE_TYPE_HEADER);
        }
        const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
        if (isReroute === "no" && typeof i18n.fallback === "undefined") {
          return response;
        }
        if (typeHeader !== "page" && typeHeader !== "fallback") {
          return response;
        }
        const url = new URL(state.request.url);
        const currentLocale = state.computeCurrentLocale();
        const isPrerendered = state.routeData.prerender;
        const routerContext = {
          currentLocale,
          currentDomain: url.hostname,
          routeType: typeHeader,
          isReroute: isReroute === "yes"
        };
        const routeDecision = this.#router.match(url.pathname, routerContext);
        switch (routeDecision.type) {
          case "redirect": {
            let location = routeDecision.location;
            if (shouldAppendForwardSlash(this.#trailingSlash, this.#format)) {
              location = appendForwardSlash(location);
            }
            return new Response(null, {
              status: routeDecision.status ?? 302,
              headers: { Location: location }
            });
          }
          case "notFound": {
            if (isPrerendered) {
              const prerenderedRes = new Response(response.body, {
                status: 404,
                headers: response.headers
              });
              prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
              if (routeDecision.location) {
                prerenderedRes.headers.set("Location", routeDecision.location);
              }
              return prerenderedRes;
            }
            const headers = new Headers();
            if (routeDecision.location) {
              headers.set("Location", routeDecision.location);
            }
            return new Response(null, { status: 404, headers });
          }
        }
        if (i18n.fallback && i18n.fallbackType) {
          const effectiveStatus = typeHeader === "fallback" ? 404 : response.status;
          const fallbackDecision = computeFallbackRoute({
            pathname: url.pathname,
            responseStatus: effectiveStatus,
            fallback: i18n.fallback,
            fallbackType: i18n.fallbackType,
            locales: i18n.locales,
            defaultLocale: i18n.defaultLocale,
            strategy: i18n.strategy,
            base: this.#base
          });
          switch (fallbackDecision.type) {
            case "redirect":
              return new Response(null, {
                status: 302,
                headers: { Location: fallbackDecision.pathname + url.search }
              });
            case "rewrite":
              return await state.rewrite(fallbackDecision.pathname + url.search);
          }
        }
        return response;
      }
    };
    EMPTY_OPTIONS = Object.freeze({ tags: [] });
    NoopAstroCache = class {
      enabled = false;
      set() {
      }
      get tags() {
        return [];
      }
      get options() {
        return EMPTY_OPTIONS;
      }
      async invalidate() {
      }
    };
    hasWarned = false;
    DisabledAstroCache = class {
      enabled = false;
      #logger;
      constructor(logger) {
        this.#logger = logger;
      }
      #warn() {
        if (!hasWarned) {
          hasWarned = true;
          this.#logger?.warn(
            "cache",
            "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
          );
        }
      }
      set() {
        this.#warn();
      }
      get tags() {
        return [];
      }
      get options() {
        return EMPTY_OPTIONS;
      }
      async invalidate() {
        throw new AstroError(CacheNotEnabled);
      }
    };
    AstroMiddleware = class {
      #pipeline;
      constructor(pipeline) {
        this.#pipeline = pipeline;
      }
      async handle(state, renderRouteCallback) {
        state.pipeline.usedFeatures |= PipelineFeatures.middleware;
        const pipeline = this.#pipeline;
        await state.getProps();
        const apiContext = state.getAPIContext();
        state.counter++;
        if (state.counter === 4) {
          return new Response("Loop Detected", {
            // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
            status: 508,
            statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
          });
        }
        const next = async (ctx, payload) => {
          if (payload) {
            pipeline.logger.debug("router", "Called rewriting to:", payload);
            const result = await pipeline.tryRewrite(payload, state.request);
            applyRewriteToState(state, payload, result);
          }
          return renderRouteCallback(state, ctx);
        };
        let response;
        if (state.skipMiddleware) {
          response = await next(apiContext);
        } else {
          const pipelineMiddleware = await pipeline.getMiddleware();
          const composed = sequence(...pipeline.internalMiddleware, pipelineMiddleware);
          response = await callMiddleware(composed, apiContext, next);
        }
        response = this.#finalize(state, response);
        state.response = response;
        return response;
      }
      #finalize(state, response) {
        attachCookiesToResponse(response, state.cookies);
        return response;
      }
    };
    EMPTY_SLOTS = Object.freeze({});
    PagesHandler = class {
      #pipeline;
      constructor(pipeline) {
        this.#pipeline = pipeline;
      }
      async handle(state, ctx) {
        const pipeline = this.#pipeline;
        const { logger, streaming } = pipeline;
        let response;
        const componentInstance = await state.loadComponentInstance();
        switch (state.routeData.type) {
          case "endpoint": {
            response = await renderEndpoint(
              componentInstance,
              ctx,
              state.routeData.prerender,
              logger
            );
            break;
          }
          case "page": {
            const props = await state.getProps();
            const actionApiContext = state.getActionAPIContext();
            const result = await state.createResult(componentInstance, actionApiContext);
            try {
              response = await renderPage(
                result,
                componentInstance?.default,
                props,
                state.slots ?? EMPTY_SLOTS,
                streaming,
                state.routeData
              );
            } catch (e4) {
              result.cancelled = true;
              throw e4;
            }
            response.headers.set(ROUTE_TYPE_HEADER, "page");
            if (state.routeData.route === "/404" || state.routeData.route === "/500") {
              response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
            }
            if (state.isRewriting) {
              response.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
            }
            break;
          }
          case "redirect": {
            return new Response(null, { status: 404, headers: { [ASTRO_ERROR_HEADER]: "true" } });
          }
          case "fallback": {
            return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
          }
        }
        const responseCookies = getCookiesFromResponse(response);
        if (responseCookies) {
          state.cookies.merge(responseCookies);
        }
        state.response = response;
        return response;
      }
    };
    Rewrites = class {
      async execute(state, payload) {
        const pipeline = state.pipeline;
        pipeline.logger.debug("router", "Calling rewrite: ", payload);
        const result = await pipeline.tryRewrite(payload, state.request);
        applyRewriteToState(state, payload, result, { mergeCookies: true });
        const middleware = new AstroMiddleware(pipeline);
        const pagesHandler = new PagesHandler(pipeline);
        return middleware.handle(state, pagesHandler.handle.bind(pagesHandler));
      }
    };
    renderOptionsSymbol = /* @__PURE__ */ Symbol.for("astro.renderOptions");
    FetchState = class {
      pipeline;
      /**
       * The request to render. Mutated during rewrites so subsequent renders
       * see the rewritten URL.
       */
      request;
      routeData;
      /**
       * The pathname to use for routing and rendering. Starts out as the raw,
       * base-stripped, decoded pathname from the request. May be further
       * normalized by `AstroHandler` after routeData is known (in dev, when
       * the matched route has no `.html` extension, `.html` / `/index.html`
       * suffixes are stripped).
       */
      pathname;
      /** Resolved render options (addCookieHeader, clientAddress, locals, etc.). */
      renderOptions;
      /** When the request started, used to log duration. */
      timeStart;
      /**
       * The route's loaded component module. Set before middleware runs; may
       * be swapped during in-flight rewrites from inside the middleware chain.
       */
      componentInstance;
      /**
       * Slot overrides supplied by the container API. `undefined` for HTTP
       * requests — `PagesHandler` coalesces to `{}` on read so we don't
       * allocate an empty object per request.
       */
      slots;
      /**
       * The `Response` produced by handlers, if any. Set after page
       * rendering or middleware completes.
       */
      response;
      /**
       * Default HTTP status for the rendered response. Callers override
       * before rendering runs (e.g. `AstroHandler` sets this from
       * `BaseApp.getDefaultStatusCode`; error handlers set `404` / `500`).
       */
      status = 200;
      /** Whether user middleware should be skipped for this request. */
      skipMiddleware = false;
      /** A flag that tells the render content if the rewriting was triggered. */
      isRewriting = false;
      /** A safety net in case of loops (rewrite counter). */
      counter = 0;
      /** Cookies for this request. Created lazily on first access. */
      cookies;
      /** Route params derived from routeData + pathname. Computed lazily. */
      #params;
      get params() {
        if (!this.#params && this.routeData) {
          this.#params = getParams(this.routeData, this.pathname);
        }
        return this.#params;
      }
      set params(value) {
        this.#params = value;
      }
      /** Normalized URL for this request. */
      url;
      /** Client address for this request. */
      clientAddress;
      /** Whether this is a partial render (container API). */
      partial;
      /** Whether to inject CSP meta tags. */
      shouldInjectCspMetaTags;
      /** Request-scoped locals object, shared with user middleware. */
      locals = {};
      /**
       * Memoized `props` (see `getProps`). `null` means "not yet computed"
       * — using `null` (rather than `undefined`) keeps the hidden class
       * stable and distinct from a valid-but-empty result.
       */
      props = null;
      /** Memoized `ActionAPIContext` (see `getActionAPIContext`). */
      actionApiContext = null;
      /** Memoized `APIContext` (see `getAPIContext`). */
      apiContext = null;
      /** Registered context providers keyed by name. Lazy-initialized on first provide(). */
      #providers;
      /** Cached values from resolved providers. Lazy-initialized on first resolve(). */
      #providersResolvedValues;
      /** Cached promise for lazy component instance loading. */
      #componentInstancePromise;
      /** SSR result for the current page render. */
      result;
      /** Initial props (from container/error handler). */
      initialProps = {};
      /** Rewrites handler instance. Lazy-initialized on first rewrite(). */
      #rewrites;
      /** Memoized Astro page partial. */
      #astroPagePartial;
      /**
       * Locale-prefixed pathname derived from the Host header for domain-based
       * i18n routing (e.g. `/en/boats/1/foo`), or `undefined` when the request
       * isn't served from a locale-mapped domain. When set, `this.pathname` is
       * derived from it so locale/param resolution match the route pattern.
       */
      #domainPathname;
      /** Memoized current locale. */
      #currentLocale;
      /** Memoized preferred locale. */
      #preferredLocale;
      /** Memoized preferred locale list. */
      #preferredLocaleList;
      constructor(pipeline, request, options) {
        this.pipeline = pipeline;
        this.request = request;
        options ??= getRenderOptions(request);
        this.routeData = options?.routeData;
        this.renderOptions = options ?? {
          addCookieHeader: false,
          clientAddress: void 0,
          locals: void 0,
          prerenderedErrorPageFetch: fetch,
          routeData: void 0,
          waitUntil: void 0
        };
        this.componentInstance = void 0;
        this.slots = void 0;
        const url = new URL(request.url);
        const domainPathname = computePathnameFromDomain(
          request,
          url,
          pipeline.manifest.i18n,
          pipeline.manifest.base,
          pipeline.manifest.trailingSlash,
          pipeline.logger
        );
        if (domainPathname) {
          this.#domainPathname = domainPathname;
          try {
            this.pathname = decodeURI(domainPathname);
          } catch {
            this.pathname = domainPathname;
          }
        } else {
          this.pathname = this.#computePathname(url);
        }
        this.timeStart = performance.now();
        this.clientAddress = options?.clientAddress;
        this.locals = options?.locals ?? {};
        this.url = normalizeUrl(url);
        this.cookies = new AstroCookies(request);
        if (pipeline.manifest.allowedDomains && pipeline.manifest.allowedDomains.length > 0) {
          this.#applyForwardedHeaders();
        }
        if (!Reflect.get(this.request, originPathnameSymbol)) {
          setOriginPathname(
            this.request,
            this.pathname,
            pipeline.manifest.trailingSlash,
            pipeline.manifest.buildFormat
          );
        }
        this.#resolveRouteData();
      }
      /**
       * Triggers a rewrite. Delegates to the Rewrites handler.
       */
      rewrite(payload) {
        return (this.#rewrites ??= new Rewrites()).execute(this, payload);
      }
      /**
       * Creates the SSR result for the current page render.
       */
      async createResult(mod, ctx) {
        const pipeline = this.pipeline;
        const { clientDirectives, inlinedScripts, compressHTML, manifest: manifest2, renderers: renderers2, resolve } = pipeline;
        const routeData = this.routeData;
        const { links, scripts, styles } = await pipeline.headElements(routeData);
        const extraStyleHashes = [];
        const extraScriptHashes = [];
        const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags ?? manifest2.shouldInjectCspMetaTags;
        const cspAlgorithm = manifest2.csp?.algorithm ?? "SHA-256";
        if (shouldInjectCspMetaTags) {
          for (const style of styles) {
            extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
          }
          for (const script of scripts) {
            extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
          }
        }
        const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest2.componentMetadata;
        const headers = new Headers({ "Content-Type": "text/html" });
        const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
        const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
        const status = this.status;
        const response = {
          status: actionResult?.error ? actionResult?.error.status : status,
          statusText: actionResult?.error ? actionResult?.error.type : "OK",
          get headers() {
            return headers;
          },
          set headers(_4) {
            throw new AstroError(AstroResponseHeadersReassigned);
          }
        };
        const state = this;
        const result = {
          base: manifest2.base,
          userAssetsBase: manifest2.userAssetsBase,
          cancelled: false,
          clientDirectives,
          inlinedScripts,
          componentMetadata,
          compressHTML,
          cookies: this.cookies,
          createAstro: (props, slots) => state.createAstro(result, props, slots, ctx),
          links,
          // SAFETY: createResult is only called after route resolution, so routeData
          // is always set and the params getter always returns a value.
          params: this.params,
          partial,
          pathname: this.pathname,
          renderers: renderers2,
          resolve,
          response,
          request: this.request,
          scripts,
          styles,
          actionResult,
          async getServerIslandNameMap() {
            const serverIslands = await pipeline.getServerIslands();
            return serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map();
          },
          key: manifest2.key,
          trailingSlash: manifest2.trailingSlash,
          _experimentalQueuedRendering: {
            pool: pipeline.nodePool,
            htmlStringCache: pipeline.htmlStringCache,
            enabled: manifest2.experimentalQueuedRendering?.enabled,
            poolSize: manifest2.experimentalQueuedRendering?.poolSize,
            contentCache: manifest2.experimentalQueuedRendering?.contentCache
          },
          _metadata: {
            hasHydrationScript: false,
            rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
            hasRenderedHead: false,
            renderedScripts: /* @__PURE__ */ new Set(),
            hasDirectives: /* @__PURE__ */ new Set(),
            hasRenderedServerIslandRuntime: false,
            headInTree: false,
            extraHead: [],
            extraStyleHashes,
            extraScriptHashes,
            propagators: /* @__PURE__ */ new Set(),
            templateDepth: 0
          },
          cspDestination: manifest2.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
          shouldInjectCspMetaTags,
          cspAlgorithm,
          scriptHashes: manifest2.csp?.scriptHashes ? [...manifest2.csp.scriptHashes] : [],
          scriptResources: manifest2.csp?.scriptResources ? [...manifest2.csp.scriptResources] : [],
          styleHashes: manifest2.csp?.styleHashes ? [...manifest2.csp.styleHashes] : [],
          styleResources: manifest2.csp?.styleResources ? [...manifest2.csp.styleResources] : [],
          directives: manifest2.csp?.directives ? [...manifest2.csp.directives] : [],
          isStrictDynamic: manifest2.csp?.isStrictDynamic ?? false,
          internalFetchHeaders: manifest2.internalFetchHeaders
        };
        this.result = result;
        return result;
      }
      /**
       * Creates the Astro global object for a component render.
       */
      createAstro(result, props, slotValues, apiContext) {
        let astroPagePartial;
        if (this.isRewriting) {
          this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
        }
        this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
        astroPagePartial = this.#astroPagePartial;
        const astroComponentPartial = { props, self: null };
        const Astro = Object.assign(
          Object.create(astroPagePartial),
          astroComponentPartial
        );
        let _slots;
        Object.defineProperty(Astro, "slots", {
          get: () => {
            if (!_slots) {
              _slots = new Slots(
                result,
                slotValues,
                this.pipeline.logger
              );
            }
            return _slots;
          }
        });
        return Astro;
      }
      /**
       * Creates the Astro page-level partial (prototype for Astro global).
       */
      createAstroPagePartial(result, apiContext) {
        const state = this;
        const { cookies, locals, params, pipeline, url } = this;
        const { response } = result;
        const redirect = (path, status = 302) => {
          if (state.request[responseSentSymbol$1]) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          return new Response(null, { status, headers: { Location: path } });
        };
        const rewrite = async (reroutePayload) => {
          return await state.rewrite(reroutePayload);
        };
        const callAction = createCallAction(apiContext);
        const partial = {
          generator: ASTRO_GENERATOR,
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          cookies,
          get clientAddress() {
            return state.getClientAddress();
          },
          get currentLocale() {
            return state.computeCurrentLocale();
          },
          params,
          get preferredLocale() {
            return state.computePreferredLocale();
          },
          get preferredLocaleList() {
            return state.computePreferredLocaleList();
          },
          locals,
          redirect,
          rewrite,
          request: this.request,
          response,
          site: pipeline.site,
          getActionResult: createGetActionResult(locals),
          get callAction() {
            return callAction;
          },
          url,
          get originPathname() {
            return getOriginPathname(state.request);
          },
          get csp() {
            return state.getCsp();
          },
          get logger() {
            return {
              info(msg) {
                pipeline.logger.info(null, msg);
              },
              warn(msg) {
                pipeline.logger.warn(null, msg);
              },
              error(msg) {
                pipeline.logger.error(null, msg);
              }
            };
          }
        };
        this.defineProviderGetters(partial);
        return partial;
      }
      getClientAddress() {
        const { pipeline, clientAddress } = this;
        const routeData = this.routeData;
        if (routeData.prerender) {
          throw new AstroError({
            ...PrerenderClientAddressNotAvailable,
            message: PrerenderClientAddressNotAvailable.message(routeData.component)
          });
        }
        if (clientAddress) {
          return clientAddress;
        }
        if (pipeline.adapterName) {
          throw new AstroError({
            ...ClientAddressNotAvailable,
            message: ClientAddressNotAvailable.message(pipeline.adapterName)
          });
        }
        throw new AstroError(StaticClientAddressNotAvailable);
      }
      getCookies() {
        return this.cookies;
      }
      getCsp() {
        const state = this;
        const { pipeline } = this;
        if (!pipeline.manifest.csp) {
          if (pipeline.runtimeMode === "production") {
            pipeline.logger.warn(
              "csp",
              `context.csp was used when rendering the route ${s$1.green(state.routeData.route)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/configuration-reference/#securitycsp`
            );
          }
          return void 0;
        }
        return {
          insertDirective(payload) {
            if (state.result) {
              state.result.directives = pushDirective(state.result.directives, payload);
            }
          },
          insertScriptResource(resource) {
            state.result?.scriptResources.push(resource);
          },
          insertStyleResource(resource) {
            state.result?.styleResources.push(resource);
          },
          insertStyleHash(hash) {
            state.result?.styleHashes.push(hash);
          },
          insertScriptHash(hash) {
            state.result?.scriptHashes.push(hash);
          }
        };
      }
      computeCurrentLocale() {
        const {
          url,
          pipeline: { i18n },
          routeData
        } = this;
        if (!i18n || !routeData) return;
        const { defaultLocale, locales, strategy } = i18n;
        const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
        if (this.#currentLocale) {
          return this.#currentLocale;
        }
        let computedLocale;
        if (isRouteServerIsland(routeData)) {
          let referer = this.request.headers.get("referer");
          if (referer) {
            if (URL.canParse(referer)) {
              referer = new URL(referer).pathname;
            }
            computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
          }
        } else {
          let pathname = routeData.pathname;
          if (this.#domainPathname) {
            pathname = this.pathname;
          } else if (url && !routeData.pattern.test(url.pathname)) {
            for (const fallbackRoute of routeData.fallbackRoutes) {
              if (fallbackRoute.pattern.test(url.pathname)) {
                pathname = fallbackRoute.pathname;
                break;
              }
            }
          }
          pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname ?? this.pathname;
          computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
          if (routeData.params.length > 0) {
            const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
            if (localeFromParams) {
              computedLocale = localeFromParams;
            }
          }
        }
        this.#currentLocale = computedLocale ?? fallbackTo;
        return this.#currentLocale;
      }
      computePreferredLocale() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
      }
      computePreferredLocaleList() {
        const {
          pipeline: { i18n },
          request
        } = this;
        if (!i18n) return;
        return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
      }
      /**
       * Lazily loads the route's component module. Returns the cached
       * instance if already loaded. The promise is cached so concurrent
       * callers share the same load.
       */
      async loadComponentInstance() {
        if (this.componentInstance) return this.componentInstance;
        if (this.#componentInstancePromise) return this.#componentInstancePromise;
        this.#componentInstancePromise = this.pipeline.getComponentByRoute(this.routeData).then((mod) => {
          this.componentInstance = mod;
          return mod;
        });
        return this.#componentInstancePromise;
      }
      /**
       * Registers a context provider under the given key. Handlers call
       * this to contribute values to the request context (e.g. sessions).
       * The `create` factory is called lazily on the first `resolve(key)`.
       */
      provide(key, provider) {
        (this.#providers ??= /* @__PURE__ */ new Map()).set(key, provider);
      }
      /**
       * Lazily resolves a provider registered under `key`. Calls
       * `provider.create()` on first access and caches the result.
       * Returns `undefined` if no provider was registered for the key.
       */
      resolve(key) {
        if (this.#providersResolvedValues?.has(key)) {
          return this.#providersResolvedValues.get(key);
        }
        const provider = this.#providers?.get(key);
        if (!provider) return void 0;
        const value = provider.create();
        (this.#providersResolvedValues ??= /* @__PURE__ */ new Map()).set(key, value);
        return value;
      }
      /**
       * Runs all registered `finalize` callbacks. Should be called after
       * the response is produced, typically in a `finally` block.
       *
       * Returns synchronously (no promise allocation) when nothing needs
       * finalizing — important for the hot path where sessions are not used.
       */
      finalizeAll() {
        if (!this.#providersResolvedValues || this.#providersResolvedValues.size === 0) return;
        let chain;
        for (const [key, provider] of this.#providers) {
          if (provider.finalize && this.#providersResolvedValues.has(key)) {
            const result = provider.finalize(this.#providersResolvedValues.get(key));
            if (result) {
              chain = chain ? chain.then(() => result) : result;
            }
          }
        }
        return chain;
      }
      /**
       * Adds lazy getters to `target` for each registered provider key.
       * Used by context creation (APIContext, Astro global) so that
       * provider values like `session` and `cache` appear as properties
       * without hard-coding the keys.
       */
      defineProviderGetters(target) {
        if (!this.#providers) return;
        const state = this;
        for (const key of this.#providers.keys()) {
          Object.defineProperty(target, key, {
            get: () => state.resolve(key),
            enumerable: true,
            configurable: true
          });
        }
      }
      /**
       * Resolves the route to use for this request and stores it on
       * `this.routeData`. If the adapter (or the dev server) provided a
       * `routeData` via render options it's already set and this is a
       * no-op. Otherwise we use the app's synchronous route matcher and
       * fall back to a `404.astro` route so middleware can still run.
       *
       * Called eagerly from the constructor so individual handlers
       * (actions, pages, middleware, etc.) always see a resolved route
       * without the caller needing an extra setup step.
       *
       * Once routeData is known, finalizes `this.pathname`: in dev, if the
       * matched route has no `.html` extension, strip `.html` / `/index.html`
       * suffixes so the rendering pipeline sees the canonical pathname.
       */
      /**
       * Strip `.html` / `/index.html` suffixes from the pathname so the
       * rendering pipeline sees the canonical route path. Only applies to
       * page routes where `.html` is framework-injected. Endpoint routes
       * preserve `.html` because any such suffix is user-provided (e.g.
       * from `getStaticPaths` params). Skipped when the matched route
       * itself has an `.html` extension in its definition.
       */
      #stripHtmlExtension() {
        if (this.routeData && this.routeData.type === "page" && !routeHasHtmlExtension(this.routeData)) {
          this.pathname = this.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
        }
      }
      #resolveRouteData() {
        const pipeline = this.pipeline;
        if (this.routeData) {
          this.#stripHtmlExtension();
          return;
        }
        const matched = pipeline.matchRoute(this.pathname);
        if (matched && matched.prerender && pipeline.manifest.serverLike) {
          if (matched.params.length > 0) {
            const allMatches = pipeline.matchAllRoutes(this.pathname);
            this.routeData = allMatches.find((r4) => !r4.prerender);
          } else {
            this.routeData = void 0;
          }
        } else {
          this.routeData = matched;
        }
        pipeline.logger.debug("router", "Astro matched the following route for " + this.request.url);
        pipeline.logger.debug("router", "RouteData:\n" + this.routeData);
        if (!this.routeData) {
          const custom404 = getCustom404Route(pipeline.manifestData);
          if (custom404 && !custom404.prerender) {
            this.routeData = custom404;
          }
        }
        if (!this.routeData) {
          pipeline.logger.debug("router", "Astro hasn't found routes that match " + this.request.url);
          pipeline.logger.debug("router", "Here's the available routes:\n", pipeline.manifestData);
          return;
        }
        this.#stripHtmlExtension();
      }
      /**
       * Strips the pipeline's base from the request URL, prepends a forward
       * slash, and decodes the pathname. Falls back to the raw (not decoded)
       * pathname if `decodeURI` throws.
       *
       * Mirrors `BaseApp.removeBase`, including the
       * `collapseDuplicateLeadingSlashes` fix that prevents middleware
       * authorization bypass when the URL starts with `//`.
       */
      #computePathname(url) {
        let pathname = collapseDuplicateLeadingSlashes(url.pathname);
        const base = this.pipeline.manifest.base;
        if (pathname.startsWith(base)) {
          const baseWithoutTrailingSlash = removeTrailingForwardSlash(base);
          pathname = pathname.slice(baseWithoutTrailingSlash.length + 1);
        }
        pathname = prependForwardSlash(pathname);
        try {
          return validateAndDecodePathname(pathname);
        } catch (e4) {
          this.pipeline.logger.error(null, e4.toString());
          return pathname;
        }
      }
      /**
       * Reads X-Forwarded-Proto, X-Forwarded-Host, and X-Forwarded-Port
       * from the request headers, validates them against the manifest's
       * `allowedDomains`, and updates `this.url` accordingly. Also resolves
       * `clientAddress` from X-Forwarded-For when the host is trusted.
       *
       * Only called when `allowedDomains` is configured — without it,
       * forwarded headers are never trusted.
       */
      #applyForwardedHeaders() {
        const headers = this.request.headers;
        const allowedDomains = this.pipeline.manifest.allowedDomains;
        const validated = validateForwardedHeaders(
          getFirstForwardedValue(headers.get("x-forwarded-proto") ?? void 0),
          getFirstForwardedValue(headers.get("x-forwarded-host") ?? void 0),
          getFirstForwardedValue(headers.get("x-forwarded-port") ?? void 0),
          allowedDomains
        );
        if (!validated.protocol && !validated.host && !validated.port) return;
        if (validated.protocol) {
          this.url.protocol = validated.protocol + ":";
        }
        if (validated.host) {
          const colonIdx = validated.host.indexOf(":");
          if (colonIdx !== -1) {
            this.url.hostname = validated.host.slice(0, colonIdx);
            this.url.port = validated.host.slice(colonIdx + 1);
          } else {
            this.url.hostname = validated.host;
            this.url.port = "";
          }
        }
        if (validated.port) {
          this.url.port = validated.port;
        }
        const hostTrusted = validated.host !== void 0;
        if (hostTrusted && !this.clientAddress) {
          const forwardedFor = getFirstForwardedValue(
            this.request.headers.get("x-forwarded-for") ?? void 0
          );
          if (forwardedFor) {
            this.clientAddress = forwardedFor;
          }
        }
        const oldRequest = this.request;
        this.request = new Request(this.url, oldRequest);
        const app2 = Reflect.get(oldRequest, appSymbol);
        if (app2 !== void 0) {
          Reflect.set(this.request, appSymbol, app2);
        }
      }
      /**
       * Returns the resolved `props` for this render, computing them lazily
       * from the route + component module on first access. If the
       * `initialProps` already carries user-supplied props (e.g. the
       * container API) those are used verbatim.
       */
      async getProps() {
        if (this.props !== null) return this.props;
        if (Object.keys(this.initialProps).length > 0) {
          this.props = this.initialProps;
          return this.props;
        }
        const pipeline = this.pipeline;
        const mod = await this.loadComponentInstance();
        this.props = await getProps({
          mod,
          routeData: this.routeData,
          routeCache: pipeline.routeCache,
          pathname: this.pathname,
          logger: pipeline.logger,
          serverLike: pipeline.manifest.serverLike,
          base: pipeline.manifest.base,
          trailingSlash: pipeline.manifest.trailingSlash
        });
        return this.props;
      }
      /**
       * Returns the `ActionAPIContext` for this render, creating it lazily.
       * Used by middleware, actions, and page dispatch.
       */
      getActionAPIContext() {
        if (this.actionApiContext !== null) return this.actionApiContext;
        const state = this;
        const ctx = {
          get cookies() {
            return state.cookies;
          },
          routePattern: this.routeData.route,
          isPrerendered: this.routeData.prerender,
          get clientAddress() {
            return state.getClientAddress();
          },
          get currentLocale() {
            return state.computeCurrentLocale();
          },
          generator: ASTRO_GENERATOR,
          get locals() {
            return state.locals;
          },
          set locals(_4) {
            throw new AstroError(LocalsReassigned);
          },
          // SAFETY: getActionAPIContext is only called after route resolution,
          // so routeData is always set and the params getter always returns a value.
          params: this.params,
          get preferredLocale() {
            return state.computePreferredLocale();
          },
          get preferredLocaleList() {
            return state.computePreferredLocaleList();
          },
          request: this.request,
          site: this.pipeline.site,
          url: this.url,
          get originPathname() {
            return getOriginPathname(state.request);
          },
          get csp() {
            return state.getCsp();
          },
          get logger() {
            if (!state.pipeline.manifest.experimentalLogger) {
              state.pipeline.logger.warn(
                null,
                "The Astro.logger is available only when experimental.logger is defined."
              );
              return void 0;
            }
            return {
              info(msg) {
                state.pipeline.logger.info(null, msg);
              },
              warn(msg) {
                state.pipeline.logger.warn(null, msg);
              },
              error(msg) {
                state.pipeline.logger.error(null, msg);
              }
            };
          }
        };
        this.defineProviderGetters(ctx);
        this.actionApiContext = ctx;
        return this.actionApiContext;
      }
      /**
       * Returns the `APIContext` for this render, creating it lazily from
       * the memoized props + action context.
       *
       * Callers must ensure `getProps()` has resolved at least once before
       * calling this.
       */
      getAPIContext() {
        if (this.apiContext !== null) return this.apiContext;
        const actionApiContext = this.getActionAPIContext();
        const state = this;
        const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
        const rewrite = async (reroutePayload) => {
          return await state.rewrite(reroutePayload);
        };
        Reflect.set(actionApiContext, pipelineSymbol, this.pipeline);
        actionApiContext[fetchStateSymbol] = this;
        this.apiContext = Object.assign(actionApiContext, {
          props: this.props,
          redirect,
          rewrite,
          getActionResult: createGetActionResult(actionApiContext.locals),
          callAction: createCallAction(actionApiContext)
        });
        return this.apiContext;
      }
      /**
       * Invalidates the cached `APIContext` so the next `getAPIContext()`
       * call re-derives it from the (possibly mutated) state. Used
       * after an in-flight rewrite swaps the route / request / params.
       */
      invalidateContexts() {
        this.props = null;
        this.actionApiContext = null;
        this.apiContext = null;
      }
    };
    ActionHandler = class {
      /**
       * Run action handling for the current request. Expects the APIContext
       * that is already being used by the render pipeline.
       *
       * Returns a `Response` when the action fully handles the request (RPC),
       * or `undefined` when the caller should continue processing the
       * request (form actions or non-action requests).
       */
      handle(apiContext, state) {
        state.pipeline.usedFeatures |= PipelineFeatures.actions;
        if (apiContext.isPrerendered) {
          return void 0;
        }
        const { action, setActionResult } = getActionContext(apiContext);
        if (!action) {
          return void 0;
        }
        return this.#executeAction(action, setActionResult);
      }
      async #executeAction(action, setActionResult) {
        const actionResult = await action.handler();
        const serialized = serializeActionResult(actionResult);
        if (action.calledFrom === "rpc") {
          if (serialized.type === "empty") {
            return new Response(null, {
              status: serialized.status
            });
          }
          return new Response(serialized.body, {
            status: serialized.status,
            headers: {
              "Content-Type": serialized.contentType
            }
          });
        }
        setActionResult(action.name, serialized);
        return void 0;
      }
    };
    TrailingSlashHandler = class {
      #app;
      constructor(app2) {
        this.#app = app2;
      }
      /**
       * Returns a redirect `Response` if the request pathname needs
       * normalization, or `undefined` if no redirect is required.
       */
      handle(state) {
        const url = new URL(state.request.url);
        const redirect = this.#redirectTrailingSlash(url.pathname);
        if (redirect === url.pathname) {
          return void 0;
        }
        const addCookieHeader = state.renderOptions.addCookieHeader;
        const status = state.request.method === "GET" ? 301 : 308;
        const response = new Response(
          redirectTemplate({
            status,
            relativeLocation: url.pathname,
            absoluteLocation: redirect,
            from: state.request.url
          }),
          {
            status,
            headers: {
              location: redirect + url.search
            }
          }
        );
        prepareResponse(response, { addCookieHeader });
        return response;
      }
      #redirectTrailingSlash(pathname) {
        const { trailingSlash } = this.#app.manifest;
        if (pathname === "/" || isInternalPath(pathname)) {
          return pathname;
        }
        const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
        if (path !== pathname) {
          return path;
        }
        if (trailingSlash === "ignore") {
          return pathname;
        }
        if (trailingSlash === "always" && !hasFileExtension(pathname)) {
          return appendForwardSlash(pathname);
        }
        if (trailingSlash === "never") {
          return removeTrailingForwardSlash(pathname);
        }
        return pathname;
      }
    };
    APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
    IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
    AstroCache = class {
      #options = {};
      #tags = /* @__PURE__ */ new Set();
      #disabled = false;
      #provider;
      enabled = true;
      constructor(provider) {
        this.#provider = provider;
      }
      set(input) {
        if (input === false) {
          this.#disabled = true;
          this.#tags.clear();
          this.#options = {};
          return;
        }
        this.#disabled = false;
        let options;
        if (isLiveDataEntry(input)) {
          if (!input.cacheHint) return;
          options = input.cacheHint;
        } else {
          options = input;
        }
        if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
        if ("swr" in options && options.swr !== void 0)
          this.#options.swr = options.swr;
        if ("etag" in options && options.etag !== void 0)
          this.#options.etag = options.etag;
        if (options.lastModified !== void 0) {
          if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
            this.#options.lastModified = options.lastModified;
          }
        }
        if (options.tags) {
          for (const tag of options.tags) this.#tags.add(tag);
        }
      }
      get tags() {
        return [...this.#tags];
      }
      /**
       * Get the current cache options (read-only snapshot).
       * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
       */
      get options() {
        return {
          ...this.#options,
          tags: this.tags
        };
      }
      async invalidate(input) {
        if (!this.#provider) {
          throw new AstroError(CacheNotEnabled);
        }
        let options;
        if (isLiveDataEntry(input)) {
          options = { tags: input.cacheHint?.tags ?? [] };
        } else {
          options = input;
        }
        return this.#provider.invalidate(options);
      }
      /** @internal */
      [APPLY_HEADERS](response) {
        if (this.#disabled) return;
        const finalOptions = { ...this.#options, tags: this.tags };
        if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
        const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
        for (const [key, value] of headers) {
          response.headers.set(key, value);
        }
      }
      /** @internal */
      get [IS_ACTIVE]() {
        return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
      }
    };
    ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
    ROUTE_SPREAD = /^\.{3}.+$/;
    CACHE_KEY = "cache";
    CacheHandler = class {
      #app;
      constructor(app2) {
        this.#app = app2;
      }
      async handle(state, next) {
        this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
        if (!this.#app.pipeline.cacheProvider) {
          return next();
        }
        const cache = state.resolve(CACHE_KEY);
        const cacheProvider = await this.#app.pipeline.getCacheProvider();
        if (cacheProvider?.onRequest) {
          const response2 = await cacheProvider.onRequest(
            {
              request: state.request,
              url: new URL(state.request.url),
              waitUntil: state.renderOptions.waitUntil
            },
            async () => {
              const res = await next();
              applyCacheHeaders(cache, res);
              return res;
            }
          );
          response2.headers.delete("CDN-Cache-Control");
          response2.headers.delete("Cache-Tag");
          return response2;
        }
        const response = await next();
        applyCacheHeaders(cache, response);
        return response;
      }
    };
    suspectProtoRx = /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/;
    suspectConstructorRx = /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/;
    JsonSigRx = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
    BASE64_PREFIX = "base64:";
    DRIVER_NAME = "memory";
    memory = defineDriver(() => {
      const data = /* @__PURE__ */ new Map();
      return {
        name: DRIVER_NAME,
        getInstance: () => data,
        hasItem(key) {
          return data.has(key);
        },
        getItem(key) {
          return data.get(key) ?? null;
        },
        getItemRaw(key) {
          return data.get(key) ?? null;
        },
        setItem(key, value) {
          data.set(key, value);
        },
        setItemRaw(key, value) {
          data.set(key, value);
        },
        removeItem(key) {
          data.delete(key);
        },
        getKeys() {
          return [...data.keys()];
        },
        clear() {
          data.clear();
        },
        dispose() {
          data.clear();
        }
      };
    });
    PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
    DEFAULT_COOKIE_NAME = "astro-session";
    VALID_COOKIE_REGEX = /^[\w-]+$/;
    unflatten = (parsed, _4) => {
      return unflatten$1(parsed, {
        URL: (href) => new URL(href)
      });
    };
    stringify = (data, _4) => {
      return stringify$2(data, {
        // Support URL objects
        URL: (val) => val instanceof URL && val.href
      });
    };
    AstroSession = class _AstroSession {
      // The cookies object.
      #cookies;
      // The session configuration.
      #config;
      // The cookie config
      #cookieConfig;
      // The cookie name
      #cookieName;
      // The unstorage object for the session driver.
      #storage;
      #data;
      // The session ID. A v4 UUID.
      #sessionID;
      // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
      #toDestroy = /* @__PURE__ */ new Set();
      // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
      #toDelete = /* @__PURE__ */ new Set();
      // Whether the session is dirty and needs to be saved.
      #dirty = false;
      // Whether the session cookie has been set.
      #cookieSet = false;
      // Whether the session ID was sourced from a client cookie rather than freshly generated.
      #sessionIDFromCookie = false;
      // The local data is "partial" if it has not been loaded from storage yet and only
      // contains values that have been set or deleted in-memory locally.
      // We do this to avoid the need to block on loading data when it is only being set.
      // When we load the data from storage, we need to merge it with the local partial data,
      // preserving in-memory changes and deletions.
      #partial = true;
      // The driver factory function provided by the pipeline
      #driverFactory;
      static #sharedStorage = /* @__PURE__ */ new Map();
      constructor({
        cookies,
        config: config2,
        runtimeMode,
        driverFactory,
        mockStorage
      }) {
        if (!config2) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "No driver was defined in the session configuration and the adapter did not provide a default driver."
            )
          });
        }
        this.#cookies = cookies;
        this.#driverFactory = driverFactory;
        const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config2;
        let cookieConfigObject;
        if (typeof cookieConfig === "object") {
          const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
          this.#cookieName = name;
          cookieConfigObject = rest;
        } else {
          this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
        }
        this.#cookieConfig = {
          sameSite: "lax",
          secure: runtimeMode === "production",
          path: "/",
          ...cookieConfigObject,
          httpOnly: true
        };
        this.#config = configRest;
        if (mockStorage) {
          this.#storage = mockStorage;
        }
      }
      /**
       * Gets a session value. Returns `undefined` if the session or value does not exist.
       */
      async get(key) {
        return (await this.#ensureData()).get(key)?.data;
      }
      /**
       * Checks if a session value exists.
       */
      async has(key) {
        return (await this.#ensureData()).has(key);
      }
      /**
       * Gets all session values.
       */
      async keys() {
        return (await this.#ensureData()).keys();
      }
      /**
       * Gets all session values.
       */
      async values() {
        return [...(await this.#ensureData()).values()].map((entry) => entry.data);
      }
      /**
       * Gets all session entries.
       */
      async entries() {
        return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
      }
      /**
       * Deletes a session value.
       */
      delete(key) {
        this.#data ??= /* @__PURE__ */ new Map();
        this.#data.delete(key);
        if (this.#partial) {
          this.#toDelete.add(key);
        }
        this.#dirty = true;
      }
      /**
       * Sets a session value. The session is created if it does not exist.
       */
      set(key, value, { ttl } = {}) {
        if (!key) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "The session key was not provided."
          });
        }
        let cloned;
        try {
          cloned = unflatten(JSON.parse(stringify(value)));
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageSaveError,
              message: `The session data for ${key} could not be serialized.`,
              hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
            },
            { cause: err }
          );
        }
        if (!this.#cookieSet) {
          this.#setCookie();
          this.#cookieSet = true;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        const lifetime = ttl ?? this.#config.ttl;
        const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
        this.#data.set(key, {
          data: cloned,
          expires
        });
        this.#dirty = true;
      }
      /**
       * Destroys the session, clearing the cookie and storage if it exists.
       */
      destroy() {
        const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
        if (sessionId) {
          this.#toDestroy.add(sessionId);
        }
        this.#cookies.delete(this.#cookieName, this.#cookieConfig);
        this.#sessionID = void 0;
        this.#data = void 0;
        this.#dirty = true;
      }
      /**
       * Regenerates the session, creating a new session ID. The existing session data is preserved.
       */
      async regenerate() {
        let data = /* @__PURE__ */ new Map();
        try {
          data = await this.#ensureData();
        } catch (err) {
          console.error("Failed to load session data during regeneration:", err);
        }
        const oldSessionId = this.#sessionID;
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        this.#data = data;
        this.#dirty = true;
        await this.#setCookie();
        if (oldSessionId && this.#storage) {
          this.#storage.removeItem(oldSessionId).catch((err) => {
            console.error("Failed to remove old session data:", err);
          });
        }
      }
      // Persists the session data to storage.
      // This is called automatically at the end of the request.
      // Uses a symbol to prevent users from calling it directly.
      async [PERSIST_SYMBOL]() {
        if (!this.#dirty && !this.#toDestroy.size) {
          return;
        }
        const storage = await this.#ensureStorage();
        if (this.#dirty && this.#data) {
          const data = await this.#ensureData();
          this.#toDelete.forEach((key2) => data.delete(key2));
          const key = this.#ensureSessionID();
          let serialized;
          try {
            serialized = stringify(data);
          } catch (err) {
            throw new AstroError(
              {
                ...SessionStorageSaveError,
                message: SessionStorageSaveError.message(
                  "The session data could not be serialized.",
                  this.#config.driver
                )
              },
              { cause: err }
            );
          }
          await storage.setItem(key, serialized);
          this.#dirty = false;
        }
        if (this.#toDestroy.size > 0) {
          const cleanupPromises = [...this.#toDestroy].map(
            (sessionId) => storage.removeItem(sessionId).catch((err) => {
              console.error("Failed to clean up session %s:", sessionId, err);
            })
          );
          await Promise.all(cleanupPromises);
          this.#toDestroy.clear();
        }
      }
      get sessionID() {
        return this.#sessionID;
      }
      /**
       * Loads a session from storage with the given ID, and replaces the current session.
       * Any changes made to the current session will be lost.
       * This is not normally needed, as the session is automatically loaded using the cookie.
       * However it can be used to restore a session where the ID has been recorded somewhere
       * else (e.g. in a database).
       */
      async load(sessionID) {
        this.#sessionID = sessionID;
        this.#data = void 0;
        await this.#setCookie();
        await this.#ensureData();
      }
      /**
       * Sets the session cookie.
       */
      async #setCookie() {
        if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
          throw new AstroError({
            ...SessionStorageSaveError,
            message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
          });
        }
        const value = this.#ensureSessionID();
        this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
      }
      /**
       * Attempts to load the session data from storage, or creates a new data object if none exists.
       * If there is existing partial data, it will be merged into the new data object.
       */
      async #ensureData() {
        if (this.#data && !this.#partial) {
          return this.#data;
        }
        this.#data ??= /* @__PURE__ */ new Map();
        if (!this.#sessionID && !this.#cookies.get(this.#cookieName)?.value) {
          this.#partial = false;
          return this.#data;
        }
        const storage = await this.#ensureStorage();
        const raw = await storage.get(this.#ensureSessionID());
        if (!raw) {
          if (this.#sessionIDFromCookie) {
            this.#sessionID = crypto.randomUUID();
            this.#sessionIDFromCookie = false;
            if (this.#cookieSet) {
              await this.#setCookie();
            }
          }
          return this.#data;
        }
        try {
          const storedMap = unflatten(raw);
          if (!(storedMap instanceof Map)) {
            await this.destroy();
            throw new AstroError({
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data was an invalid type.",
                this.#config.driver
              )
            });
          }
          const now = Date.now();
          for (const [key, value] of storedMap) {
            const expired = typeof value.expires === "number" && value.expires < now;
            if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
              this.#data.set(key, value);
            }
          }
          this.#partial = false;
          return this.#data;
        } catch (err) {
          await this.destroy();
          if (err instanceof AstroError) {
            throw err;
          }
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message(
                "The session data could not be parsed.",
                this.#config.driver
              )
            },
            { cause: err }
          );
        }
      }
      /**
       * Returns the session ID, generating a new one if it does not exist.
       */
      #ensureSessionID() {
        if (!this.#sessionID) {
          const cookieValue = this.#cookies.get(this.#cookieName)?.value;
          if (cookieValue) {
            this.#sessionID = cookieValue;
            this.#sessionIDFromCookie = true;
          } else {
            this.#sessionID = crypto.randomUUID();
          }
        }
        return this.#sessionID;
      }
      /**
       * Ensures the storage is initialized.
       * This is called automatically when a storage operation is needed.
       */
      async #ensureStorage() {
        if (this.#storage) {
          return this.#storage;
        }
        if (_AstroSession.#sharedStorage.has(this.#config.driver)) {
          this.#storage = _AstroSession.#sharedStorage.get(this.#config.driver);
          return this.#storage;
        }
        if (!this.#driverFactory) {
          throw new AstroError({
            ...SessionStorageInitError,
            message: SessionStorageInitError.message(
              "Astro could not load the driver correctly. Does it exist?",
              this.#config.driver
            )
          });
        }
        const driver = this.#driverFactory;
        try {
          this.#storage = createStorage({
            driver: {
              ...driver(this.#config.options),
              // Unused methods
              hasItem() {
                return false;
              },
              getKeys() {
                return [];
              }
            }
          });
          _AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
          return this.#storage;
        } catch (err) {
          throw new AstroError(
            {
              ...SessionStorageInitError,
              message: SessionStorageInitError.message("Unknown error", this.#config.driver)
            },
            { cause: err }
          );
        }
      }
    };
    SESSION_KEY = "session";
    AstroHandler = class {
      #app;
      #trailingSlashHandler;
      #actionHandler;
      #astroMiddleware;
      #pagesHandler;
      #cacheHandler;
      /** Bound callback for the middleware chain — created once, reused per request. */
      #renderRouteCallback;
      /**
       * i18n post-processor. Only set when the app has i18n configured and
       * the strategy is not `manual` — for the manual strategy users wire
       * `astro:i18n.middleware(...)` into their own `onRequest`.
       */
      #i18n;
      /** Whether sessions are configured on the manifest. */
      #hasSession;
      constructor(app2) {
        this.#app = app2;
        this.#trailingSlashHandler = new TrailingSlashHandler(app2);
        this.#actionHandler = new ActionHandler();
        this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
        this.#pagesHandler = new PagesHandler(app2.pipeline);
        this.#cacheHandler = new CacheHandler(app2);
        this.#renderRouteCallback = this.#actionsAndPages.bind(this);
        this.#hasSession = !!app2.manifest.sessionConfig;
        const i18n = app2.manifest.i18n;
        if (i18n && i18n.strategy !== "manual") {
          this.#i18n = new I18n(
            i18n,
            app2.manifest.base,
            app2.manifest.trailingSlash,
            app2.manifest.buildFormat
          );
        }
      }
      /**
       * Runs actions then pages — the callback at the bottom of the
       * middleware chain. Bound once in the constructor to avoid
       * per-request closure allocation.
       */
      #actionsAndPages(state, ctx) {
        if (!state.skipMiddleware) {
          const actionResult = this.#actionHandler.handle(ctx, state);
          if (actionResult) {
            return actionResult.then((response) => response ?? this.#pagesHandler.handle(state, ctx));
          }
        }
        return this.#pagesHandler.handle(state, ctx);
      }
      async handle(state) {
        state.pipeline.usedFeatures |= ALL_PIPELINE_FEATURES;
        const trailingSlashRedirect = this.#trailingSlashHandler.handle(state);
        if (trailingSlashRedirect) {
          return trailingSlashRedirect;
        }
        if (!state.routeData) {
          return this.#app.renderError(state.request, {
            ...state.renderOptions,
            status: 404,
            pathname: state.pathname
          });
        }
        return this.render(state);
      }
      /**
       * Renders a response for the given `FetchState`. Assumes
       * trailing-slash redirects and routeData resolution have already run.
       *
       * User-triggered rewrites (`Astro.rewrite` / `ctx.rewrite`) go through
       * `Rewrites.execute` on the current `FetchState` — they mutate the
       * existing state in place and re-run middleware + page dispatch.
       */
      async render(state) {
        const routeData = state.routeData;
        const pathname = state.pathname;
        const request = state.request;
        const { addCookieHeader } = state.renderOptions;
        const defaultStatus = this.#app.getDefaultStatusCode(routeData, pathname);
        state.status = defaultStatus;
        let response;
        try {
          const sessionP = this.#hasSession ? provideSession(state) : void 0;
          const cacheP = provideCache(state);
          if (sessionP || cacheP) await Promise.all([sessionP, cacheP]);
          state.pipeline.usedFeatures |= PipelineFeatures.sessions;
          if (routeData.type === "redirect") {
            const redirectResponse = await renderRedirect(state);
            this.#app.logThisRequest({
              pathname,
              method: request.method,
              statusCode: redirectResponse.status,
              isRewrite: false,
              timeStart: state.timeStart
            });
            prepareResponse(redirectResponse, { addCookieHeader });
            this.#app.pipeline.logger.flush();
            return redirectResponse;
          }
          if (!this.#app.pipeline.cacheProvider) {
            this.#app.pipeline.usedFeatures |= PipelineFeatures.cache;
            response = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
            if (this.#i18n) {
              response = await this.#i18n.finalize(state, response);
            }
          } else {
            const runPipeline = async () => {
              let res = await this.#astroMiddleware.handle(state, this.#renderRouteCallback);
              if (this.#i18n) {
                res = await this.#i18n.finalize(state, res);
              }
              return res;
            };
            response = await this.#cacheHandler.handle(state, runPipeline);
          }
          const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
          this.#app.logThisRequest({
            pathname,
            method: request.method,
            statusCode: response.status,
            isRewrite,
            timeStart: state.timeStart
          });
        } catch (err) {
          this.#app.logger.error(null, err.stack || err.message || String(err));
          return this.#app.renderError(request, {
            ...state.renderOptions,
            status: 500,
            error: err,
            pathname: state.pathname
          });
        } finally {
          const finalize2 = state.finalizeAll();
          if (finalize2) await finalize2;
        }
        if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
        // but uses the current route to handle the 404
        response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
          return this.#app.renderError(request, {
            ...state.renderOptions,
            response,
            status: response.status,
            // We don't have an error to report here. Passing null means we pass nothing intentionally
            // while undefined means there's no error
            error: response.status === 500 ? null : void 0,
            pathname: state.pathname
          });
        }
        prepareResponse(response, { addCookieHeader });
        this.#app.pipeline.logger.flush();
        return response;
      }
    };
    DefaultFetchHandler = class {
      #app;
      #handler;
      constructor(app2) {
        this.#app = app2 ?? null;
        this.#handler = app2 ? new AstroHandler(app2) : null;
      }
      /**
       * Fast path: called directly by `BaseApp.render()` with pre-resolved
       * options, avoiding the `Reflect.set/get` round-trip through the request.
       */
      renderWithOptions(request, options) {
        if (!this.#app) {
          const app2 = Reflect.get(request, appSymbol);
          if (!app2) {
            throw new Error("No fetch handler provided.");
          }
          this.#app = app2;
          this.#handler = new AstroHandler(app2);
        }
        const state = new FetchState(this.#app.pipeline, request, options);
        return this.#handler.handle(state);
      }
      fetch = (request) => {
        if (!this.#app) {
          const app2 = Reflect.get(request, appSymbol);
          if (!app2) {
            throw new Error("No fetch handler provided.");
          }
          this.#app = app2;
          this.#handler = new AstroHandler(app2);
        }
        const state = new FetchState(this.#app.pipeline, request);
        if (!this.#handler) {
          throw new Error("No fetch handler provided.");
        }
        return this.#handler.handle(state);
      };
    };
    fetchable = new DefaultFetchHandler();
    DefaultErrorHandler = class {
      #app;
      #astroMiddleware;
      #pagesHandler;
      constructor(app2) {
        this.#app = app2;
        this.#astroMiddleware = new AstroMiddleware(app2.pipeline);
        this.#pagesHandler = new PagesHandler(app2.pipeline);
      }
      async renderError(request, {
        status,
        response: originalResponse,
        skipMiddleware = false,
        error: error2,
        pathname,
        ...resolvedRenderOptions
      }) {
        const app2 = this.#app;
        const resolvedPathname = pathname ?? new FetchState(app2.pipeline, request).pathname;
        const errorRoutePath = `/${status}${app2.manifest.trailingSlash === "always" ? "/" : ""}`;
        const errorRouteData = matchRoute(errorRoutePath, app2.manifestData);
        const url = new URL(request.url);
        if (errorRouteData) {
          if (errorRouteData.prerender) {
            const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
            const allowedDomains = app2.manifest.allowedDomains;
            const validatedHost = validateHost(url.host, url.protocol.replace(":", ""), allowedDomains);
            const safeOrigin = validatedHost ? url.origin : `${url.protocol}//localhost`;
            const statusURL = new URL(
              `${app2.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`,
              safeOrigin
            );
            if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
              try {
                const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
                  statusURL.toString()
                );
                const override = { status, removeContentEncodingHeaders: true };
                const newResponse = mergeResponses(response2, originalResponse, override);
                prepareResponse(newResponse, resolvedRenderOptions);
                return newResponse;
              } catch {
                const response2 = mergeResponses(new Response(null, { status }), originalResponse);
                prepareResponse(response2, resolvedRenderOptions);
                return response2;
              }
            }
          }
          const mod = await app2.pipeline.getComponentByRoute(errorRouteData);
          const errorState = new FetchState(app2.pipeline, request);
          errorState.skipMiddleware = skipMiddleware;
          errorState.clientAddress = resolvedRenderOptions.clientAddress;
          errorState.routeData = errorRouteData;
          errorState.pathname = resolvedPathname;
          errorState.status = status;
          errorState.componentInstance = mod;
          errorState.locals = resolvedRenderOptions.locals ?? {};
          errorState.initialProps = { error: error2 };
          try {
            await provideSession(errorState);
            const response2 = await this.#astroMiddleware.handle(
              errorState,
              this.#pagesHandler.handle.bind(this.#pagesHandler)
            );
            const newResponse = mergeResponses(response2, originalResponse);
            prepareResponse(newResponse, resolvedRenderOptions);
            return newResponse;
          } catch {
            if (skipMiddleware === false) {
              return this.renderError(request, {
                ...resolvedRenderOptions,
                status,
                response: originalResponse,
                skipMiddleware: true,
                pathname: resolvedPathname
              });
            }
          } finally {
            await errorState.finalizeAll();
          }
        }
        const response = mergeResponses(new Response(null, { status }), originalResponse);
        prepareResponse(response, resolvedRenderOptions);
        return response;
      }
    };
    BaseApp = class _BaseApp {
      manifest;
      manifestData;
      pipeline;
      #adapterLogger;
      baseWithoutTrailingSlash;
      /**
       * The handler that turns incoming `Request` objects into `Response`s.
       * Defaults to a `DefaultFetchHandler` pinned to this app and can be
       * overridden via `setFetchHandler` — typically by the bundled
       * entrypoint after importing `virtual:astro:fetchable`.
       */
      #fetchHandler;
      #errorHandler;
      /**
       * Whether a custom fetch handler (from `src/app.ts`) has been set
       * via `setFetchHandler`. When false, the `DefaultFetchHandler` is
       * in use and all features are implicitly active.
       */
      #hasCustomFetchHandler = false;
      /**
       * Whether the missing-feature check has already run. We only want
       * to warn once — after the first request in dev, or at build end.
       */
      #featureCheckDone = false;
      get logger() {
        return this.pipeline.logger;
      }
      get adapterLogger() {
        const currentOptions = this.logger.options;
        if (!this.#adapterLogger || this.#adapterLogger.options !== currentOptions) {
          this.#adapterLogger = new AstroIntegrationLogger(currentOptions, this.manifest.adapterName);
        }
        return this.#adapterLogger;
      }
      constructor(manifest2, streaming = true, ...args) {
        this.manifest = manifest2;
        this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest2.base);
        this.pipeline = this.createPipeline(streaming, manifest2, ...args);
        this.manifestData = this.pipeline.manifestData;
        this.#fetchHandler = new DefaultFetchHandler(this);
        this.#errorHandler = this.createErrorHandler();
      }
      /**
       * Override the fetch handler used to dispatch requests. Entrypoints
       * call this with the default export of `virtual:astro:fetchable` to
       * plug in a user-authored handler from `src/app.ts`.
       */
      setFetchHandler(handler) {
        this.#fetchHandler = handler;
        this.#hasCustomFetchHandler = !(handler instanceof DefaultFetchHandler);
      }
      /**
       * Returns the error handler strategy used by this app. Override to
       * provide environment-specific behavior (dev overlay, build-time throws, etc.).
       */
      createErrorHandler() {
        return new DefaultErrorHandler(this);
      }
      /**
       * Resets the cached adapter logger so it picks up a new logger instance.
       * Used by BuildApp when the logger is replaced via setOptions().
       */
      resetAdapterLogger() {
        this.#adapterLogger = void 0;
      }
      getAllowedDomains() {
        return this.manifest.allowedDomains;
      }
      matchesAllowedDomains(forwardedHost, protocol) {
        return _BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
      }
      static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
        if (!allowedDomains || allowedDomains.length === 0) {
          return false;
        }
        try {
          const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
          return allowedDomains.some((pattern) => {
            return matchPattern(testUrl, pattern);
          });
        } catch {
          return false;
        }
      }
      set setManifestData(newManifestData) {
        this.manifestData = newManifestData;
        this.pipeline.manifestData = newManifestData;
        this.pipeline.rebuildRouter();
      }
      removeBase(pathname) {
        pathname = collapseDuplicateLeadingSlashes(pathname);
        if (pathname.startsWith(this.manifest.base)) {
          return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
        }
        return pathname;
      }
      /**
       * Decodes a pathname with `decodeURI`, falling back to the raw pathname when it
       * contains an invalid percent-sequence (e.g. `%C0%AF`, an overlong-UTF-8 encoding of
       * `/` commonly sent by path-traversal scanners). A raw `decodeURI()` would throw
       * `URIError: URI malformed`, and because `match()` runs before `render()` that error
       * escapes the adapter's request handler as an uncaught exception (HTTP 500) that user
       * middleware can't catch.
       */
      safeDecodeURI(pathname) {
        try {
          return decodeURI(pathname);
        } catch (e4) {
          this.adapterLogger.debug(e4.toString());
          return pathname;
        }
      }
      /**
       * Extracts the base-stripped, decoded pathname from a request.
       * Used by adapters to compute the pathname for dev-mode route matching.
       */
      getPathnameFromRequest(request) {
        const url = new URL(request.url);
        const pathname = prependForwardSlash(this.removeBase(url.pathname));
        return this.safeDecodeURI(pathname);
      }
      /**
       * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
       * routes aren't returned, even if they are matched.
       *
       * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
       * @param request
       * @param allowPrerenderedRoutes
       */
      match(request, allowPrerenderedRoutes = false) {
        const url = new URL(request.url);
        if (this.manifest.assets.has(url.pathname)) return void 0;
        let pathname = this.computePathnameFromDomain(request);
        if (!pathname) {
          pathname = prependForwardSlash(this.removeBase(url.pathname));
        }
        const routeData = this.pipeline.matchRoute(this.safeDecodeURI(pathname));
        if (!routeData) return void 0;
        if (allowPrerenderedRoutes) {
          return routeData;
        }
        if (routeData.prerender) {
          if (routeData.params.length > 0) {
            const allMatches = this.pipeline.matchAllRoutes(this.safeDecodeURI(pathname));
            return allMatches.find((r4) => !r4.prerender);
          }
          return void 0;
        }
        return routeData;
      }
      /**
       * A matching route function to use in the development server.
       * Contrary to the `.match` function, this function resolves props and params, returning the correct
       * route based on the priority, segments. It also returns the correct, resolved pathname.
       * @param pathname
       */
      devMatch(pathname) {
        return void 0;
      }
      computePathnameFromDomain(request) {
        return computePathnameFromDomain(
          request,
          new URL(request.url),
          this.manifest.i18n,
          this.manifest.base,
          this.manifest.trailingSlash,
          this.logger
        );
      }
      async render(request, {
        addCookieHeader = false,
        clientAddress = Reflect.get(request, clientAddressSymbol),
        locals,
        prerenderedErrorPageFetch = fetch,
        routeData,
        waitUntil
      } = {}) {
        await this.pipeline.getLogger();
        if (routeData) {
          this.logger.debug(
            "router",
            "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
            request.url
          );
          this.logger.debug("router", "RouteData");
          this.logger.debug("router", routeData);
        }
        if (locals) {
          if (typeof locals !== "object") {
            const error2 = new AstroError(LocalsNotAnObject);
            this.logger.error(null, error2.stack);
            return this.renderError(request, {
              addCookieHeader,
              clientAddress,
              prerenderedErrorPageFetch,
              // If locals are invalid, we don't want to include them when
              // rendering the error page
              locals: void 0,
              routeData,
              waitUntil,
              status: 500,
              error: error2
            });
          }
        }
        if (!routeData) {
          const domainPathname = this.computePathnameFromDomain(request);
          if (domainPathname) {
            routeData = this.pipeline.matchRoute(this.safeDecodeURI(domainPathname));
          }
        }
        const resolvedOptions = {
          addCookieHeader,
          clientAddress,
          prerenderedErrorPageFetch,
          locals,
          routeData,
          waitUntil
        };
        let response;
        if (this.#fetchHandler instanceof DefaultFetchHandler) {
          Reflect.set(request, appSymbol, this);
          response = await this.#fetchHandler.renderWithOptions(request, resolvedOptions);
        } else {
          setRenderOptions(request, resolvedOptions);
          Reflect.set(request, appSymbol, this);
          response = await this.#fetchHandler.fetch(request);
        }
        this.#warnMissingFeatures();
        if (response.headers.get(ASTRO_ERROR_HEADER)) {
          response.headers.delete(ASTRO_ERROR_HEADER);
          return this.renderError(request, {
            addCookieHeader,
            clientAddress,
            prerenderedErrorPageFetch,
            locals,
            routeData,
            waitUntil,
            response,
            status: response.status,
            error: response.status === 500 ? null : void 0
          });
        }
        return response;
      }
      setCookieHeaders(response) {
        return getSetCookiesFromResponse(response);
      }
      /**
       * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
       * For example,
       * ```ts
       * for (const cookie_ of App.getSetCookieFromResponse(response)) {
       *     const cookie: string = cookie_
       * }
       * ```
       * @param response The response to read cookies from.
       * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
       */
      static getSetCookieFromResponse = getSetCookiesFromResponse;
      /**
       * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
       * This also handles pre-rendered /404 or /500 routes.
       *
       * Delegates to the app's configured `ErrorHandler`. To customize behavior
       * for a specific environment, override `createErrorHandler()` rather than
       * this method.
       */
      async renderError(request, options) {
        return this.#errorHandler.renderError(request, options);
      }
      /**
       * One-shot check: after the first request with a custom `src/app.ts`,
       * compare `usedFeatures` against the manifest and warn about any
       * configured features the user's pipeline doesn't call.
       */
      #warnMissingFeatures() {
        if (this.#featureCheckDone || !this.#hasCustomFetchHandler) return;
        this.#featureCheckDone = true;
        const manifest2 = this.manifest;
        const missing = [];
        const used = this.pipeline.usedFeatures;
        if (manifest2.routes.some((r4) => r4.routeData.type === "redirect") && !(used & PipelineFeatures.redirects)) {
          missing.push("redirects");
        }
        if (manifest2.sessionConfig && !(used & PipelineFeatures.sessions)) {
          missing.push("sessions");
        }
        if (manifest2.actions && !(used & PipelineFeatures.actions)) {
          missing.push("actions");
        }
        if (manifest2.middleware && !(used & PipelineFeatures.middleware)) {
          missing.push("middleware");
        }
        if (manifest2.i18n && manifest2.i18n.strategy !== "manual" && !(used & PipelineFeatures.i18n)) {
          missing.push("i18n");
        }
        if (manifest2.cacheConfig && !(used & PipelineFeatures.cache)) {
          missing.push("cache");
        }
        for (const feature of missing) {
          this.logger.warn(
            "router",
            `Your project uses ${feature}, but your custom src/app.ts does not call the ${feature}() handler. This feature will not work unless you add it to your app.ts pipeline.`
          );
        }
      }
      getDefaultStatusCode(routeData, pathname) {
        if (!routeData.pattern.test(pathname)) {
          for (const fallbackRoute of routeData.fallbackRoutes) {
            if (fallbackRoute.pattern.test(pathname)) {
              return 302;
            }
          }
        }
        const route = removeTrailingForwardSlash(routeData.route);
        if (route.endsWith("/404")) return 404;
        if (route.endsWith("/500")) return 500;
        return 200;
      }
      getManifest() {
        return this.pipeline.manifest;
      }
      logThisRequest({
        pathname,
        method,
        statusCode,
        isRewrite,
        timeStart
      }) {
        const timeEnd = performance.now();
        this.logRequest({
          pathname,
          method,
          statusCode,
          isRewrite,
          reqTime: timeEnd - timeStart
        });
      }
    };
    URL_PARSE_BASE = "https://astro.build";
    AppPipeline = class _AppPipeline extends Pipeline {
      getName() {
        return "AppPipeline";
      }
      static create({ manifest: manifest2, streaming }) {
        const resolve = async function resolve2(specifier) {
          if (!(specifier in manifest2.entryModules)) {
            throw new Error(`Unable to resolve [${specifier}]`);
          }
          const bundlePath = manifest2.entryModules[specifier];
          if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
            return bundlePath;
          } else {
            return createAssetLink(bundlePath, manifest2.base, manifest2.assetsPrefix);
          }
        };
        const logger = createConsoleLogger({ level: manifest2.logLevel });
        const pipeline = new _AppPipeline(
          logger,
          manifest2,
          "production",
          manifest2.renderers,
          resolve,
          streaming,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0,
          void 0
        );
        return pipeline;
      }
      async headElements(routeData) {
        const { assetsPrefix, base } = this.manifest;
        const routeInfo = this.manifest.routes.find(
          (route) => route.routeData.route === routeData.route
        );
        const links = /* @__PURE__ */ new Set();
        const scripts = /* @__PURE__ */ new Set();
        const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
        for (const script of routeInfo?.scripts ?? []) {
          if ("stage" in script) {
            if (script.stage === "head-inline") {
              scripts.add({
                props: {},
                children: script.children
              });
            }
          } else {
            scripts.add(createModuleScriptElement(script, base, assetsPrefix));
          }
        }
        return { links, styles, scripts };
      }
      componentMetadata() {
      }
      async getComponentByRoute(routeData) {
        const module = await this.getModuleForRoute(routeData);
        return module.page();
      }
      async getModuleForRoute(route) {
        for (const defaultRoute of this.defaultRoutes) {
          if (route.component === defaultRoute.component) {
            return {
              page: () => Promise.resolve(defaultRoute.instance)
            };
          }
        }
        let routeToProcess = route;
        if (routeIsRedirect(route)) {
          if (route.redirectRoute) {
            routeToProcess = route.redirectRoute;
          } else {
            return RedirectSinglePageBuiltModule;
          }
        } else if (routeIsFallback(route)) {
          routeToProcess = getFallbackRoute(route, this.manifest.routes);
        }
        if (this.manifest.pageMap) {
          const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
          if (!importComponentInstance) {
            throw new Error(
              `Unexpectedly unable to find a component instance for route ${route.route}`
            );
          }
          return await importComponentInstance();
        } else if (this.manifest.pageModule) {
          return this.manifest.pageModule;
        }
        throw new Error(
          "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
        );
      }
      async tryRewrite(payload, request) {
        const { newUrl, pathname, routeData } = findRouteToRewrite({
          payload,
          request,
          routes: this.manifest?.routes.map((r4) => r4.routeData),
          trailingSlash: this.manifest.trailingSlash,
          buildFormat: this.manifest.buildFormat,
          base: this.manifest.base,
          outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
        });
        const componentInstance = await this.getComponentByRoute(routeData);
        return { newUrl, pathname, componentInstance, routeData };
      }
    };
    App = class extends BaseApp {
      createPipeline(streaming) {
        return AppPipeline.create({
          manifest: this.manifest,
          streaming
        });
      }
      isDev() {
        return false;
      }
      // Should we log something for our users?
      logRequest(_options) {
      }
    };
    r3 = "diffed";
    o3 = "__c";
    i4 = "__s";
    a3 = "__c";
    c3 = "__k";
    u4 = "__d";
    s3 = "__s";
    l3 = /[\s\n\\/='"\0<>]/;
    f4 = /^(xlink|xmlns|xml)([A-Z])/;
    p3 = /^(?:accessK|auto[A-Z]|cell|ch|col|cont|cross|dateT|encT|form[A-Z]|frame|hrefL|inputM|maxL|minL|noV|playsI|popoverT|readO|rowS|src[A-Z]|tabI|useM|item[A-Z])/;
    h3 = /^ac|^ali|arabic|basel|cap|clipPath$|clipRule$|color|dominant|enable|fill|flood|font|glyph[^R]|horiz|image|letter|lighting|marker[^WUH]|overline|panose|pointe|paint|rendering|shape|stop|strikethrough|stroke|text[^L]|transform|underline|unicode|units|^v[^i]|^w|^xH/;
    d3 = /* @__PURE__ */ new Set(["draggable", "spellcheck"]);
    _3 = /["&<]/;
    b2 = {};
    x3 = /* @__PURE__ */ new Set(["animation-iteration-count", "border-image-outset", "border-image-slice", "border-image-width", "box-flex", "box-flex-group", "box-ordinal-group", "column-count", "fill-opacity", "flex", "flex-grow", "flex-negative", "flex-order", "flex-positive", "flex-shrink", "flood-opacity", "font-weight", "grid-column", "grid-row", "line-clamp", "line-height", "opacity", "order", "orphans", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "widows", "z-index", "zoom"]);
    k3 = /[A-Z]/g;
    L2 = /* @__PURE__ */ function() {
      function e4() {
      }
      return e4.prototype.then = function(t4, n3) {
        var r4 = new e4(), o4 = this.s;
        if (o4) {
          var i5 = 1 & o4 ? t4 : n3;
          if (i5) {
            try {
              S2(r4, 1, i5(this.v));
            } catch (e5) {
              S2(r4, 2, e5);
            }
            return r4;
          }
          return this;
        }
        return this.o = function(e5) {
          try {
            var o5 = e5.v;
            1 & e5.s ? S2(r4, 1, t4 ? t4(o5) : o5) : n3 ? S2(r4, 1, n3(o5)) : S2(r4, 2, o5);
          } catch (e6) {
            S2(r4, 2, e6);
          }
        }, r4;
      }, e4;
    }();
    Z = function(a4, u5) {
      try {
        var s4 = l[i4];
        l[i4] = true, D3 = l.__b, P4 = l[r3], $2 = l.__r, U3 = l.unmount;
        var l4 = k(S, null);
        return l4[c3] = [a4], Promise.resolve(T4(function() {
          return Promise.resolve(R2(a4, u5 || F3, false, void 0, l4, true, void 0)).then(function(e4) {
            var t4, n3 = function() {
              if (W4(e4)) {
                var n4 = function() {
                  var e5 = o4.join(H4);
                  return t4 = 1, e5;
                }, r4 = 0, o4 = e4, i5 = j4(function() {
                  return !!o4.some(function(e5) {
                    return e5 && "function" == typeof e5.then;
                  }) && r4++ < 25;
                }, void 0, function() {
                  return Promise.resolve(Promise.all(o4)).then(function(e5) {
                    o4 = e5.flat();
                  });
                });
                return i5 && i5.then ? i5.then(n4) : n4();
              }
            }();
            return n3 && n3.then ? n3.then(function(n4) {
              return t4 ? n4 : e4;
            }) : t4 ? n3 : e4;
          });
        }, function(t4, n3) {
          if (l[o3] && l[o3](a4, M3), l[i4] = s4, M3.length = 0, t4) throw n3;
          return n3;
        }));
      } catch (e4) {
        return Promise.reject(e4);
      }
    };
    F3 = {};
    M3 = [];
    W4 = Array.isArray;
    z3 = Object.assign;
    H4 = "";
    N2 = "<!--$s-->";
    q4 = "<!--/$s-->";
    V3 = /* @__PURE__ */ new Set(["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"]);
    contexts = /* @__PURE__ */ new WeakMap();
    StaticHtml = ({ value, name, hydrate = true }) => {
      if (!value) return null;
      const tagName = hydrate ? "astro-slot" : "astro-static-slot";
      return k(tagName, { name, dangerouslySetInnerHTML: { __html: value } });
    };
    StaticHtml.shouldComponentUpdate = () => false;
    static_html_default = StaticHtml;
    slotName = (str) => str.trim().replace(/[-_]([a-z])/g, (_4, w4) => w4.toUpperCase());
    consoleFilterRefs = 0;
    renderer = {
      name: "@astrojs/preact",
      check,
      renderToStaticMarkup,
      supportsAstroStaticSlot: true
    };
    server_default = renderer;
    renderers = [Object.assign({ "name": "@astrojs/preact", "clientEntrypoint": "@astrojs/preact/client.js", "serverEntrypoint": "@astrojs/preact/server.js" }, { ssr: server_default })];
    serializedData = [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/404", "isIndex": false, "type": "page", "pattern": "^\\/404\\/?$", "segments": [[{ "content": "404", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/404.astro", "pathname": "/404", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/about", "isIndex": false, "type": "page", "pattern": "^\\/about\\/?$", "segments": [[{ "content": "about", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/about.astro", "pathname": "/about", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/delay/overview", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/overview\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }], [{ "content": "overview", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay/overview.astro", "pathname": "/delay/overview", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/delay", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay.astro", "pathname": "/delay", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/graph/[...type]", "isIndex": false, "type": "page", "pattern": "^\\/graph(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "graph", "dynamic": false, "spread": false }], [{ "content": "...type", "dynamic": true, "spread": true }]], "params": ["...type"], "component": "src/pages/graph/[...type].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/job/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/job(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "job", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/job/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/locations", "isIndex": false, "type": "page", "pattern": "^\\/locations\\/?$", "segments": [[{ "content": "locations", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/locations.astro", "pathname": "/locations", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/new-test", "isIndex": false, "type": "page", "pattern": "^\\/new-test\\/?$", "segments": [[{ "content": "new-test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/new-test.astro", "pathname": "/new-test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/perf", "isIndex": false, "type": "page", "pattern": "^\\/perf\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/perf.astro", "pathname": "/perf", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/perf/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/perf(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/perf/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/status", "isIndex": false, "type": "page", "pattern": "^\\/status\\/?$", "segments": [[{ "content": "status", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/status.astro", "pathname": "/status", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }];
    serializedData.map(deserializeRouteInfo);
    _page0 = () => Promise.resolve().then(() => (init_generic_CcUPKaZ4(), generic_CcUPKaZ4_exports)).then((n3) => n3.g);
    _page1 = () => Promise.resolve().then(() => (init_BSA_6hY1(), BSA_6hY1_exports));
    _page22 = () => Promise.resolve().then(() => (init_about_DDsdg5QE(), about_DDsdg5QE_exports));
    _page32 = () => Promise.resolve().then(() => (init_overview_Dny_qPAB(), overview_Dny_qPAB_exports));
    _page42 = () => Promise.resolve().then(() => (init_delay_DvsC18Cy(), delay_DvsC18Cy_exports));
    _page52 = () => Promise.resolve().then(() => (init_Bhkw4d1d(), Bhkw4d1d_exports));
    _page62 = () => Promise.resolve().then(() => (init_Dbp6o_J6(), Dbp6o_J6_exports));
    _page72 = () => Promise.resolve().then(() => (init_locations_hNNaoz_T(), locations_hNNaoz_T_exports));
    _page82 = () => Promise.resolve().then(() => (init_new_test_CtmJuNtA(), new_test_CtmJuNtA_exports));
    _page92 = () => Promise.resolve().then(() => (init_perf_BPP5ar1Q(), perf_BPP5ar1Q_exports));
    _page102 = () => Promise.resolve().then(() => (init_C30mJEdj(), C30mJEdj_exports));
    _page112 = () => Promise.resolve().then(() => (init_status_DGCOV0Yo(), status_DGCOV0Yo_exports));
    _page122 = () => Promise.resolve().then(() => (init_index_DKfZ64j5(), index_DKfZ64j5_exports));
    pageMap = /* @__PURE__ */ new Map([
      ["node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js", _page0],
      ["src/pages/404.astro", _page1],
      ["src/pages/about.astro", _page22],
      ["src/pages/delay/overview.astro", _page32],
      ["src/pages/delay.astro", _page42],
      ["src/pages/graph/[...type].astro", _page52],
      ["src/pages/job/[...internalJobName].astro", _page62],
      ["src/pages/locations.astro", _page72],
      ["src/pages/new-test.astro", _page82],
      ["src/pages/perf.astro", _page92],
      ["src/pages/perf/[...internalJobName].astro", _page102],
      ["src/pages/status.astro", _page112],
      ["src/pages/index.astro", _page122]
    ]);
    _manifest = deserializeManifest({ "rootDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/", "cacheDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.astro/", "outDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/", "srcDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/", "publicDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/public/", "buildClientDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/client/", "buildServerDir": "file:///Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/dist/server/", "adapterName": "@deno/astro-adapter", "assetsDir": "_astro", "routes": [{ "file": "", "links": [], "scripts": [], "styles": [], "routeData": { "type": "page", "component": "_server-islands.astro", "params": ["name"], "segments": [[{ "content": "_server-islands", "dynamic": false, "spread": false }], [{ "content": "name", "dynamic": true, "spread": false }]], "pattern": "^\\/_server-islands\\/([^/]+?)\\/?$", "prerender": false, "isIndex": false, "fallbackRoutes": [], "route": "/_server-islands/[name]", "origin": "internal", "distURL": [], "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [], "routeData": { "route": "/_image", "component": "node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/dist/assets/endpoint/generic.js", "params": [], "pathname": "/_image", "pattern": "^\\/_image\\/?$", "segments": [[{ "content": "_image", "dynamic": false, "spread": false }]], "type": "endpoint", "prerender": false, "fallbackRoutes": [], "distURL": [], "isIndex": false, "origin": "internal", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }], "routeData": { "route": "/404", "isIndex": false, "type": "page", "pattern": "^\\/404\\/?$", "segments": [[{ "content": "404", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/404.astro", "pathname": "/404", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".about[data-astro-cid-kh7btl4r]{display:flex;flex-direction:column;gap:3.5rem}img[data-astro-cid-kh7btl4r]{margin-top:1.5rem;border-radius:1.5rem;box-shadow:var(--shadow-md)}section[data-astro-cid-kh7btl4r]{display:flex;flex-direction:column;gap:.5rem;color:var(--gray-200)}.section-title[data-astro-cid-kh7btl4r]{grid-column-start:1;font-size:var(--text-xl);color:var(--gray-0)}.content[data-astro-cid-kh7btl4r]{grid-column:2 / 4}.content[data-astro-cid-kh7btl4r] a{-webkit-text-decoration:1px solid underline transparent;text-decoration:1px solid underline transparent;text-underline-offset:.25em;transition:text-decoration-color var(--theme-transition)}.content[data-astro-cid-kh7btl4r] a:hover,.content[data-astro-cid-kh7btl4r] a:focus{text-decoration-color:currentColor}@media(min-width:50em){.about[data-astro-cid-kh7btl4r]{display:grid;grid-template-columns:1fr 60% 1fr}.about[data-astro-cid-kh7btl4r]>:first-child{grid-column-start:2}section[data-astro-cid-kh7btl4r]{display:contents;font-size:var(--text-lg)}}\n" }], "routeData": { "route": "/about", "isIndex": false, "type": "page", "pattern": "^\\/about\\/?$", "segments": [[{ "content": "about", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/about.astro", "pathname": "/about", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }], "routeData": { "route": "/delay/overview", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/overview\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }], [{ "content": "overview", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay/overview.astro", "pathname": "/delay/overview", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n.card[data-astro-cid-snl3mfmd]{display:grid;grid-template:auto 1fr / auto 1fr;height:11rem;background:var(--gradient-subtle);border:1px solid var(--gray-800);border-radius:.75rem;overflow:hidden;box-shadow:var(--shadow-sm);text-decoration:none;font-family:var(--font-brand);font-size:var(--text-lg);font-weight:500;transition:box-shadow var(--theme-transition)}.card[data-astro-cid-snl3mfmd]:hover{box-shadow:var(--shadow-md)}.title[data-astro-cid-snl3mfmd]{grid-area:1 / 1 / 2 / 2;z-index:1;margin:.5rem;padding:.5rem 1rem;background:var(--gray-999);color:var(--gray-200);border-radius:.375rem}img[data-astro-cid-snl3mfmd]{grid-area:1 / 1 / 3 / 3;width:100%;height:100%;-o-object-fit:cover;object-fit:cover}@media(min-width:50em){.card[data-astro-cid-snl3mfmd]{height:22rem;border-radius:1.5rem}.title[data-astro-cid-snl3mfmd]{border-radius:.9375rem}}.grid[data-astro-cid-vc5tsdmu]{display:grid;grid-auto-rows:1fr;gap:1rem;list-style:none;padding:0}.grid[data-astro-cid-vc5tsdmu].small{grid-template-columns:1fr 1fr;gap:1.5rem}.grid[data-astro-cid-vc5tsdmu].small>:last-child:nth-child(odd){grid-column:1 / 3}@media(min-width:75em){.grid[data-astro-cid-vc5tsdmu]{grid-template-columns:1fr 1fr 1fr;gap:4rem}.grid[data-astro-cid-vc5tsdmu].offset{--row-offset: 7.5rem;padding-bottom:var(--row-offset)}.grid[data-astro-cid-vc5tsdmu].offset>:nth-child(odd){transform:translateY(var(--row-offset))}.grid[data-astro-cid-vc5tsdmu].offset>:last-child:nth-child(odd){grid-column:2 / 3;transform:none}.grid[data-astro-cid-vc5tsdmu].small{display:flex;flex-wrap:wrap;justify-content:center;gap:2rem}.grid[data-astro-cid-vc5tsdmu].small>*{flex-basis:20rem}}\n.category-section[data-astro-cid-dnzhvhlx]{margin-block:0}.category-section[data-astro-cid-dnzhvhlx][open]>summary[data-astro-cid-dnzhvhlx] .chevron[data-astro-cid-dnzhvhlx]{transform:rotate(180deg)}.category-section[data-astro-cid-dnzhvhlx]>summary[data-astro-cid-dnzhvhlx]{list-style:none}.category-section[data-astro-cid-dnzhvhlx]>summary[data-astro-cid-dnzhvhlx]::-webkit-details-marker{display:none}\n" }], "routeData": { "route": "/delay", "isIndex": false, "type": "page", "pattern": "^\\/delay\\/?$", "segments": [[{ "content": "delay", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/delay.astro", "pathname": "/delay", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }], "routeData": { "route": "/graph/[...type]", "isIndex": false, "type": "page", "pattern": "^\\/graph(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "graph", "dynamic": false, "spread": false }], [{ "content": "...type", "dynamic": true, "spread": true }]], "params": ["...type"], "component": "src/pages/graph/[...type].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".back-link[data-astro-cid-7pcdk3iz]{display:none}@media(min-width:50em){.back-link[data-astro-cid-7pcdk3iz]{display:block;align-self:flex-start}}\n" }], "routeData": { "route": "/job/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/job(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "job", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/job/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }], "routeData": { "route": "/locations", "isIndex": false, "type": "page", "pattern": "^\\/locations\\/?$", "segments": [[{ "content": "locations", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/locations.astro", "pathname": "/locations", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }], "routeData": { "route": "/new-test", "isIndex": false, "type": "page", "pattern": "^\\/new-test\\/?$", "segments": [[{ "content": "new-test", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/new-test.astro", "pathname": "/new-test", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n.category-section[data-astro-cid-dnzhvhlx]{margin-block:0}.category-section[data-astro-cid-dnzhvhlx][open]>summary[data-astro-cid-dnzhvhlx] .chevron[data-astro-cid-dnzhvhlx]{transform:rotate(180deg)}.category-section[data-astro-cid-dnzhvhlx]>summary[data-astro-cid-dnzhvhlx]{list-style:none}.category-section[data-astro-cid-dnzhvhlx]>summary[data-astro-cid-dnzhvhlx]::-webkit-details-marker{display:none}\n.perf-table[data-astro-cid-po2kug26] th[data-astro-cid-po2kug26][data-sort]{white-space:nowrap}.perf-table[data-astro-cid-po2kug26] th[data-astro-cid-po2kug26] .sort-ind[data-astro-cid-po2kug26]{display:inline-block;width:.9em;text-align:left;opacity:.9}.perf-table[data-astro-cid-po2kug26] tr[data-astro-cid-po2kug26].perf-parent[aria-expanded=true] .chev[data-astro-cid-po2kug26]{transform:rotate(90deg)}\n" }], "routeData": { "route": "/perf", "isIndex": false, "type": "page", "pattern": "^\\/perf\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/perf.astro", "pathname": "/perf", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".back-link[data-astro-cid-4ltwneta]{display:none}@media(min-width:50em){.back-link[data-astro-cid-4ltwneta]{display:block;align-self:flex-start}}\n" }], "routeData": { "route": "/perf/[...internalJobName]", "isIndex": false, "type": "page", "pattern": "^\\/perf(?:\\/(.*?))?\\/?$", "segments": [[{ "content": "perf", "dynamic": false, "spread": false }], [{ "content": "...internalJobName", "dynamic": true, "spread": true }]], "params": ["...internalJobName"], "component": "src/pages/perf/[...internalJobName].astro", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }], "routeData": { "route": "/status", "isIndex": false, "type": "page", "pattern": "^\\/status\\/?$", "segments": [[{ "content": "status", "dynamic": false, "spread": false }]], "params": [], "component": "src/pages/status.astro", "pathname": "/status", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }, { "file": "", "links": [], "scripts": [{ "type": "external", "value": "_astro/page.B_tncCx8.js" }], "styles": [{ "type": "external", "src": "_astro/base.0YbrMCqx.css" }, { "type": "inline", "content": ".hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-lg);text-align:center}.title[data-astro-cid-bbe6dxrz],.tagline[data-astro-cid-bbe6dxrz]{margin-inline:auto}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-3xl);color:var(--gray-0)}@media(min-width:50em){.hero[data-astro-cid-bbe6dxrz]{font-size:var(--text-xl)}.start[data-astro-cid-bbe6dxrz]{text-align:start}.start[data-astro-cid-bbe6dxrz] .title[data-astro-cid-bbe6dxrz],.start[data-astro-cid-bbe6dxrz] .tagline[data-astro-cid-bbe6dxrz]{margin-inline:unset}.title[data-astro-cid-bbe6dxrz]{font-size:var(--text-5xl)}}\n" }, { "type": "external", "src": "_astro/BaseLayout.CIvhAQKm.css" }, { "type": "inline", "content": ".overview-strip[data-astro-cid-j7pv25f6]{display:flex;flex-wrap:wrap;gap:.5rem}.overview-link[data-astro-cid-j7pv25f6]{display:inline-flex;align-items:center;padding:.4rem .9rem;border-radius:999rem;border:1px solid var(--gray-800);background-color:var(--gray-999_40);color:var(--gray-100);font-size:var(--text-sm);font-weight:500;text-decoration:none;transition:border-color var(--theme-transition),color var(--theme-transition),background-color var(--theme-transition)}.overview-link[data-astro-cid-j7pv25f6]:hover{border-color:var(--accent-regular);color:var(--accent-regular)}\n" }], "routeData": { "route": "/", "isIndex": true, "type": "page", "pattern": "^\\/$", "segments": [], "params": [], "component": "src/pages/index.astro", "pathname": "/", "prerender": false, "fallbackRoutes": [], "distURL": [], "origin": "project", "_meta": { "trailingSlash": "ignore" } } }], "serverLike": true, "middlewareMode": "classic", "base": "/", "trailingSlash": "ignore", "compressHTML": true, "experimentalQueuedRendering": { "enabled": false, "poolSize": 0, "contentCache": false }, "componentMetadata": [["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/404.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/about.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay/overview.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/index.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf/[...internalJobName].astro", { "propagation": "none", "containsHead": true }], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/status.astro", { "propagation": "none", "containsHead": true }]], "renderers": [], "clientDirectives": [["idle", '(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value=="object"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};"requestIdleCallback"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event("astro:idle"));})();'], ["load", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event("astro:load"));})();'], ["media", '(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener("change",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event("astro:media"));})();'], ["only", '(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event("astro:only"));})();'], ["visible", '(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value=="object"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event("astro:visible"));})();']], "entryModules": { "astro/entrypoints/prerender": "prerender-entry.DLriald0.mjs", "\0virtual:astro:actions/noop-entrypoint": "chunks/noop-entrypoint_BOlrdqWF.mjs", "\0noop-middleware": "virtual_astro_middleware.mjs", "\0virtual:astro:session-driver": "chunks/_virtual_astro_session-driver_DYx9Bb3p.mjs", "\0virtual:astro:server-island-manifest": "chunks/_virtual_astro_server-island-manifest_CQQ1F5PF.mjs", "@deno/astro-adapter/server.ts": "entry.mjs", "__vite-optional-peer-dep:@opentelemetry/api:@deno/astro-adapter:false": "chunks/astro-adapter_false_CaqwA2Hq.mjs", "\0virtual:astro:page:src/pages/404@_@astro": "chunks/404_BSA-6hY1.mjs", "\0virtual:astro:page:src/pages/about@_@astro": "chunks/about_DDsdg5QE.mjs", "\0virtual:astro:page:src/pages/delay/overview@_@astro": "chunks/overview_Dny-qPAB.mjs", "\0virtual:astro:page:src/pages/delay@_@astro": "chunks/delay_DvsC18Cy.mjs", "\0virtual:astro:page:src/pages/graph/[...type]@_@astro": "chunks/_.._Bhkw4d1d.mjs", "\0virtual:astro:page:src/pages/job/[...internalJobName]@_@astro": "chunks/_.._Dbp6o_J6.mjs", "\0virtual:astro:page:src/pages/locations@_@astro": "chunks/locations_hNNaoz-T.mjs", "\0virtual:astro:page:src/pages/new-test@_@astro": "chunks/new-test_CtmJuNtA.mjs", "\0virtual:astro:page:src/pages/perf@_@astro": "chunks/perf_BPP5ar1Q.mjs", "\0virtual:astro:page:src/pages/perf/[...internalJobName]@_@astro": "chunks/_.._C30mJEdj.mjs", "\0virtual:astro:page:src/pages/status@_@astro": "chunks/status_DGCOV0Yo.mjs", "\0virtual:astro:page:src/pages/index@_@astro": "chunks/index_DKfZ64j5.mjs", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/astro@6.4.7_jiti@1.21.7_rollup@4.62.0_yaml@2.9.0/node_modules/astro/dist/assets/services/noop.js": "chunks/noop_Cxbj09y6.mjs", "@astrojs/preact/client.js": "_astro/client.DkUDPHR4.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts": "_astro/Nav.astro_astro_type_script_index_0_lang.iAA4Z6Qc.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/StatusDashboard.astro?astro&type=script&index=0&lang.ts": "_astro/StatusDashboard.astro_astro_type_script_index_0_lang.DZTxFw72.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts": "_astro/ThemeToggle.astro_astro_type_script_index_0_lang.HLrUhrG0.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/ErrorGraph": "_astro/ErrorGraph.j1TqLiBe.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraphLazy.js": "_astro/RegionGraphLazy.KxatiOrb.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph": "_astro/SmartGraph.CUpFcoAh.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/SmartGraph.js": "_astro/SmartGraph.CUpFcoAh.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/Sparkline.jsx": "_astro/Sparkline.DhLwrDq_.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts": "_astro/BaseLayout.astro_astro_type_script_index_0_lang.Cf-elt_A.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts": "_astro/delay.astro_astro_type_script_index_0_lang.K1lTsFv1.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=1&lang.ts": "_astro/delay.astro_astro_type_script_index_1_lang.BZv-hiC1.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/job/[...internalJobName].astro?astro&type=script&index=0&lang.ts": "_astro/_...internalJobName_.astro_astro_type_script_index_0_lang.xINCSwqU.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts": "_astro/locations.astro_astro_type_script_index_0_lang._eEkB7Ll.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts": "_astro/perf.astro_astro_type_script_index_0_lang.R4h97pDa.js", "astro:scripts/page.js": "_astro/page.B_tncCx8.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/node_modules/.pnpm/@preact+signals@2.9.1_preact@10.29.2/node_modules/@preact/signals/dist/signals.module.js": "_astro/signals.module.CpLr9eDr.js", "/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/graph/RegionGraph.js": "_astro/RegionGraph.DOuygei0.js", "astro:scripts/before-hydration.js": "" }, "inlinedScripts": [["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/Nav.astro?astro&type=script&index=0&lang.ts", 'class i extends HTMLElement{constructor(){super(),this.appendChild(this.querySelector("template").content.cloneNode(!0));const n=this.querySelector("button"),t=document.getElementById("menu-content");t.hidden=!0,t.classList.add("menu-content");const d=e=>{n.setAttribute("aria-expanded",e?"true":"false"),t.hidden=!e};n.addEventListener("click",()=>d(t.hidden));const s=e=>{d(e.matches),n.hidden=e.matches},c=window.matchMedia("(min-width: 50em)");s(c),c.addEventListener("change",s)}}customElements.define("menu-button",i);'], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/components/ThemeToggle.astro?astro&type=script&index=0&lang.ts", 'class o extends HTMLElement{constructor(){super();const t=this.querySelector("button"),s=e=>{document.documentElement.classList[e?"add":"remove"]("theme-dark"),document.documentElement.classList[e?"add":"remove"]("dark"),t.setAttribute("aria-pressed",String(e));const n=new CustomEvent("themeChange",{detail:{dark:e}});window.dispatchEvent(n),console.log("dispatched!")};t.addEventListener("click",()=>s(!this.isDark())),s(this.isDark())}isDark(){return document.documentElement.classList.contains("theme-dark")}}customElements.define("theme-toggle",o);'], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/layouts/BaseLayout.astro?astro&type=script&index=0&lang.ts", 'addEventListener("load",()=>document.documentElement.classList.add("loaded"));'], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/delay.astro?astro&type=script&index=0&lang.ts", `(function(){const o=document.getElementById("job-filter");if(!o)return;const i=Array.from(document.querySelectorAll("[data-category]")),s=new WeakMap;for(const e of i)s.set(e,e.open);function f(e){const l=(e||"").trim().toLowerCase();for(const t of i){let n=!1;t.querySelectorAll('[id$="grid"]').forEach(r=>{const c=r.parentElement,a=r.id.toLowerCase().includes(l);c&&(c.style.display=a?"":"none"),a&&(n=!0)}),t.style.display=n?"":"none",l?t.open=n:t.open=s.get(t)}}o.addEventListener("input",e=>f(e.target.value))})();`], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/locations.astro?astro&type=script&index=0&lang.ts", `const n=document.getElementById("location-filter");n?.addEventListener("input",()=>{const e=n.value.toLowerCase();document.querySelectorAll('tr[id$="-row"]').forEach(t=>{const o=!e||(t.textContent?.toLowerCase().includes(e)??!0);t.hidden=!o})});`], ["/Users/tobrien/src/Action-Delay-API/website/Action-Delay-API-website-bunny/src/pages/perf.astro?astro&type=script&index=0&lang.ts", '(function(){const h=Array.from(document.querySelectorAll("[data-category]")),S=new Set(["now","p50","p50-30d"]);function q(t){switch(t){case"name":return"data-name";case"provider":return"data-provider";case"now":return"data-now";case"p50":return"data-p50";case"p50-30d":return"data-p50-30d";default:return"data-name"}}function b(t,o){return Array.from(t.querySelectorAll("tr.perf-child")).filter(e=>e.getAttribute("data-key")===o)}function A(t,o,e){const a=t.querySelector("tbody");if(!a)return;const n=q(o),c=S.has(o),s=[];let d=null;for(const r of Array.from(a.children))r.classList.contains("perf-parent")?(d={head:r,kids:[]},s.push(d)):r.classList.contains("perf-child")?d?d.kids.push(r):s.push({head:r,kids:[]}):(d=null,s.push({head:r,kids:[]}));s.sort((r,i)=>{const u=r.head.getAttribute("data-expandable")==="true"?0:1,l=i.head.getAttribute("data-expandable")==="true"?0:1;if(u!==l)return u-l;const y=r.head.getAttribute(n)||"",p=i.head.getAttribute(n)||"",m=c?(parseFloat(y)||0)-(parseFloat(p)||0):y.localeCompare(p);return e?m:-m});for(const r of s){a.appendChild(r.head);for(const i of r.kids)a.appendChild(i)}t.querySelectorAll("th[data-sort] .sort-ind").forEach(r=>r.textContent="");const f=t.querySelector(`th[data-sort="${o}"] .sort-ind`);f&&(f.textContent=e?" \u25B2":" \u25BC")}for(const t of document.querySelectorAll(".perf-table")){const o=t.querySelector("tbody"),e={key:"p50",asc:!0};t.querySelectorAll("th[data-sort]").forEach(a=>{a.addEventListener("click",()=>{const n=a.getAttribute("data-sort");e.asc=e.key===n?!e.asc:!0,e.key=n,A(t,e.key,e.asc)})}),A(t,e.key,e.asc),t.querySelectorAll(\'tr.perf-parent[data-expandable="true"]\').forEach(a=>{a.addEventListener("click",n=>{if(n.target.closest("a"))return;const c=a.getAttribute("data-key"),s=a.getAttribute("aria-expanded")==="true";a.setAttribute("aria-expanded",s?"false":"true");for(const d of b(o,c))d.hidden=s})})}const k=document.getElementById("job-filter");if(!k)return;const g=new WeakMap;for(const t of h)g.set(t,t.open);function x(t){const o=(t||"").trim().toLowerCase();for(const e of h){let a=!1;e.querySelectorAll(".perf-table tbody").forEach(n=>{n.querySelectorAll("tr.perf-parent").forEach(c=>{const s=c.getAttribute("data-key"),d=c.getAttribute("data-expandable")==="true",f=b(n,s),r=(c.getAttribute("data-name")||"").includes(o);let i=!1;for(const l of f){const y=(l.getAttribute("data-name")||"").includes(o),p=o?r||y:!1;l.hidden=!p,p&&(i=!0)}const u=o?r||i:!0;if(c.style.display=u?"":"none",!u)for(const l of f)l.hidden=!0;d&&c.setAttribute("aria-expanded",i?"true":"false"),u&&(a=!0)})}),e.style.display=a?"":"none",e.open=o?a:g.get(e)}}k.addEventListener("input",t=>x(t.target.value))})();']], "assets": ["/expand.svg", "/favicon-animated.svg", "/favicon.svg", "/assets/stock-1.jpg", "/assets/stock-2.jpg", "/assets/stock-3.jpg", "/assets/stock-4.jpg", "/_astro/ErrorGraph.j1TqLiBe.js", "/_astro/RegionGraph.DOuygei0.js", "/_astro/RegionGraphLazy.KxatiOrb.js", "/_astro/SmartGraph.CUpFcoAh.js", "/_astro/Sparkline.DhLwrDq_.js", "/_astro/StatusDashboard.astro_astro_type_script_index_0_lang.DZTxFw72.js", "/_astro/_...internalJobName_.astro_astro_type_script_index_0_lang.xINCSwqU.js", "/_astro/chartTheme.ncvXmO3Z.js", "/_astro/client.DkUDPHR4.js", "/_astro/delay.astro_astro_type_script_index_1_lang.BZv-hiC1.js", "/_astro/hooks.module.BhWR1quF.js", "/_astro/jsxRuntime.module.CehDvxVD.js", "/_astro/page.B_tncCx8.js", "/_astro/preact.module.C_W9NP7W.js", "/_astro/preload-helper.CVfkMyKi.js", "/_astro/signals.module.CpLr9eDr.js", "/assets/backgrounds/bg-footer-dark-1440w.jpg", "/assets/backgrounds/bg-footer-dark-800w.jpg", "/assets/backgrounds/bg-footer-light-1440w.jpg", "/assets/backgrounds/bg-footer-light-800w.jpg", "/assets/backgrounds/bg-main-dark-1440w.jpg", "/assets/backgrounds/bg-main-dark-800w.jpg", "/assets/backgrounds/bg-main-dark.svg", "/assets/backgrounds/bg-main-light-1440w.jpg", "/assets/backgrounds/bg-main-light-800w.jpg", "/assets/backgrounds/bg-main-light.svg", "/assets/backgrounds/bg-subtle-1-dark-1440w.jpg", "/assets/backgrounds/bg-subtle-1-dark-800w.jpg", "/assets/backgrounds/bg-subtle-1-light-1440w.jpg", "/assets/backgrounds/bg-subtle-1-light-800w.jpg", "/assets/backgrounds/bg-subtle-2-dark-1440w.jpg", "/assets/backgrounds/bg-subtle-2-dark-800w.jpg", "/assets/backgrounds/bg-subtle-2-light-1440w.jpg", "/assets/backgrounds/bg-subtle-2-light-800w.jpg", "/assets/backgrounds/noise.png", "/assets/js/8.0.7/signalr-protocol-msgpack.min.js", "/assets/js/8.0.7/signalr-protocol-msgpack.min.js.map", "/assets/js/8.0.7/signalr.min.js", "/assets/js/8.0.7/signalr.min.js.map", "/_astro/BaseLayout.CIvhAQKm.css", "/_astro/base.0YbrMCqx.css", "/_astro/page.B_tncCx8.js"], "buildFormat": "directory", "checkOrigin": true, "actionBodySizeLimit": 1048576, "serverIslandBodySizeLimit": 1048576, "allowedDomains": [], "key": "kgV9cFQ37E1HnXSONbzBGmWLAxuXdOXt8BQwGuHD2EU=", "image": {}, "devToolbar": { "enabled": false, "debugInfoOutput": "" }, "logLevel": "info", "shouldInjectCspMetaTags": false });
    manifestRoutes = _manifest.routes;
    manifest = Object.assign(_manifest, {
      renderers,
      actions: () => Promise.resolve().then(() => (init_noop_entrypoint_BOlrdqWF(), noop_entrypoint_BOlrdqWF_exports)),
      middleware: () => Promise.resolve().then(() => (init_virtual_astro_middleware(), virtual_astro_middleware_exports)),
      sessionDriver: () => Promise.resolve().then(() => (init_virtual_astro_session_driver_DYx9Bb3p(), virtual_astro_session_driver_DYx9Bb3p_exports)),
      serverIslandMappings: () => Promise.resolve().then(() => (init_virtual_astro_server_island_manifest_CQQ1F5PF(), virtual_astro_server_island_manifest_CQQ1F5PF_exports)),
      routes: manifestRoutes,
      pageMap
    });
    createApp$1 = ({ streaming } = {}) => {
      const app2 = new App(manifest, streaming);
      app2.setFetchHandler(fetchable);
      return app2;
    };
    createApp = createApp$1;
    app = createApp();
    _server = void 0;
    _startPromise = void 0;
    {
      start();
    }
  }
});

// dist/server/entry.mjs
init_server_b5nfSfcf();
export {
  handle,
  running,
  start,
  stop
};
/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
