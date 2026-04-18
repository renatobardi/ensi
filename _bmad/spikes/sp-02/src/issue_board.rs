use leptos::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub struct Issue {
    pub id: u32,
    pub title: String,
    pub status: IssueStatus,
    pub priority: Priority,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq, Hash)]
pub enum IssueStatus {
    Backlog,
    InProgress,
    Done,
}

impl IssueStatus {
    fn label(&self) -> &str {
        match self {
            IssueStatus::Backlog => "Backlog",
            IssueStatus::InProgress => "In Progress",
            IssueStatus::Done => "Done",
        }
    }

    fn class(&self) -> &str {
        match self {
            IssueStatus::Backlog => "col-backlog",
            IssueStatus::InProgress => "col-in-progress",
            IssueStatus::Done => "col-done",
        }
    }
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq)]
pub enum Priority {
    Low,
    Medium,
    High,
    Urgent,
}

impl Priority {
    fn label(&self) -> &str {
        match self {
            Priority::Low => "Low",
            Priority::Medium => "Medium",
            Priority::High => "High",
            Priority::Urgent => "Urgent",
        }
    }
}

/// Server function that simulates fetching issues from SurrealDB.
/// This is the key ergonomics test for the #[server] boundary.
#[server(GetIssues, "/api")]
pub async fn get_issues() -> Result<Vec<Issue>, ServerFnError> {
    // Simulates latency of a SurrealDB query
    tokio::time::sleep(tokio::time::Duration::from_millis(50)).await;

    Ok(vec![
        Issue { id: 1, title: "Set up Leptos project structure".into(), status: IssueStatus::Done, priority: Priority::High },
        Issue { id: 2, title: "Implement board view component".into(), status: IssueStatus::InProgress, priority: Priority::High },
        Issue { id: 3, title: "Add drag & drop between columns".into(), status: IssueStatus::InProgress, priority: Priority::Medium },
        Issue { id: 4, title: "Evaluate WASM bundle size".into(), status: IssueStatus::Backlog, priority: Priority::Urgent },
        Issue { id: 5, title: "Test SSR hydration flow".into(), status: IssueStatus::Backlog, priority: Priority::Medium },
        Issue { id: 6, title: "Write SP-02 findings report".into(), status: IssueStatus::Backlog, priority: Priority::High },
    ])
}

#[component]
pub fn IssueBoard() -> impl IntoView {
    // Resource backed by server function — reactive, SSR-compatible
    let issues = Resource::new(|| (), |_| get_issues());

    // Signals for drag state
    let dragging_id: RwSignal<Option<u32>> = RwSignal::new(None);

    // Local signal for optimistic column moves (client-side only)
    let local_overrides: RwSignal<Vec<(u32, IssueStatus)>> = RwSignal::new(vec![]);

    let effective_issues = move || {
        issues.get().and_then(|r| r.ok()).map(|mut list| {
            let overrides = local_overrides.get();
            for issue in list.iter_mut() {
                if let Some((_, new_status)) = overrides.iter().find(|(id, _)| *id == issue.id) {
                    issue.status = new_status.clone();
                }
            }
            list
        })
    };

    let issues_for_column = move |status: IssueStatus| {
        effective_issues()
            .unwrap_or_default()
            .into_iter()
            .filter(move |i| i.status == status)
            .collect::<Vec<_>>()
    };

    view! {
        <div class="board-header">
            <h1>"Issue Board"</h1>
            <p class="board-subtitle">"Kanban view — drag issues between columns"</p>
        </div>

        <Suspense fallback=|| view! { <div class="loading">"Loading issues..."</div> }>
            <div class="board">
                {[IssueStatus::Backlog, IssueStatus::InProgress, IssueStatus::Done]
                    .into_iter()
                    .map(|status| {
                        let status_clone = status.clone();
                        let label = status.label().to_string();
                        let class = status.class().to_string();
                        let col_status = status.clone();
                        let status_for_count = status_clone.clone();
                        view! {
                            <div
                                class=format!("column {class}")
                                on:dragover=|e| e.prevent_default()
                                on:drop=move |_| {
                                    if let Some(id) = dragging_id.get() {
                                        local_overrides.update(|v| {
                                            v.retain(|(eid, _)| *eid != id);
                                            v.push((id, col_status.clone()));
                                        });
                                        dragging_id.set(None);
                                    }
                                }
                            >
                                <div class="column-header">
                                    <span class="column-title">{label}</span>
                                    <span class="column-count">
                                        {move || issues_for_column(status_for_count.clone()).len()}
                                    </span>
                                </div>
                                <div class="column-body">
                                    {move || {
                                        issues_for_column(status_clone.clone())
                                            .into_iter()
                                            .map(|issue| {
                                                let issue_id = issue.id;
                                                view! {
                                                    <IssueCard
                                                        issue=issue
                                                        on_drag_start=move || dragging_id.set(Some(issue_id))
                                                    />
                                                }
                                            })
                                            .collect::<Vec<_>>()
                                    }}
                                </div>
                            </div>
                        }
                    })
                    .collect::<Vec<_>>()
                }
            </div>
        </Suspense>
    }
}

#[component]
fn IssueCard(issue: Issue, on_drag_start: impl Fn() + 'static) -> impl IntoView {
    let priority_label = issue.priority.label().to_string();
    let priority_class = format!("priority-{}", priority_label.to_lowercase());

    view! {
        <div
            class="issue-card"
            draggable="true"
            on:dragstart=move |_| on_drag_start()
        >
            <div class="issue-title">{issue.title.clone()}</div>
            <div class="issue-meta">
                <span class=format!("badge {priority_class}")>{priority_label}</span>
                <span class="issue-id">{format!("#{}", issue.id)}</span>
            </div>
        </div>
    }
}
