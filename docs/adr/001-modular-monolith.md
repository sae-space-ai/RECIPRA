# ADR-001: Modular Monolith Architecture

## Status
ACCEPTED

## Context
RECIPRA requires a modular, extensible, multi-tenant platform. Options considered:
1. Microservices from day one
2. Modular monolith with strict domain boundaries
3. Monolith with no boundaries

## Decision
**Modular Monolith with Strict Domain Boundaries + Event-Oriented Architecture.**

No premature microservices. Services extracted only when justified by:
- Scale requirements
- Fault isolation needs
- Security boundaries
- Deployment independence
- Team ownership

## Architecture
```
Web/Mobile/Admin → API/BFF → Application → Domain → Policy Engine → PostgreSQL
                                                                    ↓
                                                          Transactional Outbox
                                                                    ↓
                                                               Workers
                                                                    ↓
                                                              Adapters
                                                                    ↓
                                                             Providers
```

## Consequences
- **Positive:** Simpler deployment, easier testing, no network overhead between modules, single database transaction across modules
- **Positive:** Can extract services later when justified
- **Negative:** Requires discipline to maintain module boundaries
- **Negative:** Single deployment unit (mitigated by module-level feature flags)

## Module Boundaries
Each module defines:
- `module_id`, `name`, `version`
- `dependencies` (other modules)
- `permissions` required
- `subscribed_events` / `emitted_events`
- `database_schema` (tables, migrations)
- `api` (endpoints)
- `ui_extensions` (panels, widgets)
- `pricing`, `metering`, `feature_flags`
- `compliance`, `rollback` strategy

## Lifecycle
install → enable → disable → upgrade → rollback → uninstall
