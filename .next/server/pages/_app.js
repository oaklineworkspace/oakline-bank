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

/***/ "__barrel_optimize__?names=createClient!=!./node_modules/@supabase/supabase-js/dist/module/index.js":
/*!**********************************************************************************************************!*\
  !*** __barrel_optimize__?names=createClient!=!./node_modules/@supabase/supabase-js/dist/module/index.js ***!
  \**********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _home_runner_workspace_node_modules_supabase_supabase_js_dist_module_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@supabase/supabase-js/dist/module/index.js */ "./node_modules/@supabase/supabase-js/dist/module/index.js");
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_home_runner_workspace_node_modules_supabase_supabase_js_dist_module_index_js__WEBPACK_IMPORTED_MODULE_0__]);
_home_runner_workspace_node_modules_supabase_supabase_js_dist_module_index_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];
/* harmony reexport (unknown) */ var __WEBPACK_REEXPORT_OBJECT__ = {};
/* harmony reexport (unknown) */ for(const __WEBPACK_IMPORT_KEY__ in _home_runner_workspace_node_modules_supabase_supabase_js_dist_module_index_js__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== "default") __WEBPACK_REEXPORT_OBJECT__[__WEBPACK_IMPORT_KEY__] = () => _home_runner_workspace_node_modules_supabase_supabase_js_dist_module_index_js__WEBPACK_IMPORTED_MODULE_0__[__WEBPACK_IMPORT_KEY__]
/* harmony reexport (unknown) */ __webpack_require__.d(__webpack_exports__, __WEBPACK_REEXPORT_OBJECT__);

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ }),

