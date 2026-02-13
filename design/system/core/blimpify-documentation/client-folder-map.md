--> Client side folder structure is presented below:

.github/   --> enabling triggering of reusable github action workflow
public/
   |_____content/  -->  central bank of all language based content
   |         |
   |         |_____[locale]/
   |                  |______sv/  --> example language
   |                         |
   |                         |_____shells   --> stores content for shells (footer & navbar)
   |                         |         |
   |                         |         |____footer.json
   |                         |         |____navbar.json
   |                         |
   |                         |______pages   --> stores page content
   |                                   |
   |                                   |______start.json
   |                                   |______page_{random6digit}
   |
   |______pages/   --> contains structured json for sections/patterns/components for each page
   |         |
   |         |_____start.json
   |         |_____page_{random6digit}
   |
   |______design/   --> contains all adjustable global design tokens
   |         |
   |         |_____design.json
   |
   |______shells   --> contains structured json for navbar & footer
             |_____navbar.json
             |_____footer.json