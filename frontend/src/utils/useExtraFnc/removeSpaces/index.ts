const removeSpaces = (str: string | undefined | null): string => {
  if(typeof str !== 'string')return '';
  return  str.replace(/\s+/g,""); 
}
export default removeSpaces;