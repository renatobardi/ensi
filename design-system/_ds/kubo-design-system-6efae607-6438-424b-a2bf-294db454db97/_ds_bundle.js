/* @ds-bundle: {"format":4,"namespace":"KoboDesignSystem_6efae6","components":[{"name":"Badge","sourcePath":"components/actions/Badge.jsx"},{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Sakura","sourcePath":"components/brand/Logo.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Label","sourcePath":"components/forms/Label.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"AgentAvatar","sourcePath":"components/kubo/AgentAvatar.jsx"},{"name":"AgentCard","sourcePath":"components/kubo/AgentCard.jsx"},{"name":"ChatInput","sourcePath":"components/kubo/ChatInput.jsx"},{"name":"StatTile","sourcePath":"components/kubo/StatTile.jsx"},{"name":"Breadcrumb","sourcePath":"components/navigation/Breadcrumb.jsx"},{"name":"PageHeader","sourcePath":"components/navigation/PageHeader.jsx"},{"name":"Sidebar","sourcePath":"components/navigation/Sidebar.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardHeader","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardTitle","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardDescription","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardAction","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardContent","sourcePath":"components/surfaces/Card.jsx"},{"name":"CardFooter","sourcePath":"components/surfaces/Card.jsx"},{"name":"Dialog","sourcePath":"components/surfaces/Dialog.jsx"},{"name":"Separator","sourcePath":"components/surfaces/Separator.jsx"},{"name":"Skeleton","sourcePath":"components/surfaces/Skeleton.jsx"},{"name":"Tooltip","sourcePath":"components/surfaces/Skeleton.jsx"}],"sourceHashes":{"components/actions/Badge.jsx":"7645cd70fff2","components/actions/Button.jsx":"7208b817692f","components/brand/Logo.jsx":"6a74e1e44fae","components/forms/Input.jsx":"16cf32d9af06","components/forms/Label.jsx":"504bf32309de","components/forms/Select.jsx":"34a879be207c","components/forms/Switch.jsx":"e51389263744","components/forms/Textarea.jsx":"e8db9154c886","components/icons/Icon.jsx":"f9d97533caf8","components/kubo/AgentAvatar.jsx":"4a73d7dd35cc","components/kubo/AgentCard.jsx":"213da60df25d","components/kubo/ChatInput.jsx":"80f3ecf111cb","components/kubo/StatTile.jsx":"0bc18b68aa27","components/navigation/Breadcrumb.jsx":"1b69126016f0","components/navigation/PageHeader.jsx":"dc4801440756","components/navigation/Sidebar.jsx":"d1a16533c75b","components/surfaces/Card.jsx":"caf8d958114d","components/surfaces/Dialog.jsx":"282626c68fef","components/surfaces/Separator.jsx":"407801818ae0","components/surfaces/Skeleton.jsx":"d8155241d182","ui_kits/kubo-app/CatalogosScreen.jsx":"77dd9a31c90e","ui_kits/kubo-app/ConfiguracoesScreen.jsx":"0d41d0967254","ui_kits/kubo-app/ConhecimentoScreen.jsx":"7423b87eac0e","ui_kits/kubo-app/DistribuicaoScreen.jsx":"65db372dda92","ui_kits/kubo-app/ExecucoesScreen.jsx":"97d60e93ccda","ui_kits/kubo-app/FlowsScreen.jsx":"cea2c3f087e8","ui_kits/kubo-app/FontesScreen.jsx":"625b3cb1fd95","ui_kits/kubo-app/HomeScreen.jsx":"9f9d394cd75a","ui_kits/kubo-app/Shell.jsx":"58751563deb4","ui_kits/kubo-app/data.js":"4a4a8f7b30f6"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KoboDesignSystem_6efae6 = window.KoboDesignSystem_6efae6 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Logo.jsx
try { (() => {
// Kubo logo. The mark is a five-petal sakura (cherry blossom) drawn in line style —
// a nod to the "atelier" idea. Mono, near-black. No colored variant.
//   variant="mark"  → line sakura inside a near-black tile (app icon / favicon)
//   variant="full"  → loose line sakura (no tile) beside the "Kubo" wordmark (+ tagline)
//   variant="glyph" → the bare blossom on its own, near-black on the page

// Reusable blossom: 5 notched petals rotated 72°, radiating stamens + center dot.
// Theme-aware by default — petal fill and ink follow --sakura-petal / --sakura-ink
// (light: pink petals + near-black ink · dark: no fill + pink ink). Override with props.
function Sakura({
  size = 32,
  stroke,
  fill,
  sw = 6,
  style
}) {
  const ink = stroke || 'var(--sakura-ink)';
  const petalFill = fill || 'var(--sakura-petal)';
  const petal = 'M50,50 C38,43 33,27 39,15 C42,8 47,10 50,17 C53,10 58,8 61,15 C67,27 62,43 50,50 Z';
  const arms = [0, 1, 2, 3, 4];
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 100 100",
    fill: "none",
    style: {
      display: 'block',
      ...style
    }
  }, arms.map(i => /*#__PURE__*/React.createElement("path", {
    key: 'p' + i,
    d: petal,
    transform: `rotate(${i * 72} 50 50)`,
    fill: petalFill,
    stroke: ink,
    strokeWidth: sw,
    strokeLinejoin: "round"
  })), arms.map(i => /*#__PURE__*/React.createElement("line", {
    key: 'l' + i,
    x1: "50",
    y1: "50",
    x2: "50",
    y2: "34",
    transform: `rotate(${i * 72 + 36} 50 50)`,
    stroke: ink,
    strokeWidth: sw * 0.55,
    strokeLinecap: "round"
  })), arms.map(i => /*#__PURE__*/React.createElement("circle", {
    key: 'c' + i,
    cx: "50",
    cy: "33",
    r: sw * 0.5,
    transform: `rotate(${i * 72 + 36} 50 50)`,
    fill: ink
  })), /*#__PURE__*/React.createElement("circle", {
    cx: "50",
    cy: "50",
    r: sw * 0.9,
    fill: ink
  }));
}
function Logo({
  variant = 'full',
  size = 32,
  color,
  onDark = false,
  tagline = 'The art of getting things done',
  style
}) {
  const fg = color || 'var(--foreground)';
  const markBg = 'var(--sidebar-primary)';
  const markFg = 'var(--sidebar-primary-foreground)';

  // Line sakura in a near-black tile — the compact app-icon mark (option 1b).
  // The tile is a fixed dark surface, so it always uses the pink outline treatment.
  const TileMark = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flexShrink: 0,
      borderRadius: `calc(${size}px * 0.26)`,
      background: markBg
    }
  }, /*#__PURE__*/React.createElement(Sakura, {
    size: size * 0.68,
    stroke: "#f4c9d4",
    fill: "none",
    sw: 6
  }));
  if (variant === 'mark') {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        ...style
      }
    }, TileMark);
  }

  // Bare blossom on its own — theme-aware (pink petals on light, pink outline on dark).
  if (variant === 'glyph') {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        ...style
      }
    }, /*#__PURE__*/React.createElement(Sakura, {
      size: size,
      sw: 6
    }));
  }

  // Full lockup: loose theme-aware sakura (no tile) + wordmark (+ optional tagline).
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: size * 0.4,
      ...style
    }
  }, /*#__PURE__*/React.createElement(Sakura, {
    size: size * 1.05,
    sw: 6
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.05
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontWeight: 600,
      fontSize: size * 0.85,
      letterSpacing: '-0.025em',
      color: fg
    }
  }, "Kubo"), tagline && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontSize: size * 0.34,
      color: 'var(--muted-foreground)',
      marginTop: size * 0.06
    }
  }, tagline)));
}
Object.assign(__ds_scope, { Sakura, Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Input({
  style,
  disabled,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("input", _extends({
    disabled: disabled,
    style: {
      height: 36,
      width: '100%',
      minWidth: 0,
      padding: '4px 12px',
      background: 'color-mix(in oklab, var(--input) 30%, transparent)',
      border: '1px solid var(--input)',
      borderRadius: 'var(--radius-4xl)',
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
      color: 'var(--foreground)',
      outline: 'none',
      transition: 'box-shadow 150ms, border-color 150ms',
      opacity: disabled ? 0.5 : 1,
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--ring)';
      e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--input)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, rest));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Label.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Label({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("label", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 14,
      fontWeight: 500,
      lineHeight: 1,
      userSelect: 'none',
      fontFamily: 'var(--font-sans)',
      color: 'var(--foreground)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Label });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Label.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
const {
  useState
} = React;
function Switch({
  checked: controlled,
  defaultChecked = false,
  onCheckedChange,
  size = 'default',
  disabled,
  style
}) {
  const [internal, setInternal] = useState(defaultChecked);
  const checked = controlled ?? internal;
  const dims = size === 'sm' ? {
    w: 24,
    h: 14,
    thumb: 12
  } : {
    w: 32,
    h: 18.4,
    thumb: 16
  };
  const toggle = () => {
    if (disabled) return;
    const next = !checked;
    if (controlled === undefined) setInternal(next);
    onCheckedChange && onCheckedChange(next);
  };
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    role: "switch",
    "aria-checked": checked,
    onClick: toggle,
    disabled: disabled,
    style: {
      position: 'relative',
      flexShrink: 0,
      display: 'inline-flex',
      alignItems: 'center',
      width: dims.w,
      height: dims.h,
      padding: 0,
      border: '1px solid transparent',
      borderRadius: 9999,
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: checked ? 'var(--primary)' : 'var(--input)',
      transition: 'background 150ms',
      outline: 'none',
      opacity: disabled ? 0.5 : 1,
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: dims.thumb,
      height: dims.thumb,
      borderRadius: 9999,
      background: 'var(--background)',
      transition: 'transform 150ms',
      transform: checked ? `translateX(${dims.w - dims.thumb - 2}px)` : 'translateX(1px)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.15)'
    }
  }));
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Textarea({
  style,
  disabled,
  rows = 4,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("textarea", _extends({
    disabled: disabled,
    rows: rows,
    style: {
      width: '100%',
      minHeight: 64,
      padding: '12px',
      resize: 'none',
      background: 'color-mix(in oklab, var(--input) 30%, transparent)',
      border: '1px solid var(--input)',
      borderRadius: 'var(--radius-xl)',
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
      color: 'var(--foreground)',
      lineHeight: 1.5,
      outline: 'none',
      transition: 'box-shadow 150ms, border-color 150ms',
      opacity: disabled ? 0.5 : 1,
      ...style
    },
    onFocus: e => {
      e.currentTarget.style.borderColor = 'var(--ring)';
      e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in oklab, var(--ring) 50%, transparent)';
    },
    onBlur: e => {
      e.currentTarget.style.borderColor = 'var(--input)';
      e.currentTarget.style.boxShadow = 'none';
    }
  }, rest));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Lucide icon wrapper — path data copied from the Lucide set (the source app's icon system).
// 24x24 viewBox, stroke currentColor, stroke-width 2, round caps/joins. Default size 16px.

const PATHS = {
  'x': ['M18 6 6 18', 'm6 6 12 12'],
  'building-2': ['M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z', 'M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2', 'M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2', 'M10 6h4', 'M10 10h4', 'M10 14h4', 'M10 18h4'],
  'lightbulb': ['M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5', 'M9 18h6', 'M10 22h4'],
  'hash': ['M4 9h16', 'M4 15h16', 'M10 3 8 21', 'M16 3l-2 18'],
  'command': ['M15 6a3 3 0 1 0 3-3 3 3 0 0 0-3 3v12a3 3 0 1 0 3 3 3 3 0 0 0-3-3H6a3 3 0 1 0 3 3 3 3 0 0 0-3-3V6a3 3 0 1 0-3 3 3 3 0 0 0 3-3z'],
  'corner-down-left': ['M20 4v7a4 4 0 0 1-4 4H4', 'm9 10-5 5 5 5'],
  'trending-up': ['M16 7h6v6', 'm22 7-8.5 8.5-5-5L2 17'],
  'plus': ['M5 12h14', 'M12 5v14'],
  'check': ['M20 6 9 17l-5-5'],
  'chevron-down': ['m6 9 6 6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'chevrons-up-down': ['m7 15 5 5 5-5', 'm7 9 5-5 5 5'],
  'search': ['M21 21l-4.3-4.3', 'M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16z'],
  'house': ['M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8', 'M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'],
  'bot': ['M12 8V4H8', 'M4 8h16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z', 'M2 14h2', 'M20 14h2', 'M15 13v2', 'M9 13v2'],
  'message-square': ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
  'workflow': ['M3 3h8v8H3z', 'M7 11v4a2 2 0 0 0 2 2h4', 'M13 13h8v8h-8z'],
  'shield': ['M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z'],
  'sparkles': ['M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z', 'M20 3v4', 'M22 5h-4'],
  'book-open': ['M12 7v14', 'M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z'],
  'cpu': ['M4 4h16v16H4z', 'M9 9h6v6H9z', 'M15 2v2', 'M15 20v2', 'M9 2v2', 'M9 20v2', 'M2 15h2', 'M2 9h2', 'M20 15h2', 'M20 9h2'],
  'user': ['M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2', 'M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z'],
  'key': ['m21 2-9.6 9.6', 'M7.5 10a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z', 'm15.5 7.5 3 3L22 7l-3-3'],
  'log-out': ['M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4', 'm16 17 5-5-5-5', 'M21 12H9'],
  'moon': ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z'],
  'clock': ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M12 6v6l4 2'],
  'play': ['M6 3l14 9-14 9z'],
  'blocks': ['M14 3h7v7h-7z', 'M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1h-5a1 1 0 0 0-1 1'],
  'zap': ['M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z'],
  'activity': ['M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2'],
  'paperclip': ['m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48'],
  'arrow-up': ['m5 12 7-7 7 7', 'M12 19V5'],
  'file': ['M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z', 'M14 2v4a2 2 0 0 0 2 2h4'],
  'image': ['M3 3h18v18H3z', 'M9 8a1 1 0 1 0 0 2 1 1 0 0 0 0-2z', 'm21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'],
  'panel-left': ['M3 3h18v18H3z', 'M9 3v18'],
  'list': ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  'columns-2': ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M12 3v18'],
  'grid-2x2': ['M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z', 'M12 3v18', 'M3 12h18'],
  'square': ['M3 3h18v18H3z'],
  'bell': ['M10.268 21a2 2 0 0 0 3.464 0', 'M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326'],
  'ellipsis': ['M12 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z', 'M19 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z', 'M5 11a1 1 0 1 0 0 2 1 1 0 0 0 0-2z'],
  'pencil': ['M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'],
  'trash': ['M3 6h18', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6', 'M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2', 'M10 11v6', 'M14 11v6'],
  'calendar': ['M3 4h18v18H3z', 'M16 2v4', 'M8 2v4', 'M3 10h18'],
  'send': ['M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z', 'm21.854 2.147-10.94 10.939'],
  'link': ['M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
  'git-branch': ['M6 3v12', 'M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M15 6a9 9 0 0 0-9 9'],
  'network': ['M9 2h6v6H9z', 'M2 16h6v6H2z', 'M16 16h6v6h-6z', 'M12 8v4', 'M6 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2'],
  'triangle-alert': ['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z', 'M12 9v4', 'M12 17h.01'],
  'rss': ['M4 11a9 9 0 0 1 9 9', 'M4 4a16 16 0 0 1 16 16', 'M5 19a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
  'mail': ['M22 7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z', 'm22 8-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 8'],
  'youtube': ['M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49 49 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49 49 0 0 1-16.2 0A2 2 0 0 1 2.5 17', 'm10 15 5-3-5-3z'],
  'database': ['M12 3c4.97 0 9 1.34 9 3s-4.03 3-9 3-9-1.34-9-3 4.03-3 9-3z', 'M3 6v6c0 1.66 4.03 3 9 3s9-1.34 9-3V6', 'M3 12v6c0 1.66 4.03 3 9 3s9-1.34 9-3v-6'],
  'filter': ['M22 3H2l8 9.46V19l4 2v-8.54z'],
  'circle-check': ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'm9 12 2 2 4-4'],
  'settings': ['M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z', 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'],
  'sun': ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', 'M12 2v2', 'M12 20v2', 'm4.93 4.93 1.41 1.41', 'm17.66 17.66 1.41 1.41', 'M2 12h2', 'M20 12h2', 'm6.34 17.66-1.41 1.41', 'm19.07 4.93-1.41 1.41'],
  'monitor': ['M20 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z', 'M8 21h8', 'M12 17v4'],
  'lock': ['M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z', 'M7 11V7a5 5 0 0 1 10 0v4'],
  'globe': ['M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z', 'M2 12h20', 'M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20z']
};
function Icon({
  name,
  size = 16,
  style,
  ...rest
}) {
  const paths = PATHS[name] || PATHS['square'];
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style: {
      flexShrink: 0,
      ...style
    },
    "aria-hidden": "true"
  }, rest), paths.map((d, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: d
  })));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/actions/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: '1px solid transparent'
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    border: '1px solid transparent'
  },
  destructive: {
    background: 'color-mix(in oklab, var(--destructive) 10%, transparent)',
    color: 'var(--destructive)',
    border: '1px solid transparent'
  },
  outline: {
    background: 'color-mix(in oklab, var(--input) 30%, transparent)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--muted-foreground)',
    border: '1px solid transparent'
  }
};
function Badge({
  variant = 'default',
  icon,
  children,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      width: 'fit-content',
      height: 20,
      padding: '2px 8px',
      paddingLeft: icon ? 6 : 8,
      borderRadius: 'var(--radius-4xl)',
      fontSize: 12,
      fontWeight: 500,
      fontFamily: 'var(--font-sans)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      ...v,
      ...style
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Badge.jsx", error: String((e && e.message) || e) }); }

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const VARIANTS = {
  default: {
    background: 'var(--primary)',
    color: 'var(--primary-foreground)',
    border: '1px solid transparent',
    '--hoverBg': 'color-mix(in oklab, var(--primary) 80%, transparent)'
  },
  outline: {
    background: 'color-mix(in oklab, var(--input) 30%, transparent)',
    color: 'var(--foreground)',
    border: '1px solid var(--border)',
    '--hoverBg': 'color-mix(in oklab, var(--input) 50%, transparent)'
  },
  secondary: {
    background: 'var(--secondary)',
    color: 'var(--secondary-foreground)',
    border: '1px solid transparent',
    '--hoverBg': 'color-mix(in oklab, var(--secondary) 80%, transparent)'
  },
  ghost: {
    background: 'transparent',
    color: 'var(--foreground)',
    border: '1px solid transparent',
    '--hoverBg': 'var(--muted)'
  },
  destructive: {
    background: 'color-mix(in oklab, var(--destructive) 10%, transparent)',
    color: 'var(--destructive)',
    border: '1px solid transparent',
    '--hoverBg': 'color-mix(in oklab, var(--destructive) 20%, transparent)'
  },
  link: {
    background: 'transparent',
    color: 'var(--primary)',
    border: '1px solid transparent',
    textDecoration: 'underline',
    textUnderlineOffset: '4px'
  }
};
const SIZES = {
  default: {
    height: 36,
    padding: '0 12px',
    fontSize: 14,
    gap: 6
  },
  sm: {
    height: 32,
    padding: '0 12px',
    fontSize: 14,
    gap: 4
  },
  xs: {
    height: 24,
    padding: '0 10px',
    fontSize: 12,
    gap: 4
  },
  lg: {
    height: 40,
    padding: '0 16px',
    fontSize: 14,
    gap: 6
  },
  icon: {
    height: 36,
    width: 36,
    padding: 0,
    gap: 0
  },
  'icon-sm': {
    height: 32,
    width: 32,
    padding: 0,
    gap: 0
  },
  'icon-xs': {
    height: 24,
    width: 24,
    padding: 0,
    gap: 0
  },
  'icon-lg': {
    height: 40,
    width: 40,
    padding: 0,
    gap: 0
  }
};
function Button({
  variant = 'default',
  size = 'default',
  icon,
  iconEnd,
  disabled,
  children,
  style,
  ...rest
}) {
  const v = VARIANTS[variant] || VARIANTS.default;
  const s = SIZES[size] || SIZES.default;
  const {
    '--hoverBg': hoverBg,
    ...vStyle
  } = v;
  const isIcon = size.startsWith('icon');
  return /*#__PURE__*/React.createElement("button", _extends({
    disabled: disabled,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      fontWeight: 500,
      fontFamily: 'var(--font-sans)',
      borderRadius: 'var(--radius-4xl)',
      cursor: 'pointer',
      userSelect: 'none',
      transition: 'all 150ms',
      outline: 'none',
      flexShrink: 0,
      height: s.height,
      width: s.width,
      padding: s.padding,
      gap: s.gap,
      fontSize: s.fontSize,
      opacity: disabled ? 0.5 : 1,
      pointerEvents: disabled ? 'none' : undefined,
      ...vStyle,
      ...style
    },
    onMouseDown: e => {
      if (variant !== 'link') e.currentTarget.style.transform = 'translateY(1px)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = '';
    },
    onMouseEnter: e => {
      if (hoverBg) e.currentTarget.style.background = hoverBg;
      if (variant === 'link') e.currentTarget.style.textDecoration = 'underline';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = vStyle.background;
      e.currentTarget.style.transform = '';
    }
  }, rest), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: size === 'xs' || size === 'icon-xs' ? 12 : 16
  }), !isIcon && children, isIcon && !icon && children, iconEnd && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconEnd,
    size: 16
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const {
  useState,
  useRef,
  useEffect
} = React;
function Select({
  options = [],
  value: controlled,
  defaultValue,
  placeholder = 'Select…',
  onValueChange,
  size = 'default',
  disabled,
  style
}) {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const value = controlled ?? internal;
  useEffect(() => {
    const h = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const opts = options.map(o => typeof o === 'string' ? {
    value: o,
    label: o
  } : o);
  const selected = opts.find(o => o.value === value);
  const pick = v => {
    if (controlled === undefined) setInternal(v);
    onValueChange && onValueChange(v);
    setOpen(false);
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: {
      position: 'relative',
      width: 'fit-content',
      ...style
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: disabled,
    onClick: () => setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
      height: size === 'sm' ? 32 : 36,
      padding: '0 12px',
      minWidth: 160,
      background: 'color-mix(in oklab, var(--input) 30%, transparent)',
      border: '1px solid var(--input)',
      borderRadius: 'var(--radius-4xl)',
      fontSize: 14,
      fontFamily: 'var(--font-sans)',
      cursor: 'pointer',
      outline: 'none',
      color: selected ? 'var(--foreground)' : 'var(--muted-foreground)',
      opacity: disabled ? 0.5 : 1,
      whiteSpace: 'nowrap'
    }
  }, /*#__PURE__*/React.createElement("span", null, selected ? selected.label : placeholder), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      color: 'var(--muted-foreground)'
    }
  })), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 'calc(100% + 4px)',
      left: 0,
      zIndex: 50,
      minWidth: '100%',
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 0 0 1px color-mix(in oklab, var(--foreground) 5%, transparent), 0 8px 24px rgba(0,0,0,0.12)',
      padding: 4
    }
  }, opts.map(o => /*#__PURE__*/React.createElement("div", {
    key: o.value,
    onClick: () => pick(o.value),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 8px',
      borderRadius: 'var(--radius-md)',
      fontSize: 14,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      background: o.value === value ? 'var(--accent)' : 'transparent'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--accent)',
    onMouseLeave: e => e.currentTarget.style.background = o.value === value ? 'var(--accent)' : 'transparent'
  }, o.label, o.value === value && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "check",
    size: 16,
    style: {
      color: 'var(--primary)'
    }
  })))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/kubo/AgentAvatar.jsx
try { (() => {
const SIZES = {
  sm: {
    box: 28,
    icon: 14
  },
  md: {
    box: 32,
    icon: 16
  },
  lg: {
    box: 40,
    icon: 20
  }
};
function AgentAvatar({
  avatar,
  name,
  size = 'md',
  style
}) {
  const s = SIZES[size] || SIZES.md;
  return /*#__PURE__*/React.createElement("div", {
    title: name,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      width: s.box,
      height: s.box,
      borderRadius: 9999,
      background: 'var(--muted)',
      lineHeight: 1,
      ...style
    }
  }, avatar ? /*#__PURE__*/React.createElement("img", {
    src: avatar,
    alt: name || 'Agent',
    style: {
      width: s.box,
      height: s.box,
      borderRadius: 9999,
      objectFit: 'cover'
    }
  }) : /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "bot",
    size: s.icon,
    style: {
      color: 'var(--muted-foreground)'
    }
  }));
}
Object.assign(__ds_scope, { AgentAvatar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kubo/AgentAvatar.jsx", error: String((e && e.message) || e) }); }

// components/kubo/AgentCard.jsx
try { (() => {
function AgentCard({
  agent = {},
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onClick,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      gap: 12,
      width: '100%',
      padding: 16,
      textAlign: 'left',
      cursor: 'pointer',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 150ms',
      ...style
    },
    className: "kubo-agent-card",
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--primary) 30%, transparent)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
    },
    onMouseDown: e => e.currentTarget.style.transform = 'scale(0.99)',
    onMouseUp: e => e.currentTarget.style.transform = ''
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 12,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.AgentAvatar, {
    avatar: agent.avatar,
    name: agent.name,
    size: "lg"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, agent.name), agent.description ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    }
  }, agent.description) : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      fontStyle: 'italic',
      color: 'color-mix(in oklab, var(--muted-foreground) 50%, transparent)'
    }
  }, "No description"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "message-square",
    size: 12
  }), " Start chatting")));
}
Object.assign(__ds_scope, { AgentCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kubo/AgentCard.jsx", error: String((e && e.message) || e) }); }

// components/kubo/ChatInput.jsx
try { (() => {
const {
  useState,
  useRef
} = React;
function ChatInput({
  onSend,
  placeholder = 'Message…',
  disabled = false,
  hint = true
}) {
  const [value, setValue] = useState('');
  const ref = useRef(null);
  const canSend = value.trim().length > 0 && !disabled;
  const resize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';
  };
  const send = () => {
    if (!canSend) return;
    onSend && onSend(value.trim());
    setValue('');
    if (ref.current) ref.current.style.height = 'auto';
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--background)',
      padding: '12px 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: 4,
      padding: 12,
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'border-color 150ms, box-shadow 150ms'
    },
    onFocusCapture: e => {
      e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--ring) 50%, transparent)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    },
    onBlurCapture: e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "icon",
    icon: "paperclip",
    disabled: disabled,
    style: {
      width: 32,
      height: 32,
      color: 'var(--muted-foreground)'
    },
    "aria-label": "Attach file"
  }), /*#__PURE__*/React.createElement("textarea", {
    ref: ref,
    value: value,
    rows: 1,
    placeholder: placeholder,
    disabled: disabled,
    onChange: e => {
      setValue(e.target.value);
      resize();
    },
    onKeyDown: e => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send();
      }
    },
    style: {
      flex: 1,
      minWidth: 0,
      maxHeight: 160,
      border: 'none',
      background: 'transparent',
      resize: 'none',
      outline: 'none',
      padding: '8px',
      fontSize: 14,
      lineHeight: 1.5,
      fontFamily: 'var(--font-sans)',
      color: 'var(--foreground)'
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: canSend ? 'default' : 'ghost',
    size: "icon",
    icon: "arrow-up",
    onClick: send,
    disabled: !canSend,
    style: {
      width: 32,
      height: 32
    },
    "aria-label": "Send message"
  })), hint && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      textAlign: 'center',
      fontSize: 10,
      color: 'color-mix(in oklab, var(--muted-foreground) 60%, transparent)'
    }
  }, "Enter to send \xB7 Shift+Enter for new line"));
}
Object.assign(__ds_scope, { ChatInput });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kubo/ChatInput.jsx", error: String((e && e.message) || e) }); }

