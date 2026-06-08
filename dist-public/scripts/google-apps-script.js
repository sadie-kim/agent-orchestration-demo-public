/**
 * ═══════════════════════════════════════════════════════════════
 *  Agent Orchestration — Google Apps Script Bridge
 *  For use with the Stage 4 AI Agent Orchestrations live demo
 * ═══════════════════════════════════════════════════════════════
 *
 *  SETUP INSTRUCTIONS:
 *  1. Go to https://script.google.com and create a new project
 *  2. Paste this entire file into Code.gs
 *  3. Click Deploy → New Deployment → Web App
 *     - Execute as: Me
 *     - Who has access: Anyone (or Anyone with Google account)
 *  4. Copy the deployment URL
 *  5. In the demo HTML, use this URL as the GAS_ENDPOINT
 *
 *  PERMISSIONS NEEDED (granted on first run):
 *  - Gmail: Send emails on your behalf
 *  - Google Docs: Create and edit documents
 *  - Google Calendar: Create events
 *
 *  SECURITY NOTE:
 *  The doPost endpoint validates a shared secret token.
 *  Set your token in Script Properties: TOKEN = <your-secret>
 * ═══════════════════════════════════════════════════════════════
 */

// ── CONFIGURATION ──
function getConfig() {
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('TOKEN');
  if (!token) {
    throw new Error('Missing required Script Property: TOKEN');
  }
  return {
    TOKEN: token,
    CALENDAR_ID: props.getProperty('CALENDAR_ID') || 'primary',
    SENDER_NAME: props.getProperty('SENDER_NAME') || 'Agent Orchestration Demo',
    ALLOWED_EMAIL_RECIPIENTS: parseCsv(props.getProperty('ALLOWED_EMAIL_RECIPIENTS')),
  };
}

function parseCsv(value) {
  return String(value || '')
    .split(',')
    .map(function(item) { return item.trim().toLowerCase(); })
    .filter(Boolean);
}

function isAllowedRecipient(email, config) {
  if (!config.ALLOWED_EMAIL_RECIPIENTS.length) return false;
  return config.ALLOWED_EMAIL_RECIPIENTS.indexOf(String(email || '').trim().toLowerCase()) !== -1;
}

// ── GLOBAL RATE LIMIT ──
// Apps Script gives no caller IP, so this is a coarse global cap per minute.
// It bounds resource abuse (e.g. unlimited Google Doc creation) if the shared
// token ever leaks. Tune RATE_LIMIT_PER_MIN as needed.
var RATE_LIMIT_PER_MIN = 20;
function checkRateLimit() {
  var cache = CacheService.getScriptCache();
  var bucket = 'rl_' + Math.floor(Date.now() / 60000);
  var count = Number(cache.get(bucket) || 0);
  if (count >= RATE_LIMIT_PER_MIN) {
    throw new Error('Rate limit exceeded. Try again shortly.');
  }
  cache.put(bucket, String(count + 1), 120);
}

// ── WEB APP ENTRY POINT ──
function doPost(e) {
  try {
    const config = getConfig();
    const payload = JSON.parse(e.postData.contents);

    // Validate token
    if (payload.token !== config.TOKEN) {
      return jsonResponse({ error: 'Invalid token' });
    }

    // Global throttle so a leaked token can't spam Drive/Gmail without bound.
    checkRateLimit();

    const action = payload.action;
    let result;

    switch (action) {
      case 'create_doc':
        result = createDocument(payload.data);
        break;
      case 'send_email':
        result = sendEmail(payload.data, config);
        break;
      case 'create_event':
        result = createCalendarEvent(payload.data, config);
        break;
      case 'full_orchestration':
        result = runFullOrchestration(payload.data, config);
        break;
      case 'health_check':
        result = { status: 'ok', timestamp: new Date().toISOString() };
        break;
      default:
        return jsonResponse({ error: 'Unknown action: ' + action });
    }

    return jsonResponse({ success: true, result: result });

  } catch (err) {
    // Log full detail server-side, but don't leak internals to the caller.
    Logger.log('Error: ' + err.toString());
    return jsonResponse({ success: false, error: 'Request failed' });
  }
}

// Also support GET for health checks
function doGet(e) {
  return jsonResponse({
    status: 'ok',
    service: 'Agent Orchestration GAS Bridge',
    version: '1.0',
    timestamp: new Date().toISOString(),
    actions: ['create_doc', 'send_email', 'create_event', 'full_orchestration', 'health_check']
  });
}

