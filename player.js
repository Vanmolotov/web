(function(){
  /* =========================================================
    MOLOTOV AUDIO PLAYER — BETA v1
    Автор: Van Molotov
    GitHub Pages / Web / Telegram WebApp friendly
    - сохраняет трек/время/громкость (localStorage)
    - live (VK iframe) с кнопкой сворачивания
    - кнопка i: авторские права/некоммерческое использование/удаление по запросу
    ========================================================= */

  const COMMON_COVER = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";

  /* ФОНЫ */
  const PLAYER_BG   = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/sq%20yt1.jpg";
  const PLAYLIST_BG = "https://raw.githubusercontent.com/Vanmolotov/Van-Molotov/main/site%20%281%29.jpg";

  /* Бегущая строка */
  const MARQUEE_TEXT = "SBS HANGOVER 2026 - 2 ЯНВАРЯ - ПЕРМЬ - <b class='mt-mq-link'>КЛИКАЙ СЮДА</b> ЧТОБЫ УЗНАТЬ БОЛЬШЕ";
  const MARQUEE_URL  = "https://sbsrussia.ru";
  const MARQUEE_NEW_TAB = true;

  /* LIVE */
  const LIVE_TITLE = "Последний стрим VK";
  const LIVE_IFRAME_HTML = `
    <iframe
      src="https://vk.com/video_ext.php?oid=-38901360&id=456240842&autoplay=1"
      width="1280"
      height="720"
      style="background-color:#000"
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture; screen-wake-lock;"
      frameborder="0"
      allowfullscreen></iframe>
  `;

  /* ТРЕКИ (Cloud/R2) */
  const TRACKS = [
    { title:"CUTRIN - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Cutrin.mp3" },
    { title:"Maks Solo - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo.mp3" },
    { title:"B-founder - SBS LIVE 2024.", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/B-founder%20-%20SBS%20LIVE%20%40%2030.11.2024.mp3" },
    { title:"BAADWRK - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/BAADWRK%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2026.11.2022.mp3" },
    { title:"Costa - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Costa%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2030.04.2022.mp3" },
    { title:"Maks Solo - SBS LIVE 2022", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo%20-%20SBS%20LIVE%20%40%20Sight%20By%20Sight%2026.11.2022.mp3" },
    { title:"Graved - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Graved.mp3" },
    { title:"Maks Solo - SBS FEST 2025", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Maks%20Solo%20%40%20SBS%20FEST%202025.mp3" },
    { title:"Lowriderz - SBS LIVE 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Lowriderz%20%20-%20SBS%20LIVE%20%40%2030.11.2024.mp3" },
    { title:"Malinoviy John - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Malinoviy%20John.mp3" },
    { title:"Spacexzol - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Spacexzol.mp3" },
    { title:"Dispa - SBS FEST MIX 2024", artist:"Molotov х Sight By Sight", src:"https://pub-d2a415803b364284a1985f355a9cd244.r2.dev/tracks/Dispa.mp3" }
  ];

  const DEFAULT_START_VOLUME = 0.85;
  const AUTONEXT = true;

  /* localStorage keys */
  const LS_PREFIX = "mt_audio_beta_v1:";
  const LS = {
    idx:    LS_PREFIX + "idx",
    time:   LS_PREFIX + "time",
    vol:    LS_PREFIX + "vol",
    wasPlay:LS_PREFIX + "wasPlaying"
  };

  /* Icons */
  const ICONS = {
    play: `<svg viewBox="0 0 24 24"><path d="M8 5v14l12-7z"/></svg>`,
    pause:`<svg viewBox="0 0 24 24"><path d="M6 5h4v14H6zm8 0h4v14h-4z"/></svg>`,
    open: `<svg viewBox="0 0 24 24"><path d="m7.41 10.59 4.59 4.58 4.59-4.58L18 12l-6 6-6-6z"/></svg>`,
    close:`<svg viewBox="0 0 24 24"><path d="m7.41 13.41 4.59-4.58 4.59 4.58L18 12l-6-6-6 6z"/></svg>`,
    prev: `<svg viewBox="0 0 24 24"><path d="M6 6h2v12H6zM20 18 9 12l11-6z"/></svg>`,
    next: `<svg viewBox="0 0 24 24"><path d="M16 6h2v12h-2zM4 18l11-6L4 6z"/></svg>`,
    stop: `<svg viewBox="0 0 24 24"><path d="M6 6h12v12H6z"/></svg>`,
    list: `<svg viewBox="0 0 24 24"><path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/></svg>`,
    info: `<svg viewBox="0 0 24 24"><path d="M11 10h2v7h-2zm0-3h2v2h-2z"/><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>`,
    live: `<svg viewBox="0 0 24 24"><path d="M4 6h16v12H4z"/><path d="M10 9v6l5-3z" fill="#000" opacity=".0"/></svg>`
  };

  function escapeHtml(str){
    return String(str||"")
      .replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;")
      .replaceAll('"',"&quot;").replaceAll("'","&#039;");
  }

  function clamp(n, a, b){ return Math.min(b, Math.max(a, n)); }

  function safeJSONParse(v){
    try{ return JSON.parse(v); }catch(e){ return null; }
  }

  function readLSNumber(key, fallback){
    const raw = localStorage.getItem(key);
    if(raw == null) return fallback;
    const n = parseFloat(raw);
    return isFinite(n) ? n : fallback;
  }

  function writeLS(key, value){
    try{ localStorage.setItem(key, String(value)); }catch(e){}
  }

  function mountPlayer(){
    const root = document.getElementById("mt-player-root");
    if(!root) return false;
    if(root.dataset.mounted === "1") return true;
    root.dataset.mounted = "1";

    const uid = "mtAudio_" + Math.random().toString(16).slice(2);

    /* ===== restore state ===== */
    const savedIdx = clamp(parseInt(localStorage.getItem(LS.idx) || "0", 10) || 0, 0, Math.max(0, TRACKS.length-1));
    const savedTime = Math.max(0, readLSNumber(LS.time, 0));
    const savedVol  = clamp(readLSNumber(LS.vol, DEFAULT_START_VOLUME), 0, 1);
    const savedWasPlaying = (localStorage.getItem(LS.wasPlay) === "1");

    root.innerHTML = `
      <div class="mt-shell" id="${uid}">
        <div class="mt-mini">
          <div class="mt-mini__bg" data-mini-bg></div>
          <div class="mt-mini__row">
            <div class="mt-cover"><img data-mini-cover alt=""></div>
            <button class="mt-ico" data-mini-play type="button" aria-label="Play/Pause">${ICONS.play}</button>
            <button class="mt-ico" data-mini-open type="button" aria-label="Open">${ICONS.open}</button>
          </div>
        </div>

        <div class="mt-fullWrap">
          <div class="mt-playlist" data-playlist>
            <div class="mt-playlist__bg" data-pl-bg></div>

            <div class="mt-marquee" data-marquee>
              <a class="mt-marquee__a" data-marquee-a href="#" rel="noopener">
                <span class="mt-marquee__track" data-marquee-track>
                  <span></span><span></span>
                </span>
              </a>
            </div>

            <div class="mt-playlist__inner" data-pl-inner></div>
          </div>

          <div class="mt-full">
            <div class="mt-full__bg" data-full-bg></div>

            <div class="mt-fullHead">
              <div class="mt-cover"><img data-full-cover alt=""></div>
              <div class="mt-meta">
                <p class="mt-title" data-title>—</p>
                <p class="mt-artist" data-artist>—</p>
              </div>

              <button class="mt-ico" data-live type="button" aria-label="Live">${ICONS.live}</button>
              <button class="mt-ico" data-info type="button" aria-label="Info">${ICONS.info}</button>
              <button class="mt-ico" data-list type="button" aria-label="Playlist">${ICONS.list}</button>
              <button class="mt-ico" data-full-close type="button" aria-label="Close">${ICONS.close}</button>
            </div>

            <div class="mt-body">
              <!-- LIVE PANEL -->
              <div class="mt-live" data-live-panel style="display:none; margin:0 0 12px 0;">
                <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; margin:0 0 10px 0;">
                  <div style="font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.02em;">${escapeHtml(LIVE_TITLE)}</div>
                  <button class="mt-ico" data-live-close type="button" aria-label="Close live">${ICONS.close}</button>
                </div>
                <div class="mt-live__frame" data-live-frame style="position:relative; width:100%; aspect-ratio:16/9; border-radius:14px; overflow:hidden; border:1px solid rgba(255,255,255,.10); background:#000;"></div>
              </div>

              <!-- INFO PANEL -->
              <div class="mt-info" data-info-panel style="display:none; margin:0 0 12px 0; padding:12px; border-radius:14px; border:1px solid rgba(255,255,255,.10); background:rgba(255,255,255,.04);">
                <div style="font-size:12px; font-weight:900; text-transform:uppercase; letter-spacing:.02em; margin:0 0 8px 0;">Информация</div>
                <div style="font-size:12px; line-height:1.4; color:rgba(243,244,246,.85);">
                  Этот плеер используется в некоммерческих целях. Все права на контент принадлежат их правообладателям.
                  Если у правообладателя есть вопросы или запрос на удаление материалов — мы оперативно удалим контент по обращению.
                </div>
              </div>

              <div class="mt-progressRow">
                <div class="mt-bar" data-bar>
                  <div class="mt-fill" data-fill></div>
                  <div class="mt-dot" data-dot></div>
                </div>
                <div class="mt-time" data-time>0:00</div>
              </div>

              <div class="mt-footer">
                <div class="mt-controls">
                  <div class="mt-left">
                    <button class="mt-btn" data-prev type="button" aria-label="Prev">${ICONS.prev}</button>
                    <button class="mt-btn" data-full-play type="button" aria-label="Play/Pause">${ICONS.play}</button>
                    <button class="mt-btn" data-stop type="button" aria-label="Stop">${ICONS.stop}</button>
                    <button class="mt-btn" data-next type="button" aria-label="Next">${ICONS.next}</button>
                  </div>

                  <div class="mt-right">
                    <div class="mt-vol">
                      <span class="mt-vol__label">Vol</span>
                      <input data-vol type="range" min="0" max="1" step="0.01" value="${savedVol}">
                    </div>
                  </div>
                </div>
              </div>

              <audio preload="metadata" playsinline></audio>
            </div>
          </div>
        </div>
      </div>
    `;

    const shell = root.querySelector("#"+uid);
    const audio = shell.querySelector("audio");

    /* elements */
    const miniBg    = shell.querySelector("[data-mini-bg]");
    const miniCov   = shell.querySelector("[data-mini-cover]");
    const miniPlay  = shell.querySelector("[data-mini-play]");
    const miniOpen  = shell.querySelector("[data-mini-open]");

    const fullBg    = shell.querySelector("[data-full-bg]");
    const fullCov   = shell.querySelector("[data-full-cover]");
    const elTitle   = shell.querySelector("[data-title]");
    const elArtist  = shell.querySelector("[data-artist]");
    const fullPlay  = shell.querySelector("[data-full-play]");
    const fullClose = shell.querySelector("[data-full-close]");

    const elBar     = shell.querySelector("[data-bar]");
    const elFill    = shell.querySelector("[data-fill]");
    const elDot     = shell.querySelector("[data-dot]");
    const elTime    = shell.querySelector("[data-time]");

    const btnPrev   = shell.querySelector("[data-prev]");
    const btnNext   = shell.querySelector("[data-next]");
    const btnStop   = shell.querySelector("[data-stop]");
    const btnList   = shell.querySelector("[data-list]");
    const elList    = shell.querySelector("[data-playlist]");
    const plBg      = shell.querySelector("[data-pl-bg]");
    const plInner   = shell.querySelector("[data-pl-inner]");
    const vol       = shell.querySelector("[data-vol]");
    const volWrap   = vol.closest(".mt-vol");

    const btnInfo      = shell.querySelector("[data-info]");
    const infoPanel    = shell.querySelector("[data-info-panel]");
    const btnLive      = shell.querySelector("[data-live]");
    const livePanel    = shell.querySelector("[data-live-panel]");
    const liveFrame    = shell.querySelector("[data-live-frame]");
    const liveCloseBtn = shell.querySelector("[data-live-close]");

    const mqA     = shell.querySelector("[data-marquee-a]");
    const mqTrack = shell.querySelector("[data-marquee-track]");
    const mqSpans = mqTrack ? mqTrack.querySelectorAll("span") : [];

    /* state */
    let idx = savedIdx;
    let restoringTime = savedTime;
    let userInteracted = false;

    audio.volume = savedVol;

    /* backgrounds */
    miniBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    fullBg.style.backgroundImage = PLAYER_BG ? `url("${PLAYER_BG}")` : "none";
    plBg.style.backgroundImage   = PLAYLIST_BG ? `url("${PLAYLIST_BG}")` : "none";

    /* marquee */
    if (mqA && mqSpans && mqSpans.length){
      mqA.href = MARQUEE_URL || "#";
      if (MARQUEE_NEW_TAB) mqA.target = "_blank";
      const txt = (MARQUEE_TEXT || "").trim();
      mqSpans[0].innerHTML = txt;
      mqSpans[1].innerHTML = txt;
    }

    const fmtTime = (s)=>{
      if(!isFinite(s)||s<0) return "0:00";
      const m=Math.floor(s/60), r=Math.floor(s%60);
      return m+":"+String(r).padStart(2,"0");
    };

    function safeSetSrc(url){
      audio.pause();
      audio.currentTime = 0;
      audio.removeAttribute("src");
      audio.load();
      audio.src = url;
      audio.load();
    }

    function setPlayIcons(){
      const icon = audio.paused ? ICONS.play : ICONS.pause;
      miniPlay.innerHTML = icon;
      fullPlay.innerHTML = icon;
    }

    function setOpen(v){
      shell.classList.toggle("is-open", !!v);
      if(!v) elList.classList.remove("is-open");
      // важное: позиция не должна прыгать — CSS решает, JS только класс
    }

    function setInfoOpen(v){
      if(!infoPanel) return;
      infoPanel.style.display = v ? "block" : "none";
    }

    function setLiveOpen(v){
      if(!livePanel || !liveFrame) return;
      if(v){
        // при открытии лайва — ставим радио на паузу
        audio.pause();
        setPlayIcons();
        renderPlaylist();
        elList.classList.remove("is-open");
        setInfoOpen(false);

        livePanel.style.display = "block";
        // вставляем iframe только при открытии (чтобы не грузился всегда)
        liveFrame.innerHTML = LIVE_IFRAME_HTML;
      }else{
        livePanel.style.display = "none";
        // останавливаем воспроизведение лайва, сбрасывая iframe
        liveFrame.innerHTML = "";
      }
    }

    function renderPlaylist(){
      plInner.innerHTML = TRACKS.map((t,i)=>`
        <div class="mt-playlist__item ${i===idx ? 'is-active' : ''}" data-pi="${i}">
          <div class="mt-playlist__left">
            <p class="mt-playlist__t">${escapeHtml((t.title||"—").toUpperCase())}</p>
            <p class="mt-playlist__a">${escapeHtml(t.artist||"—")}</p>
          </div>
          <div class="mt-playlist__badge">${(i===idx && !audio.paused) ? "PLAYING" : "PLAY"}</div>
        </div>
      `).join("");

      plInner.querySelectorAll("[data-pi]").forEach(el=>{
        el.addEventListener("click", ()=>{
          const i = parseInt(el.getAttribute("data-pi"),10);
          setTrack(i, true);
        });
      });
    }

    function setTrack(i, autoplay=false){
      idx = (i + TRACKS.length) % TRACKS.length;
      const t = TRACKS[idx];

      // save idx immediately
      writeLS(LS.idx, idx);

      elTitle.textContent  = (t.title || "—").toUpperCase();
      elArtist.textContent = t.artist || "—";

      miniCov.src = COMMON_COVER;
      fullCov.src = COMMON_COVER;

      safeSetSrc(t.src);

      elFill.style.width="0%";
      elDot.style.left="0%";
      elTime.textContent="0:00";

      // закрываем live при переключении трека
      setLiveOpen(false);

      renderPlaylist();
      setPlayIcons();

      if(autoplay){
        audio.play().then(()=>{
          writeLS(LS.wasPlay, "1");
        }).catch(()=>{});
      }else{
        writeLS(LS.wasPlay, audio.paused ? "0" : "1");
      }
    }

    function updateProgress(){
      const dur=audio.duration||0, cur=audio.currentTime||0;
      const p=dur ? (cur/dur)*100 : 0;
      elFill.style.width=p+"%";
      elDot.style.left=p+"%";
      elTime.textContent=fmtTime(cur);
    }

    async function togglePlay(){
      userInteracted = true;
      // если открыт live — закрываем и играем радио
      setLiveOpen(false);

      if(!audio.src) setTrack(idx,false);
      if(audio.paused){
        try{
          await audio.play();
          writeLS(LS.wasPlay, "1");
        }catch(e){}
      }else{
        audio.pause();
        writeLS(LS.wasPlay, "0");
      }
      setPlayIcons();
      renderPlaylist();
    }

    function togglePlaylist(){
      setLiveOpen(false);
      setInfoOpen(false);
      elList.classList.toggle("is-open");
    }

    /* seek helpers (click + touch-drag) */
    function seekByClientX(clientX){
      const rect = elBar.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const ratio = rect.width ? (x/rect.width) : 0;
      if(isFinite(audio.duration) && audio.duration > 0){
        audio.currentTime = ratio * audio.duration;
      }
    }

    function enableSeekDrag(){
      let dragging = false;

      const onMove = (clientX)=>{
        seekByClientX(clientX);
        updateProgress();
        // сохраняем время сразу при драге
        writeLS(LS.time, audio.currentTime || 0);
      };

      elBar.addEventListener("mousedown", (e)=>{
        dragging = true;
        userInteracted = true;
        onMove(e.clientX);
        e.preventDefault();
      });
      window.addEventListener("mousemove", (e)=>{
        if(!dragging) return;
        onMove(e.clientX);
      });
      window.addEventListener("mouseup", ()=>{
        dragging = false;
      });

      elBar.addEventListener("touchstart", (e)=>{
        if(!e.touches || !e.touches[0]) return;
        dragging = true;
        userInteracted = true;
        onMove(e.touches[0].clientX);
        e.preventDefault();
      }, {passive:false});

      elBar.addEventListener("touchmove", (e)=>{
        if(!dragging) return;
        if(!e.touches || !e.touches[0]) return;
        onMove(e.touches[0].clientX);
        e.preventDefault();
      }, {passive:false});

      elBar.addEventListener("touchend", ()=>{ dragging = false; }, {passive:true});
      elBar.addEventListener("touchcancel", ()=>{ dragging = false; }, {passive:true});
    }

    /* volume touch improve */
    function setVolumeFromClientX(clientX){
      const rect = vol.getBoundingClientRect();
      const x = clamp(clientX - rect.left, 0, rect.width);
      const ratio = rect.width ? (x/rect.width) : 0;
      const v = clamp(ratio, 0, 1);
      vol.value = String(v);
      audio.volume = v;
      writeLS(LS.vol, v);
    }

    function enableVolumeTouch(){
      let draggingVol = false;

      // normal input
      vol.addEventListener("input", ()=>{
        userInteracted = true;
        const v = clamp(parseFloat(vol.value||"0"), 0, 1);
        audio.volume = v;
        writeLS(LS.vol, v);
      });

      // drag on wrapper (touch)
      if(volWrap){
        volWrap.addEventListener("touchstart", (e)=>{
          draggingVol = true;
          userInteracted = true;
          if(e.touches && e.touches[0]) setVolumeFromClientX(e.touches[0].clientX);
        }, {passive:true});

        volWrap.addEventListener("touchmove", (e)=>{
          if(!draggingVol) return;
          if(e.touches && e.touches[0]) setVolumeFromClientX(e.touches[0].clientX);
          e.preventDefault();
        }, {passive:false});

        volWrap.addEventListener("touchend", ()=>{ draggingVol = false; }, {passive:true});
        volWrap.addEventListener("touchcancel", ()=>{ draggingVol = false; }, {passive:true});
      }
    }

    /* events */
    miniPlay.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlay(); });
    miniOpen.addEventListener("click",(e)=>{ e.stopPropagation(); setOpen(true); });

    fullPlay.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlay(); });
    fullClose.addEventListener("click",(e)=>{ e.stopPropagation(); setOpen(false); });

    btnList.addEventListener("click",(e)=>{ e.stopPropagation(); togglePlaylist(); });

    btnInfo.addEventListener("click",(e)=>{
      e.stopPropagation();
      setLiveOpen(false);
      elList.classList.remove("is-open");
      const isOpen = (infoPanel.style.display === "block");
      setInfoOpen(!isOpen);
    });

    btnLive.addEventListener("click",(e)=>{
      e.stopPropagation();
      elList.classList.remove("is-open");
      setInfoOpen(false);
      const isOpen = (livePanel.style.display === "block");
      setLiveOpen(!isOpen);
    });

    if(liveCloseBtn){
      liveCloseBtn.addEventListener("click",(e)=>{
        e.stopPropagation();
        setLiveOpen(false);
      });
    }

    btnStop.addEventListener("click", ()=>{
      audio.pause();
      audio.currentTime = 0;
      updateProgress();
      setPlayIcons();
      renderPlaylist();
      writeLS(LS.time, 0);
      writeLS(LS.wasPlay, "0");
    });

    btnNext.addEventListener("click", ()=> setTrack(idx+1,true));
    btnPrev.addEventListener("click", ()=> setTrack(idx-1,true));

    enableSeekDrag();
    enableVolumeTouch();

    audio.addEventListener("loadedmetadata", ()=>{
      // restore time once for saved track (only on initial load)
      if(isFinite(audio.duration) && audio.duration > 0 && restoringTime > 0){
        const t = clamp(restoringTime, 0, audio.duration - 0.25);
        audio.currentTime = t;
        updateProgress();
      }
      restoringTime = 0;

      // if user previously was playing — we still require user gesture on iOS,
      // so we only auto-play if browser allows it (best effort).
      if(savedWasPlaying){
        audio.play().then(()=>{
          setPlayIcons();
          renderPlaylist();
          writeLS(LS.wasPlay, "1");
        }).catch(()=>{});
      }
    });

    audio.addEventListener("timeupdate", ()=>{
      updateProgress();
      // throttle save
      const now = Date.now();
      if(!audio._mt_lastSave || (now - audio._mt_lastSave) > 700){
        audio._mt_lastSave = now;
        writeLS(LS.time, audio.currentTime || 0);
      }
    });

    audio.addEventListener("play", ()=>{
      setPlayIcons();
      renderPlaylist();
      writeLS(LS.wasPlay, "1");
    });

    audio.addEventListener("pause", ()=>{
      setPlayIcons();
      renderPlaylist();
      writeLS(LS.wasPlay, "0");
    });

    audio.addEventListener("ended", ()=>{
      writeLS(LS.time, 0);
      if(AUTONEXT) setTrack(idx+1,true);
    });

    // persist on hide/close
    const persistNow = ()=>{
      try{
        writeLS(LS.idx, idx);
        writeLS(LS.time, audio.currentTime || 0);
        writeLS(LS.vol, audio.volume || savedVol);
        writeLS(LS.wasPlay, audio.paused ? "0" : "1");
      }catch(e){}
    };
    window.addEventListener("beforeunload", persistNow);
    document.addEventListener("visibilitychange", ()=>{
      if(document.visibilityState === "hidden") persistNow();
    });

    // Telegram WebApp safe
    try{
      const tg = window.Telegram?.WebApp;
      if(tg){
        tg.ready();
        // tg.expand(); // можно включить, если хочешь всегда фуллскрин
      }
    }catch(e){}

    // init
    setOpen(false);
    setInfoOpen(false);
    setLiveOpen(false);
    setTrack(savedIdx, false);
    renderPlaylist();
    setPlayIcons();
    updateProgress();

    return true;
  }

  function run(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(mountPlayer() || tries>80) clearInterval(timer);
    },100);
  }

  document.addEventListener("pointerdown", ()=>{ /* mark gesture */ }, {passive:true});

  if(typeof window.t_onReady==="function") window.t_onReady(run);
  else{
    document.addEventListener("DOMContentLoaded",run);
    window.addEventListener("load",run);
  }
})();
