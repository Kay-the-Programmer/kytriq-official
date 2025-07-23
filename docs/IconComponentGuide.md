# Icon Component Usage Guide

## Overview
The Icon component is a reusable React component that provides a consistent way to display SVG icons throughout the Kytriq application. It uses a centralized approach where all icon definitions are stored in a single file, making it easy to maintain and update icons across the application.

## Basic Usage
To use an icon in your component:

```tsx
import Icon from '../components/Icon';

// In your JSX:
<Icon name="check" className="w-5 h-5 text-green-500" />
```

## Props
The Icon component accepts the following props:

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| name | string | Yes | The name of the icon to display |
| className | string | No | Additional CSS classes to apply to the icon |
| onClick | function | No | Click handler for the icon |
| aria-hidden | boolean | No | Accessibility attribute |

## Available Icons
The Icon component currently supports the following icons:

### Navigation Icons
- arrow-right
- arrow-left
- arrow-down
- chevron-left
- chevron-right
- chevron-down

### UI Elements
- check
- check-circle
- x
- x-mark
- plus
- menu
- information-circle
- exclamation-circle
- exclamation-triangle

### Business/Commerce
- cart
- shopping-cart
- shopping-bag
- truck
- refresh
- shield-check

### Documents and Text
- document-text
- document-check
- paper-airplane

### Communication
- mail
- envelope
- phone
- device-phone-mobile
- chat-bubble-left-right

### Location
- map-pin

### Time
- clock
- calendar

### Devices
- device-tablet
- printer

### Security
- lock-closed

### Misc
- star
- eye
- trash
- upload
- arrow-up-tray
- sparkles
- briefcase
- link
- qr-code
- edit
- heart
- search
- presentation-chart-bar
- user
- user-group
- currency-dollar
- twitter
- linkedin
- kytriq (custom company icon)

## Adding New Icons
To add a new icon to the component:

1. Open `components/Icon.tsx`
2. Locate the `icons` object
3. Add a new entry with the icon name as the key and the SVG as the value:

```tsx
'new-icon-name': (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="..." />
  </svg>
),
```

4. The icon will now be available to use with `<Icon name="new-icon-name" />`

## Best Practices
- Use consistent sizing by applying width and height classes (e.g., `w-5 h-5`)
- Use text color utilities to change the icon color (e.g., `text-blue-500`)
- Group related icons together in the Icon.tsx file with comments for better organization
- When adding new icons, follow the existing pattern and organization
- Use descriptive names that clearly indicate what the icon represents

## Example Usage Scenarios

### Button with Icon
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded">
  <Icon name="check" className="w-4 h-4" />
  <span>Submit</span>
</button>
```

### Icon with Hover Effect
```tsx
<Icon 
  name="heart" 
  className="w-6 h-6 text-gray-400 hover:text-red-500 transition-colors duration-300" 
  onClick={() => handleLike()} 
/>
```

### Animated Icon
```tsx
<Icon name="refresh" className="w-5 h-5 animate-spin" />
```

## Troubleshooting
If an icon doesn't appear:
1. Check that the name is spelled correctly
2. Verify that the icon is defined in the Icon.tsx file
3. If using a new icon, make sure it was added to the icons object

If the icon appears but doesn't look right:
1. Check the className prop for proper sizing and color
2. Ensure the SVG paths are correct in the icon definition

## Recent Updates
Recently added icons:
- x-mark
- exclamation-triangle
- document-check
- arrow-up-tray
- user
- code
- building-office

The first five icons were added to support the CareerApplicationPage component, while 'code' and 'building-office' were added to support the Header component for Software and Company links respectively.
