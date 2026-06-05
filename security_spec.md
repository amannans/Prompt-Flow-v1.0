# Security Specification

## 1. Data Invariants
1. A user profile document ID must exactly match the authenticated user's `uid`.
2. Users can only read and write their own profile document.
3. Only verified administrator accounts (such as `abdulmannansaqib@gmail.com`) can list or view other users' profiles, and manage payment statuses.
4. Timestamps for creation and modification (`createdAt`, `updatedAt`) must follow the server-side `request.time`.

## 2. Access Scenarios (The Dirty Dozen Block List)
We guarantee that the following actions will result in a `PERMISSION_DENIED` error:
- Request 1: Reading user profile `userB` as authenticated `userA`.
- Request 2: Creating a user profile with `uid` that does not match `request.auth.uid`.
- Request 3: Updating another user's profile info.
- Request 4: Listing the `users` collection without being logged in.
- Request 5: Listing the `users` collection as a non-admin authenticated client.
- Request 6: Setting `paymentStatus` to 'paid' when self-updating (unless done by database admin).
- Request 7: Saving extremely long text payloads to exhaust storage.
- Request 8: Omitting required fields like `name` or `phone` on profile creation.
- Request 9: Modifying immutable fields like `createdAt`.
- Request 10: Writing client-side timestamps instead of `request.time`.
- Request 11: Accessing admin collection values directly from a standard user client.
- Request 12: Injecting non-alphanumeric IDs into the system directory.
