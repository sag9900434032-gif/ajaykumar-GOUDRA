# 🌌 AURORA — Glassmorphic College Administration Panel

> **A World-Class, Production-Grade Unified Campus Intelligence & Administration OS**  
> Engineered with **React 18**, **TypeScript**, **Tailwind CSS**, and an award-winning **Glassmorphism Design System**. Built for daily operations across 5,000+ students and multi-department faculty.

---

## 🌟 Executive Highlights

AURORA is designed to eliminate fragmented administrative tools by uniting attendance telemetry, attendance-linked payroll, fee treasury ledger, verifiable credential issuance, and zero-trust role-based access into a single, cohesive glassmorphic control surface.

- **Deep-Space Luminous Canvas**: Base `#070812` with 4 radial gradients (Violet, Teal, Magenta, Blue) and 3 floating 40s blurred animated blobs (`filter: blur(120px)`).
- **Tactile Glassmorphic Tokens**: Semi-transparent panels (`rgba(255,255,255,0.07)`), `blur(22px) saturate(180%)`, 1px top specular highlights (`inset 0 1px 0 rgba(255,255,255,0.12)`), and glowing ambient status indicators.
- **Attendance-Linked Payroll Engine**: Prorates Basic Pay automatically based on Loss of Pay (LOP) days tracked from daily attendance logs.
- **Verifiable Credentials**: Generates printable institutional documents (Official Salary Slips with Karnataka state letterhead, Bonafide Certificates, Transfer Certificates, and Fee Receipts).
- **Dynamic RBAC & Persona Switching**: Live permission matrix for 6 administrative tiers with instant capability toggling and route protection.

---

## 🛠️ Technology Architecture

| Layer | Technology |
|---|---|
| **Core Framework** | React 18 + TypeScript + Vite 6 |
| **Styling & Design Tokens** | Tailwind CSS v3.4.17 + Vanilla CSS Glass Tokens (`src/styles/glass.css`) |
| **Iconography** | Lucide React |
| **Typography** | Plus Jakarta Sans, Inter, Fraunces (Editorial Display) |
| **Data & State Layer** | Reactive in-memory service adapter architecture with realistic 60+ student and 21+ faculty seed data |
| **Accessibility** | High contrast ratios, accessible focus rings, and `prefers-reduced-motion` compliance |

---

## 🏛️ Comprehensive Module Map

### 1. 📊 Executive Dashboard (`/dashboard`)
- **6 Key Administrative Metrics**: Total Students (2,450), Active Faculty (142), Today's Attendance (89.4%), Attendance Defaulters (18), Monthly Payroll (₹15.30L), Realized Fees (91.0%).
- **Attendance Trend Area Chart**: Interactive 7-day, 30-day, and 90-day SVG visualization with gradient fill.
- **Department Distribution Matrix**: Science (PCMB/C), Commerce (EBAC), and Arts (HEPS) enrollment comparison.
- **Live Institutional Activity Timeline**: Real-time event log of payroll locks, RFID syncs, and fee collections.
- **Quick Action Launchers**: Instant shortcuts to mark attendance, run payroll, or issue certificates.

### 2. 📅 Attendance Live Monitor (`/attendance`)
- **Live Today Register**: Tabular view of daily student check-ins with multi-status indicators (`present`, `absent`, `late`, `excused`).
- **Defaulters Engine (<75%)**: Dynamic slider threshold; filters students risking board exam disqualification with 1-click WhatsApp/SMS notification dispatcher.
- **QR Check-in Simulator**: Live QR code generator and code scanner simulator.
- **Biometric / RFID Gate Reader**: Turnstile feed simulator supporting RFID card taps and morning gate batches.
- **Monthly Heatmap Calendar**: Interactive GitHub-style attendance intensity calendar.

### 3. 💳 Payroll & Salary Slips (`/payroll`)
- **Lifecycle Pipeline**: 4-stage payroll workflow (`Draft` → `Under Review` → `Approved` → `Paid`).
- **Loss of Pay (LOP) Automatic Proration**:
  $$\text{Paid Days} = \text{Working Days} - \text{LOP Days}$$
  $$\text{Prorated Basic} = \text{Faculty Basic Pay} \times \left(\frac{\text{Paid Days}}{\text{Working Days}}\right)$$
  Computes HRA (24%), DA (17%), TA (8%), PF (12%), PT, ESI, and TDS.