// components/kubo/StatTile.jsx
try { (() => {
function StatTile({
  label,
  value,
  icon,
  onClick,
  style
}) {
  return /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      onClick && onClick();
    },
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      textDecoration: 'none',
      background: 'var(--card)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      transition: 'all 150ms',
      ...style
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'color-mix(in oklab, var(--primary) 30%, transparent)';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--border)';
      e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.04)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 36,
      height: 36,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 24,
      lineHeight: 1,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--foreground)'
    }
  }, value), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, label)));
}
Object.assign(__ds_scope, { StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/kubo/StatTile.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumb.jsx
try { (() => {
function Breadcrumb({
  segments = []
}) {
  return /*#__PURE__*/React.createElement("nav", {
    "aria-label": "breadcrumb"
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      margin: 0,
      padding: 0,
      listStyle: 'none',
      fontSize: 14
    }
  }, segments.map((seg, i) => {
    const last = i === segments.length - 1;
    return /*#__PURE__*/React.createElement("li", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, last ? /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        color: 'var(--foreground)'
      }
    }, seg.label) : /*#__PURE__*/React.createElement("a", {
      href: seg.href || '#',
      style: {
        color: 'var(--muted-foreground)',
        textDecoration: 'none'
      },
      onMouseEnter: e => e.currentTarget.style.color = 'var(--foreground)',
      onMouseLeave: e => e.currentTarget.style.color = 'var(--muted-foreground)'
    }, seg.label), !last && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: "chevron-right",
      size: 14,
      style: {
        color: 'var(--muted-foreground)'
      }
    }));
  })));
}
Object.assign(__ds_scope, { Breadcrumb });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumb.jsx", error: String((e && e.message) || e) }); }

