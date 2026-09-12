// Stylesheets are imported for their text, not for their usual side effect of
// being added to the document, so that script.ts can inject them itself.
declare module "*.css?raw" {
  const text: string;
  export default text;
}
