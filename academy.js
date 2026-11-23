"use strict";
/* ================= Ойлау академиясы: FEMO-ға дайындық әдістемесі =================
   Әр арал — бір ойлау тәсілі. Жол: 1) Көрсетемін (сабақ) → 2) Бірге (қадамдап жаттығу)
   → 3) Өзің (нақты FEMO есептері, жеңілден қиынға) → 4) Сынақ турлары. */
const STRATS=[
{id:"draw",b:"|·|",c:"var(--t1)",name:"Сызып көр",power:"Суретші-ойшыл",
 magic:"Мұны суретпен көрсетсем қалай болады?",
 idea:["Көп есеп сурет салғанда оп-оңай шешіледі.","Ағашты — таяқша, баланы — дөңгелек етіп сыз.","Абай бол: 5 ағаштың арасында 4 ғана аралық бар!"],
 ex:{q:"Жол бойында 5 ағаш тұр. Көрші ағаштардың арасы 2 м. Бірінші мен соңғы ағаштың арасы неше метр?",
  steps:["Сызамыз:  | — | — | — | — |","5 ағаштың арасында 4 аралық бар","4 · 2 = 8"],ans:"8 м"},
 warm:[
  {q:"Таяқты 4 бөлікке бөлу үшін неше рет кесу керек?",steps:[{t:"Сызып көр: ——|——|——|——. Неше кесу сызығы бар?",a:3}],e:"4 бөлік үшін 3 кесу жеткілікті."},
  {q:"Қатарда 6 бала тұр. Әр екі көрші баланың арасына бір қуыршақ қойды. Неше қуыршақ қойды?",steps:[{t:"● ● ● ● ● ● — 6 баланың арасында неше аралық?",a:5}],e:"6 баланың арасында 5 аралық, демек 5 қуыршақ."},
  {q:"1-қабаттан 4-қабатқа көтерілу үшін неше саты-аралық жүру керек?",steps:[{t:"1→2, 2→3, 3→4. Неше «секіріс»?",a:3}],e:"4 − 1 = 3 аралық."}],
 ids:["s21-4","s22-3","s26-4","f26-3","w21-3","r21-1","a20b-1","s24-3","w21b-8","w24-6","w22-5","f22-11","w26-5","f23-7","w24-7","d19-8","f23-5","s24-10"]},

{id:"shape",b:"▲",c:"var(--t3)",name:"Фигураларды сана",power:"Көреген көз",
 magic:"Ең кішкене бөліктен бастап, ретімен санайын!",
 idea:["Алдымен ең кішкене фигураларды сана.","Сосын екеуден, үшеуден құралғандарын ізде.","Ең үлкенін ұмытпа! Периметр — фигураны айнала жүргендегі жол."],
 ex:{q:"Бір қатарда 3 шаршы тұр: ▢▢▢. Барлығы неше тіктөртбұрыш бар?",
  steps:["Жалғыз шаршылар: 3","Екеуден құралғандар: 2","Үшеуден құралғаны: 1","3 + 2 + 1 = 6"],ans:"6"},
 warm:[
  {q:"Квадраттың қабырғасы 5 см. Периметрі неше см?",steps:[{t:"Квадраттың неше қабырғасы бар?",a:4},{t:"Бәрі 5 см: 4 · 5 = ?",a:20}],e:"Периметр — барлық қабырғалардың қосындысы: 20 см."},
  {q:"Бір қатарда 4 шаршы тұр: ▢▢▢▢. Неше тіктөртбұрыш бар?",steps:[{t:"Жалғыз шаршылар?",a:4},{t:"Екеуден құралғандар?",a:3},{t:"Үшеуден?",a:2},{t:"Төртеуден?",a:1},{t:"Барлығы: 4 + 3 + 2 + 1 = ?",a:10}],e:"Ретімен санасаң, ештеңе қалмайды: 10."}],
 ids:["s21-1","r21-2","s22-4","w21b-2","w22-8","s26-5","f23-1","a20-3","s26-1","f22-5","f26-2","w24-1","s23-3","s22-1","w21b-1","f24-3","w21-5","f22-9","w26-6","f26-6","a20-7","a20b-4"]},

{id:"twice",b:"◐",c:"var(--t6)",name:"Екі рет санама",power:"Әділ санаушы",
 magic:"Біреуін екі рет санап қойған жоқпын ба?",
 idea:["Екі топ қиылысса, ортасындағылар екі рет саналады.","Сондықтан: бірінші топ + екінші топ − екеуінде де барлар.","Сызып көр: екі шеңбер, ортасы ортақ."],
 ex:{q:"8 бала ән салады, 6 бала би билейді, 3 бала екеуін де істейді. Неше бала ән не би айналысады?",
  steps:["8 + 6 = 14","3 бала екі рет саналды","14 − 3 = 11"],ans:"11"},
 warm:[
  {q:"Әжесі 5 бұтаны, атасы 4 бұтаны суарды. 2 бұтаны екеуі де суарды. Неше бұта суарылды?",steps:[{t:"5 + 4 = ?",a:9},{t:"Екі рет саналғанын алып таста: 9 − 2 = ?",a:7}],e:"Ортақ бұталарды бір-ақ рет санаймыз: 7."},
  {q:"10 баланың 6-сы алма, 7-сі алмұрт жеді. Әр бала кемінде біреуін жеді. Неше бала екеуін де жеді?",steps:[{t:"6 + 7 = ?",a:13},{t:"Балалардан қаншаға артық? 13 − 10 = ?",a:3}],e:"Артық саналған 3 бала — екеуін де жегендер."}],
 ids:["a20b-3","s21-2","s24-2","w26-3","f24-4","s23-7","r21-6","s22-6","w21b-7","f23-8","a20b-7"]},

{id:"equal",b:"=",c:"var(--t5)",name:"Теңестір",power:"Әділ бөлуші",
 magic:"Соңында әрқайсында неше болды? Сол жерден бастайын!",
 idea:["Біреуі екіншісіне беріп, тең болса —","алдымен соңын тап: барлығын 2-ге бөл.","Сосын бергенін қайтарып қос."],
 ex:{q:"Екі қорапта 20 кәмпит. Біріншіден екіншіге 3 кәмпит салғанда, тең болды. Біріншіде неше болған?",
  steps:["Соңында әрқайсында: 20 : 2 = 10","Бірінші 3 берген, демек бұрын: 10 + 3 = 13"],ans:"13"},
 warm:[
  {q:"Екі себетте 12 алма. Біріншіден екіншіге 2 алма салғанда, тең болды. Біріншіде неше алма болған?",steps:[{t:"Соңында әрқайсында: 12 : 2 = ?",a:6},{t:"Бірінші 2 берген: 6 + 2 = ?",a:8}],e:"Бірінші себетте 8 алма болған."},
  {q:"Аяда 9 кәмпит, Данада 5 кәмпит. Ая Данаға неше кәмпит берсе, тең болады?",steps:[{t:"Барлығы: 9 + 5 = ?",a:14},{t:"Әрқайсына: 14 : 2 = ?",a:7},{t:"Ая береді: 9 − 7 = ?",a:2}],e:"Ая 2 кәмпит береді, екеуінде де 7 болады."}],
 ids:["d19-4","s24-1","f22-6","s26-6","r21-5","s22-7"]},

{id:"back",b:"←",c:"var(--t2)",name:"Кері жол",power:"Уақыт машинасы",
 magic:"Соңынан бастап, артқа қарай жүрсем ше?",
 idea:["Есеп соңын айтса — артқа қарай жүр.","«Жеді», «берді» → кері қайтарғанда қос.","«Қосты», «мінді» → ал. «Жартысы» → екі есе көбейт."],
 ex:{q:"Айназда бірнеше кәмпит болды. Ол 4 кәмпит жеді, сосын анасы 3 кәмпит берді. Енді 10. Басында неше?",
  steps:["Соңы: 10","Анасы 3 берді → кері: 10 − 3 = 7","4 жеді → кері: 7 + 4 = 11"],ans:"11"},
 warm:[
  {q:"Мен бір сан ойладым, оған 5 қостым, 12 шықты. Қандай сан ойладым?",steps:[{t:"Кері жүр: 12 − 5 = ?",a:7}],e:"7 + 5 = 12 — тексердік!"},
  {q:"Автобуста бірнеше адам болды. 3 адам түсті, 5 адам мінді. Енді 10 адам. Басында неше болды?",steps:[{t:"5 адам мінгенін кері қайтар: 10 − 5 = ?",a:5},{t:"3 адам түскенін кері қайтар: 5 + 3 = ?",a:8}],e:"Басында 8 адам болған."},
  {q:"Тоқаштардың жартысын жеді, 6 тоқаш қалды. Басында неше тоқаш болды?",steps:[{t:"Жартысы 6 болса, бүтіні: 6 + 6 = ?",a:12}],e:"Басында 12 тоқаш."}],
 ids:["w21-7","w21b-6","w26-8","f22-14","f24-8"]},

{id:"age",b:"+1",c:"var(--t4)",name:"Жас есептері",power:"Уақыт білгірі",
 magic:"Бір жыл өткенде ӘРКІМ бір жасқа үлкейеді!",
 idea:["Уақыт өткенде бәрі бірдей үлкейеді.","Сондықтан жас айырмасы ешқашан өзгермейді!","Ал жастардың қосындысы әр жыл сайын адам санына өседі."],
 ex:{q:"Айназ 7 жаста, ағасы 10 жаста. 3 жылдан кейін жас айырмасы қанша?",
  steps:["Қазір: 10 − 7 = 3","3 жылдан кейін: 13 − 10 = 3","Айырма өзгермейді!"],ans:"3"},
 warm:[
  {q:"Ая 6 жаста, анасы 30 жаста. 5 жылдан кейін анасы Аядан неше жас үлкен?",steps:[{t:"Айырма өзгермейді: 30 − 6 = ?",a:24}],e:"Әрқашан 24 жас айырма."},
  {q:"Екі ағайынды бірге 10 жаста. 2 жылдан кейін бірге неше жаста болады?",steps:[{t:"Әрқайсы 2 жасқа үлкейеді: 2 + 2 = ?",a:4},{t:"10 + 4 = ?",a:14}],e:"Екі адам — қосынды әр жылы 2-ге өседі."},
  {q:"Апасы сіңлісінен 2 жас үлкен. Бірге 12 жаста. Сіңлісі неше жаста?",steps:[{t:"Апасының артығын алып таста: 12 − 2 = ?",a:10},{t:"Екіге бөл: 10 : 2 = ?",a:5}],e:"Сіңлісі 5, апасы 7: 5 + 7 = 12."}],
 ids:["a20-2","s22-2","a20b-6","w21-9","w22-6","a20-6","f26-7","w21b-9","s26-7","s23-10"]},

{id:"scale",b:"=?",c:"var(--t3)",name:"Таразы әдісі",power:"Дана таразы",
 magic:"Бірдейлерін алып тастасам, не қалады?",
 idea:["Таразының екі жағынан бірдей затты алсаң, ол тең болып қала береді.","Бағада да солай: екі тапсырысты салыстыр.","Айырмасы — артық заттың бағасы."],
 ex:{q:"Алма мен алмұрт бірге 9 теңге. 2 алма мен 1 алмұрт 13 теңге. Бір алма қанша?",
  steps:["Екінші тапсырыста бір алма артық","13 − 9 = 4"],ans:"4 теңге"},
 warm:[
  {q:"3 қалам 1 қаламнан 20 теңгеге қымбат. Бір қалам қанша?",steps:[{t:"3 қалам − 1 қалам = неше қалам?",a:2},{t:"2 қалам 20 теңге. 1 қалам: 20 : 2 = ?",a:10}],e:"Бір қалам 10 теңге."},
  {q:"Мысық пен ит бірге 9 кг. Мысық пен қоян бірге 5 кг. Ит қояннан неше кг ауыр?",steps:[{t:"Мысық екеуінде де бар — оны алып таста: 9 − 5 = ?",a:4}],e:"Ит қояннан 4 кг ауыр."}],
 ids:["f24-1","w24-2","w21b-5","w22-7","f23-6","w21-6","s21-5","w26-9","f24-7","d19-7","a20-8","s22-5","w21-10","w22-9","f26-5","f26-8"]},

{id:"group",b:"×",c:"var(--t1)",name:"Топтарға бөл",power:"Командир",
 magic:"Неше топ бар? Әр топта неше?",
 idea:["Бірдей топтар болса — көбейт немесе бөл.","Парта — 2 орынды топ, жұп — 2, команда — бірнеше адам.","Сызып көр: топтарды шеңберге ал."],
 ex:{q:"6 партада 2-ден бала отыр, тағы 1 бала жалғыз отыр. Неше бала?",
  steps:["6 · 2 = 12","12 + 1 = 13"],ans:"13"},
 warm:[
  {q:"4 себетте 5-тен алма бар. Барлығы неше алма?",steps:[{t:"4 · 5 = ?",a:20}],e:"4 топ, әрқайсында 5: 20."},
  {q:"18 баланы 3 командаға теңдей бөлді. Әр командада неше бала?",steps:[{t:"18 : 3 = ?",a:6}],e:"Әр командада 6 бала."},
  {q:"8 партада 15 бала отыр (әр партада 1 не 2 бала). Неше партада бір ғана бала?",steps:[{t:"8 партада барлығы неше орын? 8 · 2 = ?",a:16},{t:"Неше орын бос? 16 − 15 = ?",a:1}],e:"Бір орын бос, демек 1 партада жалғыз бала."}],
 ids:["w21-1","f26-4","s23-2","f22-3","a20-1","d19-5","a20b-9","s24-6","s23-4","s21-8","w24-4","w24-5","f22-10","f22-13","s24-8","f24-9","s23-8","f22-12","w24-10"]},

{id:"pattern",b:"1·2·3",c:"var(--t5)",name:"Заңдылықты тап",power:"Құпия ашушы",
 magic:"Сандар қалай өзгеріп жатыр? Айырмасын жазайын!",
 idea:["Тізбекте көршілердің айырмасын жаз.","Айырмалардың өзі де заңдылық құрайды.","Кестеде әр жолдың, әр бағанның қосындысын тап — сол кілт!"],
 ex:{q:"2, 5, 8, 11, … келесі сан қандай?",steps:["Айырма: +3, +3, +3","11 + 3 = 14"],ans:"14"},
 warm:[
  {q:"10, 8, 6, 4, … келесі сан қандай?",steps:[{t:"Әр жолы неше азаяды?",a:2},{t:"4 − 2 = ?",a:2}],e:"Әр қадам −2."},
  {q:"1, 2, 4, 7, 11, … келесі сан қандай?",steps:[{t:"Айырмалар: 1, 2, 3, 4. Келесі айырма?",a:5},{t:"11 + 5 = ?",a:16}],e:"Айырмалар бір-бірлеп өседі."},
  {q:"Сандар 3, 7, 3, 7, … кезектеседі. 10-шы сан қандай?",steps:[{t:"Жұп орындарда (2, 4, 6…) қай сан тұр?",a:7}],e:"10 — жұп орын, онда 7."}],
 ids:["a20-5","w26-1","r21-3","s21-3","w21-8","s24-5","f24-2","f22-15","r21-7","f26-10"]},

{id:"logic",b:"?!",c:"var(--t6)",name:"Логика детективі",power:"Детектив",
 magic:"Кесте сызып, «ЖОҚ» дегенді белгілейін!",
 idea:["Кім қайда, кім не істеді — кесте сыз.","«Ол емес» деген жерге ✗ қой.","Бір ғана бос орын қалса — жауап сол! Өтірік пен шындықта: «ол шын айтса, не болады?» деп тексер."],
 ex:{q:"Ая, Бота, Дана — мысық, ит, балық. Аяда мысық жоқ. Ботада ит те, мысық та жоқ. Аяда не бар?",
  steps:["Бота: мысық та, ит те емес → балық","Ая: мысық емес, балық Ботада → ит","Дана: мысық"],ans:"ит"},
 warm:[
  {q:"Үш дос 1, 2, 3 орын алды. Асан бірінші емес, Бек — үшінші. Асан нешінші орын алды?",steps:[{t:"3-орын Бекте, 1-орын Асанда емес. Асан нешінші?",a:2}],e:"Бос қалған жалғыз орын — 2."},
  {q:"Бүгін сейсенбі. Ертеңнің ертеңі қай күн?",steps:[{t:"Ертең қай күн?",opts:["Сәрсенбі","Бейсенбі","Жұма"],a:"Сәрсенбі"},{t:"Ертеңнің ертеңі?",opts:["Сәрсенбі","Бейсенбі","Жұма"],a:"Бейсенбі"}],e:"Сейсенбі → сәрсенбі → бейсенбі."}],
 ids:["f22-4","w21-2","w22-1","w21b-4","f26-1","s21-7","r21-8","r21-10","a20b-8","f23-9","s23-9","f26-9","w22-3","f24-10"]},

{id:"digit",b:"0–9",c:"var(--t2)",name:"Цифрлар әлемі",power:"Сан шебері",
 magic:"Ең үлкен (кіші) сан үшін қай цифр бірінші тұруы керек?",
 idea:["Сан цифрлардан құралады: жүздіктер, ондықтар, бірліктер.","Ең үлкен сан — үлкен цифр алда.","Ең кіші сан — кіші цифр алда, бірақ 0 бірінші тұрмайды!"],
 ex:{q:"3, 0, 5 цифрларынан ең кіші үштаңбалы сан?",steps:["0 бірінші тұра алмайды → 3","Сосын ең кішісі: 0, сосын 5","305"],ans:"305"},
 warm:[
  {q:"Ең кіші үштаңбалы сан мен ең үлкен екітаңбалы санның айырмасы қанша?",steps:[{t:"Ең кіші үштаңбалы сан?",a:100},{t:"Ең үлкен екітаңбалы сан?",a:99},{t:"100 − 99 = ?",a:1}],e:"Айырма — 1."},
  {q:"4, 1, 7 цифрларынан ең үлкен үштаңбалы сан құра.",steps:[{t:"Ең үлкен цифр алда тұрады. Бірінші цифр?",a:7},{t:"Енді бүкіл санды жаз:",a:741}],e:"Үлкеннен кішіге: 741."},
  {q:"27 санының цифрларының қосындысы қанша?",steps:[{t:"2 + 7 = ?",a:9}],e:"Цифрлар қосындысы — әр цифрды бөлек қосу: 9."}],
 ids:["d19-1","w22-2","s23-1","f23-2","s26-2","a20b-5","s26-3","f22-2","w22-4","r21-4","f22-8","s21-10","w21b-10","s24-7","s26-10","f24-6","a20-4","s22-10","s26-8"]},

{id:"count",b:"1,2…",c:"var(--t4)",name:"Ретімен сана",power:"Мұқият санаушы",
 magic:"Ештеңе қалмас үшін ретімен жазып шығайын!",
 idea:["«Неше тәсіл?», «Неше сан?» деген сұрақта","бәрін тізімге ретімен жаз: кішіден үлкенге.","Сонда ештеңе қалмайды, ештеңе қайталанбайды."],
 ex:{q:"Цифрларының қосындысы 3 болатын екітаңбалы сандар неше?",steps:["Ондығы 1: 12","Ондығы 2: 21","Ондығы 3: 30","Барлығы 3 сан"],ans:"3"},
 warm:[
  {q:"1, 2, 3 цифрларынан (қайталамай) неше екітаңбалы сан құрауға болады?",steps:[{t:"1-ден басталатындар: 12, 13. Неше?",a:2},{t:"2-ден де, 3-тен де екеуден: 2 + 2 + 2 = ?",a:6}],e:"12, 13, 21, 23, 31, 32 — 6 сан."},
  {q:"10-нан 20-ға дейін (екеуін қоса) неше сан бар?",steps:[{t:"20 − 10 + 1 = ?",a:11}],e:"Екі шетін де санаймыз, сондықтан +1."},
  {q:"3-тен 12-ге дейінгі сандарды жазу үшін неше цифр керек?",steps:[{t:"3-тен 9-ға дейін неше біртаңбалы сан?",a:7},{t:"10, 11, 12 — әрқайсында 2 цифр. Барлығы?",a:6},{t:"7 + 6 = ?",a:13}],e:"13 цифр керек."}],
 ids:["f22-1","w24-3","a20b-2","f23-4","w26-4","w21b-3","s22-8","s23-6","s21-6","w24-9","s26-9","s21-9","s24-9","w26-7","r21-9","w22-10","f23-10"]},

{id:"worst",b:"!",c:"var(--hero)",name:"Ең сәтсіз жағдай",power:"Батыл ойшыл",
 magic:"Маған ең сәтсіздік келсе, не болар еді?",
 idea:["«Міндетті түрде», «ең кемі» деген сөздер болса —","ең сәтсіз жағдайды елестет: керек емес заттар бірінші шығып тұр.","Сосын тағы біреуін қос — енді міндетті түрде шығады!"],
 ex:{q:"Қапшықта 3 қызыл, 3 көк шар. Міндетті түрде бір қызыл шар болуы үшін ең кемі неше шар алу керек?",
  steps:["Ең сәтсіз: алдымен 3 көк шықты","Тағы біреу — міндетті түрде қызыл","3 + 1 = 4"],ans:"4"},
 warm:[
  {q:"Қорапта 5 сары, 2 жасыл қарындаш. Міндетті түрде жасыл қарындаш шығуы үшін ең кемі неше алу керек?",steps:[{t:"Ең сәтсіз: алдымен барлық сарылар шықты. Неше?",a:5},{t:"Тағы біреуі: 5 + 1 = ?",a:6}],e:"6 қарындаш алсаң, біреуі міндетті түрде жасыл."},
  {q:"Қапшықта қызыл және көк шарлар көп. Бірдей түсті 2 шар міндетті түрде болуы үшін ең кемі неше шар алу керек?",steps:[{t:"Ең сәтсіз: әр түстен біреуден. Неше шар?",a:2},{t:"Тағы біреуі: 2 + 1 = ?",a:3}],e:"3-шісі міндетті түрде бір түспен қайталанады."}],
 ids:["a20-9","s24-4","w24-8","f22-7"]},

{id:"rebus",b:"AB",c:"var(--t5)",name:"Ребус",power:"Шифр шешуші",
 magic:"Қай әріптің мүмкіндігі ең аз? Содан бастайын!",
 idea:["Ребуста әр әріп — бір цифр.","Ең үлкен разрядтан баста: қосынды 2000-нан сәл үлкен болса, бірінші әріп 1 не 2 ғана.","Табылғанын қойып, тексеріп көр!"],
 ex:{q:"A + A = 14. A неге тең?",steps:["Екі бірдей сан 14 береді","14 : 2 = 7"],ans:"7"},
 warm:[
  {q:"□ + □ + □ = 12 (бірдей сандар). □ = ?",steps:[{t:"12 : 3 = ?",a:4}],e:"4 + 4 + 4 = 12."},
  {q:"AB + BA = 33, A мен B — әртүрлі, нөл емес цифрлар, A < B. AB санын тап.",steps:[{t:"AB + BA = 11 · (A + B). A + B = 33 : 11 = ?",a:3},{t:"A < B, нөл емес: AB = ?",a:12}],e:"12 + 21 = 33."}],
 ids:["s22-9","d19-9","s23-5","w26-10","f24-5","d19-10","a20-10"]}
];
const SMAP={};STRATS.forEach((s,i)=>{s.i=i;s.qs=s.ids.map(id=>FQ[id]).filter(Boolean);s.qs.forEach(q=>SMAP[q.id]=s)});
FEMO_Q.forEach(q=>{if(!SMAP[q.id]){const s=STRATS.find(x=>x.id==="group");s.qs.push(q);SMAP[q.id]=s}});
if(!P.ac)P.ac={};
const acS=s=>P.ac[s.id]||(P.ac[s.id]={});
const stSolved=s=>s.qs.filter(q=>P.femo[q.id]>=2).length;
const stStars=s=>{const a=acS(s);if(!(a.lesson&&a.warm))return 0;const n=stSolved(s),N=s.qs.length;return n>=N?3:n>=Math.ceil(N/2)?2:1};
const stReady=s=>{const a=acS(s);return a.lesson&&a.warm&&stSolved(s)>=Math.min(3,s.qs.length)};
const stOpen=s=>s.i===0||P.acOpenAll||stReady(STRATS[s.i-1])||stStars(s)>0;
function stCurrent(){return STRATS.find(s=>stOpen(s)&&(!stReady(s)||stSolved(s)<Math.ceil(s.qs.length*.6)))||STRATS.find(s=>stSolved(s)<s.qs.length)||STRATS[0]}
const acDone=()=>STRATS.filter(s=>stStars(s)>=2).length;

