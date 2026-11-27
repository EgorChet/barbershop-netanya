// Три раздела для всех версий: «До и после», «Форма лица», «Тренды и классика».
// Тексты хранятся здесь на всех четырёх языках (RU / EN / HE / FR) и перерисовываются при смене языка.
// «До и после»: положите пары фото в assets/ba/ и добавьте в assets/config.js → beforeAfter.
(function () {
  var host = document.getElementById("visit") || document.querySelector("footer");
  if (!host || document.getElementById("guide")) return;
  var cfg = window.SITE_CONFIG || {};

  var L = {
    ru: {
      swipe: "листайте: лицо → объяснение", ex: "Известные примеры", exNote: "Ориентир: мнения стилистов расходятся, а форма зависит от ракурса и причёски.", prev: "Назад", next: "Дальше", how: "Как это работает",
      baK: "Результат", baT: "До и <em>после</em>",
      baLead: "Настоящие работы наших барберов. Потяните ползунок, чтобы увидеть разницу.",
      soonT: "Скоро здесь будут работы", soonD: "Фото «до» и «после» от Димы, Таши и Кирилла. Пока их нет, место ждёт.",
      before: "До", after: "После",
      fK: "Форма лица", fT: "Что идёт <em>вашему лицу</em>",
      fLead: "Одна и та же стрижка на разных лицах выглядит по-разному. Вот как это работает.",
      good: "Идёт", care: "Осторожно",
      fTip: "Форма лица — подсказка, а не закон. Плотность волос, завиток и линия роста решают не меньше. Мастер посмотрит на вас вживую и скажет честно.",
      faces: [
        { id: "oval", n: "Овальное", d: "Лицо чуть вытянуто, скулы немного шире лба, подбородок мягкий.", g: "Почти всё: помпадур, зачёс назад, текстурный кроп.", c: "Тяжёлая чёлка вниз заметно удлиняет лицо." },
        { id: "round", n: "Круглое", d: "Ширина почти равна длине, линии мягкие.", g: "Объём сверху и короткие бока (фейд), боковой пробор: они вытягивают лицо.", c: "Ровная чёлка и объём по бокам делают лицо шире." },
        { id: "square", n: "Квадратное", d: "Широкая челюсть, прямой лоб.", g: "Кроп, классический пробор, короткие бока. Лёгкая текстура смягчает углы.", c: "Слишком геометричные линии усиливают угловатость." },
        { id: "oblong", n: "Вытянутое", d: "Лицо заметно длиннее своей ширины.", g: "Чёлка, объём по бокам, средняя длина с текстурой. Борода тоже помогает.", c: "Высокий помпадур и очень короткие бока вытягивают ещё сильнее." },
        { id: "heart", n: "Сердце", d: "Широкий лоб, узкий подбородок.", g: "Чёлка набок, средняя длина, борода уравновешивает подбородок.", c: "Большой объём на макушке и полностью открытый лоб." },
        { id: "diamond", n: "Ромб", d: "Широкие скулы, узкие лоб и подбородок.", g: "Чёлка вперёд, текстура, борода по линии челюсти.", c: "Зачёс назад целиком открывает скулы и подчёркивает их." }
      ],
      tK: "Стрижки", tT: "Тренды и <em>классика</em>",
      tLead: "Мода меняется, хорошая форма остаётся. Сначала то, что просят в последние годы, потом то, что не стареет.",
      now: "В тренде последние годы", cls: "Классика, которая не стареет",
      nowL: [
        { n: "Маллет и волчья стрижка", d: "Короче спереди и по бокам, длиннее сзади. Дерзко, но носится легко." },
        { n: "Шэгги", d: "Мягкие рваные слои и лёгкая чёлка. Объём без укладки на час." },
        { n: "Текстурный кроп", d: "Короткая рваная чёлка вперёд и аккуратные бока. Просто и современно." },
        { n: "Низкий тейпер", d: "Бока плавно сходят на нет у самой линии роста. Аккуратно, но не строго." },
        { n: "Шторки", d: "Средний пробор и пряди по сторонам лба. Привет, девяностые." },
        { n: "Средняя длина со слоями", d: "Волосы до ушей и ниже, с формой и движением. Лёгкий уход." }
      ],
      clsL: [
        { n: "Помпадур", d: "Объём спереди, чистые бока. Подходит почти всем, смотрится на любой вечеринке." },
        { n: "Боковой пробор", d: "Чёткий пробор и зачёс в сторону. Работает в офисе и на свидании." },
        { n: "Зачёс назад", d: "Волосы назад, гладко или с текстурой. Всегда выглядит собранно." },
        { n: "Крю-кат", d: "Коротко по бокам, чуть длиннее сверху. Классика, которая никуда не делась." },
        { n: "Бокс и полубокс", d: "Максимально коротко и чётко. Не требует ухода вообще." },
        { n: "Классический тейпер", d: "Ножницами сверху, плавный переход по бокам. Основа любой хорошей стрижки." }
      ]
    },
    en: {
      swipe: "swipe: face → explanation", ex: "Famous examples", exNote: "A rough guide: stylists disagree, and shape depends on angle and hairstyle.", prev: "Back", next: "Next", how: "How it works",
      baK: "Results", baT: "Before and <em>after</em>",
      baLead: "Real work by our barbers. Drag the slider to see the difference.",
      soonT: "Work coming soon", soonD: "Before and after photos from Dima, Tasha and Kirill. The space is waiting for them.",
      before: "Before", after: "After",
      fK: "Face shape", fT: "What suits <em>your face</em>",
      fLead: "The same haircut looks different on different faces. Here's how it works.",
      good: "Works", care: "Careful",
      fTip: "Face shape is a hint, not a law. Hair density, curl and hairline matter just as much. Your barber will look at you in person and tell you honestly.",
      faces: [
        { id: "oval", n: "Oval", d: "Slightly longer face, cheekbones a little wider than the forehead, soft chin.", g: "Almost anything: pompadour, slick back, textured crop.", c: "A heavy fringe falling down makes the face look noticeably longer." },
        { id: "round", n: "Round", d: "Width is close to length, soft lines.", g: "Volume on top with short sides (a fade) and a side part. They lengthen the face.", c: "A straight fringe and volume at the sides make the face look wider." },
        { id: "square", n: "Square", d: "Wide jaw, straight forehead.", g: "A crop, a classic parting, short sides. Light texture softens the corners.", c: "Very geometric lines emphasise the angles." },
        { id: "oblong", n: "Oblong", d: "A face clearly longer than it is wide.", g: "A fringe, volume at the sides, medium length with texture. A beard helps too.", c: "A tall pompadour and very short sides lengthen it even more." },
        { id: "heart", n: "Heart", d: "Wide forehead, narrow chin.", g: "A side-swept fringe, medium length. A beard balances the chin.", c: "Big volume on the crown and a fully open forehead." },
        { id: "diamond", n: "Diamond", d: "Wide cheekbones, narrower forehead and chin.", g: "A fringe forward, texture, a beard along the jawline.", c: "Slicking everything back fully exposes the cheekbones and stresses them." }
      ],
      tK: "Haircuts", tT: "Trends and <em>classics</em>",
      tLead: "Fashion changes, good shape stays. First what people have been asking for in recent years, then what never gets old.",
      now: "Trending in recent years", cls: "Classics that never get old",
      nowL: [
        { n: "Mullet and wolf cut", d: "Shorter at the front and sides, longer at the back. Bold but easy to wear." },
        { n: "Shag", d: "Soft, choppy layers and a light fringe. Volume without an hour of styling." },
        { n: "Textured crop", d: "A short, ragged fringe forward and tidy sides. Simple and modern." },
        { n: "Low taper", d: "The sides fade out gently right at the hairline. Neat without being strict." },
        { n: "Curtains", d: "A middle part and strands framing the forehead. Hello, nineties." },
        { n: "Medium length with layers", d: "Hair to the ears and below, with shape and movement. Easy to maintain." }
      ],
      clsL: [
        { n: "Pompadour", d: "Volume at the front, clean sides. Suits almost everyone and works at any party." },
        { n: "Side part", d: "A sharp parting and a sweep to the side. Works at the office and on a date." },
        { n: "Slick back", d: "Hair combed back, smooth or textured. Always looks put together." },
        { n: "Crew cut", d: "Short at the sides, a bit longer on top. A classic that never went anywhere." },
        { n: "Buzz and high-and-tight", d: "As short and sharp as it gets. No styling at all." },
        { n: "Classic taper", d: "Scissor work on top, a smooth transition at the sides. The base of every good haircut." }
      ]
    },
    he: {
      swipe: "החליקו: פנים ← הסבר", ex: "דוגמאות מפורסמות", exNote: "הערכה כללית: מעצבים חלוקים, והצורה תלויה בזווית ובתסרוקת.", prev: "הקודם", next: "הבא", how: "איך זה עובד",
      baK: "תוצאות", baT: "לפני <em>ואחרי</em>",
      baLead: "עבודות אמיתיות של הספרים שלנו. גררו את המחוון כדי לראות את ההבדל.",
      soonT: "עבודות יעלו בקרוב", soonD: "תמונות לפני ואחרי של דימה, טאשה וקיריל. המקום מחכה להן.",
      before: "לפני", after: "אחרי",
      fK: "צורת פנים", fT: "מה מתאים <em>לפנים שלכם</em>",
      fLead: "אותה תספורת נראית אחרת על פנים שונות. כך זה עובד.",
      good: "מתאים", care: "זהירות",
      fTip: "צורת הפנים היא רמז, לא חוק. צפיפות השיער, הסלסול וקו השיער חשובים לא פחות. הספר יסתכל עליכם מקרוב ויגיד בכנות.",
      faces: [
        { id: "oval", n: "אובלי", d: "פנים מעט מוארכות, עצמות לחיים רחבות קצת מהמצח, סנטר רך.", g: "כמעט הכול: פומפדור, שיער אחורה, קרופ בטקסטורה.", c: "פוני כבד שיורד למטה מאריך את הפנים." },
        { id: "round", n: "עגול", d: "הרוחב קרוב לאורך, קווים רכים.", g: "נפח למעלה וצדדים קצרים (פייד), פסוקת בצד. הם מאריכים את הפנים.", c: "פוני ישר ונפח בצדדים מרחיבים את הפנים." },
        { id: "square", n: "מרובע", d: "לסת רחבה, מצח ישר.", g: "קרופ, פסוקת קלאסית, צדדים קצרים. טקסטורה קלה מרככת את הפינות.", c: "קווים גיאומטריים מדי מדגישים את הזוויתיות." },
        { id: "oblong", n: "מוארך", d: "פנים ארוכות בבירור מרוחבן.", g: "פוני, נפח בצדדים, אורך בינוני עם טקסטורה. גם זקן עוזר.", c: "פומפדור גבוה וצדדים קצרים מאוד מאריכים עוד יותר." },
        { id: "heart", n: "לב", d: "מצח רחב, סנטר צר.", g: "פוני הצידה, אורך בינוני. זקן מאזן את הסנטר.", c: "נפח גדול בקודקוד ומצח חשוף לגמרי." },
        { id: "diamond", n: "יהלום", d: "עצמות לחיים רחבות, מצח וסנטר צרים.", g: "פוני קדימה, טקסטורה, זקן לאורך קו הלסת.", c: "שיער מסורק כולו אחורה חושף ומדגיש את עצמות הלחיים." }
      ],
      tK: "תספורות", tT: "טרנדים <em>וקלאסיקה</em>",
      tLead: "האופנה משתנה, הצורה הטובה נשארת. קודם מה שמבקשים בשנים האחרונות, ואז מה שלא מתיישן.",
      now: "טרנדי בשנים האחרונות", cls: "קלאסיקה שלא מתיישנת",
      nowL: [
        { n: "מאלט וווּלף קאט", d: "קצר יותר מלפנים ובצדדים, ארוך מאחור. נועז אבל קל ללבישה." },
        { n: "שאג", d: "שכבות רכות ופרועות ופוני קל. נפח בלי שעה של עיצוב." },
        { n: "קרופ בטקסטורה", d: "פוני קצר ופרוע קדימה וצדדים מסודרים. פשוט ומודרני." },
        { n: "טייפר נמוך", d: "הצדדים נמוגים בעדינות בקו השיער. מסודר בלי להיות קפדני." },
        { n: "קרטינס", d: "פסוקת באמצע ותלתלים שמסגרים את המצח. שלום, שנות התשעים." },
        { n: "אורך בינוני עם שכבות", d: "שיער עד האוזניים ומטה, עם צורה ותנועה. קל לתחזוקה." }
      ],
      clsL: [
        { n: "פומפדור", d: "נפח מלפנים, צדדים נקיים. מתאים כמעט לכולם ונראה טוב בכל מסיבה." },
        { n: "פסוקת בצד", d: "פסוקת חדה ושיער מסורק הצידה. עובד במשרד ובדייט." },
        { n: "שיער אחורה", d: "שיער מסורק אחורה, חלק או עם טקסטורה. תמיד נראה מסודר." },
        { n: "קרו קאט", d: "קצר בצדדים, קצת יותר ארוך למעלה. קלאסיקה שלא נעלמה." },
        { n: "באז והיי אנד טייט", d: "הכי קצר והכי חד. בלי עיצוב בכלל." },
        { n: "טייפר קלאסי", d: "עבודת מספריים למעלה, מעבר חלק בצדדים. הבסיס של כל תספורת טובה." }
      ]
    },
    fr: {
      swipe: "glissez : visage → explication", ex: "Exemples célèbres", exNote: "À titre indicatif : les stylistes ne sont pas d'accord, et la forme dépend de l'angle et de la coiffure.", prev: "Précédent", next: "Suivant", how: "Comment ça marche",
      baK: "Résultats", baT: "Avant <em>et après</em>",
      baLead: "De vrais travaux de nos barbiers. Faites glisser le curseur pour voir la différence.",
      soonT: "Bientôt ici", soonD: "Des photos avant et après de Dima, Tasha et Kirill. La place les attend.",
      before: "Avant", after: "Après",
      fK: "Forme du visage", fT: "Ce qui va <em>à votre visage</em>",
      fLead: "La même coupe n'a pas le même effet sur tous les visages. Voici comment ça marche.",
      good: "Va bien", care: "Attention",
      fTip: "La forme du visage est un indice, pas une loi. La densité des cheveux, la boucle et la ligne d'implantation comptent autant. Votre barbier vous regarde en vrai et vous dit honnêtement.",
      faces: [
        { id: "oval", n: "Ovale", d: "Visage un peu allongé, pommettes légèrement plus larges que le front, menton doux.", g: "Presque tout : pompadour, coiffé en arrière, crop texturé.", c: "Une grosse frange qui tombe allonge nettement le visage." },
        { id: "round", n: "Rond", d: "Largeur proche de la longueur, lignes douces.", g: "Du volume sur le dessus, côtés courts (dégradé), raie sur le côté. Ils allongent le visage.", c: "Une frange droite et du volume sur les côtés élargissent le visage." },
        { id: "square", n: "Carré", d: "Mâchoire large, front droit.", g: "Crop, raie classique, côtés courts. Une texture légère adoucit les angles.", c: "Des lignes trop géométriques accentuent les angles." },
        { id: "oblong", n: "Allongé", d: "Un visage nettement plus long que large.", g: "Une frange, du volume sur les côtés, longueur moyenne texturée. La barbe aide aussi.", c: "Un pompadour haut et des côtés très courts l'allongent encore plus." },
        { id: "heart", n: "Cœur", d: "Front large, menton étroit.", g: "Frange sur le côté, longueur moyenne. La barbe équilibre le menton.", c: "Beaucoup de volume sur le sommet et un front totalement dégagé." },
        { id: "diamond", n: "Losange", d: "Pommettes larges, front et menton plus étroits.", g: "Frange vers l'avant, texture, barbe le long de la mâchoire.", c: "Tout coiffer en arrière dégage entièrement les pommettes et les accentue." }
      ],
      tK: "Coupes", tT: "Tendances <em>et classiques</em>",
      tLead: "La mode change, la bonne forme reste. D'abord ce qu'on demande ces dernières années, puis ce qui ne vieillit pas.",
      now: "Tendance ces dernières années", cls: "Des classiques qui ne vieillissent pas",
      nowL: [
        { n: "Mullet et wolf cut", d: "Plus court devant et sur les côtés, plus long derrière. Audacieux mais facile à porter." },
        { n: "Shag", d: "Des dégradés doux et décoiffés avec une frange légère. Du volume sans une heure de coiffage." },
        { n: "Crop texturé", d: "Une frange courte et irrégulière vers l'avant, des côtés nets. Simple et moderne." },
        { n: "Taper bas", d: "Les côtés s'estompent doucement à la ligne d'implantation. Net sans être strict." },
        { n: "Rideaux", d: "Une raie au milieu et des mèches qui encadrent le front. Coucou, les années 90." },
        { n: "Mi-long dégradé", d: "Des cheveux aux oreilles et plus bas, avec de la forme et du mouvement. Facile à entretenir." }
      ],
      clsL: [
        { n: "Pompadour", d: "Du volume devant, des côtés propres. Va à presque tout le monde et passe à toutes les soirées." },
        { n: "Raie sur le côté", d: "Une raie nette et les cheveux ramenés sur le côté. Marche au bureau comme au rendez-vous." },
        { n: "Coiffé en arrière", d: "Cheveux en arrière, lisses ou texturés. Toujours soigné." },
        { n: "Crew cut", d: "Court sur les côtés, un peu plus long dessus. Un classique qui n'a jamais disparu." },
        { n: "Buzz cut et high and tight", d: "Aussi court et net que possible. Aucun coiffage." },
        { n: "Taper classique", d: "Travail aux ciseaux sur le dessus, transition douce sur les côtés. La base de toute bonne coupe." }
      ]
    }
  };

  var CE = {
    oval: ["George Clooney", "Idris Elba"],
    round: ["Jonah Hill", "Seth Rogen"],
    square: ["Henry Cavill", "Brad Pitt"],
    oblong: ["Adrien Brody", "Benedict Cumberbatch"],
    heart: ["Ryan Gosling", "Chris Pine"],
    diamond: ["Adam Driver", "Chris Hemsworth"]
  };
  var SHAPES = {
    oval: '<ellipse cx="30" cy="36" rx="20" ry="30"/>',
    round: '<circle cx="30" cy="36" r="27"/>',
    square: '<rect x="9" y="9" width="42" height="54" rx="11"/>',
    oblong: '<rect x="14" y="3" width="32" height="66" rx="16"/>',
    heart: '<path d="M7 20Q30 0 53 20Q51 48 30 69Q9 48 7 20Z" stroke-linejoin="round"/>',
    diamond: '<path d="M30 3L55 36L30 69L5 36Z" stroke-linejoin="round"/>'
  };

  var css =
    ".gd-s{background:var(--bk-bg,#111);color:var(--bk-fg,#fff);padding:clamp(54px,7vw,96px) clamp(16px,4vw,40px);font-family:inherit;border-top:1px solid var(--bk-line,#333)}" +
    ".gd-in{max-width:1200px;margin:0 auto}" +
    ".gd-b{margin-top:clamp(46px,6vw,80px)}.gd-b:first-child{margin-top:0}" +
    ".gd-k{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".gd-s h2{font-family:var(--bk-head,inherit);font-weight:700;font-size:clamp(28px,4.4vw,52px);line-height:1.05;margin:12px 0 0;text-transform:none}" +
    ".gd-s h2 em{font-style:normal;color:var(--bk-acc,#ff5a1f)}" +
    ".gd-lead{max-width:620px;margin-top:14px;line-height:1.6;color:var(--bk-mut,#aaa)}" +
    ".gd-g{display:grid;gap:12px;margin-top:28px}" +
    ".gd-c{border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,8px);padding:20px;display:flex;flex-direction:column;gap:8px}" +
    ".gd-c h4{font-family:var(--bk-head,inherit);font-size:20px;font-weight:700;line-height:1.1}" +
    ".gd-c p{color:var(--bk-mut,#aaa);font-size:15px;line-height:1.5}" +
    ".gd-c .r,.gd-p .r{display:grid;grid-template-columns:auto 1fr;gap:6px 10px;margin-top:6px;font-size:14px;line-height:1.45}" +
    ".gd-c .r b,.gd-p .r b{font-size:11px;letter-spacing:.14em;text-transform:uppercase;padding-top:2px;color:var(--bk-acc,#ff5a1f)}" +
    ".gd-c .r b.x,.gd-p .r b.x{color:var(--bk-mut,#999)}" +
    ".gd-ic{width:54px;height:64px;margin-bottom:4px}.gd-ic *{fill:none;stroke:var(--bk-acc,#ff5a1f);stroke-width:2.5}" +
    ".gd-n{font:600 12px ui-monospace,Menlo,monospace;color:var(--bk-acc,#ff5a1f);letter-spacing:.1em}" +
    ".gd-sl{position:relative;margin-top:28px}" +
    ".gd-tk{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none;-webkit-overflow-scrolling:touch;direction:ltr;padding-bottom:4px}" +
    ".gd-tk::-webkit-scrollbar{display:none}" +
    ".gd-p{flex:0 0 100%;scroll-snap-align:start;border:1px solid var(--bk-line,#333);border-radius:var(--bk-radius,8px);padding:22px;min-height:380px;display:flex;flex-direction:column;gap:10px;box-sizing:border-box}" +
    "@media(min-width:900px){.gd-p{flex-basis:calc(50% - 6px)}}" +
    ".gd-p.face{align-items:center;text-align:center;justify-content:center;background:linear-gradient(160deg,color-mix(in srgb,var(--bk-acc,#ff5a1f) 12%,transparent),transparent 60%)}" +
    ".gd-big{width:min(200px,60%);height:auto}.gd-big .o{fill:none;stroke:var(--bk-acc,#ff5a1f);stroke-width:2.6}.gd-big .g{fill:none;stroke:var(--bk-mut,#888);stroke-width:1;stroke-dasharray:3 4}.gd-big .f{fill:var(--bk-fg,#fff);stroke:none}.gd-big .l{fill:none;stroke:var(--bk-fg,#fff);stroke-width:2;stroke-linecap:round}" +
    ".gd-p p{color:var(--bk-mut,#aaa);font-size:15px;line-height:1.5}" +
    ".gd-p h4{font-family:var(--bk-head,inherit);font-size:clamp(24px,3vw,34px);line-height:1.05}" +
    ".gd-ce{display:flex;gap:8px;flex-wrap:wrap;justify-content:center;margin-top:6px}" +
    ".gd-ce span{border:1px solid var(--bk-line,#444);border-radius:999px;padding:6px 12px;font-size:13px}" +
    ".gd-p .gd-cap{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--bk-mut,#999)}" +
    ".gd-p .nt{font-size:12px;color:var(--bk-mut,#999);line-height:1.5;margin-top:auto}" +
    ".gd-p .hint{font-size:12px;color:var(--bk-acc,#ff5a1f);margin-top:auto}" +
    ".gd-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;direction:ltr}" +
    ".gd-dots{display:flex;gap:6px;flex-wrap:wrap}.gd-dots i{width:8px;height:8px;border-radius:50%;background:var(--bk-line,#444);transition:.2s}.gd-dots i.on{background:var(--bk-acc,#ff5a1f);width:22px;border-radius:8px}" +
    ".gd-ar{display:flex;gap:8px}.gd-ar button{all:unset;cursor:pointer;width:44px;height:44px;border-radius:50%;border:1px solid var(--bk-line,#444);display:grid;place-items:center;font-size:18px;color:var(--bk-fg,#fff)}.gd-ar button:hover{border-color:var(--bk-acc,#ff5a1f);color:var(--bk-acc,#ff5a1f)}" +
    ".gd-tip{margin-top:20px;max-width:700px;padding-inline-start:14px;border-inline-start:3px solid var(--bk-acc,#ff5a1f);line-height:1.6}" +
    ".gd-h3{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bk-mut,#999);margin:34px 0 0}" +
    ".gd-ba{position:relative;aspect-ratio:4/5;overflow:hidden;border-radius:var(--bk-radius,8px);background:#222;--p:50%;direction:ltr;touch-action:pan-y}" +
    ".gd-ba img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}" +
    ".gd-ba .bf{clip-path:inset(0 calc(100% - var(--p)) 0 0)}" +
    ".gd-ba .ln{position:absolute;top:0;bottom:0;left:var(--p);width:3px;margin-left:-1.5px;background:var(--bk-acc,#fff);pointer-events:none}" +
    ".gd-ba .ln:after{content:'\\2194';position:absolute;top:50%;left:50%;width:38px;height:38px;margin:-19px 0 0 -19px;border-radius:50%;background:var(--bk-acc,#fff);color:var(--bk-acc-fg,#000);display:grid;place-items:center;font-size:18px}" +
    ".gd-ba input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:ew-resize;margin:0}" +
    ".gd-ba .t{position:absolute;bottom:10px;font:600 11px ui-monospace,Menlo,monospace;letter-spacing:.14em;text-transform:uppercase;background:#000a;color:#fff;padding:5px 8px;pointer-events:none}" +
    ".gd-ba .t.b{left:10px}.gd-ba .t.a{right:10px}" +
    ".gd-soon{aspect-ratio:16/9;grid-column:1/-1;border:2px dashed var(--bk-line,#444);border-radius:var(--bk-radius,8px);display:grid;place-items:center;text-align:center;padding:22px;color:var(--bk-mut,#999)}" +
    ".gd-soon b{display:block;color:var(--bk-fg,#fff);font-family:var(--bk-head,inherit);font-size:20px;margin-bottom:8px}" +
    ".gd-who{margin-top:8px;font-size:13px;color:var(--bk-mut,#999)}" +
    "@media(min-width:640px){.gd-g.f,.gd-g.t{grid-template-columns:repeat(2,1fr)}.gd-g.ba{grid-template-columns:repeat(2,1fr)}}" +
    "@media(min-width:980px){.gd-g.f{grid-template-columns:repeat(3,1fr)}.gd-g.t{grid-template-columns:repeat(3,1fr)}.gd-g.ba{grid-template-columns:repeat(3,1fr)}}";
  var st = document.createElement("style");
  st.textContent = css;
  document.head.appendChild(st);

  var sec = document.createElement("section");
  sec.className = "gd-s";
  sec.id = "guide";
  host.parentNode.insertBefore(sec, host);

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }

  function baHtml(T) {
    var list = cfg.beforeAfter || [];
    var items;
    if (list.length) {
      items = list.map(function (p, i) {
        return '<div><div class="gd-ba" data-i="' + i + '"><img src="' + esc(p.after) + '" alt="' + esc(T.after) + '" loading="lazy">' +
          '<img class="bf" src="' + esc(p.before) + '" alt="' + esc(T.before) + '" loading="lazy"><i class="ln"></i>' +
          '<span class="t b">' + T.before + '</span><span class="t a">' + T.after + '</span>' +
          '<input type="range" min="0" max="100" value="50" aria-label="' + esc(T.before + " / " + T.after) + '"></div>' +
          (p.who ? '<div class="gd-who">' + esc(p.who) + "</div>" : "") + "</div>";
      }).join("");
    } else {
      items = [0].map(function () { return '<div class="gd-soon"><div><b>' + T.soonT + "</b>" + T.soonD + "</div></div>"; }).join("");
    }
    return '<div class="gd-b"><span class="gd-k">' + T.baK + "</span><h2>" + T.baT + '</h2><p class="gd-lead">' + T.baLead + '</p><div class="gd-g ba">' + items + "</div></div>";
  }
  var BIG = {
    oval: '<ellipse cx="60" cy="74" rx="40" ry="62"/>',
    round: '<circle cx="60" cy="74" r="52"/>',
    square: '<rect x="14" y="20" width="92" height="108" rx="22"/>',
    oblong: '<rect x="24" y="6" width="72" height="136" rx="36"/>',
    heart: '<path d="M10 40Q60 -2 110 40Q106 98 60 144Q14 98 10 40Z" stroke-linejoin="round"/>',
    diamond: '<path d="M60 4L112 76L60 144L8 76Z" stroke-linejoin="round"/>'
  };
  function faceSvg(id) {
    return '<svg class="gd-big" viewBox="0 0 120 150" aria-hidden="true"><g class="o">' + BIG[id] + '</g>' +
      '<path class="g" d="M6 40H114M6 76H114M6 112H114"/><circle class="f" cx="44" cy="68" r="3"/><circle class="f" cx="76" cy="68" r="3"/>' +
      '<path class="l" d="M60 74V92M50 108Q60 114 70 108"/></svg>';
  }
  function facesHtml(T) {
    var panels = T.faces.map(function (f) {
      return '<div class="gd-p face">' + faceSvg(f.id) + "<h4>" + f.n + '</h4><span class="gd-cap">' + T.ex + '</span><div class="gd-ce">' +
        CE[f.id].map(function (n) { return "<span>" + n + "</span>"; }).join("") + '</div><span class="hint">' + T.swipe + "</span></div>" +
        '<div class="gd-p"><span class="gd-cap">' + T.how + "</span><h4>" + f.n + "</h4><p>" + f.d + '</p><div class="r"><b>' + T.good + "</b><span>" + f.g +
        '</span><b class="x">' + T.care + "</b><span>" + f.c + '</span></div><span class="nt">' + T.exNote + "</span></div>";
    }).join("");
    var dots = T.faces.map(function () { return "<i></i>"; }).join("");
    return '<div class="gd-b"><span class="gd-k">' + T.fK + "</span><h2>" + T.fT + '</h2><p class="gd-lead">' + T.fLead + '</p><div class="gd-sl"><div class="gd-tk">' + panels +
      '</div><div class="gd-nav"><div class="gd-dots">' + dots + '</div><div class="gd-ar"><button type="button" data-d="-1" aria-label="' + T.prev + '">←</button><button type="button" data-d="1" aria-label="' + T.next + '">→</button></div></div></div><p class="gd-tip">' + T.fTip + "</p></div>";
  }
  function trendsHtml(T) {
    function grid(arr, pre) {
      return '<div class="gd-g t">' + arr.map(function (x, i) {
        return '<div class="gd-c"><span class="gd-n">' + pre + (i + 1) + "</span><h4>" + x.n + "</h4><p>" + x.d + "</p></div>";
      }).join("") + "</div>";
    }
    return '<div class="gd-b"><span class="gd-k">' + T.tK + "</span><h2>" + T.tT + '</h2><p class="gd-lead">' + T.tLead + "</p>" +
      '<div class="gd-h3">' + T.now + "</div>" + grid(T.nowL, "N") + '<div class="gd-h3">' + T.cls + "</div>" + grid(T.clsL, "C") + "</div>";
  }

  function render() {
    var lg = (window.I18N && window.I18N.lang) || "ru";
    var T = L[lg] || L.ru;
    sec.innerHTML = '<div class="gd-in">' + baHtml(T) + facesHtml(T) + trendsHtml(T) + "</div>";
    sec.setAttribute("lang", lg);
    var tk = sec.querySelector(".gd-tk");
    if (tk) {
      var dots = sec.querySelectorAll(".gd-dots i"), ps = tk.querySelectorAll(".gd-p");
      var dirRtl = document.documentElement.getAttribute("dir") === "rtl";
      for (var q = 0; q < ps.length; q++) ps[q].setAttribute("dir", dirRtl ? "rtl" : "ltr");
      var upd = function () {
        var w = ps[0].getBoundingClientRect().width + 12, i = Math.round(tk.scrollLeft / w);
        var step = ps.length > 0 && window.innerWidth >= 900 ? 2 : 2; // пары: лицо + объяснение
        var shape = Math.min(dots.length - 1, Math.floor(i / step));
        for (var k = 0; k < dots.length; k++) dots[k].className = k === shape ? "on" : "";
      };
      tk.addEventListener("scroll", function () { clearTimeout(tk._t); tk._t = setTimeout(upd, 60); });
      var go = function (d) {
        var w = ps[0].getBoundingClientRect().width + 12;
        var wide = window.innerWidth >= 900, per = wide ? 2 : 1;
        var cur = Math.round(tk.scrollLeft / w);
        tk.scrollTo({ left: Math.max(0, (cur + d * per) * w), behavior: "smooth" });
      };
      var bs = sec.querySelectorAll(".gd-ar button");
      for (var m = 0; m < bs.length; m++) (function (b) { b.addEventListener("click", function () { go(parseInt(b.getAttribute("data-d"), 10)); }); })(bs[m]);
      upd();
    }
    var sl = sec.querySelectorAll(".gd-ba");
    for (var i = 0; i < sl.length; i++) (function (box) {
      var inp = box.querySelector("input");
      inp.addEventListener("input", function () { box.style.setProperty("--p", inp.value + "%"); });
    })(sl[i]);
  }
  render();
  document.addEventListener("i18n:lang", render);
  setTimeout(render, 400); // i18n.js грузится после нас: перерисуем с выбранным языком
})();
