
export default function exportCanvas() {
  const canvas = document.getElementById('canvas');
  const serialiser = new XMLSerializer();
  let source = serialiser.serializeToString(canvas);

  // Add name spaces.
  if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  }

  // Add xml declaration
  source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

  // Convert svg source to URI data scheme.
  const url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);

  //set url value to a element's href attribute.
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'rangoli.svg';
  downloadLink.click();
}