var writers = [];

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

async function updateCharacters() {
  const container = document.getElementById('target');
  container.innerHTML = ''; // limpiar todo antes

  const text = document.querySelector('.js-char').value.trim();
  window.location.hash = encodeURIComponent(text);

  writers = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    // Crea el div para el carácter
    const charDiv = document.createElement('div');
    charDiv.id = `char-${i}`;
    //charDiv.style.width = '120px';
    //charDiv.style.height = '120px';

    // Crea el contenedor que también tendrá los botones
    const charContainer = document.createElement('div');
    charContainer.style.display = 'inline-block';
    charContainer.style.margin = '10px';
    charContainer.style.textAlign = 'center';
    charContainer.style.width = '880px';

    // Añade el div del carácter al contenedor
    charContainer.appendChild(charDiv);

    // Añade el contenedor al contenedor principal
    container.appendChild(charContainer);

    // Ahora el div `char-${i}` está en el DOM, podemos crear el writer
    const writer = HanziWriter.create(charDiv.id, char, {
      width: 880,
      height: 880,
      padding: 5,
      showCharacter: true,
      showOutline: true,
      radicalColor: '#166E16',
      onCorrectStroke: printStrokePoints,
      onMistake: printStrokePoints,
    });
    writers.push(writer);

    // Crear contenedor para botones
    const controlsDiv = document.createElement('div');
    controlsDiv.style.marginTop = '5px';

    // Botón mostrar/ocultar carácter
    const btnToggleChar = document.createElement('button');
    btnToggleChar.innerHTML = '👁'; //textContent = 'Show/Hide';
    btnToggleChar.title = "Show/Hide character";  // <-- Tooltip
    let charVisible = true;
    btnToggleChar.onclick = () => {
      if (charVisible) writer.hideCharacter();
      else writer.showCharacter();
      charVisible = !charVisible;
    };
    controlsDiv.appendChild(btnToggleChar);

    // Botón mostrar/ocultar contorno
    const btnToggleOutline = document.createElement('button');
    btnToggleOutline.innerHTML = '🖋';//.textContent = 'Outline On/Off';
    btnToggleOutline.title = "Show/Hide outline";  // <-- Tooltip
    let outlineVisible = true;
    btnToggleOutline.style.marginLeft = '5px';
    btnToggleOutline.onclick = () => {
      if (outlineVisible) writer.hideOutline();
      else writer.showOutline();
      outlineVisible = !outlineVisible;
    };
    controlsDiv.appendChild(btnToggleOutline);

    // Botón animar
    const btnAnimate = document.createElement('button');
    btnAnimate.innerHTML = '▶️';//.textContent = 'Animate';
    btnAnimate.title = "Animate character";  // <-- Tooltip
    btnAnimate.style.marginLeft = '5px';
    btnAnimate.onclick = () => writer.animateCharacter();
    controlsDiv.appendChild(btnAnimate);

    // Botón quiz
    const btnQuiz = document.createElement('button');
    btnQuiz.innerHTML = '❓';//.textContent = 'Quiz';
    btnQuiz.title = "Quiz yourself";  // <-- Tooltip
    btnQuiz.style.marginLeft = '5px';
    btnQuiz.onclick = () => writer.quiz({ showOutline: true });
    controlsDiv.appendChild(btnQuiz);

    // Añadir controles debajo del carácter
    charContainer.appendChild(controlsDiv);
    
    // === OPCIÓN POR DEFECTO: quiz ===
    writer.quiz({ showOutline: true });

    // Añadir todo al contenedor principal
    container.appendChild(charContainer);
  }

  // Actualizar traducción y pinyin global para todo el texto
  await updateTranslationAndPinyin(text);
}

// Traducción y pinyin
async function fetchTranslation(text) {
  try {
    const response = await fetch(`https://lingva.ml/api/v1/zh/en/${encodeURIComponent(text)}`);
    const data = await response.json();
    return {
      en: data.translation,
      es: (await (await fetch(`https://lingva.ml/api/v1/zh/es/${encodeURIComponent(text)}`)).json()).translation
    };
  } catch (e) {
    return { en: 'Error', es: 'Error' };
  }
}

async function updateTranslationAndPinyin(text) {
  const translationBox = document.getElementById('translations');
  const pinyin = window.pinyinPro.pinyin(text, { toneType: 'marks' });
  const trans = await fetchTranslation(text);
  translationBox.innerHTML = `
    <p><strong>Characters:</strong> ${text}</p>
    <p><strong>Pīnyīn:</strong> ${pinyin}</p>
    <p><strong>Inglés:</strong> ${trans.en}</p>
    <p><strong>Español:</strong> ${trans.es}</p>
  `;
}

window.onload = function () {
  const char = decodeURIComponent(window.location.hash.slice(1));
  if (char) {
    document.querySelector('.js-char').value = char;
  }

  updateCharacters();

  document.querySelector('.js-char-form').addEventListener('submit', function (evt) {
    evt.preventDefault();
    updateCharacters();
  });
};
