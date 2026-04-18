use leptos::prelude::*;
use leptos_meta::{provide_meta_context, MetaTags, Stylesheet, Title};
use leptos_router::{
    components::{Route, Router, Routes},
    StaticSegment,
};

use crate::components::{issue_board::IssueBoard, pipeline_view::PipelineView};

pub fn shell(options: LeptosOptions) -> impl IntoView {
    view! {
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <AutoReload options=options.clone()/>
                <HydrationScripts options=options.clone()/>
                <MetaTags/>
            </head>
            <body>
                <App/>
            </body>
        </html>
    }
}

#[component]
pub fn App() -> impl IntoView {
    provide_meta_context();

    view! {
        <Stylesheet id="leptos" href="/pkg/sp-02.css"/>
        <Title text="Ensi SP-02 Spike"/>

        <Router>
            <nav class="nav">
                <a href="/">"Board"</a>
                <a href="/pipeline">"Pipeline"</a>
            </nav>
            <main>
                <Routes fallback=|| view! { <p>"Page not found."</p> }>
                    <Route path=StaticSegment("") view=IssueBoard/>
                    <Route path=StaticSegment("pipeline") view=PipelineView/>
                </Routes>
            </main>
        </Router>
    }
}
