# Webinar Speaker Registration (Xynexis Style)

This is a **standalone React application** designed to be embedded into your WordPress site. It features a premium dark theme matching the Xynexis brand and stores data in Supabase.

## 🚀 Quick Start

### 1. Setup Supabase
1.  Go to [Supabase.com](https://supabase.com) and create a free project.
2.  Go to the **SQL Editor** in your Supabase dashboard.
3.  Copy and paste the contents of `../supabase_schema.sql` (found in the parent folder or helper file) and run it. This creates the database table.
4.  Go to **Project Settings** -> **API**.
5.  Copy the **Project URL** and **anon public key**.

### 2. Configure Environment
Create a file named `.env` (or `.env.local`) in this folder and add your keys:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Locally

```bash
npm install
npm run dev
```
Open `http://localhost:5173` to see the form.

## 🌐 How to Deploy & Embed in WordPress

### 1. Deploy to Vercel (Free)
1.  Push this code to GitHub (or upload via Vercel CLI).
2.  Connect your repo to Vercel.
3.  **Important**: In Vercel Project Settings -> **Environment Variables**, add the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
4.  Deploy! You will get a URL like `https://webinar-registration.vercel.app`.

### 2. Embed in WordPress
1.  Login to your WordPress Admin.
2.  Edit the page where you want the form.
3.  Add a **Custom HTML** block.
4.  Paste this code (replace `YOUR_VERCEL_URL` with your actual link):

```html
<iframe 
  src="https://YOUR_VERCEL_URL.vercel.app" 
  width="100%" 
  height="900px" 
  style="border:none; background-color: #20242F;"
  title="Speaker Registration"
></iframe>
```

### 3. Add Custom Image
1.  Name your image file: `speaker_illustration.png`
2.  Place it in the `public` folder of this project.
    - Path: `webinar-registration/public/speaker_illustration.png`
3.  The image will automatically appear on the top right of the page.

## 🎨 Features
- **Dark Mode**: Matches Xynexis aesthetic.
- **Responsive**: Works on mobile and desktop.
- **Supabase**: Secure data storage.
- **Validation**: Required fields and basic email checks.
