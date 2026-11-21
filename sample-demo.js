(function(){
  if (document.getElementById("emtTrySampleBtn")) return;
  const actionsBar = document.querySelector(".actions") || document.querySelector(".panel");
  if (!actionsBar) return;

  const btn = document.createElement("button");
  btn.id = "emtTrySampleBtn";
  btn.type = "button";
  btn.textContent = "⚡ Load 1-Click Sample Demo File";
  btn.style.cssText = "background:#38bdf8;color:#082f49;border:none;padding:0.65rem 1.05rem;border-radius:8px;font-weight:700;cursor:pointer;font-size:0.88rem;margin-right:0.5rem;";

  function injectFileIntoInput(inputEl, fileObj) {
    try {
      const dt = new DataTransfer();
      dt.items.add(fileObj);
      inputEl.files = dt.files;
      inputEl.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    } catch (e) { return false; }
  }

  function makeSamplePngBlob(callback) {
    const c = document.createElement("canvas");
    c.width = 800; c.height = 600;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#f8fafc"; ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "#0f172a"; ctx.font = "bold 28px sans-serif";
    ctx.fillText("EVERGREEN MICRO-TOOLS — SAMPLE DEMO DOCUMENT", 40, 80);
    ctx.fillStyle = "#334155"; ctx.font = "20px monospace";
    ctx.fillText("Account / Receipt Ref : #INV-2026-0894", 40, 150);
    ctx.fillText("Sensitive Account No  : 4532-xxxx-xxxx-8891", 40, 200);
    ctx.fillText("Subtotal              : $145.00", 40, 260);
    ctx.fillText("Tax (6%)              : $8.70", 40, 300);
    ctx.fillText("Total Paid            : $153.70", 40, 340);
    ctx.strokeStyle = "#0ea5e9"; ctx.lineWidth = 4;
    ctx.strokeRect(25, 25, 750, 550);
    c.toBlob(b => callback(b), "image/jpeg", 0.92);
  }

  function makeMinimalPdfBytes() {
    const pdfText = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n4 0 obj<</Length 118>>stream\nBT /F1 18 Tf 50 720 Td (Evergreen Micro-Tools - 1-Click Sample Demo PDF) Tj /F1 12 Tf 0 -30 Td (100% Local Processing - Zero Cloud Uploads.) Tj ET\nendstream\nendobj\n5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\nxref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n0000000207 00000 n \n0000000375 00000 n \ntrailer<</Size 6/Root 1 0 R>>\nstartxref\n442\n%%EOF";
    return new Uint8Array(pdfText.split("").map(ch => ch.charCodeAt(0)));
  }

  btn.addEventListener("click", async () => {
    const path = window.location.pathname.toLowerCase();
    const textareas = document.querySelectorAll("textarea:not(#emtShareText)");
    const fileInput = document.querySelector("input[type='file']");

    if (path.includes("text-diff") && textareas.length >= 2) {
      textareas[0].value = "Contract No: 2026-001\nClient: Acme Corp\nService: Web & Automation Setup\nBase Fee: $5,000.00\nPayment Terms: Net 30\nEffective Date: 2026-11-21";
      textareas[1].value = "Contract No: 2026-001\nClient: Acme Corp\nService: Web & Automation Setup\nBase Fee: $5,000.00\nHidden Monthly Maintenance Fee: $250.00/mo\nPayment Terms: Net 15\nEffective Date: 2026-11-21";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
      textareas[1].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("ats-resume") && textareas.length >= 2) {
      textareas[0].value = "Senior Software Engineer & Full-Stack Developer\n5+ years building Python, JavaScript, React, Node.js, SQL, REST APIs, Docker, and AWS cloud automation. Reduced build latency by 42% and led Agile CI/CD deployments.";
      textareas[1].value = "We are hiring a Senior Software Engineer with strong experience in Python, JavaScript, React, Node.js, SQL, REST APIs, Docker, AWS, Kubernetes, TypeScript, and Agile CI/CD pipelines.";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
      textareas[1].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("email-list") && textareas.length >= 1) {
      textareas[0].value = "john.doe@gmial.com\njane.smith@company.com\nJOHN.DOE@gmail.com\nbob.brown@yaho.com\ninvalid-email@\nalice@outlok.com\ntemp@mailinator.com";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("hipaa-pii") && textareas.length >= 1) {
      textareas[0].value = "Patient: Johnathan R. Miller | DOB: 04/18/1979 | SSN: 412-58-9021 | MRN: MRN-8849201\nPhone: (724) 555-0192 | Email: j.miller79@gmail.com | ABA Routing: 043306855 | API Key: sk-live-9948102948102948";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("csv-global") && textareas.length >= 1) {
      textareas[0].value = "order_id;customer;amount;order_date;delivery_date\n1001;Acme GmbH;1250,50;21/11/2026;28/11/2026\n1002;Berlin Tech;890,00;22/11/2026;29/11/2026";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("csv-cleaner") && textareas.length >= 1) {
      textareas[0].value = "id,name,email,status\n1,John Doe,john.doe@example.com,Active\n2,Jane Smith,jane.smith@example.com,Active\n\n1,JOHN DOE,john.doe@example.com,Active\n3,  Bob Brown  ,bob.brown@example.com,Pending";
      textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
    } else if (path.includes("bank-csv") && (textareas.length >= 1 || fileInput)) {
      const csvData = "Date,Description,Amount\n2026-11-01,Client Retainer Deposit,2500.00\n2026-11-03,AWS Cloud Hosting,-64.50\n2026-11-05,Office Depot Supplies,-42.19\n2026-11-08,Verizon Business Internet,-89.99\n2026-11-12,Delta Airlines Travel,-310.00";
      if (textareas.length >= 1) {
        textareas[0].value = csvData;
        textareas[0].dispatchEvent(new Event("input", { bubbles: true }));
      }
      if (fileInput) {
        injectFileIntoInput(fileInput, new File([csvData], "sample_bank_statement.csv", { type: "text/csv" }));
      }
    } else if (fileInput) {
      const accept = (fileInput.getAttribute("accept") || "").toLowerCase();
      if (accept.includes("pdf") || path.includes("pdf")) {
        let pdfBytes = makeMinimalPdfBytes();
        if (window.PDFLib && window.PDFLib.PDFDocument) {
          try {
            const doc = await window.PDFLib.PDFDocument.create();
            const p1 = doc.addPage([612, 792]);
            p1.drawText("Evergreen Micro-Tools — 1-Click Sample Demo PDF (Page 1)", { x: 50, y: 720, size: 16 });
            p1.drawText("100% Local Processing inside your browser. Zero cloud uploads.", { x: 50, y: 685, size: 12 });
            const p2 = doc.addPage([612, 792]);
            p2.drawText("Evergreen Micro-Tools — Sample Demo PDF (Page 2)", { x: 50, y: 720, size: 16 });
            pdfBytes = await doc.save();
          } catch (e) {}
        }
        injectFileIntoInput(fileInput, new File([pdfBytes], "sample_demo_document.pdf", { type: "application/pdf" }));
      } else if (accept.includes("csv") || path.includes("csv")) {
        const csv = "id,name,email,amount\n1,John Doe,john@example.com,120.00\n2,Jane Smith,jane@example.com,240.00\n1,John Doe,john@example.com,120.00";
        injectFileIntoInput(fileInput, new File([csv], "sample_demo.csv", { type: "text/csv" }));
      } else {
        makeSamplePngBlob(blob => {
          if (blob) injectFileIntoInput(fileInput, new File([blob], "sample_demo_photo.jpg", { type: "image/jpeg" }));
        });
      }
    }

    btn.textContent = "✓ Sample Loaded! Click Action Button →";
    btn.style.background = "#22c55e";
    btn.style.color = "#052e16";
    setTimeout(() => {
      btn.textContent = "⚡ Load 1-Click Sample Demo File";
      btn.style.background = "#38bdf8";
      btn.style.color = "#082f49";
    }, 3500);
  });

  actionsBar.insertBefore(btn, actionsBar.firstChild);
})();