// ── HELPER: Parse **bold** markers and return {clean, ranges} ──
function parseBoldMarkers(text) {
  var clean = '';
  var ranges = [];
  var i = 0;
  while (i < text.length) {
    if (text.charAt(i) === '*' && i + 1 < text.length && text.charAt(i + 1) === '*') {
      // Found opening **
      var closeIdx = text.indexOf('**', i + 2);
      if (closeIdx !== -1) {
        var boldText = text.substring(i + 2, closeIdx);
        var start = clean.length;
        clean += boldText;
        ranges.push({ start: start, end: start + boldText.length - 1 });
        i = closeIdx + 2;
        continue;
      }
    }
    clean += text.charAt(i);
    i++;
  }
  return { clean: clean, ranges: ranges };
}

// ── HELPER: Add paragraph with bold markers processed ──
function appendRichParagraph(body, content, fontSize, lineSpacing) {
  var parsed = parseBoldMarkers(content);
  var p = body.appendParagraph(parsed.clean);
  p.setFontSize(fontSize || 11);
  p.setBold(false); // Ensure default is NOT bold
  if (lineSpacing) p.setLineSpacing(lineSpacing);
  // Apply bold to specific ranges
  if (parsed.ranges.length > 0) {
    var text = p.editAsText();
    text.setBold(false); // Reset all to non-bold first
    for (var i = 0; i < parsed.ranges.length; i++) {
      text.setBold(parsed.ranges[i].start, parsed.ranges[i].end, true);
    }
  }
  return p;
}

// ── HELPER: Add list item with bold markers processed ──
function appendRichListItem(body, content) {
  var parsed = parseBoldMarkers(content);
  var li = body.appendListItem(parsed.clean);
  li.setGlyphType(DocumentApp.GlyphType.BULLET);
  li.setFontSize(11);
  li.setBold(false); // Ensure default is NOT bold
  // Apply bold to specific ranges
  if (parsed.ranges.length > 0) {
    var text = li.editAsText();
    text.setBold(false); // Reset all to non-bold first
    for (var i = 0; i < parsed.ranges.length; i++) {
      text.setBold(parsed.ranges[i].start, parsed.ranges[i].end, true);
    }
  }
  return li;
}

