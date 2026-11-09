# Review roles

Reusable instructor review assignments. Read [project guidance](../AGENTS.md),
[architecture](architecture.md), [rule catalogue](rule-catalogue.md) and their
canonical links before reviewing. Role files contain scope, not copies of policy.

| Role definition | Responsibility |
| --- | --- |
| [Architecture reviewer](../.codex/agents/architecture_reviewer.toml) | Trace actual callers, DTOs, persistence and dependency boundaries; assess compatibility and test gaps. |
| [Security reviewer](../.codex/agents/security_reviewer.toml) | Inspect trust boundaries, sensitive configuration/logging, CSV safety and exposed endpoints; distinguish current local assumptions from deployment unknowns. |
| [Domain reviewer](../.codex/agents/domain_reviewer.toml) | Trace each policy to canonical evidence, implementation, tests and confirmation state; surface contradictions and owner questions without creating policy. |

Return concise findings with severity (high/medium/low), file/symbol evidence,
observed versus intended behavior, impact, coverage and remaining uncertainty.
State when no finding is supported; do not manufacture defects.

Reviews do not edit files, accept changes or grant permissions. Behavioral
read-only instructions are not a separate sandbox. Do not print secrets,
contact external systems or spawn agents merely because a role exists.
Use available tools within the parent authorization; keep one code writer.
Human acceptance remains required. TOML parsing does not prove role discovery
or loading in a fresh session.
