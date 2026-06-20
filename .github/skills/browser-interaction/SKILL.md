---
name: browser-interaction
description: 'Open, inspect, and interact with browser pages in the shared VS Code browser context.'
argument-hint: 'Describe the page to open and interaction to perform'
user-invocable: true
---

# Browser Interaction Skill

## Goal

Perform requested web interactions directly and report concrete results.

## Workflow

1. Open the requested URL if not already shared.
2. Read page state to identify actionable elements.
3. Interact (click, type, navigate, reload) as requested.
4. Confirm resulting page state back to the user.

## When Interaction Fails

- Retry using a selector or element reference from page snapshot.
- If blocked by login/captcha, ask user for manual completion step.

## Security Rule

- Never request or handle passwords/tokens through model text.
- Tell user to enter secrets directly in browser fields themselves.
