const clean=(v,max=300)=>String(v??'').trim().slice(0,max);
export default async function handler(req,res){
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false,error:'Method not allowed'})}
  const b=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});
  if(clean(b.website,80))return res.status(200).json({ok:true});
  const age=Number(b.age),city=clean(b.city,120),social=clean(b.social,300),telegram=clean(b.telegram,120),consent=Boolean(b.consent);
  if(!Number.isFinite(age)||age<18||age>99||!city||!social||!telegram||!consent)return res.status(400).json({ok:false,error:'Invalid application'});
  const token=process.env.TELEGRAM_BOT_TOKEN,chatId=process.env.TELEGRAM_CHAT_ID,threadId=process.env.TELEGRAM_THREAD_ID;
  if(!token||!chatId)return res.status(503).json({ok:false,error:'Telegram integration is not configured'});
  const lines=['🌙 Новая кандидатка — LUNE','',`Возраст: ${age}`,`Город / страна: ${city}`,`Instagram / TikTok: ${social}`,`Telegram: ${telegram}`,'',clean(b.utm_source,100)?`Source: ${clean(b.utm_source,100)}`:'',clean(b.utm_campaign,100)?`Campaign: ${clean(b.utm_campaign,100)}`:'',clean(b.utm_content,100)?`Content: ${clean(b.utm_content,100)}`:'',clean(b.referral,100)?`Referral: ${clean(b.referral,100)}`:''].filter(Boolean);
  const payload={chat_id:chatId,text:lines.join('\n'),disable_web_page_preview:true};if(threadId)payload.message_thread_id=Number(threadId);
  try{const tg=await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});const data=await tg.json();if(!tg.ok||!data.ok)throw new Error(data.description||`Telegram HTTP ${tg.status}`);return res.status(200).json({ok:true})}catch(err){console.error('LUNE delivery failed:',err.message);return res.status(502).json({ok:false,error:'Delivery failed'})}
}
