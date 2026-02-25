# Logout Fix - Todo List

## Task: Clear all user data from browser storage on logout

### Steps:
1. [ ] Modify `src/lib/helpers/auth.ts` - Add localStorage clearing and zustand store reset
2. [ ] Modify `src/store/user.store.ts` - Add reset function to clear all state
3. [ ] Verify `src/app/hooks/use-auth.ts` - Ensure consistency
4. [ ] Test the logout functionality
