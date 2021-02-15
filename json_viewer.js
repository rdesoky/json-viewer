var E = function (id) {
  if (typeof id == "string") {
    return document.getElementById(id);
  }
  return id;
};

var Q = function (id) {
  if (typeof id == "string") {
    return document.querySelector(id);
  }
  return id;
};

function viewObj(obj, root, objName) {
  var NE = function (tag, attr, content) {
    var el = document.createElement(tag || "div");
    if (attr) {
      for (var k in attr) {
        el.setAttribute(k, attr[k]);
      }
      if (typeof content !== "undefined") {
        el.innerText = content;
      }
    }
    return el;
  };

  var AE = function (el, parent) {
    return parent.appendChild(el);
  };

  var idView = function (id) {
    var idv = id;
    if (id != objName) {
      idv = id.split(".").pop();
    }
    return idv + ": ";
  };

  var el = (function listNode(node, nodeID) {
    var nodeIDV = idView(nodeID);

    if (nodeIDV.indexOf("_") == 0 || typeof node === "function") {
      return null;
    }

    var newEl = NE("div", { class: "objView" });
    var elNodeID, expander, elVal;

    elNodeID = AE(NE("span", { class: "nodeID" }, nodeIDV), newEl);

    if (node === null) {
      newEl.className = "endNode";
      AE(
        NE(
          "span",
          { class: "nullVal", "data-watch": nodeID, title: nodeID },
          "null"
        ),
        newEl
      );
    } else if (typeof node === "function") {
      AE(
        NE(
          "span",
          { class: "fncVal", "data-watch": nodeID, title: nodeID },
          "function(..){..}"
        ),
        newEl
      );
      newEl.className = "endNode";
    } else if (typeof node === "object") {
      AE(NE("span", {}, node.length ? "[" : "{"), newEl);
      expander = AE(NE("span", { class: "expander ellipses" }, "..."), newEl);
      elNodeID.className = "nodeID expander";
      var closeEl = AE(NE("span", {}, node.length ? "]" : "}"), newEl);

      var expandHandler = function (e) {
        var p = this.parentElement;
        if (p.className === "objView") {
          if (p.getAttribute("expand")) {
            p.removeAttribute("expand");
          } else {
            p.setAttribute("expand", "1");

            if (!p.getAttribute("expanded")) {
              p.setAttribute("expanded", "1");
              for (var key in node) {
                var el = listNode(node[key], nodeID + "." + key);
                el && newEl.insertBefore(el, closeEl);
              }
            }
          }
        }
        e.stopPropagation();
      };

      expander.addEventListener("click", expandHandler);
      elNodeID.addEventListener("click", expandHandler);
    } else {
      newEl.className = "endNode";
      if (typeof node === "string") {
        AE(
          NE(
            "span",
            { class: "strVal", "data-watch": nodeID, title: nodeID },
            '"' + node + '"'
          ),
          newEl
        );
      } else {
        AE(
          NE(
            "span",
            { class: "val", "data-watch": nodeID, title: nodeID },
            node
          ),
          newEl
        );
      }
    }
    return newEl;
  })(obj, objName);

  el && AE(el, root);
}

function main() {
  viewObj(window, document.querySelector("#root"), "window");
}

window.addEventListener("load", main);
