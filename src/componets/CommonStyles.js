/**
 * Common modal styling used components.
 * @type {{borderColor: string, borderRadius: {sm: number, xs: number, base: number}, bg: string, minH: string, borderWidth: number, maxH: {xl: string, sm: string, base: string}, px: {md: number, base: number}, className: string, borderStyle: string, marginTop: {xl: string, sm: string, base: string}}}
 */
export const ModalContentProps = {
  className: 'dlg-content',
  bg: "#000000",
  borderRadius: {base: 0},  // not working, see css in header/index.css
  borderWidth: 2,
  borderStyle: "solid",
  borderColor: "#262626",
  px: {base: 3, md: 5},
  minH: 'initial',
  // maxH: {base: 'calc(100vh - 30px)', sm: 'calc(100vh - 160px)', xl: 'calc(100vh - 320px)',}
};