// ── CREATE GOOGLE DOC ──
function createDocument(data) {
  const { title, content, folderId } = data;

  // Create the document
  const doc = DocumentApp.create(title || 'Untitled Document');
  const body = doc.getBody();

  // Clear default empty paragraph
  body.clear();

  // Set default font
  var style = {};
  style[DocumentApp.Attribute.FONT_FAMILY] = 'Arial';
  body.setAttributes(style);

  // ── BRANDED HEADER (text-based logo + company name) ──
  // Logo block: 1-cell table with dark navy background and amber "MW" initials
  var logoTable = body.appendTable([['MW']]);
  logoTable.setBorderWidth(0);
  logoTable.setBorderColor('#1a1a2e');
  var logoCell = logoTable.getRow(0).getCell(0);
  logoCell.setBackgroundColor('#1a1a2e');
  logoCell.setWidth(48);
  logoCell.setPaddingTop(6);
  logoCell.setPaddingBottom(6);
  logoCell.setPaddingLeft(10);
  logoCell.setPaddingRight(10);
  var logoCellPara = logoCell.getChild(0).asParagraph();
  logoCellPara.setFontSize(16);
  logoCellPara.setBold(true);
  logoCellPara.setForegroundColor('#f59e0b');
  logoCellPara.setFontFamily('Arial');
  logoCellPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  logoCellPara.setSpacingBefore(0);
  logoCellPara.setSpacingAfter(0);

  var headerPara = body.appendParagraph('MERIDIAN WEALTH ADVISORY');
  headerPara.setFontSize(14);
  headerPara.setBold(true);
  headerPara.setForegroundColor('#1a1a2e');
  headerPara.setFontFamily('Arial');
  headerPara.setSpacingBefore(6);
  headerPara.setSpacingAfter(0);

  var subPara = body.appendParagraph('Financial Advisory  ·  Wealth Management');
  subPara.setFontSize(8);
  subPara.setForegroundColor('#70757a');
  subPara.setFontFamily('Arial');
  subPara.setSpacingBefore(0);
  subPara.setSpacingAfter(2);

  var addrPara = body.appendParagraph('Level 12, 88 Pitt Street, Sydney NSW 2000  |  ABN 47 612 903 158');
  addrPara.setFontSize(7);
  addrPara.setForegroundColor('#9aa0a6');
  addrPara.setFontFamily('Arial');
  addrPara.setSpacingBefore(0);
  addrPara.setSpacingAfter(4);

  body.appendHorizontalRule();
  var spacer = body.appendParagraph('');
  spacer.setFontSize(4);
  spacer.setSpacingBefore(0);
  spacer.setSpacingAfter(0);

  // Parse and write content blocks
  if (content && Array.isArray(content)) {
    content.forEach(function(block, index) {
      switch (block.t) {
        case 'h1':
          var h1 = body.appendParagraph(block.v);
          h1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
          h1.setFontSize(22);
          h1.setBold(true);
          h1.setForegroundColor('#1a1a2e');
          h1.setBackgroundColor(null);
          h1.setSpacingAfter(4);
          body.appendHorizontalRule();
          break;

        case 'h2':
          var h2 = body.appendParagraph(block.v);
          h2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
          h2.setFontSize(14);
          h2.setBold(true);
          h2.setForegroundColor('#202124');
          h2.setBackgroundColor(null);
          h2.setSpacingBefore(16);
          break;

        case 'summary':
          // Executive summary as a highlighted paragraph
          var summ = appendRichParagraph(body, block.v, 11, 1.5);
          summ.setBackgroundColor('#fef9ee');
          summ.setForegroundColor('#78590a');
          summ.setSpacingBefore(8);
          summ.setSpacingAfter(12);
          summ.setIndentStart(12);
          summ.setIndentEnd(12);
          // Ensure only bold-marked parts are bold
          var summText = summ.editAsText();
          summText.setFontFamily('Arial');
          break;

        case 'metrics':
          // Render metrics as a formatted table
          if (Array.isArray(block.v) && block.v.length > 0) {
            // Build cell data arrays
            var labels = block.v.map(function(m) { return m.label ? m.label.toUpperCase() : ''; });
            var values = block.v.map(function(m) { return m.val || ''; });
            // Create table with explicit cell data — avoids the empty default row issue
            var table = body.appendTable([labels, values]);
            table.setBorderColor('#e8eaed');
            table.setBorderWidth(1);
            // Style header row (row 0)
            var headerRow = table.getRow(0);
            for (var ci = 0; ci < headerRow.getNumCells(); ci++) {
              var hCell = headerRow.getCell(ci);
              hCell.setBackgroundColor('#f8f9fa');
              var hPara = hCell.getChild(0).asParagraph();
              hPara.setFontSize(8);
              hPara.setBold(true);
              hPara.setForegroundColor('#70757a');
              hPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
            }
            // Style value row (row 1)
            var valueRow = table.getRow(1);
            for (var vi = 0; vi < valueRow.getNumCells(); vi++) {
              var vCell = valueRow.getCell(vi);
              var vPara = vCell.getChild(0).asParagraph();
              vPara.setFontSize(16);
              vPara.setBold(true);
              vPara.setForegroundColor('#202124');
              vPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
            }
          }
          break;

        case 'callout':
          // Callout as an indented colored paragraph
          var prefix = block.style === 'warn' ? '⚠️ ' : block.style === 'ok' ? '✅ ' : '💡 ';
          var bgColor = block.style === 'warn' ? '#fefce8' : block.style === 'ok' ? '#ecfdf5' : '#f0f7ff';
          var fgColor = block.style === 'warn' ? '#78590a' : block.style === 'ok' ? '#065f46' : '#1e3a5f';
          // Clean the text — remove any leftover markdown and type prefixes
          var calloutClean = (block.v || '').replace(/\*\*/g, '');
          var calloutP = body.appendParagraph(prefix + calloutClean);
          calloutP.setFontSize(11);
          calloutP.setBold(false);
          calloutP.setBackgroundColor(bgColor);
          calloutP.setForegroundColor(fgColor);
          calloutP.setLineSpacing(1.5);
          calloutP.setIndentStart(14);
          calloutP.setIndentEnd(14);
          calloutP.setSpacingBefore(8);
          calloutP.setSpacingAfter(8);
          break;

        case 'hr':
          body.appendHorizontalRule();
          break;

        case 'p':
          var pp = appendRichParagraph(body, block.v, 11, 1.5);
          pp.setFontFamily('Arial');
          pp.setBackgroundColor(null);
          pp.setForegroundColor('#202124');
          break;

        case 'ul':
          if (Array.isArray(block.v)) {
            block.v.forEach(function(item) {
              var li = appendRichListItem(body, item);
              li.setBackgroundColor(null);
              li.setForegroundColor('#202124');
            });
          }
          break;
      }
    });
  } else if (typeof content === 'string') {
    // Plain text content — parse markdown
    var lines = content.split('\n');
    lines.forEach(function(line) {
      if (line.startsWith('# ') && !line.startsWith('## ')) {
        var h1 = body.appendParagraph(line.substring(2));
        h1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
        h1.setFontSize(22);
        h1.setBold(true);
      } else if (line.startsWith('## ')) {
        var h2 = body.appendParagraph(line.substring(3));
        h2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
        h2.setFontSize(14);
        h2.setBold(true);
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        appendRichListItem(body, line.substring(2));
      } else if (/^\d+[.)]\s/.test(line)) {
        appendRichListItem(body, line.replace(/^\d+[.)]\s+/, ''));
      } else if (line.startsWith('> ')) {
        var quote = appendRichParagraph(body, line.substring(2), 11, 1.5);
        quote.setBackgroundColor('#f0f7ff');
        quote.setForegroundColor('#1e3a5f');
        quote.setIndentStart(14);
      } else if (/^[-*_]{3,}\s*$/.test(line.trim())) {
        body.appendHorizontalRule();
      } else if (line.trim()) {
        var normalP = appendRichParagraph(body, line, 11, 1.5);
        normalP.setBackgroundColor(null);
        normalP.setForegroundColor('#202124');
      }
    });
  }

  // ── BRANDED FOOTER (explicit background reset to prevent callout color bleed) ──
  body.appendHorizontalRule();
  var footerPara = body.appendParagraph('Meridian Wealth Advisory  ·  ABN 47 612 903 158  ·  Level 12, 88 Pitt Street, Sydney NSW 2000');
  footerPara.setFontSize(7);
  footerPara.setForegroundColor('#9aa0a6');
  footerPara.setBackgroundColor(null);
  footerPara.setFontFamily('Arial');
  footerPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  footerPara.setSpacingBefore(2);
  footerPara.setSpacingAfter(0);

  var disclaimerPara = body.appendParagraph('This document is confidential and prepared for the intended recipient only.');
  disclaimerPara.setFontSize(6);
  disclaimerPara.setForegroundColor('#bdc1c6');
  disclaimerPara.setBackgroundColor(null);
  disclaimerPara.setFontFamily('Arial');
  disclaimerPara.setAlignment(DocumentApp.HorizontalAlignment.CENTER);
  disclaimerPara.setSpacingBefore(0);

  doc.saveAndClose();

  // Optionally move to a specific folder
  if (folderId) {
    try {
      var file = DriveApp.getFileById(doc.getId());
      var folder = DriveApp.getFolderById(folderId);
      folder.addFile(file);
      DriveApp.getRootFolder().removeFile(file);
    } catch (moveErr) {
      Logger.log('Could not move to folder: ' + moveErr);
    }
  }

  return {
    docId: doc.getId(),
    docUrl: doc.getUrl(),
    title: doc.getName()
  };
}

