(this.webpackJsonpclient=this.webpackJsonpclient||[]).push([[0],{37:function(e,t,n){},55:function(e,t,n){"use strict";n.r(t);var a=n(6),o=n.n(a),c=n(22),s=n.n(c),l=n(23),r=n(17),i=(n(37),n(32)),h=n(31),u=n.n(h),m=n(0),j=Object(i.a)("".concat("https://lit-citadel-01156.herokuapp.com")),b=function(e){var t=e.date,n=e.channel;return t=new Date(t).toLocaleTimeString("ru-RU"),Object(m.jsxs)("div",{children:[" ","[".concat(t,"] (").concat(n,")")," "]})},d=function(e){var t=e.modalPosition,n=e.showModal,a=e.setShowModal,o=e.chatElement;return Object(m.jsxs)(u.a,{style:{content:t},isOpen:n,contentLabel:"Minimal Modal Example",onRequestClose:function(){return a(!1)},overlayClassName:"Overlay",className:"Modal",children:[Object(m.jsx)("button",{onClick:function(){return a(!1)},children:"Close Modal"}),Object(m.jsx)(b,{date:o.time,channel:o.channel})]})},O=function(e){console.log(e);var t=e.channelChat,n=e.setChatElement,a=e.setModalPosition,o=e.setShowModal,c=e.showModal;return Object(m.jsx)("div",{className:"channelChat",children:t.map((function(e){return Object(m.jsx)(p,{setChatElement:n,setModalPosition:a,showModal:c,setShowModal:o,chatElement:e})}))})},p=function(e){var t=e.setModalPosition,n=e.setChatElement,a=e.setShowModal,o=e.chatElement,c=o.userstate.username,s=o.message,l={color:o.userstate.color};return Object(m.jsx)(m.Fragment,{children:Object(m.jsxs)("div",{children:[Object(m.jsxs)("span",{onClick:function(e){console.log("onClick elemenet",o),t({left:e.clientX+"px",top:e.clientY+"px",right:"20px",bottom:"20px"}),a(!0),n(o)},style:l,children:[" ",c," : "]}),Object(m.jsxs)("span",{children:[" ",s]})]})})};var f=function(){var e=[{userstate:{username:"test1",color:"black"},message:"testing",channel:"1",time:new Date},{userstate:{username:"test2",color:"black"},message:"testing",channel:"2",time:new Date},{userstate:{username:"test3",color:"black"},message:"testing",channel:"3",time:new Date},{userstate:{username:"test",color:"black"},message:"testing",channel:"3",time:new Date},{userstate:{username:"test",color:"black"},message:"testing",channel:"testingChannel",time:new Date}],t=Object(a.useState)(!1),n=Object(r.a)(t,2),o=n[0],c=n[1],s=Object(a.useState)({left:"10px",top:"10px",right:"10px",bottom:"10px"}),i=Object(r.a)(s,2),h=i[0],u=i[1],b=Object(a.useState)(e),p=Object(r.a)(b,2),f=p[0],g=p[1],x=Object(a.useState)(f[0]),w=Object(r.a)(x,2),M=w[0],v=w[1];function C(e){return Array.from(new Set(e.map((function(e){return e.channel})))).map((function(t){var n=t?{name:t}:null;return Object(l.a)(Object(l.a)({},n),{},{chat:e.filter((function(e){return e.channel===t}))})}))}var S=C(f);return console.log(C(f)),console.log("chat",f),console.log("chatElement",M),Object(a.useEffect)((function(){var e;console.log("subscribe to chat"),e=function(e,t){g(t)},j.on("chat",(function(t){console.log("receive chat",t),e(null,t)})),j.emit("subscribeToChat",1e3)}),[]),Object(m.jsxs)("div",{children:[Object(m.jsx)(d,{modalPosition:h,showModal:o,setShowModal:c,chatElement:M}),S.map((function(e){return console.log(e),Object(m.jsxs)("div",{children:[e.name,Object(m.jsx)(O,{setChatElement:v,setModalPosition:u,setShowModal:c,showModal:o,channelChat:e.chat})]})}))]})};s.a.render(Object(m.jsx)(o.a.StrictMode,{children:Object(m.jsx)(f,{})}),document.getElementById("root"))}},[[55,1,2]]]);
//# sourceMappingURL=main.0f633ca9.chunk.js.map