/***/ "./components/StickyFooter.js":
/*!************************************!*\
  !*** ./components/StickyFooter.js ***!
  \************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (/* binding */ StickyFooter)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lib/supabaseClient */ \"./lib/supabaseClient.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__]);\n_lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\n\n\n\n\nfunction StickyFooter() {\n    const [user, setUser] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [loading, setLoading] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [isVisible, setIsVisible] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_2__.useRouter)();\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        // Get initial session\n        const getSession = async ()=>{\n            try {\n                const { data: { session } } = await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__.supabase.auth.getSession();\n                setUser(session?.user ?? null);\n            } catch (error) {\n                console.error(\"Error getting session:\", error);\n            } finally{\n                setLoading(false);\n            }\n        };\n        getSession();\n        // Listen for auth changes\n        const { data: { subscription } } = _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__.supabase.auth.onAuthStateChange(async (event, session)=>{\n            setUser(session?.user ?? null);\n            setLoading(false);\n        });\n        return ()=>subscription.unsubscribe();\n    }, []);\n    // Hide footer on certain pages\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const handleRouteChange = ()=>{\n            const currentPath = window.location.pathname;\n            const hiddenPaths = [\n                \"/login\",\n                \"/signup\",\n                \"/reset-password\",\n                \"/verify-email\"\n            ];\n            setIsVisible(!hiddenPaths.some((path)=>currentPath.startsWith(path)));\n        };\n        handleRouteChange();\n        window.addEventListener(\"popstate\", handleRouteChange);\n        return ()=>window.removeEventListener(\"popstate\", handleRouteChange);\n    }, []);\n    const handleSignOut = async ()=>{\n        try {\n            await _lib_supabaseClient__WEBPACK_IMPORTED_MODULE_4__.supabase.auth.signOut();\n            router.push(\"/\");\n        } catch (error) {\n            console.error(\"Error signing out:\", error);\n        }\n    };\n    if (!isVisible || loading) return null;\n    // Define navigation links based on user authentication status\n    const navigation = user ? [\n        {\n            name: \"Home\",\n            href: \"/\",\n            icon: \"\\uD83C\\uDFE0\"\n        },\n        {\n            name: \"Menu\",\n            href: \"/main-menu\",\n            icon: \"☰\"\n        },\n        {\n            name: \"Zelle\",\n            href: \"/zelle\",\n            icon: \"Z\"\n        },\n        {\n            name: \"Settings\",\n            href: \"/settings\",\n            icon: \"⚙️\"\n        },\n        {\n            name: \"Sign Out\",\n            href: \"#\",\n            icon: \"\\uD83D\\uDEAA\",\n            onClick: handleSignOut\n        }\n    ] : [\n        {\n            name: \"Home\",\n            href: \"/\",\n            icon: \"\\uD83C\\uDFE0\"\n        },\n        {\n            name: \"Menu\",\n            href: \"/main-menu\",\n            icon: \"☰\"\n        },\n        {\n            name: \"Sign In\",\n            href: \"/login\",\n            icon: \"\\uD83D\\uDD11\"\n        },\n        {\n            name: \"Apply\",\n            href: \"/apply\",\n            icon: \"\\uD83D\\uDCDD\"\n        }\n    ];\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        style: styles.stickyFooter,\n        className: \"sticky-footer\",\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n            style: styles.footerContainer,\n            children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                style: styles.footerContent,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    style: styles.navigationSection,\n                    children: navigation.map((navItem)=>/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)((next_link__WEBPACK_IMPORTED_MODULE_3___default()), {\n                            href: navItem.href,\n                            style: styles.navButton,\n                            onClick: navItem.onClick,\n                            children: [\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    style: styles.navIcon,\n                                    children: navItem.icon\n                                }, void 0, false, {\n                                    fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n                                    lineNumber: 90,\n                                    columnNumber: 17\n                                }, this),\n                                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"span\", {\n                                    style: styles.navText,\n                                    children: navItem.name\n                                }, void 0, false, {\n                                    fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n                                    lineNumber: 91,\n                                    columnNumber: 17\n                                }, this)\n                            ]\n                        }, navItem.name, true, {\n                            fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n                            lineNumber: 84,\n                            columnNumber: 15\n                        }, this))\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n                    lineNumber: 82,\n                    columnNumber: 11\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n                lineNumber: 80,\n                columnNumber: 9\n            }, this)\n        }, void 0, false, {\n            fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n            lineNumber: 79,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/components/StickyFooter.js\",\n        lineNumber: 78,\n        columnNumber: 5\n    }, this);\n}\nconst styles = {\n    stickyFooter: {\n        position: \"fixed\",\n        bottom: 0,\n        left: 0,\n        right: 0,\n        background: \"linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)\",\n        color: \"white\",\n        padding: \"1rem 1.5rem\",\n        boxShadow: \"0 -8px 32px rgba(0, 0, 0, 0.3)\",\n        backdropFilter: \"blur(20px)\",\n        zIndex: 1000,\n        borderTop: \"1px solid rgba(255, 255, 255, 0.08)\",\n        minHeight: \"70px\",\n        display: \"flex\",\n        alignItems: \"center\"\n    },\n    footerContainer: {\n        width: \"100%\",\n        maxWidth: \"1400px\",\n        margin: \"0 auto\",\n        padding: \"0 1rem\"\n    },\n    footerContent: {\n        display: \"flex\",\n        alignItems: \"center\",\n        justifyContent: \"space-between\",\n        maxWidth: \"1400px\",\n        margin: \"0 auto\",\n        gap: \"1.5rem\",\n        flexWrap: \"wrap\"\n    },\n    navigationSection: {\n        display: \"flex\",\n        alignItems: \"center\",\n        justifyContent: \"space-between\",\n        width: \"100%\",\n        gap: \"0.5rem\"\n    },\n    navButton: {\n        display: \"flex\",\n        flexDirection: \"column\",\n        alignItems: \"center\",\n        justifyContent: \"center\",\n        padding: \"0.375rem 0.25rem\",\n        backgroundColor: \"white\",\n        color: \"#1A3E6F\",\n        textDecoration: \"none\",\n        borderRadius: \"6px\",\n        fontSize: \"0.6rem\",\n        fontWeight: \"600\",\n        transition: \"all 0.3s ease\",\n        cursor: \"pointer\",\n        border: \"1px solid rgba(26, 62, 111, 0.1)\",\n        boxShadow: \"0 1px 4px rgba(26, 62, 111, 0.15)\",\n        minHeight: \"30px\",\n        flex: 1,\n        backdropFilter: \"blur(10px)\"\n    },\n    navIcon: {\n        fontSize: \"0.6rem\",\n        marginBottom: \"0.125rem\",\n        filter: \"brightness(0.8)\"\n    },\n    navText: {\n        fontSize: \"0.5rem\",\n        fontWeight: \"600\",\n        textAlign: \"center\",\n        lineHeight: \"1\",\n        color: \"#1A3E6F\"\n    }\n};\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Y0FBYztRQUNkQyxVQUFVO1FBQ1ZDLFlBQVk7UUFDWkMsWUFBWTtRQUNaQyxRQUFRO1FBQ1JDLFFBQVE7UUFDUnJCLFdBQVc7UUFDWEksV0FBVztRQUNYa0IsTUFBTTtRQUNOckIsZ0JBQWdCO0lBQ2xCO0lBQ0FWLFNBQVM7UUFDUDBCLFVBQVU7UUFDVk0sY0FBYztRQUNkQyxRQUFRO0lBQ1Y7SUFDQWhDLFNBQVM7UUFDUHlCLFVBQVU7UUFDVkMsWUFBWTtRQUNaTyxXQUFXO1FBQ1hDLFlBQVk7UUFDWjVCLE9BQU87SUFDVDtBQUNGIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2FrbGluZS1iYW5rLy4vY29tcG9uZW50cy9TdGlja3lGb290ZXIuanM/OWIyZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlUm91dGVyIH0gZnJvbSAnbmV4dC9yb3V0ZXInO1xuaW1wb3J0IExpbmsgZnJvbSAnbmV4dC9saW5rJztcbmltcG9ydCB7IHN1cGFiYXNlIH0gZnJvbSAnLi4vbGliL3N1cGFiYXNlQ2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gU3RpY2t5Rm9vdGVyKCkge1xuICBjb25zdCBbdXNlciwgc2V0VXNlcl0gPSB1c2VTdGF0ZShudWxsKTtcbiAgY29uc3QgW2xvYWRpbmcsIHNldExvYWRpbmddID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtpc1Zpc2libGUsIHNldElzVmlzaWJsZV0gPSB1c2VTdGF0ZSh0cnVlKTtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyBHZXQgaW5pdGlhbCBzZXNzaW9uXG4gICAgY29uc3QgZ2V0U2Vzc2lvbiA9IGFzeW5jICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgZGF0YTogeyBzZXNzaW9uIH0gfSA9IGF3YWl0IHN1cGFiYXNlLmF1dGguZ2V0U2Vzc2lvbigpO1xuICAgICAgICBzZXRVc2VyKHNlc3Npb24/LnVzZXIgPz8gbnVsbCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBnZXR0aW5nIHNlc3Npb246JywgZXJyb3IpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGdldFNlc3Npb24oKTtcblxuICAgIC8vIExpc3RlbiBmb3IgYXV0aCBjaGFuZ2VzXG4gICAgY29uc3QgeyBkYXRhOiB7IHN1YnNjcmlwdGlvbiB9IH0gPSBzdXBhYmFzZS5hdXRoLm9uQXV0aFN0YXRlQ2hhbmdlKFxuICAgICAgYXN5bmMgKGV2ZW50LCBzZXNzaW9uKSA9PiB7XG4gICAgICAgIHNldFVzZXIoc2Vzc2lvbj8udXNlciA/PyBudWxsKTtcbiAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIC8vIEhpZGUgZm9vdGVyIG9uIGNlcnRhaW4gcGFnZXNcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBoYW5kbGVSb3V0ZUNoYW5nZSA9ICgpID0+IHtcbiAgICAgIGNvbnN0IGN1cnJlbnRQYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgICAgY29uc3QgaGlkZGVuUGF0aHMgPSBbJy9sb2dpbicsICcvc2lnbnVwJywgJy9yZXNldC1wYXNzd29yZCcsICcvdmVyaWZ5LWVtYWlsJ107XG4gICAgICBzZXRJc1Zpc2libGUoIWhpZGRlblBhdGhzLnNvbWUocGF0aCA9PiBjdXJyZW50UGF0aC5zdGFydHNXaXRoKHBhdGgpKSk7XG4gICAgfTtcblxuICAgIGhhbmRsZVJvdXRlQ2hhbmdlKCk7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3BvcHN0YXRlJywgaGFuZGxlUm91dGVDaGFuZ2UpO1xuXG4gICAgcmV0dXJuICgpID0+IHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdwb3BzdGF0ZScsIGhhbmRsZVJvdXRlQ2hhbmdlKTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZVNpZ25PdXQgPSBhc3luYyAoKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IHN1cGFiYXNlLmF1dGguc2lnbk91dCgpO1xuICAgICAgcm91dGVyLnB1c2goJy8nKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRXJyb3Igc2lnbmluZyBvdXQ6JywgZXJyb3IpO1xuICAgIH1cbiAgfTtcblxuICBpZiAoIWlzVmlzaWJsZSB8fCBsb2FkaW5nKSByZXR1cm4gbnVsbDtcblxuICAvLyBEZWZpbmUgbmF2aWdhdGlvbiBsaW5rcyBiYXNlZCBvbiB1c2VyIGF1dGhlbnRpY2F0aW9uIHN0YXR1c1xuICBjb25zdCBuYXZpZ2F0aW9uID0gdXNlciA/IFtcbiAgICB7IG5hbWU6ICdIb21lJywgaHJlZjogJy8nLCBpY29uOiAn8J+PoCcgfSxcbiAgICB7IG5hbWU6ICdNZW51JywgaHJlZjogJy9tYWluLW1lbnUnLCBpY29uOiAn4piwJyB9LFxuICAgIHsgbmFtZTogJ1plbGxlJywgaHJlZjogJy96ZWxsZScsIGljb246ICdaJyB9LFxuICAgIHsgbmFtZTogJ1NldHRpbmdzJywgaHJlZjogJy9zZXR0aW5ncycsIGljb246ICfimpnvuI8nIH0sXG4gICAgeyBuYW1lOiAnU2lnbiBPdXQnLCBocmVmOiAnIycsIGljb246ICfwn5qqJywgb25DbGljazogaGFuZGxlU2lnbk91dCB9XG4gIF0gOiBbXG4gICAgeyBuYW1lOiAnSG9tZScsIGhyZWY6ICcvJywgaWNvbjogJ/Cfj6AnIH0sXG4gICAgeyBuYW1lOiAnTWVudScsIGhyZWY6ICcvbWFpbi1tZW51JywgaWNvbjogJ+KYsCcgfSxcbiAgICB7IG5hbWU6ICdTaWduIEluJywgaHJlZjogJy9sb2dpbicsIGljb246ICfwn5SRJyB9LFxuICAgIHsgbmFtZTogJ0FwcGx5JywgaHJlZjogJy9hcHBseScsIGljb246ICfwn5OdJyB9XG4gIF07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuc3RpY2t5Rm9vdGVyfSBjbGFzc05hbWU9XCJzdGlja3ktZm9vdGVyXCI+XG4gICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMuZm9vdGVyQ29udGFpbmVyfT5cbiAgICAgICAgPGRpdiBzdHlsZT17c3R5bGVzLmZvb3RlckNvbnRlbnR9PlxuICAgICAgICAgIHsvKiBTaW5nbGUgUm93IE5hdmlnYXRpb24gQnV0dG9ucyAqL31cbiAgICAgICAgICA8ZGl2IHN0eWxlPXtzdHlsZXMubmF2aWdhdGlvblNlY3Rpb259PlxuICAgICAgICAgICAge25hdmlnYXRpb24ubWFwKChuYXZJdGVtKSA9PiAoXG4gICAgICAgICAgICAgIDxMaW5rXG4gICAgICAgICAgICAgICAga2V5PXtuYXZJdGVtLm5hbWV9XG4gICAgICAgICAgICAgICAgaHJlZj17bmF2SXRlbS5ocmVmfVxuICAgICAgICAgICAgICAgIHN0eWxlPXtzdHlsZXMubmF2QnV0dG9ufVxuICAgICAgICAgICAgICAgIG9uQ2xpY2s9e25hdkl0ZW0ub25DbGlja31cbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXtzdHlsZXMubmF2SWNvbn0+e25hdkl0ZW0uaWNvbn08L3NwYW4+XG4gICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3N0eWxlcy5uYXZUZXh0fT57bmF2SXRlbS5uYW1lfTwvc3Bhbj5cbiAgICAgICAgICAgICAgPC9MaW5rPlxuICAgICAgICAgICAgKSl9XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmNvbnN0IHN0eWxlcyA9IHtcbiAgc3RpY2t5Rm9vdGVyOiB7XG4gICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgYm90dG9tOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYmFja2dyb3VuZDogJ2xpbmVhci1ncmFkaWVudCgxMzVkZWcsICMwZjE3MmEgMCUsICMxZTI5M2IgNTAlLCAjMzM0MTU1IDEwMCUpJyxcbiAgICBjb2xvcjogJ3doaXRlJyxcbiAgICBwYWRkaW5nOiAnMXJlbSAxLjVyZW0nLFxuICAgIGJveFNoYWRvdzogJzAgLThweCAzMnB4IHJnYmEoMCwgMCwgMCwgMC4zKScsXG4gICAgYmFja2Ryb3BGaWx0ZXI6ICdibHVyKDIwcHgpJyxcbiAgICB6SW5kZXg6IDEwMDAsXG4gICAgYm9yZGVyVG9wOiAnMXB4IHNvbGlkIHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCknLFxuICAgIG1pbkhlaWdodDogJzcwcHgnLFxuICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICBhbGlnbkl0ZW1zOiAnY2VudGVyJ1xuICB9LFxuICBmb290ZXJDb250YWluZXI6IHtcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIG1heFdpZHRoOiAnMTQwMHB4JyxcbiAgICBtYXJnaW46ICcwIGF1dG8nLFxuICAgIHBhZGRpbmc6ICcwIDFyZW0nXG4gIH0sXG4gIGZvb3RlckNvbnRlbnQ6IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICBtYXhXaWR0aDogJzE0MDBweCcsXG4gICAgbWFyZ2luOiAnMCBhdXRvJyxcbiAgICBnYXA6ICcxLjVyZW0nLFxuICAgIGZsZXhXcmFwOiAnd3JhcCdcbiAgfSxcbiAgbmF2aWdhdGlvblNlY3Rpb246IHtcbiAgICBkaXNwbGF5OiAnZmxleCcsXG4gICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAganVzdGlmeUNvbnRlbnQ6ICdzcGFjZS1iZXR3ZWVuJyxcbiAgICB3aWR0aDogJzEwMCUnLFxuICAgIGdhcDogJzAuNXJlbSdcbiAgfSxcbiAgbmF2QnV0dG9uOiB7XG4gICAgZGlzcGxheTogJ2ZsZXgnLFxuICAgIGZsZXhEaXJlY3Rpb246ICdjb2x1bW4nLFxuICAgIGFsaWduSXRlbXM6ICdjZW50ZXInLFxuICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICBwYWRkaW5nOiAnMC4zNzVyZW0gMC4yNXJlbScsXG4gICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgIGNvbG9yOiAnIzFBM0U2RicsXG4gICAgdGV4dERlY29yYXRpb246ICdub25lJyxcbiAgICBib3JkZXJSYWRpdXM6ICc2cHgnLFxuICAgIGZvbnRTaXplOiAnMC42cmVtJyxcbiAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICB0cmFuc2l0aW9uOiAnYWxsIDAuM3MgZWFzZScsXG4gICAgY3Vyc29yOiAncG9pbnRlcicsXG4gICAgYm9yZGVyOiAnMXB4IHNvbGlkIHJnYmEoMjYsIDYyLCAxMTEsIDAuMSknLFxuICAgIGJveFNoYWRvdzogJzAgMXB4IDRweCByZ2JhKDI2LCA2MiwgMTExLCAwLjE1KScsXG4gICAgbWluSGVpZ2h0OiAnMzBweCcsXG4gICAgZmxleDogMSxcbiAgICBiYWNrZHJvcEZpbHRlcjogJ2JsdXIoMTBweCknXG4gIH0sXG4gIG5hdkljb246IHtcbiAgICBmb250U2l6ZTogJzAuNnJlbScsXG4gICAgbWFyZ2luQm90dG9tOiAnMC4xMjVyZW0nLFxuICAgIGZpbHRlcjogJ2JyaWdodG5lc3MoMC44KSdcbiAgfSxcbiAgbmF2VGV4dDoge1xuICAgIGZvbnRTaXplOiAnMC41cmVtJyxcbiAgICBmb250V2VpZ2h0OiAnNjAwJyxcbiAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgIGxpbmVIZWlnaHQ6ICcxJyxcbiAgICBjb2xvcjogJyMxQTNFNkYnXG4gIH1cbn07Il0sIm5hbWVzIjpbInVzZVN0YXRlIiwidXNlRWZmZWN0IiwidXNlUm91dGVyIiwiTGluayIsInN1cGFiYXNlIiwiU3RpY2t5Rm9vdGVyIiwidXNlciIsInNldFVzZXIiLCJsb2FkaW5nIiwic2V0TG9hZGluZyIsImlzVmlzaWJsZSIsInNldElzVmlzaWJsZSIsInJvdXRlciIsImdldFNlc3Npb24iLCJkYXRhIiwic2Vzc2lvbiIsImF1dGgiLCJlcnJvciIsImNvbnNvbGUiLCJzdWJzY3JpcHRpb24iLCJvbkF1dGhTdGF0ZUNoYW5nZSIsImV2ZW50IiwidW5zdWJzY3JpYmUiLCJoYW5kbGVSb3V0ZUNoYW5nZSIsImN1cnJlbnRQYXRoIiwid2luZG93IiwibG9jYXRpb24iLCJwYXRobmFtZSIsImhpZGRlblBhdGhzIiwic29tZSIsInBhdGgiLCJzdGFydHNXaXRoIiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJoYW5kbGVTaWduT3V0Iiwic2lnbk91dCIsInB1c2giLCJuYXZpZ2F0aW9uIiwibmFtZSIsImhyZWYiLCJpY29uIiwib25DbGljayIsImRpdiIsInN0eWxlIiwic3R5bGVzIiwic3RpY2t5Rm9vdGVyIiwiY2xhc3NOYW1lIiwiZm9vdGVyQ29udGFpbmVyIiwiZm9vdGVyQ29udGVudCIsIm5hdmlnYXRpb25TZWN0aW9uIiwibWFwIiwibmF2SXRlbSIsIm5hdkJ1dHRvbiIsInNwYW4iLCJuYXZJY29uIiwibmF2VGV4dCIsInBvc2l0aW9uIiwiYm90dG9tIiwibGVmdCIsInJpZ2h0IiwiYmFja2dyb3VuZCIsImNvbG9yIiwicGFkZGluZyIsImJveFNoYWRvdyIsImJhY2tkcm9wRmlsdGVyIiwiekluZGV4IiwiYm9yZGVyVG9wIiwibWluSGVpZ2h0IiwiZGlzcGxheSIsImFsaWduSXRlbXMiLCJ3aWR0aCIsIm1heFdpZHRoIiwibWFyZ2luIiwianVzdGlmeUNvbnRlbnQiLCJnYXAiLCJmbGV4V3JhcCIsImZsZXhEaXJlY3Rpb24iLCJiYWNrZ3JvdW5kQ29sb3IiLCJ0ZXh0RGVjb3JhdGlvbiIsImJvcmRlclJhZGl1cyIsImZvbnRTaXplIiwiZm9udFdlaWdodCIsInRyYW5zaXRpb24iLCJjdXJzb3IiLCJib3JkZXIiLCJmbGV4IiwibWFyZ2luQm90dG9tIiwiZmlsdGVyIiwidGV4dEFsaWduIiwibGluZUhlaWdodCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/StickyFooter.js\n");