// components/navigation/PageHeader.jsx
try { (() => {
function PageHeader({
  title,
  description,
  actions
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-tight)',
      color: 'var(--foreground)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 14,
      color: 'var(--muted-foreground)'
    }
  }, description)), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, actions)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      height: 1,
      width: '100%',
      background: 'var(--border)'
    }
  }));
}
Object.assign(__ds_scope, { PageHeader });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/PageHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Sidebar.jsx
try { (() => {
const TOP = [{
  title: 'Painel',
  icon: 'house'
}];
const GROUPS = [{
  label: 'Conhecimento',
  items: [{
    title: 'Destilados',
    icon: 'book-open'
  }, {
    title: 'Entidades',
    icon: 'network'
  }, {
    title: 'Fontes',
    icon: 'rss'
  }]
}, {
  label: 'Trabalho',
  items: [{
    title: 'Fluxos',
    icon: 'workflow'
  }, {
    title: 'Execuções',
    icon: 'activity'
  }]
}, {
  label: 'Distribuição',
  items: [{
    title: 'Destinos',
    icon: 'send'
  }, {
    title: 'Envios',
    icon: 'mail'
  }]
}, {
  label: 'Catálogos',
  items: [{
    title: 'Integrações',
    icon: 'blocks'
  }, {
    title: 'Atores',
    icon: 'user'
  }, {
    title: 'Modelos',
    icon: 'git-branch'
  }]
}];
function Sidebar({
  top = TOP,
  groups = GROUPS,
  active = 'Painel',
  onNavigate,
  user = {
    name: 'Renato Bardi',
    email: 'renato@kubo.studio'
  },
  brand = 'Kubo',
  tagline = 'The art of getting things done',
  style
}) {
  const initial = (user.name || user.email || '?').charAt(0).toUpperCase();
  const NavButton = item => {
    const isActive = item.title === active;
    return /*#__PURE__*/React.createElement("button", {
      key: item.title,
      onClick: () => onNavigate && onNavigate(item.title),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        height: 32,
        padding: '0 8px',
        border: 'none',
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        textAlign: 'left',
        background: isActive ? 'var(--sidebar-accent)' : 'transparent',
        color: isActive ? 'var(--sidebar-accent-foreground)' : 'var(--sidebar-foreground)',
        fontWeight: isActive ? 500 : 400
      },
      onMouseEnter: e => {
        if (!isActive) e.currentTarget.style.background = 'var(--sidebar-accent)';
      },
      onMouseLeave: e => {
        if (!isActive) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
      name: item.icon,
      size: 16,
      style: {
        color: isActive ? 'var(--sidebar-primary)' : 'var(--muted-foreground)'
      }
    }), /*#__PURE__*/React.createElement("span", null, item.title));
  };
  return /*#__PURE__*/React.createElement("aside", {
    style: {
      width: 256,
      flexShrink: 0,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: 'var(--sidebar)',
      color: 'var(--sidebar-foreground)',
      borderRight: '1px solid var(--sidebar-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      height: 56,
      padding: '0 8px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Sakura, {
    size: 30,
    sw: 6
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
      lineHeight: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 16,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, brand), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, tagline)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 8
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, top.map(NavButton)), groups.map(group => /*#__PURE__*/React.createElement("div", {
    key: group.label,
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '4px 8px',
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--muted-foreground)'
    }
  }, group.label), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }
  }, group.items.map(NavButton))))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 8,
      borderTop: '1px solid var(--sidebar-border)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onNavigate && onNavigate('Configurações'),
    title: "Configura\xE7\xF5es",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 48,
      padding: '0 8px',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      background: active === 'Configurações' ? 'var(--sidebar-accent)' : 'transparent'
    },
    onMouseEnter: e => {
      if (active !== 'Configurações') e.currentTarget.style.background = 'var(--sidebar-accent)';
    },
    onMouseLeave: e => {
      if (active !== 'Configurações') e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--primary)',
      color: 'var(--primary-foreground)',
      fontSize: 12,
      fontWeight: 600,
      flexShrink: 0
    }
  }, initial), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      minWidth: 0,
      flex: 1,
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, user.name), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, user.email)), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "settings",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0
    }
  }))));
}
Object.assign(__ds_scope, { Sidebar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Sidebar.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Card({
  size = 'default',
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: size === 'sm' ? 16 : 24,
      paddingTop: size === 'sm' ? 16 : 24,
      paddingBottom: size === 'sm' ? 16 : 24,
      background: 'var(--card)',
      color: 'var(--card-foreground)',
      borderRadius: 'var(--radius-2xl)',
      fontSize: 14,
      overflow: 'hidden',
      boxShadow: '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)',
      ...style
    }
  }, rest), children);
}
function CardHeader({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'grid',
      gridAutoRows: 'min-content',
      gap: 6,
      padding: '0 24px',
      gridTemplateColumns: '1fr auto',
      ...style
    }
  }, rest), children);
}
function CardTitle({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("h3", _extends({
    style: {
      gridColumn: 1,
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 16,
      fontWeight: 500,
      letterSpacing: 'var(--tracking-tight)',
      lineHeight: 1.2,
      ...style
    }
  }, rest), children);
}
function CardDescription({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    style: {
      gridColumn: 1,
      margin: 0,
      fontSize: 12,
      color: 'var(--muted-foreground)',
      ...style
    }
  }, rest), children);
}
function CardAction({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      gridColumn: 2,
      gridRow: '1 / span 2',
      alignSelf: 'start',
      justifySelf: 'end',
      ...style
    }
  }, rest), children);
}
function CardContent({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      padding: '0 24px',
      ...style
    }
  }, rest), children);
}
function CardFooter({
  children,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Dialog.jsx
try { (() => {
const {
  useState
} = React;
function Dialog({
  open: controlled,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  showClose = true
}) {
  const [internal, setInternal] = useState(defaultOpen);
  const open = controlled ?? internal;
  const set = v => {
    if (controlled === undefined) setInternal(v);
    onOpenChange && onOpenChange(v);
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, trigger && /*#__PURE__*/React.createElement("span", {
    onClick: () => set(true)
  }, trigger), open && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => set(false),
    style: {
      position: 'absolute',
      inset: 0,
      background: 'color-mix(in oklab, black 50%, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 448,
      display: 'grid',
      gap: 24,
      padding: 24,
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
      borderRadius: 'var(--radius-4xl)',
      fontSize: 14,
      boxShadow: '0 0 0 1px color-mix(in oklab, var(--foreground) 5%, transparent), 0 24px 48px rgba(0,0,0,0.24)'
    }
  }, (title || description) && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, title && /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: 'var(--tracking-tight)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--muted-foreground)'
    }
  }, description)), children, footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8
    }
  }, footer), showClose && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 16,
      right: 16
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "ghost",
    size: "icon-sm",
    icon: "x",
    onClick: () => set(false),
    "aria-label": "Close"
  })))));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Separator.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Separator({
  orientation = 'horizontal',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    role: "separator",
    style: {
      flexShrink: 0,
      background: 'var(--border)',
      width: orientation === 'vertical' ? 1 : '100%',
      height: orientation === 'vertical' ? '100%' : 1,
      ...style
    }
  }, rest));
}
Object.assign(__ds_scope, { Separator });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Separator.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Skeleton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Skeleton({
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      background: 'var(--muted)',
      borderRadius: 'var(--radius-xl)',
      animation: 'kubo-pulse 1.5s ease-in-out infinite',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("style", null, `@keyframes kubo-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`));
}
function Tooltip({
  label,
  side = 'top',
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'inline-flex'
    },
    className: "kubo-tt"
  }, children, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      zIndex: 50,
      pointerEvents: 'none',
      opacity: 0,
      transition: 'opacity 120ms',
      whiteSpace: 'nowrap',
      ...(side === 'top' ? {
        bottom: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginBottom: 6
      } : side === 'right' ? {
        left: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginLeft: 6
      } : side === 'bottom' ? {
        top: '100%',
        left: '50%',
        transform: 'translateX(-50%)',
        marginTop: 6
      } : {
        right: '100%',
        top: '50%',
        transform: 'translateY(-50%)',
        marginRight: 6
      }),
      background: 'var(--foreground)',
      color: 'var(--background)',
      fontSize: 12,
      padding: '6px 12px',
      borderRadius: 'var(--radius-2xl)'
    },
    className: "kubo-tt-bubble"
  }, label), /*#__PURE__*/React.createElement("style", null, `.kubo-tt:hover .kubo-tt-bubble { opacity: 1 !important; }`));
}
Object.assign(__ds_scope, { Skeleton, Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Skeleton.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/CatalogosScreen.jsx
try { (() => {
// Catálogos — Integrações / Personas (+ Skills versionadas) / Templates.
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;

// ── Markdown preview (mínimo: #, ##, -, **negrito**) ──────────────────────
function inlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => /^\*\*[^*]+\*\*$/.test(p) ? /*#__PURE__*/React.createElement("strong", {
    key: i,
    style: {
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, p.slice(2, -2)) : /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, p));
}
function MdPreview({
  content
}) {
  const lines = (content || '').split('\n');
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      lineHeight: 1.6,
      color: 'var(--foreground)'
    }
  }, lines.map((ln, i) => {
    if (ln.startsWith('## ')) return /*#__PURE__*/React.createElement("h4", {
      key: i,
      style: {
        margin: '12px 0 4px',
        fontFamily: 'var(--font-heading)',
        fontSize: 14,
        fontWeight: 600
      }
    }, ln.slice(3));
    if (ln.startsWith('# ')) return /*#__PURE__*/React.createElement("h3", {
      key: i,
      style: {
        margin: '0 0 6px',
        fontFamily: 'var(--font-heading)',
        fontSize: 16,
        fontWeight: 600
      }
    }, ln.slice(2));
    if (ln.startsWith('- ')) return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 8,
        paddingLeft: 4
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--muted-foreground)'
      }
    }, "\u2022"), /*#__PURE__*/React.createElement("span", null, inlineBold(ln.slice(2))));
    if (ln.trim() === '') return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        height: 8
      }
    });
    return /*#__PURE__*/React.createElement("p", {
      key: i,
      style: {
        margin: '0 0 4px'
      }
    }, inlineBold(ln));
  }));
}
function VersionBadge({
  state
}) {
  const {
    Badge
  } = K;
  if (state === 'ativa') return /*#__PURE__*/React.createElement(Badge, null, "ativa");
  if (state === 'proposta') return /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "proposta pendente");
  return /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "antiga");
}

// ── Detalhe da skill: versão ativa + editor/preview + histórico ────────────
function SkillDetail({
  name,
  onBack
}) {
  const {
    Card,
    CardContent,
    Badge,
    Button,
    Textarea,
    Icon
  } = K;
  const skill = window.KUBO_DATA.skills[name];
  const [versions, setVersions] = useState(() => skill ? skill.versions.map(v => ({
    ...v
  })) : []);
  const active = versions.find(v => v.state === 'ativa') || versions[0];
  const [draft, setDraft] = useState(active ? active.content : '');
  const [mode, setMode] = useState('preview'); // preview | editar
  const [selected, setSelected] = useState(active);
  const nextV = () => Math.max(...versions.map(v => v.v)) + 1;
  const saveNewVersion = () => {
    const nv = {
      v: nextV(),
      state: 'ativa',
      when: 'agora',
      by: 'você',
      content: draft
    };
    setVersions(prev => [nv, ...prev.map(v => v.state === 'ativa' ? {
      ...v,
      state: 'antiga'
    } : v)]);
    setSelected(nv);
    setMode('preview');
  };
  const restore = v => {
    const nv = {
      v: nextV(),
      state: 'ativa',
      when: 'agora',
      by: 'você',
      content: v.content
    };
    setVersions(prev => [nv, ...prev.map(x => x.state === 'ativa' ? {
      ...x,
      state: 'antiga'
    } : x)]);
    setDraft(v.content);
    setSelected(nv);
    setMode('preview');
  };
  const cli = skill && skill.cli;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted-foreground)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      transform: 'rotate(180deg)'
    }
  }), " Atores"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 18,
    style: {
      color: 'var(--muted-foreground)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--foreground)'
    }
  }, name), /*#__PURE__*/React.createElement(VersionBadge, {
    state: selected ? selected.state : 'ativa'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      marginLeft: 'auto',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "Usada por: ", (skill.usedBy || []).map((e, i) => /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    key: i,
    glyph: e,
    size: 20
  })))), cli && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in oklab, var(--primary) 8%, transparent)',
      boxShadow: '0 0 0 1px color-mix(in oklab, var(--primary) 25%, transparent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 16,
    style: {
      color: 'var(--primary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--foreground)'
    }
  }, "Usada por persona com executor ", /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, "cli"), " \u2014 mudan\xE7as afetam execu\xE7\xF5es em m\xE1quina; revise com cuidado.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.7fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--muted)',
      borderRadius: 'var(--radius-4xl)'
    }
  }, ['preview', 'editar'].map(mo => /*#__PURE__*/React.createElement("button", {
    key: mo,
    onClick: () => setMode(mo),
    style: {
      padding: '5px 12px',
      border: 'none',
      cursor: 'pointer',
      borderRadius: 'var(--radius-4xl)',
      fontSize: 13,
      fontFamily: 'var(--font-sans)',
      textTransform: 'capitalize',
      fontWeight: mode === mo ? 500 : 400,
      background: mode === mo ? 'var(--background)' : 'transparent',
      color: mode === mo ? 'var(--foreground)' : 'var(--muted-foreground)',
      boxShadow: mode === mo ? '0 0 0 1px color-mix(in oklab, var(--foreground) 8%, transparent)' : 'none'
    }
  }, mo))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "editando a partir da v", active ? active.v : 1), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: saveNewVersion,
    style: {
      marginLeft: 'auto'
    }
  }, "Nova vers\xE3o")), mode === 'editar' ? /*#__PURE__*/React.createElement(Textarea, {
    value: draft,
    onChange: e => setDraft(e.target.value),
    rows: 12,
    style: {
      fontFamily: 'ui-monospace, monospace',
      fontSize: 13,
      minHeight: 260
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: 260,
      padding: '4px 2px'
    }
  }, /*#__PURE__*/React.createElement(MdPreview, {
    content: mode === 'preview' && selected !== active ? selected.content : draft
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted-foreground)'
    }
  }, "Salvar cria uma nova vers\xE3o imut\xE1vel \u2014 nunca sobrescreve a anterior."))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Hist\xF3rico de vers\xF5es"), versions.map(v => {
    const isSel = selected && selected.v === v.v;
    return /*#__PURE__*/React.createElement("div", {
      key: v.v,
      onClick: () => {
        setSelected(v);
        if (mode === 'editar') setDraft(v.content);
      },
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: 10,
        cursor: 'pointer',
        borderRadius: 'var(--radius-lg)',
        background: isSel ? 'var(--muted)' : 'transparent',
        boxShadow: isSel ? '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'ui-monospace, monospace',
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--foreground)'
      }
    }, "v", v.v), /*#__PURE__*/React.createElement(VersionBadge, {
      state: v.state
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: 'var(--muted-foreground)'
      }
    }, v.when, " \xB7 ", v.by), v.state !== 'ativa' && v.state !== 'proposta' && /*#__PURE__*/React.createElement(Button, {
      size: "xs",
      variant: "outline",
      onClick: e => {
        e.stopPropagation();
        restore(v);
      }
    }, "Restaurar vers\xE3o"), v.state === 'proposta' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Button, {
      size: "xs",
      onClick: e => e.stopPropagation()
    }, "Aprovar"), /*#__PURE__*/React.createElement(Button, {
      size: "xs",
      variant: "destructive",
      onClick: e => e.stopPropagation()
    }, "Rejeitar")));
  })))));
}
function IntegracoesTab() {
  const {
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const sv = window.KUBO_STATUS;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.integracoes.filter(it => window.matchQuery(query, it.name, it.status, it.rateLimit));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  const intIcon = (it, sz = 36) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: sz,
      height: sz,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: Math.round(sz / 2)
  }));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar integra\xE7\xF5es por nome ou status\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2', 'squares']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhuma integra\xE7\xE3o encontrada",
    description: `Nada casa com “${query}”.`
  }) : view === 'squares' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10
    }
  }, filtered.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 8,
      height: 176,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, intIcon(it, 44), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, it.name), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(it.status)
  }, it.status), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      fontSize: 11,
      color: 'var(--muted-foreground)'
    }
  }, "rate ", it.rateLimit)))) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(it => /*#__PURE__*/React.createElement("div", {
    key: it.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 84,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, intIcon(it), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, it.name), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(it.status)
  }, it.status)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "rate ", it.rateLimit))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(it => /*#__PURE__*/React.createElement(Card, {
    key: it.id,
    size: "sm"
  }, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, intIcon(it), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, it.name), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(it.status)
  }, it.status)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "secret: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'ui-monospace, monospace'
    }
  }, "\u25CF\u25CF\u25CF ", it.secret), " \xB7 rate ", it.rateLimit)))))));
}
function PersonasTab({
  onOpenSkill
}) {
  const {
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const exists = s => Boolean(d.skills[s]);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.personas.filter(p => window.matchQuery(query, p.name, p.executor, p.model, (p.skills || []).join(' ')));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  const skillBadges = p => p.skills.map(s => exists(s) ? /*#__PURE__*/React.createElement("button", {
    key: s,
    onClick: () => onOpenSkill(s),
    style: {
      border: 'none',
      background: 'transparent',
      padding: 0,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, s)) : /*#__PURE__*/React.createElement("span", {
    key: s,
    title: "Skill referenciada n\xE3o existe no cat\xE1logo"
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "destructive",
    icon: "triangle-alert"
  }, s)));
  const execBadge = p => /*#__PURE__*/React.createElement(Badge, {
    variant: p.executor === 'cli' ? 'outline' : 'secondary'
  }, p.executor);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar atores por nome, executor, modelo ou skill\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2', 'squares']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhum ator encontrado",
    description: `Nada casa com “${query}”.`
  }) : view === 'squares' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 8,
      height: 176,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    glyph: p.emoji,
    size: 48
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, execBadge(p), p.isHuman && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gates")), /*#__PURE__*/React.createElement("span", {
    style: {
      marginTop: 'auto',
      maxWidth: '100%',
      fontSize: 11,
      color: 'var(--muted-foreground)',
      fontFamily: 'ui-monospace, monospace',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, p.model)))) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement("div", {
    key: p.id,
    style: {
      display: 'flex',
      gap: 12,
      height: 128,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    glyph: p.emoji,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, p.name), execBadge(p), p.isHuman && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gates")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      fontFamily: 'ui-monospace, monospace'
    }
  }, p.model), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 8
    }
  }, skillBadges(p)))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.id,
    size: "sm"
  }, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    glyph: p.emoji,
    size: 40
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, p.name), execBadge(p), p.isHuman && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gates")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '3px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      fontFamily: 'ui-monospace, monospace'
    }
  }, p.model), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 4,
      marginTop: 8
    }
  }, skillBadges(p)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11,
      color: 'var(--muted-foreground)'
    }
  }, "permiss\xF5es: ", p.perms.join(' · '))))))));
}