BADGES.push({id:"acFirst",t:"Алғашқы арал",d:"Бірінші ойлау тәсілін меңгер"},{id:"acHalf",t:"Жарты жол",d:"7 аралды 2 жұлдызға өт"},{id:"acAll",t:"Ойлау академигі",d:"Барлық 14 аралды өт"});

/* ---------- Үкі-ұстаз ---------- */
const OWL=`<svg viewBox="0 0 120 120" aria-hidden="true"><ellipse cx="60" cy="70" rx="40" ry="42" fill="#8B6A4E" stroke="var(--ink)" stroke-width="4"/><ellipse cx="60" cy="82" rx="24" ry="26" fill="#F4E1C1" stroke="var(--ink)" stroke-width="3"/><path d="M26 36l10 16M94 36l-10 16" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/><circle cx="44" cy="56" r="15" fill="#fff" stroke="var(--ink)" stroke-width="4"/><circle cx="76" cy="56" r="15" fill="#fff" stroke="var(--ink)" stroke-width="4"/><circle cx="46" cy="57" r="6" fill="var(--ink)"/><circle cx="74" cy="57" r="6" fill="var(--ink)"/><circle cx="48" cy="55" r="2" fill="#fff"/><circle cx="76" cy="55" r="2" fill="#fff"/><path d="M54 70l6 8 6-8z" fill="var(--sun)" stroke="var(--ink)" stroke-width="3" stroke-linejoin="round"/><path d="M28 30h64l-8-12H36z" fill="var(--ink)"/><rect x="52" y="10" width="16" height="10" fill="var(--ink)"/><path d="M90 26l10 14" stroke="var(--hero)" stroke-width="4" stroke-linecap="round"/></svg>`;
const say=(t,big)=>`<div class="owlsay ${big?"lg":""}"><div class="owl">${OWL}</div><div class="bubble">${t}</div></div>`;

