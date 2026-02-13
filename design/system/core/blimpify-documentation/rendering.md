--> description of the Blimpify rendering system

In this file you'll find all projects/repos that is dependent on the rendering system


--<> RENDERING & DISTRUBERING <>--
Hosting: AWS (Elastic Beanstalk / S3 / CloudFront m.fl.)
Klient hemsidor distruberas genom statiskt innehåll i S3-buckets tillsammans med cloudfronts. För att generera statiskt innehåll så använder vi oss av reusable github workflow som tillsammans med blimpify-core läser av JSON filer och genererar statiska filer med next export. Filerna laddas sedan upp till S3-bucket.


--<> BLIMPIFY-CORE <>-- 
Next.js (statisk + dynamisk rendering)
Vi har utvecklat en react/next kärna som använder blimpify-ui för att kunna rendera kompontenter/patterns/sektioner/pages genom vårt system. Står som kärnan i alla våra klienters hemsidor. Grund målet har varit att kunna ha single source of truth och en central kärna som appliceras på alla klient hemsidor. Kärnan är utvecklat i react/next och använder sig av hjälp komponenter från blimpify-ui som möjliggör rendering i run time och build time.



--<> BLIMPIFY-UI <>--
Vi har utvecklat ett eget komponent/design system som distruberas som ett private npm package. Innehåller vårt design system. Används för alla front end project och hemsidor vi har. Grund målet är att kunna ha ett återanvändbart bibliotek som möjliggör automation och ett designsystem som aldrig går att förstöra. Kort sagt, det går inte att göra fula hemsidor.



--<> BLIMPIFY-WORKSPACE <>--
Vi har utvecklat ett eget development workspace. Använder sig av blimpify-core som npm paket för rendering och består av en clients och templates mapp som möjliggör development rendering i runtime. Här hittar vi även diverse scripts som gör att man enkelt kan hämta github repos, kan redigera JSON filer åt klienter eller templates och sedan inbyggt script som möjliggör uppladdning/deploy.



--<> CMS-systemet <>--
Hämtar in JSON filer från github via api och använder kärnkomponenterna Navbar, Footer och Sections som redan används i BLIMPIFY-CORE för att möjliggöra dynamisk rendering i real tid (run time). Vidare används next iframe för att rendera sidan. Varje komponent/pattern/sektion/page har tilldelade keys (ex. button_khli8N7) som gör att vi kan göra uppdateringar i real tid genom DOM uppdateringar. När någon sparar en ändring så triggas en push till github repo med [skip ci] tagg, för att inte trigga en riktig deploy. När någon sedan klickar "Publciera" på en viss version så triggas website-deploy.yml för den versionen och uppdateringarna laddas upp till deras S3 bucket och cloudfront invalidation körs.