/***/ }),

/***/ "./lib/supabaseClient.js":
/*!*******************************!*\
  !*** ./lib/supabaseClient.js ***!
  \*******************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   supabase: () => (/* binding */ supabase),\n/* harmony export */   supabaseAdmin: () => (/* binding */ supabaseAdmin)\n/* harmony export */ });\n/* harmony import */ var _barrel_optimize_names_createClient_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! __barrel_optimize__?names=createClient!=!@supabase/supabase-js */ \"__barrel_optimize__?names=createClient!=!./node_modules/@supabase/supabase-js/dist/module/index.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_barrel_optimize_names_createClient_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__]);\n_barrel_optimize_names_createClient_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n// lib/supabaseClient.js\n\n// Supabase configuration - Use your environment variables\nconst supabaseUrl = \"https://nrjdmgltshosdqccaymr.supabase.co\" || 0 || 0;\nconst supabaseAnonKey = \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2hvc2RxY2NheW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwMzYyMjAsImV4cCI6MjA3MTYxMjIyMH0.b9H553W2PCsSNvr8HyyINl4nTSrldHN_QMQ3TVwt6qk\" || 0 || 0;\nconst supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5yamRtZ2x0c2hvc2RxY2NheW1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjAzNjIyMCwiZXhwIjoyMDcxNjEyMjIwfQ.cXKwVlQNqtAE13jrgmr2RBuIwtEbxqGsVF9SiRwqV_E\";\n// Validate required environment variables\nif (!supabaseUrl || !supabaseAnonKey) {\n    console.error(\"Missing Supabase configuration\");\n}\n// Public client for front-end (browser)\nlet supabaseInstance = null;\nconst supabase = (()=>{\n    if (!supabaseInstance) {\n        supabaseInstance = (0,_barrel_optimize_names_createClient_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseAnonKey, {\n            auth: {\n                persistSession: true,\n                storage:  false ? 0 : null,\n                detectSessionInUrl: true\n            }\n        });\n    }\n    return supabaseInstance;\n})();\n// Server-side client with elevated privileges\nconst supabaseAdmin = (0,_barrel_optimize_names_createClient_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_0__.createClient)(supabaseUrl, supabaseServiceKey);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9saWIvc3VwYWJhc2VDbGllbnQuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsd0JBQXdCO0FBQzZCO0FBRXJELDBEQUEwRDtBQUMxRCxNQUFNQyxjQUFjQywwQ0FBb0MsSUFBSUEsQ0FBd0IsSUFBSTtBQUN4RixNQUFNSSxrQkFBa0JKLGtOQUF5QyxJQUFJQSxDQUE2QixJQUFJO0FBQ3RHLE1BQU1PLHFCQUFxQlAsUUFBUUMsR0FBRyxDQUFDTyx5QkFBeUIsSUFBSVIsUUFBUUMsR0FBRyxDQUFDUSxvQkFBb0IsSUFBSTtBQUV4RywwQ0FBMEM7QUFDMUMsSUFBSSxDQUFDVixlQUFlLENBQUNLLGlCQUFpQjtJQUNwQ00sUUFBUUMsS0FBSyxDQUFDO0FBQ2hCO0FBRUEsd0NBQXdDO0FBQ3hDLElBQUlDLG1CQUFtQjtBQUVoQixNQUFNQyxXQUFXLENBQUM7SUFDdkIsSUFBSSxDQUFDRCxrQkFBa0I7UUFDckJBLG1CQUFtQmQsc0dBQVlBLENBQUNDLGFBQWFLLGlCQUFpQjtZQUM1RFUsTUFBTTtnQkFDSkMsZ0JBQWdCO2dCQUNoQkMsU0FBUyxNQUFrQixHQUFjQyxDQUFtQixHQUFHO2dCQUMvREUsb0JBQW9CO1lBQ3RCO1FBQ0Y7SUFDRjtJQUNBLE9BQU9QO0FBQ1QsS0FBSTtBQUVKLDhDQUE4QztBQUN2QyxNQUFNUSxnQkFBZ0J0QixzR0FBWUEsQ0FBQ0MsYUFBYVEsb0JBQW9CIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2FrbGluZS1iYW5rLy4vbGliL3N1cGFiYXNlQ2xpZW50LmpzPzVmMGQiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gbGliL3N1cGFiYXNlQ2xpZW50LmpzXG5pbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnO1xuXG4vLyBTdXBhYmFzZSBjb25maWd1cmF0aW9uIC0gVXNlIHlvdXIgZW52aXJvbm1lbnQgdmFyaWFibGVzXG5jb25zdCBzdXBhYmFzZVVybCA9IHByb2Nlc3MuZW52Lk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCB8fCBwcm9jZXNzLmVudi5TVVBBQkFTRV9VUkwgfHwgJ2h0dHBzOi8vbnJqZG1nbHRzaG9zZHFjY2F5bXIuc3VwYWJhc2UuY28nO1xuY29uc3Qgc3VwYWJhc2VBbm9uS2V5ID0gcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfQU5PTl9LRVkgfHwgcHJvY2Vzcy5lbnYuU1VQQUJBU0VfQU5PTl9LRVkgfHwgJ2V5SmhiR2NpT2lKSVV6STFOaUlzSW5SNWNDSTZJa3BYVkNKOS5leUpwYzNNaU9pSnpkWEJoWW1GelpTSXNJbkpsWmlJNkltNXlhbVJ0WjJ4MGMyaHZjMlJ4WTJOaGVXMXlJaXdpY205c1pTSTZJbUZ1YjI0aUxDSnBZWFFpT2pFM05UWXdNell5TWpBc0ltVjRjQ0k2TWpBM01UWXhNakl5TUgwLmI5SDU1M1cyUENzU052cjhIeXlJTmw0blRTcmxkSE5fUU1RM1RWd3Q2cWsnO1xuY29uc3Qgc3VwYWJhc2VTZXJ2aWNlS2V5ID0gcHJvY2Vzcy5lbnYuU1VQQUJBU0VfU0VSVklDRV9ST0xFX0tFWSB8fCBwcm9jZXNzLmVudi5TVVBBQkFTRV9TRVJWSUNFX0tFWSB8fCAnZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnBjM01pT2lKemRYQmhZbUZ6WlNJc0luSmxaaUk2SW01eWFtUnRaMngwYzJodmMyUnhZMk5oZVcxeUlpd2ljbTlzWlNJNkluTmxjblpwWTJWZmNtOXNaU0lzSW1saGRDSTZNVGMxTmpBek5qSXlNQ3dpWlhod0lqb3lNRGN4TmpFeU1qSXdmUS5jWEt3VmxRTnF0QUUxM2pyZ21yMlJCdUl3dEVieHFHc1ZGOVNpUndxVl9FJztcblxuLy8gVmFsaWRhdGUgcmVxdWlyZWQgZW52aXJvbm1lbnQgdmFyaWFibGVzXG5pZiAoIXN1cGFiYXNlVXJsIHx8ICFzdXBhYmFzZUFub25LZXkpIHtcbiAgY29uc29sZS5lcnJvcignTWlzc2luZyBTdXBhYmFzZSBjb25maWd1cmF0aW9uJyk7XG59XG5cbi8vIFB1YmxpYyBjbGllbnQgZm9yIGZyb250LWVuZCAoYnJvd3NlcilcbmxldCBzdXBhYmFzZUluc3RhbmNlID0gbnVsbFxuXG5leHBvcnQgY29uc3Qgc3VwYWJhc2UgPSAoKCkgPT4ge1xuICBpZiAoIXN1cGFiYXNlSW5zdGFuY2UpIHtcbiAgICBzdXBhYmFzZUluc3RhbmNlID0gY3JlYXRlQ2xpZW50KHN1cGFiYXNlVXJsLCBzdXBhYmFzZUFub25LZXksIHtcbiAgICAgIGF1dGg6IHtcbiAgICAgICAgcGVyc2lzdFNlc3Npb246IHRydWUsXG4gICAgICAgIHN0b3JhZ2U6IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnID8gd2luZG93LmxvY2FsU3RvcmFnZSA6IG51bGwsXG4gICAgICAgIGRldGVjdFNlc3Npb25JblVybDogdHJ1ZVxuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgcmV0dXJuIHN1cGFiYXNlSW5zdGFuY2Vcbn0pKClcblxuLy8gU2VydmVyLXNpZGUgY2xpZW50IHdpdGggZWxldmF0ZWQgcHJpdmlsZWdlc1xuZXhwb3J0IGNvbnN0IHN1cGFiYXNlQWRtaW4gPSBjcmVhdGVDbGllbnQoc3VwYWJhc2VVcmwsIHN1cGFiYXNlU2VydmljZUtleSk7Il0sIm5hbWVzIjpbImNyZWF0ZUNsaWVudCIsInN1cGFiYXNlVXJsIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIlNVUEFCQVNFX1VSTCIsInN1cGFiYXNlQW5vbktleSIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiU1VQQUJBU0VfQU5PTl9LRVkiLCJzdXBhYmFzZVNlcnZpY2VLZXkiLCJTVVBBQkFTRV9TRVJWSUNFX1JPTEVfS0VZIiwiU1VQQUJBU0VfU0VSVklDRV9LRVkiLCJjb25zb2xlIiwiZXJyb3IiLCJzdXBhYmFzZUluc3RhbmNlIiwic3VwYWJhc2UiLCJhdXRoIiwicGVyc2lzdFNlc3Npb24iLCJzdG9yYWdlIiwid2luZG93IiwibG9jYWxTdG9yYWdlIiwiZGV0ZWN0U2Vzc2lvbkluVXJsIiwic3VwYWJhc2VBZG1pbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./lib/supabaseClient.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _styles_button_fixes_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../styles/button-fixes.css */ \"./styles/button-fixes.css\");\n/* harmony import */ var _styles_button_fixes_css__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_styles_button_fixes_css__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../styles/responsive.css */ \"./styles/responsive.css\");\n/* harmony import */ var _styles_responsive_css__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_responsive_css__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var _styles_StickyFooter_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../styles/StickyFooter.css */ \"./styles/StickyFooter.css\");\n/* harmony import */ var _styles_StickyFooter_css__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_styles_StickyFooter_css__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/head */ \"next/head\");\n/* harmony import */ var next_head__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_head__WEBPACK_IMPORTED_MODULE_5__);\n/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @tanstack/react-query */ \"@tanstack/react-query\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_7__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_8__);\n/* harmony import */ var _components_StickyFooter__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../components/StickyFooter */ \"./components/StickyFooter.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__, _components_StickyFooter__WEBPACK_IMPORTED_MODULE_9__]);\n([_tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__, _components_StickyFooter__WEBPACK_IMPORTED_MODULE_9__] = __webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__);\n// pages/_app.js\n\n\n\n\n\n\n\n\n\n\nconst queryClient = new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__.QueryClient();\n// Create context for pathname\nconst PathnameContext = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_7__.createContext)();\n// Wrapper component to provide pathname\nfunction PathnameContextProviderAdapter({ children, router }) {\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PathnameContext.Provider, {\n        value: router.pathname,\n        children: children\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.js\",\n        lineNumber: 20,\n        columnNumber: 5\n    }, this);\n}\n// Memoize the app component for better performance\nconst App = /*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_7__.memo)(function App({ Component, pageProps }) {\n    const router = (0,next_router__WEBPACK_IMPORTED_MODULE_8__.useRouter)();\n    // Pages where sticky footer should not appear\n    const hideFooterPages = [\n        \"/login\",\n        \"/signup\",\n        \"/reset-password\",\n        \"/verify-email\"\n    ];\n    const shouldShowFooter = !hideFooterPages.includes(router.pathname);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_6__.QueryClientProvider, {\n        client: queryClient,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(PathnameContextProviderAdapter, {\n            router: router,\n            children: [\n                /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                    style: {\n                        paddingBottom: shouldShowFooter ? \"80px\" : \"0\"\n                    },\n                    children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                        ...pageProps\n                    }, void 0, false, {\n                        fileName: \"/home/runner/workspace/pages/_app.js\",\n                        lineNumber: 38,\n                        columnNumber: 11\n                    }, this)\n                }, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.js\",\n                    lineNumber: 37,\n                    columnNumber: 9\n                }, this),\n                shouldShowFooter && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_components_StickyFooter__WEBPACK_IMPORTED_MODULE_9__[\"default\"], {}, void 0, false, {\n                    fileName: \"/home/runner/workspace/pages/_app.js\",\n                    lineNumber: 40,\n                    columnNumber: 30\n                }, this)\n            ]\n        }, void 0, true, {\n            fileName: \"/home/runner/workspace/pages/_app.js\",\n            lineNumber: 36,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/home/runner/workspace/pages/_app.js\",\n        lineNumber: 35,\n        columnNumber: 5\n    }, this);\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (App);\n\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxnQkFBZ0I7O0FBQ2M7QUFDTTtBQUNGO0FBQ0U7QUFDUDtBQUM0QztBQUNQO0FBQzFCO0FBQ2M7QUFFdEQsTUFBTVMsY0FBYyxJQUFJUiw4REFBV0E7QUFFbkMsOEJBQThCO0FBQzlCLE1BQU1TLGdDQUFrQlAsb0RBQWFBO0FBRXJDLHdDQUF3QztBQUN4QyxTQUFTUSwrQkFBK0IsRUFBRUMsUUFBUSxFQUFFQyxNQUFNLEVBQUU7SUFDMUQscUJBQ0UsOERBQUNILGdCQUFnQkksUUFBUTtRQUFDQyxPQUFPRixPQUFPRyxRQUFRO2tCQUM3Q0o7Ozs7OztBQUdQO0FBRUEsbURBQW1EO0FBQ25ELE1BQU1LLG9CQUFNWCwyQ0FBSUEsQ0FBQyxTQUFTVyxJQUFJLEVBQUVDLFNBQVMsRUFBRUMsU0FBUyxFQUFFO0lBQ3BELE1BQU1OLFNBQVNOLHNEQUFTQTtJQUV4Qiw4Q0FBOEM7SUFDOUMsTUFBTWEsa0JBQWtCO1FBQUM7UUFBVTtRQUFXO1FBQW1CO0tBQWdCO0lBQ2pGLE1BQU1DLG1CQUFtQixDQUFDRCxnQkFBZ0JFLFFBQVEsQ0FBQ1QsT0FBT0csUUFBUTtJQUVsRSxxQkFDRSw4REFBQ2Qsc0VBQW1CQTtRQUFDcUIsUUFBUWQ7a0JBQzNCLDRFQUFDRTtZQUErQkUsUUFBUUE7OzhCQUN0Qyw4REFBQ1c7b0JBQUlDLE9BQU87d0JBQUVDLGVBQWVMLG1CQUFtQixTQUFTO29CQUFJOzhCQUMzRCw0RUFBQ0g7d0JBQVcsR0FBR0MsU0FBUzs7Ozs7Ozs7Ozs7Z0JBRXpCRSxrQ0FBb0IsOERBQUNiLGdFQUFZQTs7Ozs7Ozs7Ozs7Ozs7OztBQUkxQztBQUVBLGlFQUFlUyxHQUFHQSxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2FrbGluZS1iYW5rLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIHBhZ2VzL19hcHAuanNcbmltcG9ydCAnLi4vc3R5bGVzL2dsb2JhbHMuY3NzJ1xuaW1wb3J0ICcuLi9zdHlsZXMvYnV0dG9uLWZpeGVzLmNzcyc7XG5pbXBvcnQgJy4uL3N0eWxlcy9yZXNwb25zaXZlLmNzcyc7XG5pbXBvcnQgJy4uL3N0eWxlcy9TdGlja3lGb290ZXIuY3NzJztcbmltcG9ydCBIZWFkIGZyb20gJ25leHQvaGVhZCc7XG5pbXBvcnQgeyBRdWVyeUNsaWVudCwgUXVlcnlDbGllbnRQcm92aWRlciB9IGZyb20gJ0B0YW5zdGFjay9yZWFjdC1xdWVyeSc7XG5pbXBvcnQgeyBjcmVhdGVDb250ZXh0LCB1c2VDb250ZXh0LCB1c2VTdGF0ZSwgbWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVJvdXRlciB9IGZyb20gJ25leHQvcm91dGVyJztcbmltcG9ydCBTdGlja3lGb290ZXIgZnJvbSAnLi4vY29tcG9uZW50cy9TdGlja3lGb290ZXInO1xuXG5jb25zdCBxdWVyeUNsaWVudCA9IG5ldyBRdWVyeUNsaWVudCgpXG5cbi8vIENyZWF0ZSBjb250ZXh0IGZvciBwYXRobmFtZVxuY29uc3QgUGF0aG5hbWVDb250ZXh0ID0gY3JlYXRlQ29udGV4dCgpXG5cbi8vIFdyYXBwZXIgY29tcG9uZW50IHRvIHByb3ZpZGUgcGF0aG5hbWVcbmZ1bmN0aW9uIFBhdGhuYW1lQ29udGV4dFByb3ZpZGVyQWRhcHRlcih7IGNoaWxkcmVuLCByb3V0ZXIgfSkge1xuICByZXR1cm4gKFxuICAgIDxQYXRobmFtZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3JvdXRlci5wYXRobmFtZX0+XG4gICAgICB7Y2hpbGRyZW59XG4gICAgPC9QYXRobmFtZUNvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuLy8gTWVtb2l6ZSB0aGUgYXBwIGNvbXBvbmVudCBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlXG5jb25zdCBBcHAgPSBtZW1vKGZ1bmN0aW9uIEFwcCh7IENvbXBvbmVudCwgcGFnZVByb3BzIH0pIHtcbiAgY29uc3Qgcm91dGVyID0gdXNlUm91dGVyKClcblxuICAvLyBQYWdlcyB3aGVyZSBzdGlja3kgZm9vdGVyIHNob3VsZCBub3QgYXBwZWFyXG4gIGNvbnN0IGhpZGVGb290ZXJQYWdlcyA9IFsnL2xvZ2luJywgJy9zaWdudXAnLCAnL3Jlc2V0LXBhc3N3b3JkJywgJy92ZXJpZnktZW1haWwnXVxuICBjb25zdCBzaG91bGRTaG93Rm9vdGVyID0gIWhpZGVGb290ZXJQYWdlcy5pbmNsdWRlcyhyb3V0ZXIucGF0aG5hbWUpXG5cbiAgcmV0dXJuIChcbiAgICA8UXVlcnlDbGllbnRQcm92aWRlciBjbGllbnQ9e3F1ZXJ5Q2xpZW50fT5cbiAgICAgIDxQYXRobmFtZUNvbnRleHRQcm92aWRlckFkYXB0ZXIgcm91dGVyPXtyb3V0ZXJ9PlxuICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmdCb3R0b206IHNob3VsZFNob3dGb290ZXIgPyAnODBweCcgOiAnMCcgfX0+XG4gICAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3Nob3VsZFNob3dGb290ZXIgJiYgPFN0aWNreUZvb3RlciAvPn1cbiAgICAgIDwvUGF0aG5hbWVDb250ZXh0UHJvdmlkZXJBZGFwdGVyPlxuICAgIDwvUXVlcnlDbGllbnRQcm92aWRlcj5cbiAgKVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IEFwcDsiXSwibmFtZXMiOlsiSGVhZCIsIlF1ZXJ5Q2xpZW50IiwiUXVlcnlDbGllbnRQcm92aWRlciIsImNyZWF0ZUNvbnRleHQiLCJ1c2VDb250ZXh0IiwidXNlU3RhdGUiLCJtZW1vIiwidXNlUm91dGVyIiwiU3RpY2t5Rm9vdGVyIiwicXVlcnlDbGllbnQiLCJQYXRobmFtZUNvbnRleHQiLCJQYXRobmFtZUNvbnRleHRQcm92aWRlckFkYXB0ZXIiLCJjaGlsZHJlbiIsInJvdXRlciIsIlByb3ZpZGVyIiwidmFsdWUiLCJwYXRobmFtZSIsIkFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImhpZGVGb290ZXJQYWdlcyIsInNob3VsZFNob3dGb290ZXIiLCJpbmNsdWRlcyIsImNsaWVudCIsImRpdiIsInN0eWxlIiwicGFkZGluZ0JvdHRvbSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/StickyFooter.css":