// Nome da persona a partir do emoji preset.
function personaName(emoji) {
  const p = window.KUBO_DATA.personas.find(x => x.emoji === emoji);
  return p ? p.name : '';
}

// #5 — Detalhe do template: máquina de estados linear, cast, trigger, budget, flows.
function TemplateDetail({
  tpl,
  onBack
}) {
  const {
    Card,
    CardContent,
    Badge,
    Button,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const usedBy = d.flows.filter(f => f.template === tpl.name);
  const STATE_LABEL = {
    backlog: 'Backlog',
    analysis: 'Analysis',
    in_progress: 'In progress',
    review: 'Review',
    done: 'Done',
    promoted: 'Promoted',
    queued: 'Queued',
    collecting: 'Collecting',
    distilling: 'Distilling',
    stored: 'Stored',
    failed: 'Failed',
    sent: 'Sent'
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted-foreground)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      transform: 'rotate(180deg)'
    }
  }), " Modelos"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workflow",
    size: 18,
    style: {
      color: 'var(--muted-foreground)'
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--foreground)'
    }
  }, tpl.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    icon: "clock"
  }, tpl.trigger), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, "budget ", tpl.budget)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "M\xE1quina de estados"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, tpl.states.map((s, i) => {
    const isGate = tpl.gates.includes(s);
    const isFail = s === 'failed';
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: s
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '7px 14px',
        borderRadius: 'var(--radius-lg)',
        background: isGate ? 'color-mix(in oklab, var(--primary) 12%, transparent)' : 'var(--muted)',
        color: isGate ? 'var(--primary)' : isFail ? 'var(--destructive)' : 'var(--foreground)',
        fontSize: 13,
        fontWeight: isGate ? 600 : 500,
        boxShadow: isGate ? '0 0 0 1px color-mix(in oklab, var(--primary) 35%, transparent)' : 'none'
      }
    }, isGate && /*#__PURE__*/React.createElement(Icon, {
      name: "triangle-alert",
      size: 13
    }), STATE_LABEL[s] || s), i < tpl.states.length - 1 && /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 14,
      style: {
        color: 'var(--muted-foreground)'
      }
    }));
  })), tpl.gates.length > 0 ? /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 12,
    style: {
      verticalAlign: '-1px',
      color: 'var(--primary)'
    }
  }), " Estados destacados exigem um gate do dono para avan\xE7ar.") : /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "Fluxo autom\xE1tico \u2014 sem gates humanos."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Cast de personas"), tpl.cast.map((e, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    glyph: e,
    size: 26
  }), " ", personaName(e))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Flows usando este template"), usedBy.length === 0 ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--muted-foreground)'
    }
  }, "Nenhum flow instanciado ainda.") : usedBy.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workflow",
    size: 15,
    style: {
      color: 'var(--muted-foreground)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1
    }
  }, f.name), /*#__PURE__*/React.createElement(Badge, {
    variant: window.KUBO_STATUS(f.status)
  }, f.status)))))));
}
function TemplatesTab({
  onOpen
}) {
  const {
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.templates.filter(t => window.matchQuery(query, t.name, t.trigger));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar modelos por nome ou gatilho\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhum modelo encontrado",
    description: `Nada casa com “${query}”.`
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.id,
    onClick: () => onOpen(t),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Card, {
    size: "sm"
  }, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, t.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    icon: "clock"
  }, t.trigger), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "budget ", t.budget, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, t.cast.map((e, i) => /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    key: i,
    glyph: e,
    size: 20
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      flexWrap: 'wrap'
    }
  }, t.states.map((s, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: s
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      padding: '3px 8px',
      borderRadius: 9999,
      background: t.gates.includes(s) ? 'color-mix(in oklab, var(--primary) 12%, transparent)' : 'var(--muted)',
      color: t.gates.includes(s) ? 'var(--primary)' : 'var(--muted-foreground)',
      fontWeight: t.gates.includes(s) ? 600 : 400
    }
  }, t.gates.includes(s) && /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 11
  }), s), i < t.states.length - 1 && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 12,
    style: {
      color: 'var(--muted-foreground)'
    }
  }))))))))));
}
function CatalogosScreen({
  section = 'Integrações'
}) {
  const {
    PageHeader,
    Button
  } = K;
  const [skill, setSkill] = useState(null);
  const [tpl, setTpl] = useState(null);
  if (section === 'Atores' && skill) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(SkillDetail, {
      name: skill,
      onBack: () => setSkill(null)
    }));
  }
  if (section === 'Modelos' && tpl) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        padding: 24
      }
    }, /*#__PURE__*/React.createElement(TemplateDetail, {
      tpl: tpl,
      onBack: () => setTpl(null)
    }));
  }
  const meta = {
    'Integrações': {
      desc: 'Conexões declaradas — segredos por referência, nunca expostos.',
      body: /*#__PURE__*/React.createElement(IntegracoesTab, null)
    },
    'Atores': {
      desc: 'Agentes do ateliê — clique numa skill para ver e versionar.',
      body: /*#__PURE__*/React.createElement(PersonasTab, {
        onOpenSkill: setSkill
      })
    },
    'Modelos': {
      desc: 'Máquinas de estado reutilizáveis que definem os boards dos fluxos. Abra um para ver o detalhe.',
      body: /*#__PURE__*/React.createElement(TemplatesTab, {
        onOpen: setTpl
      })
    }
  };
  const m = meta[section] || meta['Integrações'];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: section,
    description: m.desc,
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: "plus"
    }, "Adicionar YAML")
  }), m.body);
}
window.CatalogosScreen = CatalogosScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/CatalogosScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/ConfiguracoesScreen.jsx
try { (() => {
// Configurações — tela de ajustes do dono (padrão de mercado: rail + painel).
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
function Segmented({
  options,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--muted)',
      borderRadius: 'var(--radius-4xl)'
    }
  }, options.map(o => {
    const active = o.value === value;
    return /*#__PURE__*/React.createElement("button", {
      key: o.value,
      onClick: () => onChange(o.value),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: 'var(--radius-4xl)',
        fontSize: 13,
        fontFamily: 'var(--font-sans)',
        fontWeight: active ? 500 : 400,
        background: active ? 'var(--background)' : 'transparent',
        color: active ? 'var(--foreground)' : 'var(--muted-foreground)',
        boxShadow: active ? '0 0 0 1px color-mix(in oklab, var(--foreground) 8%, transparent)' : 'none'
      }
    }, o.icon && /*#__PURE__*/React.createElement(K.Icon, {
      name: o.icon,
      size: 14
    }), o.label);
  }));
}
function Field({
  label,
  children,
  hint
}) {
  const {
    Label
  } = K;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, label), children, hint && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, hint));
}
function Row({
  title,
  desc,
  control
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, title), desc && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, desc)), /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, control));
}
function ConfiguracoesScreen({
  dark,
  onToggleDark
}) {
  const {
    PageHeader,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Input,
    Button,
    Switch,
    Select,
    Badge,
    Icon
  } = K;
  const owner = window.KUBO_DATA.owner;
  const [cat, setCat] = useState('Perfil');
  const [theme, setTheme] = useState(dark ? 'escuro' : 'claro');
  const setThemeMode = m => {
    setTheme(m);
    if (m === 'sistema') onToggleDark(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);else onToggleDark(m === 'escuro');
  };
  const cats = [{
    id: 'Perfil',
    icon: 'user'
  }, {
    id: 'Aparência',
    icon: 'sun'
  }, {
    id: 'Notificações',
    icon: 'bell'
  }, {
    id: 'Segurança',
    icon: 'lock'
  }, {
    id: 'Idioma & região',
    icon: 'globe'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Configura\xE7\xF5es",
    description: "Prefer\xEAncias da sua conta e do ateli\xEA."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '200px 1fr',
      gap: 24,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
      position: 'sticky',
      top: 0
    }
  }, cats.map(c => {
    const active = c.id === cat;
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => setCat(c.id),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 10px',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        borderRadius: 'var(--radius-lg)',
        fontSize: 14,
        fontFamily: 'var(--font-sans)',
        fontWeight: active ? 500 : 400,
        background: active ? 'var(--muted)' : 'transparent',
        color: active ? 'var(--foreground)' : 'var(--muted-foreground)'
      },
      onMouseEnter: e => {
        if (!active) e.currentTarget.style.background = 'color-mix(in oklab, var(--muted) 50%, transparent)';
      },
      onMouseLeave: e => {
        if (!active) e.currentTarget.style.background = 'transparent';
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: c.icon,
      size: 16,
      style: {
        color: active ? 'var(--foreground)' : 'var(--muted-foreground)'
      }
    }), " ", c.id);
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      minWidth: 0
    }
  }, cat === 'Perfil' && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Perfil"), /*#__PURE__*/React.createElement(CardDescription, null, "Como voc\xEA aparece no ateli\xEA.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 56,
      height: 56,
      borderRadius: 9999,
      background: 'var(--primary)',
      color: 'var(--primary-foreground)',
      fontSize: 22,
      fontWeight: 600
    }
  }, owner.name.charAt(0)), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm"
  }, "Trocar avatar")), /*#__PURE__*/React.createElement(Field, {
    label: "Nome"
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: owner.name
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    hint: "Usado para entrar e receber envios."
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Input, {
    defaultValue: owner.email,
    disabled: true,
    style: {
      flex: 1,
      color: 'var(--muted-foreground)'
    }
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "Alterar"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement(Button, null, "Salvar altera\xE7\xF5es")))), cat === 'Aparência' && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Apar\xEAncia"), /*#__PURE__*/React.createElement(CardDescription, null, "Tema da interface.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Row, {
    title: "Tema",
    desc: "Claro, escuro ou seguir o sistema.",
    control: /*#__PURE__*/React.createElement(Segmented, {
      value: theme,
      onChange: setThemeMode,
      options: [{
        value: 'claro',
        label: 'Claro',
        icon: 'sun'
      }, {
        value: 'escuro',
        label: 'Escuro',
        icon: 'moon'
      }, {
        value: 'sistema',
        label: 'Sistema',
        icon: 'monitor'
      }]
    })
  }))), cat === 'Notificações' && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Notifica\xE7\xF5es"), /*#__PURE__*/React.createElement(CardDescription, null, "Quando o Kubo deve te avisar.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Row, {
    title: "Gates aguardando voc\xEA",
    desc: "Uma decis\xE3o travando um flow.",
    control: /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: true
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(Row, {
    title: "Falhas de execu\xE7\xE3o",
    desc: "Quando um worker falha.",
    control: /*#__PURE__*/React.createElement(Switch, {
      defaultChecked: true
    })
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(Row, {
    title: "Resumo di\xE1rio no Telegram",
    desc: "Digest das 8h.",
    control: /*#__PURE__*/React.createElement(Switch, null)
  }))), cat === 'Segurança' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Seguran\xE7a"), /*#__PURE__*/React.createElement(CardDescription, null, "Acesso \xE0 sua conta.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Row, {
    title: "Senha",
    desc: "Troque periodicamente para manter a conta segura.",
    control: /*#__PURE__*/React.createElement(Button, {
      variant: "outline"
    }, "Alterar senha")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'var(--border)'
    }
  }), /*#__PURE__*/React.createElement(Row, {
    title: "Sess\xE3o atual",
    desc: "Chrome \xB7 macOS \xB7 S\xE3o Paulo",
    control: /*#__PURE__*/React.createElement(Badge, {
      variant: "secondary"
    }, "este dispositivo")
  })))), cat === 'Idioma & região' && /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Idioma & regi\xE3o"), /*#__PURE__*/React.createElement(CardDescription, null, "Formato de datas e idioma da interface.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Idioma"
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['Português (Brasil)', 'English'],
    defaultValue: "Portugu\xEAs (Brasil)"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Fuso hor\xE1rio"
  }, /*#__PURE__*/React.createElement(Select, {
    options: ['America/Sao_Paulo (GMT-3)', 'UTC', 'Europe/Lisbon'],
    defaultValue: "America/Sao_Paulo (GMT-3)"
  })))))));
}
window.ConfiguracoesScreen = ConfiguracoesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/ConfiguracoesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/ConhecimentoScreen.jsx
try { (() => {
// Conhecimento — grafo consultável de destilados com proveniência + entidades navegáveis.
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
const TYPE_ICON = {
  pessoa: 'user',
  tecnologia: 'cpu',
  'organização': 'building-2',
  conceito: 'lightbulb'
};
const SOURCE_ICON = src => {
  const s = (src || '').toLowerCase();
  if (s.includes('youtube')) return 'youtube';
  if (s.includes('github')) return 'git-branch';
  if (s.includes('post') || s.includes('blog')) return 'file';
  return 'rss';
};
function ProvenanceStep({
  icon,
  kind,
  label,
  sub,
  url,
  last
}) {
  const {
    Icon
  } = K;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: 'var(--muted)',
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16
  })), !last && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 2,
      flex: 1,
      minHeight: 16,
      background: 'var(--border)',
      margin: '4px 0'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      paddingBottom: last ? 0 : 16,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: 'var(--muted-foreground)'
    }
  }, kind), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 14,
      color: 'var(--foreground)'
    }
  }, label), sub && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, sub), url && /*#__PURE__*/React.createElement("a", {
    href: url,
    onClick: e => e.preventDefault(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      marginTop: 4,
      fontSize: 12,
      color: 'var(--primary)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "link",
    size: 12
  }), " ", url)));
}
function BackLink({
  label,
  onClick
}) {
  const {
    Icon
  } = K;
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted-foreground)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      transform: 'rotate(180deg)'
    }
  }), " ", label);
}
function EntityChip({
  name,
  onClick
}) {
  const {
    Icon
  } = K;
  const ent = window.KUBO_DATA.entities.find(e => e.name === name);
  const icon = ent ? TYPE_ICON[ent.type] || 'network' : 'network';
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onClick && onClick(name),
    disabled: !onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 9999,
      cursor: onClick ? 'pointer' : 'default',
      fontFamily: 'var(--font-sans)',
      fontSize: 12,
      color: 'var(--foreground)',
      background: 'transparent',
      boxShadow: '0 0 0 1px var(--border)'
    },
    onMouseEnter: e => {
      if (onClick) e.currentTarget.style.background = 'var(--muted)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 12,
    style: {
      color: 'var(--muted-foreground)'
    }
  }), " ", name);
}
function DestiladoDetail({
  d,
  onBack,
  onOpenEntity,
  onOpenDestilado
}) {
  const {
    Card,
    CardContent,
    Icon
  } = K;
  const all = window.KUBO_DATA.destilados;
  const related = all.filter(x => x.id !== d.id && x.entities.some(e => d.entities.includes(e)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(BackLink, {
    label: "Voltar aos destilados",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--foreground)'
    }
  }, d.title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 14,
      color: 'var(--muted-foreground)'
    }
  }, d.summary)), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Claims extra\xEDdas"), d.claims.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 14,
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0,
      marginTop: 1
    }
  }), " ", c)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Entidades mencionadas"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 6,
      marginTop: 8
    }
  }, d.entities.map(e => /*#__PURE__*/React.createElement(EntityChip, {
    key: e,
    name: e,
    onClick: onOpenEntity
  })))), related.length > 0 && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Relacionados"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 8
    }
  }, related.map(r => {
    const shared = r.entities.filter(e => d.entities.includes(e));
    return /*#__PURE__*/React.createElement("button", {
      key: r.id,
      onClick: () => onOpenDestilado(r),
      style: {
        textAlign: 'left',
        cursor: 'pointer',
        display: 'flex',
        gap: 10,
        padding: 12,
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--card)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "book-open",
      size: 16,
      style: {
        color: 'var(--muted-foreground)',
        flexShrink: 0,
        marginTop: 1
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--foreground)'
      }
    }, r.title), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 4,
        fontSize: 11,
        color: 'var(--muted-foreground)'
      }
    }, "compartilha: ", shared.join(', '))), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 14,
      style: {
        color: 'var(--muted-foreground)',
        flexShrink: 0,
        marginTop: 2
      }
    }));
  })))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "git-branch",
    size: 16,
    style: {
      color: 'var(--foreground)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-heading)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, "Cadeia de proveni\xEAncia")), /*#__PURE__*/React.createElement(ProvenanceStep, {
    icon: "book-open",
    kind: "Destilado",
    label: d.title,
    sub: d.date
  }), /*#__PURE__*/React.createElement(ProvenanceStep, {
    icon: "file",
    kind: "Item bruto",
    label: d.item,
    url: d.itemUrl
  }), /*#__PURE__*/React.createElement(ProvenanceStep, {
    icon: "rss",
    kind: "Fonte",
    label: d.source
  }), /*#__PURE__*/React.createElement(ProvenanceStep, {
    icon: "activity",
    kind: "Execu\xE7\xE3o",
    label: d.run,
    sub: "run que produziu este destilado",
    last: true
  })))));
}

