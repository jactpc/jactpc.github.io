var writers = [];

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function attachAudioButton(buttonId, text, lang, speed = 1.0) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.addEventListener("click", () => {
    const audio = new Audio(
      `https://translate.google.com/translate_tts?ie=UTF-8&tl=${lang}&client=tw-ob&q=${encodeURIComponent(text)}`
    );
    audio.playbackRate = speed; // velocidad personalizada
    audio.play();
  });
}

async function playLingvaAudio(lang, text, speed = 1.0) {
  const url = `https://lingva.ml/api/v1/audio/${lang}/${encodeURIComponent(text)}`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  // Convierte el array en Uint8Array → Blob
  const audioBytes = new Uint8Array(data.audio);
  const blob = new Blob([audioBytes], { type: 'audio/mpeg' });
  
  const audio = new Audio(URL.createObjectURL(blob));
  audio.playbackRate = speed;
  audio.play();
}

async function updateCharacters() {
  const container = document.getElementById('target');
  container.innerHTML = ''; // limpiar todo antes

  const texto_full = document.querySelector('.js-char').value.trim();

  let text = texto_full.replace(/[^\u4E00-\u9FFF]/g, '');

  window.location.hash = encodeURIComponent(texto_full);

  // Bloquear botón y mostrar mensaje de carga
  const submitBtn = document.querySelector('#Update');
  const translationBox = document.getElementById('translations');
  if (submitBtn) submitBtn.disabled = true;
  translationBox.innerHTML = `<p style="color: gray;">⏳ Obteniendo datos...</p>`;

  writers = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const pinyinChar = window.pinyinPro.pinyin(char, { toneType: 'marks' });

    // Crea el div para el carácter
    const charDiv = document.createElement('div');
    charDiv.className="hanzi-char";
    charDiv.id = `char-${i}`;

    // Título con el pinyin
    const titleDiv = document.createElement('div');
    titleDiv.className="title_pinyin";
    titleDiv.textContent = pinyinChar;
    container.appendChild(titleDiv);

    const titleAudio = document.createElement('button');
    titleAudio.className="pinyin_audio";
    titleAudio.textContent = "🔊98";
    titleAudio.addEventListener("click", () => { playLingvaAudio("zh", char); });
    titleAudio.id=`pinyin_audio_${i}`;
    container.appendChild(titleAudio);

    const titleAudioslow = document.createElement('button');
    titleAudioslow.className="pinyin_audio_slow";
    titleAudioslow.textContent = "🐢";
    titleAudioslow.id=`pinyin_audio_slow_${i}`;
    container.appendChild(titleAudioslow);

    //attachAudioButton(`pinyin_audio_${i}`, char, "zh-CN", 1.0);
    attachAudioButton(`pinyin_audio_slow_${i}`, char, "zh-CN", 0.75);

    // Crea el contenedor que también tendrá los botones
    const charContainer = document.createElement('div');
    charContainer.className="con-hanzi";

    charContainer.appendChild(titleDiv);
    // Añade el div del carácter al contenedor
    charContainer.appendChild(charDiv);

    // Añade el contenedor al contenedor principal
    container.appendChild(charContainer);

    // Ahora el div `char-${i}` está en el DOM, podemos crear el writer
    const writer = HanziWriter.create(charDiv.id, char, {
      width: 800,
      height: 800,
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
    controlsDiv.className = "features_box";

    // Botón mostrar/ocultar carácter
    const btnToggleChar = document.createElement('button');
    btnToggleChar.innerHTML = '👁'; //textContent = 'Show/Hide';
    btnToggleChar.title = "Show/Hide character";  // <-- Tooltip
    btnToggleChar.className = "features";
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
    btnToggleOutline.className = "features";
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
    btnAnimate.className = "features";
    btnAnimate.title = "Animate character";  // <-- Tooltip
    btnAnimate.style.marginLeft = '5px';
    btnAnimate.onclick = () => writer.animateCharacter();
    controlsDiv.appendChild(btnAnimate);

    // Botón quiz
    const btnQuiz = document.createElement('button');
    btnQuiz.innerHTML = '❓';//.textContent = 'Quiz';
    btnQuiz.className = "features";
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
  await updateTranslationAndPinyin(texto_full);

  // Desbloquear botón
  if (submitBtn) submitBtn.disabled = false;
}

// Traducción y pinyin
async function fetchTranslation(texto_full) {
  try {
    const encText = encodeURIComponent(texto_full);

    const urls = [
      `https://lingva.ml/api/v1/zh/en/${encText}`,
      `https://lingva.ml/api/v1/zh/es/${encText}`,
      `https://lingva.ml/api/v1/zh/zh_HANT/${encText}`,
      `https://lingva.ml/api/v1/zh/zh/${encText}`
    ];

    const [enData, esData, zhTrData, zhSimpData] = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    return {
      en: enData.translation,
      es: esData.translation,
      zh_tr: zhTrData.translation,
      zh_simp: zhSimpData.translation
    };
  } catch (e) {
    return { en: 'Error', es: 'Error', zh_tr: 'Error', zh_simp: 'Error' };
  }
}


async function updateTranslationAndPinyin(texto_full) {
  const translationBox = document.getElementById('translations');
  const pinyin = window.pinyinPro.pinyin(texto_full, { toneType: 'marks' });
  const trans = await fetchTranslation(texto_full);

  // Botón de audio (usa Google Translate TTS)
  const audioBt_ZHCN = `
    <button id="btnAudio_zhcn" title="Reproducir pronunciación Chino" style="margin-left: 5px;">🔊</button>
    <button id="btnAudio_zhcn_slow" title="Reproducir pronunciación Chino lento" style="margin-left: 5px;">🐢</button>`;
  const audioBt_EN = `
    <button id="btnAudio_en" title="Reproducir pronunciación en Ingles" style="margin-left: 5px;">🔊</button>
    <button id="btnAudio_en_slow" title="Reproducir pronunciación en Ingles Lento" style="margin-left: 5px;">🐢</button>`;

  translationBox.innerHTML = `
    <p>
      <strong>简体中文:</strong> ${trans.zh_simp}
      ${audioBt_ZHCN}
    </p>
    <p><strong>繁体中文:</strong> ${trans.zh_tr}</p>
    <p><strong>Pīnyīn:</strong> ${pinyin}</p>
    <p><strong>EN:</strong> ${trans.en}
      ${audioBt_EN}
    </p>
    <p><strong>ES:</strong> ${trans.es}</p>
  `;

// Botones de audio normal
attachAudioButton("btnAudio_zhcn", trans.zh_simp, "zh-CN", 1.0);
attachAudioButton("btnAudio_en", trans.en, "en", 1.0);

// Botones de audio lento
attachAudioButton("btnAudio_zhcn_slow", trans.zh_simp, "zh-CN", 0.75);
attachAudioButton("btnAudio_en_slow", trans.en, "en", 0.75);


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