/*!*********************************!*\
  !*** ./styles/StickyFooter.css ***!
  \*********************************/
/***/ (() => {



/***/ }),

/***/ "./styles/button-fixes.css":
/*!*********************************!*\
  !*** ./styles/button-fixes.css ***!
  \*********************************/
/***/ (() => {



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

/***/ "@supabase/auth-js":
/*!************************************!*\
  !*** external "@supabase/auth-js" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/auth-js");

/***/ }),

/***/ "@supabase/functions-js":
/*!*****************************************!*\
  !*** external "@supabase/functions-js" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/functions-js");

/***/ }),

/***/ "@supabase/node-fetch":
/*!***************************************!*\
  !*** external "@supabase/node-fetch" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/node-fetch");

/***/ }),

/***/ "@supabase/realtime-js":
/*!****************************************!*\
  !*** external "@supabase/realtime-js" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/realtime-js");

/***/ }),

/***/ "@supabase/storage-js":
/*!***************************************!*\
  !*** external "@supabase/storage-js" ***!
  \***************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@supabase/storage-js");

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

/***/ "@supabase/postgrest-js":
/*!*****************************************!*\
  !*** external "@supabase/postgrest-js" ***!
  \*****************************************/
/***/ ((module) => {

"use strict";
module.exports = import("@supabase/postgrest-js");;

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
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@swc","vendor-chunks/@supabase"], () => (__webpack_exec__("./pages/_app.js")));
module.exports = __webpack_exports__;

})();