# RMNDR — Full-Stack Todo App

A todo app with categories: Spring Boot 4 + MySQL backend, React + TypeScript + Tailwind v4 frontend. Create todos with categories, toggle done, filter by category tabs, and manage categories (create + guarded delete).

## Stack

- **Backend:** Spring Boot 4, Spring Data JPA, MySQL, ModelMapper, Swagger/OpenAPI (`/swagger-ui.html`)
- **Frontend:** React + TypeScript, Vite, Tailwind CSS v4

## Run it

1. MySQL running, then copy `.env.example` → `.env` (defaults: `todo_db`, root, empty password).
2. `./mvnw spring-boot:run` — backend on `:8080` (seeds "Uncategorized" on an empty table).
3. `cd frontend && npm install && npm run dev` — frontend on `:5173`.

## Features

- Todo CRUD with soft delete (archive) and category assignment
- Categories: create, delete with guards — 404 on missing, 409 on "Uncategorized" or in-use, 204 on clean delete
- Category tab panel that filters the todo list (client-side, derived state)
- Global exception handler returning a consistent `ApiErrorResponse` shape

## Learnings (development log)

Every bug below cost real time. Writing them down so the next project starts one step ahead.

### State & data flow

- **Never store what you can compute.** `filteredTodos` started as state and immediately drifted: creating a todo while a filter was active left the new todo invisible until the tab was re-clicked. The fix: one state (the selected filter), and `visibleTodos` computed in the render body. State holds the inputs to a computation, never its output.
- **The empty-result fallback lied.** `filteredTodos.length === 0 ? todos : filteredTodos` rendered the full list when a filter matched nothing. An empty filtered result is a real state, not a signal to drop the filter.
- **The DTO flows unmodified through every layer.** One conversion at the boundary (empty string → null categoryId), then the object travels form → prop → service → JSON verbatim. Types written once, named once.

### Props & components

- **Value vs label.** A `<select>`'s value must match an option's `value` — the id — never the display name. Setting it to the name silently broke selection _and_ turned `Number(name)` into NaN, which JSON serializes as null: the todo silently landed under the default category.
- **`children` for composition.** The category panel takes its create-form as `children` — the parent controls content, the child controls the frame.
- **A controlled component can't take `value={null}`.** React treats null as "not controlled", then flips to controlled on first interaction with a warning. The sentinel for "nothing selected" is `""`, converted to null at the boundary.

### Forms & HTML

- **Nested forms are invalid HTML.** CategoryForm's form inside TodoForm's form produced the app's weirdest bug: the category submit appeared dead because the button's form-owner semantics and implicit submission were resolving against the wrong form. The fix was structural — sibling forms — not a patch.
- **Enter submits the form's default button** (the first `type="submit"` in tree order). A disabled submit blocks implicit submission; a button without an explicit `type` defaults to submit and fires silently. Statement order in handlers: `preventDefault` first, guards `return` before the action.

### TypeScript & JavaScript

- **`JSON.stringify(value, replacer)` — the second argument is a replacer, not a second value.** `JSON.stringify(title, categoryId)` silently serializes only `title`. Stringify the object.
- **Type lies fail at distant call sites.** Annotating `toggleDone` as `Promise<Todo[]>` (it returns one todo) produced a confusing error in App's `.map`, not at the declaration. The annotation is the contract; the debt is collected elsewhere.

### Java & Spring

- **`==` on strings compares references, not values** — the "Uncategorized" guard silently never fired until `.equals()`. Java's most classic gotcha.
- **You can throw from any method, regardless of return type.** Exceptions are exit routes that bypass the `return`; the return type only describes the success path. A boolean can't carry three outcomes — the service throws `ConflictException` for refusals with real messages and returns `false` only for not-found.
- **CORS origins are exact-match strings.** `"http://127.0.0.1:5173/"` with a trailing slash matches nothing: GETs worked (simple requests, no preflight) while JSON POSTs silently died at the preflight. One character, a day of debugging.
- **Soft delete still holds foreign keys.** Archived todos keep their `category_id`, so a delete guard that ignores archived rows passes and the hard delete violates the FK with a 500. Guards must count rows the same way the constraint does.
- **Keep the dependency graph acyclic.** TodoService already injects CategoryService, so CategoryService injecting TodoService back would be a cycle — the guard reaches for `TodoRepository` directly instead.
- **Surface the server's message.** `throw new Error("Failed to delete category")` discards the backend's informative 409 ("Category is in use by N todos"). Parse the error body and throw its message.

## Open items

- Archived todos pin categories (see the banked design: null-out vs trash-pattern hard delete)
- Backend validation for duplicate category names
- Tests: RTL + Mockito/JUnit + RestAssured
