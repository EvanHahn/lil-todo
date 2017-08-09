export default function id () {
  return window.btoa(new Date() + Math.random())
}
