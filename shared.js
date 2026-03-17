
// ═══════════════════════════════════════════════════
//  DECATECH — shared.js  (localStorage persistence)
// ═══════════════════════════════════════════════════

const LS = {
  get: k => { try { return JSON.parse(localStorage.getItem('dct_' + k)); } catch { return null; } },
  set: (k, v) => localStorage.setItem('dct_' + k, JSON.stringify(v)),
};

// ── Default data (only used on first ever load) ──
const DEFAULT_TASKS = [
  {id:'t1',title:'Ana sayfa yeniden tasarımı',desc:'Hero bölümü ve navigasyon mockupları.',col:'todo',tag:'pill-green',priority:'pill-amber',assignee:'MK',created:Date.now()-3*86400000},
  {id:'t2',title:'REST API entegrasyonu',desc:'Kullanıcı ve proje endpointleri bağlanacak.',col:'todo',tag:'pill-violet',priority:'pill-red',assignee:'AY',created:Date.now()-2*86400000},
  {id:'t3',title:'Veritabanı migrasyon scripti',desc:'',col:'todo',tag:'pill-blue',priority:'pill-green',assignee:'CK',created:Date.now()},
  {id:'t4',title:'Raporlama modülü grafikleri',desc:'Recharts ile ilerleme grafikleri.',col:'doing',tag:'pill-blue',priority:'pill-amber',assignee:'EÖ',created:Date.now()-86400000},
  {id:'t5',title:'Push notification sistemi',desc:'Firebase altyapısı.',col:'doing',tag:'pill-violet',priority:'pill-amber',assignee:'AY',created:Date.now()},
  {id:'t6',title:'JWT kimlik doğrulama',desc:'Access & refresh token akışı tamamlandı.',col:'done',tag:'pill-green',priority:'pill-red',assignee:'MK',created:Date.now()-5*86400000},
  {id:'t7',title:'Proje oluşturma sihirbazı',desc:'3 adımlı onboarding akışı.',col:'done',tag:'pill-blue',priority:'pill-green',assignee:'CK',created:Date.now()-4*86400000},
  {id:'t8',title:'Şirket yönetim paneli',desc:'CRUD işlemleri tamamlandı.',col:'done',tag:'pill-amber',priority:'pill-green',assignee:'EÖ',created:Date.now()-6*86400000},
  {id:'t9',title:'E2E test coverage',desc:'Playwright testleri.',col:'doing',tag:'pill-cyan',priority:'pill-red',assignee:'CK',created:Date.now()},
];
const DEFAULT_PROJECTS = [
  {id:'p1',name:'Proje X',color:'#2d5299'},
  {id:'p2',name:'Proje Y',color:'#8b5cf6'},
];
const DEFAULT_MSGS = [
  {id:'m1',from:'Mehmet K.',text:'API tasarımı için toplantı yarın 10:00\'da.',time:'09:15',me:false},
  {id:'m2',from:'Can K.',text:'Raporlama PR\'ı hazır, inceleme bekleniyor.',time:'10:32',me:false},
  {id:'m3',from:'Siz',text:'Harika, öğleden sonra bakacağım 👍',time:'10:45',me:true},
  {id:'m4',from:'Ece Ö.',text:'Bildirim tasarımları Figma\'ya yüklendi.',time:'11:20',me:false},
  {id:'m5',from:'Siz',text:'Teşekkürler! İnceliyorum.',time:'11:22',me:true},
];
const DEFAULT_NOTIFS = [
  {id:'n1',icon:'📋',title:'Yeni görev atandı',body:'"API entegrasyonu" size atandı.',time:'2 saat önce',unread:true},
  {id:'n2',icon:'💬',title:'Yeni mesaj',body:'Mehmet K. size mesaj gönderdi.',time:'3 saat önce',unread:true},
  {id:'n3',icon:'✅',title:'Görev tamamlandı',body:'"JWT kimlik doğrulama" tamamlandı.',time:'Dün',unread:true},
  {id:'n4',icon:'🔔',title:'Proje güncellendi',body:'Proje X zaman çizelgesi güncellendi.',time:'2 gün önce',unread:false},
];

// ── State (loaded from localStorage or defaults) ──
window.ST = {
  get tasks()     { return LS.get('tasks')     || DEFAULT_TASKS; },
  get projects()  { return LS.get('projects')  || DEFAULT_PROJECTS; },
  get msgs()      { return LS.get('msgs')      || DEFAULT_MSGS; },
  get notifs()    { return LS.get('notifs')    || DEFAULT_NOTIFS; },
  get activeProj(){ return LS.get('activeProj')|| 'p1'; },

  setTasks(v)     { LS.set('tasks', v); },
  setProjects(v)  { LS.set('projects', v); },
  setMsgs(v)      { LS.set('msgs', v); },
  setNotifs(v)    { LS.set('notifs', v); },
  setActiveProj(v){ LS.set('activeProj', v); },
};

