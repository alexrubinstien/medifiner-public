import Router from 'next/router';

export function redirect(isServer, res, route) {
  if (isServer && res) {
    res.writeHead(302, {
      Location: route,
    });
    res.end();
    res.finished = true;
  } else {
    Router.replace(route);
  }
}

export function isMobile() {
  return ('ontouchstart' in document.documentElement);
}


export function detectWebGL() {
  var canvas = document.createElement("canvas");
  var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  return gl && gl instanceof WebGLRenderingContext;
};