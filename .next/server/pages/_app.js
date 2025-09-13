/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ MyApp)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/responsive.css */ \"./styles/responsive.css\");\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_responsive_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_6__);\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__]);\n_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// pages/_app.js\n\n\n\n\n\n\n\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClient();\n// Create context for pathname\nconst PathnameContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_5__.createContext)();\n// Wrapper component to provide pathname\nfunction PathnameContextProviderAdapter({ children, router }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PathnameContext.Provider, {\n        value: router.pathname,\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.js\",\n        lineNumber: 17,\n        columnNumber: 5\n    }, this);\n}\nfunction MyApp({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_6__.useRouter)();\n    // Pages where sticky footer should not appear\n    const hideFooterPages = [\n        \"/login\",\n        \"/signup\",\n        \"/reset-password\",\n        \"/verify-email\"\n    ];\n    const shouldShowFooter = !hideFooterPages.includes(router.pathname);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClientProvider, {\n        client: queryClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PathnameContextProviderAdapter, {\n            router: router,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: {\n                    paddingBottom: shouldShowFooter ? \"140px\" : \"0\"\n                },\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.js\",\n                    lineNumber: 34,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/pages/_app.js\",\n                lineNumber: 33,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/runner/workspace/pages/_app.js\",\n            lineNumber: 32,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.js\",\n        lineNumber: 31,\n        columnNumber: 5\n    }, this);\n}\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsZ0JBQWdCOztBQUNlO0FBQ0c7QUFDTDtBQUM0QztBQUNiO0FBQ3BCO0FBRXhDLE1BQU1PLGNBQWMsSUFBSU4sOERBQVdBO0FBRW5DLDhCQUE4QjtBQUM5QixNQUFNTyxnQ0FBa0JMLG9EQUFhQTtBQUVyQyx3Q0FBd0M7QUFDeEMsU0FBU00sK0JBQStCLEVBQUVDLFFBQVEsRUFBRUMsTUFBTSxFQUFFO0lBQzFELHFCQUNFLDhEQUFDSCxnQkFBZ0JJLFFBQVE7UUFBQ0MsT0FBT0YsT0FBT0csUUFBUTtrQkFDN0NKOzs7Ozs7QUFHUDtBQUVlLFNBQVNLLE1BQU0sRUFBRUMsU0FBUyxFQUFFQyxTQUFTLEVBQUU7SUFDcEQsTUFBTU4sU0FBU0wsc0RBQVNBO0lBRXhCLDhDQUE4QztJQUM5QyxNQUFNWSxrQkFBa0I7UUFBQztRQUFVO1FBQVc7UUFBbUI7S0FBZ0I7SUFDakYsTUFBTUMsbUJBQW1CLENBQUNELGdCQUFnQkUsUUFBUSxDQUFDVCxPQUFPRyxRQUFRO0lBRWxFLHFCQUNFLDhEQUFDWixzRUFBbUJBO1FBQUNtQixRQUFRZDtrQkFDM0IsNEVBQUNFO1lBQStCRSxRQUFRQTtzQkFDdEMsNEVBQUNXO2dCQUFJQyxPQUFPO29CQUFFQyxlQUFlTCxtQkFBbUIsVUFBVTtnQkFBSTswQkFDNUQsNEVBQUNIO29CQUFXLEdBQUdDLFNBQVM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUtsQyIsInNvdXJjZXMiOlsid2VicGFjazovL29ha2xpbmUtYmFuay8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBwYWdlcy9fYXBwLmpzXG5pbXBvcnQgJy4uL3N0eWxlcy9nbG9iYWxzLmNzcyc7XG5pbXBvcnQgJy4uL3N0eWxlcy9yZXNwb25zaXZlLmNzcyc7XG5pbXBvcnQgSGVhZCBmcm9tICduZXh0L2hlYWQnO1xuaW1wb3J0IHsgUXVlcnlDbGllbnQsIFF1ZXJ5Q2xpZW50UHJvdmlkZXIgfSBmcm9tICdAdGFuc3RhY2svcmVhY3QtcXVlcnknO1xuaW1wb3J0IHsgY3JlYXRlQ29udGV4dCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tICduZXh0L3JvdXRlcic7XG5cbmNvbnN0IHF1ZXJ5Q2xpZW50ID0gbmV3IFF1ZXJ5Q2xpZW50KClcblxuLy8gQ3JlYXRlIGNvbnRleHQgZm9yIHBhdGhuYW1lXG5jb25zdCBQYXRobmFtZUNvbnRleHQgPSBjcmVhdGVDb250ZXh0KClcblxuLy8gV3JhcHBlciBjb21wb25lbnQgdG8gcHJvdmlkZSBwYXRobmFtZVxuZnVuY3Rpb24gUGF0aG5hbWVDb250ZXh0UHJvdmlkZXJBZGFwdGVyKHsgY2hpbGRyZW4sIHJvdXRlciB9KSB7XG4gIHJldHVybiAoXG4gICAgPFBhdGhuYW1lQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17cm91dGVyLnBhdGhuYW1lfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L1BhdGhuYW1lQ29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBNeUFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcblxuICAvLyBQYWdlcyB3aGVyZSBzdGlja3kgZm9vdGVyIHNob3VsZCBub3QgYXBwZWFyXG4gIGNvbnN0IGhpZGVGb290ZXJQYWdlcyA9IFsnL2xvZ2luJywgJy9zaWdudXAnLCAnL3Jlc2V0LXBhc3N3b3JkJywgJy92ZXJpZnktZW1haWwnXVxuICBjb25zdCBzaG91bGRTaG93Rm9vdGVyID0gIWhpZGVGb290ZXJQYWdlcy5pbmNsdWRlcyhyb3V0ZXIucGF0aG5hbWUpXG5cbiAgcmV0dXJuIChcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIDxQYXRobmFtZUNvbnRleHRQcm92aWRlckFkYXB0ZXIgcm91dGVyPXtyb3V0ZXJ9PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdCb3R0b206IHNob3VsZFNob3dGb290ZXIgPyAnMTQwcHgnIDogJzAnIH19PlxuICAgICAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L1BhdGhuYW1lQ29udGV4dFByb3ZpZGVyQWRhcHRlcj5cbiAgICA8L1F1ZXJ5Q2xpZW50UHJvdmlkZXI+XG4gIClcbn0iXSwibmFtZXMiOlsiSGVhZCIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJ1c2VSb3V0ZXIiLCJxdWVyeUNsaWVudCIsIlBhdGhuYW1lQ29udGV4dCIsIlBhdGhuYW1lQ29udGV4dFByb3ZpZGVyQWRhcHRlciIsImNoaWxkcmVuIiwicm91dGVyIiwiUHJvdmlkZXIiLCJ2YWx1ZSIsInBhdGhuYW1lIiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJoaWRlRm9vdGVyUGFnZXMiLCJzaG91bGRTaG93Rm9vdGVyIiwiaW5jbHVkZXMiLCJjbGllbnQiLCJkaXYiLCJzdHlsZSIsInBhZGRpbmdCb3R0b20iXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "./styles/responsive.css":
/*!*******************************!*\
  !*** ./styles/responsive.css ***!
  \*******************************/
/***/ (() => {



/***/ }),

/***/ "next/dist/compiled/next-server/pages.runtime.dev.js":
/*!**********************************************************************!*\
  !*** external "next/dist/compiled/next-server/pages.runtime.dev.js" ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/pages.runtime.dev.js");

/***/ }),

/***/ "next/head":
/*!****************************!*\
  !*** external "next/head" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/head");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("react");

/***/ }),

/***/ "react-dom":
/*!****************************!*\
  !*** external "react-dom" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("react-dom");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ }),

/***/ "@tanstack/react-query":
/*!****************************************!*\
  !*** external "@tanstack/react-query" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@tanstack/react-query");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();