// ── Helpers ──
window.getProj = () => ST.projects.find(p => p.id === ST.activeProj) || ST.projects[0];

window.TAG_NAMES = {'pill-blue':'Frontend','pill-violet':'Backend','pill-green':'Tasarım','pill-amber':'DevOps','pill-red':'Kritik','pill-cyan':'Araştırma'};
window.PRIO_NAMES = {'pill-green':'Düşük','pill-amber':'Orta','pill-red':'Yüksek'};

// ── Toast ──
window.toast = (msg, type='info') => {
  const icons = {success:'✓',error:'✕',info:'·'};
  let stack = document.getElementById('toastStack');
  if (!stack) { stack = document.createElement('div'); stack.className = 'toast-stack'; stack.id = 'toastStack'; document.body.appendChild(stack); }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span style="font-weight:700">${icons[type]}</span><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.style.opacity='0'; el.style.transform='translateX(12px)'; el.style.transition='.25s'; setTimeout(()=>el.remove(),250); }, 2400);
};

// ── Add notification ──
window.addNotif = (icon, title, body) => {
  const notifs = ST.notifs;
  notifs.unshift({id:'n'+Date.now(),icon,title,body,time:'Az önce',unread:true});
  ST.setNotifs(notifs);
  updateBadge();
};

// ── Update notification badge (call from each page) ──
window.updateBadge = () => {
  const count = ST.notifs.filter(n => n.unread).length;
  const dot = document.getElementById('notifDot');
  const badge = document.getElementById('navBadge');
  if (dot) dot.style.display = count ? 'block' : 'none';
  if (badge) { badge.style.display = count ? 'flex' : 'none'; badge.textContent = count; }
};

// ── Sidebar project list ──
window.renderProjDD = () => {
  const proj = getProj();
  const nameEl = document.getElementById('sidebarProjName');
  const dotEl  = document.getElementById('projColorDot');
  const topEl  = document.getElementById('topbarProjName');
  if (nameEl) nameEl.textContent = proj.name;
  if (dotEl)  dotEl.style.background = proj.color;
  if (topEl)  topEl.textContent = proj.name;
  const list = document.getElementById('projDDList');
  if (list) list.innerHTML = ST.projects.map(p => `
    <div class="pd-item ${p.id===ST.activeProj?'active':''}" onclick="switchProj('${p.id}')">
      <div class="pd-dot" style="background:${p.color}"></div>${p.name}
    </div>`).join('');
};

window.toggleProjDD = () => {
  const dd = document.getElementById('projDD');
  const ch = document.getElementById('projChevron');
  if (dd) dd.classList.toggle('show');
  if (ch) ch.classList.toggle('open');
};

window.switchProj = (id) => {
  ST.setActiveProj(id);
  renderProjDD();
  const dd = document.getElementById('projDD');
  const ch = document.getElementById('projChevron');
  if (dd) dd.classList.remove('show');
  if (ch) ch.classList.remove('open');
  toast(getProj().name + ' seçildi', 'info');
};

// ── Chat render ──
window.renderChat = () => {
  const el = document.getElementById('chatMsgs');
  if (!el) return;
  el.innerHTML = ST.msgs.map(m => `
    <div class="msg-group ${m.me?'mine':''}">
      ${!m.me ? `<div class="msg-sender-name">${m.from}</div>` : ''}
      <div class="msg-bubble ${m.me?'mine':'them'}">${m.text}</div>
      <div class="msg-time">${m.time}</div>
    </div>`).join('');
  el.scrollTop = el.scrollHeight;
};

const BOT_REPLIES = ['Anladım, teşekkürler!','Harika, devam edelim 👍','Bakıyorum şimdi.','Tamam, ilgileneceğim.','Güzel iş!','Bunu not ettim.','👌'];
const BOT_NAMES   = ['Mehmet K.','Can K.','Ece Ö.'];