// #4 — Detalhe da entidade
function EntityDetail({
  entity,
  onBack,
  onOpenDestilado,
  onOpenEntity
}) {
  const {
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const mentions = d.destilados.filter(dd => dd.entities.includes(entity.name));
  const icon = TYPE_ICON[entity.type] || 'network';
  const last = entity.trend[entity.trend.length - 1],
    first = entity.trend[0];
  const up = last >= first;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(BackLink, {
    label: "Voltar \xE0s entidades",
    onClick: onBack
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 44,
      height: 44,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 20,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--foreground)'
    }
  }, entity.name), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, entity.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, entity.mentions, " men\xE7\xF5es \xB7 ", mentions.length, " destilados")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Men\xE7\xF5es ao longo do tempo"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up",
    size: 14,
    style: {
      transform: up ? 'none' : 'scaleY(-1)'
    }
  }), " \xFAltimas 12 semanas")), /*#__PURE__*/React.createElement(window.Sparkline, {
    values: entity.trend,
    width: 280,
    height: 56
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Rela\xE7\xF5es"), entity.relations.map((r, i) => {
    const known = d.entities.some(e => e.name === r.target);
    return /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 13
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 26,
        height: 26,
        borderRadius: 9999,
        background: 'var(--muted)',
        color: 'var(--muted-foreground)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 13
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'ui-monospace, monospace',
        color: 'var(--muted-foreground)'
      }
    }, r.rel), /*#__PURE__*/React.createElement(Icon, {
      name: "chevron-right",
      size: 13,
      style: {
        color: 'var(--muted-foreground)'
      }
    }), known ? /*#__PURE__*/React.createElement(EntityChip, {
      name: r.target,
      onClick: onOpenEntity
    }) : /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--foreground)'
      }
    }, r.target));
  })))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)'
    }
  }, "Destilados que mencionam"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 8
    }
  }, mentions.map(dd => /*#__PURE__*/React.createElement("button", {
    key: dd.id,
    onClick: () => onOpenDestilado(dd),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      gap: 10,
      padding: 12,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--card)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "book-open",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, dd.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 2,
      fontSize: 11,
      color: 'var(--muted-foreground)'
    }
  }, dd.source, " \xB7 ", dd.date)), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0,
      marginTop: 2
    }
  }))))));
}
function EntitiesView({
  onOpen
}) {
  const {
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.entities.filter(e => window.matchQuery(query, e.name, e.type));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  const body = e => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: TYPE_ICON[e.type] || 'network',
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)',
      flex: 1
    }
  }, e.name), /*#__PURE__*/React.createElement(window.Sparkline, {
    values: e.trend,
    width: 64,
    height: 20,
    fill: false,
    stroke: "var(--muted-foreground)"
  }), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, e.type)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, e.mentions, " men\xE7\xF5es"), e.relations.map((r, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'ui-monospace, monospace',
      color: 'var(--foreground)'
    }
  }, r.rel), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 12
  }), " ", r.target))));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar entidades por nome ou tipo\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhuma entidade encontrada",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.id,
    onClick: () => onOpen(e),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      height: 108,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring,
      overflow: 'hidden'
    }
  }, body(e)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(e => /*#__PURE__*/React.createElement("button", {
    key: e.id,
    onClick: () => onOpen(e),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      border: 'none',
      background: 'transparent',
      padding: 0
    }
  }, /*#__PURE__*/React.createElement(Card, {
    size: "sm"
  }, /*#__PURE__*/React.createElement(CardContent, {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, body(e)))))));
}
function ConhecimentoScreen({
  initialTab
} = {}) {
  const {
    PageHeader,
    Input,
    Icon,
    Badge
  } = K;
  const d = window.KUBO_DATA;
  const [tab, setTab] = useState(initialTab || 'Destilados');
  const [selected, setSelected] = useState(null);
  const [entity, setEntity] = useState(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const openEntity = name => {
    const e = typeof name === 'string' ? d.entities.find(x => x.name === name) : name;
    if (e) {
      setSelected(null);
      setEntity(e);
      setTab('Entidades');
    }
  };
  const openDestilado = dd => {
    setEntity(null);
    setSelected(dd);
    setTab('Destilados');
  };
  if (selected) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(DestiladoDetail, {
    d: selected,
    onBack: () => setSelected(null),
    onOpenEntity: openEntity,
    onOpenDestilado: openDestilado
  }));
  if (entity) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(EntityDetail, {
    entity: entity,
    onBack: () => setEntity(null),
    onOpenDestilado: openDestilado,
    onOpenEntity: openEntity
  }));
  const filtered = d.destilados.filter(dd => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return dd.title.toLowerCase().includes(q) || dd.summary.toLowerCase().includes(q) || dd.entities.some(e => e.toLowerCase().includes(q));
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: tab === 'Entidades' ? 'Entidades' : 'Destilados',
    description: tab === 'Entidades' ? 'Entidades tipadas extraídas dos destilados, com menções e relações.' : 'Grafo consultável de destilados, com citação de origem em cada nó.'
  }), tab === 'Destilados' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      flex: '1 1 auto',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--muted-foreground)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  })), /*#__PURE__*/React.createElement(Input, {
    value: query,
    onChange: e => setQuery(e.target.value),
    placeholder: "Busca por texto ou sem\xE2ntica\u2026",
    style: {
      paddingLeft: 34
    }
  })), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhum destilado encontrado",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(dd => /*#__PURE__*/React.createElement("button", {
    key: dd.id,
    onClick: () => setSelected(dd),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      gap: 12,
      padding: 16,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: SOURCE_ICON(dd.source),
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--foreground)',
      flex: 1
    }
  }, dd.title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)',
      flexShrink: 0
    }
  }, dd.date)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: 'var(--muted-foreground)'
    }
  }, dd.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 6
    }
  }, dd.entities.map(e => /*#__PURE__*/React.createElement(Badge, {
    key: e,
    variant: "outline"
  }, e)), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: SOURCE_ICON(dd.source),
    size: 12
  }), " ", dd.source))))))) : /*#__PURE__*/React.createElement(EntitiesView, {
    onOpen: openEntity
  }));
}
window.ConhecimentoScreen = ConhecimentoScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/ConhecimentoScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/DistribuicaoScreen.jsx
try { (() => {
// Distribuição — Destinos (artefatos + destinos) e Envios (histórico).
// Canais de status moram em Catálogos > Integrações.
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
function DestinosScreen() {
  const {
    PageHeader,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    Badge,
    Button,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Destinos",
    description: "O que \xE9 distribu\xEDdo e para onde. Convidados recebem \u2014 n\xE3o operam.",
    actions: /*#__PURE__*/React.createElement(Button, {
      icon: "plus"
    }, "Novo artefato")
  }), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Artefatos configurados"), /*#__PURE__*/React.createElement(CardDescription, null, "Digests e relat\xF3rios recorrentes.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, d.artefatos.map((a, i) => /*#__PURE__*/React.createElement("li", {
    key: a.id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      padding: '14px 24px',
      borderTop: i ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, a.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    icon: "clock"
  }, a.agenda)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "origem: ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'ui-monospace, monospace'
    }
  }, a.query)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "destinos:"), a.destinos.map(dn => /*#__PURE__*/React.createElement(Badge, {
    key: dn,
    variant: "secondary"
  }, dn)))))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Destinos"), /*#__PURE__*/React.createElement(CardDescription, null, "Pessoas (dono + convidados) e sistemas.")), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, d.destinos.map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: r.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 24px',
      borderTop: i ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: r.kind === 'pessoa' ? 9999 : 'var(--radius-md)',
      background: r.kind === 'pessoa' ? 'var(--primary)' : 'var(--muted)',
      color: r.kind === 'pessoa' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
      fontSize: 12,
      fontWeight: 600
    }
  }, r.kind === 'pessoa' ? r.name.charAt(0) : /*#__PURE__*/React.createElement(Icon, {
    name: r.sys === 'webhook' ? 'link' : 'database',
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, r.name), r.kind === 'pessoa' ? /*#__PURE__*/React.createElement(Badge, {
    variant: r.role === 'dono' ? 'default' : 'secondary'
  }, r.role) : /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, r.sys), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      fontSize: 11,
      color: 'var(--muted-foreground)',
      background: 'var(--muted)',
      borderRadius: 9999,
      padding: '2px 8px'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 11
  }), " ", r.channel)))))))));
}
window.DestinosScreen = DestinosScreen;
function EnviosScreen() {
  const {
    PageHeader,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.envios.filter(s => window.matchQuery(query, s.kind, s.channel, s.to));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Envios",
    description: "Hist\xF3rico do que j\xE1 saiu \u2014 artefato, canal, destino e quando."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar envios por artefato, canal ou destino\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhum envio encontrado",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 84,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--foreground)'
    }
  }, s.kind), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, s.channel)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, s.to, " \xB7 ", s.when))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "send",
    size: 16
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--foreground)',
      flex: 1
    }
  }, s.kind), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, s.channel), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: 'var(--muted-foreground)',
      minWidth: 110
    }
  }, s.to), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, s.when)))));
}
window.EnviosScreen = EnviosScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/DistribuicaoScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/ExecucoesScreen.jsx
try { (() => {
// Execuções — lista de runs com busca e erros estruturados expansíveis.
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
function RunRow({
  r
}) {
  const {
    Badge,
    Icon
  } = K;
  const sv = window.KUBO_STATUS;
  const [open, setOpen] = useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => r.error && setOpen(o => !o),
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      cursor: r.error ? 'pointer' : 'default'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, r.worker), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(r.status)
  }, r.status)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, r.flow, " \xB7 ", r.started, " \xB7 ", r.duration, " \xB7 ", r.items, " itens")), r.error && /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-down",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0,
      transform: open ? 'rotate(180deg)' : 'none'
    }
  })), open && r.error && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      padding: '10px 12px',
      borderRadius: 'var(--radius-lg)',
      background: 'color-mix(in oklab, var(--destructive) 10%, transparent)',
      color: 'var(--destructive)',
      fontSize: 13,
      fontFamily: 'ui-monospace, monospace'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 16,
    style: {
      flexShrink: 0
    }
  }), " ", r.error)));
}
function ExecucoesScreen() {
  const {
    PageHeader
  } = K;
  const d = window.KUBO_DATA;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.runs.filter(r => window.matchQuery(query, r.worker, r.flow, r.status));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Execu\xE7\xF5es",
    description: "Runs dos seus workers \u2014 status, dura\xE7\xE3o, itens produzidos e erros."
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar runs por worker, fluxo ou status\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhuma run encontrada",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(r => /*#__PURE__*/React.createElement(RunRow, {
    key: r.id,
    r: r
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "Clique numa run com falha para ver a mensagem de erro estruturada."));
}
window.ExecucoesScreen = ExecucoesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/ExecucoesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/FlowsScreen.jsx
try { (() => {
// Flows — lista de flows + DETALHE como board kanban (colunas = estados do template).
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
const STATE_LABEL = {
  backlog: 'Backlog',
  analysis: 'Analysis',
  in_progress: 'In progress',
  review: 'Review',
  done: 'Done',
  promoted: 'Promoted',
  queued: 'Queued',
  collecting: 'Collecting',
  distilling: 'Distilling',
  stored: 'Stored',
  failed: 'Failed',
  sent: 'Sent'
};
function TaskCard({
  t,
  onGate
}) {
  const {
    Badge,
    Button,
    Icon
  } = K;
  const isGate = t.gate;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--card)',
      borderRadius: 'var(--radius-xl)',
      padding: 12,
      boxShadow: isGate ? '0 0 0 1.5px color-mix(in oklab, var(--primary) 55%, transparent)' : '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)'
    }
  }, isGate && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      marginBottom: 8,
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--primary)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 12
  }), " aguardando voc\xEA"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      lineHeight: 1.4,
      color: 'var(--foreground)'
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    glyph: t.persona,
    size: 22,
    title: t.personaName
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)',
      flex: 1
    }
  }, t.personaName), t.blocked && /*#__PURE__*/React.createElement(Badge, {
    variant: "outline",
    icon: "link"
  }, "bloqueada"), t.error && /*#__PURE__*/React.createElement(Badge, {
    variant: "destructive"
  }, "falhou")), isGate && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      marginTop: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "xs",
    style: {
      flex: 1
    },
    onClick: () => onGate(t)
  }, "Aprovar"), /*#__PURE__*/React.createElement(Button, {
    size: "xs",
    variant: "destructive",
    style: {
      flex: 1
    },
    onClick: () => onGate(t)
  }, "Rejeitar")), t.error && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 11,
      color: 'var(--destructive)'
    }
  }, t.error));
}
function GateSheet({
  task,
  onClose
}) {
  const {
    Button,
    Badge,
    Textarea,
    Icon
  } = K;
  const [reason, setReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const c = task.gateContext || {};
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'absolute',
      inset: 0,
      background: 'color-mix(in oklab, black 40%, transparent)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      width: 440,
      maxWidth: '92vw',
      height: '100%',
      background: 'var(--popover)',
      color: 'var(--popover-foreground)',
      boxShadow: '-8px 0 32px rgba(0,0,0,0.18)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      padding: 20,
      borderBottom: '1px solid var(--border)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 18,
    style: {
      color: 'var(--primary)',
      marginTop: 2
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
      color: 'var(--muted-foreground)'
    }
  }, "Decis\xE3o de gate"), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '2px 0 0',
      fontFamily: 'var(--font-heading)',
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, task.title)), /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "icon-sm",
    icon: "x",
    onClick: onClose,
    "aria-label": "Fechar"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)',
      marginBottom: 6
    }
  }, "O que est\xE1 sendo pedido"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--foreground)'
    }
  }, c.pede)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 600,
      color: 'var(--muted-foreground)',
      marginBottom: 8
    }
  }, "O que as personas produziram"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, (c.produzido || []).map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: 'flex',
      gap: 8,
      fontSize: 13,
      lineHeight: 1.45,
      color: 'var(--foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0,
      marginTop: 1
    }
  }), " ", p)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, c.pr && /*#__PURE__*/React.createElement("a", {
    href: c.prUrl,
    onClick: e => e.preventDefault(),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: 'var(--primary)',
      textDecoration: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "git-branch",
    size: 14
  }), " ", c.pr), c.budget && /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, "budget ", c.budget)), rejecting && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, "Motivo da rejei\xE7\xE3o ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--destructive)'
    }
  }, "*")), /*#__PURE__*/React.createElement(Textarea, {
    value: reason,
    onChange: e => setReason(e.target.value),
    rows: 3,
    placeholder: "Explique por que est\xE1 rejeitando\u2026"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      borderTop: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, !rejecting ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    style: {
      flex: 1
    },
    onClick: onClose
  }, "Aprovar"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    style: {
      flex: 1
    },
    onClick: () => setRejecting(true)
  }, "Rejeitar")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    onClick: () => setRejecting(false)
  }, "Voltar"), /*#__PURE__*/React.createElement(Button, {
    variant: "destructive",
    style: {
      flex: 1
    },
    disabled: !reason.trim(),
    onClick: onClose
  }, "Confirmar rejei\xE7\xE3o"))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 11,
      color: 'var(--muted-foreground)',
      textAlign: 'center'
    }
  }, "Sua decis\xE3o fica registrada no grafo."))));
}
function FlowBoard({
  flow,
  onBack
}) {
  const {
    Badge,
    Icon,
    Button
  } = K;
  const [gate, setGate] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      height: '100%',
      minHeight: 0,
      position: 'relative'
    }
  }, gate && /*#__PURE__*/React.createElement(GateSheet, {
    task: gate,
    onClose: () => setGate(null)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      fontSize: 13,
      color: 'var(--muted-foreground)',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 14,
    style: {
      transform: 'rotate(180deg)'
    }
  }), " Fluxos"), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 18,
      fontWeight: 600,
      letterSpacing: '-0.025em',
      color: 'var(--foreground)'
    }
  }, flow.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, flow.template), flow.gate && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gate aberto")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 4,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, flow.cast.map((e, i) => /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    key: i,
    glyph: e,
    size: 20
  }))), /*#__PURE__*/React.createElement("span", null, "budget ", flow.budget.used, "/", flow.budget.limit, " \xB7 criado ", flow.created)))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minHeight: 0,
      display: 'grid',
      gridTemplateColumns: `repeat(${flow.states.length}, minmax(200px, 1fr))`,
      gap: 12,
      overflowX: 'auto',
      position: 'relative'
    }
  }, flow.tasks.length === 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "workflow",
    title: "Nenhuma task neste flow ainda",
    description: flow.status === 'pausado' ? 'Este flow está pausado. Retome-o para o Operador começar a enfileirar tasks.' : 'Assim que o flow rodar, as tasks aparecem distribuídas pelas colunas do board.',
    action: /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      icon: "play"
    }, flow.status === 'pausado' ? 'Retomar flow' : 'Rodar agora')
  })), flow.states.map(state => {
    const items = flow.tasks.filter(t => t.state === state);
    return /*#__PURE__*/React.createElement("div", {
      key: state,
      style: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
        background: 'color-mix(in oklab, var(--muted) 50%, transparent)',
        borderRadius: 'var(--radius-2xl)',
        padding: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '2px 4px 10px'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-heading)',
        fontSize: 13,
        fontWeight: 500,
        color: state === 'failed' ? 'var(--destructive)' : 'var(--foreground)'
      }
    }, STATE_LABEL[state] || state), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: 'var(--muted-foreground)',
        background: 'var(--background)',
        borderRadius: 9999,
        padding: '1px 8px'
      }
    }, items.length)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        overflowY: 'auto'
      }
    }, items.map(t => /*#__PURE__*/React.createElement(TaskCard, {
      key: t.id,
      t: t,
      onGate: setGate
    }))));
  })));
}
function FlowsScreen() {
  const {
    PageHeader,
    Button,
    Card,
    CardContent,
    Badge,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const sv = window.KUBO_STATUS;
  const [flow, setFlow] = useState(null);
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  if (flow) return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24,
      height: '100%',
      minHeight: 0
    }
  }, /*#__PURE__*/React.createElement(FlowBoard, {
    flow: flow,
    onBack: () => setFlow(null)
  }));
  const filtered = d.flows.filter(f => window.matchQuery(query, f.name, f.template, f.status));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  const flowIcon = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 40,
      height: 40,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "workflow",
    size: 18,
    style: {
      color: 'var(--muted-foreground)'
    }
  }));
  const flowBody = f => /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, f.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "secondary"
  }, f.template), f.gate && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gate"), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(f.status)
  }, f.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginTop: 6,
      fontSize: 12,
      color: 'var(--muted-foreground)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, f.cast.map((e, i) => /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    key: i,
    glyph: e,
    size: 20
  }))), /*#__PURE__*/React.createElement("span", null, f.tasksOpen, " tasks abertas \xB7 budget ", f.budget.used, "/", f.budget.limit, " \xB7 criado ", f.created)));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Fluxos",
    description: "Automa\xE7\xF5es multi-persona instanciadas de templates. Abra um flow para ver seu board.",
    actions: /*#__PURE__*/React.createElement(Button, {
      icon: "plus"
    }, "Novo fluxo")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar fluxos por nome, template ou status\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhum fluxo encontrado",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFlow(f),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 108,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring,
      overflow: 'hidden'
    }
  }, flowIcon, flowBody(f)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setFlow(f),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      padding: 16,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)'
    }
  }, flowIcon, flowBody(f), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 16,
    style: {
      color: 'var(--muted-foreground)',
      flexShrink: 0
    }
  })))));
}
window.FlowsScreen = FlowsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/FlowsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/FontesScreen.jsx
try { (() => {
// Fontes — de onde vem o que eu sei. Saúde da coleta por fonte.
const K = window.KoboDesignSystem_6efae6;
const {
  useState
} = React;
const TYPE_ICON = {
  youtube: 'youtube',
  rss: 'rss',
  site: 'network',
  api: 'cpu'
};
const HEALTH_VARIANT = {
  ok: 'secondary',
  degradada: 'destructive',
  'sem coleta': 'outline'
};
const HEALTH_LABEL = {
  ok: 'ok',
  degradada: 'degradada',
  'sem coleta': 'sem coleta há dias'
};
function FontesScreen() {
  const {
    PageHeader,
    Badge,
    Button,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const [query, setQuery] = useState('');
  const [view, setView] = useState('list');
  const filtered = d.fontes.filter(f => window.matchQuery(query, f.name, f.type, f.integ, f.health));
  const ring = '0 0 0 1px color-mix(in oklab, var(--foreground) 10%, transparent)';
  const typeIcon = f => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 34,
      height: 34,
      flexShrink: 0,
      borderRadius: 'var(--radius-lg)',
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: TYPE_ICON[f.type] || 'rss',
    size: 16
  }));
  const health = f => /*#__PURE__*/React.createElement(Badge, {
    variant: HEALTH_VARIANT[f.health]
  }, HEALTH_LABEL[f.health]);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Fontes",
    description: "De onde vem o que voc\xEA sabe \u2014 canais, feeds e sites, com a sa\xFAde de cada coleta.",
    actions: /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: "plus"
    }, "Adicionar fonte")
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(window.SearchBar, {
    value: query,
    onChange: setQuery,
    placeholder: "Buscar fontes por nome, tipo ou integra\xE7\xE3o\u2026"
  }), /*#__PURE__*/React.createElement(window.ViewToggle, {
    value: view,
    onChange: setView,
    allowed: ['list', 'grid2', 'squares']
  })), filtered.length === 0 ? /*#__PURE__*/React.createElement(window.EmptyState, {
    icon: "search",
    title: "Nenhuma fonte encontrada",
    description: `Nada casa com “${query}”. Tente outro termo ou limpe a busca.`
  }) : view === 'squares' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 10
    }
  }, filtered.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      gap: 8,
      height: 176,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, typeIcon(f), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, f.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, f.type), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: 'var(--muted-foreground)'
    }
  }, f.items, " itens"), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'auto'
    }
  }, health(f))))) : view === 'grid2' ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 10
    }
  }, filtered.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      height: 84,
      padding: 16,
      boxSizing: 'border-box',
      background: 'var(--card)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: ring
    }
  }, typeIcon(f), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, f.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, f.type)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, "via ", f.integ, " \xB7 ", f.items, " itens")), health(f)))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, filtered.map(f => /*#__PURE__*/React.createElement("div", {
    key: f.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)'
    }
  }, typeIcon(f), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, f.name), /*#__PURE__*/React.createElement(Badge, {
    variant: "outline"
  }, f.type)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "via ", /*#__PURE__*/React.createElement("span", null, f.integ), " \xB7 \xFAltima coleta ", f.last, " \xB7 ", f.items, " itens acumulados")), health(f)))));
}
window.FontesScreen = FontesScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/FontesScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/HomeScreen.jsx
try { (() => {
// Home — visão geral do ateliê. Stats + gate alert + últimas execuções + flows ativos.
const K = window.KoboDesignSystem_6efae6;
window.KUBO_STATUS = function (s) {
  const done = ['concluída', 'stored', 'done', 'promoted', 'sent', 'ativo', 'conectada'];
  const running = ['rodando', 'collecting', 'distilling', 'in_progress'];
  const fail = ['falhou', 'failed', 'degradada'];
  if (done.includes(s)) return 'secondary';
  if (running.includes(s)) return 'default';
  if (fail.includes(s)) return 'destructive';
  return 'outline';
};
function HomeScreen({
  onNavigate
}) {
  const {
    PageHeader,
    StatTile,
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardAction,
    Badge,
    Button,
    Icon
  } = K;
  const d = window.KUBO_DATA;
  const sv = window.KUBO_STATUS;
  const gateFlows = d.flows.filter(f => f.gate);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 24,
      padding: 24
    }
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Painel",
    description: "Seu ateli\xEA de agentes \u2014 coleta, conhecimento e distribui\xE7\xE3o num relance."
  }), gateFlows.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 16px',
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in oklab, var(--primary) 8%, transparent)',
      boxShadow: '0 0 0 1px color-mix(in oklab, var(--primary) 25%, transparent)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "triangle-alert",
    size: 16,
    style: {
      color: 'var(--primary)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: 'var(--foreground)',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, "1 decis\xE3o aguardando voc\xEA"), " \u2014 ", gateFlows[0].name, " tem um gate aberto."), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => onNavigate('Fluxos')
  }, "Revisar")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Fontes ativas",
    value: d.stats.fontesAtivas,
    icon: "rss",
    onClick: () => onNavigate('Fontes')
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Itens coletados (7d)",
    value: d.stats.itensColetados7d,
    icon: "database",
    onClick: () => onNavigate('Execuções')
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Destilados",
    value: d.stats.destilados,
    icon: "book-open",
    onClick: () => onNavigate('Conhecimento')
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Entidades no grafo",
    value: d.stats.entidades,
    icon: "network",
    onClick: () => onNavigate('Conhecimento')
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 16,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "\xDAltimas execu\xE7\xF5es"), /*#__PURE__*/React.createElement(CardDescription, null, "Runs recentes dos seus workers."), /*#__PURE__*/React.createElement(CardAction, null, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => onNavigate('Execuções')
  }, "Ver todas"))), /*#__PURE__*/React.createElement(CardContent, {
    style: {
      padding: 0
    }
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, d.runs.slice(0, 5).map((r, i) => /*#__PURE__*/React.createElement("li", {
    key: r.id,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 24px',
      borderTop: i ? '1px solid var(--border)' : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      flexShrink: 0,
      borderRadius: 'var(--radius-md)',
      background: 'var(--muted)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "activity",
    size: 16,
    style: {
      color: 'var(--muted-foreground)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0,
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, r.worker), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(r.status)
  }, r.status)), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '2px 0 0',
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, r.started, " \xB7 ", r.duration, " \xB7 ", r.items, " itens"))))))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement(CardHeader, null, /*#__PURE__*/React.createElement(CardTitle, null, "Fluxos ativos"), /*#__PURE__*/React.createElement(CardDescription, null, "Automa\xE7\xF5es em andamento."), /*#__PURE__*/React.createElement(CardAction, null, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => onNavigate('Fluxos')
  }, "Ver todos"))), /*#__PURE__*/React.createElement(CardContent, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, d.flows.filter(f => f.status !== 'pausado').map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => onNavigate('Fluxos'),
    style: {
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      padding: 12,
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--card)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 500,
      color: 'var(--foreground)',
      flex: 1
    }
  }, f.name), f.gate && /*#__PURE__*/React.createElement(Badge, {
    icon: "triangle-alert"
  }, "gate"), /*#__PURE__*/React.createElement(Badge, {
    variant: sv(f.status)
  }, f.status)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement("span", null, f.template), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 3
    }
  }, f.cast.map((e, i) => /*#__PURE__*/React.createElement(window.PersonaGlyph, {
    key: i,
    glyph: e,
    size: 20
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto'
    }
  }, f.tasksOpen, " tasks abertas")))))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/Shell.jsx