/* ---------- Академия басты беті ---------- */
window.femoHome=function(){
  screen="academy";
  const cur=stCurrent(),n=fSolved(),N=FEMO_Q.length,rk=fRank(n),w=fWrong(),dq=fDaily(),dd=fDailyDone(),done=acDone();
  const ca=acS(cur),step=!ca.lesson?"Сабақ: жаңа тәсілмен танысамыз":!ca.warm?"Бірге жаттығамыз":"Олимпиада есептері: 4 есеп";
  go(`${topbar({back:1,title:"FEMO олимпиадасы"})}
  ${say(`<b>Сәлем, Айназ! Мен — Үкі-ұстаз.</b> Олимпиада есептерінің әрқайсында құпия тәсіл бар. Әр аралда бір тәсілді үйренеміз. 14 аралдан өтсең — сен нағыз олимпиадашысың!`,true)}
  <button class="panel today" id="today" style="--c:${cur.c}">
    <span class="tbadge" style="background:${cur.c}">${esc(cur.b)}</span>
    <span class="tdm"><small>Бүгінгі сабақ · 20 минут</small><b>${cur.i+1}-арал: ${esc(cur.name)}</b><em>${step}</em></span>
    <span class="go">Бастау</span></button>
  <div class="chips">
    <div class="chip">${ICUP}<b>${esc(rk[1])}</b><span>олимпиада атағы</span></div>
    <div class="chip"><b class="cnum">${done}/14</b><span>арал өтілді</span></div>
    <div class="chip"><b class="cnum">${n}/${N}</b><span>есеп шешілді</span></div>
  </div>
  <h2 class="sec">Ойлау аралдары</h2>
  <div class="isles">${STRATS.map(s=>{const op=stOpen(s),st=stStars(s),sv=stSolved(s);
    return `<button class="isle ${op?"":"lock"} ${s===cur?"cur":""}" data-s="${s.id}">
      <span class="tbadge" style="background:${op?s.c:"var(--lock)"}">${op?esc(s.b):"—"}</span>
      <span class="im"><small>${s.i+1}-арал</small><b>${esc(s.name)}</b>
      <span class="fns">${[0,1,2].map(k=>I.star(k<st?"var(--sun)":"var(--paper)")).join("")}<em>${sv}/${s.qs.length}</em></span></span></button>`}).join("")}</div>
  <div class="fact">
    <button class="fcard fday ${dd?"done":""}" id="fDay"><span class="fbadge">${dd?I.check:"×2"}</span><b>Күн есебі</b><small>${dd?"Бүгінгі есеп шешілді!":`${dq.p} балл · XP екі есе`}</small></button>
    <button class="fcard fwr" id="fWr" ${w.length?"":"disabled"}><span class="fbadge">${w.length}</span><b>Қателер жұмысы</b><small>${w.length?"Шықпаған есептерді қайта шеш":"Қате есептер жоқ!"}</small></button>
    <button class="fcard ftour" id="fTour"><span class="fbadge">${ICUP}</span><b>Сынақ олимпиада</b><small>18 нақты тур · аралдардан кейін</small></button>
    <button class="fcard fpar" id="fPar"><span class="fbadge">i</span><b>Ата-анаға</b><small>Әдістеме және жоспар</small></button>
  </div>`,()=>{
    bindBar(hub);
    document.getElementById("today").onclick=()=>stGo(cur);
    document.querySelectorAll(".isle").forEach(b=>b.onclick=()=>{const s=STRATS.find(x=>x.id===b.dataset.s);
      if(!stOpen(s)){modal(`${say(`Бұл арал әлі жабық. Алдымен <b>${esc(STRATS[s.i-1].name)}</b> аралын өт: сабақ, жаттығу және кемінде 3 олимпиада есебі.`)}`,[{t:"Түсіндім",cls:"blue"}]);return}
      stIsle(s)});
    document.getElementById("fDay").onclick=()=>femoStart("day",[dq]);
    const wr=document.getElementById("fWr");if(w.length)wr.onclick=()=>femoStart("wrong",w.slice(0,6));
    document.getElementById("fTour").onclick=femoTours;
    document.getElementById("fPar").onclick=parentGuide;
  });
};
function stGo(s){const a=acS(s);if(!a.lesson)stLesson(s);else if(!a.warm)stWarm(s);else stPractice(s)}

