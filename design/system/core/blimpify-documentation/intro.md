--<> BLIMPIFY DOCUMENTATION <>--

(Dela denna filen med AI agents så att de kan förstå vår infrastruktur)


Blimpify är ett SAAS bolag som utvecklar hemsidor åt andra företag.
Vi använder AWS services som cloudlösning för hosting och backend.
Slutmålet är ett fullt automatiserat flöde som är skalbart för miljontals klienter/hemsidor osv. Därav lägger vi stor vikt i att databastabeller, funktioner och flöden utvecklas med ett skalbart, hållbart och robust systemtänk där också säkerhet vägs in.


-- IM-DASHBOARD --
Vi har utvecklat en egen dashboard (im-dashboard), där våra klienter kan logga in och hantera sina hemsidor och sitt konto. - ett amplify projekt. 


-- IM-API & DB --
Backend: Node.js / Express API
Databas: PostgreSQL (multi-tenant)
Ett node.js projekt som distruberas genom elastic beanstalk. API:et står som grund för all vår backendhantering för våra frontend projekt.
Payments: Stripe (Checkout + Webhooks)


-- WEB -- 
Vår landingssida är ett react/next projekt som använder vårt komponent system och hostas genom amplify.