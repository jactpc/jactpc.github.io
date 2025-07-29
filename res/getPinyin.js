/*
*	returns Pinyin for passed character string.
*	String character = the character(s) you wanna get the image to
*	Function callback(result) = function that will be called after getPinyin is done
*/
function getPinyin(character, callback){
    try {
        // Convierte el texto a pinyin con tonos en formato marcas (márcas de tono)
        const pinyin = window.pinyinPro.pinyin(character, { toneType: 'marks', type: 'string' });
        callback(pinyin);
    } catch (e) {
        console.error("Error al obtener pinyin localmente:", e);
        callback(character); // fallback: devuelve el carácter original
    }
}