// ── SEND EMAIL VIA GMAIL ──
function sendEmail(data, config) {
  const { to, subject, body, cc, bcc, htmlBody, attachDocId } = data;

  if (!to || !subject) {
    throw new Error('Email requires "to" and "subject" fields');
  }
  if (!isAllowedRecipient(to, config)) {
    throw new Error('Recipient is not allowed for this demo');
  }
  if (cc || bcc) {
    throw new Error('CC and BCC are disabled for the public demo bridge');
  }

  var options = {
    name: config.SENDER_NAME,
  };

  // If HTML body is provided, use it
  if (htmlBody) {
    options.htmlBody = htmlBody;
  }

  // Attach a Google Doc as PDF if specified
  if (attachDocId) {
    try {
      var file = DriveApp.getFileById(attachDocId);
      var pdf = file.getAs(MimeType.PDF);
      options.attachments = [pdf];
    } catch (attachErr) {
      Logger.log('Could not attach doc: ' + attachErr);
    }
  }

  GmailApp.sendEmail(to, subject, body || '', options);

  return {
    sentTo: to,
    subject: subject,
    timestamp: new Date().toISOString()
  };
}

// ── CREATE CALENDAR EVENT ──
function createCalendarEvent(data, config) {
  const { title, startTime, endTime, description, attendees, location } = data;

  if (!title || !startTime) {
    throw new Error('Event requires "title" and "startTime" fields');
  }

  var cal = CalendarApp.getCalendarById(config.CALENDAR_ID)
            || CalendarApp.getDefaultCalendar();

  var start = new Date(startTime);
  var end = endTime ? new Date(endTime) : new Date(start.getTime() + 30 * 60 * 1000); // Default 30 min

  var event;

  if (attendees && Array.isArray(attendees) && attendees.length > 0) {
    var blocked = attendees.filter(function(email) {
      return !isAllowedRecipient(email, config);
    });
    if (blocked.length > 0) {
      throw new Error('One or more event attendees are not allowed for this demo');
    }
    // Use advanced option to invite guests
    event = cal.createEvent(title, start, end, {
      description: description || '',
      location: location || '',
      guests: attendees.join(','),
      sendInvites: true
    });
  } else {
    event = cal.createEvent(title, start, end);
    if (description) event.setDescription(description);
    if (location) event.setLocation(location);
  }

  return {
    eventId: event.getId(),
    title: event.getTitle(),
    start: start.toISOString(),
    end: end.toISOString()
  };
}

