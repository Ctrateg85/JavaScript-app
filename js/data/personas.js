// Ligalar, reýtingdäki personažlar we duel botlary

// factor — botlaryň bu ligada näçe işjeňdigini kesgitleýär
// xp — bu ligada derejäni (sapagy) tamamlamak üçin berilýän XP aralygy [iň az, iň köp]
window.LEAGUES = [
  { id: 'bronze',   name: 'Öwreniji',  icon: '🥉', color: '#cd7f32', factor: 1.0, xp: [25, 35] },
  { id: 'silver',   name: 'Frontend',  icon: '🥈', color: '#9ea7b3', factor: 1.4, xp: [20, 30] },
  { id: 'gold',     name: 'FullStack', icon: '🥇', color: '#e6b422', factor: 1.9, xp: [17, 26] },
  { id: 'sapphire', name: 'Haker',     icon: '💎', color: '#2f6fdb', factor: 2.5, xp: [14, 22] },
  { id: 'diamond',  name: 'Kraker',    icon: '👑', color: '#7b4fd6', factor: 3.2, xp: [11, 18] }
];

// Reýtingde ulanyjy bilen bäsleşýän personažlar.
// activity — sagat içinde sapak geçmek ähtimallygy, power — bir sapakdaky ortaça XP
window.PERSONAS = [
  { id: 'p1',  name: 'Aýgül',     avatar: '🎓', city: 'Aşgabat',   activity: 0.10, power: 14 },
  { id: 'p2',  name: 'Merdan',    avatar: '🐻', city: 'Mary',      activity: 0.14, power: 16 },
  { id: 'p3',  name: 'Döwlet',    avatar: '🧔',   city: 'Daşoguz',   activity: 0.06, power: 12 },
  { id: 'p4',  name: 'Maral',     avatar: '🐱', city: 'Türkmenabat', activity: 0.12, power: 15 },
  { id: 'p5',  name: 'Batyr',     avatar: '🦁',   city: 'Balkanabat', activity: 0.08, power: 13 },
  { id: 'p6',  name: 'Selbi',     avatar: '🌸',   city: 'Aşgabat',   activity: 0.16, power: 14 },
  { id: 'p7',  name: 'Kerim',     avatar: '🔬', city: 'Tejen',     activity: 0.05, power: 18 },
  { id: 'p8',  name: 'Jeren',     avatar: '🦌',   city: 'Mary',      activity: 0.11, power: 12 },
  { id: 'p9',  name: 'Serdar',    avatar: '🚀', city: 'Serdar',    activity: 0.13, power: 17 },
  { id: 'p10', name: 'Ogulnabat', avatar: '📚', city: 'Änew',      activity: 0.07, power: 15 },
  { id: 'p11', name: 'Röwşen',    avatar: '😎',   city: 'Aşgabat',   activity: 0.18, power: 13 },
  { id: 'p12', name: 'Leýli',     avatar: '🌙',   city: 'Bäherden',  activity: 0.09, power: 16 },
  { id: 'p13', name: 'Myrat',     avatar: '🐺',   city: 'Kerki',     activity: 0.04, power: 20 },
  { id: 'p14', name: 'Bahar',     avatar: '🌷',   city: 'Türkmenbaşy', activity: 0.12, power: 13 },
  { id: 'p15', name: 'Arslan',    avatar: '🐯',   city: 'Bereket',   activity: 0.15, power: 15 },
  { id: 'p16', name: 'Gülşat',    avatar: '🌺',   city: 'Daşoguz',   activity: 0.10, power: 14 },
  { id: 'p17', name: 'Nury',      avatar: '🎨', city: 'Gökdepe',   activity: 0.08, power: 17 },
  { id: 'p18', name: 'Enejan',    avatar: '🔧', city: 'Mary',      activity: 0.13, power: 12 },
  { id: 'p19', name: 'Atajan',    avatar: '🦅',   city: 'Baýramaly', activity: 0.06, power: 19 },
  { id: 'p20', name: 'Sapar',     avatar: '🐫',   city: 'Sakarçäge', activity: 0.11, power: 14 },
  { id: 'p21', name: 'Aýna',      avatar: '🪞',   city: 'Aşgabat',   activity: 0.17, power: 12 },
  { id: 'p22', name: 'Begenç',    avatar: '🎧',   city: 'Türkmenabat', activity: 0.09, power: 16 },
  { id: 'p23', name: 'Mähri',     avatar: '💫',   city: 'Magtymguly', activity: 0.14, power: 13 },
  { id: 'p24', name: 'Dowlet-JS', avatar: '🤓',   city: 'Aşgabat',   activity: 0.20, power: 15 },
  { id: 'p25', name: 'Güljemal',  avatar: '🌼',   city: 'Halaç',     activity: 0.07, power: 14 },
  { id: 'p26', name: 'Ýusup',     avatar: '🔨',   city: 'Seýdi',     activity: 0.10, power: 18 },
  { id: 'p27', name: 'Täzegül',   avatar: '🍀',   city: 'Ruhabat',   activity: 0.12, power: 12 },
  { id: 'p28', name: 'Rahman',    avatar: '🎲',   city: 'Tejen',     activity: 0.05, power: 22 }
];

// 1×1 duel üçin botlar
// accuracy — dogry jogap ähtimallygy,
// minSec/maxSec — okamak wagtyndan soň jogap bermek üçin näçe sekunt pikirlenýändigi,
// questions — soraglaryň kynlyk zolagy: geçen derejelerdäki soraglar kynlygy boýunça tertiplenende haýsy bölekden alynýandygy
//   (0 — iň aňsat, 1 — iň kyn; kynlyk duel.js → difficulty())
// win — ýeňiş üçin goşulýan, loss — utulyş üçin aýrylýan duel reýtingi [iň az, iň köp] (tötänleýin saýlanýar)
// readSec — her soragyň başynda oýlanmak (okamak) wagty: bu wagtda hiç kim jogap berip bilmeýär; 0 — ýok
window.DUEL_BOTS = [
  { id: 'easy',   name: 'Haiku 5.5',  avatar: '🐣', level: 'Täze başlaýan', readSec: 0, accuracy: 0.45, minSec: 5, maxSec: 11, questions: [0, 0.4],    qLabel: 'Aňsat',  win: [10, 15], loss: [5, 10],  desc: 'Iň ýeňil model. Gysga pikirlenýär, köplenç ýalňyşýar we haýal jogap berýär.' },
  { id: 'medium', name: 'Sonnet 5.5', avatar: '🤖', level: 'Orta',          readSec: 0, accuracy: 0.65, minSec: 4, maxSec: 9,  questions: [0.25, 0.65], qLabel: 'Orta',   win: [14, 18], loss: [7, 11],  desc: 'Deňagramly model. Esaslary bilýär, ýöne käwagt gyssanmaçlyk edýär.' },
  { id: 'hard',   name: 'Opus 5.5',   avatar: '🦾', level: 'Tejribeli',     readSec: 1, accuracy: 0.80, minSec: 3, maxSec: 7,  questions: [0.45, 0.85], qLabel: 'Kyn',    win: [18, 23], loss: [9, 14],  desc: 'Güýçli model. Çalt we takyk — ýeňmek üçin ünsli bolmaly.' },
  { id: 'expert', name: 'Fable 5.1',  avatar: '🧠', level: 'Ussat',         readSec: 2, accuracy: 0.92, minSec: 2, maxSec: 6,  questions: [0.7, 1],    qLabel: 'Iň kyn', win: [23, 27], loss: [11, 13], desc: 'Iň güýçli model. Seýrek ýalňyşýar we iň kyn soraglary berýär.' }
];
