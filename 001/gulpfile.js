function hello(cb) {
  console.log("Hello, gulp!");
  cb();
}

function world(callback) {
  console.log("Hello, world!");
  callback();
}

export default hello;
export { world };