// ── FULL ORCHESTRATION (all three in sequence) ──
function runFullOrchestration(data, config) {
  var results = {
    steps: [],
    startTime: new Date().toISOString()
  };

  // Step 1: Create Document
  if (data.doc) {
    var docResult = createDocument(data.doc);
    results.steps.push({ action: 'create_doc', result: docResult });
    results.docId = docResult.docId;
    results.docUrl = docResult.docUrl;

    // If email should attach the doc, pass the ID
    if (data.email && data.email.attachReport) {
      data.email.attachDocId = docResult.docId;
    }
  }

  // Step 2: Send Email
  if (data.email) {
    var emailResult = sendEmail(data.email, config);
    results.steps.push({ action: 'send_email', result: emailResult });
  }

  // Step 3: Create Calendar Event
  if (data.event) {
    var eventResult = createCalendarEvent(data.event, config);
    results.steps.push({ action: 'create_event', result: eventResult });
    results.eventId = eventResult.eventId;
  }

  results.endTime = new Date().toISOString();
  results.totalSteps = results.steps.length;

  return results;
}

// ── UTILITY ──
// Note: Apps Script web apps always return HTTP 200 — ContentService can't set a
// status code — so success/failure must be signalled in the JSON body (success/error).
function jsonResponse(data) {
  var output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  CALLING FROM THE DEMO HTML (example JavaScript)
 * ═══════════════════════════════════════════════════════════════
 *
 *  const GAS_ENDPOINT = 'https://script.google.com/macros/s/YOUR_DEPLOY_ID/exec';
 *
 *  // Full orchestration — create doc, send email, book meeting
 *  const response = await fetch(GAS_ENDPOINT, {
 *    method: 'POST',
 *    headers: { 'Content-Type': 'application/json' },
 *    body: JSON.stringify({
 *      token: '<same value as GAS_TOKEN>',
 *      action: 'full_orchestration',
 *      data: {
 *        doc: {
 *          title: 'Q3 2025 Client Portfolio Report',
 *          content: [
 *            { t: 'h1', v: 'Q3 2025 Client Portfolio Report' },
 *            { t: 'h2', v: 'Executive Summary' },
 *            { t: 'p',  v: 'Portfolio outperformed benchmark by 1.4%...' },
 *            { t: 'ul', v: ['ROI: +7.2%', 'Risk: -12%', 'Liquidity: 1.8x'] }
 *          ]
 *        },
 *        email: {
 *          to: 'client@example.com',
 *          subject: 'Q3 2025 Portfolio Report — Action Required',
 *          body: 'Dear Client,\n\nPlease find your Q3 report attached...',
 *          attachReport: true
 *        },
 *        event: {
 *          title: 'Q3 Portfolio Review Meeting',
 *          startTime: '2026-04-14T09:00:00+10:00',
 *          endTime: '2026-04-14T09:30:00+10:00',
 *          attendees: ['client@example.com'],
 *          description: 'Review Q3 portfolio performance and recommendations'
 *        }
 *      }
 *    })
 *  });
 *
 *  const result = await response.json();
 *  console.log(result);
 *  // { success: true, result: { docUrl: '...', steps: [...] } }
 *
 * ═══════════════════════════════════════════════════════════════
 */
