# Saved Searches with Alerts Guide

## Overview

The Saved Searches with Alerts feature allows users to save their property search criteria and receive automatic notifications when new properties match their preferences. This keeps users engaged and ensures they never miss relevant listings.

## Key Features

### 1. Save Current Search
- **Location**: Homepage sidebar, Saved Searches panel
- **How to use**:
  1. Apply your desired filters (location, price, type, bedrooms, rental term)
  2. Click the "Save Current" button in the Saved Searches panel
  3. Enter a descriptive name (e.g., "Downtown Studios Under $2000")
  4. Choose your alert preferences
  5. Click "Save Search"

### 2. Alert Frequency Options

Choose how often you want to be notified:

- **Instant**: Get notified immediately when a matching property is listed
- **Daily**: Receive one digest per day with all new matches
- **Weekly**: Get a weekly summary of new matching properties
- **Disabled**: Save the search without notifications

### 3. Match Tracking

- Each saved search displays a match count badge
- See how many new properties match your criteria
- Match count resets when you load the search
- Visual indicator helps prioritize which searches to check

### 4. Search Management

#### From Homepage Sidebar:
- **Load**: Click "Load Search" to apply saved filters
- **Share**: Copy a link to share your search with others
- **Toggle Alerts**: Quickly enable/disable notifications
- **Edit**: Update search name and alert settings
- **Delete**: Remove searches you no longer need

#### From Dashboard Alerts Tab:
- **Active Alerts**: View all searches with notifications enabled
- **Inactive Alerts**: See saved searches without notifications
- **Edit Settings**: Change alert frequency and preferences
- **View Matches**: One-click navigation to see matching properties
- **Manage All**: Bulk management of all saved searches

## Use Cases

### For Renters

**Scenario 1: Budget-Conscious Student**
```
Search: "Student Housing Near Campus"
Filters: Studio/1BR, $800-$1200, Long-term
Alert: Instant
Benefit: Immediately notified of affordable options near school
```

**Scenario 2: Flexible Professional**
```
Search: "Downtown Short-term Apartments"
Filters: Apartment/Condo, $1500-$2500, Short-term, 1-2 BR
Alert: Daily
Benefit: Daily digest of corporate housing options
```

**Scenario 3: Family Planning**
```
Search: "Family Homes in Suburbs"
Filters: House, $2000-$3500, Long-term, 3+ BR
Alert: Weekly
Benefit: Weekly summary without email overload
```

### For Property Owners

Monitor competition and market trends:
```
Search: "Similar Properties in My Area"
Filters: Match your property type and area
Alert: Weekly
Benefit: Stay informed about competitive listings
```

## Technical Implementation

### Property Matching Algorithm

Saved searches match properties based on:

1. **Search Query**: Text match in title, description, or location
2. **Property Type**: Exact match (apartment, house, studio, condo)
3. **Rental Term**: Short-term or long-term
4. **Price Range**: Property price within min/max bounds
5. **Bedrooms**: Minimum bedroom requirement

### Alert Delivery

- **Instant Alerts**: Triggered when a new property is added
- **Daily Alerts**: Batch notifications sent once per day
- **Weekly Alerts**: Summary sent weekly with all matches
- **Match Count**: Incremented for each matching property

### Data Persistence

All saved searches are stored in the browser's local storage using the `useKV` hook:
- Search criteria and filters
- Alert preferences and frequency
- Match counts and last alert timestamps
- User-defined search names

## Best Practices

### Creating Effective Searches

1. **Be Specific**: More filters = more relevant results
2. **Use Descriptive Names**: "Downtown 2BR Under $2K" vs "Search 1"
3. **Start with Instant**: Switch to daily/weekly if too many notifications
4. **Review Regularly**: Clean up outdated searches

### Managing Notifications

1. **Too Many Alerts?**: 
   - Narrow your filters
   - Switch to daily or weekly frequency
   - Disable alerts but keep the search saved

2. **Missing Results?**:
   - Broaden your price range
   - Remove some filter constraints
   - Check if alerts are enabled

3. **Organizing Multiple Searches**:
   - Use clear, distinct names
   - Disable alerts on exploratory searches
   - Delete old searches to reduce clutter

## Integration with Other Features

### With User Preferences
- New users get a welcome notification
- Saved preferences auto-apply to first search
- Dashboard shows total active alerts

### With Notifications Center
- Search alerts appear in notification feed
- Click notification to view matching property
- Unread badge shows new matches

### With Dashboard
- Centralized alert management
- View all searches in one place
- Track match counts across all searches
- Quick navigation to results

## Privacy & Control

- **Your Data**: All searches stored locally in your browser
- **No Spam**: You control all notification preferences
- **Easy Opt-out**: Toggle alerts on/off anytime
- **Complete Control**: Edit, disable, or delete any search

## Tips & Tricks

1. **Create Multiple Variations**: Save similar searches with different price ranges to compare options

2. **Use Weekly for Research**: Set weekly alerts when you're planning months ahead

3. **Share Searches**: Copy search links to share with roommates or family

4. **Monitor Trends**: Save broad searches to watch market activity

5. **Combine with Favorites**: Save searches + favorite properties for comprehensive tracking

## Future Enhancements

Potential future features:
- Email notifications (currently in-app only)
- SMS/push notifications
- Advanced search operators
- Collaborative searches (share with groups)
- Search templates and presets
- Machine learning-based recommendations

## Troubleshooting

### Search not saving?
- Ensure you've applied at least one filter
- Enter a unique search name
- Check browser storage isn't full

### Not receiving alerts?
- Verify alerts are enabled for the search
- Check alert frequency setting
- Ensure properties are being added to the platform
- Review your filter criteria (may be too restrictive)

### Match count not updating?
- Refresh the page
- Check if new properties actually match your filters
- Verify the search hasn't been edited

---

## Quick Reference

| Action | Location | Result |
|--------|----------|--------|
| Save Search | Homepage Sidebar | Creates new saved search |
| Load Search | Saved Search Card | Applies filters to homepage |
| Toggle Alert | Search Card / Dashboard | Enables/disables notifications |
| Edit Search | Dashboard Alerts Tab | Updates name and preferences |
| Delete Search | Search Card / Dashboard | Removes saved search |
| View Matches | Dashboard Alerts Tab | Navigates to filtered results |
| Share Search | Search Card | Copies shareable link |

---

**Need Help?** Check the dashboard Alerts tab for a complete overview of all your saved searches and their current status.
