// Traductions anglaises des textes de la page (le français est dans le HTML)
// et textes dynamiques dans les deux langues.

const EN = {
  'ui.skip': 'Skip to content', 'ui.logo': 'TIKI Cassis, home', 'ui.navlabel': 'Main navigation', 'ui.langlabel': 'Lire en français',
  'ui.lang': 'FR', 'ui.sound': 'Hear the sea', 'ui.calm': 'Calm mode', 'ui.book': 'Book', 'ui.menu': 'Open the menu', 'ui.menuLabel': 'Menu',
  'ui.quai': 'Quai Saint-Pierre, boat no. 5, Cassis', 'ui.quick': 'Quick actions', 'ui.call': 'Call', 'ui.request': 'Request',
  'ui.todo': 'to be completed', 'ui.todoReviews': 'to be completed with real reviews', 'ui.copy': 'Copy',
  'nav.home': 'Home', 'nav.formules': 'Outings & prices', 'nav.contact': 'Contact & booking',
  'nav.homeEm': '<em>Home</em>', 'nav.formulesEm': 'Outings <em>&amp; prices</em>', 'nav.contactEm': 'Contact <em>&amp; booking</em>',
  'foot.pitch': 'A traditional wooden boat built in 1958. Sea trips and calanque tours from Cassis, all year round.',
  'foot.nav': 'Explore', 'foot.find': 'Find us', 'foot.addr1': 'Port of Cassis (13260)', 'foot.addr2': 'Quai Saint-Pierre, boat no. 5',
  'foot.legal': 'Information', 'foot.mentions': 'Legal notice', 'foot.privacy': 'Privacy', 'foot.cookies': 'Cookies',
  'foot.groupement': 'Groupement des Bateliers Cassidens', 'foot.demo': 'Demo mock-up: simulated forms, content to be approved',
  'ct.phone': 'Phone and WhatsApp', 'ct.mail': 'Email', 'ct.form': 'Private charter request', 'ct.formv': 'Date, duration, number of guests', 'ct.formcta': 'Make a request',

  'home.hero.alt': 'Wooden excursion boat leaving the port of Cassis, colourful facades behind',
  'home.hero.eyebrow': 'Traditional boat · built in 1958',
  'home.hero.title': 'Sail into the heart <em>of the Calanques</em> National Park',
  'home.hero.lead': 'On board a traditional wooden boat. Open all year round, departing from the Port of Cassis.',
  'home.hero.cta1': 'Build my trip', 'home.hero.cta2': 'Contact the skipper',
  'home.hero.ai': 'Illustrative AI-generated video', 'home.hero.meta1': 'Quai Saint-Pierre · boat no. 5', 'home.hero.meta2': '12 passengers maximum', 'home.hero.price': 'Private charter from €300', 'home.hero.scroll': 'Cast off',
  'home.dicton.eyebrow': 'The famous Provençal saying',
  'home.dicton.tr': 'Whoever has seen Paris but not <span class="mark">Cassis<svg class="mark__ring" viewBox="0 0 220 90" preserveAspectRatio="none" aria-hidden="true"><path data-draw d="M18 52 C 14 22, 80 8, 128 10 C 186 12, 214 32, 206 54 C 198 78, 132 86, 82 82 C 40 79, 8 66, 22 40 C 30 26, 60 18, 96 16"/></svg></span> has seen nothing.',
  'home.dicton.attr': 'A Provençal saying, commonly attributed to Frédéric Mistral.',
  'home.dicton.alt': 'The TIKI moored at the quay under its number 5 parasol, Cassis facades behind', 'home.dicton.cap': 'Cassis, Quai Saint-Pierre',
  'home.ancre.eyebrow': 'Who it is for', 'home.ancre.title': 'Weigh anchor in Cassis',
  'home.c1.alt': 'Boat entering a narrow calanque between two white cliffs', 'home.c1.k': '3 to 9 calanques', 'home.c1.t': 'Calanque tours', 'home.c1.p': 'From Cassis towards Marseille: Port-Miou, Port-Pin, En-Vau, all the way to Sormiou.',
  'home.c2.alt': 'Turquoise water of a calanque seen from above, between white rocks and pines', 'home.c2.k': 'Turquoise water', 'home.c2.t': 'Swimming &amp; relaxing', 'home.c2.p': 'Stops for a swim, below Cap Canaille or inside the calanques.',
  'home.c3.alt': 'The TIKI at anchor facing the setting sun, swimmers in the water', 'home.c3.k': 'Summer evenings', 'home.c3.t': 'Sunset &amp; food on board', 'home.c3.p': 'A free Provençal snack in the evening, and your own meals on board, just like at home.',
  'home.c4.alt': 'The TIKI at anchor in turquoise water off a pine-covered shore', 'home.c4.k': '1 to 8 hours', 'home.c4.t': 'Tailor-made private charter', 'home.c4.p': 'Your own programme, set with the skipper according to your wishes and the weather.',
  'home.c.more1': 'See the route', 'home.c.more2': 'Build my trip', 'home.c.more3': 'Evening trips', 'home.c.more4': 'See prices',
  'home.route.eyebrow': 'Sea chart', 'home.route.title': 'Up to 9 calanques, <em>from Cassis to Marseille</em>',
  'home.route.note': 'Round-trip sailing time from the port, without stops. Add as much swimming and relaxing time as you like.',
  'home.route.legal': 'Indicative chart, not for navigation.',
  'home.s0.alt': 'Boat in a calanque seen from the cliff, between pine trees', 'home.s0.d': '1 h · 3 calanques', 'home.s0.t': 'Port-Miou, Port-Pin, En-Vau', 'home.s0.p': 'The three closest to the port: ideal for a first discovery, or to keep time for swimming.',
  'home.s1.alt': 'Turquoise calanque surrounded by pines, seen from above', 'home.s1.d': '1 h 20 · 5 calanques', 'home.s1.t': '+ L’Oule and Devenson', 'home.s1.p': 'Along the great white cliffs as far as Devenson.',
  'home.s2.alt': 'Inside a sea cave lit by turquoise blue water', 'home.s2.d': '2 h 10 · 8 calanques', 'home.s2.t': '+ Œil de Verre, Sugiton, Morgiou', 'home.s2.p': 'And a few hidden treasures whose secrets the skipper knows: the Blue Grotto, the Cat of the Needle.',
  'home.s3.alt': 'The TIKI sailing below a rocky headland covered in pines', 'home.s3.d': '3 h · 9 calanques', 'home.s3.t': '+ Sormiou, at the gates of Marseille', 'home.s3.p': 'The grand tour of the National Park, from Cassis to Marseille and back.',
  'home.s4.alt': 'Sea view from the shaded terrace of the Île Verte restaurant', 'home.s4.d': '6 h minimum · the other way', 'home.s4.t': 'Cap Canaille, Figuerolles, Mugel, Île Verte', 'home.s4.p': 'Below the highest sea cliff in France, then a swim around Île Verte and lunch on the island (restaurant open from April to October, weather permitting).',
  'home.tiki.video': 'Aerial view of the TIKI sailing on turquoise water', 'home.tiki.cap': 'The TIKI from the sky', 'home.tiki.eyebrow': 'The boat', 'home.tiki.title': 'The TIKI, <em>a boat from 1958</em>',
  'home.tiki.p1': 'A traditional wooden boat and a landmark of the Port of Cassis, it has welcomed visitors for more than 50 years to explore the calanques and share great adventures.',
  'home.tiki.p2': 'With 12 passengers maximum, everyone enjoys comfort and an intimate experience. In 2026 it was given a full makeover.',
  'home.tiki.k1': 'year built', 'home.tiki.k2': 'long', 'home.tiki.k3': 'wide', 'home.tiki.k4': 'passengers max.',
  'home.tiki.groupement': 'The TIKI belongs to the <strong>Groupement des Bateliers Cassidens</strong>: 15 boats seating 12 to 75. For groups of more than 12, the skipper will direct you to a partner boat.',
  'home.pl1.alt': 'Varnished wooden aft deck of the TIKI with its name plate, Cassis behind', 'home.pl1.c': 'The aft deck, redone in 2026',
  'home.pl2.alt': 'The TIKI wheelhouse, wooden wheel, view of the harbour facades', 'home.pl2.c': 'The wheelhouse',
  'home.pl3.alt': 'Wooden benches under the TIKI awning', 'home.pl3.c': 'Benches in the shade of the awning',
  'home.pl4.alt': 'A group of smiling passengers on board in a calanque', 'home.pl4.c': 'A family day in a calanque',
  'home.cap.alt': 'Mathieu, skipper of the TIKI, at the helm', 'home.cap.eyebrow': 'The skipper', 'home.cap.title': 'Meet Mathieu, <em>born and raised here</em>',
  'home.cap.quote': '“Let me take you out to sea the way we love it here: simple, friendly, full of sunshine and wonder.”',
  'home.cap.sign': 'Mathieu, passionate skipper', 'home.cap.chip1': 'Reply within 24 h', 'home.cap.chip2': '100% personalised programme',
  'home.cap.joutealt': 'Provençal water jousting: a jouster falls into the water from the platform', 'home.cap.jt': 'Also a jouster with the Francs Jouteurs Cassidens',
  'home.cap.jp': 'From June to September, Provençal water jousting in the port on Wednesdays and Saturdays around 6 pm. Try it yourself: €10 per person to support the club, 30 min to 2 h, open to everyone.',
  'home.gal.eyebrow': 'Logbook', 'home.gal.title': 'The TIKI <em>in pictures</em>', 'home.gal.insta': 'Follow the TIKI on Instagram',
  'home.g1.alt': 'Bow deck of the TIKI with its winch, facing the facades of the port of Cassis at the end of the day', 'home.g1.c': 'The bow deck, in port',
  'home.g2.alt': 'The TIKI below an ochre cliff lit by the evening sun, passengers on board', 'home.g2.c': 'Below the cliff, at golden hour',
  'home.g3.alt': 'Central teak gangway leading to the wheelhouse, wooden table with an anchor', 'home.g3.c': 'The new teak deck',
  'home.g4.alt': 'Picnic laid out on board: cheese, olives, cherry tomatoes, cool box', 'home.g4.c': 'Picnic, just like at home',
  'home.g5.alt': 'Two jousters facing off on boats in a harbour', 'home.g5.c': 'Provençal water jousting',
  'home.g6.alt': 'Varnished wooden bench and locker on board, Cassis facades behind', 'home.g6.c': 'Varnished wood and Cassis facades',
  'home.gold.eyebrow': 'All summer long', 'home.gold.title': 'Summer evenings, <em>at golden hour</em>', 'home.gold.alt': 'The TIKI below a tall ochre cliff at sunset',
  'home.gold.t1': 'Calanque tour', 'home.gold.t2': 'Swim below Cap Canaille', 'home.gold.t3': 'Free Provençal snack', 'home.gold.t4': 'Sunset',
  'home.gold.lead': 'Milder temperatures, water as warm as ever and beautiful sunsets, depending on the time.',
  'home.gold.k1': 'Shared boat · 2 h', 'home.gold.pp': '/ person', 'home.gold.p1': 'Departure confirmed from 8 people.',
  'home.gold.k2': 'Private charter · 1 to 12 people', 'home.gold.2h': '2 h', 'home.gold.p2': '€600 for 3 h.',
  'home.gold.apalt': 'Tapenade toasts and TIKI cups on the boat table, facing Cap Canaille', 'home.gold.ap': 'The free evening snack: a soft drink and homemade tapenade, facing Cap Canaille.',
  'home.gold.cta': 'See evening trips',
  'home.night.eyebrow': 'Special events', 'home.night.title': 'Fireworks <em>from the sea</em>',
  'home.night.lead': 'Rather not be squeezed on the beach? Book a front-row seat: a trip through the calanques, a relaxing aperitif stop, then the fireworks seen from the sea.',
  'home.night.cta': 'Request a seat', 'home.night.alt': 'Golden and turquoise fireworks in a night sky',
  'home.rdv.eyebrow': 'Where to find the TIKI', 'home.rdv.title': 'Quai Saint-Pierre, <em>boat no. 5</em>', 'home.rdv.pass': 'Boarding pass', 'home.rdv.to': 'Calanques',
  'home.rdv.f1': 'Departure', 'home.rdv.f2': 'Quay', 'home.rdv.f3': 'Skipper', 'home.rdv.f4': 'Season', 'home.rdv.f5': 'Times', 'home.rdv.f6': 'Passengers',
  'home.rdv.v1': 'Port of Cassis (13260)', 'home.rdv.v4': 'All year round', 'home.rdv.v6': '1 to 12', 'home.rdv.boat': 'Boat',
  'home.rdv.n1': 'Petit Casino 30 m away', 'home.rdv.n2': 'Spar 170 m away', 'home.rdv.n3': 'U-tile 270 m away', 'home.rdv.map': 'Get directions',
  'home.rdv.alt': 'The TIKI moored at the quay under its parasol marked 5 Tiki', 'home.rdv.tag': 'You are here: boat no. 5',
  'home.rdv.std': 'A standard tour, without private charter?', 'home.rdv.stdp': 'Tickets are sold only by the Groupement des Bateliers Cassidens, online or on Quai Saint-Pierre. You will be placed on one of the Groupement’s 15 boats, not necessarily the TIKI.',
  'home.rdv.stdl': 'Groupement website',
  'home.final.eyebrow': 'Information and bookings', 'home.final.title': 'The skipper replies <em>within 24 h</em>', 'home.final.ta': 'Listed on Tripadvisor', 'home.final.reviews': 'Customer reviews:',

  'fo.hero.eyebrow': 'Open all year · 7 days a week', 'fo.hero.title': 'Outings <em>and prices</em>',
  'fo.hero.lead': 'Charter the TIKI for an hour or a whole day, join a summer evening trip, or watch the fireworks from the sea.',
  'fo.jump': 'On this page', 'fo.j1': 'Build my trip', 'fo.j2': 'Day rates', 'fo.j3': 'Summer evenings', 'fo.j4': 'Fireworks', 'fo.j5': 'Standard tours', 'fo.j6': 'Eating on board', 'fo.j7': 'Good to know',
  'fo.comp.eyebrow': 'Trip builder', 'fo.comp.title': 'Your trip, <em>your price</em>', 'fo.comp.moment': 'When',
  'fo.comp.jour': 'Daytime', 'fo.comp.jours': 'All year, 1 to 8 h', 'fo.comp.soiree': 'Evening', 'fo.comp.soirees': 'Summer, 2 or 3 h', 'fo.comp.evt': 'Fireworks', 'fo.comp.evts': '14 July, 15 August',
  'fo.comp.date': 'Preferred date', 'fo.comp.formule': 'Evening option', 'fo.comp.privee': 'Private', 'fo.comp.privees': 'The boat for you, 1 to 12 people',
  'fo.comp.partagee': 'Shared boat', 'fo.comp.partagees': '€50 per person, 2 h', 'fo.comp.duree': 'Duration', 'fo.comp.pers': 'Passengers',
  'fo.comp.less': 'One passenger fewer', 'fo.comp.more': 'One more passenger', 'fo.comp.persnote': '12 passengers maximum. Beyond that, the skipper will direct you to a partner boat of the Groupement.',
  'fo.comp.bbq': 'Barbecue on board · €50', 'fo.comp.bbqs': 'The skipper does the grilling, you bring what you want to cook. To be confirmed: the National Park bans the use of fire in the Calanques.',
  'fo.comp.prog': 'Indicative programme', 'fo.comp.prognote': 'Adjusted with the skipper to your wishes and the weather.', 'fo.comp.cta': 'Request this trip',
  'fo.rates.eyebrow': 'Daytime private charter', 'fo.rates.title': 'The boat for you, <em>from 1 to 8 hours</em>',
  'fo.rates.lead': 'A tailor-made programme, set with you according to your wishes and the weather. Price for the whole boat, up to 12 passengers.',
  'fo.rates.high': 'High season', 'fo.rates.highw': 'June to September, plus bridge days, Sundays and public holidays in May.', 'fo.rates.low': 'Low season', 'fo.rates.loww': 'October to May.',
  'fo.std.eyebrow': 'Without private charter', 'fo.std.title': 'Standard <em>tours</em>', 'fo.std.lead': 'Tours of 3 to 9 calanques, departing all year round, 7 days a week, from the Port of Cassis.',
  'fo.std.p': 'Tickets for these tours are sold only by the Groupement des Bateliers Cassidens, online or on site at Quai Saint-Pierre. Buying a standard tour does not guarantee a seat on the TIKI: you will be placed on one of the Groupement’s 15 boats, of which the TIKI is one.',
  'fo.std.cta': 'Tickets on the Groupement website', 'fo.std.alt': 'Excursion boat leaving the port of Cassis', 'fo.std.balt': 'Brochure of the standard tours with a map of the calanques',
  'fo.std.bt': 'Tour details and prices', 'fo.std.bp': 'The Groupement brochure, as a PDF (in French).', 'fo.std.bl': 'Open the brochure',
  'fo.bord.eyebrow': 'Eating and drinking on board', 'fo.bord.title': 'On the TIKI, <em>just like at home</em>',
  'fo.bord.lead': 'Bring a picnic or drinks, order pizzas or a caterer. A large cool box with ice packs keeps everything cold.',
  'fo.bord.l1': '<strong>Supermarkets within 300 m</strong>: Petit Casino (avenue Victor Hugo, 30 m), Spar (10 rue de l’Arène, 170 m), U-tile (32 rue de l’Arène, 270 m).',
  'fo.bord.l2': '<strong>Pizzas and takeaway</strong> from the harbour restaurants, ideal for a trip around midday.',
  'fo.bord.l3': '<strong>Bakeries and caterer</strong>: salads, sandwiches, quiches; La Caille d’Or prepares baskets for the boat.',
  'fo.bord.l4': '<strong>In the evening</strong>, a Provençal snack is offered: a soft drink and homemade tapenade.',
  'fo.bord.l5': '<strong>Barbecue on board</strong> (€50 option): the skipper grills, you bring the food. <span class="todo">to be confirmed with the National Park</span>',
  'fo.faq.eyebrow': 'Good to know', 'fo.faq.title': 'The skipper’s <em>tips</em>',
  'fo.faq.q1': 'Which duration should I choose?', 'fo.faq.a1': 'Allow 1 h for 3 calanques, 1 h 20 for 5, 2 h 10 for 8 and 3 h for 9, without stops. Add the swimming or break time you want. Examples: 2 h in the daytime for 8 calanques, or 3 calanques and 40 minutes of swimming below Cap Canaille; 5 h for all 9 calanques with several stops; 6 h for Île Verte with lunch on the island.',
  'fo.faq.q2': 'Daytime or evening?', 'fo.faq.a2': 'In the daytime the sun shines through the water and reveals the turquoise of the calanques: the best time for the Blue Grotto, but also the busiest, and it can be very hot in midsummer. In the evening the light is softer, the sea still warm, and golden hour colours the cliffs. Private evening trips cost €100 less than daytime in high season.',
  'fo.faq.q3': 'What if the day is classified red?', 'fo.faq.a3': 'When the fire risk is very high, access to the National Park massifs is banned by land. Visiting the calanques by boat remains possible, but all landing is banned: a trip with lunch on Île Verte may then be adapted.',
  'fo.faq.q4': 'What about the weather?', 'fo.faq.a4': 'The programme of private trips is set with the skipper according to your wishes and the weather conditions.', 'fo.faq.a4todo': 'Cancellation terms to be completed',
  'fo.faq.q5': 'We are more than 12', 'fo.faq.a5': 'The TIKI takes 12 passengers maximum. The Groupement des Bateliers Cassidens brings together 15 boats seating 12 to 75: the skipper will direct you to a partner boat.',
  'fo.faq.q6': 'Another water activity in Cassis?', 'fo.faq.a6': 'Provençal water jousting: from June to September, Wednesdays and Saturdays around 6 pm in the port. Watch from the quay or try it on the platform, 2 m above the water. €10 per person to support the Francs Jouteurs Cassidens club.',
  'fo.eve.title': 'An evening <em>on board the TIKI</em>', 'fo.eve.note': 'Example of a 3-hour private evening: 5 calanques, a free aperitif below Cap Canaille, a swim, golden hour and sunset.', 'fo.eve.cta': 'Book an evening',
  'fo.night.price': 'Price:', 'fo.final.eyebrow': 'Special request, question, booking', 'fo.final.title': 'Contact <em>the skipper</em>',

  'co.eyebrow': 'Contact and booking', 'co.title': 'Meet Mathieu, <em>passionate skipper</em>',
  'co.p1': 'A passionate skipper born and raised here, I’ll take you out to sea the way we love it here: simple, friendly, full of sunshine and wonder.',
  'co.p2': 'For a private charter, fill in the request below. I always reply within 24 hours; please check your spam folder.',
  'co.p3': 'For standard tours without private charter, go to the Groupement des Bateliers Cassidens website or straight to Quai Saint-Pierre.',
  'co.req.eyebrow': 'Private charter request', 'co.req.title': 'Let’s plan <em>your trip</em>', 'co.req.s1': 'Trip', 'co.req.s2': 'Date and guests', 'co.req.s3': 'Your details',
  'co.req.l1': 'Which trip?', 'co.req.l2': 'When, and how many?', 'co.req.l3': 'Your details',
  'co.t.jour': 'Daytime private charter', 'co.t.jours': '1 to 8 h, all year', 'co.t.soiree': 'Private evening', 'co.t.soirees': 'Summer, 2 or 3 h',
  'co.t.partagee': 'Shared evening boat', 'co.t.partagees': '€50 per person', 'co.t.evt': 'Fireworks', 'co.t.evts': '14 July, 15 August', 'co.t.info': 'Just a question', 'co.t.infos': 'I reply within 24 h',
  'co.bbq': 'To be confirmed: the National Park bans the use of fire in the Calanques.',
  'co.f.date': 'Preferred date', 'co.f.heure': 'Departure time', 'co.f.duree': 'Duration', 'co.f.pers': 'Number of people', 'co.f.nom': 'First and last name', 'co.f.tel': 'Phone', 'co.f.mail': 'Email', 'co.f.msg': 'Message (wishes, occasion, questions)',
  'co.done.t': 'Your request is ready', 'co.done.p': 'This is a mock-up: no request has been sent. On the live site, the skipper will receive it and reply within 24 hours.',
  'co.done.copy': 'Copy the summary', 'co.done.again': 'New request', 'co.prev': 'Back', 'co.next': 'Continue', 'co.send': 'Send the request (simulation)',
  'co.recap': 'Summary', 'co.recapnote': 'Indicative price based on the published rates. The skipper confirms the programme and the price.',
  'co.rdv.lead': 'Port of Cassis (13260). The TIKI is moored at Quai Saint-Pierre, under its number 5 parasol.',

  'ml.eyebrow': 'Legal information', 'ml.title': 'Legal <em>notice</em>',
  'ml.intro': 'In accordance with French law no. 2004-575 of 21 June 2004 on confidence in the digital economy (LCEN), here are the parties involved in the tikicassis.fr website.',
  'ml.h1': 'Publisher', 'ml.p1': 'TIKI CASSIS, sole proprietorship represented by Mr Mathieu Allegre.<br>SIRET: 984 159 111 00017<br>Address: 13260 Cassis <span class="todo">full address to be completed</span><br>Phone: +33 6 68 26 33 45<br>Email: calanques@tikicassis.fr<br>Publication manager: Mathieu Allegre',
  'ml.h2': 'Hosting', 'ml.p2': 'Mock-up hosted by Vercel Inc., United States (vercel.com). <span class="todo">to be updated with the final host</span>',
  'ml.h3': 'Intellectual property', 'ml.p3': 'The texts, images, photographs, logos and videos on this site belong to the publisher unless stated otherwise. Portrait of the skipper: Thomas Bertini Photography. The opening video on the home page is an illustration generated by artificial intelligence (Grok): the boat and landscape shown are synthetic images. Any reproduction without prior written permission is prohibited.',
  'ml.h4': 'Personal data and cookies', 'ml.p4': 'This mock-up sends no data and uses no analytics cookies. Your language and calm mode choices are kept in your browser. <span class="todo">privacy policy of the final site to be completed</span>',
  'ml.h5': 'Applicable law', 'ml.p5': 'This site is governed by French law. In the event of a dispute, and failing an amicable settlement, the French courts alone have jurisdiction.'
};

