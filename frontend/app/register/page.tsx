"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);

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
    if (!agreed) newErrors.agreed = "You must agree to the terms and conditions";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setSubmitted(true);
  };

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        backgroundImage: "url('/blue-background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* ── Sunray background ── */}
      <div className="sunray" aria-hidden="true" />

      {/* Outer decorative border frame — 12px strips on all 4 sides */}
      {/* Top */}
      <div className="fixed top-0 left-0 right-0 h-10 z-[9998] pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x" }} />
      {/* Bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-10 z-[9998] pointer-events-none"
        style={{ backgroundColor: "#D4A017", backgroundImage: "url('/border-blue.png')", backgroundSize: "auto 100%", backgroundRepeat: "repeat-x", transform: "scaleY(-1)" }} />
      {/* Left */}
      <div className="fixed top-0 left-0 bottom-0 w-10 z-[9998] pointer-events-none overflow-hidden">
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
      <div className="fixed top-0 right-0 bottom-0 w-10 z-[9998] pointer-events-none overflow-hidden">
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
        className="fixed top-10 right-10 z-[9999] pointer-events-none" />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed top-10 left-10 z-[9999] pointer-events-none"
        style={{ transform: "scaleX(-1)" }} />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed bottom-10 right-10 z-[9999] pointer-events-none"
        style={{ transform: "scaleY(-1)" }} />
      <Image src="/corner-triangle.png" alt="" width={250} height={250}
        className="fixed bottom-10 left-10 z-[9999] pointer-events-none"
        style={{ transform: "scale(-1)" }} />

      {/* ── Left side: Camel + Truck ── */}
      <div className="fixed left-0 bottom-0 z-20 pointer-events-none hidden lg:block">
        {/* Truck — slides in first, then bobs */}
        <Image src="/truck.webp" alt="truck" width={340} height={480}
          style={{
            objectFit: "contain",
            display: "block",
            marginTop: "-120px",
            animation:
              "slide-in-left 1s cubic-bezier(0.22,1,0.36,1) 0.2s both",
          }} />
        {/* Camel — slides in slightly after */}
        <Image src="/camel-blue.webp" alt="camel" width={410} height={410}
          style={{
            objectFit: "contain",
            display: "block",
            marginTop: "-220px",
            animation:
              "slide-in-left 1.2s cubic-bezier(0.22,1,0.36,1) 0.55s both",
          }} />
      </div>

      {/* ── Page content ── */}
      {/* ── Page content ── */}
      <div className="relative z-30 flex flex-col items-center justify-start min-h-screen px-4 pb-16">

        {/* ── CRESCENDO LOGO — centered ── */}
        <Link href="/" className="relative z-10">
          <Image
            src="/crescendo-pink.webp"
            alt="CRESCENDO'26"
            width={500}
            height={100}
            style={{ objectFit: "contain" }}
            priority
          />
        </Link>

        {/* ── register noow*/}
            <div className="relative flex flex-col items-center" style={{ marginTop: "-280px", zIndex: 5, marginBottom: "-28px" }}>
          <div className="relative" style={{ width: 420, height: "auto" }}>
            <Image
              src="/sparkel.png"
              alt="banner"
              width={420}
              height={150}
              style={{ width: 420, height: "auto", display: "block" }}
              priority
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p
                className="font-taiganja text-3xl text-center tracking-widest font-bold pt-18"
                style={{ color: "#7B2D0E" }}
              >
                REGISTRATION <br /> PAGE
              </p>
            </div>
          </div>
        </div>

        {/* ── FORM AREA — centered ── */}
        <div className="w-full flex justify-center">
          <div className="relative flex items-stretch justify-center" style={{ width: 480 }}>
            <Image
              src="/border-pink.png"
              alt="decorative frame"
              width={480}
              height={620}
              style={{ objectFit: "fill", width: "100%", height: "100%", position: "absolute", top: 0, left: 0 }}
              className="pointer-events-none select-none"
            />

            {/* Form — drives the height of the container */}
            <div className="relative z-10 flex flex-col items-center justify-center w-full px-16 pt-32 pb-8">
            {submitted ? (
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
                <Link
                  href="/"
                  className="inline-block mt-4 font-taiganja text-base font-bold px-8 py-2 rounded-full border-2 transition-all hover:scale-105"
                  style={{ backgroundColor: "#7B2D0E", color: "#fff8e1", borderColor: "#b5420a" }}
                >
                  BACK TO HOME
                </Link>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="w-full space-y-6" noValidate>

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
                      setFormData({ ...formData, college: e.target.value });
                      setErrors({ ...errors, college: "" });
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg outline-none transition-all"
                    style={{
                      backgroundColor: "#fff8e1",
                      border: `2px solid ${errors.college ? "#cc0000" : "#b5420a"}`,
                      color: formData.college ? "#3a1a00" : "#9a7a5a",
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
                  {errors.college && <p className="text-red-600 text-xs mt-0.5">{errors.college}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full font-taiganja text-base font-bold py-2.5 rounded-xl border-2 transition-all duration-300 hover:scale-105 hover:brightness-110 shadow-lg mt-1 tracking-widest"
                  style={{
                    backgroundColor: "#7B2D0E",
                    color: "#fff8e1",
                    borderColor: "#b5420a",
                  }}
                >
                  SUBMIT REGISTRATION
                </button>

              </form>
            )}
            </div>
          </div>
        </div>{/* end form right wrapper */}

      </div>
    </main>
  );
}
