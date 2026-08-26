# RMNDR — Full-Stack Todo App

![Backend](https://github.com/morganthen/rmndr/actions/workflows/backend.yml/badge.svg)
![Frontend](https://github.com/morganthen/rmndr/actions/workflows/frontend.yml/badge.svg)

A todo app with categories: Spring Boot 4 + MySQL backend, React + TypeScript + Tailwind v4 frontend. Create todos with categories, toggle done, filter by category tabs, and manage categories (create + guarded delete).

## Stack

- **Backend:** Spring Boot 4, Spring Data JPA, MySQL, ModelMapper, Swagger/OpenAPI (`/swagger-ui.html`)
- **Frontend:** React + TypeScript, Vite, Tailwind CSS v4

## Run it

1. MySQL running, then copy `.env.example` → `.env` (defaults: `todo_db`, root, empty password).
2. `./mvnw spring-boot:run` — backend on `:8080` (seeds "Uncategorized" on an empty table).
3. `cd frontend && npm install && npm run dev` — frontend on `:5173`.

## Features

- Todo CRUD with soft delete (archive), hard delete from the Archived view (Gmail trash pattern), and category assignment
- Categories: create, rename (inline edit — Enter/blur commits, Escape cancels), delete with guards — 404 on missing, 409 on "Uncategorized" or in-use, 204 on clean delete
- Category tab panel that filters the todo list (client-side, derived state), with an Active/Archived status axis
- Create-category modal built on the native `<dialog>` element (showModal, backdrop, free focus trap)
- Earthy palette (sage/bone/tan/clay/ink) as Tailwind v4 `@theme` tokens
- Global exception handler returning a consistent `ApiErrorResponse` shape, surfaced in the UI via a shared `throwFromResponse` error-body parser
- Frontend test suite: Vitest + React Testing Library + userEvent — 39 tests across 6 components (TodoList, TodoItem, TodoForm, CategoryForm, CategoryPanel, Modal), each component tested through its own `use*`-domain or props factory
- Backend test setup: Mockito unit tests (CategoryService) + H2 in-memory DB via a test `application.properties` and per-test `cleanup.sql`
- CI: GitHub Actions workflow runs backend `mvnw test` and frontend lint + build + `vitest run` on every push/PR

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
- **A boolean can't answer "which one?"** Inline edit state needs `editingCategoryId: number | null` — the id itself is the flag. A shared boolean flips every row into an input at once.
- **A ternary branch is a single expression.** Two siblings in the false branch — the name button plus its badges — need a fragment wrapper, or the JSX parser dies.
- **A hook call is a state instance, not a service.** Calling `useCategories()` in App *and* in a child creates two independent water tanks: the child's `createCategory` closed *its* modal and updated *its* list, while App's tank — the one actually rendering — stayed open and stale. Shared state must live in one place: props at this app's size, Context when drilling hurts. (Two-tank bug found 2026-08-22.)

### Forms & HTML

- **Nested forms are invalid HTML.** CategoryForm's form inside TodoForm's form produced the app's weirdest bug: the category submit appeared dead because the button's form-owner semantics and implicit submission were resolving against the wrong form. The fix was structural — sibling forms — not a patch.
- **Enter submits the form's default button** (the first `type="submit"` in tree order). A disabled submit blocks implicit submission; a button without an explicit `type` defaults to submit and fires silently. Statement order in handlers: `preventDefault` first, guards `return` before the action.
- **Enter and blur are two commit paths.** If both call the update, every Enter commits twice (keydown, then the blur as the input unmounts). Route Enter through `blur()` so blur is the ONLY commit trigger, and use a ref flag for Escape so a cancel doesn't sneak a commit through the unmount blur.
- **A controlled input's draft needs a home.** `value={c.name}` without onChange is read-only; the typed text must live in state, and it must be reset every time edit mode opens.
- **The native `<dialog>` is imperative.** `showModal()` is called through a ref + effect; without a guard, StrictMode's double-invoked effects throw `InvalidStateError` on the second call. Escape closes natively, so `onClose` must sync the React state back.
- **Rename ripples.** The category name is a string stored on every todo AND in the active filter. After a rename, update the categories list, update the filter (only if it matched the old name), and refetch todos — miss one and stale names surface.

### TypeScript & JavaScript

- **`JSON.stringify(value, replacer)` — the second argument is a replacer, not a second value.** `JSON.stringify(title, categoryId)` silently serializes only `title`. Stringify the object.
- **`tsc --noEmit` on a solution-style tsconfig checks nothing.** A `tsconfig.json` with `"files": []` + project references exits 0 without compiling anything. Verify with `tsc --noEmit -p tsconfig.app.json`.
- **Type lies fail at distant call sites.** Annotating `toggleDone` as `Promise<Todo[]>` (it returns one todo) produced a confusing error in App's `.map`, not at the declaration. The annotation is the contract; the debt is collected elsewhere.

### Java & Spring

- **`==` on strings compares references, not values** — the "Uncategorized" guard silently never fired until `.equals()`. Java's most classic gotcha.
- **You can throw from any method, regardless of return type.** Exceptions are exit routes that bypass the `return`; the return type only describes the success path. A boolean can't carry three outcomes — the service throws `ConflictException` for refusals with real messages and returns `false` only for not-found.
- **CORS origins are exact-match strings.** `"http://127.0.0.1:5173/"` with a trailing slash matches nothing: GETs worked (simple requests, no preflight) while JSON POSTs silently died at the preflight. One character, a day of debugging.
- **Soft delete still holds foreign keys.** Archived todos keep their `category_id`, so a delete guard that ignores archived rows passes and the hard delete violates the FK with a 500. Guards must count rows the same way the constraint does.
- **Keep the dependency graph acyclic.** TodoService already injects CategoryService, so CategoryService injecting TodoService back would be a cycle — the guard reaches for `TodoRepository` directly instead.
- **Surface the server's message.** `throw new Error("Failed to delete category")` discards the backend's informative 409 ("Category is in use by N todos"). Parse the error body and throw its message.

### Testing (Vitest + React Testing Library)

- **`get*` asserts existence, `query*` asserts absence.** `getByRole` throws when nothing matches, so `getByRole(...).not.toBeInTheDocument()` never runs — the throw fires first. Absence assertions must use `queryBy*`, which returns `null`.
- **A regex `name` can match sibling buttons.** `/work/i` matched the filter button *and* the "Delete category Work"/"Edit category Work" badges, so `getByRole` threw "multiple elements". Use an exact-string `name: "Work"` when the accessible name contains the same text as its neighbours.
- **Test where the responsibility lives.** "Can't delete a category attached to a todo" is a *server* rule (`CategoryService.deleteById` → `findByCategoryId`). The component only fires `deleteCategory(id)`; mocking todos into the component test would lie about its contract. Assert the rule at the service, the callback at the component.
- **Archived rows are the same row.** An archived todo is `isArchived=true` on the same row, and `findByCategoryId` has no archived filter — one query already blocks deletion for archived *and* active todos. The schema told us we needed one test, not two.
- **A controlled prop can't be flipped by a mocked click.** `editingCategory` comes from the domain prop, so clicking edit (a `vi.fn()` mock) can't change it — the input never renders. Drive the controlled state via the fixture (`editingCategory: 2`); the *internal* `updatedCategoryName` stays `""`, so the category name shows as the placeholder, not the value.
- **A render helper must actually render.** The factory built props but forgot `render(<Component .../>)`, so `screen.getBy*` found nothing. Build props, render, and return props for assertions.
- **The native `<dialog>` is untestable in jsdom.** `showModal()`/`close()` aren't implemented — stub them in tests (`HTMLDialogElement.prototype.showModal = vi.fn()`). This is why the modal deserves its own component (take `children`, own its ref) rather than living inline in App.
- **`getByRole` filters hidden elements; `getByText` doesn't.** A closed `<dialog>` (no `open` attr) is `display:none`, so `getByRole("dialog")` and role queries inside it "can't find" the element while `getByText` finds it fine. A faithful `<dialog>` stub must set `open` (`this.open = true`), or role-based queries can't see anything inside.
- **A utility that sets `display` on a natively-hidden element defeats its hidden state.** The modal's `flex` class overrode the UA's `dialog:not([open]){display:none}` once the dialog was always mounted, so it stayed visible when closed. Author styles beat UA styles regardless of specificity. Fix: gate the display utility on open — `open:flex` instead of `flex`.
- **Mocks leak call state across tests.** A `vi.fn()` stubbed in `beforeAll` accumulates calls from every test, so `.not.toHaveBeenCalled()` fails from an earlier test's side effects. Reset with `vi.clearAllMocks()` in `beforeEach`.
- **`fireEvent.cancel` doesn't exist.** Testing-library only ships a fixed set of events; `cancel` isn't one of them. Use the generic form — `fireEvent(dialog, new Event("cancel", { cancelable: true }))` — or `dialog.dispatchEvent(...)`. React attaches `onCancel` directly to the element (non-delegated), so dispatching on the node works.

### Backend testing (Mockito + H2)

- **`@Mock` for collaborators, `@Spy @InjectMocks` for the unit under test.** `@ExtendWith(MockitoExtension.class)` + `@Mock CategoryRepository`/`@Mock TodoRepository` create fakes; `@Spy @InjectMocks CategoryService` is the real service with those fakes injected. Arrange with `when(...).thenReturn(...)`, act on the service, assert with `assertThrows`/`verify`/`never()`.
- **Unit-test the guard where it lives.** `CategoryService.deleteById` throws `ConflictException` when `todoRepository.findByCategoryId` returns todos — one mock returns a list, `assertThrows`, and `verify(repo, never()).deleteById(...)`. No DB, no server, fast.
- **Test resources override main at test time.** `src/test/resources/application.properties` swaps the MySQL datasource for `jdbc:h2:mem:testdb` so `@SpringBootTest` integration tests boot against an in-memory DB. `cleanup.sql` wipes tables before each test — delete `todos` before `categories` (FK order).

### CI (GitHub Actions)

- **A workflow is a YAML file in `.github/workflows/`, not code you run locally.** `on:` defines the trigger (push to `main`, pull requests); each `job` runs on a fresh VM; `steps` run commands or `uses:` reusable actions.
- **`npm test` (`vitest`) is watch mode and hangs CI.** CI needs a single run — use `npx vitest run`. A status badge won't render a real "passing" state until the workflow has run at least once after being pushed.

## Open items

- **No limit on the number of categories** — users can create unbounded categories; no cap or guidance exists.
- **No duplicate-name validation** — creating a category with an existing name (or renaming one into a collision) is accepted. The fix lives in `CategoryService` (both `createCategory` and `updateById`), returning 409 on collision.
- **Modal lives inline in `App`** — extract it into its own component (`open`/`onClose`/`children`, owns its `<dialog>` ref + `showModal`/`close` effect) so it's testable and reusable; drop `dialogRef` from `useCategories`.
- Tests: frontend done (34 RTL). Backend Mockito/JUnit + RestAssured still open.
