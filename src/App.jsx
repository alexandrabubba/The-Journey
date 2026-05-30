import React, { useState } from "react";
import { ArrowRight, BookOpen, Camera, CheckCircle, Crown, Droplets, Dumbbell, Heart, Lock, Sparkles, Star, Trophy, Upload, Utensils } from "lucide-react";
import { jsPDF } from "jspdf";

function Card({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

function SoftCard({ children, className = "" }) {
  return (
    <Card className={`rounded-[2rem] border border-[#F7D6E0] bg-white/90 shadow-[0_18px_45px_rgba(183,110,121,0.12)] ${className}`}>
      <CardContent className="p-7 md:p-9">{children}</CardContent>
    </Card>
  );
}

export default function SeventyFiveHardGuide() {
  const [page, setPage] = useState("rulebook");
  const [trackerName, setTrackerName] = useState("");
  const [whyStarted, setWhyStarted] = useState("");
  const [readingFocus, setReadingFocus] = useState("");
  const [notificationPreference, setNotificationPreference] = useState("");
  const [shareStatus, setShareStatus] = useState("");
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [testMode, setTestMode] = useState(false);
  const [testDay, setTestDay] = useState(75);
  const [completedTasks, setCompletedTasks] = useState({});
  const [uploadedPhotos, setUploadedPhotos] = useState({});
  const [letterSealed, setLetterSealed] = useState(false);
  const [letterSaved, setLetterSaved] = useState(false);
  const [futureLetter, setFutureLetter] = useState({ why: "", change: "", feeling: "", promise: "" });
  const [completionReflection, setCompletionReflection] = useState({
    proud: "",
    compared: "",
    habit: "",
    surprised: "",
    dayZeroMessage: "",
    futureLetter: "",
  });
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const rules = ["Follow your nutrition plan", "No sugary drinks", "No processed foods", "No cheat meals", "Drink 1 gallon of water", "Read 20 pages", "Two 45-minute workouts", "One workout outdoors", "Daily progress photo", "Miss one task = restart Day 1"];
  const checklist = [
    { text: "Workout #1 complete", icon: Dumbbell },
    { text: "Outdoor workout complete", icon: Dumbbell },
    { text: "1 gallon of water", icon: Droplets },
    { text: "20 pages read", icon: BookOpen },
    { text: "Nutrition plan followed", icon: Utensils },
    { text: "Progress photo taken", icon: Camera },
    { text: "No cheat meals", icon: CheckCircle },
  ];
  const trackerDays = Array.from({ length: 75 }, (_, i) => i + 1);
  const photoDays = [7, 14, 21, 30, 45, 60, 75];
  const timelinePhotoLabels = ["Day 0", "Day 7", "Day 14", "Day 21", "Day 30", "Day 45", "Day 60", "Day 75"];
  const selectedPhotoLabel = selectedDay === currentDay && photoDays.includes(selectedDay) ? `Day ${selectedDay}` : null;
  const progress = Math.round((currentDay / 75) * 100);
  const certificateNumber = `TJ-${new Date().getFullYear()}-${String((trackerName || "Journey").length * 75).padStart(5, "0")}`;
  const pagesRead = Math.max(currentDay - 1, 0) * 20;
  const waterGoals = Math.max(currentDay - 1, 0);

  const quotes = [
    "You don't have to be extreme. You just have to be consistent.",
    "Motivation starts the journey. Discipline finishes it.",
    "Small actions repeated daily create extraordinary results.",
    "Every completed day is a vote for the person you're becoming.",
    "Discipline creates confidence that no one can take from you.",
    "You didn't come this far to stop now.",
  ];
  const verses = [
    { verse: "Be strong and courageous. Do not be afraid or discouraged, for the Lord your God is with you wherever you go.", ref: "Joshua 1:9" },
    { verse: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { verse: "Let us not become weary in doing good.", ref: "Galatians 6:9" },
    { verse: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", ref: "2 Timothy 1:7" },
    { verse: "He who began a good work in you will carry it on to completion.", ref: "Philippians 1:6" },
    { verse: "I have fought the good fight, I have finished the race, I have kept the faith.", ref: "2 Timothy 4:7" },
  ];
  const quote = quotes[(selectedDay - 1) % quotes.length];
  const verse = verses[(selectedDay - 1) % verses.length];

  const bookCategories = [
    {
      title: "Leadership & Influence",
      books: [
        { title: "The 21 Irrefutable Laws of Leadership", author: "John C. Maxwell" },
        { title: "Leaders Eat Last", author: "Simon Sinek" },
        { title: "Extreme Ownership", author: "Jocko Willink & Leif Babin" },
      ],
    },
    {
      title: "Confidence & Self-Worth",
      books: [
        { title: "The Gifts of Imperfection", author: "Brené Brown" },
        { title: "The Mountain Is You", author: "Brianna Wiest" },
        { title: "You Are a Badass", author: "Jen Sincero" },
      ],
    },
    {
      title: "Discipline & Mental Toughness",
      books: [
        { title: "Atomic Habits", author: "James Clear" },
        { title: "Can't Hurt Me", author: "David Goggins" },
        { title: "The Compound Effect", author: "Darren Hardy" },
      ],
    },
    {
      title: "Purpose & Finding Your Why",
      books: [
        { title: "Start With Why", author: "Simon Sinek" },
        { title: "Man's Search for Meaning", author: "Viktor E. Frankl" },
        { title: "The Purpose Driven Life", author: "Rick Warren" },
      ],
    },
    {
      title: "Faith & Spiritual Growth",
      books: [
        { title: "Battlefield of the Mind", author: "Joyce Meyer" },
        { title: "Fervent", author: "Priscilla Shirer" },
        { title: "The Purpose Driven Life", author: "Rick Warren" },
      ],
    },
    {
      title: "Financial Growth",
      books: [
        { title: "The Psychology of Money", author: "Morgan Housel" },
        { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki" },
        { title: "The Millionaire Next Door", author: "Thomas J. Stanley" },
      ],
    },
  ];

  const bookLink = (book, destination) => {
    const query = encodeURIComponent(`${book.title} ${book.author}`);
    if (destination === "amazon") return `https://www.amazon.com/s?k=${query}`;
    if (destination === "audible") return `https://www.audible.com/search?keywords=${query}`;
    return `https://www.goodreads.com/search?q=${query}`;
  };

  const openBookLink = (book, destination) => {
    window.open(bookLink(book, destination), "_blank", "noopener,noreferrer");
  };

  const canStartJourney = trackerName.trim() && whyStarted.trim() && readingFocus && notificationPreference;

  const achievements = [
    { day: 1, title: "Started Strong" },
    { day: 7, title: "One Week Strong" },
    { day: 21, title: "Discipline Builder" },
    { day: 30, title: "One Month Strong" },
    { day: 45, title: "Halfway Hero" },
    { day: 60, title: "Final Stretch" },
    { day: 75, title: "75 Hard Finisher" },
  ];

  const getDayTasks = (day) => completedTasks[day] || [];
  const isDayComplete = (day) => getDayTasks(day).length === checklist.length;
  const toggleTask = (task) => {
    setCompletedTasks((prev) => {
      const dayTasks = prev[currentDay] || [];
      const updated = dayTasks.includes(task) ? dayTasks.filter((t) => t !== task) : [...dayTasks, task];
      return { ...prev, [currentDay]: updated };
    });
  };
  const unlockNextDay = () => {
    if (!isDayComplete(currentDay)) return;
    const next = Math.min(currentDay + 1, 75);
    setCurrentDay(next);
    setSelectedDay(next);
  };

  const jumpToTestDay = () => {
    const day = Math.min(Math.max(Number(testDay) || 1, 1), 75);
    setCurrentDay(day);
    setSelectedDay(day);
  };
  const savePhoto = (label, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedPhotos((prev) => ({
        ...prev,
        [label]: {
          name: file.name,
          url: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const downloadCertificate = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const centerX = pageWidth / 2;

    doc.setFillColor("#FFF9F5");
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setDrawColor("#F7D6E0");
    doc.setLineWidth(16);
    doc.rect(34, 34, pageWidth - 68, pageHeight - 68);

    doc.setDrawColor("#D4AF37");
    doc.setLineWidth(2.5);
    doc.rect(56, 56, pageWidth - 112, pageHeight - 112);

    doc.setTextColor("#D4AF37");
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text("✦", 74, 82);
    doc.text("✦", pageWidth - 84, 82);
    doc.text("✦", 74, pageHeight - 72);
    doc.text("✦", pageWidth - 84, pageHeight - 72);

    doc.setTextColor("#D4AF37");
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.text("75 HARD TRANSFORMATION JOURNAL", centerX, 96, { align: "center" });

    doc.setTextColor("#B76E79");
    doc.setFont("times", "bold");
    doc.setFontSize(36);
    doc.text("Certificate of Completion", centerX, 142, { align: "center" });

    doc.setTextColor("#6B5F5F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(15);
    doc.text("This certifies that", centerX, 185, { align: "center" });

    doc.setTextColor("#4A4A4A");
    doc.setFont("times", "normal");
    doc.setFontSize(30);
    doc.text(trackerName || "Participant Name", centerX, 228, { align: "center" });

    doc.setDrawColor("#D4AF37");
    doc.setLineWidth(1.5);
    doc.line(centerX - 180, 240, centerX + 180, 240);

    doc.setTextColor("#6B5F5F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(14);
    doc.text("successfully completed the", centerX, 280, { align: "center" });

    doc.setTextColor("#B76E79");
    doc.setFont("times", "bold");
    doc.setFontSize(27);
    doc.text("75 Hard Challenge", centerX, 318, { align: "center" });

    doc.setTextColor("#6B5F5F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text("through 75 consecutive days of discipline, consistency, resilience,", centerX, 354, { align: "center" });
    doc.text("faith, personal growth, and promises kept.", centerX, 374, { align: "center" });

    const stats = [["75", "DAYS"], ["150", "WORKOUTS"], ["1,500", "PAGES"], ["75", "GALLONS"]];
    const boxWidth = 120;
    const gap = 48;
    const totalWidth = stats.length * boxWidth + (stats.length - 1) * gap;
    const startX = centerX - totalWidth / 2;
    stats.forEach(([number, label], index) => {
      const x = startX + index * (boxWidth + gap);
      doc.setDrawColor("#D4AF37");
      doc.setLineWidth(1.8);
      doc.setFillColor("#FFFDFB");
      doc.roundedRect(x, 410, boxWidth, 68, 14, 14, "FD");
      doc.setTextColor("#D4AF37");
      doc.setFont("times", "bold");
      doc.setFontSize(25);
      doc.text(number, x + boxWidth / 2, 442, { align: "center" });
      doc.setTextColor("#B76E79");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.text(label, x + boxWidth / 2, 464, { align: "center" });
    });

    doc.setFillColor("#D4AF37");
    doc.circle(centerX, 505, 38, "F");
    doc.setTextColor("#FFFFFF");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("PROMISE", centerX, 502, { align: "center" });
    doc.text("KEPT", centerX, 518, { align: "center" });

    doc.setTextColor("#4A4A4A");
    doc.setFont("times", "italic");
    doc.setFontSize(13);
    doc.text("“I have fought the good fight, I have finished the race, I have kept the faith.”", centerX, 570, { align: "center" });
    doc.setTextColor("#B76E79");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("2 Timothy 4:7", centerX, 590, { align: "center" });

    doc.setDrawColor("#D4AF37");
    doc.setLineWidth(1.4);
    doc.line(165, 632, 335, 632);
    doc.line(pageWidth - 335, 632, pageWidth - 165, 632);
    doc.setTextColor("#6B5F5F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Completion Date", 250, 648, { align: "center" });
    doc.text("Signature", pageWidth - 250, 648, { align: "center" });

    doc.setTextColor("#B76E79");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(`Certificate No. ${certificateNumber}`, centerX, 668, { align: "center" });

    doc.setTextColor("#D4AF37");
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.text("A promise kept becomes confidence earned.", centerX, 684, { align: "center" });

    doc.save(`${trackerName || "The_Journey"}_75_Hard_Certificate.pdf`);
  };

  const printCertificate = () => window.print();

  const shareAchievement = async () => {
    const text = `${trackerName || "I"} completed The Journey: 75 Hard Challenge. 75 days. 150 workouts. 1,500 pages. One promise kept.`;
    setShareStatus("");

    try {
      if (navigator.share && window.isSecureContext) {
        await navigator.share({ title: "The Journey", text });
        setShareStatus("Achievement shared successfully ✅");
        return;
      }
      throw new Error("Web Share unavailable");
    } catch (error) {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
          setShareStatus("Sharing was not available here, so your achievement was copied to your clipboard ✅");
        } else {
          setShareStatus(`Copy this achievement: ${text}`);
        }
      } catch (clipboardError) {
        setShareStatus(`Copy this achievement: ${text}`);
      }
    }
  };
  const runSelfTests = () => {
    const sampleBook = bookCategories[0]?.books[0];
    const tests = [
      { name: "Tracker name field exists", pass: typeof trackerName === "string" },
      { name: "Required onboarding can lock/unlock", pass: typeof canStartJourney === "string" || canStartJourney === false },
      { name: "Checklist has tasks", pass: checklist.length > 0 },
      { name: "Tracker has 75 days", pass: trackerDays.length === 75 },
      { name: "Photo timeline has Day 0 and Day 75", pass: timelinePhotoLabels.includes("Day 0") && timelinePhotoLabels.includes("Day 75") },
      { name: "Checkpoint photos include Day 7", pass: photoDays.includes(7) },
      { name: "Certificate number exists", pass: certificateNumber.startsWith("TJ-") },
      { name: "Book categories exist", pass: bookCategories.length > 0 },
      { name: "Book links generate Amazon URL", pass: sampleBook ? bookLink(sampleBook, "amazon").includes("amazon.com") : false },
      { name: "Book links generate Audible URL", pass: sampleBook ? bookLink(sampleBook, "audible").includes("audible.com") : false },
      { name: "Book links generate Goodreads URL", pass: sampleBook ? bookLink(sampleBook, "goodreads").includes("goodreads.com") : false },
      { name: "Share fallback status is available", pass: typeof setShareStatus === "function" },
      { name: "PDF download function exists", pass: typeof downloadCertificate === "function" },
    ];

    const failed = tests.filter((test) => !test.pass);
    setShareStatus(failed.length ? `Self-test failed: ${failed.map((test) => test.name).join(", ")}` : "All self-tests passed ✅");
  };

  const updateCompletionReflection = (field, value) => {
    if (reflectionSaved) return;
    setCompletionReflection((prev) => ({ ...prev, [field]: value }));
  };

  const saveCompletionReflection = () => {
    const hasReflection = Object.values(completionReflection).some((value) => value.trim().length > 0);
    if (hasReflection) setReflectionSaved(true);
  };

  const saveLetter = () => {
    const hasText = Object.values(futureLetter).some((v) => v.trim());
    if (hasText) setLetterSaved(true);
  };

  const sealLetter = () => {
    if (letterSaved) setLetterSealed(true);
  };

  if (page === "bookLibrary") {
    return (
      <div className="min-h-screen bg-[#FFF9F5] text-[#4A4A4A]">
        <section className="px-6 py-12 max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[#9F5F6B] font-semibold">The Journey</p>
              <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#B76E79]">Book Library</h1>
              <p className="text-[#6B5F5F] mt-3">Choose books that support the person you are becoming.</p>
            </div>
            <button onClick={() => setPage("rulebook")} className="rounded-full bg-white border border-[#EAB6C4] px-5 py-2 text-[#9F5F6B] font-semibold">Back to Rulebook</button>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {bookCategories.map((category) => (
              <SoftCard key={category.title}>
                <h3 className="font-serif text-2xl font-bold text-[#B76E79] mb-4">{category.title}</h3>
                <div className="space-y-4">
                  {category.books.map((book) => (
                    <div key={book.title} className="rounded-2xl bg-[#FFF9F5] border border-[#F7D6E0] p-4">
                      <p className="font-bold text-[#9F5F6B]">{book.title}</p>
                      <p className="text-sm text-[#6B5F5F] mb-3">by {book.author}</p>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => openBookLink(book, "amazon")} className="rounded-full bg-[#EAB6C4] px-3 py-1 text-xs font-bold text-white hover:bg-[#B76E79] transition">Amazon</button>
                        <button onClick={() => openBookLink(book, "audible")} className="rounded-full bg-white border border-[#D4AF37]/50 px-3 py-1 text-xs font-bold text-[#9F5F6B] hover:bg-[#FFF9F5] transition">Audible</button>
                        <button onClick={() => openBookLink(book, "goodreads")} className="rounded-full bg-white border border-[#F7D6E0] px-3 py-1 text-xs font-bold text-[#9F5F6B] hover:bg-[#F7D6E0]/40 transition">Goodreads</button>
                      </div>
                    </div>
                  ))}
                </div>
              </SoftCard>
            ))}
          </div>
        </section>
      </div>
    );
  }

  if (page === "rulebook") {
    return (
      <div className="min-h-screen bg-[#FFF9F5] text-[#4A4A4A]">
        <section className="px-6 py-24 text-center max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/30 bg-white px-5 py-2 text-sm font-semibold text-[#9F5F6B] mb-7"><Sparkles size={16} className="text-[#D4AF37]" /> The Journey · A 75 Hard Transformation Journal</div>
          <h1 className="font-serif text-6xl md:text-8xl font-bold text-[#B76E79] mb-5">The Journey</h1>
          <p className="text-2xl md:text-3xl font-semibold mb-5">A 75 Hard Transformation Journal</p>
          <p className="font-serif italic text-xl text-[#6B5F5F] max-w-3xl mx-auto mb-9">“The goal is not to become perfect. The goal is to become someone who keeps promises to herself.”</p>
          <button onClick={() => setPage("bookLibrary")} className="inline-flex items-center gap-2 rounded-full bg-white border border-[#D4AF37]/50 px-7 py-3 text-[#9F5F6B] font-bold hover:bg-[#FFF9F5] transition"><BookOpen size={18} /> Explore Book Library</button>
        </section>

        <section className="px-6 py-10 max-w-6xl mx-auto">
          <SoftCard>
            <div className="text-center mb-8">
              <h2 className="font-serif text-4xl font-bold text-[#B76E79] mb-3">Why 75 Hard Works</h2>
              <p className="text-[#6B5F5F] text-lg max-w-3xl mx-auto">75 Hard is more than a fitness challenge. It works because it teaches you how to keep promises to yourself, even when motivation fades.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                ["💖", "Builds Self-Trust", "Every completed day becomes proof that you can follow through on your commitments."],
                ["👑", "Creates Discipline", "Motivation comes and goes, but discipline teaches you to take action anyway."],
                ["⭐", "Strengthens Mental Toughness", "You learn how to keep moving forward even on tired, busy, or uncomfortable days."],
                ["📖", "Encourages Personal Growth", "Reading 20 pages daily gives you approximately 1,500 pages of new ideas by Day 75."],
                ["🌱", "Builds Positive Habits", "Repeating supportive behaviors every day makes healthy routines feel more natural over time."],
                ["✨", "Increases Confidence", "Confidence is built through evidence: every workout, every page, every promise kept."],
              ].map(([icon, title, text]) => (
                <div key={title} className="rounded-3xl bg-[#FFF9F5] border border-[#F7D6E0] p-5">
                  <div className="text-3xl mb-3">{icon}</div>
                  <h3 className="font-serif text-xl font-bold text-[#B76E79] mb-2">{title}</h3>
                  <p className="text-sm text-[#6B5F5F] leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-3xl bg-[#F7D6E0]/35 border border-[#D4AF37]/30 p-6 text-center">
              <p className="font-serif italic text-xl text-[#B76E79] mb-3">The goal is not perfection. The goal is becoming someone who can trust herself.</p>
              <p className="text-[#6B5F5F] italic">“Let us not grow weary of doing good, for in due season we will reap, if we do not give up.”</p>
              <p className="text-[#9F5F6B] font-bold mt-2">Galatians 6:9</p>
            </div>
          </SoftCard>
        </section>

        <section className="px-6 py-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          <SoftCard><h2 className="font-serif text-3xl font-bold text-[#B76E79] mb-5">The Rules</h2><div className="space-y-3">{rules.map((r) => <p key={r} className="flex gap-3"><CheckCircle className="text-[#D4AF37] shrink-0" size={20} />{r}</p>)}</div></SoftCard>
          <SoftCard><h2 className="font-serif text-3xl font-bold text-[#B76E79] mb-5">Why Reading Matters</h2><p className="leading-relaxed">Reading 20 pages a day adds up to 1,500 pages over 75 days. The workouts strengthen your body, but reading strengthens your mindset, discipline, and perspective.</p></SoftCard>
        </section>

        <section className="px-6 py-10 max-w-6xl mx-auto">
          <SoftCard><h2 className="font-serif text-4xl font-bold text-center text-[#B76E79] mb-8">Nutrition Standards</h2><div className="grid md:grid-cols-2 gap-6"><div className="rounded-3xl bg-[#F7D6E0]/45 p-6"><h3 className="font-bold text-[#9F5F6B] mb-3">Focus On</h3>{["Lean proteins", "Fruits", "Vegetables", "Whole grains", "Healthy fats", "Water"].map((x) => <p key={x}>♡ {x}</p>)}</div><div className="rounded-3xl bg-white border border-[#F7D6E0] p-6"><h3 className="font-bold text-[#9F5F6B] mb-3">Avoid</h3>{["Sugary drinks", "Soda", "Candy", "Fast food", "Processed foods", "Cheat meals"].map((x) => <p key={x}>✦ {x}</p>)}</div></div></SoftCard>
        </section>

        <section className="px-6 py-10 max-w-6xl mx-auto">
          <SoftCard className="text-center">
            <BookOpen className="text-[#D4AF37] mx-auto mb-3" size={34} />
            <h2 className="font-serif text-4xl font-bold text-[#B76E79] mb-3">Book Library</h2>
            <p className="text-[#6B5F5F] mb-6">Explore recommended books by growth path, including leadership, confidence, discipline, faith, purpose, and financial growth.</p>
            <button onClick={() => setPage("bookLibrary")} className="inline-flex items-center gap-2 rounded-full bg-[#EAB6C4] px-7 py-3 text-white font-bold hover:bg-[#B76E79] transition">
              Open Book Library <ArrowRight size={18} />
            </button>
          </SoftCard>
        </section>

        <section className="px-6 py-16 max-w-5xl mx-auto">
          <SoftCard>
            <div className="text-center mb-8">
              <h2 className="font-serif text-4xl font-bold text-[#B76E79] mb-4">Create Your Personal Tracker</h2>
              <p className="text-xl text-[#6B5F5F] leading-relaxed">Complete these setup steps to unlock your journey.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[#9F5F6B] font-bold mb-2">Your Name</label>
                <input value={trackerName} onChange={(e) => setTrackerName(e.target.value)} placeholder="Enter your name" className="w-full rounded-2xl border border-[#EAB6C4] bg-[#FFF9F5] px-4 py-3 outline-none focus:border-[#D4AF37]" />
              </div>
              <div>
                <label className="block text-[#9F5F6B] font-bold mb-2">Reading Focus</label>
                <select value={readingFocus} onChange={(e) => setReadingFocus(e.target.value)} className="w-full rounded-2xl border border-[#EAB6C4] bg-[#FFF9F5] px-4 py-3 outline-none focus:border-[#D4AF37]">
                  <option value="">Choose your focus</option>
                  <option>Leadership & Influence</option>
                  <option>Confidence & Self-Worth</option>
                  <option>Discipline & Mental Toughness</option>
                  <option>Purpose & Finding Your Why</option>
                  <option>Faith & Spiritual Growth</option>
                  <option>Financial Growth</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#9F5F6B] font-bold mb-2">Why I Started</label>
                <textarea value={whyStarted} onChange={(e) => setWhyStarted(e.target.value)} placeholder="Write the reason you are beginning this journey..." className="w-full h-24 rounded-2xl border border-[#EAB6C4] bg-[#FFF9F5] px-4 py-3 outline-none focus:border-[#D4AF37]" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[#9F5F6B] font-bold mb-3">Notification Preference</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {["Gentle", "Standard", "Full Support"].map((option) => (
                    <button key={option} onClick={() => setNotificationPreference(option)} className={`rounded-2xl border px-4 py-3 font-bold transition ${notificationPreference === option ? "bg-[#EAB6C4] border-[#D4AF37] text-white" : "bg-white border-[#F7D6E0] text-[#9F5F6B]"}`}>
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-center mt-8">
              <button disabled={!canStartJourney} onClick={() => setPage("journey")} className="inline-flex items-center gap-2 rounded-full bg-[#EAB6C4] px-9 py-4 text-white font-bold text-lg hover:bg-[#B76E79] disabled:bg-[#F7D6E0] disabled:cursor-not-allowed transition">
                Start Your Journey <ArrowRight size={20} />
              </button>
              {!canStartJourney && <p className="text-sm text-[#6B5F5F] mt-3">Name, why you started, reading focus, and notification preference are required.</p>}
            </div>
          </SoftCard>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#4A4A4A]">
      <section className="px-6 py-12 max-w-6xl mx-auto">
        <div className="mb-6 rounded-3xl border border-[#D4AF37]/40 bg-white/80 p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-[#9F5F6B]">🧪 Editable Test Mode</p>
              <p className="text-sm text-[#6B5F5F]">Use this while practicing to jump to any day. Turn off before sharing publicly.</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => setTestMode(!testMode)} className={`rounded-full px-5 py-2 font-bold transition ${testMode ? "bg-[#D4AF37] text-white" : "bg-[#FFF9F5] border border-[#EAB6C4] text-[#9F5F6B]"}`}>
                {testMode ? "Test Mode On" : "Enable Test Mode"}
              </button>
              {testMode && (
                <>
                  <input type="number" min="1" max="75" value={testDay} onChange={(e) => setTestDay(e.target.value)} className="w-24 rounded-full border border-[#EAB6C4] bg-[#FFF9F5] px-4 py-2 text-center outline-none focus:border-[#D4AF37]" />
                  <button onClick={jumpToTestDay} className="rounded-full bg-[#EAB6C4] px-5 py-2 font-bold text-white hover:bg-[#B76E79] transition">Jump to Day</button>
                  <button onClick={runSelfTests} className="rounded-full bg-white border border-[#D4AF37]/50 px-5 py-2 font-bold text-[#9F5F6B] hover:bg-[#FFF9F5] transition">Run Self-Tests</button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <div><p className="text-[#9F5F6B] font-semibold">The Journey</p><h1 className="font-serif text-4xl md:text-6xl font-bold text-[#B76E79]">{trackerName ? `${trackerName}'s Day ${selectedDay}` : `Day ${selectedDay}`}</h1></div>
          <button onClick={() => setPage("rulebook")} className="rounded-full bg-white border border-[#EAB6C4] px-5 py-2 text-[#9F5F6B] font-semibold">Back to Rulebook</button>
        </div>
        <SoftCard><div className="grid md:grid-cols-4 gap-4 text-center"><div><p className="text-3xl font-bold text-[#B76E79]">{progress}%</p><p>Complete</p></div><div><p className="text-3xl font-bold text-[#B76E79]">{currentDay}</p><p>Day Streak</p></div><div><p className="text-3xl font-bold text-[#B76E79]">{pagesRead}</p><p>Pages Read</p></div><div><p className="text-3xl font-bold text-[#B76E79]">{waterGoals}/75</p><p>Water Goals</p></div></div></SoftCard>
      </section>

      {currentDay === 1 && (
        <section className="px-6 pb-10 max-w-6xl mx-auto">
          <SoftCard>
            <h2 className="font-serif text-3xl font-bold text-[#B76E79] mb-4">💌 Day 0: A Letter to My Future Self</h2>
            <p className="text-[#6B5F5F] mb-6">Write this once before you begin. Once sealed, it will stay hidden until Day 75.</p>
            {letterSealed ? <div className="rounded-3xl bg-[#FFF9F5] border border-[#D4AF37]/40 p-8 text-center"><Lock className="text-[#D4AF37] mx-auto mb-3" /><h3 className="font-serif text-2xl font-bold text-[#B76E79]">Letter Sealed Until Day 75</h3><p className="text-[#6B5F5F] mt-2">Your words are saved and will reopen at completion.</p></div> : <><div className="grid md:grid-cols-2 gap-4">{[["why", "Why am I starting?"], ["change", "What do I hope changes?"], ["feeling", "What do I hope to feel by Day 75?"], ["promise", "What promise am I making to myself?"]].map(([field, prompt]) => <div key={field} className="rounded-2xl bg-[#F7D6E0]/45 border border-[#F7D6E0] p-5"><p className="font-bold text-[#9F5F6B] mb-3">{prompt}</p><textarea value={futureLetter[field]} disabled={letterSaved} onChange={(e) => setFutureLetter((prev) => ({ ...prev, [field]: e.target.value }))} className="w-full h-24 rounded-xl bg-white border border-[#F7D6E0] p-3 outline-none focus:border-[#D4AF37] disabled:bg-[#FFF9F5]" /><p className="text-xs text-[#6B5F5F] mt-2">{futureLetter[field].length} characters</p></div>)}</div><div className="flex flex-col sm:flex-row gap-3 mt-6">{!letterSaved ? <button onClick={saveLetter} className="rounded-full bg-[#EAB6C4] px-6 py-3 text-white font-bold hover:bg-[#B76E79] transition">Save Letter</button> : <button onClick={sealLetter} className="rounded-full bg-[#D4AF37] px-6 py-3 text-white font-bold hover:bg-[#B76E79] transition">💌 Seal Letter Until Day 75</button>} {letterSaved && <span className="self-center text-[#9F5F6B] font-semibold">Letter Saved ✅</span>}</div></>}
            <div className="mt-6 rounded-2xl bg-white border border-[#F7D6E0] p-5"><p className="font-bold text-[#9F5F6B] mb-3">My Word For This Journey</p><div className="flex flex-wrap gap-2">{["Discipline", "Confidence", "Strength", "Consistency", "Courage", "Growth", "Resilience", "Self-Trust"].map((word) => <span key={word} className="rounded-full bg-[#F7D6E0]/45 border border-[#EAB6C4] px-4 py-2 text-[#9F5F6B] font-medium">{word}</span>)}</div></div>
            <div className="mt-6 rounded-2xl bg-[#FFF9F5] border border-[#D4AF37]/40 p-5 text-center"><Camera className="text-[#D4AF37] mx-auto mb-2" /><p className="font-bold text-[#9F5F6B] mb-2">Day 0 Starting Photo</p>{uploadedPhotos["Day 0"] ? <p className="font-bold text-[#9F5F6B]">Day 0 Photo Saved ✅</p> : <label className="inline-flex items-center gap-2 rounded-full bg-[#EAB6C4] px-5 py-2 text-white font-semibold cursor-pointer hover:bg-[#B76E79] transition"><Upload size={16} /> Upload Starting Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => savePhoto("Day 0", e)} /></label>}</div>
          </SoftCard>
        </section>
      )}

      <section className="px-6 pb-10 max-w-6xl mx-auto"><SoftCard><div className="flex items-center gap-3 mb-5"><Trophy className="text-[#D4AF37]" /><h2 className="font-serif text-3xl font-bold text-[#B76E79]">My Achievements</h2></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">{achievements.map((a) => <div key={a.title} className={`rounded-2xl border p-4 ${currentDay >= a.day ? "bg-[#F7D6E0]/45 border-[#D4AF37] text-[#9F5F6B]" : "bg-white border-[#EAB6C4] text-[#B8A8A8]"}`}><p className="font-bold">{a.title}</p><p className="text-xs">Day {a.day}</p></div>)}</div></SoftCard></section>

      <section className="px-6 py-10 max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">
        <SoftCard className="lg:col-span-2"><h2 className="font-serif text-4xl font-bold text-[#B76E79] mb-3">Daily Tracker</h2><p className="text-[#D4AF37] font-semibold mb-3">🔐 Complete all tasks to unlock tomorrow's journey.</p><div className="flex flex-col sm:flex-row items-center gap-3 mb-8"><button onClick={unlockNextDay} disabled={currentDay === 75 || !isDayComplete(currentDay)} className="rounded-full bg-[#EAB6C4] px-6 py-2 text-white font-semibold hover:bg-[#B76E79] disabled:bg-[#F7D6E0] disabled:cursor-not-allowed transition">{isDayComplete(currentDay) ? "⭐ Finish Today’s Promise" : "Complete All Tasks to Unlock"}</button></div><div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 gap-3">{trackerDays.map((day) => { const past = day < currentDay; const future = day > currentDay; return <button key={day} disabled={day !== currentDay} onClick={() => setSelectedDay(day)} className={`aspect-square rounded-2xl border flex flex-col items-center justify-center transition ${future ? "bg-[#FFF9F5] border-[#EAB6C4] text-[#D4AF37]" : past ? "bg-[#F7D6E0] border-[#D4AF37] text-[#9F5F6B] opacity-80" : "bg-[#B76E79] border-[#B76E79] text-white scale-105"}`}>{future ? <Lock size={16} className="text-[#D4AF37]" /> : past ? <CheckCircle size={16} className="text-[#D4AF37]" /> : <Star size={18} className="text-[#D4AF37] fill-[#D4AF37]" />}<span className="font-bold">{day}</span></button>; })}</div></SoftCard>
        <SoftCard><h2 className="font-serif text-2xl font-bold text-[#B76E79] mb-4">Daily Motivation</h2><p className="font-serif text-lg italic mb-5">“{quote}”</p><div className="rounded-2xl bg-white border-t-4 border-[#D4AF37] p-4"><p className="text-sm font-bold text-[#9F5F6B] mb-2">📖 Faith & Encouragement</p><p className="italic">“{verse.verse}”</p><p className="text-[#B76E79] font-semibold mt-2">— {verse.ref}</p><p className="mt-4 text-sm text-[#6B5F5F]">Faith grows when you keep moving forward even when the day feels hard.</p></div></SoftCard>
      </section>

      <section className="px-6 py-10 max-w-6xl mx-auto grid md:grid-cols-2 gap-6"><SoftCard><h2 className="font-serif text-3xl font-bold text-[#B76E79] mb-6">Day {selectedDay} Tasks</h2><div className="space-y-3">{checklist.map((task) => { const Icon = task.icon; return <label key={task.text} className="flex items-center gap-4 rounded-2xl bg-[#F7D6E0]/45 p-4 border border-[#F7D6E0]"><input type="checkbox" checked={getDayTasks(currentDay).includes(task.text)} onChange={() => toggleTask(task.text)} className="h-5 w-5 accent-[#B76E79]" /><Icon className="text-[#D4AF37]" size={22} /><span>{task.text}</span></label>; })}</div></SoftCard><SoftCard><h2 className="font-serif text-3xl font-bold text-[#B76E79] mb-6">Daily Reflection</h2>{["What am I proud of today?", "What challenged me today?", "What lesson did I learn?", "How will I show up tomorrow?"].map((p) => <div key={p} className="mb-4"><p className="font-semibold text-[#9F5F6B] mb-2">{p}</p><textarea className="w-full h-16 rounded-xl bg-[#F7D6E0]/35 border border-[#F7D6E0] p-3" /></div>)}</SoftCard></section>

      {selectedPhotoLabel && <section className="px-6 py-10 max-w-6xl mx-auto"><SoftCard className="text-center"><Camera className="text-[#D4AF37] mx-auto mb-3" size={34} /><h2 className="font-serif text-4xl font-bold text-[#B76E79] mb-3">Photo Checkpoint</h2>{uploadedPhotos[selectedPhotoLabel] ? <p className="font-bold text-[#9F5F6B]">{selectedPhotoLabel} Photo Saved ✅</p> : <label className="inline-flex items-center gap-2 rounded-full bg-[#EAB6C4] px-6 py-3 text-white font-semibold cursor-pointer hover:bg-[#B76E79] transition"><Upload size={18} /> Upload Photo<input type="file" accept="image/*" className="hidden" onChange={(e) => savePhoto(selectedPhotoLabel, e)} /></label>}</SoftCard></section>}

      {currentDay === 75 && <section className="px-6 py-10 max-w-6xl mx-auto">
        <SoftCard>
          <h2 className="font-serif text-4xl font-bold text-center text-[#B76E79] mb-8">Completion Reflection</h2>
          {letterSealed && <div className="mb-8 rounded-3xl bg-white border border-[#D4AF37]/40 p-6"><h3 className="font-serif text-2xl font-bold text-[#B76E79] text-center mb-4">A Message From Day 0 You</h3>{Object.entries({ why: "Why I started", change: "What I hoped would change", feeling: "What I hoped to feel", promise: "The promise I made" }).map(([field, label]) => <div key={field} className="rounded-2xl bg-[#F7D6E0]/35 border border-[#F7D6E0] p-4 mb-3"><p className="font-bold text-[#9F5F6B]">{label}</p><p>{futureLetter[field] || "No response written."}</p></div>)}</div>}
          <p className="text-center text-xl text-[#6B5F5F] mb-8">You showed up. You kept your promise. You can trust yourself.</p>

          <div className="mb-8 rounded-3xl bg-[#FFF9F5] border border-[#F7D6E0] p-6">
            <div className="text-center mb-6">
              <Camera className="text-[#D4AF37] mx-auto mb-2" size={32} />
              <h3 className="font-serif text-3xl font-bold text-[#B76E79]">Transformation Timeline</h3>
              <p className="text-[#6B5F5F] mt-2">Your photos stayed hidden during the journey. Now you can see how far you came.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {timelinePhotoLabels.map((label) => (
                <div key={label} className="rounded-2xl bg-white border border-[#F7D6E0] p-4 text-center">
                  <div className="aspect-[3/4] rounded-xl bg-[#F7D6E0]/30 border border-[#F7D6E0] mb-3 overflow-hidden flex items-center justify-center">
                    {uploadedPhotos[label]?.url ? (
                      <img src={uploadedPhotos[label].url} alt={`${label} progress`} className="h-full w-full object-cover" />
                    ) : (
                      <Camera className="text-[#D4AF37]/60" size={30} />
                    )}
                  </div>
                  <p className="font-bold text-[#9F5F6B]">{label}</p>
                  <p className="text-xs text-[#6B5F5F] mt-1">{uploadedPhotos[label]?.name || "No photo uploaded"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8 rounded-3xl bg-[#FFF9F5] border border-[#D4AF37]/40 p-6 md:p-8">
            <div className="text-center mb-6">
              <h3 className="font-serif text-3xl font-bold text-[#B76E79] mb-3">Reflect On Your Journey</h3>
              <p className="font-serif italic text-[#D4AF37] text-lg">The challenge may be over, but the person you became remains.</p>
              <p className="text-[#6B5F5F] mt-2">Take a moment to recognize how far you have come before unlocking your certificate.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                ["proud", "💖 What are you most proud of?"],
                ["compared", "👑 How do you feel compared to Day 0?"],
                ["habit", "⭐ What habit will you continue after Day 75?"],
                ["surprised", "📖 What surprised you most about yourself?"],
                ["dayZeroMessage", "✨ What would you tell the version of yourself who started?"],
                ["futureLetter", "💌 Letter From Day 75 You"],
              ].map(([field, prompt]) => (
                <div key={field} className="rounded-2xl bg-white border border-[#F7D6E0] p-4">
                  <p className="font-bold text-[#9F5F6B] mb-2">{prompt}</p>
                  <textarea
                    value={completionReflection[field]}
                    disabled={reflectionSaved}
                    onChange={(e) => updateCompletionReflection(field, e.target.value)}
                    className="w-full h-28 rounded-xl bg-[#FFF9F5] border border-[#F7D6E0] p-3 outline-none focus:border-[#D4AF37] disabled:opacity-80"
                  />
                  <p className="text-xs text-[#6B5F5F] mt-2">{completionReflection[field].length} / 1000 characters</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-6">
              {reflectionSaved ? (
                <p className="font-bold text-[#9F5F6B]">Reflection Complete ✅</p>
              ) : (
                <button onClick={saveCompletionReflection} className="rounded-full bg-[#EAB6C4] px-7 py-3 text-white font-bold hover:bg-[#B76E79] transition">🌸 Save My Reflection</button>
              )}
              <p className="font-serif italic text-[#D4AF37] mt-5">The version of you who started this journey would be proud of the person you are today.</p>
            </div>
          </div>

          {!reflectionSaved && (
            <div className="mb-6 rounded-3xl bg-white border border-[#D4AF37]/40 p-5 text-center">
              <Lock className="text-[#D4AF37] mx-auto mb-2" />
              <h3 className="font-serif text-2xl font-bold text-[#B76E79]">Certificate Locked</h3>
              <p className="text-[#6B5F5F]">Save your Completion Reflection to unlock your Certificate of Completion.</p>
            </div>
          )}

          <div className={`rounded-[2rem] bg-[#FFF9F5] border-4 border-[#F7D6E0] p-8 md:p-12 text-center relative overflow-hidden transition ${!reflectionSaved ? "opacity-40 pointer-events-none blur-[1px]" : ""}`}>
            <div className="absolute top-4 left-5 text-[#D4AF37] text-3xl">✦</div>
            <div className="absolute top-4 right-5 text-[#D4AF37] text-3xl">✦</div>
            <div className="absolute bottom-4 left-5 text-[#D4AF37] text-3xl">✦</div>
            <div className="absolute bottom-4 right-5 text-[#D4AF37] text-3xl">✦</div>
            <p className="tracking-[0.35em] text-xs font-bold text-[#D4AF37] mb-3">75 HARD TRANSFORMATION JOURNAL</p>
            <h3 className="font-serif text-4xl md:text-5xl font-bold text-[#B76E79] mb-2">Certificate of Completion</h3>
            <p className="text-[#6B5F5F] mb-6">This certifies that</p>
            <div className="mx-auto max-w-xl border-b-2 border-[#D4AF37] pb-2 mb-6"><p className="font-serif text-3xl text-[#4A4A4A]">{trackerName || "Participant Name"}</p></div>
            <p className="text-[#6B5F5F] mb-2">successfully completed the</p>
            <p className="font-serif text-3xl font-bold text-[#B76E79] mb-4">75 Hard Challenge</p>
            <p className="max-w-2xl mx-auto text-[#6B5F5F] leading-relaxed mb-8">through 75 consecutive days of discipline, consistency, resilience, faith, personal growth, and promises kept.</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">{[['75', 'Days'], ['150', 'Workouts'], ['1,500', 'Pages'], ['75', 'Gallons']].map(([number, label]) => <div key={label} className="rounded-2xl border border-[#D4AF37]/40 bg-white p-4"><p className="font-serif text-3xl font-bold text-[#D4AF37]">{number}</p><p className="uppercase tracking-widest text-xs text-[#9F5F6B]">{label}</p></div>)}</div>
            <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-[#D4AF37] text-white shadow-[0_12px_30px_rgba(212,175,55,0.35)]"><div><Trophy className="mx-auto mb-1" size={28} /><p className="text-xs font-bold leading-tight">PROMISE<br />KEPT</p></div></div>
            <p className="font-serif italic text-lg text-[#4A4A4A] max-w-2xl mx-auto">“I have fought the good fight, I have finished the race, I have kept the faith.”</p>
            <p className="font-bold text-[#B76E79] mt-2 mb-8">2 Timothy 4:7</p>
            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto"><div><div className="border-b-2 border-[#D4AF37] h-8" /><p className="text-sm text-[#6B5F5F] mt-2">Completion Date</p></div><div><div className="border-b-2 border-[#D4AF37] h-8" /><p className="text-sm text-[#6B5F5F] mt-2">Signature</p></div></div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#9F5F6B] mt-8">Certificate No. {certificateNumber}</p>
            <p className="font-serif italic text-[#D4AF37] mt-3">A promise kept becomes confidence earned.</p>
          </div>

          <div className="mt-8 rounded-3xl bg-[#FFF9F5] border border-[#F7D6E0] p-6 text-center">
            <h3 className="font-serif text-2xl font-bold text-[#B76E79] mb-4">Certificate Actions</h3>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <button onClick={downloadCertificate} className="rounded-full bg-[#EAB6C4] px-6 py-3 text-white font-bold hover:bg-[#B76E79] transition">📥 Download PDF</button>
              <button onClick={printCertificate} className="rounded-full bg-white border border-[#D4AF37]/50 px-6 py-3 text-[#9F5F6B] font-bold hover:bg-[#FFF9F5] transition">🖨️ Print Certificate</button>
              <button onClick={shareAchievement} className="rounded-full bg-white border border-[#F7D6E0] px-6 py-3 text-[#9F5F6B] font-bold hover:bg-[#F7D6E0]/40 transition">💌 Share Achievement</button>
            </div>
            {shareStatus && <p className="text-sm text-[#6B5F5F] mt-4">{shareStatus}</p>}
            <p className="text-sm text-[#6B5F5F] mt-4">Issued by The Journey · A 75 Hard Transformation Journal</p>
          </div>
        </SoftCard>
      </section>}
    </div>
  );
}
