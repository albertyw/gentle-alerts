// Media imported by script.ts is inlined into the bundle as a data URI, so that
// playing it costs no request and shows no row in the DevTools Network list.
declare module "*.ogg" {
  const dataUri: string;
  export default dataUri;
}

// Stylesheets are imported for their text, not for their usual side effect of
// being added to the document, so that script.ts can inject them itself.
declare module "*.css?raw" {
  const text: string;
  export default text;
}
