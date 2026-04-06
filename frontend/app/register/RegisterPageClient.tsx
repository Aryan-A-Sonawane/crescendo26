"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import EventsInterest from "@/components/EventsInterest";

const TICKETS_URL = "https://learner.vierp.in/events";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [step, setStep] = useState<"form" | "otp" | "events" | "success">("form");
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customCollege, setCustomCollege] = useState("");
  const [customColleges, setCustomColleges] = useState<string[]>([]);
  const [registeredUser, setRegisteredUser] = useState<{ name: string; email: string } | null>(null);

  // Load custom colleges + check if already registered
  useEffect(() => {
    const stored = localStorage.getItem("customColleges");
    if (stored) setCustomColleges(JSON.parse(stored));

    const user = localStorage.getItem("crescendo_user");
    if (user) {
      try { setRegisteredUser(JSON.parse(user)); } catch { /* ignore */ }
    }
  }, []);

  const openEventsForRegisteredUser = () => {
    if (!registeredUser) return;
    setFormData((prev) => ({ ...prev, name: registeredUser.name, email: registeredUser.email }));
    setStep("events");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(formData.phone))
      newErrors.phone = "Enter a valid 10-digit Indian mobile number";
    if (!formData.college.trim()) newErrors.college = "College name is required";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    setServerError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, name: formData.name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.error || "Something went wrong. Please try again.");
        return;
      }
      setStep("otp");
    } catch {
      setServerError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otpInput)) {
      setOtpError("Please enter the 6-digit OTP sent to your email.");
      return;
    }
    setLoading(true);
    setOtpError("");
    try {
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpInput }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        setOtpError(verifyData.error || "Invalid OTP. Please try again.");
        return;
      }
      const regRes = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const regData = await regRes.json();
      if (!regRes.ok) {
        if (regData.errors) {
          setErrors(regData.errors);
          setStep("form");
          setServerError("Please check the form and try again.");
        } else {
          setOtpError(regData.error || "Registration failed. Please try again.");
        }
        return;
      }
      // Save to localStorage so Navbar & select-events page can detect the user
      localStorage.setItem("crescendo_user", JSON.stringify({ name: formData.name, email: formData.email }));
      window.dispatchEvent(new Event("crescendo_user_updated"));
      setStep("events");
    } catch {
      setOtpError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const mobileCollegeSelect = (
    <select
      name="college"
      value={formData.college}
      onChange={(e) => {
        setFormData({ ...formData, college: e.target.value });
        setErrors({ ...errors, college: "" });
      }}
      className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-400"
      style={{
        backgroundColor: "rgba(235,245,255,0.7)",
        border: `2px solid ${errors.college ? "#cc0000" : "#1e3a8a"}`,
        color: formData.college ? "#1e1b4b" : "#64748b",
        backdropFilter: "blur(4px)",
      }}
    >
      <option value="" disabled>Select your college</option>
      <optgroup label="Government / Public Engineering Colleges">
        <option>COEP Technological University</option>
        <option>Government College of Engineering and Research, Avasari Khurd</option>
        <option>College of Military Engineering</option>
      </optgroup>
      <optgroup label="Autonomous / Top Private Engineering Colleges">
        <option>Pune Institute of Computer Technology</option>
        <option>Vishwakarma Institute of Technology</option>
        <option>Pimpri Chinchwad College of Engineering</option>
        <option>MIT Academy of Engineering</option>
        <option>Army Institute of Technology</option>
        <option>Symbiosis Institute of Technology</option>
      </optgroup>
      <optgroup label="Major Private Engineering Colleges">
        <option>Bharati Vidyapeeth Deemed University College of Engineering, Pune</option>
        <option>Dr. D. Y. Patil College of Engineering, Akurdi</option>
        <option>Dr. D. Y. Patil Institute of Technology, Pimpri</option>
        <option>AISSMS College of Engineering</option>
        <option>AISSMS Institute of Information Technology</option>
        <option>International Institute of Information Technology, Pune</option>
      </optgroup>
      <optgroup label="Other Engineering Colleges in Pune">
        <option>Modern Education Society&apos;s College of Engineering</option>
        <option>PES Modern College of Engineering</option>
        <option>Pune Vidyarthi Griha&apos;s College of Engineering and Technology</option>
        <option>Marathwada Mitra Mandal&apos;s College of Engineering</option>
        <option>Rajarshi Shahu College of Engineering</option>
        <option>Cummins College of Engineering for Women, Pune</option>
      </optgroup>
      <optgroup label="Sinhgad Group Engineering Colleges">
        <option>Sinhgad College of Engineering, Vadgaon</option>
        <option>Sinhgad Institute of Technology, Lonavala</option>
        <option>NBN Sinhgad School of Engineering</option>
        <option>Sinhgad Institute of Technology and Science</option>
      </optgroup>
      <optgroup label="Other Private Engineering Colleges">
        <option>JSPM&apos;s Jayawantrao Sawant College of Engineering</option>
        <option>JSPM&apos;s Imperial College of Engineering and Research</option>
        <option>JSPM&apos;s Bhivarabai Sawant Institute of Technology and Research</option>
        <option>Indira College of Engineering and Management</option>
        <option>Genba Sopanrao Moze College of Engineering</option>
        <option>Trinity College of Engineering and Research</option>
        <option>Zeal College of Engineering and Research</option>
        <option>Nutan College of Engineering and Research</option>
        <option>Siddhant College of Engineering</option>
        <option>Sahyadri Valley College of Engineering and Technology</option>
        <option>Imperial College of Engineering and Research</option>
        <option>Shri Chhatrapati Shivajiraje College of Engineering</option>
      </optgroup>
      <option value="Other">Other</option>
    </select>
  );

  return (
    <main className="relative min-h-screen w-full overflow-hidden">

      {step === "events" && (
        <div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-auto py-8 px-4"
          style={{ background: "rgba(30,58,138,0.85)", backdropFilter: "blur(12px)" }}
        >
          <div
            className="w-full max-w-lg rounded-3xl border-4 p-6 shadow-2xl overflow-y-auto"
            style={{
              borderColor: "#D4A017",
              backgroundColor: "rgba(255,248,231,0.98)",
              maxHeight: "calc(100vh - 80px)",
            }}
          >
            <EventsInterest
              email={formData.email}
              name={formData.name}
              onComplete={() => setStep(registeredUser ? "form" : "success")}
            />
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          MOBILE LAYOUT  (shown only on screens < lg)
      ════════════════════════════════════════════════════ */}
      <div
        className="lg:hidden flex flex-col w-full min-h-screen"
        style={{
          backgroundImage: "url('/blue-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Top actions area */}
        <div className="w-full pt-6 px-6 flex items-center justify-between z-50">
          <Link href="/"
            className="flex items-center gap-1.5 text-[10px] font-bold px-4 py-2 rounded-full border-2 transition-all hover:scale-105 shadow-md"
            style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}>
            Home
          </Link>
          <a
            href={TICKETS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[10px] font-bold px-4 py-2 rounded-full border-2 transition-all hover:scale-105 shadow-md"
            style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}
          >
            Buy Tickets
          </a>
        </div>

        {/* Form Container — now using Flexbox to prevent overlap */}
        <div className="flex-1 flex items-center justify-center p-4">
          
          {/* Success overlay */}
          {step === "success" && (
            <div className="w-full max-w-sm flex flex-col items-center justify-center text-center space-y-6 px-6 py-12 rounded-3xl"
              style={{ background: "rgba(235,245,255,0.92)", backdropFilter: "blur(10px)", border: "2px solid #1e3a8a", boxShadow: "0 10px 30px rgba(0,0,0,0.2)" }}>
              <div className="text-6xl">🎉</div>
              <p className="font-bold text-xl" style={{ color: "#1e3a8a" }}>Welcome, {formData.name}!</p>
              <p className="text-sm" style={{ color: "#2563eb" }}>Confirmation sent to <span className="font-bold">{formData.email}</span></p>
              <div className="flex flex-col gap-3 w-full">
                <a
                  href={TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-taiganja text-sm font-bold py-3 rounded-full border-2 transition-all hover:scale-105 text-center shadow-lg"
                  style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}
                >
                  BUY TICKETS
                </a>
                <Link href="/" className="font-taiganja text-sm font-bold py-3 rounded-full border-2 transition-all hover:scale-105 text-center shadow-lg"
                  style={{ backgroundColor: "#1e3a8a", color: "#FFF8E7", borderColor: "#D4A017" }}>
                  BACK TO HOME
                </Link>
              </div>
            </div>
          )}

          {/* Form Step — mobile */}
          {step === "form" && (
          <div style={{ position: "relative", width: "100%", maxWidth: 360, minHeight: 480, backgroundImage: "url('/border-pink.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "75px 40px 35px 40px" }}>
            <h2 className="text-center font-bold tracking-widest mb-1.5 text-base" style={{ color: "#4a0e00", textShadow: "0 1px 4px rgba(255,220,150,0.7)" }}>REGISTRATION <br /> FORM</h2>
            {registeredUser ? (
              <div className="flex flex-col items-center gap-2 mb-4">
                <p className="text-center text-xs" style={{ color: "#7B2D0E" }}>Welcome back, <span className="font-bold">{registeredUser.name}</span>!</p>
                <button
                  type="button"
                  onClick={openEventsForRegisteredUser}
                  className="text-xs font-bold px-5 py-2 rounded-full border-2 transition-all hover:scale-105 shadow"
                  style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}
                >
                  SELECT / EDIT YOUR EVENTS
                </button>
              </div>
            ) : (
              <p className="text-center text-xs mb-4" style={{ color: "#7B2D0E" }}>
                Already registered?{" "}
                <Link href="/login" className="font-bold underline" style={{ color: "#8B1538" }}>Login here</Link>
              </p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 w-full" noValidate>
                {/* NAME */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1.5" style={{ color: "#4a0e00" }}>NAME</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: "rgba(235,245,255,0.7)", border: `2px solid ${errors.name ? "#cc0000" : "#1e3a8a"}`, color: "#1e1b4b", backdropFilter: "blur(4px)" }} />
                  {errors.name && <p className="text-red-700 text-xs mt-0.5 font-bold">{errors.name}</p>}
                </div>
                {/* EMAIL */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1.5" style={{ color: "#1e3a8a" }}>EMAIL ID</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: "rgba(235,245,255,0.7)", border: `2px solid ${errors.email ? "#cc0000" : "#1e3a8a"}`, color: "#1e1b4b", backdropFilter: "blur(4px)" }} />
                  {errors.email && <p className="text-red-700 text-xs mt-0.5 font-bold">{errors.email}</p>}
                </div>
                {/* PHONE */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1.5" style={{ color: "#1e3a8a" }}>MOBILE NO</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    placeholder="10-digit mobile number" maxLength={10}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all focus:ring-2 focus:ring-blue-400"
                    style={{ backgroundColor: "rgba(235,245,255,0.7)", border: `2px solid ${errors.phone ? "#cc0000" : "#1e3a8a"}`, color: "#1e1b4b", backdropFilter: "blur(4px)" }} />
                  {errors.phone && <p className="text-red-700 text-xs mt-0.5 font-bold">{errors.phone}</p>}
                </div>
                {/* COLLEGE */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1.5" style={{ color: "#1e3a8a" }}>COLLEGE NAME</label>
                  {/* Since mobileCollegeSelect is a separate const, we should update it there or inline it if possible, but let's assume we update the input/select styles within it via a different call or just update the variable passed to the component */}
                  {mobileCollegeSelect}
                  {errors.college && <p className="text-red-700 text-xs mt-0.5 font-bold">{errors.college}</p>}
                </div>
                {serverError && <p className="text-red-700 text-xs font-bold text-center">{serverError}</p>}
                {/* Submit */}
                <button type="submit" disabled={loading}
                  className="w-full font-taiganja text-base font-bold py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: "#1e3a8a", color: "#FFF8E7", borderColor: "#D4A017" }}>
                  {loading ? "SENDING OTP..." : "SUBMIT"}
                </button>
              </form>
          </div>
          )}

          {/* OTP Step — mobile */}
          {step === "otp" && (
          <div style={{ position: "relative", width: "100%", maxWidth: 360, minHeight: 400, backgroundImage: "url('/border-pink.png')", backgroundSize: "100% 100%", backgroundRepeat: "no-repeat", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "65px 40px 35px 40px" }}>
            <h2 className="text-center font-bold tracking-widest mb-1.5 text-base" style={{ color: "#1e3a8a", textShadow: "0 1px 4px rgba(235,245,255,0.7)" }}>VERIFY<br/>EMAIL</h2>
            <p className="text-center text-xs mb-4" style={{ color: "#2563eb" }}>OTP sent to<br/><span className="font-bold">{formData.email}</span></p>
            <form onSubmit={handleVerifyOtp} className="space-y-4 w-full" noValidate>
              <div>
                <label className="block font-bold text-xs tracking-widest mb-1.5" style={{ color: "#1e3a8a" }}>ENTER OTP</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                  placeholder="6-digit OTP"
                  className="w-full px-3 py-2 text-sm rounded-lg outline-none text-center tracking-[0.3em] font-bold"
                  style={{ backgroundColor: "rgba(235,245,255,0.7)", border: `2px solid ${otpError ? "#cc0000" : "#1e3a8a"}`, color: "#1e1b4b", backdropFilter: "blur(4px)" }}
                />
                {otpError && <p className="text-red-700 text-xs mt-0.5 font-bold">{otpError}</p>}
              </div>
              <button type="submit" disabled={loading}
                className="w-full font-taiganja text-base font-bold py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#8B1538", color: "#FFF8E7", borderColor: "#D4A017" }}>
                {loading ? "VERIFYING..." : "VERIFY OTP"}
              </button>
              <button type="button" disabled={loading} onClick={() => setStep("form")}
                className="w-full text-xs font-bold py-1 transition-all hover:underline disabled:opacity-50"
                style={{ color: "#7B2D0E", background: "none", border: "none" }}>
                ← Edit Details / Resend OTP
              </button>
            </form>
          </div>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          DESKTOP LAYOUT  (hidden on mobile, shown on lg+)
      ════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:block relative min-h-screen w-full overflow-hidden"
        style={{
          backgroundImage: "url('/blue-background.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
      <Link
        href="/"
        className="fixed top-12 left-14 z-50 inline-flex items-center text-sm font-bold px-5 py-2.5 rounded-full border-2 shadow-2xl transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538", fontFamily: "'Cinzel Decorative', serif" }}
      >
        HOME
      </Link>
      <a
        href={TICKETS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed top-12 right-14 z-50 inline-flex items-center text-sm font-bold px-5 py-2.5 rounded-full border-2 shadow-2xl transition-all duration-300 hover:scale-105"
        style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538", fontFamily: "'Cinzel Decorative', serif" }}
      >
        BUY TICKETS
      </a>
      {/* ── Sunray background ── */}
      <div className="sunray" aria-hidden="true" />

      {/* Outer decorative border frame — 12px strips on all 4 sides */}
      {/* Top */}
      <div className="fixed top-0 left-0 right-0 h-10 z-9998 pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
      {/* Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-10 z-9998 pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x", transform: "scaleY(-1)" }} />
      {/* Left */}
      <div className="fixed top-0 left-0 bottom-0 w-10 z-9998 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100vh",
          height: "40px",
          transformOrigin: "top left",
          transform: "rotate(90deg) translateY(-100%)",
          backgroundColor: "#D4A017",
          backgroundImage: "url('/border-blue.png')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
        }} />
      </div>
      {/* Right */}
      <div className="fixed top-0 right-0 bottom-0 w-10 z-9998 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute",
          top: 0, right: 0,
          width: "100vh",
          height: "40px",
          transformOrigin: "top right",
          transform: "rotate(-90deg) translateY(-100%)",
          backgroundColor: "#D4A017",
          backgroundImage: "url('/border-blue.png')",
          backgroundSize: "auto 100%",
          backgroundRepeat: "repeat-x",
        }} />
      </div>

      {/* Corner triangles */}
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed top-10 right-10 z-9999 pointer-events-none" />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed top-10 left-10 z-9999 pointer-events-none"
        style={{ transform: "scaleX(-1)" }} />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed bottom-10 right-10 z-9999 pointer-events-none"
        style={{ transform: "scaleY(-1)" }} />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed bottom-10 left-10 z-9999 pointer-events-none"
        style={{ transform: "scale(-1)" }} />

      <div className="relative z-30 flex flex-col items-center justify-start min-h-screen px-4 pb-16">

        {/* ── FORM AREA — centered ── */}
        <div className="w-full flex justify-center -mt-8">
          <div
            className="relative w-full max-w-125 flex items-center justify-center bg-no-repeat bg-center"
            style={{
              minHeight: 740,
              backgroundImage: "url('/border-pink.png')",
              backgroundSize: "100% 100%",
            }}
          >
            <div className="relative z-10 -translate-y-8 flex flex-col items-center justify-center w-full px-16 pt-36 pb-16">
            {step === "success" ? (
              /* Success State */
              <div className="text-center space-y-4">
                <div className="text-5xl">🎉</div>
                <h3 className="font-taiganja text-2xl" style={{ color: "#7B2D0E" }}>
                  You&apos;re Registered!
                </h3>
                <p className="font-bold text-lg" style={{ color: "#b5420a" }}>
                  Welcome, {formData.name}!
                </p>
                <p className="text-sm" style={{ color: "#7B2D0E" }}>
                  Confirmation sent to{" "}
                  <span className="font-bold">{formData.email}</span>
                </p>
                <a
                  href={TICKETS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 font-taiganja text-base font-bold px-8 py-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}
                >
                  BUY TICKETS
                </a>
                <Link
                  href="/"
                  className="inline-block mt-4 font-taiganja text-base font-bold px-8 py-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{ backgroundColor: "#7B2D0E", color: "#fff8e1", borderColor: "#b5420a" }}
                >
                  BACK TO HOME
                </Link>
              </div>
            ) : step === "otp" ? (
              /* OTP Verification Step */
              <div className="w-full space-y-5">
                <div className="text-center">
                  <div className="text-4xl mb-2">📧</div>
                  <h3 className="font-taiganja text-xl font-bold" style={{ color: "#7B2D0E" }}>Verify Your Email</h3>
                  <p className="text-sm mt-1" style={{ color: "#b5420a" }}>
                    We sent a 6-digit OTP to<br/>
                    <span className="font-bold">{formData.email}</span>
                  </p>
                </div>
                <form onSubmit={handleVerifyOtp} className="w-full space-y-4" noValidate>
                  <div>
                    <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                      ENTER OTP
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => { setOtpInput(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                      placeholder="• • • • • •"
                      className="w-full px-3 py-3 text-xl rounded-lg outline-none transition-all text-center tracking-[0.5em] font-bold"
                      style={{
                        backgroundColor: "#fff8e1",
                        border: `2px solid ${otpError ? "#cc0000" : "#b5420a"}`,
                        color: "#3a1a00",
                      }}
                    />
                    {otpError && <p className="text-red-600 text-xs mt-0.5">{otpError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full font-taiganja text-base font-bold py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg mt-1 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ backgroundColor: "#7B2D0E", color: "#fff8e1", borderColor: "#b5420a" }}
                  >
                    {loading ? "VERIFYING..." : "VERIFY OTP"}
                  </button>
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setStep("form")}
                    className="w-full text-sm font-bold py-1 transition-all hover:underline disabled:opacity-50"
                    style={{ color: "#7B2D0E", background: "none", border: "none" }}
                  >
                    ← Edit Details / Resend OTP
                  </button>
                </form>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>

                {/* Already registered prompt / manage events button */}
                {registeredUser ? (
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-center text-xs" style={{ color: "#7B2D0E" }}>Welcome back, <span className="font-bold">{registeredUser.name}</span>!</p>
                    <button
                      type="button"
                      onClick={openEventsForRegisteredUser}
                      className="text-sm font-bold px-5 py-2 rounded-full border-2 transition-all hover:scale-105 shadow"
                      style={{ backgroundColor: "#D4A017", color: "#4a0e00", borderColor: "#8B1538" }}
                    >
                      SELECT / EDIT YOUR EVENTS
                    </button>
                  </div>
                ) : (
                  <p className="text-center text-xs" style={{ color: "#7B2D0E" }}>
                    Already registered?{" "}
                    <Link href="/login" className="font-bold underline" style={{ color: "#8B1538" }}>Login here</Link>
                  </p>
                )}

                {/* NAME */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                    NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#fff8e1",
                      border: `2px solid ${errors.name ? "#cc0000" : "#b5420a"}`,
                      color: "#3a1a00",
                    }}
                  />
                  {errors.name && <p className="text-red-600 text-xs mt-0.5">{errors.name}</p>}
                </div>

                {/* EMAIL */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                    EMAIL ID
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#fff8e1",
                      border: `2px solid ${errors.email ? "#cc0000" : "#b5420a"}`,
                      color: "#3a1a00",
                    }}
                  />
                  {errors.email && <p className="text-red-600 text-xs mt-0.5">{errors.email}</p>}
                </div>

                {/* PHONE */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                    MOBILE NO
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#fff8e1",
                      border: `2px solid ${errors.phone ? "#cc0000" : "#b5420a"}`,
                      color: "#3a1a00",
                    }}
                  />
                  {errors.phone && <p className="text-red-600 text-xs mt-0.5">{errors.phone}</p>}
                </div>

                {/* COLLEGE */}
                <div>
                  <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                    COLLEGE NAME
                  </label>
                  <select
                    name="college"
                    value={formData.college}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, college: value });
                      setErrors({ ...errors, college: "" });
                      setShowOtherInput(value === "Other");
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#fff8e1",
                      border: `2px solid ${errors.college ? "#cc0000" : "#b5420a"}`,
                      color: formData.college ? "#3a1a00" : "#9a7a5a",
                    }}
                  >
                    <option value="" disabled>Select your college</option>
                    <option>Vishwakarma Institute of Technology, Bibwewadi</option>
                    <option>Vishwakarma Institute of Technology, Kondhwa</option>
                    <option>COEP Technological University</option>
                    <option>Government College of Engineering and Research, Avasari Khurd</option>
                    <option>College of Military Engineering</option>
                    <option>Pune Institute of Computer Technology</option>
                    <option>Pimpri Chinchwad College of Engineering</option>
                    <option>MIT Academy of Engineering</option>
                    <option>Army Institute of Technology</option>
                    <option>Symbiosis Institute of Technology</option>
                    <option>Bharati Vidyapeeth Deemed University College of Engineering, Pune</option>
                    <option>Dr. D. Y. Patil College of Engineering, Akurdi</option>
                    <option>Dr. D. Y. Patil Institute of Technology, Pimpri</option>
                    <option>AISSMS College of Engineering</option>
                    <option>AISSMS Institute of Information Technology</option>
                    <option>International Institute of Information Technology, Pune</option>
                    <option>Modern Education Society&apos;s College of Engineering</option>
                    <option>PES Modern College of Engineering</option>
                    <option>Pune Vidyarthi Griha&apos;s College of Engineering and Technology</option>
                    <option>Marathwada Mitra Mandal&apos;s College of Engineering</option>
                    <option>Rajarshi Shahu College of Engineering</option>
                    <option>Cummins College of Engineering for Women, Pune</option>
                    <option>Sinhgad College of Engineering, Vadgaon</option>
                    <option>Sinhgad Institute of Technology, Lonavala</option>
                    <option>NBN Sinhgad School of Engineering</option>
                    <option>Sinhgad Institute of Technology and Science</option>
                    <option>JSPM&apos;s Jayawantrao Sawant College of Engineering</option>
                    <option>JSPM&apos;s Imperial College of Engineering and Research</option>
                    <option>JSPM&apos;s Bhivarabai Sawant Institute of Technology and Research</option>
                    <option>Indira College of Engineering and Management</option>
                    <option>Genba Sopanrao Moze College of Engineering</option>
                    <option>Trinity College of Engineering and Research</option>
                    <option>Zeal College of Engineering and Research</option>
                    <option>Nutan College of Engineering and Research</option>
                    <option>Siddhant College of Engineering</option>
                    <option>Sahyadri Valley College of Engineering and Technology</option>
                    <option>Imperial College of Engineering and Research</option>
                    <option>Shri Chhatrapati Shivajiraje College of Engineering</option>
                    {customColleges.map((college, index) => (
                      <option key={index}>{college}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>
                  {errors.college && <p className="text-red-600 text-xs mt-0.5">{errors.college}</p>}
                </div>

                {/* CUSTOM COLLEGE INPUT - shows when "Other" is selected */}
                {showOtherInput && (
                  <div>
                    <label className="block font-bold text-xs tracking-widest mb-1" style={{ color: "#7B2D0E" }}>
                      ENTER COLLEGE NAME
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customCollege}
                        onChange={(e) => setCustomCollege(e.target.value)}
                        placeholder="Type your college name"
                        className="flex-1 px-3 py-2 text-sm rounded-lg outline-none transition-all"
                        style={{ backgroundColor: "#fff8e1", border: "2px solid #b5420a", color: "#3a1a00" }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customCollege.trim()) {
                            const newCustomColleges = [...customColleges, customCollege.trim()];
                            setCustomColleges(newCustomColleges);
                            localStorage.setItem("customColleges", JSON.stringify(newCustomColleges));
                            setFormData({ ...formData, college: customCollege.trim() });
                            setShowOtherInput(false);
                            setCustomCollege("");
                          }
                        }}
                        className="px-4 py-2 text-sm font-bold rounded-lg transition-all"
                        style={{ backgroundColor: "#8B1538", color: "#FFFFFF" }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {serverError && <p className="text-red-600 text-xs font-bold text-center">{serverError}</p>}
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full font-taiganja text-base font-bold py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg mt-1 tracking-widest disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "#7B2D0E",
                    color: "#fff8e1",
                    borderColor: "#b5420a",
                  }}
                >
                  {loading ? "SENDING OTP..." : "SUBMIT"}
                </button>

              </form>
            )}
            </div>
          </div>
        </div>{/* end form right wrapper */}

      </div>
    </div> {/* end desktop layout */}
    </main>
  );
}
