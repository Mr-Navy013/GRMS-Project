import { jsPDF } from "jspdf";

/**
 * Generate and download a PDF report for a resolved grievance.
 */
export const downloadResolutionPDF = (grievance) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(2, 132, 199); // Sky Blue (#0284c7)
  doc.rect(0, 0, 210, 35, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("GRIEVANCE RESOLUTION REPORT", 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

  // University / System Badge
  doc.setTextColor(15, 23, 42); // Slate 900
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(`Institution: ${grievance.university || "OUTR University"}`, 14, 48);
  doc.text(`Grievance ID: ${grievance.id}`, 140, 48);

  doc.setLineWidth(0.5);
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 52, 196, 52);

  // Section 1: Grievant & Issue Overview
  let y = 62;

  doc.setFillColor(240, 249, 255); // Sky Blue 50
  doc.rect(14, y, 182, 38, "F");
  doc.setDrawColor(186, 230, 253);
  doc.rect(14, y, 182, 38, "S");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(3, 105, 161);
  doc.text("Grievance Overview", 20, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Submitted By: ${grievance.raisedBy || grievance.userName || "User"} (${grievance.role || "User"})`, 20, y + 18);
  doc.text(`Email: ${grievance.email || "N/A"}`, 20, y + 25);
  doc.text(`Category: ${grievance.category}`, 20, y + 32);

  doc.text(`Submission Date: ${grievance.date || "N/A"}`, 120, y + 18);
  doc.text(`Status: ${grievance.status}`, 120, y + 25);
  if (grievance.assignedOfficer) {
    doc.text(`Assigned Officer: ${grievance.assignedOfficer}`, 120, y + 32);
  }

  // Section 2: Subject & Description
  y += 48;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Subject & Description", 14, y);

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Title: ${grievance.title || grievance.subject}`, 14, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);

  const descLines = doc.splitTextToSize(grievance.description || "No description provided.", 180);
  doc.text(descLines, 14, y + 16);

  y += 20 + descLines.length * 5;

  // Section 3: Resolution Details
  doc.setFillColor(240, 253, 244); // Green 50
  doc.rect(14, y, 182, 35, "F");
  doc.setDrawColor(187, 247, 208);
  doc.rect(14, y, 182, 35, "S");

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 128, 61); // Green 700
  doc.text("Resolution & Action Taken", 20, y + 10);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);

  const resolutionMsg = grievance.resolutionNotes || "This grievance has been investigated and resolved by the designated officer in accordance with university redressal guidelines.";
  const resLines = doc.splitTextToSize(resolutionMsg, 170);
  doc.text(resLines, 20, y + 18);

  // Footer / Sign-off
  y += 45;
  doc.setDrawColor(226, 232, 240);
  doc.line(14, y, 196, y);

  doc.setFontSize(9);
  doc.setTextColor(148, 163, 184);
  doc.text("Official Grievance Redressal System Document • Auto-generated PDF Report", 14, y + 8);
  doc.text("Signed & Approved by Grievance Redressal Committee", 120, y + 8);

  doc.save(`Grievance_Resolution_Report_${grievance.id}.pdf`);
};

/**
 * Generate and download Admin Report Analysis PDF.
 */
export const downloadAdminAnalysisPDF = (universityName, stats, grievances) => {
  const doc = new jsPDF();

  // Header Banner
  doc.setFillColor(2, 132, 199); // Sky Blue
  doc.rect(0, 0, 210, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(`${universityName.toUpperCase()} - GRIEVANCE ANALYSIS REPORT`, 14, 22);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Generated On: ${new Date().toLocaleString()}`, 14, 32);

  // Statistics Cards Summary
  let y = 50;

  // Box 1: Total
  doc.setFillColor(240, 249, 255);
  doc.rect(14, y, 40, 24, "F");
  doc.setDrawColor(186, 230, 253);
  doc.rect(14, y, 40, 24, "S");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Total", 18, y + 7);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(3, 105, 161);
  doc.text(String(stats.total), 18, y + 17);

  // Box 2: Pending
  doc.setFillColor(254, 242, 242);
  doc.rect(60, y, 40, 24, "F");
  doc.setDrawColor(254, 202, 202);
  doc.rect(60, y, 40, 24, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Pending", 64, y + 7);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(185, 28, 28);
  doc.text(String(stats.pending), 64, y + 17);

  // Box 3: In Progress
  doc.setFillColor(254, 249, 195);
  doc.rect(106, y, 40, 24, "F");
  doc.setDrawColor(253, 224, 71);
  doc.rect(106, y, 40, 24, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("In Progress", 110, y + 7);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(161, 98, 7);
  doc.text(String(stats.inProgress), 110, y + 17);

  // Box 4: Resolved
  doc.setFillColor(240, 253, 244);
  doc.rect(152, y, 44, 24, "F");
  doc.setDrawColor(187, 247, 208);
  doc.rect(152, y, 44, 24, "S");
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("Resolved", 156, y + 7);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(21, 128, 61);
  doc.text(String(stats.resolved), 156, y + 17);

  // Grievance Breakdown Table
  y += 36;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Grievance Records Log", 14, y);

  y += 6;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 182, 8, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(51, 65, 85);
  doc.text("ID", 16, y + 5);
  doc.text("User / Role", 40, y + 5);
  doc.text("Category", 85, y + 5);
  doc.text("Subject", 125, y + 5);
  doc.text("Status", 170, y + 5);

  y += 10;
  doc.setFont("helvetica", "normal");

  grievances.forEach((g) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setTextColor(30, 41, 59);
    doc.text(String(g.id), 16, y);

    const userText = `${(g.raisedBy || g.userName || "User").substring(0, 15)} (${(g.role || "Student").substring(0, 8)})`;
    doc.text(userText, 40, y);

    doc.text(String(g.category).substring(0, 18), 85, y);

    const subjectText = (g.subject || g.title || "").substring(0, 24);
    doc.text(subjectText, 125, y);

    if (g.status === "Resolved") doc.setTextColor(21, 128, 61);
    else if (g.status === "Pending") doc.setTextColor(185, 28, 28);
    else doc.setTextColor(161, 98, 7);

    doc.text(String(g.status), 170, y);

    y += 7;
    doc.setDrawColor(241, 245, 249);
    doc.line(14, y - 4, 196, y - 4);
  });

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Confidential Admin Document • Grievance Redressal Monitoring System", 14, 285);

  doc.save(`${universityName.replace(/\s+/g, "_")}_Grievance_Report.pdf`);
};
