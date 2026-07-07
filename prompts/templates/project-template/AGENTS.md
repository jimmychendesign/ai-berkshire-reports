# AGENTS.md

# AI Project Working Instructions

This document defines the standard workflow and folder organization for
this project. Unless explicitly instructed otherwise, always follow
these guidelines.

------------------------------------------------------------------------

# 1. Project Structure

Always organize the project as a **self-contained project folder**.

If the current working directory is a general workspace that can contain
multiple projects, create a new `project-name/` folder first and put all
project files inside it.

Only use the current directory directly when the user explicitly says the
current directory is already the project root, or when it already contains
project-level files such as `PROJECT.md`, `AGENTS.md`, `README.md`, and a
package/config file for this same project.

Do not place a new project's `src/`, `docs/`, `output/`, `prompts/`,
`sessions/`, or `assets/` folders directly in a general workspace root.

Use this structure:

``` text
workspace/
└── project-name/
    ├── src/
    ├── public/
    ├── docs/
    │   ├── research.md
    │   ├── notes.md
    │   └── architecture.md
    ├── output/
    │   ├── html/
    │   ├── pdf/
    │   ├── screenshots/
    │   └── exports/
    ├── prompts/
    │   ├── summary.md
    │   ├── coding.md
    │   ├── visualization.md
    │   └── brainstorming.md
    ├── sessions/
    ├── assets/
    ├── README.md
    ├── PROJECT.md
    ├── AGENTS.md
    ├── package.json
    └── .gitignore
```

Never place generated files directly in the project root unless
explicitly requested.

------------------------------------------------------------------------

# Project Workflow

## First-Time Project Initialization

-   Decide whether the current directory is a workspace or an existing
    project root.
-   If it is a workspace, create `project-name/` first and work inside it.
-   Create the complete folder structure if it does not exist.
-   Create `README.md`, `PROJECT.md`, and today's
    `sessions/YYYY-MM-DD/`.
-   Verify folders before generating files.

## Session Management

Every work session must create:

``` text
sessions/
└── YYYY-MM-DD/
    ├── session.md
    ├── prompts.md
    ├── summary.md
    └── todo.md
```

Each session should record:

-   Goal
-   Tasks completed
-   Files modified
-   Decisions
-   Problems encountered
-   Next steps

## Documentation Rules

-   Research → `docs/`
-   Reusable prompts → `prompts/`
-   Generated HTML → `output/html/`
-   PDFs → `output/pdf/`
-   Screenshots → `output/screenshots/`
-   Assets → `assets/`

## Coding Rules

Always:

-   Write reusable, modular code.
-   Keep folder structure clean.
-   Explain major architecture decisions.
-   Preserve existing functionality unless instructed.

Never:

-   Delete or rename files without permission.
-   Overwrite user work.
-   Save generated files in the project root.

## End of Every Session

Before finishing:

1.  Update `session.md`
2.  Update `summary.md`
3.  Update `todo.md`
4.  Save useful prompts
5.  Save outputs
6.  Update `PROJECT.md`
7.  Update `README.md` if needed

## Default Workflow

Whenever a new request is received:

1.  Read `AGENTS.md`
2.  Read `PROJECT.md`
3.  Determine whether the current directory is a workspace or project root
4.  If needed, create and enter a dedicated `project-name/` folder
5.  Verify folder structure
6.  Create today's session folder if missing
7.  Record prompts during work
8.  Save outputs into the correct folders
9.  Update documentation before finishing
