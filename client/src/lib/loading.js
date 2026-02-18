let count = 0;
const subs = new Set();

export function inc(){
  count += 1;
  subs.forEach(s => s(count));
}
export function dec(){
  count = Math.max(0, count - 1);
  subs.forEach(s => s(count));
}
export function subscribe(fn){
  subs.add(fn);
  fn(count);
  return () => subs.delete(fn);
}

export function getCount(){ return count; }
