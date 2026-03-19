# Yunazz Clothing Hub

## Current State
Full-stack clothing store with public site (hero, shop, about, contact) and admin panel at `/admin`. Backend has product CRUD with authorization. Frontend has admin panel with product form, image upload, and edit/delete. Issue: new users logging in for the first time see "Access Denied" because there's no way to bootstrap the first admin.

## Requested Changes (Diff)

### Add
- `claimFirstAdmin()` backend function: grants caller admin role only if zero admins exist (first-time bootstrap)
- Admin panel: "Claim Admin Access" button shown when logged in but not admin, calls `claimFirstAdmin()` then re-checks admin status
- Better error handling/feedback in the product form

### Modify
- Admin panel UI: clearer onboarding flow for first-time admin setup
- Product form: ensure image is optional (product can be saved without image)

### Remove
- Nothing removed

## Implementation Plan
1. Regenerate Motoko backend with `claimFirstAdmin()` function added
2. Update frontend AdminPanel to show claim-admin UI when logged in but not admin
3. Update useQueries hook to expose `useClaimFirstAdmin` mutation
4. Ensure product form validation allows saving without an image