/* ---------- Арал беті ---------- */
function stIsle(s){
  screen="isle";const a=acS(s),sv=stSolved(s);
  const lv=[1,2,3,4].map(p=>s.qs.filter(q=>q.p===p)).map((l,i)=>({p:i+1,n:l.length,sv:l.filter(q=>P.femo[q.id]>=2).length}));
  go(`${topbar({back:1,title:s.name})}
  <section class="panel intro">
    <span class="tbadge big" style="background:${s.c}">${esc(s.b)}</span>
    <h2>${s.i+1}-арал: ${esc(s.name)}</h2><p class="sub">Супер-күш: <b>${esc(s.power)}</b></p>
    <div class="magic"><small>Сиқырлы сұрақ</small><b>«${esc(s.magic)}»</b></div>
    <div class="path3">
      <button class="pstep ${a.lesson?"ok":""}" id="p1"><i>${a.lesson?I.check:1}</i><b>Көрсетемін</b><small>Сабақ және мысал</small></button>
      <button class="pstep ${a.warm?"ok":""}" id="p2"><i>${a.warm?I.check:2}</i><b>Бірге</b><small>Қадамдап жаттығу</small></button>
      <button class="pstep ${sv>=s.qs.length?"ok":""}" id="p3"><i>${sv>=s.qs.length?I.check:3}</i><b>Өзің</b><small>${sv}/${s.qs.length} олимпиада есебі</small></button>
    </div>
    <div class="lvls2">${lv.filter(l=>l.n).map(l=>`<span>${"★".repeat(l.p)} <b>${l.sv}/${l.n}</b></span>`).join("")}</div>
    <p class="sub">Есептер жеңілден қиынға қарай келеді: ★ — 1 балл, ★★★★ — 4 балл.</p>
  </section>`,()=>{
    bindBar(femoHome);
    document.getElementById("p1").onclick=()=>stLesson(s);
    document.getElementById("p2").onclick=()=>stWarm(s);
    document.getElementById("p3").onclick=()=>stPractice(s,true);
  });
}

