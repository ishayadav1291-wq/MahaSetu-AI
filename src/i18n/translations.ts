export const translations = {
  en: {
    app_title: 'MahaSetu',
    app_tagline: 'Single Window Clearances & Department Interoperability Gateway',
    nav_citizen: 'Citizen Portal',
    nav_officer: 'Officer Queue',
    nav_admin: 'Admin Center',
    nav_assistant: 'Rules Assistant',
    lang_switch: 'मराठी',
    switch_role: 'Switch Role',

    // Status Vocabulary (from PDF spec p.15)
    status_in_progress: 'In progress',
    status_partly_approved: 'Partly approved',
    status_action_needed: 'Action needed',
    status_delayed: 'Delayed, we are retrying',
    status_approved: 'Approved',
    status_draft: 'Draft',

    // Task States (from PDF spec p.16)
    task_submitted: 'Submitted',
    task_received: 'Received',
    task_in_review: 'In Review',
    task_approved: 'Approved',
    task_rejected: 'Rejected',
    task_more_info: 'More Information Needed',
    task_dead_letter: 'Dead Letter (Queued for Retry)',

    // Departments
    dept_industries: 'Industries (MIDC)',
    dept_mpcb: 'Pollution Control (MPCB)',
    dept_fire: 'Fire & Emergency Services',
    dept_labour: 'Department of Labour',

    // Demo banner
    demo_banner_title: 'Interactive Demo: "Ravi starts a small factory"',
    demo_banner_desc: 'Walk through the 14-step interoperability story, simulate failures, inspect the transactional outbox, and verify the cryptographic audit chain.',
    step_label: 'Step',

    // Citizen Wizard
    wizard_title: 'Single Window Factory Clearance',
    wizard_subtitle: 'Apply once with MahaSetu. We coordinate parallel clearances across all relevant Maharashtra state departments.',
    step_describe: '1. Describe',
    step_checklist: '2. Checklist',
    step_upload: '3. Upload',
    step_consent: '4. Consent',
    step_submit: '5. Submit',

    // Describe step
    form_factory_name: 'Factory / Enterprise Name',
    form_district: 'District in Maharashtra',
    form_size: 'Enterprise Scale',
    form_sector: 'Industrial Sector',
    form_workers: 'Estimated Workforce',
    form_investment: 'Capital Investment (₹ Lakhs)',
    form_address: 'Plot Address / Industrial Area',
    form_power: 'Sanctioned Power Load (KW)',
    btn_find_approvals: 'Generate Approvals Checklist',

    // Checklist step
    checklist_heading: 'Required Department Clearances',
    checklist_subheading: 'Derived deterministically from Maharashtra State business licensing rules.',
    rule_citation: 'Rule Citation',
    legal_basis: 'Legal Authority',
    btn_proceed_upload: 'Proceed to Document Upload',

    // Upload step
    upload_heading: 'Synthetic Document Pre-checks',
    upload_subheading: 'MahaSetu pre-checks documents for cross-record identity and address discrepancies prior to department dispatch.',
    upload_aadhaar_label: 'Identity Proof (PAN / Aadhaar of Ravi Patil)',
    upload_address_label: 'Premises Proof (MSEB Electricity Bill)',
    upload_plant_label: 'Factory Layout Blueprint',
    simulate_mismatch: 'Simulate Address Discrepancy',
    fix_mismatch: 'Resolve / Match Addresses',
    mismatch_warning_title: 'Cross-Document Address Discrepancy Detected',
    mismatch_warning_desc: 'Identity Proof specifies "Plot 14, MIDC Chakan, Pune" while Utility Bill specifies "Plot 41, Hadapsar, Pune". Fix the mismatch to avoid department rejection.',
    btn_proceed_consent: 'Proceed to Consent Gate',

    // Consent step
    consent_heading: 'Granular Data Sharing Consent',
    consent_subheading: 'Under the Digital Personal Data Protection Act, you control exactly which department receives your data and for what specific purpose.',
    consent_data_shared: 'Data Fields Shared',
    consent_purpose: 'Authorized Purpose',
    consent_validity: 'Validity: 90 Days',
    consent_allow: 'Consent Granted',
    consent_deny: 'Denied (Blocks Department Send)',
    btn_submit_application: 'Submit Application to MahaSetu',

    // Submit step
    submit_success_title: 'Application Successfully Dispatched',
    submit_tracking_id_label: 'Unified Tracking ID',
    submit_time_guarantee: 'Submission registered in 0.42 seconds. Parallel outbound dispatches queued in Transactional Outbox.',
    btn_view_timeline: 'Track Cross-Department Timeline',
    btn_apply_another: 'New Application',

    // Tracking Screen
    tracking_title: 'Unified Application Tracking',
    tracking_badge_label: 'Derived Application Status',
    timeline_heading: 'Parallel Department Status',
    timeline_subheading: 'Each department is the sovereign system of record. MahaSetu mirrors their live status via certified connectors.',
    sla_time_left: 'Turnaround Target (SLA)',
    sla_warning: 'SLA Warning: 80% time elapsed',
    sla_breached: 'SLA Breached: Turnaround target missed',
    btn_resubmit: 'Resubmit to this Department Only',
    file_grievance: 'File Grievance for Delay',
    resubmit_modal_title: 'Targeted Department Resubmission',
    resubmit_modal_desc: 'Correct requirements for this department only. All other department clearances remain untouched and approved.',
    btn_confirm_resubmit: 'Submit Correction',

    // Officer Screen
    officer_title: 'Department Decision Queue',
    officer_subheading: 'Review pending applications submitted to your department. Decided tasks are automatically synced to the citizen portal.',
    filter_all: 'All Statuses',
    filter_pending: 'Pending Action',
    queue_col_tracking: 'Tracking ID',
    queue_col_factory: 'Enterprise & District',
    queue_col_sla: 'SLA Due In',
    queue_col_risk: 'Risk Status',
    queue_col_actions: 'Action',
    btn_review: 'Review & Decide',
    modal_decision_title: 'Officer Clearance Decision',
    decision_approve: 'Grant Approval',
    decision_reject: 'Reject Clearance',
    decision_more_info: 'Request More Information',
    decision_reason_placeholder: 'Mandatory reason for rejection or additional requirements...',

    // Admin Screen
    admin_title: 'Nodal Command & Interoperability Center',
    admin_subheading: 'Real-time observability over outbound department gateways, transactional outbox queue, dead-letter retries, and cryptographic audit ledger.',
    kpi_avg_processing: 'Avg Clearance Time',
    kpi_sla_breaches: 'SLA Breaches',
    kpi_dead_letter: 'Dead-Letter Items',
    kpi_connectors: 'Connector Health',
    tab_overview: 'Overview & Connectors',
    tab_dlq: 'Dead-Letter Queue',
    tab_audit: 'Cryptographic Audit Chain',
    tab_demo_switches: 'Demo Control Switches',
    dlq_heading: 'Failed Department Dispatches (Dead-Letter Queue)',
    dlq_desc: 'Dispatches that failed 4 attempts are isolated here. Retrying reuses the exact same idempotency key to prevent double submissions.',
    btn_retry_send: 'Retry Send (Same Key)',
    audit_heading: 'SHA-256 Hash-Chained Audit Ledger',
    audit_desc: 'Every actor decision, outbox send, and consent grant is chained with SHA-256 cryptographic hashes. Any alteration breaks the entire ledger verification.',
    btn_verify_chain: 'Verify Audit Integrity',
    verification_passed: 'Cryptographic chain is intact. All hash links verified.',
    switch_fail_dept: 'Simulate MPCB Gateway Failure (503 Service Unavailable)',
    switch_fast_sla: 'Fast-Forward SLA Deadlines to 30 Seconds',

    // Assistant
    assistant_title: 'MahaSetu AI Regulatory Assistant',
    assistant_desc: 'Grounded strictly in Maharashtra industrial licensing rules. All responses cite legal rule IDs.',
    assistant_placeholder: 'Ask about NOCs, pollution consent, or factory registration...',
    btn_ask: 'Ask Assistant',
    assistant_sample_q1: 'Do I need Fire NOC for a small factory in Pune?',
    assistant_sample_q2: 'What are the rules for MPCB Consent to Establish?',
    assistant_sample_q3: 'Can I manufacture without an MIDC acknowledgement?'
  },
  mr: {
    app_title: 'महासेतू',
    app_tagline: 'महाराष्ट्र शासन एकल खिडकी आंतरकार्यक्षमता प्रणाली (MahaSetu)',
    nav_citizen: 'नागरिक पोर्टल',
    nav_officer: 'अधिकारी कार्यकक्षा',
    nav_admin: 'प्रशासक केंद्र',
    nav_assistant: 'नियम सहाय्यक',
    lang_switch: 'English',
    switch_role: 'भूमिका बदला',

    // Status Vocabulary (from PDF spec p.15)
    status_in_progress: 'प्रक्रियेत',
    status_partly_approved: 'अंशतः मंजूर',
    status_action_needed: 'कृती आवश्यक',
    status_delayed: 'विलंब, पुन्हा प्रयत्न सुरू',
    status_approved: 'मंजूर',
    status_draft: 'मसुदा',

    // Task States (from PDF spec p.16)
    task_submitted: 'सादर',
    task_received: 'प्राप्त',
    task_in_review: 'तपासणीत',
    task_approved: 'मंजूर',
    task_rejected: 'नाकारले',
    task_more_info: 'अधिक माहिती हवी',
    task_dead_letter: 'त्रुटी नोंद (पुन्हा प्रयत्नासाठी रांगेत)',

    // Departments
    dept_industries: 'उद्योग संचालनालय (एमआयडीसी)',
    dept_mpcb: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
    dept_fire: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
    dept_labour: 'कामगार विभाग',

    // Demo banner
    demo_banner_title: 'प्रात्यक्षिक: "रवीने सुरू केला लहान कारखाना"',
    demo_banner_desc: '१४-टप्प्यांची आंतरकार्यक्षमता कथा, गेटवे अपयश चाचणी, आऊटबॉक्स आणि हॅश-चेन ऑडिट पडताळणी अनुभवा.',
    step_label: 'टप्पा',

    // Citizen Wizard
    wizard_title: 'एक खिडकी कारखाना परवानगी अर्ज',
    wizard_subtitle: 'महासेतू द्वारे एकदाच अर्ज करा. आम्ही महाराष्ट्रातील संबंधित सर्व विभागांशी थेट समन्वय साधतो.',
    step_describe: '१. तपशील',
    step_checklist: '२. परवानग्या',
    step_upload: '३. कागदपत्रे',
    step_consent: '४. संमती',
    step_submit: '५. सादरीकरण',

    // Describe step
    form_factory_name: 'कारखाना / उद्योगाचे नाव',
    form_district: 'महाराष्ट्रातील जिल्हा',
    form_size: 'उद्योगाचा आकारमान',
    form_sector: 'औद्योगिक क्षेत्र',
    form_workers: 'अपेक्षित कामगार संख्या',
    form_investment: 'भांडवली गुंतवणूक (₹ लाख)',
    form_address: 'प्लॉटचा पत्ता / औद्योगिक वसाहत',
    form_power: 'वीज भार (किलोवॅट KW)',
    btn_find_approvals: 'आवश्यक परवानग्या तपासा',

    // Checklist step
    checklist_heading: 'आवश्यक विभागीय परवानग्यांची यादी',
    checklist_subheading: 'महाराष्ट्र शासनाच्या नियमांनुसार आणि कायद्यांनुसार स्वयंचलित निवड.',
    rule_citation: 'नियम संदर्भ (Rule ID)',
    legal_basis: 'कायदेशीर तरतूद',
    btn_proceed_upload: 'कागदपत्रे जोडण्यासाठी पुढे जा',

    // Upload step
    upload_heading: 'कागदपत्र पूर्व-पडताळणी',
    upload_subheading: 'विभागांकडे अर्ज पाठवण्यापूर्वी महासेतू ओळख आणि पत्त्यातील तफावत तपासतो.',
    upload_aadhaar_label: 'ओळख पुरावा (रवी पाटील यांचे पॅन / आधार कार्ड)',
    upload_address_label: 'जागेचा पुरावा (महावितरण वीज बिल)',
    upload_plant_label: 'कारखाना बांधकाम नकाशा',
    simulate_mismatch: 'पत्त्यातील तफावत निर्माण करा (प्रात्यक्षिक)',
    fix_mismatch: 'पत्ता जुळवून दुरुस्त करा',
    mismatch_warning_title: 'कागदपत्रांमधील पत्त्यात तफावत आढळली',
    mismatch_warning_desc: 'ओळख पुराव्यात "प्लॉट १४, एमआयडीसी चाकण, पुणे" आहे तर वीज बिलात "प्लॉट ४१, हडपसर, पुणे" आहे. नाकारले जाणे टाळण्यासाठी पत्ता दुरुस्त करा.',
    btn_proceed_consent: 'संमती पत्राकडे पुढे जा',

    // Consent step
    consent_heading: 'विभागीय डेटा संमती (DPDP कायदा)',
    consent_subheading: 'आपल्या संमतीशिवाय कोणताही डेटा विभागाला दिला जात नाही. प्रत्येक विभागासाठी स्वतंत्र संमती द्या.',
    consent_data_shared: 'सामायिक केली जाणारी माहिती',
    consent_purpose: 'अधिकृत उद्देश',
    consent_validity: 'वैधता: ९० दिवस',
    consent_allow: 'संमती दिली (मंजूर)',
    consent_deny: 'संमती नाकारली (अर्ज थांबेल)',
    btn_submit_application: 'महासेतू कडे अर्ज सादर करा',

    // Submit step
    submit_success_title: 'अर्ज यशस्वीरीत्या नोंदवला गेला!',
    submit_tracking_id_label: 'एकत्रित ट्रॅकिंग आयडी (Tracking ID)',
    submit_time_guarantee: 'अवघ्या ०.४२ सेकंदात ट्रॅकिंग आयडी जारी. विभागांकडे पाठवण्यासाठी आऊटबॉक्समध्ये पाठवला.',
    btn_view_timeline: 'थेट प्रगती ट्रॅक करा',
    btn_apply_another: 'नवीन अर्ज करा',

    // Tracking Screen
    tracking_title: 'एकत्रित अर्ज प्रगती ट्रॅकिंग',
    tracking_badge_label: 'एकत्रित निष्कर्ष स्थिती',
    timeline_heading: 'विभागांनुसार समांतर प्रगती',
    timeline_subheading: 'प्रत्येक विभाग स्वतःच्या निर्णयासाठी स्वतंत्र आहे. महासेतू थेट स्थिती दर्शवतो.',
    sla_time_left: 'निकालाची अंतिम मुदत (SLA)',
    sla_warning: 'मुदत इशारा: ८०% वेळ संपला आहे',
    sla_breached: 'मुदत संपली: कायदेशीर वेळेत निर्णय झाला नाही',
    btn_resubmit: 'केवळ या विभागाकडे दुरुस्ती सादर करा',
    file_grievance: 'विलंबाविरुद्ध तक्रार नोंदवा',
    resubmit_modal_title: 'विशिष्ट विभागीय फेर-सादरीकरण',
    resubmit_modal_desc: 'केवळ त्रुटी असलेल्या विभागासाठी माहिती सुधारा. इतर सर्व विभागांच्या मंजुऱ्या कायम राहतील.',
    btn_confirm_resubmit: 'दुरुस्ती सादर करा',

    // Officer Screen
    officer_title: 'विभागीय अधिकारी कार्यकक्षा',
    officer_subheading: 'आपल्या विभागाशी संबंधित अर्जांची तपासणी करा आणि निर्णय घ्या.',
    filter_all: 'सर्व अर्ज',
    filter_pending: 'प्रलंबित अर्ज',
    queue_col_tracking: 'ट्रॅकिंग आयडी',
    queue_col_factory: 'उद्योगाचे नाव व जिल्हा',
    queue_col_sla: 'उर्वरित वेळ (SLA)',
    queue_col_risk: 'जोखीम पातळी',
    queue_col_actions: 'कारवाई',
    btn_review: 'तपासा आणि निर्णय घ्या',
    modal_decision_title: 'परवानगी निर्णय नोंदवा',
    decision_approve: 'परवानगी मंजूर करा',
    decision_reject: 'परवानगी नाकारा',
    decision_more_info: 'अधिक माहितीची मागणी करा',
    decision_reason_placeholder: 'नाकारण्याचे किंवा माहिती मागवण्याचे सविस्तर कारण...',

    // Admin Screen
    admin_title: 'नोडल प्रशासकीय नियंत्रण केंद्र',
    admin_subheading: 'विभागीय गेटवे आरोग्य, आऊटबॉक्स, त्रुटी व्यवस्थापन आणि हॅश-चेन ऑडिटची थेट देखरेख.',
    kpi_avg_processing: 'सरासरी मंजुरी वेळ',
    kpi_sla_breaches: 'मुदत उल्लंघन (Breaches)',
    kpi_dead_letter: 'त्रुटी रांग (DLQ)',
    kpi_connectors: 'कनेक्टर स्थिती',
    tab_overview: 'आढावा व कनेक्टर',
    tab_dlq: 'डेड-लेटर रांग (DLQ)',
    tab_audit: 'क्रिप्टोग्राफिक ऑडिट चेन',
    tab_demo_switches: 'प्रात्यक्षिक नियंत्रणे',
    dlq_heading: 'अयशस्वी संदेश (Dead-Letter Queue)',
    dlq_desc: '४ प्रयत्न अयशस्वी झाल्यानंतर संदेश येथे सुरक्षित ठेवले जातात. त्याच आयडेम्पोटेन्सी की सह पुन्हा पाठवता येतात.',
    btn_retry_send: 'पुन्हा पाठवा (त्याच की सह)',
    audit_heading: 'SHA-256 हॅश-साखळी ऑडिट लॉग',
    audit_desc: 'प्रत्येक निर्णय आणि कृती SHA-256 हॅशने साखळीबद्ध आहे. कोणताही बदल केल्यास साखळी तुटते.',
    btn_verify_chain: 'ऑडिट अखंडता तपासा',
    verification_passed: 'ऑडिट साखळी पूर्णपणे सुरक्षित व अखंड आहे. सर्व हॅश अचूक आहेत.',
    switch_fail_dept: 'प्रदूषण मंडळ (MPCB) गेटवे अपयश निर्माण करा',
    switch_fast_sla: 'मुदत जलद करा (३० सेकंद SLA)',

    // Assistant
    assistant_title: 'महासेतू एआय नियम सहाय्यक',
    assistant_desc: 'महाराष्ट्र शासनाच्या अधिकृत नियमांवर आधारित अचूक उत्तरे आणि नियम संदर्भ.',
    assistant_placeholder: 'अग्निशमन एनओसी, प्रदूषण संमती किंवा उद्योग नोंदणीबद्दल विचारा...',
    btn_ask: 'विचारणा करा',
    assistant_sample_q1: 'पुण्यात लहान कारखान्यासाठी अग्निशमन NOC आवश्यक आहे का?',
    assistant_sample_q2: 'प्रदूषण नियंत्रण मंडळाच्या CTE चे नियम काय आहेत?',
    assistant_sample_q3: 'उद्योग पोचपावती (IUA) कशी मिळते?'
  }
};