- **Institutional Salary Slip Modal**: Printable letterhead salary slip with Kannada/English headings, amount in Indian currency words, watermark, and bank disbursement particulars.
- **Bulk JSON / CSV Export**: Instant export of monthly payroll disbursement ledgers.

### 4. 👥 Students & Faculty Directory (`/people`)
- **Student Master Records**: Searchable roster with roll numbers, departments, semesters, categories, and GPA.
- **Faculty Roster**: Designations, qualifications, experience, basic pay, and assigned subjects.
- **Slide-out Inspector Drawer**: Right-side drawer with student particulars, emergency contact, blood group, and quick actions.
- **Digital Student ID Card**: Interactive glass ID badge with barcode, college seal, and photo placeholder.
- **Enrollment Dialog**: New student admission modal with department selection.

### 5. 🎓 Academics, Timetable & Examinations (`/academics`)
- **Curriculum Programs**: PCMB, PCMC, EBAC, and HEPS program cards with syllabus completion tracking.
- **Weekly Schedule Grid**: 6-day timetable (Periods 1 through 6) with teacher assignments and laboratory allocations.
- **Examination Merit Matrix**: Mid-term board mock evaluations with subject breakdown, rank, and Distinction honors.
- **Verifiable Institutional Certificates**: Transfer Certificates (TC), Study/Bonafide Certificates, and Merit Scholastic Certificates.

### 6. 💰 Fee Treasury & Collections (`/finance`)
- **Treasury KPIs**: Total Collections (₹42.50L), Outstanding Dues, and Collection Efficiency (91.0%).
- **Stream Fee Schedules**: Science (₹45k), Commerce (₹38k), Arts (₹28k).
- **Real-Time Student Ledger**: Filterable by payment status (`paid`, `partial`, `overdue`).
- **Collect Payment Modal**: Instant receipt generator with official receipt numbers (#REC-2026-XXXX) and printable format.

### 7. 📈 Reports & Dynamic Query Engine (`/reports`)
- **1-Click Pre-Built Reports**: Defaulters Report, Payroll Ledger, Fee Realization, and Faculty Workload.
- **Custom Query Builder**: Cross-entity query interface (select data source → pick columns → apply filters → download CSV or JSON).

### 8. 🛡️ Security, RBAC & System Configuration (`/system`)
- **Live RBAC Matrix Editor**: Granular toggles across 6 roles and 11 permission scopes.
- **Institutional Profile**: Affiliation details (KA-KOP-PU-4402), campus address, and head of institution.
- **IoT Biometric Gateway Monitor**: ESP32 controller status, IP address, and hardware round-trip diagnostics.
- **Immutable Audit Trail**: Event logging with timestamps, actors, and detailed scopes.

### 9. 🔐 Institutional Login & Persona Picker (`/login`)
- 1-click instant login as any of the 6 institutional roles (Super Admin, Principal, HOD, Accountant, Faculty, Student).
- Email & password authentication with show/hide password toggle.

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Permission Scope | Super Admin | Principal | HOD | Accountant | Faculty | Student |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Dashboard** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Attendance Monitor** | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **Run Payroll** | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| **View All Slips** | ✅ | ✅ | ❌ | ✅ | ❌ *(Self only)* | ❌ |
| **Manage Students** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **Manage Faculty** | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Academics & Exams**| ✅ | ✅ | ✅ | ❌ | ✅ | ❌ |
| **View Fee Ledger** | ✅ | ✅ | ❌ | ✅ | ❌ *(Hidden)* | ❌ *(Hidden)* |
| **Collect Payments** | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **Reports Engine** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| **System Settings** | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or Node.js 20+
- npm or pnpm

### Quick Setup

```bash
# Navigate to project directory
cd aurora

# Install dependencies (already prepared)
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build

```bash
npm run build
```

The production bundle will be generated in `dist/` with full tree-shaking and minification.

---

## ⌨️ Keyboard Shortcuts

- `⌘K` or `Ctrl + K`: Open Global Command Palette & Fuzzy Search
- `Esc`: Close any open Modal, Inspector Drawer, or Command Palette
