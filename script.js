(function(){
  // Starfield: fixed full-page canvas, sparse stars, slow drift + scroll parallax by depth
  var c=document.getElementById('stars'); if(!c) return;
  var ctx=c.getContext('2d'), stars=[], W,H, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, dpr=Math.min(devicePixelRatio||1,2);
  function size(){W=c.width=innerWidth*dpr;H=c.height=innerHeight*dpr;
    stars=[];var n=Math.round(innerWidth*innerHeight/7000);
    for(var i=0;i<n;i++){var d=Math.random();stars.push({x:Math.random()*W,y:Math.random()*H,r:(.25+d*1.1)*dpr,a:.12+d*.55,v:(.015+d*.05)*dpr,px:.03+d*.14,t:Math.random()*6.28});}}
  function draw(ts){ctx.clearRect(0,0,W,H);var sy=scrollY*dpr;
    for(var i=0;i<stars.length;i++){var s=stars[i];var tw=reduce?1:(.78+.22*Math.sin(ts/1100+s.t));
      var y=(s.y-sy*s.px)%H; if(y<0)y+=H;
      ctx.globalAlpha=s.a*tw;ctx.fillStyle='#dfe6df';ctx.beginPath();ctx.arc(s.x,y,s.r,0,6.28);ctx.fill();
      if(!reduce){s.y+=s.v;if(s.y>H)s.y-=H;}}
    ctx.globalAlpha=1; if(!reduce) requestAnimationFrame(draw); }
  size(); addEventListener('resize',size); requestAnimationFrame(draw);
  if(reduce) addEventListener('scroll',function(){draw(0)},{passive:true});
})();

(function(){
  // Mission elapsed time since page open, formatted HHH:MM:SS like the cockpit timer
  var el=document.getElementById('met'); if(!el) return;
  var t0=Date.now();
  function pad(n,l){n=String(n);while(n.length<l)n='0'+n;return n;}
  setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);
    el.textContent=pad(Math.floor(s/3600),3)+':'+pad(Math.floor(s%3600/60),2)+':'+pad(s%60,2);},1000);
})();

(function(){
  // VERB / NOUN cycles through plausible Apollo-style program codes
  var v=document.getElementById('verb'), n=document.getElementById('noun'); if(!v||!n) return;
  var codes=[[16,38],[6,62],[37,0],[25,04],[21,33],[83,68],[16,64],[50,18]], i=0;
  setInterval(function(){i=(i+1)%codes.length;
    v.textContent=(codes[i][0]<10?'0':'')+codes[i][0]; n.textContent=(codes[i][1]<10?'0':'')+codes[i][1];},4200);
})();

(function(){
  // YouTube facade: load the iframe only on click
  document.querySelectorAll('.yt').forEach(function(box){
    var btn=box.querySelector('.yt-play'); if(!btn) return;
    btn.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+box.dataset.id+'?autoplay=1&rel=0';
      f.allow='accelerometer; autoplay; encrypted-media; picture-in-picture'; f.allowFullscreen=true; f.title='Official Gameplay Trailer';
      box.innerHTML=''; box.appendChild(f);
    });
  });
})();

(function(){
  var els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);}})},{rootMargin:'0px 0px -8% 0px'});
  els.forEach(function(e){io.observe(e)});
})();

(function(){
  // Make sure muted loop clips actually run once they scroll into view (some browsers defer off-screen autoplay)
  var vids=document.querySelectorAll('video[autoplay]'); if(!vids.length) return;
  function kick(v){var p=v.play(); if(p&&p.catch) p.catch(function(){});}
  if(!('IntersectionObserver' in window)){vids.forEach(kick);return;}
  var io=new IntersectionObserver(function(en){en.forEach(function(x){ if(x.isIntersecting) kick(x.target); else x.target.pause(); });},{rootMargin:'120px 0px'});
  vids.forEach(function(v){io.observe(v)});
})();

(function(){
  // FDAI: horizon pitches with page progress, rolls with scroll velocity; LOG shows the section in view
  var el=document.getElementById('fdai'); if(!el) return;
  var ball=document.getElementById('fdBall'), pr=document.getElementById('fdPitch'), lg=document.getElementById('fdLog');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, pitch=30, roll=0, vel=0, lastY=scrollY, lastTxt='';
  function prog(){var m=document.documentElement.scrollHeight-innerHeight;return m>0?Math.min(1,Math.max(0,scrollY/m)):0;}
  function frame(){
    var target=30-90*prog(); pitch+=(target-pitch)*(reduce?1:.12);
    var y=scrollY, dv=y-lastY; lastY=y; vel=vel*.82+dv*.18;
    var rt=Math.max(-16,Math.min(16,vel*.14)); roll+=(rt-roll)*(reduce?1:.1);
    ball.setAttribute('transform','rotate('+roll.toFixed(2)+' 50 50) translate(0 '+(pitch*.9).toFixed(2)+')');
    var d=Math.round(pitch), txt=(d<0?'-':'+')+(Math.abs(d)<10?'0':'')+Math.abs(d);
    if(txt!==lastTxt){lastTxt=txt;pr.textContent=txt;}
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  el.addEventListener('click',function(){scrollTo({top:0,behavior:reduce?'auto':'smooth'});});
  var secs=document.querySelectorAll('[data-log]');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting)lg.textContent=x.target.dataset.log;})},{rootMargin:'-45% 0px -50% 0px'});
    secs.forEach(function(s){io.observe(s)});
  }
})();
