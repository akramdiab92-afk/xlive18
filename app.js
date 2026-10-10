const sampleContent = [
  {id:1,title:"لحظة من يومي",creator:"ليان",kind:"clips",price:"free",duration:"0:18",symbol:"✦",tone:"tone-one",views:"1.2 ألف"},
  {id:2,title:"من خلف الكواليس",creator:"آدم",kind:"clips",price:"paid",duration:"0:32",symbol:"◈",tone:"tone-two",views:"840"},
  {id:3,title:"ألوان المساء",creator:"نور",kind:"clips",price:"free",duration:"0:24",symbol:"☼",tone:"tone-three",views:"2.1 ألف"},
  {id:4,title:"أجواء هادئة",creator:"كريم",kind:"clips",price:"paid",duration:"0:41",symbol:"❋",tone:"tone-four",views:"560"},
  {id:5,title:"تفاصيل صغيرة",creator:"ليان",kind:"clips",price:"free",duration:"0:15",symbol:"❀",tone:"tone-five",views:"930"},
  {id:6,title:"لقطة جديدة",creator:"نور",kind:"clips",price:"paid",duration:"0:29",symbol:"✧",tone:"tone-six",views:"720"},
  {id:7,title:"صباح مختلف",creator:"آدم",kind:"clips",price:"free",duration:"0:21",symbol:"☀",tone:"tone-two",views:"1.7 ألف"},
  {id:8,title:"إطلالة اليوم",creator:"كريم",kind:"clips",price:"paid",duration:"0:36",symbol:"◇",tone:"tone-one",views:"610"},
  {id:9,title:"صورة من الرحلة",creator:"ليان",kind:"photos",price:"free",duration:"",symbol:"▧",tone:"tone-three",views:"430"},
  {id:10,title:"ألبوم خاص",creator:"نور",kind:"photos",price:"paid",duration:"",symbol:"▧",tone:"tone-four",views:"290"}
];
const state = {view:"clips",filter:"all",query:"",creator:"الكل"};
const grid = document.getElementById("contentGrid");
const emptyState = document.getElementById("emptyState");
const filters = document.getElementById("filters");
const creatorStrip = document.getElementById("creatorStrip");
const dialog = document.getElementById("infoDialog");
const dialogContent = document.getElementById("dialogContent");

