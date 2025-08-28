# 🌐 *Echosphere – AI-Powered Property Management Platform*

*Echosphere* is a modern property management solution that connects *residents, property owners, and maintenance staff* through an AI-powered, voice-enabled platform. It simplifies community living by streamlining issue reporting, service requests, and management workflows.  


## 🎥 Demo Video
https://github.com/user-attachments/assets/dbc75615-8f93-4e04-9bcb-4c829e9d26aa

---

## 🏗 Tech Stack

- *Frontend*: React 19 + TypeScript + Vite + Tailwind CSS  
- *Authentication*: JWT + bcrypt  
- *UI Components*: Radix UI + shadcn/ui  
- *Styling & Animations*: Tailwind CSS + Framer Motion  
- *Voice Features*: Custom voice chat + NLP integration  

---

## ✨ Core Features

### 👥 Multi-Role User System
- *Residents* → Report issues, request services, view events  
- *Property Owners* → Manage properties, approve requests, oversee staff  
- *Technicians* → Handle assigned tasks, update status, communicate  

---

## 🖼 Screenshots

<img width="1631" height="726" alt="image" src="https://github.com/user-attachments/assets/1e20de94-4220-4e16-ae32-f07e4e83d0f7" />
<img width="1152" height="834" alt="image" src="https://github.com/user-attachments/assets/3f3d71a2-b9ab-47a7-9de5-b0cf2867da4b" />

# Owner Dashboard
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/ee29e1b3-8331-40a6-9f47-65647dcb2411" />

# PG Community Dashboard
<img width="1918" height="912" alt="image" src="https://github.com/user-attachments/assets/a726c3c1-4507-4498-99df-b44aa7cdf1a0" />
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/52dc4857-f0b3-47e2-8fcb-cfc929fbd51a" />
<img width="1919" height="914" alt="image" src="https://github.com/user-attachments/assets/a20a476e-c456-4d78-9b71-0e9dc36381bb" />

# Resident Dashboard
<img width="1917" height="907" alt="image" src="https://github.com/user-attachments/assets/f545d4df-1a78-4869-833f-8823e31ce7da" />


---

### 🛠 Issue Management System
- *Types*: Plumbing, Electrical, HVAC, Security, Internet, Appliances, Structural, Pest Control  
- *Priorities*: P1 (Critical) → P4 (Low)  
- *Workflow*: Pending → Assigned → In Progress → Resolved  
- *Attachments*: Multiple image uploads for documentation  

---

### 🧾 Service Request System
- *Services*: Cleaning, Repair, Maintenance, Installation, Inspection  
- *Workflow*: Pending → Awaiting Approval → Approved → Assigned → In Progress → Completed  
- *Approval*: Owner approval required before assignment  

---

### 🎙 Voice-Enabled Features
- *Voice Assistant*: AI-powered conversational interface  
- *Commands*: Raise issues, check status, request services  
- *NLP*: Converts speech into structured, actionable requests  


---

## 🚀 Development Setup

### Frontend (Client)
```bash
cd client
npm install
npm run dev
```

### Backend (Server)
```bash
cd server
npm install
npm run dev
```

### Database
```bash
cd server
npx prisma generate
npx prisma db push
```