try { (() => {
// App shell: sidebar + 72px header with breadcrumb. Uses design-system components.
const K = window.KoboDesignSystem_6efae6;
function Shell({
  page,
  breadcrumb,
  onNavigate,
  dark,
  onToggleDark,
  authed = true,
  onLoginClick,
  onOpenCmd,
  children
}) {
  const {
    Sidebar,
    Breadcrumb,
    Icon,
    Tooltip
  } = K;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      height: '100%',
      background: 'var(--background)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      opacity: authed ? 1 : 0.4,
      filter: authed ? 'none' : 'saturate(0)',
      pointerEvents: authed ? 'auto' : 'none'
    }
  }, /*#__PURE__*/React.createElement(Sidebar, {
    active: page,
    onNavigate: onNavigate,
    user: window.KUBO_DATA.owner
  })), !authed && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      padding: 8,
      borderTop: '1px solid var(--sidebar-border)',
      background: 'var(--sidebar)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLoginClick,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 8px',
      border: '1px dashed color-mix(in oklab, var(--foreground) 22%, transparent)',
      borderRadius: 'var(--radius-lg)',
      background: 'transparent',
      cursor: 'pointer',
      textAlign: 'left',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      borderRadius: 9999,
      background: 'var(--muted)',
      color: 'var(--muted-foreground)',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "user",
    size: 16
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      lineHeight: 1.3
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: 'var(--foreground)'
    }
  }, "Entrar ou criar conta"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: 'var(--muted-foreground)'
    }
  }, "para usar seu ateli\xEA"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 72,
      flexShrink: 0,
      padding: '0 16px',
      borderBottom: '1px solid color-mix(in oklab, var(--border) 50%, transparent)'
    }
  }, /*#__PURE__*/React.createElement(Tooltip, {
    label: "Recolher menu",
    side: "bottom"
  }, /*#__PURE__*/React.createElement("button", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 28,
      height: 28,
      border: 'none',
      background: 'transparent',
      borderRadius: 'var(--radius-md)',
      cursor: 'pointer',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "panel-left",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 16,
      background: 'color-mix(in oklab, var(--border) 60%, transparent)',
      margin: '0 4px'
    }
  }), /*#__PURE__*/React.createElement(Breadcrumb, {
    segments: breadcrumb
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), authed && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenCmd,
    "aria-label": "Buscar (\u2318K)",
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      height: 32,
      padding: '0 10px',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-4xl)',
      cursor: 'pointer',
      background: 'transparent',
      color: 'var(--muted-foreground)',
      fontFamily: 'var(--font-sans)'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'var(--muted)',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 14
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "Buscar"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      border: '1px solid var(--border)',
      borderRadius: 5,
      padding: '1px 5px',
      fontFamily: 'ui-monospace, monospace'
    }
  }, "\u2318K")), authed && /*#__PURE__*/React.createElement(Tooltip, {
    label: "Configura\xE7\xF5es",
    side: "bottom"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNavigate('Configurações'),
    "aria-label": "Configura\xE7\xF5es",
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      border: 'none',
      borderRadius: 'var(--radius-lg)',
      cursor: 'pointer',
      background: page === 'Configurações' ? 'var(--muted)' : 'transparent',
      color: page === 'Configurações' ? 'var(--foreground)' : 'var(--muted-foreground)'
    },
    onMouseEnter: e => {
      if (page !== 'Configurações') e.currentTarget.style.background = 'var(--muted)';
    },
    onMouseLeave: e => {
      if (page !== 'Configurações') e.currentTarget.style.background = 'transparent';
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "settings",
    size: 16
  })))), /*#__PURE__*/React.createElement("main", {
    style: {
      flex: 1,
      minHeight: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, children)));
}
window.Shell = Shell;

