const __DEV__ = false;

export const dev = {
    dev: true,
    server_base: 'http://localhost:3000/api/',
    linking: {
        schema: 'codingninjas'
    },
    isStatic: false
};

//const prod = { ...dev, server_base:'http://192.241.209.82:8080/'};
export const prod = { ...dev, server_base:'http://localhost:3000/api/', dev: false};

if (!__DEV__ && false) {
  /* eslint-disable no-console */
  console.log =
  console.info =
  console.error =
  console.warn =
  console.debug =
  console.trace = () => {};
  /* eslint-enable no-console */
}

export default __DEV__ ? dev : prod;
