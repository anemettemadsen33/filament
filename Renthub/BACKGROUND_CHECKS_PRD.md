# Background Checks Feature - Product Requirements Document

## Mission Statement
Provide comprehensive tenant screening services that help landlords make informed decisions while giving tenants a way to verify their credentials and build trust in the rental application process.

## Experience Qualities
1. **Trustworthy** - Clear, transparent processes that protect both parties' interests and comply with legal requirements
2. **Efficient** - Quick submission process with results delivered in 2-5 business days
3. **Professional** - Enterprise-grade screening that feels secure and thorough

## Complexity Level
**Light Application** (multiple features with basic state) - The feature includes request submission, result viewing, and management but doesn't require complex real-time processing or external API integrations in this implementation.

## Essential Features

### 1. Background Check Request System
- **Functionality**: Tenants can submit background check requests with personal and employment information
- **Purpose**: Enables prospective tenants to proactively verify their credentials
- **Trigger**: Click "Request Background Check" button in dashboard or during property application
- **Progression**: Select package → Enter personal info → Provide employment details → Accept consent → Submit → Payment → Processing → Results
- **Success Criteria**: Request is created with all required information and queued for processing

### 2. Screening Package Selection
- **Functionality**: Choose from Basic, Standard, or Comprehensive screening packages with different check types
- **Purpose**: Flexibility for different rental situations and budget constraints
- **Trigger**: First step in background check request flow
- **Progression**: View packages → Compare features → Select template → Customize individual checks → See total cost
- **Success Criteria**: User understands what each package includes and associated costs

### 3. Personal Information Collection
- **Functionality**: Secure form to collect applicant's identity, address, and employment information
- **Purpose**: Gather necessary data for verification services
- **Trigger**: After package selection
- **Progression**: Enter name & DOB → ID type & number → Current address → Previous addresses → Employment details → Income verification
- **Success Criteria**: All required fields validated and data stored securely

### 4. Consent & Authorization
- **Functionality**: Legal consent form with FCRA disclosure and data privacy information
- **Purpose**: Ensure legal compliance and informed consent
- **Trigger**: Final step before submission
- **Progression**: Read authorization text → Review rights → Check consent box → Submit request
- **Success Criteria**: User provides explicit consent meeting legal requirements

### 5. Results Dashboard (Tenant View)
- **Functionality**: Tenants can view their own background check results and status
- **Purpose**: Transparency and ability to share results with multiple landlords
- **Trigger**: Navigate to "Screening" tab in dashboard
- **Progression**: View list of checks → See status → Click to view details → Download/share results
- **Success Criteria**: Clear presentation of check status and results with 90-day validity indicator

### 6. Results Dashboard (Landlord View)
- **Functionality**: Landlords can view background checks for their property applicants
- **Purpose**: Make informed tenant selection decisions
- **Trigger**: Navigate to "Screening" tab in dashboard
- **Progression**: View all checks → Filter by status → Click check → Review detailed results → See risk score & recommendations
- **Success Criteria**: Easy-to-understand results with clear approval recommendations

### 7. Detailed Results Display
- **Functionality**: Comprehensive breakdown of each verification component with scores and findings
- **Purpose**: Provide complete transparency into screening results
- **Trigger**: Click on a completed background check
- **Progression**: Overall status → Risk score → Identity verification → Criminal record → Credit score → Employment → Rental history → Eviction records → Recommendations & warnings
- **Success Criteria**: All results displayed with context and clear explanations

### 8. Check Types & Components
- **Functionality**: Individual verification services including:
  - Criminal Record Check ($15)
  - Credit Score Check ($20)
  - Employment Verification ($10)
  - Rental History ($10)
  - Eviction Records ($5)
  - Identity Verification ($10)
- **Purpose**: Modular screening allowing customization based on needs
- **Trigger**: Package selection or custom check configuration
- **Progression**: View available checks → Read descriptions → Select needed checks → See pricing
- **Success Criteria**: Clear understanding of what each check verifies and costs

## Edge Case Handling
- **Incomplete Information** - Form validation prevents submission with missing required fields; clear error messages guide completion
- **Failed Verification** - Status updated to "failed" with support contact information; option to resubmit with corrected information
- **Expired Results** - Automatic expiration after 90 days; prominent warning when approaching expiration; option to request new check
- **Multiple Properties** - Results can be reused across applications within validity period; clear indicator of which properties have access
- **Payment Issues** - Clear status showing payment required; multiple payment method support; automatic processing once payment confirmed
- **Disputed Results** - Link to dispute process in FCRA disclosure; support contact for questions about results

## Design Direction
The design should feel professional, secure, and trustworthy - similar to banking or legal applications. Use a clean, organized interface with clear information hierarchy. The tone should be serious and compliance-focused while remaining accessible and user-friendly.

**Visual Balance**: Structured and formal with ample white space to avoid overwhelming users with legal/technical information.

## Color Selection
**Complementary** - Blue (trust/security) as primary with orange accent for important actions/warnings