/* ---------- 1. Сабақ ---------- */
function stLesson(s){
  screen="lesson";let k=0,shown=0;
  const slides=()=>[
    `${say(`<b>${esc(s.name)}</b> аралына қош келдің! Бүгін сен <b>«${esc(s.power)}»</b> супер-күшін аласың.`)}
     <div class="lcard"><ul class="idea">${s.idea.map(t=>`<li>${esc(t)}</li>`).join("")}</ul></div>`,
    `${say(`Есеп қиын көрінсе, өзіңе осы <b>сиқырлы сұрақты</b> қой:`)}
     <div class="magic big"><b>«${esc(s.magic)}»</b></div>
     <div class="plan4"><span><i>1</i>Екі рет оқы</span><span><i>2</i>Сызып көр</span><span><i>3</i>Шеш</span><span><i>4</i>Тексер</span></div>`,
    `${say(`Қазір мен көрсетейін. Әр қадамды басып аш!`)}
     <div class="lcard"><p class="exq">${esc(s.ex.q)}</p><ol class="exs">${s.ex.steps.map((t,i)=>`<li class="${i<shown?"on":""}">${esc(t)}</li>`).join("")}</ol>
     ${shown>=s.ex.steps.length?`<p class="exa">Жауабы: <b>${esc(s.ex.ans)}</b></p>`:`<button class="big blue" id="reveal">Келесі қадам</button>`}</div>`];
  function draw(){
    const sl=slides(),last=k===sl.length-1,can=!last||shown>=s.ex.steps.length;
    go(`${topbar({back:1,title:"Сабақ: "+s.name})}
    <div class="dotsbar">${sl.map((_,i)=>`<i class="${i<=k?"on":""}"></i>`).join("")}</div>
    <section class="panel lesson">${sl[k]}</section>
    <div class="row">${k?`<button class="big alt" id="prev">Артқа</button>`:""}<button class="big" id="nxt" ${can?"":"disabled"}>${last?"Енді бірге жасайық!":"Әрі қарай"}</button></div>`,()=>{
      bindBar(()=>stIsle(s));
      const r=document.getElementById("reveal");if(r)r.onclick=()=>{shown++;sfx.ok();draw()};
      const p=document.getElementById("prev");if(p)p.onclick=()=>{k--;draw()};
      document.getElementById("nxt").onclick=()=>{if(last){acS(s).lesson=true;saveP();stWarm(s)}else{k++;draw()}};
    });
  }
  draw();
}

