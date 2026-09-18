const $=s=>document.querySelector(s), canvas=$('#canvas'),ctx=canvas.getContext('2d');
let bg=null,textX=640,textY=120,deferredPrompt=null;
function draw(){ctx.clearRect(0,0,1280,720);ctx.fillStyle='#1e293b';ctx.fillRect(0,0,1280,720);
 if(bg){const r=Math.max(1280/bg.width,720/bg.height),w=bg.width*r,h=bg.height*r;ctx.drawImage(bg,(1280-w)/2,(720-h)/2,w,h)}
 const t=$('#titleText').value.trim();if(t){const fs=+$(' #fontSize'.trim()).value;ctx.font='900 '+fs+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.lineJoin='round';ctx.strokeStyle=$('#strokeColor').value;ctx.lineWidth=Math.max(8,fs/9);ctx.strokeText(t,textX,textY);ctx.fillStyle=$('#textColor').value;ctx.fillText(t,textX,textY)}}
function loadImage(src,cors=false){return new Promise((res,rej)=>{const i=new Image();if(cors)i.crossOrigin='anonymous';i.onload=()=>res(i);i.onerror=rej;i.src=src})}
function aiUrl(p,seed){return 'https://image.pollinations.ai/prompt/'+encodeURIComponent(p)+'?width=1280&height=720&seed='+seed+'&nologo=true'}
$('#generate').onclick=async()=>{const p=$('#prompt').value.trim();if(!p)return alert('Najpierw wpisz opis miniatury.');
 const full=p+', '+$('#style').value+' style, '+$('#category').value+' YouTube thumbnail background, 16:9 composition, strong focal subject, room for large title, no text, no watermark';
 const box=$('#variants');box.innerHTML='';$('#status').textContent='Generuję 3 wersje… może to potrwać chwilę.';
 const seed=Math.floor(Math.random()*900000)+10000;
 [0,1,2].forEach((n)=>{const url=aiUrl(full,seed+n*7919),c=document.createElement('div');c.className='card';c.innerHTML='<img src="'+url+'" alt="Wersja '+(n+1)+'"><span>Wersja '+(n+1)+' — dotknij, aby edytować</span>';box.appendChild(c);
 c.onclick=async()=>{try{bg=await loadImage(url,true);draw();document.querySelector('.editor').scrollIntoView({behavior:'smooth'})}catch(e){alert('Generator nie pozwolił wczytać obrazu do edytora. Zapisz wybraną grafikę i użyj pola Wybierz plik.')}}});
 $('#status').textContent='Gotowe — wybierz jedną z trzech wersji.'};
$('#upload').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=async()=>{bg=await loadImage(r.result);draw()};r.readAsDataURL(f)};
['titleText','textColor','strokeColor','fontSize'].forEach(id=>$('#'+id).oninput=draw);
$('#moveLeft').onclick=()=>{textX-=30;draw()};$('#moveRight').onclick=()=>{textX+=30;draw()};$('#moveUp').onclick=()=>{textY-=25;draw()};$('#moveDown').onclick=()=>{textY+=25;draw()};
$('#download').onclick=()=>{draw();const a=document.createElement('a');a.download='youtube-thumbnail.png';a.href=canvas.toDataURL('image/png');a.click()};
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;$('#installBtn').hidden=false});
$('#installBtn').onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();await deferredPrompt.userChoice;deferredPrompt=null;$('#installBtn').hidden=true}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');
draw();