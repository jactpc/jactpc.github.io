var writers = [];

function printStrokePoints(data) {
  var pointStrs = data.drawnPath.points.map((point) => `{x: ${point.x}, y: ${point.y}}`);
  console.log(`[${pointStrs.join(', ')}]`);
}

function attachAudioButton(buttonId, text, lang, speed = 1.0) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  btn.onclick = async () => {
    // Guardamos el contenido original del botón (para restaurar luego)
    const originalHTML = btn.innerHTML;

    try {
      btn.disabled = true; // Bloquear botón

      const url = `https://lingva.ml/api/v1/audio/${lang}/${encodeURIComponent(text)}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

      const data = await res.json();
      if (!data.audio) throw new Error("No se recibió audio válido");

      // Convierte el array de bytes a Blob
      const audioBytes = new Uint8Array(data.audio);
      const blob = new Blob([audioBytes], { type: "audio/mpeg" });

      const audio = new Audio(URL.createObjectURL(blob));
      audio.playbackRate = speed;

      // 🎵 Barra de progreso dentro del botón
      audio.addEventListener("timeupdate", () => {
        if (audio.duration > 0) {
          const progress = (audio.currentTime / audio.duration) * 100;
          btn.style.background = `linear-gradient(to right, #4caf50 ${progress}%, #333 ${progress}%)`;
          btn.style.color = "#fff";
          btn.style.border = "none";
        }
      });

      // Cuando termina el audio → restaurar botón
      audio.addEventListener("ended", () => {
        btn.style.background = "";
        btn.style.color = "";
        btn.innerHTML = originalHTML; 
        btn.disabled = false;
      });

      await audio.play();
    } catch (err) {
      console.error("Error reproduciendo audio:", err);

      // Restaurar botón inmediatamente en caso de error
      btn.innerHTML = originalHTML;
      btn.disabled = false;
      btn.style.background = "";

      // Opcional: mensaje visual
      alert("⚠️ No tan rápido campeón. Intenta nuevamente, evita el SPAM.");
    }
  };
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

function renderFanningStrokes(target, strokes) {
  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.width = '75px';
  svg.style.height = '75px';
  svg.style.border = '1px solid #EEE'
  svg.style.marginRight = '3px'
  target.appendChild(svg);
  var group = document.createElementNS('http://www.w3.org/2000/svg', 'g');

  // set the transform property on the g element so the character renders at 75x75
  var transformData = HanziWriter.getScalingTransform(75, 75);
  group.setAttributeNS(null, 'transform', transformData.transform);
  svg.appendChild(group);

  strokes.forEach(function(strokePath) {
    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttributeNS(null, 'd', strokePath);
    // style the character paths
    path.style.fill = '#168F16';
    group.appendChild(path);
  });
}

// 📌 Función auxiliar: obtener radical + variantes
async function getRadicalVariants(char) {
  const radLib = (await import('https://esm.sh/@nahanil/bushou')).default;
  let radical = radLib.for(char) || char;
  if (radical === '*') radical = char;

  const variants = Object.values(radicalVariants).find(arr => arr.includes(radical)) || [radical];
  return Array.from(new Set([...variants, char])).join(' , ');
}

// 📌 Función auxiliar: crear botón con callback
function createButton(id, label, title, className, divText, onClicki) {
  const btn = document.createElement('button');
  btn.id = id; // 👈 aquí le asignamos el id
  btn.title = title;
  btn.className = className;
  btn.onclick = onClicki;

  // Contenido principal del botón (ej: 🔊)
  btn.innerHTML = label;

  // Crear el div interno
  const innerDiv = document.createElement('div');
  innerDiv.className = "btnAudioTx";
  innerDiv.textContent = divText;

  // Insertar el div dentro del botón
  btn.appendChild(innerDiv);

  return btn;
}

