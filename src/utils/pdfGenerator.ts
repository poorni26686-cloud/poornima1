 /**
  * PDF Generator Utility
  * 
  * Generates well-formatted travel plan PDFs from AI chat responses.
  * Uses jsPDF for PDF creation with custom styling.
  * 
  * @author Tourist Guiding System
  * @version 1.0.0
  */
 
 import jsPDF from "jspdf";
 
 interface PdfOptions {
   title?: string;
   destination?: string;
   date?: string;
 }
 
 /**
  * Parse markdown-style content into structured sections
  */
 const parseContent = (content: string): { title: string; body: string }[] => {
   const sections: { title: string; body: string }[] = [];
   const lines = content.split("\n");
   let currentSection = { title: "", body: "" };
 
   for (const line of lines) {
     // Check for headers (### or ##)
     if (line.startsWith("### ") || line.startsWith("## ")) {
       if (currentSection.title || currentSection.body) {
         sections.push({ ...currentSection });
       }
       currentSection = {
         title: line.replace(/^#{2,3}\s*/, "").trim(),
         body: "",
       };
     } else if (line.startsWith("# ")) {
       // Main title - treat as section
       if (currentSection.title || currentSection.body) {
         sections.push({ ...currentSection });
       }
       currentSection = {
         title: line.replace(/^#\s*/, "").trim(),
         body: "",
       };
     } else {
       currentSection.body += line + "\n";
     }
   }
 
   // Add last section
   if (currentSection.title || currentSection.body) {
     sections.push(currentSection);
   }
 
   return sections;
 };
 
 /**
  * Clean text by removing markdown formatting
  */
 const cleanText = (text: string): string => {
   return text
     .replace(/\*\*(.*?)\*\*/g, "$1") // Remove bold **text**
     .replace(/\*(.*?)\*/g, "$1") // Remove italic *text*
     .replace(/`(.*?)`/g, "$1") // Remove code `text`
     .replace(/^\s*[-*]\s*/gm, "• ") // Convert list markers to bullets
     .replace(/^\s*\d+\.\s*/gm, "") // Clean numbered lists
     .trim();
 };
 
 /**
  * Add wrapped text to PDF with automatic line breaks
  */
 const addWrappedText = (
   doc: jsPDF,
   text: string,
   x: number,
   y: number,
   maxWidth: number,
   lineHeight: number
 ): number => {
   const lines = doc.splitTextToSize(text, maxWidth);
   let currentY = y;
 
   for (const line of lines) {
     if (currentY > 270) {
       doc.addPage();
       currentY = 20;
     }
     doc.text(line, x, currentY);
     currentY += lineHeight;
   }
 
   return currentY;
 };
 
 /**
  * Generate a formatted PDF from travel plan content
  */
 export const generateTravelPDF = (
   content: string,
   options: PdfOptions = {}
 ): void => {
   const doc = new jsPDF();
   const pageWidth = doc.internal.pageSize.getWidth();
   const margin = 20;
   const contentWidth = pageWidth - margin * 2;
   let yPosition = 20;
 
   // Title
   const mainTitle = options.title || "Your Travel Plan";
   doc.setFontSize(24);
   doc.setTextColor(79, 70, 229); // Primary color
   doc.text(mainTitle, pageWidth / 2, yPosition, { align: "center" });
   yPosition += 12;
 
   // Subtitle
   if (options.destination) {
     doc.setFontSize(14);
     doc.setTextColor(107, 114, 128);
     doc.text(options.destination, pageWidth / 2, yPosition, { align: "center" });
     yPosition += 8;
   }
 
   // Date
   const dateStr = options.date || new Date().toLocaleDateString("en-US", {
     year: "numeric",
     month: "long",
     day: "numeric",
   });
   doc.setFontSize(10);
   doc.setTextColor(156, 163, 175);
   doc.text(`Generated on ${dateStr}`, pageWidth / 2, yPosition, { align: "center" });
   yPosition += 5;
 
   // Divider line
   doc.setDrawColor(229, 231, 235);
   doc.setLineWidth(0.5);
   doc.line(margin, yPosition, pageWidth - margin, yPosition);
   yPosition += 10;
 
   // Parse and render content sections
   const sections = parseContent(content);
 
   for (const section of sections) {
     // Check if we need a new page
     if (yPosition > 250) {
       doc.addPage();
       yPosition = 20;
     }
 
     // Section title
     if (section.title) {
       doc.setFontSize(14);
       doc.setTextColor(31, 41, 55);
       doc.setFont("helvetica", "bold");
       yPosition = addWrappedText(doc, section.title, margin, yPosition, contentWidth, 7);
       yPosition += 4;
     }
 
     // Section body
     if (section.body.trim()) {
       doc.setFontSize(10);
       doc.setTextColor(75, 85, 99);
       doc.setFont("helvetica", "normal");
 
       const bodyLines = section.body.split("\n").filter((line) => line.trim());
 
       for (const line of bodyLines) {
         const cleanedLine = cleanText(line);
         if (!cleanedLine) continue;
 
         // Check for sub-headers (lines starting with **)
         const boldMatch = line.match(/^\*\*(.*?)\*\*/);
         if (boldMatch) {
           if (yPosition > 265) {
             doc.addPage();
             yPosition = 20;
           }
           doc.setFont("helvetica", "bold");
           doc.setTextColor(55, 65, 81);
           yPosition = addWrappedText(doc, cleanText(line), margin + 5, yPosition, contentWidth - 10, 5);
           doc.setFont("helvetica", "normal");
           doc.setTextColor(75, 85, 99);
         } else if (cleanedLine.startsWith("•")) {
           // Bullet points
           yPosition = addWrappedText(doc, cleanedLine, margin + 10, yPosition, contentWidth - 15, 5);
         } else {
           yPosition = addWrappedText(doc, cleanedLine, margin, yPosition, contentWidth, 5);
         }
         yPosition += 1;
       }
       yPosition += 6;
     }
   }
 
   // Footer on last page
   const pageCount = doc.getNumberOfPages();
   for (let i = 1; i <= pageCount; i++) {
     doc.setPage(i);
     doc.setFontSize(8);
     doc.setTextColor(156, 163, 175);
     doc.text(
       `Page ${i} of ${pageCount} | Generated by Wanderlust Travel Assistant`,
       pageWidth / 2,
       285,
       { align: "center" }
     );
   }
 
   // Download the PDF
   const fileName = `travel-plan-${Date.now()}.pdf`;
   doc.save(fileName);
 };
 
 /**
  * Extract destination name from conversation
  */
 export const extractDestination = (messages: { role: string; content: string }[]): string => {
   // Look for destination mentions in user messages
   const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
   
   // Common patterns for destinations
   const patterns = [
     /(?:trip to|visit(?:ing)?|travel(?:ing)? to|going to|plan(?:ning)? (?:a )?(?:trip )?(?:to )?)\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
     /(?:in|at|for)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/i,
   ];
 
   for (const msg of userMessages) {
     for (const pattern of patterns) {
       const match = msg.match(pattern);
       if (match && match[1]) {
         return match[1];
       }
     }
   }
 
   return "";
 };