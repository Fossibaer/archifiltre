/**
 * We need to replace the fswin javascript loader as it does not work properly with webpack
 */
import { isWindows } from "./os/os-util";

const loadFsWin = (): any => {
  if (!isWindows()) {
    return {};
  }

  const pathPrefix = MODE === "development" ? "" : "electron/dist";
  // @ts-ignore
  return require(path.join(
    pathPrefix,
    `fswin/electron/${process.arch}/fswin.node`
  ));
};

export default loadFsWin();
