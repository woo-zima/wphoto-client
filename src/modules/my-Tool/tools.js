export function Mydebounce(cb, delay = 500) {
  let timer = null;
  return function () {
    timer && clearTimeout(timer);
    timer = setTimeout(() => {
      cb.apply(this, arguments);
    }, delay);
  };
}

export function Mythrottle(cb, delay = 300) {
  let timer = 0;
  return function () {
    if (timer) return;
    timer = setTimeout(() => {
      cb.apply(this, arguments);
      timer = 0;
    }, delay);
  };
}