window.sendMsg = () => {
  const input = document.getElementById('chatInput');
  const text  = input?.value.trim();
  if (!text) return;
  const now = new Date();
  const time = now.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
  const msgs = ST.msgs;
  msgs.push({id:'m'+Date.now(),from:'Siz',text,time,me:true});
  ST.setMsgs(msgs);
  renderChat();
  input.value = '';
  setTimeout(() => {
    const reply  = BOT_REPLIES[Math.floor(Math.random()*BOT_REPLIES.length)];
    const sender = BOT_NAMES[Math.floor(Math.random()*BOT_NAMES.length)];
    const t2 = new Date().toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});
    const msgs2 = ST.msgs;
    msgs2.push({id:'m'+Date.now(),from:sender,text:reply,time:t2,me:false});
    ST.setMsgs(msgs2);
    renderChat();
    addNotif('💬','Yeni mesaj',`${sender}: ${reply}`);
  }, 900 + Math.random()*1400);
};

// ── Kanban card HTML ──
window.taskCardHTML = (t) => `
  <div class="k-card" draggable="true" id="c-${t.id}"
    ondragstart="dstart('${t.id}')" ondragend="dend()">
    <div class="k-card-top">
      <div class="k-card-title">${t.title}</div>
      <div class="k-card-menu">
        <div class="k-menu-btn" onclick="openEditTask('${t.id}')">✎</div>
        <div class="k-menu-btn del" onclick="delTask('${t.id}')">✕</div>
      </div>
    </div>
    ${t.desc ? `<div class="k-card-desc">${t.desc}</div>` : ''}
    <div class="k-card-footer">
      <span class="pill ${t.tag}">${TAG_NAMES[t.tag]||t.tag}</span>
      <span class="pill ${t.priority}">${PRIO_NAMES[t.priority]||t.priority}</span>
      ${t.assignee ? `<div class="k-assignee" title="${t.assignee}">${t.assignee}</div>` : ''}
    </div>
  </div>`;

// ── Drag state ──
window._dragId = null;
window.dstart  = id => { window._dragId = id; setTimeout(()=>{ const e=document.getElementById('c-'+id); if(e) e.classList.add('dragging'); },0); };
window.dend    = () => {
  if (window._dragId) { const e=document.getElementById('c-'+window._dragId); if(e) e.classList.remove('dragging'); }
  window._dragId = null;
  document.querySelectorAll('.k-col').forEach(c=>c.classList.remove('drag-over'));
};
window.dover  = (e,col) => { e.preventDefault(); document.querySelectorAll('.k-col').forEach(c=>c.classList.remove('drag-over')); const ce=document.getElementById('col-'+col); if(ce)ce.classList.add('drag-over'); };
window.dleave = col => { const ce=document.getElementById('col-'+col); if(ce)ce.classList.remove('drag-over'); };
window.ddrop  = (e, col) => {
  e.preventDefault();
  if (!window._dragId) return;
  const tasks = ST.tasks;
  const t = tasks.find(x=>x.id===window._dragId);
  const labels = {todo:'Yapılacak',doing:'Devam Ediyor',done:'Tamamlandı'};
  if (t && t.col !== col) {
    t.col = col; ST.setTasks(tasks);
    toast(`"${t.title}" → ${labels[col]}`, 'success');
    addNotif('📋','Görev taşındı',`"${t.title}" ${labels[col]} sütununa taşındı.`);
  }
  window._dragId = null;
  document.querySelectorAll('.k-col').forEach(c=>c.classList.remove('drag-over'));
  if (typeof renderKanban === 'function') renderKanban();
};

// ── Topbar highlight active nav ──
window.highlightNav = (page) => {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const el = document.getElementById('nav-'+page);
  if (el) el.classList.add('active');
};

// ── User profile (localStorage) ──
window.getUserInfo = () => {
  return LS.get('userinfo') || { name: 'Ahmet Yılmaz', email: 'ahmet@decatech.com', role: 'Proje Yöneticisi' };
};
window.setUserInfo = (info) => {
  LS.set('userinfo', info);
};

// ── Update topbar user display ──
window.renderUserPill = () => {
  const info = getUserInfo();
  const parts = info.name.trim().split(' ');
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[parts.length-1][0]).toUpperCase()
    : info.name.slice(0,2).toUpperCase();
  const nameEl = document.getElementById('userPillName');
  const avEl   = document.getElementById('userPillAv');
  if (nameEl) nameEl.textContent = parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
  if (avEl)   avEl.textContent = initials;
};

// ── Theme toggle ──
window.getTheme = () => localStorage.getItem('dct_theme') || 'dark';

window.applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('dct_theme', theme);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌙';
};

window.toggleTheme = () => {
  const current = getTheme();
  applyTheme(current === 'dark' ? 'light' : 'dark');
};
