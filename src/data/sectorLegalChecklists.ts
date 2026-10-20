import { Department, SectorId, ApprovalRule } from '../types';

export interface SectorLegalComplianceItem {
  id: string;
  title_en: string;
  title_mr: string;
  authority_en: string;
  authority_mr: string;
  department: Department;
  what_it_checks_en: string;
  what_it_checks_mr: string;
  legal_act_en: string;
  legal_act_mr: string;
  sla_display: string;
  sla_minutes: number;
  is_mandatory: boolean;
  key_document_en: string;
  key_document_mr: string;
}

export interface SectorLegalChecklist {
  sector_id: SectorId;
  sector_name_en: string;
  sector_name_mr: string;
  easy_summary_en: string;
  easy_summary_mr: string;
  compliances: SectorLegalComplianceItem[];
}

export const SECTOR_LEGAL_CHECKLISTS: Record<SectorId, SectorLegalChecklist> = {
  // --------------------------------------------------------------------------
  // 1. FOOD & AGRO PROCESSING (Food Processing)
  // --------------------------------------------------------------------------
  food_agro_processing: {
    sector_id: 'food_agro_processing',
    sector_name_en: 'Food & Agro Processing',
    sector_name_mr: 'अन्न व कृषी प्रक्रिया',
    easy_summary_en: 'Food units need food safety clearance, clean drinking water tests, safe cold storage, and clean wash water drains.',
    easy_summary_mr: 'अन्न प्रक्रिया उद्योगांना अन्न सुरक्षा परवाना, पिण्याच्या पाण्याचा तपासणी अहवाल, सुरक्षित शीतगृह आणि सांडपाणी निचरा आवश्यक असतो.',
    compliances: [
      {
        id: 'RULE-FOOD-FSSAI',
        title_en: 'Food Safety License (FSSAI)',
        title_mr: 'अन्न सुरक्षा परवाना (FSSAI)',
        authority_en: 'Food Safety & Drug Administration (FDA Maharashtra)',
        authority_mr: 'अन्न व औषध प्रशासन (एफडीए महाराष्ट्र)',
        department: 'industries',
        what_it_checks_en: 'Verifies clean cooking or packing space, worker medical checkups, and clean drinking water.',
        what_it_checks_mr: 'स्वच्छ अन्न प्रक्रिया जागा, कामगारांची वैद्यकीय तपासणी आणि पिण्याचे पाणी शुद्ध असण्याची खात्री केली जाते.',
        legal_act_en: 'Food Safety & Standards Act 2006',
        legal_act_mr: 'अन्न सुरक्षा आणि मानके कायदा २००६',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Drinking water potability lab test report & processing unit layout',
        key_document_mr: 'पाणी तपासणी प्रयोगशाळा अहवाल आणि कारखाना अंतर्गत आराखडा'
      },
      {
        id: 'RULE-FOOD-MPCB',
        title_en: 'Pollution Board Consent (MPCB)',
        title_mr: 'प्रदूषण नियंत्रण मंडळ संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Verifies organic food wash water treatment (effluent plant) and clean vegetable waste composting.',
        what_it_checks_mr: 'भाजीपाला व अन्न धुण्याचे पाणी स्वच्छ करणारी यंत्रणा (ETP) आणि सेंद्रिय कचरा व्यवस्थापन तपासले जाते.',
        legal_act_en: 'Water & Air Pollution Prevention Acts',
        legal_act_mr: 'जल आणि वायू प्रदूषण नियंत्रण कायदा',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Effluent treatment plant (ETP) plan & organic waste disposal plan',
        key_document_mr: 'सांडपाणी प्रक्रिया प्रकल्प नकाशा व घनकचरा विल्हेवाट योजना'
      },
      {
        id: 'RULE-FOOD-COLD-SAFETY',
        title_en: 'Worker Health & Cold Storage Safety',
        title_mr: 'कामगार आरोग्य व शीतगृह सुरक्षा परवाना',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures cold room thermal warm jackets for workers, clean aprons, hairnets, and ammonia gas leak alarms.',
        what_it_checks_mr: 'शीतगृहात काम करणाऱ्यांसाठी गरम कपडे, स्वच्छ ऍप्रन, हेअरनेट आणि अमोनिया गॅस गळती अलार्म तपासले जातात.',
        legal_act_en: 'Factories Act 1948 & Worker Hygiene Rules',
        legal_act_mr: 'कारखाने कायदा १९४८ आणि कामगार स्वच्छता नियम',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Worker medical fitness register & cold room safety audit',
        key_document_mr: 'कामगार आरोग्य तपासणी नोंदवही व शीतगृह सुरक्षा प्रमाणपत्र'
      },
      {
        id: 'RULE-FOOD-FIRE-NOC',
        title_en: 'Food Factory Fire Safety NOC',
        title_mr: 'अन्न कारखाना अग्निशमन ना-हरकत प्रमाणपत्र (NOC)',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks emergency escape doors, boiler heat insulation, and fire hose pipes near dry food stores.',
        what_it_checks_mr: 'आणीबाणी बाहेर पडण्याचे मार्ग, बॉयलर उष्णतारोधक कवच आणि धान्य साठवणुकीजवळ अग्निशामक पाईप तपासले जातात.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक आणि जीवन सुरक्षा कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Factory fire extinguisher layout & building exit blueprint',
        key_document_mr: 'अग्निशमन यंत्रणा नकाशा व मंजूर इमारत आराखडा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 2. IT & DATA CENTERS (IT Services)
  // --------------------------------------------------------------------------
  it_ites_datacenter: {
    sector_id: 'it_ites_datacenter',
    sector_name_en: 'IT Services & Data Centers',
    sector_name_mr: 'माहिती तंत्रज्ञान (आयटी) व डेटा सेंटर्स',
    easy_summary_en: 'IT companies do not cause factory smoke or wastewater, but need permissions for 24/7 shifts, night cab safety for staff, and server fire protection.',
    easy_summary_mr: 'आयटी कंपन्यांमुळे धूर किंवा सांडपाणी प्रदूषण होत नाही, मात्र २४ तास काम, महिला कर्मचाऱ्यांसाठी रात्रीच्या वाहनांची सोय आणि सर्व्हर रूम सुरक्षा आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-IT-POLICY-247',
        title_en: '24/7 Operations & Maharashtra IT Policy Registration',
        title_mr: '२४/७ कामकाज व महाराष्ट्र आयटी धोरण नोंदणी',
        authority_en: 'Directorate of Industries (IT & Tech Desk)',
        authority_mr: 'उद्योग संचालनालय (माहिती तंत्रज्ञान कक्ष)',
        department: 'industries',
        what_it_checks_en: 'Grants continuous 24-hour working permissions, uninterrupted power priority, and zero stamp duty incentives.',
        what_it_checks_mr: '२४ तास विनाअडथळा काम करण्याची परवानगी, अखंड वीज प्राधान्य आणि मुद्रांक शुल्क सवलत दिली जाते.',
        legal_act_en: 'Maharashtra IT / ITeS Policy 2023',
        legal_act_mr: 'महाराष्ट्र माहिती तंत्रज्ञान धोरण २०२३',
        sla_display: '4 min SLA',
        sla_minutes: 4,
        is_mandatory: true,
        key_document_en: 'IT company registration certificate & employee staffing schedule',
        key_document_mr: 'कंपनी नोंदणी प्रमाणपत्र आणि कर्मचारी शिफ्ट वेळापत्रक'
      },
      {
        id: 'RULE-IT-MPCB-WHITE',
        title_en: 'Pollution-Free Status (White Category Exemption)',
        title_mr: 'प्रदूषणमुक्त दर्जा (व्हाईट कॅटेगरी सवलत)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Certifies that software offices do not generate industrial waste; grants immediate online exemption from lengthy environmental hearings.',
        what_it_checks_mr: 'सॉफ्टवेअर कार्यालयांमुळे प्रदूषण होत नसल्याचे प्रमाणित करून प्रत्यक्ष तपासणीविना त्वरित ऑनलाइन सवलत दिली जाते.',
        legal_act_en: 'MPCB White Category Industrial Notification',
        legal_act_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ व्हाईट कॅटेगरी अधिसूचना',
        sla_display: '3 min SLA',
        sla_minutes: 3,
        is_mandatory: true,
        key_document_en: 'Self-declaration of non-polluting software/data operations',
        key_document_mr: 'प्रदूषणरहित सॉफ्टवेअर कामाचे स्वघोषणापत्र'
      },
      {
        id: 'RULE-IT-NIGHT-SAFETY',
        title_en: 'Night Shift & Staff Cab Safety Undertaking',
        title_mr: 'रात्रपाळी व महिला कर्मचारी सुरक्षा हमीपत्र',
        authority_en: 'Department of Labour (Shops & Establishments)',
        authority_mr: 'कामगार विभाग (दुकाने व आस्थापना कक्ष)',
        department: 'labour',
        what_it_checks_en: 'Requires GPS-tracked company cabs with verified drivers for night staff, emergency SOS apps, and well-lit office corridors.',
        what_it_checks_mr: 'रात्री काम करणाऱ्या कर्मचाऱ्यांसाठी जीपीएस गाड्या, पोलीस पडताळणी झालेले चालक आणि सुरक्षेची हमी तपासली जाते.',
        legal_act_en: 'Maharashtra Shops & Establishments Act 2017',
        legal_act_mr: 'महाराष्ट्र दुकाने व आस्थापना कायदा २०१७',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'GPS fleet transport contract & workplace safety policy',
        key_document_mr: 'कर्मचारी वाहतूक करार व कार्यस्थळ सुरक्षा नियमावली'
      },
      {
        id: 'RULE-IT-SERVER-FIRE',
        title_en: 'Server Room Gas Fire Suppression NOC',
        title_mr: 'सर्व्हर रूम गॅस अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Verifies waterless gas fire suppression (FM-200 / Novec) that puts out fires without ruining costly computer servers.',
        what_it_checks_mr: 'संगणक सर्व्हर खराब न होता आग विझवणारी पाणीरहित गॅस अग्निशमन यंत्रणा तपासली जाते.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक आणि जीवन सुरक्षा कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Clean agent gas suppression layout & battery backup plan',
        key_document_mr: 'गॅस अग्निशमन यंत्रणा नकाशा व युपीएस बॅटरी कक्ष आराखडा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 3. MANUFACTURING & ENGINEERING (Default Workshop / Machine Shop)
  // --------------------------------------------------------------------------
  manufacturing_engineering: {
    sector_id: 'manufacturing_engineering',
    sector_name_en: 'Engineering & Machinery',
    sector_name_mr: 'अभियांत्रिकी व यंत्रसामग्री',
    easy_summary_en: 'Machinery workshops need factory registration, protective shields on cutting tools, basic chimney smoke clearance, and fire extinguishers.',
    easy_summary_mr: 'यंत्रशाळा व वर्कशॉपसाठी कारखाना नोंदणी, फिरणाऱ्या मशिनरीला संरक्षक जाळ्या, धुराडे मंजुरी आणि अग्निशमन यंत्रे आवश्यक असतात.',
    compliances: [
      {
        id: 'RULE-IND-IUA',
        title_en: 'Industrial Unit Registration (IUA Acknowledgement)',
        title_mr: 'उद्योग नोंदणी पोचपावती (IUA)',
        authority_en: 'Directorate of Industries (MIDC)',
        authority_mr: 'उद्योग संचालनालय (एमआयडीसी)',
        department: 'industries',
        what_it_checks_en: 'Official state registration of your factory address, power connection quota, and machinery investment.',
        what_it_checks_mr: 'कारखान्याचा पत्ता, वीज भार मंजुरी आणि यंत्रसामग्री गुंतवणुकीची अधिकृत शासकीय नोंदणी.',
        legal_act_en: 'Maharashtra Industrial Development Act & MSMED Act',
        legal_act_mr: 'महाराष्ट्र औद्योगिक विकास कायदा आणि एमएसएमईडी कायदा',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'MIDC plot allotment letter / electricity bill & machinery list',
        key_document_mr: 'एमआयडीसी भूखंड वाटप पत्र किंवा वीज बिल आणि यंत्रसामग्री यादी'
      },
      {
        id: 'RULE-MPCB-ORANGE-CTE',
        title_en: 'Pollution Board Consent to Establish (CTE)',
        title_mr: 'प्रदूषण नियंत्रण मंडळ स्थापना संमती (CTE)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Checks smoke chimney height for cutting or welding, waste oil collection drums, and workshop ventilation.',
        what_it_checks_mr: 'वेल्डिंगचा धूर बाहेर पडण्यासाठी धुराड्याची उंची आणि वापरलेले ऑईल सुरक्षित साठवण्याची सोय तपासली जाते.',
        legal_act_en: 'Water & Air Acts (Orange Category)',
        legal_act_mr: 'जल आणि वायू प्रदूषण नियंत्रण कायदा (ऑरेंज श्रेणी)',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Workshop exhaust chimney drawing & used oil storage plan',
        key_document_mr: 'धुराडे नकाशा आणि वेस्ट ऑईल साठवणूक पद्धती'
      },
      {
        id: 'RULE-LAB-MACHINE-SAFETY',
        title_en: 'Factory License & Machine Safety Shields',
        title_mr: 'कारखाना परवाना व मशिनरी सुरक्षा',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures lathe, press, and drill machines have strong guards so workers cannot accidentally hurt their hands or fingers.',
        what_it_checks_mr: 'लेथ, प्रेस आणि कटर मशिनवर कामगारांच्या हाताला इजा होऊ नये म्हणून संरक्षक जाळ्या बसवल्याची तपासणी.',
        legal_act_en: 'Factories Act 1948 (Sections 21 & 22 Machine Guarding)',
        legal_act_mr: 'कारखाने कायदा १९४८ (कलम २१ यंत्र सुरक्षा)',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Machine safety layout & worker first-aid kit plan',
        key_document_mr: 'मशिन सुरक्षा आराखडा आणि कामगार प्रथमोपचार पेटी सोय'
      },
      {
        id: 'RULE-FIRE-WORKSHOP',
        title_en: 'Workshop Fire Safety NOC',
        title_mr: 'वर्कशॉप अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks red fire extinguishers near electrical panels and clearly marked wide exit gates.',
        what_it_checks_mr: 'विद्युत पॅनेलजवळ लाल अग्निशामक सिलिंडर आणि मोकळे बाहेर पडण्याचे दरवाजे तपासले जातात.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Factory fire extinguisher plan & main gate layout',
        key_document_mr: 'अग्निशामक सिलिंडर स्थान नकाशा व प्रवेशद्वार आराखडा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 4. AUTOMOTIVE & ELECTRIC VEHICLES (Automotive & EV)
  // --------------------------------------------------------------------------
  automobile_ev: {
    sector_id: 'automobile_ev',
    sector_name_en: 'Automotive & Electric Vehicles',
    sector_name_mr: 'ऑटोमोबाईल व ईव्ही उद्योग',
    easy_summary_en: 'Automotive and EV units need battery fireproofing checks, high-voltage charger clearances, paint booth fume filters, and heavy crane tests.',
    easy_summary_mr: 'वाहन व ईव्ही उद्योगांना बॅटरी आग प्रतिबंध, उच्च विद्युत सुरक्षा, पेंट बूथ धूर गाळणी आणि अवजड क्रेन तपासणी आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-AUTO-EV-SAFETY',
        title_en: 'EV Battery Testing & High-Voltage Clearance',
        title_mr: 'ईव्ही बॅटरी टेस्टिंग व विद्युत सुरक्षा मंजुरी',
        authority_en: 'Directorate of Industries (Automotive & EV Cell)',
        authority_mr: 'उद्योग संचालनालय (ऑटो व ईव्ही कक्ष)',
        department: 'industries',
        what_it_checks_en: 'Ensures dedicated fireproof zones for lithium battery packs, thermal runaway barriers, and insulated test benches.',
        what_it_checks_mr: 'लिथियम बॅटरी चाचणीसाठी आग-प्रतिबंधक कक्ष आणि सुरक्षित विद्युत चार्जिंग व्यवस्था तपासली जाते.',
        legal_act_en: 'Maharashtra Electric Vehicle (EV) Policy 2021',
        legal_act_mr: 'महाराष्ट्र ईव्ही धोरण २०२१',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Battery assembly fire separation plan & electrical test specs',
        key_document_mr: 'बॅटरी असेंब्ली सुरक्षा नकाशा व विद्युत चाचणी विवरण'
      },
      {
        id: 'RULE-AUTO-PAINT-MPCB',
        title_en: 'Paint Booth Air & Sludge Consent (MPCB)',
        title_mr: 'पेंट बूथ वायू व सांडपाणी संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Checks water curtain filters that catch paint spray droplets and prevent toxic paint chemical smell from spreading outside.',
        what_it_checks_mr: 'रंगकामाचा धूर व विषारी वास हवेत पसरू नये म्हणून वॉटर-कर्टन गाळणी यंत्रणा तपासली जाते.',
        legal_act_en: 'Air & Water Pollution Control Acts',
        legal_act_mr: 'हवा व पाणी प्रदूषण नियंत्रण कायदा',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Paint booth dry/wet scrubber design & paint sludge disposal plan',
        key_document_mr: 'पेंट बूथ स्क्रबर नकाशा व रासायनिक गाळ विल्हेवाट योजना'
      },
      {
        id: 'RULE-AUTO-CRANE-DISH',
        title_en: 'Overhead Crane & Press Machinery Certification',
        title_mr: 'ओव्हरहेड क्रेन व हायड्रॉलिक प्रेस सुरक्षा तपासणी',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures heavy overhead cranes and hydraulic stamping presses are load-tested and certified by an authorized engineer.',
        what_it_checks_mr: 'अवजड क्रेन आणि हायड्रॉलिक प्रेसेसचे वजन पेलण्याची क्षमता अधिकृत अभियंत्याकडून तपासून प्रमाणित केली जाते.',
        legal_act_en: 'Maharashtra Factories Rules (Rule 64 Cranes & Lifting Gear)',
        legal_act_mr: 'महाराष्ट्र कारखाने नियम (नियम ६४ क्रेन सुरक्षा)',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Crane load test certificate & press machine dual emergency stops',
        key_document_mr: 'क्रेन लोड टेस्ट प्रमाणपत्र व आणीबाणी स्वीच तपासणी'
      },
      {
        id: 'RULE-AUTO-FIRE',
        title_en: 'Assembly Line Fire Protection NOC',
        title_mr: 'असेंब्ली लाईन अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks automatic water sprinklers above vehicle assembly bays and foam fire extinguishers for fuel/oil areas.',
        what_it_checks_mr: 'गाड्यांच्या जोडणी भागावर स्वयंचलित पाण्याचे स्प्रिंकलर्स आणि ऑईल भागासाठी फोम अग्निशामके तपासली जातात.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Sprinkler piping diagram & factory hydrants map',
        key_document_mr: 'स्प्रिंकलर पाईप नकाशा व कारखाना हायड्रंट योजना'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 5. CHEMICALS & POLYMERS (Chemicals)
  // --------------------------------------------------------------------------
  chemicals_petrochemicals: {
    sector_id: 'chemicals_petrochemicals',
    sector_name_en: 'Chemicals & Polymers',
    sector_name_mr: 'रसायने व पॉलिमर',
    easy_summary_en: 'Chemical units handle hazardous materials and need safe pressure relief valves, continuous chimney smoke sensors, and emergency siren plans.',
    easy_summary_mr: 'रासायनिक उद्योगांसाठी रासायनिक टाक्यांना सेफ्टी व्हॉल्व्ह, धुराड्यावर २४ तास सेन्सर्स आणि आणीबाणी सायरन योजना आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-CHEM-PSM',
        title_en: 'Process Safety & Chemical Tank Approval',
        title_mr: 'रासायनिक प्रक्रिया सुरक्षा व टाकी मंजुरी',
        authority_en: 'Directorate of Industries (Chemicals Safety Cell)',
        authority_mr: 'उद्योग संचालनालय (रासायनिक सुरक्षा कक्ष)',
        department: 'industries',
        what_it_checks_en: 'Checks pressure relief safety valves on chemical reactors and double-walled leak containment bunds under liquid tanks.',
        what_it_checks_mr: 'रासायनिक टाक्या फुटू नयेत म्हणून सेफ्टी व्हॉल्व्ह आणि गळती झाल्यास रसायन बाहेर वाहू नये म्हणून संरक्षक भिंत तपासली जाते.',
        legal_act_en: 'Manufacture, Storage & Import of Hazardous Chemical Rules 1989',
        legal_act_mr: 'घातक रसायने साठवणूक आणि आयात नियम १९८९',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'HAZOP safety review report & chemical tank dike wall drawing',
        key_document_mr: 'हॅझॉप सुरक्षा पुनरावलोकन अहवाल व टाकी संरक्षक भिंत नकाशा'
      },
      {
        id: 'RULE-CHEM-MPCB-RED',
        title_en: 'Pollution Control Red Consent (Zero Harmful Drain)',
        title_mr: 'प्रदूषण नियंत्रण रेड संमती (शून्य घातक सांडपाणी)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Requires online 24/7 smoke sensors connected to the government server and zero liquid discharge (ZLD) plant.',
        what_it_checks_mr: 'शासकीय सर्व्हरला जोडलेले २४ तास चालू राहणारे धूर सेन्सर्स आणि एकही थेंब विषारी पाणी बाहेर न सोडणारी प्रक्रिया यंत्रणा.',
        legal_act_en: 'Water & Air Acts (Red Category)',
        legal_act_mr: 'जल आणि वायू प्रदूषण नियंत्रण कायदा (रेड श्रेणी)',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Zero liquid discharge (ZLD) scheme & online stack sensor specs',
        key_document_mr: 'झिरो लिक्विड डिस्चार्ज प्रकल्प योजना व ऑनलाइन सेन्सर विवरण'
      },
      {
        id: 'RULE-CHEM-WORKER-PPE',
        title_en: 'Worker Chemical Suits & Health Registry',
        title_mr: 'कामगार रासायनिक सूट व वैद्यकीय नोंदवही',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures special gas masks, chemical-proof overalls, emergency eye-wash showers, and regular doctor blood tests for operators.',
        what_it_checks_mr: 'विशेष गॅस मास्क, रासायनिक सूट, डोळे धुण्याचे आणीबाणी शॉवर्स आणि दर सहा महिन्यांची डॉक्टर तपासणी.',
        legal_act_en: 'Factories Act 1948 (Section 41-C Hazardous Operations)',
        legal_act_mr: 'कारखाने कायदा १९४८ (कलम ४१-सी घातक उद्योग)',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Worker PPE equipment roster & certifying surgeon fitness log',
        key_document_mr: 'कामगार पीपीई यादी व प्रमाणित डॉक्टरांची आरोग्य नोंदवही'
      },
      {
        id: 'RULE-CHEM-FIRE-FOAM',
        title_en: 'Chemical Foam Fire Protection NOC',
        title_mr: 'रासायनिक फोम अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Verifies dedicated chemical foam cannons and water deluge systems designed specifically to put out chemical fires.',
        what_it_checks_mr: 'रासायनिक आग विझवण्यासाठी विशेष फोम तोफा आणि पाण्याचे मोठे डेल्युज वॉल्व्ह तपासले जातात.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Chemical foam supply calculation & 200KL dedicated static water tank plan',
        key_document_mr: 'फोम पुरवठा गणना आणि २ लाख लिटर अग्निशमन जलकुंभ नकाशा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 6. PHARMACEUTICALS & BIOTECH (Pharma)
  // --------------------------------------------------------------------------
  pharmaceuticals_biotech: {
    sector_id: 'pharmaceuticals_biotech',
    sector_name_en: 'Pharmaceuticals & Biotech',
    sector_name_mr: 'औषध निर्माण व बायोटेक',
    easy_summary_en: 'Medicine factories need dust-free sterile rooms (GMP), pure clean water filtration, strict waste medicine disposal, and chemical safety.',
    easy_summary_mr: 'औषध कारखान्यांसाठी जंतूमुक्त स्वच्छ खोल्या (GMP), शुद्ध पाणी गाळणी, औषधी कचरा सुरक्षित विल्हेवाट आणि रासायनिक सुरक्षा आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-PHARMA-FDA-GMP',
        title_en: 'Medicine Manufacturing License (FDA GMP Clearance)',
        title_mr: 'औषध उत्पादन परवाना (FDA GMP मंजुरी)',
        authority_en: 'Food & Drug Administration (FDA Maharashtra)',
        authority_mr: 'अन्न व औषध प्रशासन (एफडीए महाराष्ट्र)',
        department: 'industries',
        what_it_checks_en: 'Checks sterile clean rooms with air filters (HEPA) to ensure no dust or bacteria can ever touch pills or syrups.',
        what_it_checks_mr: 'औषधे किंवा गोळ्या तयार करताना धूळ किंवा जंतू येऊ नयेत म्हणून एअर फिल्टर्स असलेले निर्जंतुक कक्ष तपासले जातात.',
        legal_act_en: 'Drugs & Cosmetics Act 1940 (Schedule M GMP Standards)',
        legal_act_mr: 'औषधे आणि सौंदर्यप्रसाधने कायदा १९४० (शेड्यूल एम)',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Clean room air handling unit (AHU) validation & medicine testing lab design',
        key_document_mr: 'क्लीन रूम एअर हँडलिंग युनिट नकाशा व औषध चाचणी प्रयोगशाळा आराखडा'
      },
      {
        id: 'RULE-PHARMA-MPCB-ZLD',
        title_en: 'Sterile Waste & Water Treatment Consent (MPCB)',
        title_mr: 'औषध सांडपाणी व कचरा प्रक्रिया संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Checks multi-stage water evaporators so expired medicine or chemical washings are never poured into rivers or open grounds.',
        what_it_checks_mr: 'औषध धुण्याचे रासायनिक पाणी नद्यांमध्ये किंवा जमिनीत जाऊ नये म्हणून बाष्पीभवन (Evaporator) यंत्रणा तपासली जाते.',
        legal_act_en: 'Water Act 1974 & Hazardous Waste Rules',
        legal_act_mr: 'जल प्रदूषण नियंत्रण कायदा आणि घातक कचरा नियम',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Multiple-effect evaporator (MEE) plan & hazardous drug waste contract',
        key_document_mr: 'इव्हॅपोरेटर यंत्रणा आराखडा व कचरा विल्हेवाट करार'
      },
      {
        id: 'RULE-PHARMA-LAB-CLEAN',
        title_en: 'Worker Air Hoods & Sterile Clean Room Protocol',
        title_mr: 'कामगार एअर हूड्स व निर्जंतुक सुरक्षा नियमावली',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures powder-filling workers have dust extraction hoods and clean-room suits that prevent powder inhalation.',
        what_it_checks_mr: 'औषधांची भुकटी भरताना कामगारांच्या नाकात औषध जाऊ नये म्हणून सक्शन हूड्स आणि विशेष कपडे तपासले जातात.',
        legal_act_en: 'Factories Act 1948 (Occupational Health Rules)',
        legal_act_mr: 'कारखाने कायदा १९४८ (कामगार आरोग्य नियम)',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Dust containment engineering certificate & worker health files',
        key_document_mr: 'धूळ नियंत्रण तांत्रिक प्रमाणपत्र व कामगार आरोग्य नोंदी'
      },
      {
        id: 'RULE-PHARMA-FIRE',
        title_en: 'Pharma Solvent Storage Fire NOC',
        title_mr: 'औषध सॉल्व्हेंट साठवणूक अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks flame-proof non-sparking electrical switches in alcohol/solvent storage sheds.',
        what_it_checks_mr: 'अल्कोहोल आणि सॉल्व्हेंट साठवण्याच्या जागेत ठिणगी न पडणारे विशेष फ्लेम-प्रूफ स्विचेस तपासले जातात.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Flame-proof electrical layout & solvent godown fire sprinklers',
        key_document_mr: 'फ्लेम-प्रूफ विद्युत नकाशा व सॉल्व्हेंट गोदामातील स्प्रिंकलर सोय'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 7. TEXTILES & GARMENTS (Textiles)
  // --------------------------------------------------------------------------
  textiles_apparel: {
    sector_id: 'textiles_apparel',
    sector_name_en: 'Textiles & Garments',
    sector_name_mr: 'कापड व वस्त्रोद्योग',
    easy_summary_en: 'Textile and garment units need cotton dust suction to protect workers lungs, safe fabric dye water recycling, and high-density water sprinklers for cloth storage.',
    easy_summary_mr: 'कापड उद्योगांसाठी कापूस धूळ गाळणी यंत्रणा, कामगारांच्या फुफ्फुसांची तपासणी, रंगकामाचे पाणी पुनर्वापर आणि कापड साठवणुकीसाठी पाण्याचे स्प्रिंकलर्स आवश्यक असतात.',
    compliances: [
      {
        id: 'RULE-TEX-SUBSIDY',
        title_en: 'Textile Policy Electricity Rebate Registration',
        title_mr: 'वस्त्रोद्योग धोरण वीज दर सवलत नोंदणी',
        authority_en: 'Directorate of Textiles & Industries',
        authority_mr: 'वस्त्रोद्योग व उद्योग संचालनालय',
        department: 'industries',
        what_it_checks_en: 'Registers your spinning or garment unit for state electricity tariff discounts (₹2-3 per unit rebate) and loom subsidies.',
        what_it_checks_mr: 'माग किंवा कापड कारखान्यासाठी शासकीय वीज दरात प्रतियुनिट २ ते ३ रुपये सवलत आणि यंत्र अनुदान नोंदणी.',
        legal_act_en: 'Maharashtra Integrated Textile Policy',
        legal_act_mr: 'महाराष्ट्र एकात्मिक वस्त्रोद्योग धोरण',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Loom & stitching machinery invoice list & electricity connection meter proof',
        key_document_mr: 'माग व शिलाई यंत्र खरेदी पावत्या आणि वीज मीटर पुरावा'
      },
      {
        id: 'RULE-TEX-DYE-MPCB',
        title_en: 'Fabric Dyeing Water Treatment Consent (MPCB)',
        title_mr: 'कापड रंगकाम सांडपाणी संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Checks dye effluent filtration so colorful chemical water is treated and reused rather than dumped into rivers.',
        what_it_checks_mr: 'रंगकामाचे सांडपाणी शुद्ध करून पुन्हा वापरण्याची यंत्रणा तपासली जाते, जेणेकरून नद्यांमध्ये रंगीत पाणी जाणार नाही.',
        legal_act_en: 'Water Pollution Control Act 1974',
        legal_act_mr: 'जल प्रदूषण नियंत्रण कायदा १९७४',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Dye wastewater recycling plant (ETP) blueprint & water balance diagram',
        key_document_mr: 'रंगकाम पाणी प्रक्रिया प्रकल्प आराखडा आणि पाणी पुनर्वापर तक्ता'
      },
      {
        id: 'RULE-TEX-LUNG-SAFETY',
        title_en: 'Cotton Dust Suction & Worker Lung Checkup',
        title_mr: 'कापूस धूळ सक्शन व कामगार फुफ्फुस तपासणी',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Verifies continuous pneumatic dust suction over spinning machines to protect workers from cotton lung disease (byssinosis).',
        what_it_checks_mr: 'कापसाची धूळ कामगारांच्या फुफ्फुसात जाऊन आजार होऊ नये म्हणून धूळ शोषून घेणारी सक्शन यंत्रणा तपासली जाते.',
        legal_act_en: 'Factories Act 1948 (Third Schedule Lung Protection)',
        legal_act_mr: 'कारखाने कायदा १९४८ (कामगार फुफ्फुस सुरक्षा नियम)',
        sla_display: '8 min SLA',
        sla_minutes: 8,
        is_mandatory: true,
        key_document_en: 'Lint dust extraction airflow certificate & annual worker lung test log',
        key_document_mr: 'धूळ शोषण यंत्रणा क्षमता प्रमाणपत्र व कामगार फुफ्फुस तपासणी नोंदी'
      },
      {
        id: 'RULE-TEX-FIRE-SPRINKLER',
        title_en: 'Cotton & Cloth Godown Fire Sprinkler NOC',
        title_mr: 'कापूस व कापड गोदाम अग्निशमन स्प्रिंकलर NOC',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Requires automatic water sprinklers across every cloth storage row, as cotton catches fire very rapidly.',
        what_it_checks_mr: 'कापूस लवकर पेट घेतो, म्हणून कापड गोदामातील प्रत्येक रांगेवर स्वयंचलित पाण्याचे स्प्रिंकलर्स बसवल्याची तपासणी.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Storage rack sprinkler line diagram & fire water pump room plan',
        key_document_mr: 'स्प्रिंकलर पाईपलाईन आराखडा आणि अग्निशामक पंप रूम नकाशा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 8. LOGISTICS & WAREHOUSING (Logistics)
  // --------------------------------------------------------------------------
  warehousing_logistics: {
    sector_id: 'warehousing_logistics',
    sector_name_en: 'Logistics & Warehousing',
    sector_name_mr: 'लॉजिस्टिक्स व गोदामे',
    easy_summary_en: 'Warehouses need tall-rack sprinkler fire protection, certified forklift operators, 24/7 highway transit rights, and clean non-polluting yard management.',
    easy_summary_mr: 'मोठ्या गोदामांसाठी उंच रॅक स्प्रिंकलर यंत्रणा, परवानाधारक फोर्कलिफ्ट चालक, २४ तास मालवाहतूक परवाना आणि स्वच्छ पार्किंग व्यवस्था आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-LOG-PARK-REG',
        title_en: 'Logistics Park Registration & 24/7 Transit Clearance',
        title_mr: 'लॉजिस्टिक्स पार्क नोंदणी व २४/७ मालवाहतूक परवाना',
        authority_en: 'Directorate of Industries (Logistics Cell)',
        authority_mr: 'उद्योग संचालनालय (लॉजिस्टिक्स कक्ष)',
        department: 'industries',
        what_it_checks_en: 'Grants continuous 24-hour truck loading and unloading permissions and industrial power tariff rates for freight terminals.',
        what_it_checks_mr: '२४ तास विनाअडथळा ट्रक लोडिंग-अनलोडिंग करण्याची मुभा आणि औद्योगिक वीज दराचा लाभ दिला जातो.',
        legal_act_en: 'Maharashtra Logistics Park Policy',
        legal_act_mr: 'महाराष्ट्र लॉजिस्टिक्स धोरण',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Warehouse layout with truck bays & highway turning radius clearance',
        key_document_mr: 'ट्रक लोडिंग बे आराखडा आणि महामार्ग प्रवेश नकाशा'
      },
      {
        id: 'RULE-LOG-MPCB-GREEN',
        title_en: 'Clean Yard & Stormwater Drainage Consent (MPCB)',
        title_mr: 'स्वच्छ आवार व पावसाळी पाणी निचरा संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Verifies oil-grit separators in heavy truck parking yards to keep rainfall runoff completely clean from motor oil leaks.',
        what_it_checks_mr: 'ट्रकच्या ऑईल गळतीमुळे पावसाचे पाणी दूषित होऊ नये म्हणून ऑईल-सेपरेटर गाळणी व्यवस्था तपासली जाते.',
        legal_act_en: 'Water & Air Acts (Green Category Logistics)',
        legal_act_mr: 'जल व वायू प्रदूषण नियंत्रण कायदा (ग्रीन श्रेणी)',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Stormwater drainage map & oil-water interceptor design',
        key_document_mr: 'पावसाळी पाणी निचरा नकाशा व ऑईल-वॉटर सेपरेटर योजना'
      },
      {
        id: 'RULE-LOG-FORKLIFT-DISH',
        title_en: 'Forklift Operator Competency & Fall-Arrest Harnesses',
        title_mr: 'फोर्कलिफ्ट चालक योग्यता व उंचावरील सेप्टी बेल्ट परवाना',
        authority_en: 'Department of Labour (DISH)',
        authority_mr: 'कामगार विभाग (औद्योगिक सुरक्षा संचालनालय)',
        department: 'labour',
        what_it_checks_en: 'Ensures forklift operators hold valid driving badges, battery charging rooms are ventilated, and high-rack workers wear fall-arrest safety harnesses.',
        what_it_checks_mr: 'फोर्कलिफ्ट चालकांचे परवाने, बॅटरी चार्जिंग खोलीतील वायुवीजन आणि उंच रॅकवर काम करणाऱ्यांसाठी सेप्टी हार्नेस बेल्ट तपासले जातात.',
        legal_act_en: 'Maharashtra Factories Rules (Material Handling Safety)',
        legal_act_mr: 'महाराष्ट्र कारखाने नियम (माल हाताळणी सुरक्षा)',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Forklift driver training certificates & high-bay safety harness register',
        key_document_mr: 'फोर्कलिफ्ट चालक प्रशिक्षण प्रमाणपत्रे व सेप्टी बेल्ट नोंदवही'
      },
      {
        id: 'RULE-LOG-HIGHBAY-FIRE',
        title_en: 'High-Bay In-Rack Sprinkler Fire NOC',
        title_mr: 'उंच रॅक इन-रॅक स्प्रिंकलर अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks water pipes built directly into tall storage racks (ESFR sprinklers) and large dedicated water tanks that can spray water 12 meters high.',
        what_it_checks_mr: '१२ मीटर उंच रॅकमध्ये आग विझवण्यासाठी रॅकच्या आत बसवलेले पाण्याचे पाईप्स आणि मोठा राखीव जलकुंभ तपासला जातो.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006 (High-Hazard Storage)',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६ (गोदाम सुरक्षा नियम)',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'In-rack sprinkler pipe layout & dual diesel booster fire pump plan',
        key_document_mr: 'इन-रॅक स्प्रिंकलर नकाशा व दुहेरी डिझेल अग्निशामक पंप आराखडा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 9. HEALTHCARE & HOSPITALS (Healthcare)
  // --------------------------------------------------------------------------
  healthcare_hospitality: {
    sector_id: 'healthcare_hospitality',
    sector_name_en: 'Healthcare & Hospitals',
    sector_name_mr: 'आरोग्यसेवा व रुग्णालये',
    easy_summary_en: 'Hospitals and clinics need patient room registration, safe hospital waste disposal (red/yellow bags), patient stretcher fire ramps, and X-ray radiation safety.',
    easy_summary_mr: 'रुग्णालय व क्लिनिकसाठी रुग्णालय नोंदणी, सुया व वैद्यकीय कचरा सुरक्षित विल्हेवाट (कलर कोडेड बॅग्ज), स्ट्रेचर रॅम्प आणि एक्स-रे रेडिएशन सुरक्षा आवश्यक असते.',
    compliances: [
      {
        id: 'RULE-HEALTH-REG',
        title_en: 'Hospital & Nursing Home Registration',
        title_mr: 'रुग्णालय व नर्सिंग होम नोंदणी परवाना',
        authority_en: 'Directorate of Health Services / Municipal Health Officer',
        authority_mr: 'आरोग्य सेवा संचालनालय / मनपा मुख्य आरोग्य अधिकारी',
        department: 'industries',
        what_it_checks_en: 'Verifies adequate bed spacing, 24/7 doctor and nurse coverage, medical oxygen pipeline safety, and patient records system.',
        what_it_checks_mr: 'खाटांमधील पुरेशी जागा, २४ तास डॉक्टर-नर्स उपस्थिती, मेडिकल ऑक्सिजन पाईपलाईन सुरक्षा आणि रुग्ण नोंदींची तपासणी.',
        legal_act_en: 'Maharashtra Nursing Homes Registration Act',
        legal_act_mr: 'महाराष्ट्र नर्सिंग होम नोंदणी कायदा',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Hospital floor blueprint with bed count & doctor qualification degrees',
        key_document_mr: 'खाटांच्या संख्येसह रुग्णालय नकाशा आणि डॉक्टरांची पदवी प्रमाणपत्रे'
      },
      {
        id: 'RULE-HEALTH-BMW-MPCB',
        title_en: 'Bio-Medical Waste Management Authorization (MPCB)',
        title_mr: 'बायो-मेडिकल कचरा व्यवस्थापन परवाना (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Checks color-coded bins (Yellow, Red, Blue, White) for needles, cotton, and bandages to prevent any disease spread.',
        what_it_checks_mr: 'सुया, कापूस व पट्ट्या वेगळ्या करण्यासाठी रंगीत कचराकुंड्या (पिवळी, लाल, निळी, पांढरी) आणि अधिकृत विल्हेवाट वाहन करार तपासला जातो.',
        legal_act_en: 'Bio-Medical Waste Management Rules 2016',
        legal_act_mr: 'जैव-वैद्यकीय कचरा व्यवस्थापन नियम २०१६',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Common bio-medical waste treatment facility (CBMWTF) collection agreement',
        key_document_mr: 'अधिकृत बायोमेडिकल कचरा संकलन कंपनी करार'
      },
      {
        id: 'RULE-HEALTH-STAFF-DISH',
        title_en: 'Needle-Stick Injury Prevention & Radiation Safety',
        title_mr: 'सुई टोचणी प्रतिबंध व रेडिएशन सुरक्षा प्रमाणपत्र',
        authority_en: 'Department of Labour (DISH) & AERB',
        authority_mr: 'कामगार विभाग व अणुऊर्जा नियामक मंडळ (AERB)',
        department: 'labour',
        what_it_checks_en: 'Checks hepatitis vaccination records for nurses and lead-lined protective walls for X-ray and CT scan rooms.',
        what_it_checks_mr: 'कर्मचाऱ्यांसाठी हिपॅटायटीस लस आणि एक्स-रे/सीटी स्कॅन रूममधून रेडिएशन बाहेर पडू नये म्हणून शिसाच्या (Lead) भिंती तपासल्या जातात.',
        legal_act_en: 'Radiation Protection Rules & Occupational Health Standards',
        legal_act_mr: 'रेडिएशन सुरक्षा नियम आणि कामगार आरोग्य मानके',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'AERB X-ray room lead shielding layout & staff vaccination register',
        key_document_mr: 'एक्स-रे रूम लेड शिल्डिंग नकाशा व कर्मचारी लसीकरण नोंदवही'
      },
      {
        id: 'RULE-HEALTH-FIRE-RAMP',
        title_en: 'Hospital Fire Safety NOC & Patient Stretcher Ramp',
        title_mr: 'रुग्णालय अग्निशमन NOC व रुग्ण स्थलांतर रॅम्प',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Checks continuous gentle ramps so ICU and bed-ridden patients can be safely rolled out on stretchers during an emergency.',
        what_it_checks_mr: 'आणीबाणीच्या वेळी आयसीयू व गंभीर रुग्णांना स्ट्रेचरवरून सुरक्षित खाली आणण्यासाठी पायऱ्यांऐवजी रॅम्प तपासला जातो.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Rules (Hospital Category C)',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक नियम (रुग्णालय श्रेणी क)',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'External patient evacuation ramp blueprint & smoke compartment doors map',
        key_document_mr: 'रुग्ण स्थलांतर रॅम्प नकाशा आणि धूर प्रतिबंधक दरवाजे आराखडा'
      }
    ]
  },

  // --------------------------------------------------------------------------
  // 10. RENEWABLE ENERGY (Renewable Energy)
  // --------------------------------------------------------------------------
  renewable_energy_solar: {
    sector_id: 'renewable_energy_solar',
    sector_name_en: 'Renewable Energy & Solar',
    sector_name_mr: 'नवीकरणीय ऊर्जा व सौर प्रकल्प',
    easy_summary_en: 'Solar and green power setups need state grid synchronization approval, electrical inspector safety clearance, and rooftop safety harness lines.',
    easy_summary_mr: 'सौर व हरित ऊर्जा प्रकल्पांसाठी राज्य वीज ग्रिड जोडणी मंजुरी, विद्युत निरीक्षक सुरक्षा प्रमाणपत्र आणि छतावरील सुरक्षा बेल्ट आवश्यक असतात.',
    compliances: [
      {
        id: 'RULE-SOLAR-GRID',
        title_en: 'Grid Synchronization Approval (MSEDCL/MEDA Feasibility)',
        title_mr: 'वीज ग्रिड जोडणी मंजुरी (महावितरण / मेडा)',
        authority_en: 'Maharashtra Energy Development Agency (MEDA) & MSEDCL',
        authority_mr: 'महाराष्ट्र ऊर्जा विकास अभिकरण (मेडा) व महावितरण',
        department: 'industries',
        what_it_checks_en: 'Grants technical permission to connect your solar panels to the public electric grid without overloading neighborhood transformers.',
        what_it_checks_mr: 'स्थानिक ट्रान्सफॉर्मरवर भार न पडता वीज ग्रिडमध्ये सौर ऊर्जा सोडण्याची तांत्रिक मंजुरी दिली जाते.',
        legal_act_en: 'Maharashtra Renewable Energy Policy & Electricity Act 2003',
        legal_act_mr: 'महाराष्ट्र नवीकरणीय ऊर्जा धोरण व विद्युत कायदा २००३',
        sla_display: '5 min SLA',
        sla_minutes: 5,
        is_mandatory: true,
        key_document_en: 'Single line electrical diagram (SLD) & grid substation capacity report',
        key_document_mr: 'सिंगल लाईन विद्युत आकृती (SLD) आणि सबस्टेशन क्षमता अहवाल'
      },
      {
        id: 'RULE-SOLAR-MPCB-GREEN',
        title_en: 'Clean Green Energy Exemption / Consent (MPCB)',
        title_mr: 'स्वच्छ हरित ऊर्जा सवलत संमती (MPCB)',
        authority_en: 'Maharashtra Pollution Control Board (MPCB)',
        authority_mr: 'महाराष्ट्र प्रदूषण नियंत्रण मंडळ (MPCB)',
        department: 'mpcb',
        what_it_checks_en: 'Solar plants generate zero smoke or water pollution; receives expedited Green category consent with fast-track digital approval.',
        what_it_checks_mr: 'सौर प्रकल्पांमुळे हवा किंवा पाणी प्रदूषण होत नसल्याने जलद गतीने ग्रीन कॅटेगरी संमती दिली जाते.',
        legal_act_en: 'Water & Air Acts (Green Energy Classification)',
        legal_act_mr: 'जल व वायू प्रदूषण नियंत्रण कायदा (हरित ऊर्जा वर्गीकरण)',
        sla_display: '4 min SLA',
        sla_minutes: 4,
        is_mandatory: true,
        key_document_en: 'Solar module specification sheet & transformer dry oil report',
        key_document_mr: 'सोलर पॅनल तांत्रिक माहिती व ट्रान्सफॉर्मर सुरक्षा अहवाल'
      },
      {
        id: 'RULE-SOLAR-CEI-SAFETY',
        title_en: 'Chief Electrical Inspector (CEI) Safety Certificate',
        title_mr: 'मुख्य विद्युत निरीक्षक (CEI) सुरक्षा प्रमाणपत्र',
        authority_en: 'Chief Electrical Inspector (Industry & Power Dept)',
        authority_mr: 'मुख्य विद्युत निरीक्षक (उद्योग व ऊर्जा विभाग)',
        department: 'labour',
        what_it_checks_en: 'Inspects copper earthing rods and lightning arresters so high-voltage electric current or lightning cannot electrocute workers.',
        what_it_checks_mr: 'विजेचा झटका किंवा वीज पडण्याचा धोका टाळण्यासाठी कॉपर अर्थिंग आणि तडित् वाहक (लाइटनिंग अरेस्टर) तपासले जातात.',
        legal_act_en: 'Central Electricity Authority (Safety & Electric Supply) Regulations',
        legal_act_mr: 'केंद्रीय विद्युत प्राधिकरण सुरक्षा नियम',
        sla_display: '7 min SLA',
        sla_minutes: 7,
        is_mandatory: true,
        key_document_en: 'Earthing pit test resistance value log & lightning protection map',
        key_document_mr: 'अर्थिंग खड्डा रोधकता चाचणी अहवाल व तडित् संरक्षण नकाशा'
      },
      {
        id: 'RULE-SOLAR-INVERTER-FIRE',
        title_en: 'Inverter Station & Solar Substation Fire NOC',
        title_mr: 'इन्व्हर्टर स्टेशन व सबस्टेशन अग्निशमन ना-हरकत प्रमाणपत्र',
        authority_en: 'Maharashtra Fire & Emergency Services',
        authority_mr: 'महाराष्ट्र अग्निशमन व आणीबाणी सेवा',
        department: 'fire',
        what_it_checks_en: 'Verifies carbon dioxide (CO2) extinguishers and clear gravel boundary strips to stop grassland fires from touching high-voltage inverters.',
        what_it_checks_mr: 'विद्युत इन्व्हर्टरला आग लागू नये म्हणून CO2 सिलिंडर आणि गवताची आग रोखण्यासाठी खडीचा पट्टा तपासला जातो.',
        legal_act_en: 'Maharashtra Fire Prevention & Life Safety Act 2006',
        legal_act_mr: 'महाराष्ट्र आग प्रतिबंधक कायदा २००६',
        sla_display: '6 min SLA',
        sla_minutes: 6,
        is_mandatory: true,
        key_document_en: 'Substation gravel firebreak plan & CO2 fire equipment map',
        key_document_mr: 'फायरब्रेक खडी पट्टा नकाशा व CO2 अग्निशामक सोय'
      }
    ]
  }
};

/**
 * Helper to get the specific legal compliance checklist for any sector
 */
export function getSectorLegalChecklist(sectorId: string): SectorLegalChecklist {
  const normalized = (sectorId || 'manufacturing_engineering') as SectorId;
  return SECTOR_LEGAL_CHECKLISTS[normalized] || SECTOR_LEGAL_CHECKLISTS.manufacturing_engineering;
}

/**
 * Converts the SectorLegalComplianceItem[] into full ApprovalRule[] objects
 * for use in Step 2, Step 4, and backend endpoints.
 */
export function getSectorApprovalRules(sectorId: string): ApprovalRule[] {
  const checklist = getSectorLegalChecklist(sectorId);
  return checklist.compliances.map((item) => ({
    rule_id: item.id,
    department: item.department,
    department_name_en: item.authority_en,
    department_name_mr: item.authority_mr,
    approval_name_en: item.title_en,
    approval_name_mr: item.title_mr,
    legal_act_en: item.legal_act_en,
    legal_act_mr: item.legal_act_mr,
    reason_en: item.what_it_checks_en,
    reason_mr: item.what_it_checks_mr,
    business_sectors: [sectorId, checklist.sector_name_en],
    required_documents: [
      {
        type: 'sector_compliance_doc',
        name_en: item.key_document_en,
        name_mr: item.key_document_mr,
        required: item.is_mandatory,
        description_en: item.what_it_checks_en,
        description_mr: item.what_it_checks_mr
      }
    ],
    sla_minutes: item.sla_minutes
  }));
}
