declare var feather: {
  replace: () => void,
  icons: Record<string, {
    name: string,
    contents: string,
    tags: string[],
    attrs: Record<string, any>,
    toSvg: (options?: any) => string,
  }>,
};