async function updateCharacters() {
  const container = document.getElementById('target');
  const submitBtn = document.querySelector('#Update');
  const translationBox = document.getElementById('translations');

  container.innerHTML = ''; // limpiar todo antes
  const texto_full = document.querySelector('.js-char').value.trim();
  let text = texto_full.replace(/[^\u4E00-\u9FFF]/g, '');
  window.location.hash = encodeURIComponent(texto_full);

  // Bloquear botón y mostrar mensaje de carga
  if (submitBtn) submitBtn.disabled = true;
  translationBox.innerHTML = `<p style="color: gray;">⏳ Obteniendo datos...</p>`;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const pinyinChar = window.pinyinPro.pinyin(char, { toneType: 'marks' });

    // === Construcción del bloque ===
    const charContainer = document.createElement('div');
    charContainer.className = "con_hanzi";
    charContainer.id = `con_hanzi_${i}`;

    // Título con el pinyin
    const titleDiv = document.createElement('div');
    titleDiv.className="title_pinyin";
    titleDiv.textContent = `${char} ${pinyinChar}`;// (${transES.es})`;
    charContainer.appendChild(titleDiv);

    const radicalDiv = document.createElement('div');
    radicalDiv.className="radicalDiv";
    // Esperar el resultado de getRadicalVariants
    radicalDiv.textContent = `Radical: ${await getRadicalVariants(char)}`;
    charContainer.appendChild(radicalDiv);

    const btnAudio = createButton(`pinyin_audio_${i}`,"🔊", "Pronunciación normal","btnAudio", "1x");
    btnAudio.id = `pinyin_audio_${i}`;
    charContainer.appendChild(btnAudio);
    container.appendChild(charContainer);
    attachAudioButton(btnAudio.id, char, "zh", 1.0);

    const btnAudioSlow = createButton(`pinyin_audio_slow_${i}`,"🐢", "Pronunciación lenta", "btnAudio", "0.6x");
    btnAudioSlow.id = `pinyin_audio_slow_${i}`;
    charContainer.appendChild(btnAudioSlow);
    container.appendChild(charContainer);
    attachAudioButton(btnAudioSlow.id, char, "zh", 0.6);

    // Div para mostrar RAW
    const raw = document.createElement('div');
    raw.className="hanzi_raw";
    raw.id = `raw_${i}`;
    charContainer.appendChild(raw);

    // Crea el div para el carácter
    const charDiv = document.createElement('div');
    charDiv.className="hanzi-char";
    charDiv.id = `char-${i}`;
    charContainer.appendChild(charDiv);

    // Div para mostrar la puntuación
    const punctuationDiv = document.createElement('div');
    punctuationDiv.className = "punctuation";
    charContainer.appendChild(punctuationDiv);

    // Crear contenedor para botones
    const controlsDiv = document.createElement('div');
    controlsDiv.className = "features_box";
    let characterVisible = true;
    let outlineVisible = true;
        controlsDiv.appendChild(createButton("btnF", "👁", "Mostrar/Ocultar carácter", "btnFeatures", "Show", () => {
      if (characterVisible) {
        writer.hideCharacter();
      } else {
        writer.showCharacter();
      }
      characterVisible = !characterVisible;
    }));

    controlsDiv.appendChild(createButton("btnF", "🖋", "Mostrar/Ocultar contorno", "btnFeatures", "Trazos", () => {
      if (outlineVisible) {
        writer.hideOutline();
      } else {
        writer.showOutline();
      }
      outlineVisible = !outlineVisible;
    }));
    controlsDiv.appendChild(createButton("btnF", "▶️", "Animar carácter", "btnFeatures", "Reproducir", () => writer.animateCharacter()));
    controlsDiv.appendChild(createButton("btnF", "❓", "Quiz yourself", "btnFeatures", "Intentar?", () => writer.quiz({ showOutline: true })));

    charContainer.appendChild(controlsDiv);
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

    let totalStrokes = 0;
    HanziWriter.loadCharacterData(char).then(function(charData) {
      var target = document.getElementById(raw.id);
    totalStrokes = charData.strokes.length;
      for (var i = 0; i < charData.strokes.length; i++) {
        var strokesPortion = charData.strokes.slice(0, i + 1);
        renderFanningStrokes(target, strokesPortion);
      }
    });

    // === Función para calcular el color ===
    function getScoreColor(score) {
      if (score <= 50) {
        // Rojo → Amarillo
        const ratio = score / 50; // 0 a 1
        const r = 255;
        const g = Math.round(0 + (255 * ratio)); // 0 → 255
        return `rgb(${r},${g},0)`;
      } else {
        // Amarillo → Verde
        const ratio = (score - 50) / 50; // 0 a 1
        const r = Math.round(255 - (255 * ratio)); // 255 → 0
        const g = 255;
        return `rgb(${r} ${g} 0 /100%)`;
      }
    }

    // === Quiz con seguimiento por trazo y resumen final ===
    writer.quiz({
      showOutline: true,
      onMistake: function(strokeData) {
        writer.hideOutline();
        charDiv.style.boxShadow = ``,
        punctuationDiv.style.boxShadow = ``,
        punctuationDiv.textContent = `Trazos ${strokeData.quizStartStrokeNum} restantes: ${strokeData.strokesRemaining}, Errores totales: ${strokeData.totalMistakes}`;
      },
      onCorrectStroke: function(strokeData) {
        writer.hideOutline();
        charDiv.style.boxShadow = ``,
        punctuationDiv.style.boxShadow = ``,
        punctuationDiv.textContent = `Trazos restantes: ${strokeData.strokesRemaining}, Errores totales: ${strokeData.totalMistakes}`;
      },
      onComplete: function(summaryData) {
        const mistakes = summaryData.totalMistakes || 0;
        const score = totalStrokes > 0 ? Math.round(((totalStrokes - mistakes) / totalStrokes) * 100) : 0;

        punctuationDiv.textContent = `Has completado el carácter.\n Trazos: ${totalStrokes}\n Errores: ${mistakes}\n Calificación: ${score}%`;

        const bgColor = getScoreColor(score);

        // Aplicar colores dinámicamente
        charDiv.style.boxShadow = `inset 0px 0px 22px 9px ${bgColor}`;
        punctuationDiv.style.boxShadow = `1px 0px 0px 4px ${bgColor}`;
      }

    });
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
    const lines = texto.split("\n"); // Separamos por salto de línea
    let html = "";
    const pinyins = window.pinyinPro.pinyin(texto, { toneType: "marks", type: "array" });

    return texto.split("").map((char, i) => {
      // Verificamos si es un caracter chino
      if (char === "\n") {
        // 🔹 ignoramos saltos de línea completamente
        return `
          <div></div>`;
      }
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
        // Envolvemos cada línea en un DIV independiente
    html += `<div class="hz-line">${lineHtml}</div>`;
  }

  translationBox.innerHTML = `
    <div class="zh">
      <div class="zh_full">
        <strong>简体中文: </strong>
          ${createButton("btnAudio_zhcn", "🔊", "Reproducir pronunciación Chino Tradicional", "btnAudio", "1x").outerHTML}
          ${createButton("btnAudio_zhcn_slow", "🐢", "Reproducir pronunciación Chino Tradicional lento", "btnAudio", "0.6x").outerHTML}
        <div class="zhtxt">${hanziWithPinyinColored(trans.zh_simp, "simp")}</div>

        <strong>繁体中文:</strong>
          ${createButton("btnAudio_zhsimp", "🔊", "Reproducir pronunciación Chino Simplificado", "btnAudio", "1x").outerHTML}
          ${createButton("btnAudio_zhsimp_slow", "🐢", "Reproducir pronunciación Chino Simplificado lento", "btnAudio", "0.6x").outerHTML}
        <div class="zhtxt">${hanziWithPinyinColored(trans.zh_tr, "trad")}</div>    
      </div>
    </div>
    <strong>English: 
        ${createButton("btnAudio_en", "🔊", "Reproducir pronunciación en English", "btnAudio", "1x").outerHTML}
        ${createButton("btnAudio_en_slow", "🐢", "Reproducir pronunciación en English lento", "btnAudio", "0.6x").outerHTML}
    </strong><div class="trans"><p>${trans.en}</p></div>
    <strong>Español: 
        ${createButton("btnAudio_es", "🔊", "Reproducir pronunciación en Spanish", "btnAudio", "1x").outerHTML}
        ${createButton("btnAudio_es_slow", "🐢", "Reproducir pronunciación en Spanish lento", "btnAudio", "0.6x").outerHTML}
    </strong><div class="trans"><p>${trans.es}</p></div>
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
  attachAudioButton("btnAudio_es_slow", trans.es, "es", 0.6);
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