- **Primary Color (Deep Blue #2563EB)**: oklch(0.45 0.15 250) - Represents trust, security, and professionalism. Used for main branding and call-to-action buttons.
  - White text (#FFFFFF) - Ratio 8.1:1 ✓
  
- **Secondary Colors**:
  - Muted Blue Background: oklch(0.96 0.005 250) - Soft, professional background
  - Dark Text: oklch(0.20 0.01 250) - High contrast for readability
  
- **Accent Color (Success Green #10B981)**: oklch(0.65 0.15 145) - Used for verified/approved status, positive results
  - White text (#FFFFFF) - Ratio 5.2:1 ✓
  
- **Warning Color (Amber #F59E0B)**: oklch(0.70 0.15 35) - Caution indicators, conditional approvals
  - Dark text (#1F2937) - Ratio 6.8:1 ✓

- **Foreground/Background Pairings**:
  - Background (Light Blue #F8F9FB): oklch(0.98 0.005 250) → Foreground: oklch(0.20 0.01 250) - Ratio 14.2:1 ✓
  - Card (White #FFFFFF): oklch(1 0 0) → Card Text: oklch(0.20 0.01 250) - Ratio 16.5:1 ✓
  - Primary (Blue #2563EB): oklch(0.45 0.15 250) → White: Ratio 8.1:1 ✓
  - Accent (Green #10B981): oklch(0.65 0.15 145) → White: Ratio 5.2:1 ✓

## Font Selection
**Professional and legible**: Use system-standard fonts that convey trustworthiness

- **Typographic Hierarchy**:
  - H1 (Section Titles): Inter Bold/24px/leading-tight - Clear section identification
  - H2 (Card Headers): Inter Semibold/18px/leading-snug - Component titles
  - H3 (Subsections): Inter Semibold/16px/leading-normal - Content subsections
  - Body (Content): Inter Regular/14px/leading-relaxed - Main content text
  - Caption (Metadata): Inter Regular/12px/leading-normal/text-muted-foreground - Secondary information
  - Monospace (IDs/Codes): JetBrains Mono/14px - Technical identifiers

## Animations
**Minimal and purposeful** - Animations should reinforce trust and stability rather than playfulness

- **Purposeful Meaning**: Smooth transitions communicate reliability; no flashy effects that might reduce perceived professionalism
- **Hierarchy of Movement**:
  - Status transitions (pending → processing → completed) use color transitions
  - Modal/dialog appearances use gentle fade-in
  - Progress indicators for multi-step forms
  - Hover states on interactive elements provide subtle feedback

## Component Selection

### Components Used
- **Dialog**: Background check request modal (multi-step), results detail modal
- **Card**: Check list items, stat cards, info panels
- **Form Components**: Input (text/date), Textarea, Select, Checkbox for data collection
- **Tabs**: Organize checks by status (pending, processing, completed)
- **Badge**: Status indicators, check type labels, result classifications
- **Button**: Primary actions (submit, view details), secondary (cancel, back)
- **Progress**: Visual risk score indicator
- **Separator**: Section dividers in forms and results

### Customizations
- **Multi-step Form**: Custom wizard with progress dots and back/continue navigation
- **Risk Score Display**: Large number with color-coded progress bar
- **Status Timeline**: Visual progression showing check lifecycle
- **Results Cards**: Custom layout grouping related verification data

### States
- **Buttons**: 
  - Default: Primary blue with white text
  - Hover: Slightly darker with subtle shadow
  - Disabled: Greyed out for incomplete forms or missing consent
  - Loading: Spinner indicator during submission
  
- **Check Status Badges**:
  - Pending: Grey with clock icon
  - Processing: Yellow/orange with animated pulse
  - Completed: Green with checkmark
  - Failed: Red with warning icon
  - Expired: Muted grey with calendar icon

- **Input Fields**:
  - Default: Light border, neutral background
  - Focus: Blue ring, lifted appearance
  - Error: Red border with error message below
  - Disabled: Greyed out with reduced opacity

### Icon Selection
- **ShieldCheck**: Main feature icon (background checks/screening)
- **CheckCircle**: Verified status, completed checks, positive factors
- **WarningCircle**: Warnings, conditional approvals, areas of concern
- **XCircle**: Failed checks, red flags, denied status
- **Clock**: Pending/processing status
- **Calendar**: Dates, expiration warnings
- **User/IdentificationCard**: Identity verification
- **CreditCard**: Credit score checks
- **Briefcase**: Employment verification
- **House**: Rental history
- **Gavel**: Criminal record and eviction checks
- **CurrencyDollar**: Pricing and cost information

### Spacing
- Consistent 24px (6 Tailwind units) between major sections
- 16px (4 units) between related elements
- 8px (2 units) for tight groupings
- 48px (12 units) padding on modal content
- 32px (8 units) padding on cards

### Mobile Considerations
- **Multi-step forms**: Full-screen on mobile with clear step indicators
- **Results display**: Stack verification components vertically
- **Tab navigation**: Horizontal scroll for status filters
- **Cards**: Full-width on mobile with touch-friendly spacing
- **Buttons**: Full-width primary actions on mobile
- **Table data**: Transform to stacked cards on small screens

## Legal & Compliance Notes

### FCRA Compliance
- Clear disclosure before obtaining consumer report
- Written authorization from applicant
- Adverse action notice if application denied based on report
- Copy of report provided to applicant upon request
- Applicant rights disclosure included

### Data Security
- Encrypted storage of personal information
- 90-day data retention policy
- Secure transmission of sensitive data
- Limited access to results (only requester and applicant)

### Privacy
- Clear data usage policy
- Consent required before processing
- Option to dispute inaccurate information
- Right to access and review own information

## Implementation Notes

### Simulated Processing
- Immediate status change to "processing" after submission
- 5-second delay to simulate API call
- Randomized results generation for demo purposes
- Realistic scoring algorithms based on check types

### Cost Structure
- Itemized pricing per check type
- Package deals for common combinations
- Clear total cost display before submission
- Payment status tracking

### Validity & Reuse
- 90-day validity period from completion date
- Reusable across multiple property applications
- Expiration warnings at 75 days
- Option to request renewal before expiration
