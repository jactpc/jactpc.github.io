var writers = [];

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function attachAudioButton(buttonId, text, lang, speed = 1.0) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.addEventListener("click", async () => {
    try {
      btn.disabled = true; // Bloquear botón

      const url = `https://lingva.ml/api/v1/audio/${lang}/${encodeURIComponent(text)}`;
      const res = await fetch(url);
      const data = await res.json();

      // Convierte el array de bytes a Blob
      const audioBytes = new Uint8Array(data.audio);
      const blob = new Blob([audioBytes], { type: "audio/mpeg" });

      const audio = new Audio(URL.createObjectURL(blob));
      audio.playbackRate = speed;

      audio.addEventListener("ended", () => {
        btn.disabled = false; // Reactivar botón
      });

      await audio.play();
    } catch (err) {
      console.error("Error reproduciendo audio:", err);
      btn.disabled = false; // Reactivar en caso de error
    }
  });
}

// Traducción
async function fetchTranslation(texto_full, targets = ["en", "es", "zh_HANT", "zh"]) {
  try {
    const encText = encodeURIComponent(texto_full);

    // Construir las URLs dinámicamente según los targets
    const urls = targets.map(lang => 
      `https://lingva.ml/api/v1/zh/${lang}/${encText}`
    );

    // Ejecutar en paralelo
    const results = await Promise.all(
      urls.map(url => fetch(url).then(res => res.json()))
    );

    // Armar el objeto de salida
    const out = {};
    targets.forEach((lang, i) => {
      if (lang === "zh") out.zh_simp = results[i].translation;
      else if (lang === "zh_HANT") out.zh_tr = results[i].translation;
      else out[lang] = results[i].translation;
    });

    return out;
  } catch (e) {
    return { en: "Error", es: "Error", zh_tr: "Error", zh_simp: "Error" };
  }
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

    const radicalVariants = {
      '一': ['一'],
      '丨': ['丨'],
      '丶': ['丶'],
      '丿': ['丿','乀','乁'], 
      '乙': ['乙','乚','乛'],
      '亅': ['亅'],
      '二': ['二'],
      '亠': ['亠'],
      '人': ['人','亻'],
      '儿': ['儿'],
      '入': ['入'],
      '八': ['八','丷'],
      '冂': ['冂'],
      '冖': ['冖'],
      '冫': ['冫'],
      '几': ['几','𠃌'],
      '凵': ['凵'],
      '刀': ['刀','刂','刁'],
      '力': ['力'],
      '勹': ['勹'],
      '匕': ['匕'],
      '匚': ['匚'],
      '匸': ['匸'],
      '十': ['十'],
      '卜': ['卜'],
      '卩': ['卩'],
      '厂': ['厂'],
      '厶': ['厶'],
      '又': ['又'],
      '口': ['口','囗'],
      '土': ['土'],
      '士': ['士'],
      '夂': ['夂'],
      '夊': ['夊'],
      '夕': ['夕'],
      '大': ['大'],
      '女': ['女'],
      '子': ['子'],
      '宀': ['宀'],
      '寸': ['寸'],
      '小': ['小','⺌','⺍'],
      '尢': ['尢'],
      '尸': ['尸'],
      '屮': ['屮'],
      '山': ['山'],
      '巛': ['川','巛'],
      '工': ['工'],
      '己': ['己'],
      '巾': ['巾'],
      '干': ['干'],
      '幺': ['幺'],
      '广': ['广'],
      '廴': ['廴'],
      '廾': ['廾'],
      '弋': ['弋'],
      '弓': ['弓'],
      '彐': ['彐','彑'],
      '彡': ['彡'],
      '彳': ['彳'],
      '心': ['心','忄'],
      '戈': ['戈'],
      '戶': ['戶','户'],
      '手': ['手','扌'],
      '支': ['支'],
      '攴': ['攴','夂'],
      '文': ['文'],
      '斗': ['斗'],
      '斤': ['斤'],
      '方': ['方'],
      '无': ['无','旡',],
      '日': ['日'],
      '曰': ['曰'],
      '月': ['月'],
      '木': ['木','朩'],
      '欠': ['欠'],
      '止': ['止'],
      '歹': ['歹'],
      '殳': ['殳'],
      '毋': ['毋'],
      '比': ['比'],
      '毛': ['毛'],
      '氏': ['氏'],
      '气': ['气'],
      '水': ['水','氵','氺'],
      '火': ['火','灬'],
      '爪': ['爪','爫'],
      '父': ['父'],
      '爻': ['爻'],
      '爿': ['爿'],
      '片': ['片'],
      '牙': ['牙'],
      '牛': ['牛','牜','⺧'],
      '犬': ['犬','犭'],
      '玄': ['玄'],
      '玉': ['玉','王'],
      '瓜': ['瓜'],
      '瓦': ['瓦'],
      '甘': ['甘'],
      '生': ['生'],
      '用': ['用'],
      '田': ['田'],
      '疋': ['疋','𤴔'],
      '疒': ['疒'],
      '癶': ['癶'],
      '白': ['白'],
      '皮': ['皮'],
      '皿': ['皿'],
      '目': ['目'],
      '矛': ['矛'],
      '矢': ['矢'],
      '石': ['石'],
      '示': ['示','礻'],
      '禸': ['禸'],
      '禾': ['禾'],
      '穴': ['穴'],
      '立': ['立'],
      '竹': ['竹','⺮','ケ'],
      '米': ['米'],
      '糸': ['糸','纟'],
      '缶': ['缶'],
      '网': ['网','罒','罓'],
      '羊': ['羊','⺶','⺷'],
      '羽': ['羽'],
      '老': ['老','耂'],
      '而': ['而'],
      '耒': ['耒'],
      '耳': ['耳'],
      '聿': ['聿'],
      '肉': ['肉','⺼'],
      '臼': ['臼'],
      '舌': ['舌'],
      '舛': ['舛'],
      '舟': ['舟'],
      '艮': ['艮'],
      '色': ['色'],
      '艸': ['艹'],
      '虍': ['虍'],
      '虫': ['虫'],
      '血': ['血'],
      '行': ['行'],
      '衣': ['衣','衤'],
      '襾': ['襾','西'],
      '见': ['见'],
      '角': ['角'],
      '言': ['言','訁'],
      '谷': ['谷'],
      '豆': ['豆'],
      '豕': ['豕'],
      '豸': ['豸'],
      '貝': ['貝'],
      '赤': ['赤'],
      '走': ['走'],
      '足': ['足'],
      '身': ['身'],
      '車': ['車'],
      '辛': ['辛'],
      '辰': ['辰'],
      '辵': ['辶'],
      '邑': ['邑','阝'],
      '酉': ['酉'],
      '釆': ['釆'],
      '里': ['里'],
      '金': ['金','钅'],
      '長': ['長'],
      '門': ['門'],
      '阜': ['阜','⻏'],
      '隶': ['隶'],
      '隹': ['隹'],
      '雨': ['雨'],
      '青': ['青'],
      '非': ['非'],
      '面': ['面'],
      '革': ['革'],
      '韋': ['韋'],
      '韭': ['韭'],
      '音': ['音'],
      '頁': ['頁'],
      '風': ['風'],
      '飛': ['飛'],
      '食': ['食','饣'],
      '首': ['首'],
      '香': ['香'],
      '馬': ['馬'],
      '骨': ['骨'],
      '高': ['高'],
      '髟': ['髟'],
      '鬥': ['鬥','门'],
      '鬯': ['鬯'],
      '鬲': ['鬲'],
      '鬼': ['鬼'],
      '魚': ['魚'],
      '鳥': ['鳥'],
      '鹵': ['鹵'],
      '鹿': ['鹿'],
      '麥': ['麥'],
      '麻': ['麻'],
      '黃': ['黃'],
      '黍': ['黍'],
      '黑': ['黑'],
      '黹': ['黹'],
      '黽': ['黽'],
      '鼎': ['鼎'],
      '鼓': ['鼓'],
      '鼠': ['鼠'],
      '鼻': ['鼻'],
      '齊': ['齊'],
      '齒': ['齒'],
      '龍': ['龍'],
      '龜': ['龜'],
      '龠': ['龠']
    };

    async function showRadical(char) {
      const radLib = (await import('https://esm.sh/@nahanil/bushou')).default;
      let radical = radLib.for(char);  // Ej: 亻

      if (radical === '*' || !radical) {
        radical = char; // si no lo reconoce, usamos el mismo carácter
      }

      // Buscar variantes conocidas
      const variants = Object.values(radicalVariants).find(arr => arr.includes(radical)) || [radical];

      // Siempre incluir el carácter buscado dentro de la lista de variantes
      const allVariants = Array.from(new Set([...variants, char]));

      // Mostrar en consola
      console.log(`Carácter: ${char}, Radicales: ${radical}, Variantes: ${allVariants.join(' , ')}`);

      // Retornar como string
      return allVariants.join(' , ');
    }

    // Crea el div para el carácter
    const charDiv = document.createElement('div');
    charDiv.className="hanzi-char";
    charDiv.id = `char-${i}`;

    //const transES = await fetchTranslation(char, ["es"]);

    // Título con el pinyin
    const titleDiv = document.createElement('div');
    titleDiv.className="title_pinyin";
    titleDiv.textContent = `${char} ${pinyinChar}`;// (${transES.es})`;
    container.appendChild(titleDiv);

    const radicalDiv = document.createElement('div');
    radicalDiv.className="radicalDiv";
    // Esperar el resultado de showRadical
    const { radical, example } = await showRadical(char);
    radicalDiv.textContent = `Radical: ${await showRadical(char)}`;
    container.appendChild(radicalDiv);

    const titleAudio = document.createElement('button');
    titleAudio.className="pinyin_audio";
    titleAudio.textContent = "🔊 1x";
    titleAudio.id=`pinyin_audio_${i}`;
    container.appendChild(titleAudio);

    const titleAudioslow = document.createElement('button');
    titleAudioslow.className="pinyin_audio_slow";
    titleAudioslow.textContent = "🐢 0.6x";
    titleAudioslow.id=`pinyin_audio_slow_${i}`;
    container.appendChild(titleAudioslow);

    attachAudioButton(`pinyin_audio_${i}`, char, "zh", 1.0);
    attachAudioButton(`pinyin_audio_slow_${i}`, char, "zh", 0.6);

    // Crea el contenedor que también tendrá los botones
    const charContainer = document.createElement('div');
    charContainer.className="con-hanzi";

    // Añade el div del carácter al contenedor
    charContainer.appendChild(charDiv);

    // Añade el contenedor al contenedor principal
    container.appendChild(charContainer);

    // Ahora el div `char-${i}` está en el DOM, podemos crear el writer
    const writer = HanziWriter.create(charDiv.id, char, {
      width: 700,
      height: 700,
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

async function updateTranslationAndPinyin(texto_full) {
  const trans = await fetchTranslation(texto_full);
  const translationBox = document.getElementById('translations');
  const pinyin = window.pinyinPro.pinyin(texto_full, { toneType: 'marks' });

  // Botón de audio (usa Google Translate TTS)
  const audioBt_ZHsimp = `
    <button id="btnAudio_zhsimp" class="btnAudio" title="Reproducir pronunciación Chino Tradicional">🔊<div class ="btnAudioTx"> 1x</div></button>
    <button id="btnAudio_zhsimp_slow" class="btnAudio" title="Reproducir pronunciación Chino Tradicional lento">🐢<div class ="btnAudioTx"> 0.6x</div></button>`;
  const audioBt_ZHCN = `
    <button id="btnAudio_zhcn" class="btnAudio" title="Reproducir pronunciación Chino Simplificado">🔊<div class ="btnAudioTx"> 1x</div></button>
    <button id="btnAudio_zhcn_slow" class="btnAudio" title="Reproducir pronunciación Chino Simplificado lento">🐢<div class ="btnAudioTx"> 0.6x</div></button>`;
  const audioBt_EN = `
    <button id="btnAudio_en" class="btnAudio" title="Reproducir pronunciación en Ingles">🔊<div class ="btnAudioTx"> 1x</div></button>
    <button id="btnAudio_en_slow" class="btnAudio" title="Reproducir pronunciación en Ingles Lento"">🐢<div class ="btnAudioTx"> 0.6x</div></button>`;
  const audioBt_ES = `
    <button id="btnAudio_es" class="btnAudio" title="Reproducir pronunciación en Español">🔊<div class ="btnAudioTx"> 1x</div></button>`;
  
  const toneColors = {
    1: "blue",    // Primer tono (¯)
    2: "green",   // Segundo tono (´)
    3: "orange",  // Tercer tono (ˇ)
    4: "red",     // Cuarto tono (`)
    0: "gray",     // Neutro (sin marca)
    5: "black"
  };

  function getTone(pinyin) {
    if (/[āēīōūǖ]/.test(pinyin)) return 1;
    if (/[áéíóúǘ]/.test(pinyin)) return 2;
    if (/[ǎěǐǒǔǚ]/.test(pinyin)) return 3;
    if (/[àèìòùǜ]/.test(pinyin)) return 4;
    return 0;
  }

function hanziWithPinyinColored(texto, prefix) {
  const pinyins = window.pinyinPro.pinyin(texto, { toneType: "marks", type: "array" });

  return texto.split("").map((char, i) => {
    // Verificamos si es un caracter chino
    if (!/[\u4E00-\u9FFF]/.test(char)) {
      // si no es chino, lo dejamos tal cual (sin pinyin)
      return `
        <div class="hz-pairx">
          <span class="hanzi" style="color:${toneColors['5']}">${char}</span>
          <span class="pinyin" style="color:${toneColors['5']}">${char}</span>
        </div>`;
    }

    const py = pinyins[i] || "";
    const tone = getTone(py);
    const color = toneColors[tone];
    const id = `${prefix}-${i}`;

    return `
      <div class="hz-pair" id="${id}-audio">
        <span class="hanzi" style="color:${color}">${char}</span>
        <span class="pinyin" style="color:${color};">${py}</span>
      </div>
    `;
  }).join("");
}

  translationBox.innerHTML = `
    <div class="zh">
      <div class="zh_full">
        <strong>简体中文: </strong>${audioBt_ZHsimp}
        <div class="zhtxt">${hanziWithPinyinColored(trans.zh_simp, "simp")}</div>

        <strong>繁体中文:</strong>${audioBt_ZHCN}
        <div class="zhtxt">${hanziWithPinyinColored(trans.zh_tr, "trad")}</div>    
      </div>
    </div>
    <strong>English: ${audioBt_EN}</strong><div class="trans"><p>${trans.en}</p></div>
    <strong>Español: ${audioBt_ES}</strong><div class="trans"><p>${trans.es}</p></div>
  `;


// Para simplificado
trans.zh_simp.split("").forEach((char, i) => {
  const id = `simp-${i}-audio`;
  attachAudioButton(id, char, "zh", 1.0);
});

// Para tradicional
trans.zh_tr.split("").forEach((char, i) => {
  const id = `trad-${i}-audio`;
  attachAudioButton(id, char, "zh_HANT", 1.0);
});

  // Botones de audio normal
  attachAudioButton("btnAudio_zhcn", trans.zh_simp, "zh_HANT", 1.0);
  attachAudioButton("btnAudio_zhsimp", trans.zh_simp, "zh", 1.0);
  attachAudioButton("btnAudio_en", trans.en, "en", 1.0);
  attachAudioButton("btnAudio_es", trans.es, "es", 1.0);

  // Botones de audio lento
  attachAudioButton("btnAudio_zhsimp_slow", trans.zh_simp, "zh", 0.6);
  attachAudioButton("btnAudio_zhcn_slow", trans.zh_simp, "zh_HANT", 0.6);
  attachAudioButton("btnAudio_en_slow", trans.en, "en", 0.6);
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