// Monochrome persona identity — maps each preset emoji to a Lucide glyph so
// personas follow the same monochrome iconography as the rest of the app.
window.PERSONA_ICON = {
  '🔍': 'search',
  '🧭': 'network',
  '🛠️': 'git-branch',
  '⚖️': 'circle-check',
  '⚗️': 'filter',
  '⚙️': 'cpu',
  '🧑': 'user'
};
function PersonaGlyph({
  glyph,
  size = 20,
  title,
  tone = 'muted'
}) {
  const {
    Icon
  } = window.KoboDesignSystem_6efae6;
  const name = window.PERSONA_ICON[glyph] || 'bot';
  const bg = tone === 'primary' ? 'var(--primary)' : 'var(--muted)';
  const fg = tone === 'primary' ? 'var(--primary-foreground)' : 'var(--muted-foreground)';
  return /*#__PURE__*/React.createElement("span", {
    title: title,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      borderRadius: 9999,
      background: bg,
      color: fg,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: Math.round(size * 0.56)
  }));
}
window.PersonaGlyph = PersonaGlyph;

// Reusable search bar — the Conhecimento pattern (lupa + Input, maxWidth 420).
function SearchBar({
  value,
  onChange,
  placeholder = 'Buscar…'
}) {
  const {
    Input,
    Icon
  } = window.KoboDesignSystem_6efae6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 420
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      color: 'var(--muted-foreground)',
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "search",
    size: 16
  })), /*#__PURE__*/React.createElement(Input, {
    value: value,
    onChange: e => onChange(e.target.value),
    placeholder: placeholder,
    style: {
      paddingLeft: 34
    }
  }));
}
window.SearchBar = SearchBar;

// View toggle — segmented control: Lista / Duas colunas / Quadrados.
// Options not in `allowed` render greyed + disabled with an explanatory tooltip.
function ViewToggle({
  value,
  onChange,
  allowed = ['list', 'grid2', 'squares']
}) {
  const {
    Icon
  } = window.KoboDesignSystem_6efae6;
  const opts = [{
    key: 'list',
    icon: 'list',
    label: 'Lista'
  }, {
    key: 'grid2',
    icon: 'columns-2',
    label: 'Duas colunas'
  }, {
    key: 'squares',
    icon: 'grid-2x2',
    label: 'Quadrados'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      padding: 3,
      gap: 2,
      background: 'var(--muted)',
      borderRadius: 'var(--radius-4xl)',
      flexShrink: 0
    }
  }, opts.map(o => {
    const on = value === o.key;
    const dis = !allowed.includes(o.key);
    return /*#__PURE__*/React.createElement("button", {
      key: o.key,
      disabled: dis,
      onClick: () => !dis && onChange(o.key),
      "aria-label": o.label,
      title: dis ? o.label + ' — não se aplica a esta tela' : o.label,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 32,
        height: 26,
        border: 'none',
        cursor: dis ? 'not-allowed' : 'pointer',
        borderRadius: 'calc(var(--radius-4xl) - 2px)',
        background: on ? 'var(--background)' : 'transparent',
        color: dis ? 'var(--muted-foreground)' : on ? 'var(--foreground)' : 'var(--muted-foreground)',
        opacity: dis ? 0.4 : 1,
        boxShadow: on ? '0 0 0 1px color-mix(in oklab, var(--foreground) 8%, transparent)' : 'none',
        transition: 'all 120ms'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: o.icon,
      size: 15
    }));
  }));
}
window.ViewToggle = ViewToggle;

// Case-insensitive substring match across any number of fields.
window.matchQuery = function (query, ...fields) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return true;
  return fields.some(f => String(f == null ? '' : f).toLowerCase().includes(q));
};

// Reusable empty / first-run state.
function EmptyState({
  icon = 'sparkles',
  title,
  description,
  action
}) {
  const {
    Icon,
    Button
  } = window.KoboDesignSystem_6efae6;
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '56px 24px',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 48,
      height: 48,
      borderRadius: 9999,
      background: 'var(--muted)',
      color: 'var(--muted-foreground)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 340
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-heading)',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--foreground)'
    }
  }, title), description && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 13,
      lineHeight: 1.5,
      color: 'var(--muted-foreground)'
    }
  }, description)), action && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, action));
}
window.EmptyState = EmptyState;

