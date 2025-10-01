

const $ = (s, r=document)=>r.querySelector(s);
const $$ = (s, r=document)=>[...r.querySelectorAll(s)];
const rand = n=>Math.floor(Math.random()*n);
const pastel = ()=>`rgb(${150+rand(105)},${150+rand(105)},${150+rand(105)})`;

const config = {
  dest: "Paris, France",
  coords: {lat:48.8566, lon:2.3522},
  autoMs: 4000
};

const page = document.body.id;

// ---- HOME ----
if(page==="home"){
  const welcome=$("#welcomeMessage"), timeEl=$("#dateTime");
  setInterval(()=> {
    const d=new Date();
    welcome.textContent=`Welcome to ${config.dest}!`;
    timeEl.textContent=d.toLocaleString();
  },1000);

  $("#bgBtn").onclick=()=>document.body.style.background=pastel();

  const slides=$$(".slide"); let i=0;
  const show=j=>{slides.forEach((s,k)=>s.classList.toggle("active",k===j)); i=j};
  show(0);
  $("#nextBtn").onclick=()=>show((i+1)%slides.length);
  $("#prevBtn").onclick=()=>show((i-1+slides.length)%slides.length);
  setInterval(()=>show((i+1)%slides.length),config.autoMs);

  (async()=>{
    const box=$("#weather");
    try{
      let u=`https://api.open-meteo.com/v1/forecast?latitude=${config.coords.lat}&longitude=${config.coords.lon}&current_weather=true&timezone=auto`;
      let r=await fetch(u), d=await r.json(), w=d.current_weather;
      box.innerHTML=w?`<b>${config.dest}</b><p>${w.temperature}°C, wind ${w.windspeed}km/h</p>`:"No data";
    }catch{ box.textContent="Weather unavailable"; }
  })();
}

// ---- ABOUT ----
if(page==="about"){
  const info=$("#destInfo"), btn=$("#toggleMore"), fact=$("#funFact");
  const dest={name:config.dest,history:"Founded in the 3rd century BC...",culture:"Paris is famous for art, cuisine and fashion.",attractions:["Eiffel Tower","Louvre","Notre-Dame"],extra:"Paris is also known for its cafés and Seine river walks."};
  info.innerHTML=`<h3>History</h3><p>${dest.history}</p>
  <h3>Culture</h3><p>${dest.culture}</p>
  <h3>Attractions</h3><ul>${dest.attractions.map(a=>`<li>${a}</li>`).join("")}</ul>
  <div id=extra style=display:none><p>${dest.extra}</p></div>`;
  btn.onclick=()=>{let e=$("#extra");let s=e.style.display==="none";e.style.display=s?"block":"none";btn.textContent=s?"Show Less":"Show More"};
  const facts=["The Eiffel Tower can grow taller in summer.","Paris was once called Lutetia.","The Louvre is the largest art museum.","Paris has 400+ parks."];
  fact.textContent=facts[rand(facts.length)];
}

// ---- GALLERY ----
if(page==="gallery"){
  const items=$$(".gallery-item"), light=$("#lightbox"), img=$("#lightboxImg"), cap=$("#lightboxCaption");
  $$(".filter-btn").forEach(b=>b.onclick=()=>items.forEach(it=>it.style.display=(b.dataset.filter==="all"||it.dataset.category===b.dataset.filter)?"":"none"));
  items.forEach(it=>{
    const im=it.querySelector("img");
    it.onmouseenter=()=>im.style.transform="scale(1.05)";
    it.onmouseleave=()=>im.style.transform="scale(1)";
    it.onclick=()=>{img.src=im.src; cap.textContent=it.querySelector("figcaption")?.textContent||""; light.style.display="flex"};
  });
  $("#closeLightbox").onclick=()=>light.style.display="none";
  light.onclick=e=>{if(e.target===light) light.style.display="none"};
  document.onkeydown=e=>{if(e.key==="Escape") light.style.display="none"};
}
