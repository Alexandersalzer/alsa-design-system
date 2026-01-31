page
    name
    locale
    props
    seo
        secitons
            type
            props
            layout
            animation
            order
            patterns
                type
                props
                layout
                animation
                order
                    components
                    type
                    props


page
    name
    locale
    props
    seo
        order
            secitons
              key
                type
                props
                    layout
                    animation
                order
                patterns
                  key
                    type
                    props
                        layout
                        animation
                    order
                        components
                          key
                            type
                            props
                                content
                                action
                                    type
                                    settings
                                        href




ett exemepel: portfolio grid

först har vi section layout som styr så att portfoliogrid hamnar under section header och under tab group
inuti portfolio pattern finns en parent grid layout som i sin tur har återkommande card layouts och varje kort är det som håller i dem specifika components. 

Jämför detta med exemeplvis Buttongroup:

Section layout (just nu LayoutRenderer) styr vart pattern placeras


SectionHeader är en hårdkodad pattern med strikta regler som går att följa i LayoutRenderer


💡 INSIKT: Två Pattern-Typer
TYPE A: Simple Patterns (SectionHeader, ButtonGroup)
Direkt rendering av components i linear layout
Använder order array
Ingen nästling behövs


TYPE B: Card Container Patterns (Grid, Alternating, Masonry)
Wrapper layout som itererar över card components