// Textes produits par les scripts
const DYN = {
  fr: {
    high: 'Haute saison', low: 'Basse saison', summer: 'juin à septembre', sunday: 'dimanche de mai', holiday: 'jour férié', bridge: 'pont de mai, à confirmer', offpeak: 'octobre à mai',
    calanques: (n) => `${n} / 9 calanques`, hours: (h) => `${h} h`, boatPrice: 'Bateau privatisé', perPerson: (n, p) => `${n} pers. × ${p}`,
    bbq: 'Option barbecue (à confirmer)', total: 'Total indicatif', onRequest: 'Tarif sur demande', minShared: 'Départ confirmé à partir de 8 personnes.',
    eveningOff: 'Les soirées ont lieu l’été (juin à septembre, dates exactes à confirmer avec le capitaine).',
    over12: 'Le TIKI accueille 12 passagers au maximum : pour un groupe plus grand, le capitaine vous oriente vers un bateau partenaire du Groupement.',
    bridgeNote: 'Ce jour est un pont de mai : tarif haute saison à confirmer avec le capitaine.',
    progDay: (r, f) => r.palier ? `Jusqu’à ${r.palier.n} calanques (${r.noms.join(', ')}), soit ${f(r.palier.minutes)} de navigation${r.reste ? `, et environ ${f(r.reste)} pour la baignade, la détente ou un repas à bord` : ', sans arrêt baignade'}.` : '',
    progIle: ' Autre idée pour cette durée : direction l’île Verte, baignade et déjeuner sur l’île.',
    prog2day: 'Exemple du capitaine : 8 calanques sans arrêt, ou 3 calanques et 40 minutes de baignade sous le Cap Canaille.',
    progEve2: 'Visite des calanques, baignade sous le Cap Canaille, encas provençal offert et coucher de soleil.',
    progEve3: 'Visite de 5 calanques, apéritif offert sous le Cap Canaille, baignade, heure dorée et coucher de soleil.',
    progShared: 'Visite des calanques, baignade sous le Cap Canaille, encas provençal offert et coucher de soleil, avec d’autres passagers.',
    progEvt: 'Balade dans les calanques, arrêt apéro-détente, puis le feu d’artifice depuis la mer.',
    past: 'Passé', upcoming: 'À venir', toConfirm: 'Date à confirmer', edition: (y) => `Édition ${y}`,
    offSeason: (y) => `Hors saison · retour à l’été ${y}, dates à confirmer`, inSeason: 'En saison : sorties du soir tout l’été',
    copied: 'Copié', copyFail: 'Sélectionnez le texte pour le copier',
    errDate: 'Choisissez une date à venir.', errPers: 'Indiquez un nombre de personnes.', errNom: 'Indiquez votre nom.', errMail: 'Indiquez un e-mail valide, par exemple nom@exemple.fr.', errContact: 'Indiquez un e-mail valide.',
    type: { jour: 'Privatisation en journée', soiree: 'Soirée privatisée', partagee: 'Soirée en bateau partagé', evenement: 'Feu d’artifice', info: 'Question' },
    rDate: 'Date', rHeure: 'Départ', rDuree: 'Durée', rPers: 'Personnes', rSaison: 'Saison', rType: 'Sortie', rBbq: 'Barbecue', yes: 'Oui (à confirmer)', toDefine: 'à définir',
    evtLabel: (e, y) => `${e.fr} ${y}`,
    pauseVideo: 'Mettre la vidéo en pause', playVideo: 'Relancer la vidéo',
    sun: (kind, tomorrow, t) => kind === 'set' ? `Coucher du soleil ce soir à Cassis : ${t}` : (tomorrow ? `Lever du soleil demain à Cassis : ${t}` : `Lever du soleil à Cassis : ${t}`)
  },
  en: {
    high: 'High season', low: 'Low season', summer: 'June to September', sunday: 'Sunday in May', holiday: 'public holiday', bridge: 'May bridge day, to be confirmed', offpeak: 'October to May',
    calanques: (n) => `${n} / 9 calanques`, hours: (h) => `${h} h`, boatPrice: 'Private boat', perPerson: (n, p) => `${n} people × ${p}`,
    bbq: 'Barbecue option (to be confirmed)', total: 'Indicative total', onRequest: 'Price on request', minShared: 'Departure confirmed from 8 people.',
    eveningOff: 'Evening trips run in summer (June to September, exact dates to be confirmed with the skipper).',
    over12: 'The TIKI takes 12 passengers maximum: for a larger group, the skipper will direct you to a partner boat of the Groupement.',
    bridgeNote: 'This day is a May bridge day: high-season price to be confirmed with the skipper.',
    progDay: (r, f) => r.palier ? `Up to ${r.palier.n} calanques (${r.noms.join(', ')}), that is ${f(r.palier.minutes)} of sailing${r.reste ? `, plus about ${f(r.reste)} for swimming, relaxing or a meal on board` : ', without a swimming stop'}.` : '',
    progIle: ' Another idea for this duration: head for Île Verte, swim and have lunch on the island.',
    prog2day: 'The skipper’s example: 8 calanques without stops, or 3 calanques and 40 minutes of swimming below Cap Canaille.',
    progEve2: 'Calanque tour, swim below Cap Canaille, free Provençal snack and sunset.',
    progEve3: '5 calanques, a free aperitif below Cap Canaille, a swim, golden hour and sunset.',
    progShared: 'Calanque tour, swim below Cap Canaille, free Provençal snack and sunset, with other passengers.',
    progEvt: 'A trip through the calanques, an aperitif stop, then the fireworks from the sea.',
    past: 'Past', upcoming: 'Upcoming', toConfirm: 'Date to be confirmed', edition: (y) => `${y} edition`,
    offSeason: (y) => `Off season · back in summer ${y}, dates to be confirmed`, inSeason: 'In season: evening trips all summer',
    copied: 'Copied', copyFail: 'Select the text to copy it',
    errDate: 'Choose a future date.', errPers: 'Enter a number of people.', errNom: 'Enter your name.', errMail: 'Enter a valid email, for example name@example.com.', errContact: 'Enter a valid email.',
    type: { jour: 'Daytime private charter', soiree: 'Private evening', partagee: 'Shared evening boat', evenement: 'Fireworks', info: 'Question' },
    rDate: 'Date', rHeure: 'Departure', rDuree: 'Duration', rPers: 'People', rSaison: 'Season', rType: 'Trip', rBbq: 'Barbecue', yes: 'Yes (to be confirmed)', toDefine: 'to be defined',
    evtLabel: (e, y) => `${e.en} ${y}`,
    pauseVideo: 'Pause the video', playVideo: 'Play the video',
    sun: (kind, tomorrow, t) => kind === 'set' ? `Sunset in Cassis tonight: ${t}` : (tomorrow ? `Sunrise in Cassis tomorrow: ${t}` : `Sunrise in Cassis: ${t}`)
  }
};

const originals = new WeakMap();
const attrOriginals = new WeakMap();
const listeners = new Set();

export const getLang = () => (document.documentElement.lang === 'en' ? 'en' : 'fr');
export const d = (key) => DYN[getLang()][key];
export const onLang = (fn) => listeners.add(fn);

export function apply(lang) {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    if (!originals.has(el)) originals.set(el, el.innerHTML);
    const k = el.dataset.i18n;
    el.innerHTML = lang === 'en' && EN[k] !== undefined ? EN[k] : originals.get(el);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach((el) => {
    if (!attrOriginals.has(el)) attrOriginals.set(el, {});
    const store = attrOriginals.get(el);
    el.dataset.i18nAttr.split(';').forEach((pair) => {
      const [attr, k] = pair.split(':');
      if (!(attr in store)) store[attr] = el.getAttribute(attr);
      el.setAttribute(attr, lang === 'en' && EN[k] !== undefined ? EN[k] : store[attr]);
    });
  });
  listeners.forEach((fn) => fn(lang));
}

export function setLang(lang) {
  try { localStorage.setItem('tiki-lang', lang); } catch (e) { /* stockage indisponible */ }
  apply(lang);
}