// Monochrome sparkline (SVG). values: number[]. Uses currentColor via stroke.
function Sparkline({
  values = [],
  width = 96,
  height = 28,
  stroke = 'var(--foreground)',
  fill = true
}) {
  if (!values.length) return null;
  const max = Math.max(...values, 1),
    min = Math.min(...values, 0);
  const span = max - min || 1;
  const stepX = width / (values.length - 1 || 1);
  const pts = values.map((v, i) => [i * stepX, height - (v - min) / span * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return /*#__PURE__*/React.createElement("svg", {
    width: width,
    height: height,
    viewBox: `0 0 ${width} ${height}`,
    style: {
      display: 'block',
      overflow: 'visible'
    }
  }, fill && /*#__PURE__*/React.createElement("path", {
    d: area,
    fill: "color-mix(in oklab, var(--foreground) 8%, transparent)"
  }), /*#__PURE__*/React.createElement("path", {
    d: line,
    fill: "none",
    stroke: stroke,
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: pts[pts.length - 1][0],
    cy: pts[pts.length - 1][1],
    r: "2.2",
    fill: stroke
  }));
}
window.Sparkline = Sparkline;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/Shell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/kubo-app/data.js
try { (() => {
// Kubo domain data (single-owner agent atelier). Vocabulary: Flow, Persona,
// Integração, Worker, Run, Task, Board, Gate, Destilado, Entidade, Fonte.
window.KUBO_DATA = {
  owner: {
    name: 'Renato Bardi',
    email: 'renato@kubo.studio'
  },
  stats: {
    fontesAtivas: 9,
    itensColetados7d: 214,
    destilados: 68,
    entidades: 137
  },
  // Persona presets — identity IS the emoji
  personas: [{
    id: 'p-analista',
    emoji: '🔍',
    name: 'Analista',
    executor: 'api',
    model: 'gpt-4o',
    skills: ['web-research', 'summarize'],
    perms: ['read:sources', 'write:distillates']
  }, {
    id: 'p-arquiteto',
    emoji: '🧭',
    name: 'Arquiteto',
    executor: 'api',
    model: 'claude-3-5-sonnet',
    skills: ['plan', 'decompose'],
    perms: ['read:knowledge', 'write:tasks']
  }, {
    id: 'p-dev',
    emoji: '🛠️',
    name: 'Dev',
    executor: 'cli',
    model: 'claude-3-5-sonnet',
    skills: ['code', 'test', 'git', 'refactor'],
    perms: ['read:repo', 'write:repo']
  }, {
    id: 'p-reviewer',
    emoji: '⚖️',
    name: 'Reviewer',
    executor: 'api',
    model: 'gpt-4o',
    skills: ['review', 'lint'],
    perms: ['read:repo', 'comment']
  }, {
    id: 'p-destilador',
    emoji: '⚗️',
    name: 'Destilador',
    executor: 'api',
    model: 'text-embedding-3',
    skills: ['distill', 'extract-entities'],
    perms: ['read:items', 'write:graph']
  }, {
    id: 'p-operador',
    emoji: '⚙️',
    name: 'Operador',
    executor: 'cli',
    model: '—',
    skills: ['schedule', 'collect'],
    perms: ['run:workers']
  }, {
    id: 'p-humano',
    emoji: '🧑',
    name: 'Humano',
    executor: 'api',
    model: '— (você)',
    skills: ['decide', 'approve'],
    perms: ['gate:all'],
    isHuman: true
  }],
  // Skills catalog — edited in the UI; each save creates a NEW immutable version.
  // 'refactor' is intentionally absent to demo the missing-reference warning.
  skills: {
    'web-research': {
      cli: false,
      usedBy: ['🔍'],
      versions: [{
        v: 3,
        state: 'ativa',
        when: 'Jul 1, 2026',
        by: 'você',
        content: '# web-research\n\nBusca a web, lê páginas e sintetiza achados **com citação de origem**.\n\n## Regras\n- Sempre registrar a URL da fonte.\n- Máx. 5 páginas por consulta.\n- Preferir fontes primárias.'
      }, {
        v: 2,
        state: 'antiga',
        when: 'Jun 20, 2026',
        by: 'você',
        content: '# web-research\n\nBusca a web e resume.\n\n## Regras\n- Registrar URL.\n- Máx. 8 páginas por consulta.'
      }, {
        v: 1,
        state: 'antiga',
        when: 'Jun 2, 2026',
        by: 'você',
        content: '# web-research\n\nBusca a web e resume os resultados.'
      }]
    },
    'distill': {
      cli: false,
      usedBy: ['⚗️'],
      versions: [{
        v: 3,
        state: 'proposta',
        when: 'há 2h',
        by: 'flow · Coleta diária',
        content: '# distill\n\nExtrai claims e entidades tipadas do item bruto.\n\n## Novo (proposto pelo flow)\n- Deduplicar claims por similaridade semântica.\n- Marcar confiança por claim.'
      }, {
        v: 2,
        state: 'ativa',
        when: 'Jun 18, 2026',
        by: 'você',
        content: '# distill\n\nExtrai um resumo, claims e entidades do item bruto.\n\n## Regras\n- 1 destilado por item.\n- Vincular entidades ao grafo.'
      }, {
        v: 1,
        state: 'antiga',
        when: 'Mai 30, 2026',
        by: 'você',
        content: '# distill\n\nResume o item bruto em destilado.'
      }]
    },
    'code': {
      cli: true,
      usedBy: ['🛠️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Mai 22, 2026',
        by: 'você',
        content: '# code\n\nEscreve e altera código no repositório via CLI sandboxed.\n\n## Regras\n- Rodar testes antes de propor diff.\n- Nunca commitar sem gate do dono.'
      }]
    },
    'review': {
      cli: false,
      usedBy: ['⚖️'],
      versions: [{
        v: 2,
        state: 'ativa',
        when: 'Jun 12, 2026',
        by: 'você',
        content: '# review\n\nRevisa diffs quanto a correção, estilo e riscos.'
      }, {
        v: 1,
        state: 'antiga',
        when: 'Mai 28, 2026',
        by: 'você',
        content: '# review\n\nRevisa código.'
      }]
    },
    'summarize': {
      cli: false,
      usedBy: ['🔍'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Jun 2, 2026',
        by: 'você',
        content: '# summarize\n\nResume texto longo em 3–5 linhas.'
      }]
    },
    'plan': {
      cli: false,
      usedBy: ['🧭'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Jun 5, 2026',
        by: 'você',
        content: '# plan\n\nDecompõe um objetivo em tasks com dependências.'
      }]
    },
    'decompose': {
      cli: false,
      usedBy: ['🧭'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Jun 5, 2026',
        by: 'você',
        content: '# decompose\n\nQuebra uma task grande em subtasks.'
      }]
    },
    'test': {
      cli: true,
      usedBy: ['🛠️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Mai 22, 2026',
        by: 'você',
        content: '# test\n\nRoda a suíte de testes e reporta falhas.'
      }]
    },
    'git': {
      cli: true,
      usedBy: ['🛠️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Mai 22, 2026',
        by: 'você',
        content: '# git\n\nOperações de versionamento (branch, diff, commit sob gate).'
      }]
    },
    'lint': {
      cli: false,
      usedBy: ['⚖️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Mai 28, 2026',
        by: 'você',
        content: '# lint\n\nAplica regras de estilo e aponta violações.'
      }]
    },
    'extract-entities': {
      cli: false,
      usedBy: ['⚗️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Mai 30, 2026',
        by: 'você',
        content: '# extract-entities\n\nExtrai entidades tipadas e relações do texto.'
      }]
    },
    'schedule': {
      cli: true,
      usedBy: ['⚙️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Abr 30, 2026',
        by: 'você',
        content: '# schedule\n\nAgenda coletas por cron.'
      }]
    },
    'collect': {
      cli: true,
      usedBy: ['⚙️'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Abr 30, 2026',
        by: 'você',
        content: '# collect\n\nColeta itens de uma fonte configurada.'
      }]
    },
    'decide': {
      cli: false,
      usedBy: ['🧑'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Abr 18, 2026',
        by: 'você',
        content: '# decide\n\nDecisão do dono em um gate (aprovar/rejeitar).'
      }]
    },
    'approve': {
      cli: false,
      usedBy: ['🧑'],
      versions: [{
        v: 1,
        state: 'ativa',
        when: 'Abr 18, 2026',
        by: 'você',
        content: '# approve\n\nAprova a promoção de um artefato ou worker.'
      }]
    }
  },
  // Destilados (curated knowledge, graph nodes with provenance)
  destilados: [{
    id: 'd1',
    title: 'Pricing usage-based vira padrão em dev-tools',
    summary: 'Três concorrentes migraram para cobrança por uso no Q2, liderando com narrativa de agentes.',
    entities: ['Usage-based pricing', 'Vercel', 'Agentes de IA'],
    source: 'YouTube · Fireship',
    item: 'Vídeo: "The pricing shift nobody noticed" (14:02)',
    itemUrl: 'https://youtube.com/watch?v=xxxx',
    run: 'run-2291',
    date: 'Jul 2, 2026',
    claims: ['2 de 3 concorrentes rastreados lançaram cobrança por uso no Q2.', 'Homepage de ambos lidera com narrativa de agente.', 'Diferenciação do Kubo é orquestração de flows.']
  }, {
    id: 'd2',
    title: 'RAG sobre grafo supera vetor puro em multi-hop',
    summary: 'Consultas multi-hop se beneficiam de proveniência tipada; vetor puro perde a cadeia.',
    entities: ['GraphRAG', 'Embeddings', 'Proveniência'],
    source: 'RSS · arXiv cs.IR',
    item: 'Artigo: "Typed provenance for retrieval" (PDF)',
    itemUrl: 'https://arxiv.org/abs/xxxx',
    run: 'run-2288',
    date: 'Jul 1, 2026',
    claims: ['Grafo tipado melhora recall em consultas de 3+ saltos.', 'Citação de origem reduz alucinação em 22% no benchmark.']
  }, {
    id: 'd3',
    title: 'Telegram como canal de digest supera e-mail em abertura',
    summary: 'Digests entregues via bot têm 3x mais abertura que e-mail para público técnico.',
    entities: ['Telegram', 'Distribuição', 'Digest'],
    source: 'Post · blog interno',
    item: 'Post: "Onde nossos amigos leem" ',
    itemUrl: 'https://example.com/post',
    run: 'run-2280',
    date: 'Jun 29, 2026',
    claims: ['Abertura de digest no Telegram: 74% vs 24% e-mail.', 'Amigos preferem resumo curto + link para o destilado.']
  }, {
    id: 'd4',
    title: 'Workers CLI precisam de sandbox e budget por run',
    summary: 'Execuções via CLI sem teto de budget causaram 2 estouros; gate de promoção recomendado.',
    entities: ['Worker', 'Budget', 'Sandbox'],
    source: 'GitHub · issues',
    item: 'Issue #142: runaway CLI worker',
    itemUrl: 'https://github.com/kubo-labs/x/issues/142',
    run: 'run-2275',
    date: 'Jun 27, 2026',
    claims: ['2 execuções excederam budget em Jun.', 'Gate humano antes de promover worker novo evita reincidência.']
  }],
  entities: [{
    id: 'e1',
    name: 'Usage-based pricing',
    type: 'conceito',
    mentions: 12,
    trend: [1, 0, 2, 1, 3, 2, 4, 3, 5, 4, 6, 5],
    relations: [{
      rel: 'compete_com',
      target: 'Assinatura fixa'
    }, {
      rel: 'usa',
      target: 'Telemetria'
    }]
  }, {
    id: 'e2',
    name: 'GraphRAG',
    type: 'tecnologia',
    mentions: 9,
    trend: [0, 1, 1, 2, 1, 3, 2, 2, 3, 4, 3, 5],
    relations: [{
      rel: 'parte_de',
      target: 'Conhecimento'
    }, {
      rel: 'usa',
      target: 'Embeddings'
    }]
  }, {
    id: 'e3',
    name: 'Telegram',
    type: 'organização',
    mentions: 7,
    trend: [2, 1, 0, 1, 1, 0, 2, 1, 3, 2, 1, 3],
    relations: [{
      rel: 'usa',
      target: 'Bot API'
    }, {
      rel: 'parte_de',
      target: 'Distribuição'
    }]
  }, {
    id: 'e4',
    name: 'Vercel',
    type: 'organização',
    mentions: 5,
    trend: [0, 0, 1, 0, 1, 1, 0, 1, 2, 1, 1, 2],
    relations: [{
      rel: 'compete_com',
      target: 'Netlify'
    }]
  }, {
    id: 'e5',
    name: 'Embeddings',
    type: 'tecnologia',
    mentions: 11,
    trend: [1, 2, 1, 3, 2, 4, 3, 4, 5, 4, 6, 5],
    relations: [{
      rel: 'parte_de',
      target: 'GraphRAG'
    }]
  }, {
    id: 'e6',
    name: 'Fireship',
    type: 'pessoa',
    mentions: 4,
    trend: [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 2, 1],
    relations: [{
      rel: 'parte_de',
      target: 'YouTube'
    }]
  }],
  // Flows (instances of templates) + their kanban boards
  flows: [{
    id: 'f1',
    name: 'Kubo web — sprint 12',
    template: 'dev-bmad',
    status: 'rodando',
    cast: ['🧭', '🛠️', '⚖️', '🧑'],
    tasksOpen: 5,
    budget: {
      used: 3.2,
      limit: 8
    },
    gate: true,
    created: 'Jun 24, 2026',
    states: ['backlog', 'analysis', 'in_progress', 'review', 'done', 'promoted'],
    tasks: [{
      id: 't1',
      title: 'Levantar requisitos do board de flows',
      persona: '🧭',
      personaName: 'Arquiteto',
      state: 'done'
    }, {
      id: 't2',
      title: 'Modelar máquina de estados do template',
      persona: '🧭',
      personaName: 'Arquiteto',
      state: 'done'
    }, {
      id: 't3',
      title: 'Implementar colunas do kanban',
      persona: '🛠️',
      personaName: 'Dev',
      state: 'in_progress'
    }, {
      id: 't4',
      title: 'Componente de card de task',
      persona: '🛠️',
      personaName: 'Dev',
      state: 'in_progress',
      blocked: true
    }, {
      id: 't5',
      title: 'Revisar acessibilidade dos gates',
      persona: '⚖️',
      personaName: 'Reviewer',
      state: 'review'
    }, {
      id: 't6',
      title: 'Refinar backlog de distribuição',
      persona: '🧭',
      personaName: 'Arquiteto',
      state: 'backlog'
    }, {
      id: 't7',
      title: 'Aprovar promoção do worker x-collector',
      persona: '🧑',
      personaName: 'Humano',
      state: 'review',
      gate: true,
      gateContext: {
        pede: 'Promover o worker x-collector de proposta para produção, ativando coleta agendada.',
        produzido: ['Worker x-collector rodou sob contrato por 6 execuções (5 ok, 1 rate-limit).', 'PR #12 aberto com o código do collector e testes.', 'Review da persona Reviewer: aprovado com 2 ressalvas (tratar 429, cobrir paginação).'],
        pr: 'PR #12',
        prUrl: 'https://github.com/kubo-labs/x/pull/12',
        budget: '3.2 / 8'
      }
    }]
  }, {
    id: 'f2',
    name: 'Coleta diária — fontes técnicas',
    template: 'pipeline',
    status: 'rodando',
    cast: ['⚙️', '⚗️'],
    tasksOpen: 2,
    budget: {
      used: 1.1,
      limit: 3
    },
    gate: false,
    created: 'Mai 2, 2026',
    states: ['queued', 'collecting', 'distilling', 'stored', 'failed'],
    tasks: [{
      id: 't8',
      title: 'Coletar canal Fireship',
      persona: '⚙️',
      personaName: 'Operador',
      state: 'stored'
    }, {
      id: 't9',
      title: 'Coletar feed arXiv cs.IR',
      persona: '⚙️',
      personaName: 'Operador',
      state: 'distilling'
    }, {
      id: 't10',
      title: 'Destilar backlog de 14 itens',
      persona: '⚗️',
      personaName: 'Destilador',
      state: 'collecting'
    }, {
      id: 't11',
      title: 'Coletar RSS blog interno',
      persona: '⚙️',
      personaName: 'Operador',
      state: 'queued'
    }, {
      id: 't12',
      title: 'Coletar canal HN (timeout)',
      persona: '⚙️',
      personaName: 'Operador',
      state: 'failed',
      error: 'HTTP 504 no fetch'
    }]
  }, {
    id: 'f3',
    name: 'Newsletter semanal',
    template: 'pipeline',
    status: 'pausado',
    cast: ['⚗️', '🧑'],
    tasksOpen: 0,
    budget: {
      used: 0.4,
      limit: 2
    },
    gate: false,
    created: 'Abr 18, 2026',
    states: ['queued', 'collecting', 'distilling', 'stored', 'failed'],
    tasks: []
  }],
  // Runs (worker executions)
  runs: [{
    id: 'run-2291',
    worker: 'yt-collector',
    flow: 'Coleta diária',
    started: 'Jul 2, 09:02',
    duration: '48s',
    status: 'concluída',
    items: 6,
    error: null
  }, {
    id: 'run-2290',
    worker: 'distiller',
    flow: 'Coleta diária',
    started: 'Jul 2, 09:04',
    duration: '2m 11s',
    status: 'rodando',
    items: 3,
    error: null
  }, {
    id: 'run-2288',
    worker: 'rss-collector',
    flow: 'Coleta diária',
    started: 'Jul 1, 09:02',
    duration: '31s',
    status: 'concluída',
    items: 9,
    error: null
  }, {
    id: 'run-2286',
    worker: 'hn-collector',
    flow: 'Coleta diária',
    started: 'Jul 1, 09:02',
    duration: '30s',
    status: 'falhou',
    items: 0,
    error: 'HTTP 504 — upstream timeout ao buscar https://news.ycombinator.com'
  }, {
    id: 'run-2280',
    worker: 'digest-builder',
    flow: 'Newsletter semanal',
    started: 'Jun 29, 08:00',
    duration: '1m 05s',
    status: 'concluída',
    items: 1,
    error: null
  }, {
    id: 'run-2275',
    worker: 'x-collector',
    flow: 'Coleta diária',
    started: 'Jun 27, 09:02',
    duration: '12s',
    status: 'falhou',
    items: 0,
    error: 'Rate limit excedido (429) — budget do run esgotado'
  }],
  integracoes: [{
    id: 'i1',
    name: 'github',
    icon: 'git-branch',
    color: '#1f2328',
    secret: 'via env',
    rateLimit: '5000/h',
    status: 'conectada'
  }, {
    id: 'i2',
    name: 'telegram',
    icon: 'send',
    color: '#0ea5e9',
    secret: 'via env',
    rateLimit: '30/s',
    status: 'conectada'
  }, {
    id: 'i3',
    name: 'rss',
    icon: 'rss',
    color: '#f59e0b',
    secret: '—',
    rateLimit: '—',
    status: 'conectada'
  }, {
    id: 'i4',
    name: 'smtp',
    icon: 'mail',
    color: '#6366f1',
    secret: 'via env',
    rateLimit: '200/dia',
    status: 'conectada'
  }, {
    id: 'i5',
    name: 'youtube',
    icon: 'youtube',
    color: '#ef4444',
    secret: 'via env',
    rateLimit: '10000/dia',
    status: 'degradada'
  }],
  templates: [{
    id: 'tpl1',
    name: 'dev-bmad',
    states: ['backlog', 'analysis', 'in_progress', 'review', 'done', 'promoted'],
    cast: ['🧭', '🛠️', '⚖️', '🧑'],
    gates: ['promoted'],
    trigger: 'manual',
    budget: 8
  }, {
    id: 'tpl2',
    name: 'pipeline',
    states: ['queued', 'collecting', 'distilling', 'stored', 'failed'],
    cast: ['⚙️', '⚗️'],
    gates: [],
    trigger: 'cron: 0 9 * * *',
    budget: 3
  }, {
    id: 'tpl3',
    name: 'research-digest',
    states: ['queued', 'collecting', 'distilling', 'review', 'sent'],
    cast: ['🔍', '⚗️', '🧑'],
    gates: ['sent'],
    trigger: 'webhook',
    budget: 2
  }],
  canais: [{
    id: 'ch1',
    name: 'Telegram',
    icon: 'send',
    color: '#0ea5e9',
    status: 'ativo',
    detail: '@kubo_digest_bot'
  }, {
    id: 'ch2',
    name: 'E-mail (SMTP)',
    icon: 'mail',
    color: '#6366f1',
    status: 'ativo',
    detail: 'digest@kubo.studio'
  }],
  // Fontes — de onde vem o que eu sei (visão de saúde da coleta)
  fontes: [{
    id: 'src1',
    name: 'Fireship',
    type: 'youtube',
    integ: 'youtube',
    last: 'há 2h',
    items: 142,
    health: 'ok'
  }, {
    id: 'src2',
    name: 'arXiv cs.IR',
    type: 'rss',
    integ: 'rss',
    last: 'há 3h',
    items: 88,
    health: 'ok'
  }, {
    id: 'src3',
    name: 'Blog interno',
    type: 'rss',
    integ: 'rss',
    last: 'há 1d',
    items: 24,
    health: 'ok'
  }, {
    id: 'src4',
    name: 'Hacker News — front',
    type: 'site',
    integ: 'rss',
    last: 'há 6d',
    items: 310,
    health: 'sem coleta'
  }, {
    id: 'src5',
    name: 'Changelog dev-tools',
    type: 'site',
    integ: 'rss',
    last: 'há 5h',
    items: 57,
    health: 'degradada'
  }, {
    id: 'src6',
    name: 'GitHub releases (watched)',
    type: 'api',
    integ: 'github',
    last: 'há 1h',
    items: 63,
    health: 'ok'
  }],
  // Artefatos configurados — digests/relatórios recorrentes
  artefatos: [{
    id: 'a1',
    name: 'Digest semanal',
    query: 'destilados dos últimos 7d marcados',
    destinos: ['Renato Bardi', 'Marina Alves', 'Téo Nogueira'],
    agenda: 'cron: 0 8 * * 1'
  }, {
    id: 'a2',
    name: 'Relatório de flow',
    query: 'runs + gates do flow selecionado',
    destinos: ['Renato Bardi'],
    agenda: 'evento: flow concluído'
  }, {
    id: 'a3',
    name: 'Boletim de fontes degradadas',
    query: 'fontes com saúde ≠ ok',
    destinos: ['Webhook ops', 'Renato Bardi'],
    agenda: 'cron: 0 7 * * *'
  }],
  // Destinos — pessoas + sistemas
  destinos: [{
    id: 'r1',
    name: 'Renato Bardi',
    kind: 'pessoa',
    role: 'dono',
    channel: 'Telegram · E-mail'
  }, {
    id: 'r2',
    name: 'Marina Alves',
    kind: 'pessoa',
    role: 'convidada',
    channel: 'E-mail'
  }, {
    id: 'r3',
    name: 'Téo Nogueira',
    kind: 'pessoa',
    role: 'convidado',
    channel: 'Telegram'
  }, {
    id: 'r4',
    name: 'Webhook ops',
    kind: 'sistema',
    sys: 'webhook',
    channel: 'POST ops.kubo.studio/hook'
  }, {
    id: 'r5',
    name: 'Arquivo mensal',
    kind: 'sistema',
    sys: 'arquivo',
    channel: 'exports/ (Markdown)'
  }],
  envios: [{
    id: 's1',
    kind: 'Digest semanal',
    channel: 'Telegram',
    to: 'Renato Bardi',
    when: 'Jun 29, 08:01'
  }, {
    id: 's2',
    kind: 'Digest semanal',
    channel: 'E-mail',
    to: 'Marina Alves',
    when: 'Jun 29, 08:01'
  }, {
    id: 's3',
    kind: 'Relatório de flow',
    channel: 'E-mail',
    to: 'Renato Bardi',
    when: 'Jun 28, 18:30'
  }, {
    id: 's4',
    kind: 'Digest semanal',
    channel: 'Telegram',
    to: 'Téo Nogueira',
    when: 'Jun 22, 08:01'
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/kubo-app/data.js", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Sakura = __ds_scope.Sakura;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Label = __ds_scope.Label;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.AgentAvatar = __ds_scope.AgentAvatar;

__ds_ns.AgentCard = __ds_scope.AgentCard;

__ds_ns.ChatInput = __ds_scope.ChatInput;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.Breadcrumb = __ds_scope.Breadcrumb;

__ds_ns.PageHeader = __ds_scope.PageHeader;

__ds_ns.Sidebar = __ds_scope.Sidebar;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardHeader = __ds_scope.CardHeader;

__ds_ns.CardTitle = __ds_scope.CardTitle;

__ds_ns.CardDescription = __ds_scope.CardDescription;

__ds_ns.CardAction = __ds_scope.CardAction;

__ds_ns.CardContent = __ds_scope.CardContent;

__ds_ns.CardFooter = __ds_scope.CardFooter;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Separator = __ds_scope.Separator;

__ds_ns.Skeleton = __ds_scope.Skeleton;

__ds_ns.Tooltip = __ds_scope.Tooltip;

})();