function cardTemplate(item){
  const price = item.price === "paid" ? '<span class="price paid">مدفوع</span>' : '<span class="price free">مجاني</span>';
  const duration = item.duration ? '<span class="cover-duration">'+item.duration+'</span>' : "";
  const label = item.price === "paid" ? "معاينة" : "محتوى مجاني";
  return '<article class="content-card"><button class="cover '+item.tone+'" data-content="'+item.id+'" aria-label="تفاصيل '+item.title+'"><span class="cover-label">'+label+'</span><span class="cover-art" aria-hidden="true">'+item.symbol+'</span><span class="cover-play" aria-hidden="true">▶</span>'+duration+'</button><div class="card-info"><h3 class="card-title">'+item.title+'</h3><div class="card-bottom"><span class="creator-name">◉ '+item.creator+' · '+item.views+' مشاهدة</span>'+price+'</div></div></article>';
}
function render(){
  let items = sampleContent.filter(item => item.kind === state.view);
  if(state.filter !== "all") items = items.filter(item => item.price === state.filter);
  if(state.creator !== "الكل") items = items.filter(item => item.creator === state.creator);
  if(state.query) {
    const q = state.query.toLocaleLowerCase("ar");
    items = items.filter(item => (item.title+" "+item.creator).toLocaleLowerCase("ar").includes(q));
  }
  grid.innerHTML = items.map(cardTemplate).join("");
  emptyState.classList.toggle("hidden",items.length>0);
  grid.classList.toggle("hidden",items.length===0);
}
function showInfo(title,body,actionLabel){
  dialogContent.innerHTML = '<h3>'+title+'</h3><p>'+body+'</p><div class="dialog-actions"><button class="btn btn-primary" id="dialogOk">'+(actionLabel||"حسناً")+'</button></div>';
  dialog.showModal();
  document.getElementById("dialogOk").addEventListener("click",()=>dialog.close());
}
document.getElementById("confirmAge").addEventListener("click",()=>{
  document.getElementById("ageScreen").classList.add("hidden");
  try{sessionStorage.setItem("xlive18-age-confirmed","yes")}catch(_){}
});
document.getElementById("leaveSite").addEventListener("click",()=>{
  document.getElementById("ageTitle").textContent="يرجى مغادرة الصفحة";
  document.querySelector(".age-card p").textContent="لا يمكنك المتابعة إلى هذه المنصة إذا كان عمرك أقل من 18 عاماً.";
  document.getElementById("confirmAge").disabled=true;
  document.getElementById("confirmAge").style.opacity=".4";
});
try{if(sessionStorage.getItem("xlive18-age-confirmed")==="yes")document.getElementById("ageScreen").classList.add("hidden")}catch(_){}
document.querySelectorAll(".nav-item").forEach(button=>button.addEventListener("click",()=>{
  state.view=button.dataset.view;
  state.filter="all";state.creator="الكل";
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b===button));
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b.dataset.filter==="all"));
  const titles={clips:["المقاطع القصيرة","اكتشف أحدث المحتوى"],photos:["الصور","ألبومات وصور صُنّاع المحتوى"],live:["البث المباشر","البث غير متاح في النسخة الأولية"],messages:["الرسائل","المراسلة الحقيقية ستُفعّل بعد تجهيز الخادم"]};
  document.getElementById("feedTitle").textContent=titles[state.view][0];
  document.getElementById("feedSubtitle").textContent=titles[state.view][1];
  filters.classList.toggle("hidden",state.view!=="clips"&&state.view!=="photos");
  creatorStrip.classList.toggle("hidden",state.view==="messages");
  if(state.view==="live"||state.view==="messages"){
    grid.innerHTML="";
    emptyState.classList.remove("hidden");
    grid.classList.add("hidden");
    emptyState.querySelector("h3").textContent=state.view==="live"?"البث المباشر قيد التجهيز":"الرسائل قيد التجهيز";
    emptyState.querySelector("p").textContent="هذه الميزة تحتاج إلى خادم وقاعدة بيانات آمنين. لم يتم تفعيلها في الواجهة الأولية.";
    return;
  }
  emptyState.querySelector("h3").textContent="ما لقينا نتائج";
  emptyState.querySelector("p").textContent="جرّب كلمة بحث ثانية أو غيّر التصفية.";
  render();
}));
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  state.filter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  render();
}));
document.getElementById("searchInput").addEventListener("input",event=>{state.query=event.target.value.trim();render()});
creatorStrip.addEventListener("click",event=>{
  const button=event.target.closest("[data-creator]");
  if(!button)return;
  state.creator=button.dataset.creator;
  document.getElementById("feedTitle").textContent=state.creator==="الكل"?"المقاطع القصيرة":"محتوى "+state.creator;
  render();
});
grid.addEventListener("click",event=>{
  const button=event.target.closest("[data-content]");
  if(!button)return;
  const item=sampleContent.find(entry=>entry.id===Number(button.dataset.content));
  if(!item)return;
  const body=item.price==="paid"?"هذه بطاقة تجريبية لمحتوى مدفوع. لا توجد عملية شراء أو ملفات مدفوعة فعلية في هذه النسخة.":"هذه بطاقة توضيحية فقط. تشغيل المقاطع الفعلية سيُضاف بعد إعداد تخزين فيديو مناسب وآمن.";
  showInfo(item.title,body,"رجوع للتصفح");
});
document.getElementById("uploadButton").addEventListener("click",()=>showInfo("إضافة محتوى","رفع الصور والمقاطع غير مفعّل بعد. قبل تفعيله سنحتاج إلى تسجيل دخول آمن، تخزين ملفات مناسب، وحد مراجعة إدارية قبل النشر.","فهمت"));
document.getElementById("profileButton").addEventListener("click",()=>showInfo("الملف الشخصي","إنشاء الحسابات وتعديل الملف الشخصي يحتاج إلى قاعدة بيانات وخادم آمن. لم نطلب أي بيانات شخصية في هذه النسخة.","حسناً"));
document.getElementById("closeDialog").addEventListener("click",()=>dialog.close());
render();