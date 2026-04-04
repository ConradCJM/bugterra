# Bug Assignment Feature Specification

## Overview
This document specifies the implementation of a bug assignment system for the BugTerra application, enabling users to assign bugs to team members and filter by personal assignments.

---

## Requirements

### 1. **Data Model Extension**

**Add to Bug Interface:**
```typescript
interface Bug {
  // ... existing fields
  assignee?: string; // Optional team member name
}
```

**Team Members List:**
- 5 placeholder team members: `["John Doe", "Jane Smith", "Mike Johnson", "Emma Wilson", "Alex Chen"]`
- An additional option: `"Not Assigned"` (null/empty string)

**Current User Configuration:**
- Store in AuthContext as `currentUser?: string`
- Initialize to `"John Doe"` for testing purposes

---

### 2. **Bug Details Modal - Assign Button**

**Location:** Bottom action button bar of BugDetailsModal

**Button Specifications:**
- **Label:** "Assign Bug"
- **Position:** Between "Change Status" and "Close" buttons
- **Styling:** Same as "Change Status" button (slate-600 background)
- **Action:** Opens assign modal when clicked

**Assign Modal Dialog:**
- **Title:** "Change Bug Status" or "Assign Bug"
- **Current Assignee Display:** Show current assignee (or "Not Assigned" if none)
- **Dropdown Menu:** Select from 5 team members + "Not Assigned" option
- **Buttons:**
  - Cancel (slate-300) - Close without saving
  - Save (blue-600) - Save assignment and close
  
**On Assignment Save:**
- Update bug's `assignee` field
- Create history entry with `actionType: "assigned"`
- History entry should show: `oldValue` and `newValue` (with "Not Assigned" text for null)
- Call `onBugUpdate` callback to persist to parent state

---

### 3. **Bug Card Display**

**Location:** BugCard component, below reporter section

**Display Format:**
```
Reporter: [reporter name]
Assigned to: [assignee name or "Not Assigned"]
Date: [creation date]
```

**Styling:**
- Same text-xs text-slate-500 styling as reporter
- Match existing layout with line-clamp-1 to prevent overflow
- Update dynamically when assignment changes

---

### 4. **Dashboard Filter System**

**New Filter Toggle: "Assigned to You"**

**Button Specifications:**
- **Location:** Filter control bar, after Priority and Category filter dropdowns
- **Label:** "Assigned to You" or show "✓ Assigned to You" when active
- **Style Active:** Blue background (blue-600/700) with white text
- **Style Inactive:** Slate background (slate-700) with white text
- **Action:** Toggle filter on/off

**Filter Logic:**
- When toggled ON: Show only bugs where `bug.assignee === currentUser`
- When toggled OFF: Show all bugs (ignoring assignee filter)
- Works in combination with existing priority, category, and search filters
- All filter conditions must be satisfied (AND logic)

**Implementation Location:**
- Add state: `showAssignedToYou: boolean`
- Update `getBugsByStatus()` function to include:
  ```typescript
  const assignedMatch = !showAssignedToYou || bug.assignee === currentUser;
  ```
- Add to return condition in filter logic

---

### 5. **History Tracking**

**Assignment Changes Create History Entries:**
- **Action Type:** `"assigned"`
- **Format:** `"Assigned to {newAssignee}"`
- **Before/After Values:** Both should display team member name or "Not Assigned"
- **Displayed in:** BugHistoryTimeline component with existing styling

**Timeline Display:**
- Use existing color (orange for assignment events) or add new color code
- Show in chronological order with other events
- Include relative timestamps ("2h ago") with ISO date tooltip

---

## Files to Modify

1. **app/dashboard/page.tsx**
   - Extend Bug interface with `assignee?: string`
   - Add TEAM_MEMBERS constant (5 members)
   - Add `showAssignedToYou` state
   - Import useAuth from AuthContext
   - Update `getBugsByStatus()` filter logic
   - Add "Assigned to You" toggle button to filter UI
   - Distribute assignees in 15 placeholder bugs

2. **components/BugDetailsModal.tsx**
   - Add `showAssignModal` state
   - Add `newAssignee` state
   - Add `handleSaveAssignment()` function
   - Add assign modal HTML with dropdown
   - Add "Assign Bug" button to action bar
   - Create history entry on assignment

3. **components/BugCard.tsx**
   - Extend Bug interface with `assignee?: string`
   - Display assignee below reporter: `"Assigned to: {bug.assignee || 'Not Assigned'}"`
   - Use same text-xs styling as reporter line

4. **context/AuthContext.tsx**
   - Add `currentUser?: string` to AuthContextType
   - Initialize to `"John Doe"` in AuthProvider
   - Export currentUser in context value

---

## Testing Checklist

- [ ] Assign modal opens when button clicked
- [ ] Dropdown shows all 5 team members + "Not Assigned"
- [ ] Current assignee displays correctly in modal header
- [ ] Assignment saves and creates history entry
- [ ] History entry shows before/after values correctly
- [ ] Assignee displays in bug card immediately after change
- [ ] "Assigned to You" filter shows only bugs assigned to current user
- [ ] Filter works in combination with priority/category/search
- [ ] Unassigned bugs display "Not Assigned" in both card and modal
- [ ] Clicking Cancel doesn't save changes
- [ ] Multiple assignments tracked chronologically in history
- [ ] Timeline component displays assignment changes correctly

---

## Edge Cases

1. **Unassigned Bugs:** Display "Not Assigned" instead of null/empty
2. **Self-Assignment:** Currently logged-in user can assign bug to themselves
3. **Filter Edge Case:** If assigned to someone else, toggle filter OFF to see it
4. **Multiple Changes:** Changing assignee multiple times creates multiple history entries
5. **Removed Assignee:** Setting assignee to "Not Assigned" creates history entry with "Not Assigned" as newValue

---

## Future Enhancements

1. **User Management:** Link assignee to actual user system instead of hardcoded list
2. **Notifications:** Notify assigned user when bug is assigned to them
3. **Bulk Assignment:** Assign multiple bugs at once
4. **Assignment History:** Track who assigned the bug to whom
5. **Workload View:** Dashboard showing each user's assigned bugs count
6. **SLA Tracking:** Track assignment duration and resolution time

---

## Notes

- Assignment system is independent of bug status changes
- Multiple team members can be added/removed from TEAM_MEMBERS constant
- Current user is initialized to "John Doe" for testing - update when user authentication is complete
- The filter name and styling can be customized but should remain visually distinct from dropdown filters