/* ---------- 2. Бірге: қадамдап жаттығу ---------- */
function stWarm(s){
  screen="warm";let wi=0,si=0,miss=0,input="",xp=0;const log=[];
  function draw(){
    const w=s.warm[wi],st=w.steps[si];input="";miss=0;
    go(`<div class="hud"><button class="iconbtn" id="quit" aria-label="Шығу">${I.close}</button>
      <div class="track"><div class="fill" style="width:${wi/s.warm.length*100}%"></div></div><span class="count">${wi+1}/${s.warm.length}</span></div>
    <section class="panel qcard">
      <div class="qmeta"><span class="pill" style="background:${s.c};color:#fff">Бірге · ${esc(s.name)}</span><span class="ptsmall">${I.bolt}<span>${xp}</span></span></div>
      <h2 class="qtext ftext">${esc(w.q)}</h2>
      <ol class="wsteps">${w.steps.map((x,i)=>`<li class="${i<si?"ok":i===si?"cur":""}"><span>${esc(x.t)}</span>${i<si?`<b>${esc(String(x.a))}</b>`:""}</li>`).join("")}</ol>
      ${st.opts?`<div class="opts two">${st.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="k">${i+1}</span><span>${esc(o)}</span></button>`).join("")}</div>`
        :`<div class="ansrow"><span class="albl">Жауабың:</span><span class="blank fans" id="blank">?</span></div>`}
      <div id="fb"></div>
    </section>
    ${st.opts?"":`<div class="pad" id="pad">${[1,2,3,4,5,6,7,8,9,"del",0,"ok"].map(x=>`<button class="key ${x==="ok"?"k-ok":x==="del"?"k-del":""}" data-k="${x}">${x==="del"?I.del:x==="ok"?"Тексеру":x}</button>`).join("")}</div>`}`,()=>{
      document.getElementById("quit").onclick=()=>stIsle(s);
      if(st.opts)document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>check(st.opts[+b.dataset.i],b));
      else document.querySelectorAll(".key").forEach(b=>b.onclick=()=>press(b.dataset.k));
    });
  }
  function press(k){
    const b=document.getElementById("blank");if(!b)return;
    if(k==="ok"){if(input)check(Number(input),b);return}
    if(k==="del")input=input.slice(0,-1);else if(input.length<6)input=(input==="0"?"":input)+k;
    b.textContent=input||"?";b.classList.toggle("filled",!!input);b.classList.remove("bad");
  }
  function check(v,el){
    const w=s.warm[wi],st=w.steps[si];
    if(v===st.a){sfx.ok();burst(el);xp+=5;next();return}
    miss++;sfx.bad();
    if(el.id==="blank"){el.classList.add("bad");input=""}else{el.classList.add("bad");el.disabled=true}
    document.getElementById("fb").innerHTML=miss<2?`<div class="fb bad slim"><h4>Тағы бір ойлан! Сұрақты қайта оқы.</h4></div>`
      :`<div class="fb bad"><h4>Дұрысы: ${esc(String(st.a))}</h4><p>Ештеңе етпейді — үйреніп жатырмыз!</p></div><div class="row" style="margin-top:10px"><button class="big blue" id="go2">Әрі қарай</button></div>`;
    if(miss>=2){const p=document.getElementById("pad");if(p)p.classList.add("off");document.getElementById("go2").onclick=next}
  }
  function next(){
    const w=s.warm[wi];si++;
    if(si<w.steps.length){setTimeout(draw,350);return}
    setTimeout(()=>{
      modal(`${say(`<b>${pick(["Жарайсың!","Керемет!","Тамаша, Айназ!"])}</b> ${esc(w.e)}`)}`,[{t:wi<s.warm.length-1?"Келесі есеп":"Енді өзің шеш!",fn:()=>{wi++;si=0;if(wi<s.warm.length)draw();else finishWarm()}}]);
    },350);
  }
  function finishWarm(){
    const first=!acS(s).warm;acS(s).warm=true;saveP();
    const lv=addRound(s.warm.length,xp+(first?20:0));sfx.win();confetti(60);
    modal(`${say(`<b>Бірге жаттығу аяқталды!</b> Енді нағыз олимпиада есептері. Сиқырлы сұрақты ұмытпа: <b>«${esc(s.magic)}»</b>`)}`,[{t:"Олимпиада есептері",fn:()=>stPractice(s)},{t:"Кейін",cls:"alt",fn:()=>stIsle(s)}]);
    if(lv!==null)celebrate(lv,[]);
  }
  draw();
}

/* ---------- 3. Өзің: нақты FEMO есептері ---------- */
function stPractice(s,all){
  const un=s.qs.filter(q=>!(P.femo[q.id]>=2)).sort((a,b)=>a.p-b.p);
  const list=(un.length?un:s.qs.slice().sort((a,b)=>a.p-b.p)).slice(0,all?10:4);
  femoStart("st:"+s.id,list);
}
function stAfter(s){
  const nb=[];if(acDone()>=1)award("acFirst",nb);if(acDone()>=7)award("acHalf",nb);if(acDone()>=14)award("acAll",nb);saveP();return nb;
}

/* ---------- Ата-анаға ---------- */
function parentGuide(){
  modal(`<div class="pguide">
  <h3 class="mtitle">Методика подготовки к FEMO</h3>
  <p><b>Главная идея.</b> Олимпиадные задачи решаются не счётом, а приёмом. Все 178 задач 2 класса за 2019–2026 годы разбиты на 14 приёмов-«островов»: от простых («Нарисуй») к сложным («Худший случай», «Ребусы»).</p>
  <p><b>Каждый остров — 3 шага:</b></p>
  <ol><li><b>Показываю</b> — Үкі-ұстаз объясняет приём и решает пример по шагам.</li>
  <li><b>Вместе</b> — 2–3 лёгкие задачи, разбитые на маленькие шаги-вопросы. Ошибаться можно, подсказка приходит сама.</li>
  <li><b>Сама</b> — настоящие задачи FEMO этого типа, от 1 балла к 4. Первая подсказка — «волшебный вопрос» приёма, вторая — конкретная.</li></ol>
  <p><b>Ритм:</b> 20 минут в день, 5 дней в неделю — кнопка «Бүгінгі сабақ» сама выбирает следующий шаг. Один остров ≈ 2–4 дня, все 14 ≈ 6–7 недель. Потом — «Сынақ олимпиада»: настоящие туры по 10 задач, раз в неделю, как на олимпиаде.</p>
  <p><b>Как помогать:</b></p>
  <ul><li>Просите прочитать задачу вслух дважды и <b>нарисовать</b> её на бумаге — это половина решения.</li>
  <li>Не подсказывайте ответ: спросите «Какой волшебный вопрос у этого острова?»</li>
  <li>Хвалите за способ, а не за скорость: «Как ты догадалась?»</li>
  <li>Если задача не идёт 5 минут — нажать «Кеңес», прочитать решение и вернуться к ней через день («Қателер жұмысы»).</li>
  <li>Задачи на 3–4 балла сложны даже для сильных второклассников — это нормально. Цель — уверенно брать задачи на 1–2 балла и часть на 3.</li></ul>
  <p class="sub">Следующий остров открывается после урока, тренировки и 3 решённых задач предыдущего.</p>
  <label class="pchk"><input type="checkbox" id="openAll" ${P.acOpenAll?"checked":""}> Открыть все острова сразу (для родителя)</label>
  </div>`,[{t:"Понятно",cls:"blue",fn:()=>{const c=document.getElementById("openAll");if(c){P.acOpenAll=c.checked;saveP()}femoHome()}}]);
}

/* Кеңес: 1-деңгей — тәсіл, 2-деңгей — нақты кеңес */
window.fHint=function(){
  const c=F.cur;if(c.done)return;const s=SMAP[c.q.id],t=document.getElementById("ftools");
  if(!c.hint&&s){c.hint=1;sfx.combo();
    t.innerHTML=`<div class="hintbox fh">${IBULB}<span><b>${esc(s.name)}</b> тәсілі! Өзіңе сұрақ қой: «${esc(s.magic)}»</span></div><button class="ghost hintb" id="fhint2">${IBULB}Тағы кеңес</button>`;
    document.getElementById("fhint2").onclick=()=>{c.hint=2;sfx.combo();t.innerHTML=`<div class="hintbox fh">${IBULB}<span>${esc(c.q.h)}</span></div>`};
    return}
  if(!c.hint){c.hint=2;t.innerHTML=`<div class="hintbox fh">${IBULB}<span>${esc(c.q.h)}</span></div>`;sfx.combo()}
};

hub();
