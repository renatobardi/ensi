use leptos::prelude::*;

#[derive(Clone, Debug, PartialEq)]
pub struct Stage {
    pub name: &'static str,
    pub description: &'static str,
}

const STAGES: &[Stage] = &[
    Stage { name: "Discovery", description: "Brief & PRD" },
    Stage { name: "Planning", description: "Stories & Estimation" },
    Stage { name: "Architecture", description: "System Design" },
    Stage { name: "Development", description: "Implementation" },
    Stage { name: "Review", description: "QA & Merge" },
];

#[component]
pub fn PipelineView() -> impl IntoView {
    let active_stage = RwSignal::new(2usize); // Architecture is active

    view! {
        <div class="pipeline-header">
            <h1>"Pipeline View"</h1>
            <p class="pipeline-subtitle">"Click a stage to activate it"</p>
        </div>

        <div class="pipeline">
            {STAGES.iter().enumerate().map(|(i, stage)| {
                let stage_name = stage.name;
                let stage_desc = stage.description;
                view! {
                    <div
                        class=move || {
                            let mut classes = vec!["pipeline-stage"];
                            let active = active_stage.get();
                            if i < active { classes.push("stage-done"); }
                            if i == active { classes.push("stage-active"); }
                            if i > active { classes.push("stage-pending"); }
                            classes.join(" ")
                        }
                        on:click=move |_| active_stage.set(i)
                    >
                        <div class="stage-indicator">
                            {move || if i < active_stage.get() {
                                view! { <span class="stage-check">"✓"</span> }.into_any()
                            } else {
                                view! { <span class="stage-number">{i + 1}</span> }.into_any()
                            }}
                        </div>
                        <div class="stage-info">
                            <div class="stage-name">{stage_name}</div>
                            <div class="stage-desc">{stage_desc}</div>
                        </div>
                    </div>
                    {if i < STAGES.len() - 1 {
                        Some(view! {
                            <div class=move || {
                                if i < active_stage.get() { "connector connector-done" } else { "connector" }
                            }/>
                        })
                    } else {
                        None
                    }}
                }
            }).collect::<Vec<_>>()}
        </div>

        <div class="pipeline-detail">
            <h2>"Current Stage: " {move || STAGES[active_stage.get()].name}</h2>
            <p>{move || STAGES[active_stage.get()].description}</p>
            <div class="stage-actions">
                <button
                    disabled=move || active_stage.get() == 0
                    on:click=move |_| active_stage.update(|s| { if *s > 0 { *s -= 1 } })
                >
                    "← Previous"
                </button>
                <button
                    disabled=move || active_stage.get() == STAGES.len() - 1
                    on:click=move |_| active_stage.update(|s| { if *s < STAGES.len() - 1 { *s += 1 } })
                >
                    "Next →"
                </button>
            </div>
        </div>
    }
}
